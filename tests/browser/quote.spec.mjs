import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const context = { window: {} };
vm.runInNewContext(await readFile("preventivo-data.js", "utf8"), context);
const { branches, services } = context.window.EletwaveQuoteData;
const label = option => Array.isArray(option) ? option[0] : option;
const paths = [];
for (const [service, definition] of Object.entries(services)) {
  for (const [intent, ids] of Object.entries(definition.routes)) {
    for (const branch of ids) paths.push({ service, intent, branch, questions: branches[intent].subcategories[branch].questions });
  }
}

async function selectPath(page, path) {
  await page.locator('[data-choice="' + path.service + '"]').click();
  if (path.service !== "consiglio") {
    await page.locator('[data-choice="' + path.intent + '"]').click();
    if (services[path.service].routes[path.intent].length > 1) await page.locator('[data-choice="' + path.branch + '"]').click();
  }
}

async function answer(page, q) {
  await expect(page.locator("#stage-title")).toHaveText(q.title);
  await expect(page.locator("#stage-title")).toBeFocused();
  if (q.type === "text" || q.type === "textarea") {
    await expect(page.locator("#next-step")).toBeDisabled();
    await page.locator("#question-input").fill("Dettaglio <test> & verifica");
    if (q.type === "text") await page.locator("#question-input").press("Enter");
    else await page.locator("#next-step").click();
  } else if (q.type === "multi") {
    await page.getByLabel(label(q.options[0]), { exact: true }).check();
    await expect(page.getByLabel(label(q.options[0]), { exact: true })).toBeChecked();
    await page.locator("#next-step").click();
  } else {
    await expect(page.locator("#next-step")).toBeHidden();
    await page.locator("#quiz-stage [data-choice]").first().click();
  }
}

async function completeDetails(page, path) {
  await selectPath(page, path);
  for (const q of path.questions) await answer(page, q);
}

async function contacts(page, notes = "Nota da conservare <script>alert(1)</script>") {
  await page.locator("#name").fill("Cliente Test");
  await page.locator("#city").fill("Gorizia");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#notes").fill(notes);
  await page.locator("#consent").check();
}

async function review(page, path = paths.at(-1), notes) {
  await page.goto("/preventivo.html");
  await completeDetails(page, path);
  await contacts(page, notes);
  await page.locator("#next-step").click();
  await expect(page.locator("#stage-title")).toHaveText("La tua richiesta, pronta da condividere.");
}

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  if (await page.locator("#quote-navigation").isVisible()) {
    const stage = await page.locator("#quiz-stage").boundingBox();
    const navigation = await page.locator("#quote-navigation").boundingBox();
    expect(navigation.y).toBeGreaterThanOrEqual(stage.y + stage.height - 1);
  }
  expect(await page.locator("#quiz-stage button, #quiz-stage strong, #quiz-stage h2, #quiz-stage input, #quiz-stage textarea").evaluateAll(nodes =>
    nodes.filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 2).map(el => el.textContent))).toEqual([]);
}

for (const path of paths) {
  test("quote route " + path.intent + "/" + path.branch, async ({ page }) => {
    const errors = [];
    const failures = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("response", response => { if (response.url().includes("/assets/") && response.status() >= 400) failures.push(response.url()); });
    await page.goto("/preventivo.html");
    await expect(page.locator("#next-step")).toBeHidden();
    await completeDetails(page, path);
    await expect(page.locator("#stage-title")).toHaveText("Come possiamo ricontattarti?");
    await expect(page.locator("[data-send]")).toHaveCount(0);
    await contacts(page);
    await page.locator("#prev-step").click();
    const last = path.questions.at(-1);
    if (last.type === "options") await page.locator("#quiz-stage [data-choice]").first().click();
    else await page.locator("#next-step").click();
    await expect(page.locator("#notes")).toHaveValue("Nota da conservare <script>alert(1)</script>");
    await page.locator("#next-step").click();
    await expect(page.locator("#quote-steps li").last()).toHaveAttribute("aria-current", "step");
    const message = await page.locator("#message-preview").inputValue();
    expect(message).toContain(branches[path.intent].subcategories[path.branch].label);
    expect(message).toContain("Comune: Gorizia");
    expect(message).toContain("<script>alert(1)</script>");
    await expect(page.locator("#quiz-stage script")).toHaveCount(0);
    await expect(page.locator("[data-send=whatsapp]")).toHaveAttribute("href", /^https:\/\/wa.me\/393930036372/);
    await expect(page.locator("[data-send=email]")).toHaveAttribute("href", /^mailto:info@eletwave.com/);
    for (const channel of ["whatsapp", "email"]) {
      const url = new URL(await page.locator("[data-send=" + channel + "]").getAttribute("href"));
      const body = url.searchParams.get(channel === "whatsapp" ? "text" : "body");
      if (body) expect(body).toBe(message);
    }
    await noOverflow(page);
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
  });
}

test("contact validation, review editing, branch changes and reset", async ({ page }) => {
  const path = paths.at(-1);
  await page.goto("/preventivo.html");
  await completeDetails(page, path);
  await page.locator("#next-step").click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  await contacts(page);
  await page.locator("#email").fill("invalid");
  await page.locator("#phone").fill("abc1234567");
  await page.locator("#next-step").click();
  await expect(page.locator("#phone")).toBeFocused();
  await expect(page.locator("[data-send]")).toHaveCount(0);
  await page.locator("#phone").fill("+39 333 1234567");
  await page.locator("#email").fill("");
  await page.locator("#next-step").click();
  await expect(page.locator("#message-preview")).toHaveValue(/Telefono: \+39 333 1234567/);

  await page.locator('[data-action="edit-answer"][data-index="0"]').click();
  await page.locator("#question-input").fill("Descrizione corretta");
  await page.locator("#next-step").click();
  await expect(page.locator("#message-preview")).toHaveValue(/Descrizione corretta/);
  await page.locator('[data-action="edit-contact"]').click();
  await page.locator("#city").fill("");
  await page.locator("#prev-step").click();
  await expect(page.locator("#message-preview")).toHaveValue(/Comune: Gorizia/);
  await page.locator('[data-action="edit-contact"]').click();
  await page.locator("#city").fill("");
  await page.locator("#next-step").click();
  await expect(page.locator("#city")).toBeFocused();
  await page.locator("#city").fill("Udine");
  await page.locator("#next-step").click();
  await expect(page.locator("#message-preview")).toHaveValue(/Comune: Udine/);

  await page.locator('#quiz-stage [data-action="edit-service"]').click();
  await selectPath(page, paths.find(p => p.branch === "wallbox"));
  await expect(page.locator(".choice[aria-pressed=true]")).toHaveCount(0);
  const wallbox = paths.find(p => p.branch === "wallbox");
  for (const q of wallbox.questions) await answer(page, q);
  await expect(page.locator("#city")).toHaveValue("Udine");
  await expect(page.locator("#consent")).not.toBeChecked();
  await page.locator("#consent").check();
  await page.locator("#next-step").click();
  await expect(page.locator("#message-preview")).not.toHaveValue(/Descrizione corretta/);
  await page.locator("#restart").click();
  await expect(page.locator("#reset-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#reset-dialog")).toBeHidden();
  await expect(page.locator("#stage-title")).toHaveText("La tua richiesta, pronta da condividere.");
  await page.locator("#restart").click();
  await page.locator('button[value="reset"]').click();
  await expect(page.locator("#stage-title")).toHaveText("Di quale impianto hai bisogno?");
  await expect(page.locator("#restart")).toBeHidden();
  await completeDetails(page, path);
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#consent")).not.toBeChecked();
  await page.locator("#name").fill("Non cancellare");
  await page.locator("#restart").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#name")).toHaveValue("Non cancellare");
});

test("multiple choice exclusivity, back navigation and unknown answers", async ({ page }) => {
  const path = paths.find(p => p.questions.some(q => q.type === "multi" && q.options.some(o => /^non so$/i.test(label(o)))));
  expect(path).toBeTruthy();
  await page.goto("/preventivo.html");
  await selectPath(page, path);
  const index = path.questions.findIndex(q => q.type === "multi" && q.options.some(o => /^non so$/i.test(label(o))));
  for (const q of path.questions.slice(0, index)) await answer(page, q);
  const q = path.questions[index];
  const normal = label(q.options.find(o => !/^non so$/i.test(label(o))));
  const unknown = label(q.options.find(o => /^non so$/i.test(label(o))));
  await page.getByLabel(normal, { exact: true }).check();
  await page.getByLabel(unknown, { exact: true }).check();
  await expect(page.getByLabel(normal, { exact: true })).not.toBeChecked();
  await page.getByLabel(normal, { exact: true }).check();
  await expect(page.getByLabel(unknown, { exact: true })).not.toBeChecked();
  await page.locator("#next-step").click();
  await page.locator("#prev-step").click();
  await expect(page.getByLabel(normal, { exact: true })).toBeChecked();
  await page.locator("[data-action=skip]").click();
  await page.locator("#prev-step").click();
  await expect(page.getByLabel(normal, { exact: true })).not.toBeChecked();
});

test("long request copy fallback, download and link encoding", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const longText = "è".repeat(1500);
  await review(page, paths.at(-1), longText);
  await expect(page.locator("#long-message-notice")).toBeVisible();
  await expect(page.locator("[data-send=whatsapp]")).toHaveAttribute("href", "https://wa.me/393930036372");
  expect(await page.locator("#message-preview").inputValue()).toContain(longText.trim());
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("Denied")) } }); });
  await page.locator("#copy-request").click();
  await expect(page.locator("#message-preview")).toBeFocused();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#download-request").click();
  expect(await readFile(await (await downloadPromise).path(), "utf8")).toContain(longText.trim());
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: text => { window.copiedRequest = text; return Promise.resolve(); } } }); });
  await page.locator("#copy-request").click();
  await expect(page.locator("#send-status")).toContainText("Testo copiato");
  expect(await page.evaluate(() => window.copiedRequest)).toContain(longText.trim());
  await noOverflow(page);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test("quote visual layout " + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/preventivo.html");
    await page.evaluate(() => document.fonts.ready);
    const logo = await page.locator(".quote-brand img").boundingBox();
    expect(Math.abs(logo.x + logo.width / 2 - width / 2)).toBeLessThan(10);
    await expect.poll(() => page.locator(".quote-brand img").evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("service.png"), fullPage: true });
    const path = paths.find(p => p.branch === "wallbox");
    await selectPath(page, path);
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("question.png"), fullPage: true });
    for (const q of path.questions) await answer(page, q);
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("contact.png"), fullPage: true });
    await contacts(page);
    await page.locator("#next-step").click();
    await noOverflow(page);
    await page.screenshot({ path: testInfo.outputPath("review.png"), fullPage: true });
  });
}

test("keyboard operation and no-JavaScript fallback", async ({ page, browser }) => {
  await page.goto("/preventivo.html");
  await page.locator('[data-choice="wallbox"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#stage-title")).toBeFocused();
  await page.locator('[data-choice="nuova_installazione"]').focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#stage-title")).toHaveText("Dove ricaricherai l'auto?");
  await page.locator("#prev-step").click();
  await expect(page.locator("#stage-title")).toHaveText("Che cosa vorresti fare?");
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await noJs.newPage();
  await fallback.goto("/preventivo.html");
  await expect(fallback.getByRole("link", { name: "scrivici su WhatsApp", exact: true })).toBeVisible();
  await expect(fallback.locator(".quote-steps")).toBeHidden();
  await expect(fallback.locator("#quote-workspace")).toBeHidden();
  await noJs.close();
});
