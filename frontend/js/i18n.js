import { translations } from "./locales/index.js";

const LANGUAGE_KEY = "weddingGalleryLanguage";

function savedLocale() {
    try {
        const choice = localStorage.getItem(LANGUAGE_KEY);
        return Object.hasOwn(translations, choice) ? choice : "pl";
    } catch {
        return "pl";
    }
}

export const locale = savedLocale();
const pluralFormatter = new Intl.PluralRules(locale);
const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
});

export function translate(key, variables = {}) {
    const value = translations[locale][key] || translations.en[key] || key;
    return value.replace(/\{(\w+)\}/g, (_, name) =>
        String(variables[name] ?? "")
    );
}

export function formatPhotoCount(count) {
    const category = pluralFormatter.select(count);
    const key = category === "one"
        ? "photoOne"
        : category === "few" ? "photoFew" : "photoMany";
    return translate(key, { count });
}

export function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

export function formatFileSize(bytes) {
    const megabytes = bytes >= 1024 * 1024;
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit: megabytes ? "megabyte" : "kilobyte",
        unitDisplay: "short",
        maximumFractionDigits: 1
    }).format(bytes / (megabytes ? 1024 * 1024 : 1024));
}

export function setLocale(choice) {
    if (!Object.hasOwn(translations, choice) || choice === locale) return;
    localStorage.setItem(LANGUAGE_KEY, choice);
    window.location.reload();
}

export function applyTranslations(languageSelect) {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar-DZ" ? "rtl" : "ltr";
    document.title = "Dawid & Maciej — " + translate("pageTitle");
    languageSelect.value = locale;

    document.querySelectorAll("[data-i18n]").forEach(node => {
        node.textContent = translate(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
        node.placeholder = translate(node.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(node => {
        node.setAttribute(
            "aria-label",
            translate(node.dataset.i18nAriaLabel)
        );
    });
}
