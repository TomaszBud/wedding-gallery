const API_BASE_URL =
    "https://ejh5vt76me.execute-api.eu-central-1.amazonaws.com";

const MAX_FILE_SIZE = 20 * 1024 * 1024;


// --------------------------------------------------
// DOM
// --------------------------------------------------

const photoInput =
    document.getElementById("photoInput");

const authorInput =
    document.getElementById("authorInput");

const uploadButton =
    document.getElementById("uploadButton");

const statusElement =
    document.getElementById("status");

const gallery =
    document.getElementById("gallery");

const galleryStatus =
    document.getElementById("galleryStatus");

const refreshButton =
    document.getElementById("refreshButton");


// --------------------------------------------------
// Upload
// --------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await WeddingAuth.init();

        await loadPhotos();
    } catch (error) {
        if (
            error instanceof
            WeddingAuth.AuthenticationRequiredError
        ) {
            showAccessRequired();
            return;
        }

        console.error(error);
    }
});


uploadButton.addEventListener(
    "click",
    async () => {

        const file = photoInput.files[0];

        if (!file) {
            setStatus(
                "Najpierw wybierz zdjęcie."
            );
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setStatus(
                "Zdjęcie jest za duże. Maksymalny rozmiar to 20 MB."
            );
            return;
        }

        try {

            uploadButton.disabled = true;

            setStatus(
                "Przygotowuję przesył..."
            );

            const uploadData =
                await requestUpload(file);

            setStatus(
                "Wysyłam zdjęcie..."
            );

            await uploadToS3(
                file,
                uploadData.upload
            );

            setStatus(
                "✅ Zdjęcie zostało wysłane i jest przetwarzane."
            );

            photoInput.value = "";

            console.log(
                "Uploaded object:",
                uploadData.objectKey
            );

            /*
             * Processor:
             *
             * S3
             * → Lambda
             * → WebP
             * → DynamoDB READY
             *
             * dlatego nie odświeżamy natychmiast.
             */
            setTimeout(
                loadPhotos,
                3000
            );

        } catch (error) {

            console.error(error);

            setStatus(
                `❌ wysłanie się nie powiodło: ${error.message}`
            );

        } finally {

            uploadButton.disabled = false;
        }
    }
);


async function requestUpload(file) {

    const response = await WeddingAuth.apiFetch(
        `/uploads`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                contentType: file.type,
                fileSize: file.size,
                originalFilename: file.name,
                authorName:
                    authorInput?.value.trim() || ""
            })
        }
    );

    if (!response.ok) {

        const text =
            await response.text();

        throw new Error(
            `Serwer zwrócił ${response.status}: ${text}`
        );
    }

    return await response.json();
}


async function uploadToS3(
    file,
    upload
) {

    const formData =
        new FormData();

    for (
        const [key, value]
        of Object.entries(upload.fields)
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

    const response =
        await apiFetch(
            upload.url,
            {
                method: "POST",
                body: formData
            }
        );

    if (!response.ok) {

        const text =
            await response.text();

        throw new Error(
            `Baza zwróciła ${response.status}: ${text}`
        );
    }
}


// --------------------------------------------------
// Gallery
// --------------------------------------------------

refreshButton.addEventListener(
    "click",
    loadPhotos
);


async function loadPhotos() {

    galleryStatus.textContent =
        "Ładuję zdjęcia...";

    try {

        const response =
            await WeddingAuth.apiFetch(
                `/photos`
            );

        if (!response.ok) {

            const text =
                await response.text();

            throw new Error(
                `Mamy błąd - ${response.status}: ${text}`
            );
        }

        const data =
            await response.json();

        renderPhotos(
            data.photos || []
        );

        galleryStatus.textContent =
            `Zdjęcia: ${data.photos?.length || 0}`;

    } catch (error) {

        console.error(error);

        galleryStatus.textContent =
            `❌ Nie udało się pobrać galerii: ${error.message}`;
    }
}

async function apiFetch(path, options = {}) {
    const accessToken = getAccessToken();

    if (!accessToken) {
        throw new Error("Not authenticated");
    }

    const headers = new Headers(options.headers || {});

    headers.set(
        "Authorization",
        `Bearer ${accessToken}`
    );

    const response = await apiFetch(
        `${API_BASE_URL}${path}`,
        {
            ...options,
            headers
        }
    );

    if (response.status === 401) {
        clearAccessToken();
        throw new Error("Session expired");
    }

    return response;
}

function renderPhotos(photos) {

    gallery.innerHTML = "";

    if (photos.length === 0) {

        gallery.textContent =
            "Nie ma jeszcze żadnych zdjęć.";

        return;
    }

    for (const photo of photos) {

        const card =
            document.createElement(
                "article"
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            photo.displayUrl;

        link.target =
            "_blank";

        link.rel =
            "noopener";

        const image =
            document.createElement(
                "img"
            );

        image.src =
            photo.thumbnailUrl;

        image.alt =
            photo.authorName
                ? `Zdjęcie dodane przez ${photo.authorName}`
                : "Zdjęcie weselne";

        image.loading =
            "lazy";

        const author =
            document.createElement(
                "p"
            );

        author.textContent =
            photo.authorName || "Anonim";

        link.appendChild(
            image
        );

        card.appendChild(
            link
        );

        card.appendChild(
            author
        );

        gallery.appendChild(
            card
        );
    }
}

function showAccessRequired() {
    document.body.innerHTML = `
        <main>
            <h1>Galeria weselna</h1>
            <p>
                Aby otworzyć galerię,
                zeskanuj kod QR dostępny na weselu.
            </p>
        </main>
    `;
}


// --------------------------------------------------
// Helpers
// --------------------------------------------------

function setStatus(message) {
    statusElement.textContent =
        message;
}


// --------------------------------------------------
// Initial load
// --------------------------------------------------
