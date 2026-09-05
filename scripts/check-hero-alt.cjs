// Verificacao da variante do hero (/previews/hero-alt) no navegador real (Playwright + Edge).
// Uso: node scripts/check-hero-alt.cjs [pasta-de-saida]. WIDTHS=360,1024,... para escolher larguras.
// Mede scrollWidth, header x bloco, linhas do h1, foto carregada, preload e a sobreposicao entre
// cada elemento de texto e o retangulo estimado da pessoa na foto (a partir de object-position).
const fs = require("node:fs");
const { chromium } = require("@playwright/test");
const out = process.argv[2] || ".shots/v4";
fs.mkdirSync(out, { recursive: true });
const WIDTHS = (process.env.WIDTHS || "360,1024,1280,1440,1920").split(",").map(Number);
const HEIGHTS = { 360: 740, 390: 844, 768: 1024, 1024: 768, 1280: 800, 1366: 768, 1440: 900, 1920: 1080 };
const URL = process.env.URL || "http://localhost:3000/previews/hero-alt";

/*
  Geometria da foto 27176483 (1920x1280), lida na imagem original, em fracoes da imagem:
  mae + bebe x 0.17..0.75, y 0.08..1.00; filho maior x 0.68..0.85, y 0.02..0.48;
  celular x 0.62..0.74, y 0.74..0.88. O script projeta essas caixas pela regra de object-fit: cover
  e object-position e verifica se algum texto do hero cai dentro delas.
*/
const PEOPLE = {
  maeBebe: { x0: 0.17, y0: 0.08, x1: 0.75, y1: 1 },
  filho: { x0: 0.68, y0: 0.02, x1: 0.85, y1: 0.48 },
  celular: { x0: 0.62, y0: 0.74, x1: 0.74, y1: 0.88 },
};

function measure(people) {
  const q = (s) => document.querySelector(s);
  const box = (el) => (el ? el.getBoundingClientRect() : null);
  const h1 = q("h1");
  const fontSize = parseFloat(getComputedStyle(h1).fontSize);
  const lineH = fontSize * 1.04;
  const block = box(q("[data-hero-block]"));
  const copy = box(q("[data-hero-copy]"));
  const facts = box(q("[data-hero-facts]"));
  const layerEl = q("[data-hero-photo]");
  const layer = box(layerEl);
  const img = layerEl.querySelector("img");
  const imgStyle = getComputedStyle(img);
  const [posX, posY] = imgStyle.objectPosition.split(" ").map((v) => parseFloat(v) / 100);
  // object-fit: cover da imagem 3:2 na camada.
  const natural = { w: 1920, h: 1280 };
  const scale = Math.max(layer.width / natural.w, layer.height / natural.h);
  const rendered = { w: natural.w * scale, h: natural.h * scale };
  const offsetX = (layer.width - rendered.w) * posX;
  const offsetY = (layer.height - rendered.h) * posY;
  const project = (b) => ({
    left: layer.left + offsetX + b.x0 * rendered.w,
    top: layer.top + offsetY + b.y0 * rendered.h,
    right: layer.left + offsetX + b.x1 * rendered.w,
    bottom: layer.top + offsetY + b.y1 * rendered.h,
  });
  const clampToLayer = (r) => ({
    left: Math.max(r.left, layer.left),
    top: Math.max(r.top, layer.top),
    right: Math.min(r.right, layer.right),
    bottom: Math.min(r.bottom, layer.bottom),
  });
  const personRects = Object.fromEntries(
    Object.entries(people).map(([k, b]) => [k, clampToLayer(project(b))]),
  );
  const texts = [
    ...document.querySelectorAll("#inicio h1, #inicio p, #inicio li, #inicio a, #inicio b, #inicio span"),
  ].filter((el) => !el.closest("[data-hero-photo]") && el.innerText.trim());
  const intersects = (a, b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
  const overlapsLayer = texts
    .filter((el) => intersects(el.getBoundingClientRect(), layer))
    .map((el) => `${el.tagName}: ${el.innerText.slice(0, 40)}`);
  const overlapsPerson = [];
  for (const el of texts) {
    const r = el.getBoundingClientRect();
    for (const [k, p] of Object.entries(personRects)) {
      if (intersects(r, p)) overlapsPerson.push(`${k} <- ${el.tagName}: ${el.innerText.slice(0, 40)}`);
    }
  }
  const textRight = Math.max(...texts.map((el) => el.getBoundingClientRect().right));
  const preloads = [...document.querySelectorAll('head link[rel="preload"][as="image"]')].map((l) =>
    (l.getAttribute("imagesrcset") || l.getAttribute("href") || "").slice(0, 60),
  );
  const cta = box(q('#inicio a[href$="#planos"]'));
  return {
    vw: innerWidth,
    scrollW: document.documentElement.scrollWidth,
    headerBottom: Math.round(box(q("header")).bottom),
    blockTop: Math.round(block.top),
    blockBottom: Math.round(block.bottom),
    blockW: Math.round(block.width),
    h1: {
      size: fontSize,
      weight: getComputedStyle(h1).fontWeight,
      lines: Math.round(h1.getBoundingClientRect().height / lineH),
      bottom: Math.round(h1.getBoundingClientRect().bottom),
      family: getComputedStyle(h1).fontFamily.split(",")[0],
    },
    copy: { right: Math.round(copy.right), bottom: Math.round(copy.bottom) },
    textRight: Math.round(textRight),
    ctaBottom: Math.round(cta.bottom),
    facts: facts ? { right: Math.round(facts.right), top: Math.round(facts.top), bottom: Math.round(facts.bottom) } : null,
    photo: {
      x: Math.round(layer.left),
      y: Math.round(layer.top),
      w: Math.round(layer.width),
      h: Math.round(layer.height),
      opacity: getComputedStyle(layerEl).opacity,
      objectPosition: imgStyle.objectPosition,
      loaded: img.complete && img.naturalWidth > 0,
      naturalWidth: img.naturalWidth,
      fetchpriority: img.getAttribute("fetchpriority"),
      alt: img.alt.slice(0, 40),
      text: layerEl.innerText.trim(),
    },
    personRects: Object.fromEntries(
      Object.entries(personRects).map(([k, r]) => [
        k,
        { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) },
      ]),
    ),
    overlapsLayer,
    overlapsPerson,
    preloads,
    robots: q('meta[name="robots"]')?.content || null,
  };
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const report = {};
  for (const w of WIDTHS) {
    const mobile = w < 768;
    const height = HEIGHTS[w] || (mobile ? 740 : 900);
    const page = await browser.newPage({
      viewport: { width: w, height },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text().slice(0, 160)}`);
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    await page.goto(URL, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(4000);
    const r = await page.evaluate(measure, PEOPLE);
    await page.screenshot({ path: `${out}/alt-${w}.png`, clip: { x: 0, y: 0, width: w, height } });
    if (mobile) {
      await page.screenshot({ path: `${out}/alt-${w}-full.png`, fullPage: true });
    }
    report[w] = { ...r, errors };
    await page.close();
  }
  // Reduced motion em 1440: a foto nasce opaca.
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto(URL, { waitUntil: "load", timeout: 120000 });
  report.reducedMotion1440 = await rm.evaluate(
    () => getComputedStyle(document.querySelector("[data-hero-photo]")).opacity,
  );
  await browser.close();
  fs.writeFileSync(`${out}/alt-report.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
