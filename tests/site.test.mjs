import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import postcss from "postcss";
import { translations } from "../scripts/translations.mjs";

const pages = ["index.html", "en/index.html", "sl/index.html", "preventivo.html", "privacy-policy.html", "cookie-policy.html", "404.html", "v2/index.html"];
const scripts = ["script.js", "preventivo.js", "preventivo-data.js"];
test("47 branches have unique answer keys and valid questions", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("preventivo-data.js", "utf8"), context);
  const { branches, categoryOrder } = context.window.EletwaveQuoteData;
  assert.equal(categoryOrder.length, 7);
  let count = 0;
  for (const category of Object.values(branches)) {
    for (const branch of Object.values(category.subcategories)) {
      count++;
      assert.equal(new Set(branch.questions.map(q => q.key)).size, branch.questions.length);
      for (const q of branch.questions) {
        assert.ok(q.key && q.title);
        assert.ok(["text", "textarea", "options", "multi"].includes(q.type));
        if (q.options) assert.ok(q.options.length > 0);
        if (q.key === "Upload disponibili") assert.ok(q.body);
      }
    }
  }
  assert.equal(count, 47);
});

test("published pages have working local references and current asset versions", async () => {
  for (const file of pages) {
    const $ = load(await readFile(file, "utf8"));
    for (const node of $("[href], [src]").toArray()) {
      for (const attr of ["href", "src"]) {
        const value = $(node).attr(attr);
        if (!value || /^(https?:|mailto:|tel:|data:)/.test(value)) continue;
        const parsed = new URL(value, "https://www.eletwave.com/" + file);
        let target = decodeURIComponent(parsed.pathname).slice(1) || "index.html";
        if (target.endsWith("/")) target += "index.html";
        assert.ok((await stat(target)).isFile(), file + ": " + value);
        if (parsed.hash) {
          const targetPage = load(await readFile(target, "utf8"));
          assert.ok(targetPage("[id]").toArray().some(n => targetPage(n).attr("id") === parsed.hash.slice(1)), value);
        }
        if (/\.(js|css)$/.test(target)) {
          const hash = createHash("sha256").update(await readFile(target)).digest("hex").slice(0, 12);
          assert.equal(parsed.searchParams.get("v"), hash, target + " is stale");
        }
      }
    }
  }
});

test("each language has rendered content, canonical and reciprocal alternatives", async () => {
  for (const [lang, file] of Object.entries({ it: "index.html", en: "en/index.html", sl: "sl/index.html" })) {
    const $ = load(await readFile(file, "utf8"));
    assert.equal($("html").attr("lang"), lang);
    assert.equal($("title").text(), translations[lang].title);
    assert.equal($("link[rel=alternate]").length, 4);
    assert.equal($("[data-lang='" + lang + "'][aria-current=page]").length, 2);
    $("[data-i18n]").each((_, node) => assert.equal($(node).text(), translations[lang][$(node).attr("data-i18n")]));
  }
});

test("no unused published assets or obsolete V2 code remain", async () => {
  const source = (await Promise.all([...pages, ...scripts, "styles.css", "preventivo.css"].map(f => readFile(f, "utf8")))).join("\n");
  const assets = await readdir("assets", { recursive: true, withFileTypes: true });
  let size = 0;
  for (const asset of assets.filter(a => a.isFile())) {
    assert.ok(source.includes(asset.name) || source.includes(encodeURIComponent(asset.name)), asset.name + " is unused");
    size += (await stat(resolve(asset.parentPath, asset.name))).size;
  }
  assert.ok(size < 2_000_000, "asset budget exceeded");
  assert.deepEqual(await readdir("v2"), ["index.html"]);
  const $ = load(await readFile("v2/index.html", "utf8"));
  assert.match($("meta[name=robots]").attr("content"), /noindex/);
});

test("JavaScript and CSS parse", async () => {
  for (const file of scripts) new vm.Script(await readFile(file, "utf8"), { filename: file });
  postcss.parse(await readFile("styles.css", "utf8"));
  postcss.parse(await readFile("preventivo.css", "utf8"));
});
