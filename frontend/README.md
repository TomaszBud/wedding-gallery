# Frontend galerii

Statyczna aplikacja na GitHub Pages. Nie wymaga npm ani buildu; workflow
`deploy-pages.yml` publikuje zawartość całego katalogu `frontend/`.

## Układ

- `index.html` — szkielet strony, podstawowe sekcje i punkty montowania dialogów.
- `partials/` — formularz uploadu i podgląd zdjęcia ładowane przy starcie.
- `css/` — style bazowe, galeria, upload, podgląd, narzędzia i media queries.
- `js/main.js` — uruchomienie aplikacji, powiązanie modułów i zdarzeń.
- `js/config.js` — publiczny adres API.
- `js/api/` — wymiana zaproszenia na token, wywołania API oraz presigned POST do S3.
- `js/ui/` — galeria, upload i komunikaty.
- `js/i18n.js`, `js/locales/` — wybór języka systemowego i treści tłumaczeń.

Ścieżki w HTML i importy modułów są względne, więc działają również pod
podścieżką repozytorium na GitHub Pages. Token pozostaje w `sessionStorage`.
Wysyłanie wielu zdjęć wywołuje istniejące `/uploads` osobno dla każdego pliku.

## Lokalnie

Z katalogu głównego repozytorium:

```sh
python3 -m http.server 8000 --directory frontend
```

Otwórz `http://localhost:8000/`. Nie otwieraj `index.html` jako `file://`,
bo przeglądarka może zablokować ładowanie modułów i fragmentów HTML.
Dostęp do galerii wymaga poprawnego zaproszenia w `#invite=...`.

Test przepływu uploadu bez AWS: `node --test tests/frontend-upload.test.mjs`.
