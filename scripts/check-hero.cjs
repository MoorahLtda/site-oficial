// Verificacao do hero v3 no navegador real (Playwright + Edge), fora do painel do app.
// Uso: node scripts/check-hero.cjs [pasta-de-saida]. Mede o que a secao 7.15 do brief pede.
const fs = require("node:fs");
const { chromium } = require("@playwright/test");
const out = process.argv[2] || "shots/v3";
fs.mkdirSync(out, { recursive: true });
const WIDTHS = (process.env.WIDTHS || "360,1024,1280,1440,1920").split(",").map(Number);

function measure() {
  const q = (s) => document.querySelector(s);
  const box = (el) => (el ? el.getBoundingClientRect() : null);
  const h1 = q("h1");
  const staticLine = h1.querySelector("span.block");
  const fontSize = parseFloat(getComputedStyle(h1).fontSize);
  const lineH = fontSize * 1.02;
  const svg = q("#inicio svg[data-trail-cluster]");
  const paths = [...svg.querySelectorAll("path")].filter((p) => !p.hasAttribute("data-comet"));
  const dash = getComputedStyle(paths[0]).strokeDasharray;
  const hub = q("[data-hero-mark]");
  const copy = box(q("[data-hero-copy]"));
  const net = box(q("[data-hero-network]"));
  const discs = [...document.querySelectorAll("[data-photo-node]")].map((d) => {
    const inner = d.firstElementChild;
    const b = d.getBoundingClientRect();
    const img = d.querySelector("[data-photo-current] img");
    return {
      id: d.dataset.photoNode,
      w: Math.round(b.width),
      opacity: getComputedStyle(inner).opacity,
      photoIndex: d.dataset.photoIndex,
      alt: img ? img.alt.slice(0, 30) : null,
      loaded: img ? img.complete && img.naturalWidth > 0 : false,
      text: d.innerText.trim(),
    };
  });
  return {
    vw: innerWidth,
    scrollW: document.documentElement.scrollWidth,
    headerBottom: Math.round(box(q("header")).bottom),
    blockTop: Math.round(box(q("[data-hero-block]")).top),
    blockBottom: Math.round(box(q("[data-hero-block]")).bottom),
    h1: {
      size: fontSize,
      weight: getComputedStyle(h1).fontWeight,
      staticLines: Math.round(staticLine.getBoundingClientRect().height / lineH),
      totalLines: Math.round(h1.getBoundingClientRect().height / lineH),
      family: getComputedStyle(h1).fontFamily.split(",")[0],
    },
    copyRight: copy ? Math.round(copy.right) : null,
    net: net ? { x: Math.round(net.x), w: Math.round(net.width), right: Math.round(net.right) } : null,
    hubW: hub ? Math.round(hub.getBoundingClientRect().width) : null,
    trailDash: dash,
    active: svg.dataset.active || null,
    confirmed: svg.querySelector('[data-state="confirmed"]') ? true : false,
    comets: document.querySelectorAll("[data-comet]").length,
    pulse: document.querySelectorAll("[data-hub-pulse]").length,
    discs,
    ctaTop: Math.round(box(q('#inicio a[href="#planos"]')).top),
    ctaBottom: Math.round(box(q('#inicio a[href="#planos"]')).bottom),
    marqueeDuration: getComputedStyle(q("#inicio .animate-marquee")).animationDuration,
  };
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const report = {};
  for (const w of WIDTHS) {
    const mobile = w < 768;
    const page = await browser.newPage({
      viewport: { width: w, height: mobile ? 740 : 900 },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text().slice(0, 160)}`);
    });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(3500);
    const r = await page.evaluate(measure);
    // Espera o primeiro compasso (4,2 s) acender um no.
    let activeSeen = null;
    try {
      await page.waitForSelector('#inicio svg[data-trail-cluster][data-active]', { timeout: 9000 });
      activeSeen = await page.evaluate(() => document.querySelector("#inicio svg[data-trail-cluster]").dataset.active);
    } catch {}
    const after = await page.evaluate(measure);
    await page.screenshot({ path: `${out}/hero-${w}.png`, clip: { x: 0, y: 0, width: w, height: mobile ? 740 : 900 } });
    report[w] = { ...r, activeSeen, photoIndexesAfter: after.discs.map((d) => d.photoIndex), errors };
    await page.close();
  }
  // Reduced motion em 1440: nada se move, primeira foto em cada disco, estado final imediato.
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
  await rm.waitForTimeout(6000);
  report.reducedMotion1440 = await rm.evaluate(measure);
  await rm.screenshot({ path: `${out}/hero-1440-reduced.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await browser.close();
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
