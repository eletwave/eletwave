import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { translations } from "./translations.mjs";
import "./build-quote-icons.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://www.eletwave.com/";
const routes = { it: "", en: "en/", sl: "sl/" };
const locales = { it: "it_IT", en: "en_GB", sl: "sl_SI" };
const ui = {
  it: { skip: "Vai al contenuto", menu: "Apri menu", nav: "Navigazione principale", lang: "Lingua sito", legal: "Link legali" },
  en: { skip: "Skip to content", menu: "Open menu", nav: "Main navigation", lang: "Site language", legal: "Legal links" },
  sl: { skip: "Preskoči na vsebino", menu: "Odpri meni", nav: "Glavna navigacija", lang: "Jezik strani", legal: "Pravne povezave" },
};

async function versionAssets($, file) {
  for (const node of $("link[rel=stylesheet][href], script[src]").toArray()) {
    const attr = node.name === "script" ? "src" : "href";
    const value = $(node).attr(attr);
    if (/^(https?:)?\/\//.test(value)) continue;
    const path = value.split("?")[0];
    const bytes = await readFile(resolve(root, dirname(file), path));
    $(node).attr(attr, path + "?v=" + createHash("sha256").update(bytes).digest("hex").slice(0, 12));
  }
  $("link[href*='fonts.googleapis.com/css2']").each((_, node) => {
    $(node).attr("href", "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap");
  });
}
async function save(file, $) {
  await versionAssets($, file);
  await mkdir(dirname(resolve(root, file)), { recursive: true });
  const html = $.html().replace(/[ \t]+$/gm, "")
    .replace(/\s*<\/body>\s*<\/html>\s*$/, "\n  </body>\n</html>\n");
  await writeFile(resolve(root, file), html);
}

const template = await readFile(resolve(root, "templates/home.html"), "utf8");
for (const [lang, route] of Object.entries(routes)) {
  const $ = load(template);
  const dictionary = translations[lang];
  const url = base + route;
  $("html").attr("lang", lang);
  $("title").text(dictionary.title);
  $("meta[name=description], meta[property='og:description'], meta[name='twitter:description']").attr("content", dictionary.description);
  $("meta[property='og:title'], meta[name='twitter:title']").attr("content", dictionary.title);
  $("meta[property='og:locale']").attr("content", locales[lang]);
  $("meta[property='og:url']").attr("content", url);
  $("link[rel=canonical]").attr("href", url);
  for (const [code, path] of Object.entries({ ...routes, "x-default": "" })) {
    $("head").append(`\n    <link rel="alternate" hreflang="${code}" href="${base + path}">`);
  }
  $("[data-i18n]").each((_, node) => {
    const key = $(node).attr("data-i18n");
    if (!(key in dictionary)) throw new Error(`Missing ${lang} translation: ${key}`);
    $(node).text(dictionary[key]);
  });
  $(".skip-link").text(ui[lang].skip);
  $(".topbar__menu").attr("aria-label", ui[lang].menu);
  $(".topbar__nav").attr("aria-label", ui[lang].nav);
  $("[data-lang-switcher]").attr("aria-label", ui[lang].lang);
  $(".site-footer__links").attr("aria-label", ui[lang].legal);
  $("[data-lang]").each((_, node) => {
    const code = $(node).attr("data-lang");
    $(node).attr("href", (route ? "../" : "./") + routes[code]);
    $(node).attr("hreflang", code).attr("lang", code);
    $(node).toggleClass("is-active", code === lang);
    if (code === lang) $(node).attr("aria-current", "page");
  });
  $("[data-lang-switcher]").attr("style", "--lang-index: " + Object.keys(routes).indexOf(lang));
  $(".brands-pill img").attr("loading", "lazy").attr("decoding", "async");
  if (route) {
    $("[src], [href]").each((_, node) => {
      for (const attr of ["src", "href"]) {
        const value = $(node).attr(attr);
        if (value?.startsWith("./")) $(node).attr(attr, "../" + value.slice(2));
      }
    });
  }
  await save(route + "index.html", $);
}
for (const file of ["preventivo.html", "privacy-policy.html", "cookie-policy.html", "404.html"]) {
  await save(file, load(await readFile(resolve(root, file), "utf8")));
}
const urls = ["", "en/", "sl/", "preventivo.html", "privacy-policy.html", "cookie-policy.html"];
await writeFile(resolve(root, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(url => `  <url><loc>${base + url}</loc></url>`).join("\n") + "\n</urlset>\n");
console.log("Built IT/EN/SL pages, sitemap and content-based asset versions.");
