const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const out = path.join(__dirname, "..", ".shots", "refs", "telemedicina-br");
fs.mkdirSync(out, { recursive: true });
const sites = [
  ["clicklife", "https://clicklifesaude.com/"],
  ["clicksaude", "https://www.clicksaude.com.br/"],
  ["drconsulta", "https://www.drconsulta.com/"],
  ["conexa", "https://www.conexasaude.com.br/"],
  ["docway", "https://www.docway.com.br/"],
  ["valesaudesempre", "https://www.valesaudesempre.com.br/"],
  ["cartaodetodos", "https://www.cartaodetodos.com.br/"],
  ["temsaude", "https://www.temsaude.com/"],
  ["medprev", "https://saude.medprev.online/telemedicina-nova/"],
  ["doutorja", "https://www.doutorja.com.br/"],
  ["saudeid", "https://www.saudeid.com.br/"],
  ["kompa", "https://www.kompa.com.br/"],
  ["einstein", "https://telemedicina.einstein.br/"],
  ["vidia", "https://www.vidia.com.br/"],
  ["facilitta", "https://www.facilittasaude.com.br/"],
  ["televida", "https://televida.med.br/"],
  ["prontosocorroonline", "https://www.prontosocorroonline.com.br/"],
  ["cliam", "https://cliamtelemedicina.com.br/"],
];
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const results = [];
  for (const [slug, url] of sites) {
    const r = { slug, url, desktop: false, mobile: false, title: "", finalUrl: "", err: "" };
    try {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0" });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(3500);
      r.title = await page.title();
      r.finalUrl = page.url();
      await page.screenshot({ path: path.join(out, slug + "-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
      r.desktop = true;
      // grab hero text
      try {
        r.h1 = await page.locator("h1").first().innerText({ timeout: 3000 });
      } catch (e) { r.h1 = ""; }
      await ctx.close();
    } catch (e) { r.err += "desktop: " + e.message.split("\n")[0] + "; "; }
    try {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2, locale: "pt-BR",
        userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36" });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(3500);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.screenshot({ path: path.join(out, slug + "-mobile.png"), clip: { x: 0, y: 0, width: 390, height: Math.min(h, 4000) }, fullPage: true });
      r.mobile = true;
      await ctx.close();
    } catch (e) { r.err += "mobile: " + e.message.split("\n")[0] + "; "; }
    console.log(JSON.stringify(r));
    results.push(r);
  }
  await b.close();
  fs.writeFileSync(path.join(out, "_results.json"), JSON.stringify(results, null, 2));
})();
