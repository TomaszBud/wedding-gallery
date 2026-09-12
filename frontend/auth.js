const WeddingAuth = (() => {
    const TOKEN_KEY = "weddingGalleryAccessToken";
    const EXPIRY_KEY = "weddingGalleryAccessTokenExpiry";

    const API_BASE_URL =
        window.APP_CONFIG.API_BASE_URL.replace(/\/$/, "");

    class AuthenticationRequiredError extends Error {
        constructor(message = "Wymóg uwierzytelnienia") {
            super(message);
            this.name = "AuthenticationRequiredError";
        }
    }

    function clearSession() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(EXPIRY_KEY);
    }

    function getInviteFromUrl() {
        const fragment = window.location.hash.substring(1);

        if (!fragment) {
            return null;
        }

        const params = new URLSearchParams(fragment);
        return params.get("invite");
    }

    function removeInviteFromUrl() {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname + window.location.search
        );
    }

    function getAccessToken() {
        const token = sessionStorage.getItem(TOKEN_KEY);
        const expiresAt = Number(
            sessionStorage.getItem(EXPIRY_KEY)
        );

        if (!token || !expiresAt) {
            return null;
        }

        const now = Math.floor(Date.now() / 1000);

        if (expiresAt <= now) {
            clearSession();
            return null;
        }

        return token;
    }

    async function exchangeInvite(inviteToken) {
        const response = await fetch(
            `${API_BASE_URL}/auth/exchange`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inviteToken
                })
            }
        );

        if (!response.ok) {
            clearSession();

            throw new AuthenticationRequiredError(
                "Nieważny token"
            );
        }

        const data = await response.json();

        sessionStorage.setItem(
            TOKEN_KEY,
            data.accessToken
        );

        sessionStorage.setItem(
            EXPIRY_KEY,
            String(data.expiresAt)
        );

        removeInviteFromUrl();

        return data.accessToken;
    }

    async function init() {
        const inviteToken = getInviteFromUrl();

        // QR ma pierwszeństwo nad istniejącą sesją.
        if (inviteToken) {
            return await exchangeInvite(inviteToken);
        }

        const accessToken = getAccessToken();

        if (accessToken) {
            return accessToken;
        }

        throw new AuthenticationRequiredError();
    }

    async function apiFetch(path, options = {}) {
        const accessToken = getAccessToken();

        if (!accessToken) {
            throw new AuthenticationRequiredError();
        }

        const headers = new Headers(options.headers || {});

        headers.set(
            "Authorization",
            `Bearer ${accessToken}`
        );

        const response = await fetch(
            `${API_BASE_URL}${path}`,
            {
                ...options,
                headers
            }
        );

        if (response.status === 401) {
            clearSession();

            throw new AuthenticationRequiredError(
                "Sesja wygasła"
            );
        }

        return response;
    }

    return {
        init,
        apiFetch,
        clearSession,
        AuthenticationRequiredError
    };
})();