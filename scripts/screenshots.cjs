const { chromium } = require("@playwright/test");
const out = process.argv[2];
// Ids da pagina depois do brief v4-secoes: Diferenciais saiu e Cartao foi fundido em #beneficios.
const ids = ["inicio","por-que","como-funciona","especialidades","beneficios","planos","duvidas","contato"];
(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(200); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);
  for (const id of ids) {
    const el = page.locator("#" + id);
    if (await el.count() === 0) { console.log("missing #" + id); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await el.screenshot({ path: out + "/desktop-" + id + ".png" });
  }
  await page.screenshot({ path: out + "/desktop-footer.png", clip: { x: 0, y: 0, width: 1366, height: 900 }, fullPage: false });
  const footer = page.locator("footer");
  if (await footer.count()) { await footer.scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); await footer.screenshot({ path: out + "/desktop-footer.png" }); }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
  const mh = await mobile.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < mh; y += 400) { await mobile.evaluate((v) => window.scrollTo(0, v), y); await mobile.waitForTimeout(150); }
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: out + "/mobile-top.png" });
  await mobile.evaluate(() => window.scrollTo(0, 1200));
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({ path: out + "/mobile-scrolled.png" });
  await mobile.screenshot({ path: out + "/mobile-full.png", fullPage: true });
  console.log("desktop height:", h, "mobile height:", mh);
  console.log("console errors:", JSON.stringify(errors, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
