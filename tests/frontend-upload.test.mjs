import assert from "node:assert/strict";
import { test } from "node:test";

const events = new Map();
function element(id) {
    return {
        id, disabled: false, hidden: false, value: "", textContent: "",
        style: {}, className: "",
        addEventListener(type, listener) { events.set(`${id}:${type}`, listener); },
        removeAttribute() {}, close() {}, showModal() {},
        click() {}
    };
}

test("batch upload resumes with unsent photos after an S3 failure", async () => {
    globalThis.window = {
        setTimeout(callback) { callback(); return 1; },
        clearTimeout() {}
    };
    globalThis.URL.createObjectURL = file => file.name;
    globalThis.URL.revokeObjectURL = () => {};
    const stored = new Map([
        ["weddingGalleryAccessToken", "test-token"],
        ["weddingGalleryAccessTokenExpiry", String(Math.floor(Date.now() / 1000) + 60)]
    ]);
    globalThis.sessionStorage = {
        getItem: key => stored.get(key) ?? null,
        setItem: (key, value) => stored.set(key, value),
        removeItem: key => stored.delete(key)
    };
    globalThis.localStorage = { setItem() {} };
    globalThis.FormData = class { append() {} };

    const signed = [];
    let s3Requests = 0;
    globalThis.fetch = async (url, options) => {
        if (String(url).endsWith("/uploads")) {
            signed.push(JSON.parse(options.body).originalFilename);
            return {
                ok: true,
                json: async () => ({ upload: { url: "https://s3.example/upload", fields: {} } })
            };
        }
        s3Requests++;
        return { ok: s3Requests !== 2, status: s3Requests === 2 ? 503 : 204 };
    };

    const ids = [
        "selectedPhoto", "uploadButton", "selectedPhotoPreview",
        "selectedPhotoName", "selectedPhotoSize", "previewFallback",
        "cameraInput", "photoInput", "uploadProgress", "uploadProgressBar",
        "status", "removePhotoButton", "cameraButton", "libraryButton",
        "closeUploadButton", "authorInput", "uploadDialog",
        "openUploadButton", "uploadForm"
    ];
    const elements = Object.fromEntries(ids.map(id => [id, element(id)]));
    elements.authorInput.value = "Kasia";
    const toasts = [];
    const { createUpload } = await import("../frontend/js/ui/upload.js");
    const upload = createUpload(elements, {
        loadPhotos: async () => {},
        handleAuthenticationError: () => false,
        showToast: message => toasts.push(message)
    });
    upload.bind();

    const files = ["one.jpg", "two.jpg", "three.jpg"].map(name => ({
        name, type: "image/jpeg", size: 1024
    }));
    const selection = { target: { files, value: "chosen" } };
    events.get("photoInput:change")(selection);
    assert.equal(selection.target.value, "");
    assert.equal(elements.uploadButton.disabled, false);

    const originalError = console.error;
    console.error = () => {}; // The first S3 failure is intentional.
    try {
        await events.get("uploadForm:submit")({ preventDefault() {} });
    } finally {
        console.error = originalError;
    }
    assert.deepEqual(signed, ["one.jpg", "two.jpg"]);
    assert.match(elements.status.textContent, /1.*3/);
    assert.match(elements.selectedPhotoName.textContent, /2/);

    await events.get("uploadForm:submit")({ preventDefault() {} });
    assert.deepEqual(
        signed,
        ["one.jpg", "two.jpg", "two.jpg", "three.jpg"]
    );
    assert.equal(elements.selectedPhoto.hidden, true);
    assert.equal(toasts.length, 1);
});
