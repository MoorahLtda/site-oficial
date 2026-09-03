// Capturas das paginas legais. Uso: node scripts/screenshot-legal.cjs <pastaSaida>
const { chromium } = require("@playwright/test");
const out = process.argv[2];
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  for (const slug of ["termos", "privacidade", "lgpd"]) {
    const p = await b.newPage({ viewport: { width: 1366, height: 1000 } });
    await p.goto(`http://localhost:3000/${slug}`, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/legal-${slug}.png` });
    const info = await p.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      h1txt: document.querySelector("h1")?.textContent?.trim().slice(0, 60),
      secoes: document.querySelectorAll("article section").length,
      sumario: document.querySelectorAll('nav[aria-label="Sumario"] a, nav[aria-label="Sumário"] a').length,
      travessoes: (document.body.innerText.match(/\u2014/g) || []).length,
    }));
    console.log(slug, JSON.stringify(info));
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
