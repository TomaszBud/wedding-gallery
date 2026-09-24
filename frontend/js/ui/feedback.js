import { AuthenticationRequiredError } from "../api/auth.js";

export function createFeedback(elements) {
    let toastTimer = null;

    function showAccessRequired() {
        elements.appContent.hidden = true;
        elements.openUploadButton.hidden = true;
        elements.accessRequired.hidden = false;
        if (elements.uploadDialog.open) elements.uploadDialog.close();
        if (elements.lightbox.open) elements.lightbox.close();
    }

    function handleAuthenticationError(error) {
        if (!(error instanceof AuthenticationRequiredError)) return false;
        showAccessRequired();
        return true;
    }

    function showToast(message) {
        window.clearTimeout(toastTimer);
        elements.toast.textContent = message;
        elements.toast.hidden = false;
        toastTimer = window.setTimeout(() => {
            elements.toast.hidden = true;
        }, 4200);
    }

    return { handleAuthenticationError, showToast };
}
