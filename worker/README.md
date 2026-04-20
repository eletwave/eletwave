# ELETWAVE Integrations Worker

Questo worker espone tre endpoint:

- `GET /health`
- `GET /instagram`
- `GET /google-business`
- `GET /google-business/discover`

## Stack previsto

- frontend statico su `GitHub Pages`
- backend leggero su `Cloudflare Workers`

## Variabili pubbliche in `wrangler.toml`

Le variabili gia presenti nel file sono sicure da pubblicare:

- `ALLOWED_ORIGIN`
- `INSTAGRAM_API_VERSION`
- `INSTAGRAM_HOST`
- `INSTAGRAM_POST_LIMIT`
- `GOOGLE_REVIEW_LIMIT`
- `CACHE_TTL_INSTAGRAM`
- `CACHE_TTL_GOOGLE`
- `CACHE_TTL_DISCOVER`

## Secrets da impostare

Imposta questi valori con `wrangler secret put`:

- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Questi possono stare come secret oppure come vars normali:

- `INSTAGRAM_PROFILE_URL`
- `GBP_ACCOUNT_ID`
- `GBP_LOCATION_ID`
- `GOOGLE_PROFILE_URL`
- `GOOGLE_REVIEW_URL`

## Comandi

Dalla cartella `worker/`:

```bash
npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
npx wrangler secret put INSTAGRAM_USER_ID
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_REFRESH_TOKEN
npx wrangler deploy
```

## Collegamento al sito

Dopo il deploy, copia l'URL del worker e incollalo in `site-config.js`:

```js
window.ELETWAVE_CONFIG = Object.freeze({
  integrations: {
    apiBaseUrl: "https://eletwave-integrations.<subdomain>.workers.dev",
    googleDataUrl: "./data/google-business.json",
    instagramDataUrl: "./data/instagram.json",
    googleProfileUrl: "",
    googleReviewUrl: "",
    instagramProfileUrl: "https://www.instagram.com/eletwave/",
  },
});
```

Il frontend usa il worker come sorgente principale. Se il worker non risponde,
ripiega automaticamente sui file JSON pubblici del repository.

## Endpoint di discovery

Se non conosci subito `GBP_ACCOUNT_ID` e `GBP_LOCATION_ID`, dopo aver messo le
credenziali Google puoi aprire:

```txt
https://<worker-domain>/google-business/discover
```

L'endpoint restituisce gli account accessibili e le relative location.
