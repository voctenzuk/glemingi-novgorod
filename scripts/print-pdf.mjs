import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/Users/vostenzuk/.claude/skills/gstack/package.json");
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = path.join(root, "print.html");
const out = process.argv[2] || path.join(root, "glemingi-novgorodskaya-oblast.pdf");

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const page = await browser.newPage();
await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.pdf({
  path: out,
  format: "A5",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: `<div></div>`,
  footerTemplate: `
    <div style="font-size:8px;width:100%;padding:0 10mm;color:#3d5340;font-family:Helvetica,sans-serif;display:flex;justify-content:space-between;">
      <span>У воды</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`,
  margin: { top: "8mm", bottom: "12mm", left: "0", right: "0" },
});
await browser.close();
console.log(out);
