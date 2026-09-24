import { requestUpload, uploadToS3 } from "../api/photos.js";
import {
    formatFileSize, formatPhotoCount, translate
} from "../i18n.js";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
    "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"
]);
const INFERRED_TYPES = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", heic: "image/heic", heif: "image/heif"
};

function normaliseFileType(file) {
    if (ACCEPTED_TYPES.has(file.type)) return file;
    const extension = file.name.split(".").pop()?.toLowerCase();
    const inferredType = INFERRED_TYPES[extension];
    return inferredType
        ? new File([file], file.name, {
            type: inferredType,
            lastModified: file.lastModified
        })
        : file;
}

export function createUpload(elements, {
    loadPhotos, handleAuthenticationError, showToast
}) {
    let selectedFiles = [];
    let isUploading = false;
    let previewUrl = null;

    function clearPreviewUrl() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    function renderSelection() {
        clearPreviewUrl();
        const firstFile = selectedFiles[0];
        elements.selectedPhoto.hidden = !firstFile;
        elements.uploadButton.disabled = isUploading || !firstFile;

        if (!firstFile) {
            elements.selectedPhotoPreview.removeAttribute("src");
            return;
        }

        elements.selectedPhotoName.textContent =
            selectedFiles.length === 1
                ? firstFile.name
                : formatPhotoCount(selectedFiles.length);
        elements.selectedPhotoSize.textContent = formatFileSize(
            selectedFiles.reduce((sum, file) => sum + file.size, 0)
        );

        previewUrl = URL.createObjectURL(firstFile);
        elements.selectedPhotoPreview.hidden = false;
        elements.previewFallback.hidden = true;
        elements.selectedPhotoPreview.src = previewUrl;
        elements.selectedPhotoPreview.alt = firstFile.name;
        elements.selectedPhotoPreview.onerror = () => {
            elements.selectedPhotoPreview.hidden = true;
            elements.previewFallback.hidden = false;
        };
    }

    function clearSelection() {
        selectedFiles = [];
        elements.cameraInput.value = "";
        elements.photoInput.value = "";
        renderSelection();
    }

    function setStatus(message, progress, variant = "") {
        elements.uploadProgress.hidden = false;
        elements.uploadProgressBar.style.width =
            Math.max(0, Math.min(100, progress)) + "%";
        elements.status.textContent = message;
        elements.status.className = variant ? "is-" + variant : "";
    }

    function resetStatus() {
        elements.uploadProgress.hidden = true;
        elements.uploadProgressBar.style.width = "0%";
        elements.status.textContent = "";
        elements.status.className = "";
    }

    function setBusy(busy) {
        isUploading = busy;
        elements.uploadButton.disabled = busy || !selectedFiles.length;
        elements.removePhotoButton.disabled = busy;
        elements.cameraButton.disabled = busy;
        elements.libraryButton.disabled = busy;
        elements.closeUploadButton.disabled = busy;
        elements.authorInput.disabled = busy;
    }

    function handleSelection(event) {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        if (!files.length) return;

        const normalised = files.map(normaliseFileType);
        const unsupported = normalised.some(
            file => !ACCEPTED_TYPES.has(file.type)
        );
        const oversized = normalised.some(
            file => file.size > MAX_FILE_SIZE
        );
        if (unsupported || oversized) {
            setStatus(
                translate(unsupported ? "unsupportedType" : "fileTooLarge"),
                0,
                "error"
            );
            return;
        }

        selectedFiles = normalised;
        renderSelection();
        resetStatus();
    }

    async function handleUpload(event) {
        event.preventDefault();
        if (isUploading) return;
        if (!selectedFiles.length) {
            setStatus(translate("chooseFirst"), 0, "error");
            return;
        }

        const total = selectedFiles.length;
        let uploaded = 0;
        const authorName = elements.authorInput.value.trim();
        localStorage.setItem("weddingGalleryAuthorName", authorName);
        setBusy(true);

        try {
            // The current API signs one S3 POST per photo.
            for (const file of [...selectedFiles]) {
                setStatus(
                    translate("preparingUpload"),
                    Math.round((uploaded + 0.1) / total * 100)
                );
                const uploadData = await requestUpload(file, authorName);
                setStatus(
                    translate("uploadingPhotoProgress", {
                        current: uploaded + 1, total
                    }),
                    Math.round((uploaded + 0.3) / total * 100)
                );
                await uploadToS3(file, uploadData.upload);

                // A retry should only include photos not yet accepted by S3.
                selectedFiles.shift();
                uploaded++;
                renderSelection();
                setStatus(
                    translate("uploadingPhotoProgress", {
                        current: uploaded, total
                    }),
                    Math.round(uploaded / total * 100)
                );
            }

            await new Promise(resolve => window.setTimeout(resolve, 2000));
            setStatus(translate("processingPhoto"), 100, "success");
            showToast(translate(
                total === 1 ? "uploadToast" : "uploadToastMany",
                { count: total }
            ));
            clearSelection();
            window.setTimeout(() => void loadPhotos(), 2500);
            window.setTimeout(() => void loadPhotos(), 6000);
            window.setTimeout(() => elements.uploadDialog.close(), 900);
        } catch (error) {
            console.error(error);
            if (!handleAuthenticationError(error)) {
                setStatus(
                    translate("uploadPartialFailure", {
                        uploaded, total,
                        name: selectedFiles[0]?.name || ""
                    }),
                    Math.round(uploaded / total * 100),
                    "error"
                );
            }
            if (uploaded) void loadPhotos();
        } finally {
            setBusy(false);
        }
    }

    function bind() {
        elements.openUploadButton.addEventListener("click", () => {
            if (!elements.uploadDialog.open) {
                elements.uploadDialog.showModal();
                document.body.classList.add("has-dialog");
            }
        });
        elements.closeUploadButton.addEventListener(
            "click", () => elements.uploadDialog.close()
        );
        elements.cameraButton.addEventListener(
            "click", () => elements.cameraInput.click()
        );
        elements.libraryButton.addEventListener(
            "click", () => elements.photoInput.click()
        );
        elements.cameraInput.addEventListener("change", handleSelection);
        elements.photoInput.addEventListener("change", handleSelection);
        elements.removePhotoButton.addEventListener("click", clearSelection);
        elements.uploadForm.addEventListener("submit", handleUpload);
        elements.uploadDialog.addEventListener("cancel", event => {
            if (isUploading) event.preventDefault();
        });
    }

    return { bind, isBusy: () => isUploading };
}
