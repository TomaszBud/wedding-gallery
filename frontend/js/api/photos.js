import { apiFetch } from "./auth.js";

export async function listPhotos() {
    const response = await apiFetch("/photos");
    if (!response.ok) {
        throw new Error(`Gallery request failed with ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data.photos) ? data.photos : [];
}

export async function requestUpload(file, authorName) {
    const response = await apiFetch("/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contentType: file.type,
            fileSize: file.size,
            originalFilename: file.name,
            authorName
        })
    });

    if (!response.ok) {
        throw new Error(`Upload request failed with ${response.status}`);
    }
    return response.json();
}

export async function uploadToS3(file, upload) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(upload.fields)) {
        formData.append(key, value);
    }
    formData.append("file", file);

    // A presigned S3 POST must not include the API bearer token.
    const response = await fetch(upload.url, {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
        throw new Error(`S3 upload failed with ${response.status}`);
    }
}
