# Setup rapido

Il sito ora e pronto per mostrare:

- box `Google Business Profile`
- ultimi post `Instagram`
- recensioni `Google`

La soluzione consigliata per il tuo caso e:

- frontend statico su `GitHub Pages`
- aggiornamento dati via `GitHub Actions`
- file pubblici serviti da `data/google-business.json` e `data/instagram.json`

## 1. Configura `site-config.js`

Apri [site-config.js](./site-config.js) e lascia questa struttura:

```js
window.ELETWAVE_CONFIG = Object.freeze({
  integrations: {
    apiBaseUrl: "",
    googleDataUrl: "./data/google-business.json",
    instagramDataUrl: "./data/instagram.json",
    googleProfileUrl: "",
    googleReviewUrl: "",
    instagramProfileUrl: "https://www.instagram.com/eletwave/",
  },
});
```

Con questa configurazione il sito legge direttamente i file JSON pubblicati da
GitHub Pages.

## 2. GitHub Secrets e Variables

Nel repository GitHub imposta questi `Secrets`:

- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Imposta queste `Variables` se le hai gia:

- `INSTAGRAM_PROFILE_URL`
- `INSTAGRAM_API_VERSION`
- `INSTAGRAM_HOST`
- `INSTAGRAM_POST_LIMIT`
- `GOOGLE_BUSINESS_NAME`
- `GOOGLE_PROFILE_URL`
- `GOOGLE_REVIEW_URL`
- `GOOGLE_REVIEW_LIMIT`
- `GBP_ACCOUNT_ID`
- `GBP_LOCATION_ID`

Il workflow che usa questi valori e in
[.github/workflows/sync-integrations.yml](./.github/workflows/sync-integrations.yml).

## 3. Avvio della sincronizzazione

Lo script che aggiorna i file dati e in
[scripts/sync-integrations.mjs](./scripts/sync-integrations.mjs).

Il workflow:

- gira manualmente con `workflow_dispatch`
- poi si ripete ogni 2 ore
- aggiorna `data/google-business.json`
- aggiorna `data/instagram.json`
- fa commit automatico solo se i dati cambiano

## 4. Google Cloud

Per Google Business Profile servono:

- un progetto `Google Cloud`
- accesso alle `Business Profile APIs`
- OAuth con scope `business.manage`
- un `refresh token`

Doc ufficiali:

- https://developers.google.com/my-business/content/basic-setup
- https://developers.google.com/my-business/content/implement-oauth
- https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
- https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations

## 5. Meta / Instagram

Per Instagram servono:

- `Meta App`
- account business gia collegato
- `Instagram User access token`
- `Instagram User ID`

Doc ufficiali:

- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user
- https://developers.facebook.com/docs/instagram-platform/reference/instagram-media

## 6. File coinvolti

- [data/google-business.json](./data/google-business.json)
- [data/instagram.json](./data/instagram.json)
- [site-config.js](./site-config.js)
- [scripts/sync-integrations.mjs](./scripts/sync-integrations.mjs)
- [.github/workflows/sync-integrations.yml](./.github/workflows/sync-integrations.yml)

## Nota

La cartella [worker/](./worker) resta nel repo come alternativa futura, ma per adesso non ti serve.
