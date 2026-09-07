# Eletwave Public Site

Static website published by GitHub Pages from the root of the main branch.
Production: https://www.eletwave.com/

## Sources

- templates/home.html: shared homepage markup.
- scripts/translations.mjs: Italian, English and Slovenian homepage text.
- script.js: menu, focus and viewport animations.
- styles.css: homepage, shared controls and legal pages.
- preventivo-data.js: the 47 guided quote branches.
- preventivo.js and preventivo.css: quote behavior and layout.
- preventivo.html, privacy-policy.html, cookie-policy.html and 404.html: page sources.
- assets/: only files referenced by the published site.

The build generates index.html, en/index.html and sl/index.html, updates the
sitemap and hashes local CSS/JS references. Commit the generated pages together
with their sources. Do not edit generated homepage files directly.

## Checks

Requires Node.js 22 or later.

    npm ci
    npm run build
    npm test
    npx playwright install chromium
    npm run test:browser

Browser tests cover all quote branches, navigation, contact validation,
long-message copy/download, language links and phone/tablet/desktop layouts.
External messages are never sent by tests.

For a local HTTP preview:

    node scripts/serve.mjs

Open http://127.0.0.1:4183/. Set PORT to use another free port.
SITE_URL can point browser smoke checks at an existing deployment.

## Publication

Explain the change and confirm existing authorization before publishing.
Keep a Git reference to the last published version, push a branch, run the
pull-request checks, then merge and verify the public pages.
GitHub Pages uses _config.yml to exclude development files from publication.
Do not change CNAME, DNS or hosting without specific approval.

The obsolete /v2/ URL redirects to the current homepage and is not indexed.
Removed assets and previous layouts remain recoverable from Git history.
The apex domain eletwave.com needs separate DNS configuration; the site uses
www.eletwave.com as its canonical domain.
