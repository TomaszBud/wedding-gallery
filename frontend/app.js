const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ACCEPTED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif"
]);

const translations = {
    pl: {
        pageTitle: "galeria weselna",
        weddingGallery: "Galeria weselna",
        heroLead: "Zachowajmy ten dzień z każdej perspektywy.",
        landscapeLabel: "Góry i las",
        sharedMoments: "Wspólne chwile",
        photos: "Zdjęcia",
        refreshGallery: "Odśwież galerię",
        loadingPhotos: "Ładuję zdjęcia…",
        photoOne: "{count} zdjęcie",
        photoFew: "{count} zdjęcia",
        photoMany: "{count} zdjęć",
        galleryError:
            "Nie udało się pobrać galerii. Spróbuj ponownie.",
        emptyGallery:
            "Tu pojawią się pierwsze wspólne chwile.",
        privateGallery: "Prywatna galeria",
        scanQrTitle: "Zeskanuj kod QR",
        scanQrBody:
            "Dostęp do galerii otrzymasz z zaproszenia dostępnego na weselu.",
        addPhoto: "Dodaj zdjęcie",
        fromYourPerspective: "Z Twojej perspektywy",
        addToGallery: "Dodaj do galerii",
        close: "Zamknij",
        yourName: "Twoje imię",
        namePlaceholder: "np. Kasia",
        choosePhoto: "Wybierz zdjęcie",
        takePhoto: "Zrób zdjęcie",
        chooseFromLibrary: "Wybierz z galerii",
        removePhoto: "Usuń zdjęcie",
        sendPhoto: "Wyślij zdjęcie",
        fileHint:
            "JPG, PNG, WebP lub HEIC · maks. 20 MB",
        chooseFirst:
            "Najpierw wybierz zdjęcie.",
        fileTooLarge:
            "To zdjęcie jest za duże. Maksymalny rozmiar to 20 MB.",
        unsupportedType:
            "Ten format zdjęcia nie jest obsługiwany.",
        preparingUpload:
            "Przygotowuję przesył…",
        uploadingPhoto:
            "Wysyłam zdjęcie…",
        processingPhoto:
            "Gotowe — zdjęcie jest przetwarzane.",
        uploadFailed:
            "Nie udało się wysłać zdjęcia. Spróbuj ponownie.",
        uploadToast:
            "Zdjęcie wysłane! Za chwilę pojawi się w galerii.",
        anonymous: "Gość weselny",
        photoBy:
            "Zdjęcie dodane przez {name}",
        weddingPhoto:
            "Zdjęcie z wesela Dawida i Macieja",
        downloadOriginal:
            "Pobierz oryginał"
    },

    en: {
        pageTitle: "wedding gallery",
        weddingGallery: "Wedding gallery",
        heroLead:
            "Let’s remember this day from every perspective.",
        landscapeLabel:
            "Mountains and forest",
        sharedMoments:
            "Shared moments",
        photos: "Photos",
        refreshGallery:
            "Refresh gallery",
        loadingPhotos:
            "Loading photos…",
        photoOne:
            "{count} photo",
        photoFew:
            "{count} photos",
        photoMany:
            "{count} photos",
        galleryError:
            "We couldn’t load the gallery. Please try again.",
        emptyGallery:
            "The first shared moments will appear here.",
        privateGallery:
            "Private gallery",
        scanQrTitle:
            "Scan the QR code",
        scanQrBody:
            "Use the invitation available at the wedding to open the gallery.",
        addPhoto:
            "Add a photo",
        fromYourPerspective:
            "From your perspective",
        addToGallery:
            "Add to the gallery",
        close: "Close",
        yourName: "Your name",
        namePlaceholder:
            "e.g. Alex",
        choosePhoto:
            "Choose a photo",
        takePhoto:
            "Take a photo",
        chooseFromLibrary:
            "Choose from library",
        removePhoto:
            "Remove photo",
        sendPhoto:
            "Send photo",
        fileHint:
            "JPG, PNG, WebP or HEIC · max. 20 MB",
        chooseFirst:
            "Choose a photo first.",
        fileTooLarge:
            "This photo is too large. The maximum size is 20 MB.",
        unsupportedType:
            "This photo format isn’t supported.",
        preparingUpload:
            "Preparing upload…",
        uploadingPhoto:
            "Uploading photo…",
        processingPhoto:
            "Done — your photo is being processed.",
        uploadFailed:
            "We couldn’t upload the photo. Please try again.",
        uploadToast:
            "Photo sent! It will appear in the gallery shortly.",
        anonymous:
            "Wedding guest",
        photoBy:
            "Photo added by {name}",
        weddingPhoto:
            "Photo from Dawid and Maciej’s wedding",
        downloadOriginal:
            "Download original"
    },

    de: {
        pageTitle: "Hochzeitsgalerie",
        weddingGallery: "Hochzeitsgalerie",
        heroLead:
            "Halten wir diesen Tag aus jeder Perspektive fest.",
        landscapeLabel:
            "Berge und Wald",
        sharedMoments:
            "Gemeinsame Momente",
        photos: "Fotos",
        refreshGallery:
            "Galerie aktualisieren",
        loadingPhotos:
            "Fotos werden geladen…",
        photoOne:
            "{count} Foto",
        photoFew:
            "{count} Fotos",
        photoMany:
            "{count} Fotos",
        galleryError:
            "Die Galerie konnte nicht geladen werden. Bitte versuche es erneut.",
        emptyGallery:
            "Hier erscheinen bald die ersten gemeinsamen Momente.",
        privateGallery:
            "Private Galerie",
        scanQrTitle:
            "QR-Code scannen",
        scanQrBody:
            "Öffne die Galerie mit der Einladung, die du bei der Hochzeit findest.",
        addPhoto:
            "Foto hinzufügen",
        fromYourPerspective:
            "Aus deiner Perspektive",
        addToGallery:
            "Zur Galerie hinzufügen",
        close: "Schließen",
        yourName: "Dein Name",
        namePlaceholder:
            "z. B. Anna",
        choosePhoto:
            "Foto auswählen",
        takePhoto:
            "Foto aufnehmen",
        chooseFromLibrary:
            "Aus Galerie wählen",
        removePhoto:
            "Foto entfernen",
        sendPhoto:
            "Foto senden",
        fileHint:
            "JPG, PNG, WebP oder HEIC · max. 20 MB",
        chooseFirst:
            "Wähle zuerst ein Foto aus.",
        fileTooLarge:
            "Dieses Foto ist zu groß. Maximal sind 20 MB erlaubt.",
        unsupportedType:
            "Dieses Fotoformat wird nicht unterstützt.",
        preparingUpload:
            "Upload wird vorbereitet…",
        uploadingPhoto:
            "Foto wird hochgeladen…",
        processingPhoto:
            "Fertig — dein Foto wird verarbeitet.",
        uploadFailed:
            "Das Foto konnte nicht hochgeladen werden. Bitte versuche es erneut.",
        uploadToast:
            "Foto gesendet! Es erscheint gleich in der Galerie.",
        anonymous:
            "Hochzeitsgast",
        photoBy:
            "Foto von {name}",
        weddingPhoto:
            "Foto von Dawids und Maciejs Hochzeit",
        downloadOriginal:
            "Original herunterladen"
    },

    fr: {
        pageTitle:
            "galerie de mariage",
        weddingGallery:
            "Galerie de mariage",
        heroLead:
            "Gardons un souvenir de cette journée sous tous les angles.",
        landscapeLabel:
            "Montagnes et forêt",
        sharedMoments:
            "Moments partagés",
        photos: "Photos",
        refreshGallery:
            "Actualiser la galerie",
        loadingPhotos:
            "Chargement des photos…",
        photoOne:
            "{count} photo",
        photoFew:
            "{count} photos",
        photoMany:
            "{count} photos",
        galleryError:
            "Impossible de charger la galerie. Réessayez.",
        emptyGallery:
            "Les premiers moments partagés apparaîtront ici.",
        privateGallery:
            "Galerie privée",
        scanQrTitle:
            "Scannez le code QR",
        scanQrBody:
            "Utilisez l’invitation disponible au mariage pour ouvrir la galerie.",
        addPhoto:
            "Ajouter une photo",
        fromYourPerspective:
            "De votre point de vue",
        addToGallery:
            "Ajouter à la galerie",
        close: "Fermer",
        yourName:
            "Votre prénom",
        namePlaceholder:
            "p. ex. Camille",
        choosePhoto:
            "Choisissez une photo",
        takePhoto:
            "Prendre une photo",
        chooseFromLibrary:
            "Choisir dans la galerie",
        removePhoto:
            "Supprimer la photo",
        sendPhoto:
            "Envoyer la photo",
        fileHint:
            "JPG, PNG, WebP ou HEIC · max. 20 Mo",
        chooseFirst:
            "Choisissez d’abord une photo.",
        fileTooLarge:
            "Cette photo est trop volumineuse. La taille maximale est de 20 Mo.",
        unsupportedType:
            "Ce format de photo n’est pas pris en charge.",
        preparingUpload:
            "Préparation de l’envoi…",
        uploadingPhoto:
            "Envoi de la photo…",
        processingPhoto:
            "C’est fait — votre photo est en cours de traitement.",
        uploadFailed:
            "Impossible d’envoyer la photo. Réessayez.",
        uploadToast:
            "Photo envoyée ! Elle apparaîtra bientôt dans la galerie.",
        anonymous:
            "Invité·e",
        photoBy:
            "Photo ajoutée par {name}",
        weddingPhoto:
            "Photo du mariage de Dawid et Maciej",
        downloadOriginal:
            "Télécharger l’original"
    },

    it: {
        pageTitle:
            "galleria del matrimonio",
        weddingGallery:
            "Galleria del matrimonio",
        heroLead:
            "Ricordiamo questa giornata da ogni prospettiva.",
        landscapeLabel:
            "Montagne e bosco",
        sharedMoments:
            "Momenti insieme",
        photos: "Foto",
        refreshGallery:
            "Aggiorna la galleria",
        loadingPhotos:
            "Caricamento delle foto…",
        photoOne:
            "{count} foto",
        photoFew:
            "{count} foto",
        photoMany:
            "{count} foto",
        galleryError:
            "Non è stato possibile caricare la galleria. Riprova.",
        emptyGallery:
            "I primi momenti insieme appariranno qui.",
        privateGallery:
            "Galleria privata",
        scanQrTitle:
            "Scansiona il codice QR",
        scanQrBody:
            "Usa l’invito disponibile al matrimonio per aprire la galleria.",
        addPhoto:
            "Aggiungi una foto",
        fromYourPerspective:
            "Dal tuo punto di vista",
        addToGallery:
            "Aggiungi alla galleria",
        close: "Chiudi",
        yourName:
            "Il tuo nome",
        namePlaceholder:
            "es. Giulia",
        choosePhoto:
            "Scegli una foto",
        takePhoto:
            "Scatta una foto",
        chooseFromLibrary:
            "Scegli dalla galleria",
        removePhoto:
            "Rimuovi foto",
        sendPhoto:
            "Invia foto",
        fileHint:
            "JPG, PNG, WebP o HEIC · max. 20 MB",
        chooseFirst:
            "Prima scegli una foto.",
        fileTooLarge:
            "Questa foto è troppo grande. La dimensione massima è 20 MB.",
        unsupportedType:
            "Questo formato non è supportato.",
        preparingUpload:
            "Preparazione dell’invio…",
        uploadingPhoto:
            "Invio della foto…",
        processingPhoto:
            "Fatto — la foto è in elaborazione.",
        uploadFailed:
            "Non è stato possibile inviare la foto. Riprova.",
        uploadToast:
            "Foto inviata! Apparirà a breve nella galleria.",
        anonymous:
            "Ospite",
        photoBy:
            "Foto aggiunta da {name}",
        weddingPhoto:
            "Foto del matrimonio di Dawid e Maciej",
        downloadOriginal:
            "Scarica l’originale"
    }
};

const locale = detectLocale();
const messages = translations[locale];

const pluralFormatter =
    new Intl.PluralRules(locale);

const dateFormatter =
    new Intl.DateTimeFormat(
        locale,
        {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

const elements = {
    appContent:
        document.getElementById("appContent"),

    accessRequired:
        document.getElementById("accessRequired"),

    languageBadge:
        document.getElementById("languageBadge"),

    gallery:
        document.getElementById("gallery"),

    galleryStatus:
        document.getElementById("galleryStatus"),

    refreshButton:
        document.getElementById("refreshButton"),

    openUploadButton:
        document.getElementById("openUploadButton"),

    uploadDialog:
        document.getElementById("uploadDialog"),

    closeUploadButton:
        document.getElementById("closeUploadButton"),

    uploadForm:
        document.getElementById("uploadForm"),

    authorInput:
        document.getElementById("authorInput"),

    cameraButton:
        document.getElementById("cameraButton"),

    libraryButton:
        document.getElementById("libraryButton"),

    cameraInput:
        document.getElementById("cameraInput"),

    photoInput:
        document.getElementById("photoInput"),

    selectedPhoto:
        document.getElementById("selectedPhoto"),

    selectedPhotoPreview:
        document.getElementById("selectedPhotoPreview"),

    previewFallback:
        document.getElementById("previewFallback"),

    selectedPhotoName:
        document.getElementById("selectedPhotoName"),

    selectedPhotoSize:
        document.getElementById("selectedPhotoSize"),

    removePhotoButton:
        document.getElementById("removePhotoButton"),

    uploadButton:
        document.getElementById("uploadButton"),

    uploadProgress:
        document.getElementById("uploadProgress"),

    uploadProgressBar:
        document.getElementById("uploadProgressBar"),

    status:
        document.getElementById("status"),

    lightbox:
        document.getElementById("lightbox"),

    lightboxImage:
        document.getElementById("lightboxImage"),

    lightboxMeta:
        document.getElementById("lightboxMeta"),

    downloadPhotoButton:
        document.getElementById("downloadPhotoButton"),

    closeLightboxButton:
        document.getElementById("closeLightboxButton"),

    toast:
        document.getElementById("toast")
};

let selectedFile = null;
let previewUrl = null;
let toastTimer = null;
let lastGalleryLoad = 0;

applyTranslations();
bindEvents();
void initialise();

function detectLocale() {
    const preferred =
        navigator.languages &&
        navigator.languages.length
            ? navigator.languages
            : [
                navigator.language ||
                "en"
            ];

    for (const language of preferred) {
        const base =
            language
                .toLowerCase()
                .split("-")[0];

        if (translations[base]) {
            return base;
        }
    }

    return "en";
}

function translate(
    key,
    variables = {}
) {
    const value =
        messages[key] ||
        translations.en[key] ||
        key;

    return value.replace(
        /\{(\w+)\}/g,
        (_, name) =>
            String(
                variables[name] ?? ""
            )
    );
}

function formatPhotoCount(count) {
    const category =
        pluralFormatter.select(count);

    const key =
        category === "one"
            ? "photoOne"
            : category === "few"
                ? "photoFew"
                : "photoMany";

    return translate(
        key,
        { count }
    );
}

function applyTranslations() {
    document.documentElement.lang =
        locale;

    document.title =
        "Dawid & Maciej — " +
        translate("pageTitle");

    elements.languageBadge.textContent =
        locale.toUpperCase();

    try {
        const displayNames =
            new Intl.DisplayNames(
                [locale],
                {
                    type: "language"
                }
            );

        elements.languageBadge.setAttribute(
            "aria-label",
            displayNames.of(locale)
        );
    } catch {
        elements.languageBadge.setAttribute(
            "aria-label",
            locale.toUpperCase()
        );
    }

    document
        .querySelectorAll("[data-i18n]")
        .forEach((node) => {
            node.textContent =
                translate(
                    node.dataset.i18n
                );
        });

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach((node) => {
            node.placeholder =
                translate(
                    node.dataset
                        .i18nPlaceholder
                );
        });

    document
        .querySelectorAll(
            "[data-i18n-aria-label]"
        )
        .forEach((node) => {
            node.setAttribute(
                "aria-label",
                translate(
                    node.dataset
                        .i18nAriaLabel
                )
            );
        });
}

function bindEvents() {
    elements.refreshButton.addEventListener(
        "click",
        () => void loadPhotos()
    );

    elements.openUploadButton.addEventListener(
        "click",
        openUploadDialog
    );

    elements.closeUploadButton.addEventListener(
        "click",
        () =>
            elements.uploadDialog.close()
    );

    elements.cameraButton.addEventListener(
        "click",
        () =>
            elements.cameraInput.click()
    );

    elements.libraryButton.addEventListener(
        "click",
        () =>
            elements.photoInput.click()
    );

    elements.cameraInput.addEventListener(
        "change",
        handleFileSelection
    );

    elements.photoInput.addEventListener(
        "change",
        handleFileSelection
    );

    elements.removePhotoButton.addEventListener(
        "click",
        clearSelectedFile
    );

    elements.uploadForm.addEventListener(
        "submit",
        handleUpload
    );

    elements.closeLightboxButton.addEventListener(
        "click",
        () =>
            elements.lightbox.close()
    );

    elements.uploadDialog.addEventListener(
        "close",
        updateBodyDialogState
    );

    elements.lightbox.addEventListener(
        "close",
        updateBodyDialogState
    );

    elements.uploadDialog.addEventListener(
        "click",
        closeOnBackdrop
    );

    elements.lightbox.addEventListener(
        "click",
        closeOnBackdrop
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            const tenMinutes =
                10 * 60 * 1000;

            if (
                !document.hidden &&
                Date.now() -
                    lastGalleryLoad >
                    tenMinutes
            ) {
                void loadPhotos();
            }
        }
    );
}

async function initialise() {
    try {
        await WeddingAuth.init();

        elements.authorInput.value =
            localStorage.getItem(
                "weddingGalleryAuthorName"
            ) || "";

        elements.openUploadButton.disabled =
            false;

        await loadPhotos();
    } catch (error) {
        if (
            !handleAuthenticationError(
                error
            )
        ) {
            console.error(error);

            elements.galleryStatus.textContent =
                translate("galleryError");
        }
    }
}

function openUploadDialog() {
    if (!elements.uploadDialog.open) {
        elements.uploadDialog.showModal();

        document.body.classList.add(
            "has-dialog"
        );
    }
}

function closeOnBackdrop(event) {
    if (
        event.target ===
        event.currentTarget
    ) {
        event.currentTarget.close();
    }
}

function updateBodyDialogState() {
    document.body.classList.toggle(
        "has-dialog",
        elements.uploadDialog.open ||
        elements.lightbox.open
    );
}

function handleFileSelection(event) {
    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) {
        return;
    }

    const normalisedFile =
        normaliseFileType(file);

    if (
        !ACCEPTED_TYPES.has(
            normalisedFile.type
        )
    ) {
        clearSelectedFile();

        setUploadStatus(
            translate("unsupportedType"),
            0,
            "error"
        );

        return;
    }

    if (
        normalisedFile.size >
        MAX_FILE_SIZE
    ) {
        clearSelectedFile();

        setUploadStatus(
            translate("fileTooLarge"),
            0,
            "error"
        );

        return;
    }

    clearPreviewUrl();

    selectedFile =
        normalisedFile;

    previewUrl =
        URL.createObjectURL(
            normalisedFile
        );

    elements.selectedPhoto.hidden =
        false;

    elements.selectedPhotoName.textContent =
        normalisedFile.name;

    elements.selectedPhotoSize.textContent =
        formatFileSize(
            normalisedFile.size
        );

    elements.selectedPhotoPreview.hidden =
        false;

    elements.previewFallback.hidden =
        true;

    elements.selectedPhotoPreview.src =
        previewUrl;

    elements.selectedPhotoPreview.alt =
        normalisedFile.name;

    elements.selectedPhotoPreview.onerror =
        () => {
            elements
                .selectedPhotoPreview
                .hidden = true;

            elements
                .previewFallback
                .hidden = false;
        };

    elements.uploadButton.disabled =
        false;

    resetUploadStatus();
}

function normaliseFileType(file) {
    if (
        ACCEPTED_TYPES.has(file.type)
    ) {
        return file;
    }

    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase();

    const inferredType = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        heic: "image/heic",
        heif: "image/heif"
    }[extension];

    if (!inferredType) {
        return file;
    }

    return new File(
        [file],
        file.name,
        {
            type: inferredType,
            lastModified:
                file.lastModified
        }
    );
}

function clearSelectedFile() {
    selectedFile = null;

    clearPreviewUrl();

    elements.cameraInput.value = "";
    elements.photoInput.value = "";

    elements.selectedPhoto.hidden =
        true;

    elements
        .selectedPhotoPreview
        .removeAttribute("src");

    elements.uploadButton.disabled =
        true;
}

function clearPreviewUrl() {
    if (previewUrl) {
        URL.revokeObjectURL(
            previewUrl
        );

        previewUrl = null;
    }
}

async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
        setUploadStatus(
            translate("chooseFirst"),
            0,
            "error"
        );

        return;
    }

    const fileToUpload =
        selectedFile;

    const authorName =
        elements.authorInput
            .value
            .trim();

    localStorage.setItem(
        "weddingGalleryAuthorName",
        authorName
    );

    setUploadBusy(true);

    try {
        setUploadStatus(
            translate(
                "preparingUpload"
            ),
            24
        );

        const uploadData =
            await requestUpload(
                fileToUpload,
                authorName
            );

        setUploadStatus(
            translate(
                "uploadingPhoto"
            ),
            62
        );

        await uploadToS3(
            fileToUpload,
            uploadData.upload
        );

        setUploadStatus(
            translate(
                "processingPhoto"
            ),
            100,
            "success"
        );

        showToast(
            translate("uploadToast")
        );

        clearSelectedFile();

        window.setTimeout(
            () => void loadPhotos(),
            2500
        );

        window.setTimeout(
            () => void loadPhotos(),
            6000
        );

        window.setTimeout(
            () =>
                elements
                    .uploadDialog
                    .close(),
            900
        );
    } catch (error) {
        console.error(error);

        if (
            !handleAuthenticationError(
                error
            )
        ) {
            setUploadStatus(
                translate(
                    "uploadFailed"
                ),
                0,
                "error"
            );
        }
    } finally {
        setUploadBusy(false);
    }
}

async function requestUpload(
    file,
    authorName
) {
    const response =
        await WeddingAuth.apiFetch(
            "/uploads",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    contentType:
                        file.type,

                    fileSize:
                        file.size,

                    originalFilename:
                        file.name,

                    authorName
                })
            }
        );

    if (!response.ok) {
        throw new Error(
            "Upload request failed with " +
            response.status
        );
    }

    return response.json();
}

async function uploadToS3(
    file,
    upload
) {
    const formData =
        new FormData();

    for (
        const [key, value]
        of Object.entries(
            upload.fields
        )
    ) {
        formData.append(
            key,
            value
        );
    }

    formData.append(
        "file",
        file
    );

    /*
     * Presigned S3 POST nie używa
     * tokenu API.
     */
    const response =
        await fetch(
            upload.url,
            {
                method: "POST",
                body: formData
            }
        );

    if (!response.ok) {
        throw new Error(
            "S3 upload failed with " +
            response.status
        );
    }
}

async function loadPhotos() {
    elements.refreshButton.disabled =
        true;

    elements.refreshButton.classList.add(
        "is-loading"
    );

    elements.gallery.setAttribute(
        "aria-busy",
        "true"
    );

    elements.galleryStatus.textContent =
        translate("loadingPhotos");

    try {
        const response =
            await WeddingAuth.apiFetch(
                "/photos"
            );

        if (!response.ok) {
            throw new Error(
                "Gallery request failed with " +
                response.status
            );
        }

        const data =
            await response.json();

        const photos =
            Array.isArray(data.photos)
                ? data.photos
                : [];

        renderPhotos(photos);

        elements.galleryStatus.textContent =
            formatPhotoCount(
                photos.length
            );

        lastGalleryLoad =
            Date.now();
    } catch (error) {
        console.error(error);

        if (
            !handleAuthenticationError(
                error
            )
        ) {
            elements.gallery.innerHTML =
                "";

            elements.galleryStatus.textContent =
                translate(
                    "galleryError"
                );
        }
    } finally {
        elements.gallery.setAttribute(
            "aria-busy",
            "false"
        );

        elements.refreshButton.disabled =
            false;

        elements.refreshButton.classList.remove(
            "is-loading"
        );
    }
}

function renderPhotos(photos) {
    elements.gallery.innerHTML = "";

    if (photos.length === 0) {
        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-state";

        empty.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M4 5h16v14H4V5Zm0 10 4.5-4.5 3.5 3.5 2-2 6 6"
                />
            </svg>
        `;

        const copy =
            document.createElement(
                "div"
            );

        copy.textContent =
            translate(
                "emptyGallery"
            );

        empty.appendChild(copy);

        elements.gallery.appendChild(
            empty
        );

        return;
    }

    const fragment =
        document.createDocumentFragment();

    photos.forEach(
        (photo, index) => {
            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "photo-card";

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "photo-card__button";

            button.type =
                "button";

            button.setAttribute(
                "aria-label",
                photo.authorName
                    ? translate(
                        "photoBy",
                        {
                            name:
                                photo.authorName
                        }
                    )
                    : translate(
                        "weddingPhoto"
                    )
            );

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                photo.thumbnailUrl;

            image.alt =
                photo.authorName
                    ? translate(
                        "photoBy",
                        {
                            name:
                                photo.authorName
                        }
                    )
                    : translate(
                        "weddingPhoto"
                    );

            image.loading =
                index < 4
                    ? "eager"
                    : "lazy";

            image.decoding =
                "async";

            if (
                photo.width &&
                photo.height
            ) {
                const safeWidth =
                    Math.max(
                        1,
                        Number(
                            photo.width
                        )
                    );

                const safeHeight =
                    Math.max(
                        1,
                        Number(
                            photo.height
                        )
                    );

                image.style.setProperty(
                    "--photo-ratio",
                    safeWidth +
                    " / " +
                    safeHeight
                );
            }

            const author =
                document.createElement(
                    "span"
                );

            author.className =
                "photo-card__author";

            author.textContent =
                photo.authorName ||
                translate(
                    "anonymous"
                );

            button.append(
                image,
                author
            );

            button.addEventListener(
                "click",
                () =>
                    openLightbox(
                        photo
                    )
            );

            article.appendChild(
                button
            );

            fragment.appendChild(
                article
            );
        }
    );

    elements.gallery.appendChild(
        fragment
    );
}

function openLightbox(photo) {
    elements.lightboxImage.src =
        photo.displayUrl;

    elements.lightboxImage.alt =
        photo.authorName
            ? translate(
                "photoBy",
                {
                    name:
                        photo.authorName
                }
            )
            : translate(
                "weddingPhoto"
            );

    elements.downloadPhotoButton.href =
        photo.originalUrl ||
        photo.displayUrl;

    elements.lightboxMeta.textContent =
        "";

    const author =
        document.createElement(
            "strong"
        );

    author.textContent =
        photo.authorName ||
        translate("anonymous");

    elements.lightboxMeta.appendChild(
        author
    );

    const formattedDate =
        formatDate(
            photo.uploadedAt
        );

    if (formattedDate) {
        const date =
            document.createElement(
                "span"
            );

        date.textContent =
            formattedDate;

        elements.lightboxMeta.appendChild(
            date
        );
    }

    elements.lightbox.showModal();

    document.body.classList.add(
        "has-dialog"
    );
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    return Number.isNaN(
        date.getTime()
    )
        ? ""
        : dateFormatter.format(
            date
        );
}

function formatFileSize(bytes) {
    const isMegabyte =
        bytes >= 1024 * 1024;

    const value =
        isMegabyte
            ? bytes /
                (1024 * 1024)
            : bytes / 1024;

    return new Intl.NumberFormat(
        locale,
        {
            style: "unit",

            unit:
                isMegabyte
                    ? "megabyte"
                    : "kilobyte",

            unitDisplay:
                "short",

            maximumFractionDigits:
                1
        }
    ).format(value);
}

function setUploadBusy(isBusy) {
    elements.uploadButton.disabled =
        isBusy ||
        !selectedFile;

    elements.cameraButton.disabled =
        isBusy;

    elements.libraryButton.disabled =
        isBusy;

    elements.closeUploadButton.disabled =
        isBusy;

    elements.authorInput.disabled =
        isBusy;
}

function setUploadStatus(
    message,
    progress,
    variant = ""
) {
    elements.uploadProgress.hidden =
        false;

    elements.uploadProgressBar.style.width =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        ) + "%";

    elements.status.textContent =
        message;

    elements.status.className =
        variant
            ? "is-" + variant
            : "";
}

function resetUploadStatus() {
    elements.uploadProgress.hidden =
        true;

    elements.uploadProgressBar.style.width =
        "0%";

    elements.status.textContent =
        "";

    elements.status.className =
        "";
}

function showAccessRequired() {
    elements.appContent.hidden =
        true;

    elements.openUploadButton.hidden =
        true;

    elements.accessRequired.hidden =
        false;

    if (
        elements.uploadDialog.open
    ) {
        elements.uploadDialog.close();
    }

    if (
        elements.lightbox.open
    ) {
        elements.lightbox.close();
    }
}

function handleAuthenticationError(
    error
) {
    if (
        error instanceof
        WeddingAuth
            .AuthenticationRequiredError
    ) {
        showAccessRequired();
        return true;
    }

    return false;
}

function showToast(message) {
    window.clearTimeout(
        toastTimer
    );

    elements.toast.textContent =
        message;

    elements.toast.hidden =
        false;

    toastTimer =
        window.setTimeout(
            () => {
                elements.toast.hidden =
                    true;
            },
            4200
        );
}