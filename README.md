# Eletwave Public Site

Static website published by GitHub Pages from the root of the main branch.
Production: https://www.eletwave.com/

## Sources

- templates/home.html: shared homepage markup.
- scripts/translations.mjs: Italian, English and Slovenian homepage text.
- script.js: menu, focus and viewport animations.
- analytics.js and analytics.css: opt-in GA4, minimal consent UI and safe CTA events.
- styles.css: homepage, shared controls and legal pages.
- preventivo-data.js: 8 service groups, intent routing and 49 quote branches.
- preventivo.js and preventivo.css: isolated quote behavior and layout.
- scripts/build-quote-icons.mjs: generates the local Lucide icon sprite.
- preventivo.html, privacy-policy.html, cookie-policy.html and 404.html: page sources.
- assets/: only files referenced by the published site.

The build generates index.html, en/index.html and sl/index.html, updates the
sitemap and hashes local CSS/JS references. Commit the generated pages together
with their sources. Do not edit generated homepage files directly.

## Checks

The quote starts from a service and narrows down to the requested intervention.
Details, minimal contact information and an editable review follow. Single-choice
answers advance immediately; multiple choices and text have explicit confirmation.
Review edits can be saved or cancelled. Changing the intervention clears only its
technical answers; contact drafts survive and consent must be reconfirmed.
Nothing is persisted or sent automatically. WhatsApp/email links are prepared in
the browser, with complete copy/download fallbacks for long requests. Photos are
attached by the user in the destination app, not uploaded to this static site.

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

## Website Statistics

GA4 property measurement ID: G-LN42Y4382J (public identifier, not a secret).
Only the public homepage languages, quote and website legal pages include the
consent module. Android app policies, 404, legacy redirects and preview hosts
do not send statistics. Never copy the unconditional Google snippet into HTML.

The remote tag is loaded only after explicit or previously saved consent on
eletwave.com/www.eletwave.com. Refusing, closing the initial banner or withdrawing
consent prevents subsequent events. The local choice expires after six calendar
months; rejected choices are not requested on every page. Cookie preferences
remain available in the footer. Withdrawal does not reload or reset the quote.
Google may finish transmitting batches collected while consent was valid;
withdrawal prevents new events, not retroactive processing of accepted events.

Collected events: page_view, click_whatsapp and click_preventivo. CTA events use
only a fixed link_position value (hero, menu, contact, quote_help, quote_review,
page). Count these as clicks, not messages sent or completed quote requests.
Only measured/consenting browsers contribute to users and page-view totals.
No form contents, full outgoing URLs, query strings or hash fragments are sent.
Keep Enhanced Measurement OFF in the GA4 stream, as requested during setup, so
automatic outgoing-link/form events cannot disclose quote message URLs.

In the owner's Google Analytics account, check data retention (the new-property
default is 2 months), leave Google Signals/advertising integrations off and add
click_whatsapp/click_preventivo to key events if desired. link_position can be
registered as an event-scoped custom dimension to compare CTA placements.
These account settings cannot be verified from the static repository.
Events may need processing before appearing in standard reports; use Realtime
to check initial receipt. Configure any internal/developer traffic exclusions
in the account instead of excluding genuine visitors from the site code.
