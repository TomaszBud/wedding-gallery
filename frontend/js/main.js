import { initAuth } from "./api/auth.js";
import { getElements } from "./dom.js";
import { applyTranslations, setLocale, translate } from "./i18n.js";
import { createFeedback } from "./ui/feedback.js";
import { createGallery } from "./ui/gallery.js";
import { createUpload } from "./ui/upload.js";

async function loadDialogs() {
    const files = ["upload-dialog.html", "lightbox.html"];
    const markup = await Promise.all(files.map(async file => {
        const response = await fetch(
            new URL(`../partials/${file}`, import.meta.url)
        );
        if (!response.ok) throw new Error(`Cannot load ${file}`);
        return response.text();
    }));
    document.getElementById("dialogMount").insertAdjacentHTML(
        "beforeend", markup.join("\n")
    );
}

function bindDialogs(elements, upload) {
    const updateBody = () => {
        document.body.classList.toggle(
            "has-dialog",
            elements.uploadDialog.open || elements.lightbox.open
        );
    };
    elements.uploadDialog.addEventListener("close", updateBody);
    elements.lightbox.addEventListener("close", updateBody);
    elements.closeLightboxButton.addEventListener(
        "click", () => elements.lightbox.close()
    );

    for (const dialog of [elements.uploadDialog, elements.lightbox]) {
        dialog.addEventListener("click", event => {
            if (event.target === dialog &&
                !(dialog === elements.uploadDialog && upload.isBusy())) {
                dialog.close();
            }
        });
    }
}

async function start() {
    try {
        await loadDialogs();
        const elements = getElements();
        applyTranslations(elements.languageSelect);
        elements.languageSelect.addEventListener("change", event => {
            setLocale(event.target.value);
        });

        const feedback = createFeedback(elements);
        const gallery = createGallery(elements, feedback);
        const upload = createUpload(elements, {
            ...feedback,
            loadPhotos: gallery.loadPhotos
        });
        upload.bind();
        bindDialogs(elements, upload);

        elements.refreshButton.addEventListener(
            "click", () => void gallery.loadPhotos()
        );
        document.addEventListener("visibilitychange", () => {
            const tenMinutes = 10 * 60 * 1000;
            if (!document.hidden &&
                Date.now() - gallery.getLastLoad() > tenMinutes) {
                void gallery.loadPhotos();
            }
        });

        try {
            await initAuth();
            elements.authorInput.value =
                localStorage.getItem("weddingGalleryAuthorName") || "";
            elements.openUploadButton.disabled = false;
            await gallery.loadPhotos();
        } catch (error) {
            if (!feedback.handleAuthenticationError(error)) {
                console.error(error);
                elements.galleryStatus.textContent = translate("galleryError");
            }
        }
    } catch (error) {
        console.error(error);
        document.getElementById("galleryStatus").textContent =
            translate("galleryError");
    }
}

void start();
