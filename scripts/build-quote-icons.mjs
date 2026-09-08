import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";

const names = ["arrow-left", "arrow-right", "check", "chevron-right", "rotate-ccw", "phone", "mail", "message-circle", "copy", "download", "pencil", "x", "paperclip", "lock-keyhole", "plug-zap", "sun", "ev-charger", "shield-check", "wifi", "house", "calendar-days", "messages-square", "plus", "wrench", "sliders-horizontal", "clipboard-check", "package"];
const symbols = [];
for (const name of names) {
  const source = await readFile(new URL("../node_modules/lucide-static/icons/" + name + ".svg", import.meta.url), "utf8");
  const $ = load(source, { xmlMode: true });
  symbols.push('<symbol id="' + name + '" viewBox="0 0 24 24">' + $("svg").html().trim() + "</symbol>");
}
const license = await readFile(new URL("../node_modules/lucide-static/LICENSE", import.meta.url), "utf8");
await writeFile(new URL("../assets/quote-icons.svg", import.meta.url), '<!-- Lucide icons\n' + license.replaceAll("--", "==").trim() + '\n-->\n<svg xmlns="http://www.w3.org/2000/svg">\n' + symbols.join("\n") + "\n</svg>\n");
