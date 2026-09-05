const { chromium } = require("@playwright/test");
const path = require("path");
const out = path.join(__dirname, "..", ".shots", "refs", "telemedicina-br");
const sites = [["vidia", "https://www.vidia.com.br/"], ["vidia-alt", "https://vidia.com.br/"]];
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  for (const [slug, url] of sites) {
    try {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);
      console.log(slug, page.url(), await page.title());
      await page.screenshot({ path: path.join(out, slug + "-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
      await ctx.close();
      break;
    } catch (e) { console.log(slug, "ERR", e.message.split("\n")[0]); }
  }
  await b.close();
})();
