// One place for the IDs used by the UI modules.
const ids = [
    "appContent", "accessRequired", "languageBadge",
    "gallery", "galleryStatus", "refreshButton", "openUploadButton",
    "uploadDialog", "closeUploadButton", "uploadForm", "authorInput",
    "cameraButton", "libraryButton", "cameraInput", "photoInput",
    "selectedPhoto", "selectedPhotoPreview", "previewFallback",
    "selectedPhotoName", "selectedPhotoSize", "removePhotoButton",
    "uploadButton", "uploadProgress", "uploadProgressBar", "status",
    "lightbox", "lightboxImage", "lightboxMeta",
    "downloadPhotoButton", "closeLightboxButton", "toast"
];

export function getElements() {
    return Object.fromEntries(ids.map(id => {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Missing element #${id}`);
        return [id, element];
    }));
}
