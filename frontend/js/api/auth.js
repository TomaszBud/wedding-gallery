import { API_BASE_URL } from "../config.js";

const TOKEN_KEY = "weddingGalleryAccessToken";
const EXPIRY_KEY = "weddingGalleryAccessTokenExpiry";
const apiBaseUrl = API_BASE_URL.replace(/\/$/, "");

export class AuthenticationRequiredError extends Error {
    constructor(message = "Wymóg uwierzytelnienia") {
        super(message);
        this.name = "AuthenticationRequiredError";
    }
}

export function clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
}

function inviteFromUrl() {
    const fragment = window.location.hash.substring(1);
    return fragment ? new URLSearchParams(fragment).get("invite") : null;
}

function accessToken() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(sessionStorage.getItem(EXPIRY_KEY));

    if (!token || !expiresAt) return null;
    if (expiresAt <= Math.floor(Date.now() / 1000)) {
        clearSession();
        return null;
    }
    return token;
}

async function exchangeInvite(inviteToken) {
    const response = await fetch(`${apiBaseUrl}/auth/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteToken })
    });

    if (!response.ok) {
        clearSession();
        throw new AuthenticationRequiredError("Nieważny token");
    }

    const data = await response.json();
    sessionStorage.setItem(TOKEN_KEY, data.accessToken);
    sessionStorage.setItem(EXPIRY_KEY, String(data.expiresAt));
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
    );
    return data.accessToken;
}

export async function initAuth() {
    // A QR invitation takes precedence over a session already in this tab.
    const inviteToken = inviteFromUrl();
    if (inviteToken) return exchangeInvite(inviteToken);

    const token = accessToken();
    if (token) return token;
    throw new AuthenticationRequiredError();
}

export async function apiFetch(path, options = {}) {
    const token = accessToken();
    if (!token) throw new AuthenticationRequiredError();

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        clearSession();
        throw new AuthenticationRequiredError("Sesja wygasła");
    }
    return response;
}
