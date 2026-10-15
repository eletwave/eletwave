import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import postcss from "postcss";
import { translations } from "../scripts/translations.mjs";

const pages = ["index.html", "en/index.html", "sl/index.html", "preventivo.html", "privacy-policy.html", "privacy-calcoli-elettrici.html", "privacy-crossumi.html", "cookie-policy.html", "404.html", "v2/index.html"];
const scripts = ["script.js", "preventivo.js", "preventivo-data.js"];
test("49 branches have valid questions and are reachable from the service navigation", async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile("preventivo-data.js", "utf8"), context);
  const { branches, categoryOrder, services, intents } = context.window.EletwaveQuoteData;
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
  assert.equal(count, 49);
  const reachable = new Set();
  for (const service of Object.values(services)) {
    assert.ok(service.label && service.icon && service.body);
    for (const [intent, ids] of Object.entries(service.routes)) {
      assert.ok(intents[intent]);
      for (const id of ids) {
        assert.ok(branches[intent].subcategories[id], intent + "/" + id);
        reachable.add(intent + "/" + id);
      }
    }
  }
  assert.equal(reachable.size, count);
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

test("favicon is a square PNG consistently referenced by published pages", async () => {
  const icon = await readFile("assets/eletwave-favicon.png");
  assert.equal(icon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(icon.readUInt32BE(16), 528);
  assert.equal(icon.readUInt32BE(20), 528);
  for (const file of pages.filter(file => file !== "v2/index.html" && file !== "privacy-crossumi.html")) {
    const $ = load(await readFile(file, "utf8"));
    const link = $("link[rel=icon]");
    assert.equal(link.length, 1, file);
    assert.equal(link.attr("type"), "image/png", file);
    assert.equal(link.attr("sizes"), "528x528", file);
    const url = new URL(link.attr("href"), "https://www.eletwave.com/" + file);
    assert.equal(url.pathname, "/assets/eletwave-favicon.png", file);
    assert.equal(url.search, "", "favicon URL must remain stable");
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

// Approved publication scope: keep services at the public e565bb6 baseline.
test("services markup stays identical to the approved public version", async () => {
  const hashes = {
    "templates/home.html": "308031cc1c796be8d044b7e072f2e0367d37756badd2f48b63c4acd9e9090e5e",
    "index.html": "439a4f3f795d74f69910d968122768e17aa8f8cfe8e71ed6e0907296e57ef5cf",
    "en/index.html": "b02f8639c1ebd4082c0324cbb31190bedbce0b79d24980b125a73621e141184a",
    "sl/index.html": "04532822d1cd4441db7bbb2e6a931d213ce8e02513d45cdb5905cdd064e3dd9f",
  };
  for (const [file, expected] of Object.entries(hashes)) {
    const $ = load((await readFile(file, "utf8")).replace(/\r\n/g, "\n"));
    assert.equal(createHash("sha256").update($.html($("#servizi"))).digest("hex"), expected, file);
    assert.equal($(".service-fragments, .services-grid, script[src*='assets/motion/']").length, 0, file);
  }
});

test("service styling and reveal rules stay identical to the public version", async () => {
  const rules = [];
  postcss.parse(await readFile("styles.css", "utf8")).walkRules(rule => {
    if (!/\.service(?:s|-)|\.reveal/.test(rule.selector)) return;
    const context = [];
    let parent = rule.parent;
    while (parent.type !== "root") {
      context.unshift("@" + parent.name + " " + parent.params);
      parent = parent.parent;
    }
    rules.push({
      context,
      selector: rule.selector,
      declarations: rule.nodes.filter(node => node.type === "decl").map(node => [node.prop, node.value, node.important || false]),
    });
  });
  assert.equal(createHash("sha256").update(JSON.stringify(rules)).digest("hex"), "ac23bc2b629993e2f83aa8d5829ccc87e32cfaf952de8654dc61de035488add6");
});

test("rebuilding does not change generated files", async () => {
  const files = [...pages, "sitemap.xml"];
  const before = await Promise.all(files.map(file => readFile(file, "utf8")));
  execFileSync(process.execPath, ["scripts/build.mjs"]);
  const after = await Promise.all(files.map(file => readFile(file, "utf8")));
  assert.deepEqual(after, before);
});
