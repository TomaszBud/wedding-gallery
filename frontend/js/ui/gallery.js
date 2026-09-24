import { listPhotos } from "../api/photos.js";
import {
    formatDate, formatPhotoCount, translate
} from "../i18n.js";

export function createGallery(elements, { handleAuthenticationError }) {
    let lastLoad = 0;

    function openLightbox(photo) {
        elements.lightboxImage.src = photo.displayUrl;
        elements.lightboxImage.alt = photo.authorName
            ? translate("photoBy", { name: photo.authorName })
            : translate("weddingPhoto");
        elements.downloadPhotoButton.href =
            photo.originalUrl || photo.displayUrl;
        elements.lightboxMeta.textContent = "";

        const author = document.createElement("strong");
        author.textContent = photo.authorName || translate("anonymous");
        elements.lightboxMeta.appendChild(author);

        const uploadedAt = formatDate(photo.uploadedAt);
        if (uploadedAt) {
            const date = document.createElement("span");
            date.textContent = uploadedAt;
            elements.lightboxMeta.appendChild(date);
        }

        elements.lightbox.showModal();
        document.body.classList.add("has-dialog");
    }

    function renderPhotos(photos) {
        elements.gallery.replaceChildren();

        if (!photos.length) {
            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v14H4V5Zm0 10 4.5-4.5 3.5 3.5 2-2 6 6"/>
            </svg>`;
            const copy = document.createElement("div");
            copy.textContent = translate("emptyGallery");
            empty.appendChild(copy);
            elements.gallery.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        photos.forEach((photo, index) => {
            const article = document.createElement("article");
            article.className = "photo-card";

            const button = document.createElement("button");
            button.className = "photo-card__button";
            button.type = "button";
            const description = photo.authorName
                ? translate("photoBy", { name: photo.authorName })
                : translate("weddingPhoto");
            button.setAttribute("aria-label", description);

            const image = document.createElement("img");
            image.src = photo.thumbnailUrl;
            image.alt = description;
            image.loading = index < 4 ? "eager" : "lazy";
            image.decoding = "async";
            if (photo.width && photo.height) {
                const width = Math.max(1, Number(photo.width));
                const height = Math.max(1, Number(photo.height));
                image.style.setProperty("--photo-ratio", `${width} / ${height}`);
            }

            const author = document.createElement("span");
            author.className = "photo-card__author";
            author.textContent = photo.authorName || translate("anonymous");

            button.append(image, author);
            button.addEventListener("click", () => openLightbox(photo));
            article.appendChild(button);
            fragment.appendChild(article);
        });
        elements.gallery.appendChild(fragment);
    }

    async function loadPhotos() {
        elements.refreshButton.disabled = true;
        elements.refreshButton.classList.add("is-loading");
        elements.gallery.setAttribute("aria-busy", "true");
        elements.galleryStatus.textContent = translate("loadingPhotos");

        try {
            const photos = await listPhotos();
            renderPhotos(photos);
            elements.galleryStatus.textContent =
                formatPhotoCount(photos.length);
            lastLoad = Date.now();
        } catch (error) {
            console.error(error);
            if (!handleAuthenticationError(error)) {
                elements.gallery.replaceChildren();
                elements.galleryStatus.textContent = translate("galleryError");
            }
        } finally {
            elements.gallery.setAttribute("aria-busy", "false");
            elements.refreshButton.disabled = false;
            elements.refreshButton.classList.remove("is-loading");
        }
    }

    return { loadPhotos, getLastLoad: () => lastLoad };
}
