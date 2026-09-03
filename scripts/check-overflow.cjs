const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  for (const w of [390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true });
    await p.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(2500);
    const info = await p.evaluate(() => {
      const doc = document.documentElement;
      const vw = doc.clientWidth;
      const bad = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const right = r.right + window.scrollX;
        if (right > vw + 1) {
          bad.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || "").toString().slice(0, 90),
            right: Math.round(right),
            width: Math.round(r.width),
            txt: (el.textContent || "").trim().slice(0, 40),
          });
        }
      }
      // Mantem so os mais externos (quem realmente causa)
      return { vw, scrollWidth: doc.scrollWidth, count: bad.length, top: bad.slice(0, 14) };
    });
    console.log(`\n=== viewport ${w} | clientWidth ${info.vw} | scrollWidth ${info.scrollWidth} | elementos vazando: ${info.count} ===`);
    for (const e of info.top) console.log(`  ${e.tag} r=${e.right} w=${e.width} | ${e.cls} | "${e.txt}"`);
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
