// Verificacao do hero v4 "Em casa, com medico" no navegador real (Playwright + Edge), fora do
// painel do app. Uso: node scripts/check-hero.cjs [pasta-de-saida]. Mede o que a secao 11.1 do
// brief v4 pede e salva PNGs em <pasta>/main-<largura>.png.
//   WIDTHS=360,1440 node scripts/check-hero.cjs .shots/v4
//   BASE_URL=http://localhost:3000 (padrao)
const fs = require("node:fs");
const { chromium } = require("@playwright/test");

const out = process.argv[2] || ".shots/v4";
fs.mkdirSync(out, { recursive: true });
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const WIDTHS = (process.env.WIDTHS || "360,390,768,1024,1280,1366,1440,1920").split(",").map(Number);
const HEIGHTS = { 360: 740, 390: 844, 768: 1024, 1024: 768, 1280: 800, 1366: 768, 1440: 900, 1920: 1080 };

/*
  Geometria da pessoa na foto 17489833 (fracoes da imagem, medidas no mock 1440 do brief, 2.4):
  rosto x 61..70 %, y 7..28 %; celular e maos x 49..58 %, y 33..46 %; corpo x 49..86 %, y 7..100 %.
  O script projeta esses retangulos na tela a partir do object-fit: cover e do object-position da
  imagem e verifica se algum elemento de texto do hero os intersecta dentro da zona em que a
  mascara ainda deixa a foto aparecer (alfa > 0,1).
*/
const PERSON = {
  face: { x0: 0.61, x1: 0.7, y0: 0.07, y1: 0.28 },
  hands: { x0: 0.49, x1: 0.58, y0: 0.33, y1: 0.46 },
  body: { x0: 0.49, x1: 0.86, y0: 0.07, y1: 1 },
};

function measure(person) {
  const q = (s) => document.querySelector(s);
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  };
  const round = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v)]));
  const h1 = q("h1");
  const h1Style = getComputedStyle(h1);
  const fontSize = parseFloat(h1Style.fontSize);
  const lineH = fontSize * 1.04;
  const block = rect(q("[data-hero-block]"));
  const copy = q("[data-hero-copy]");
  const copyChildren = [...copy.children].map(rect);
  const facts = rect(q("[data-hero-facts]"));
  const layer = q("[data-hero-photo]");
  const layerBox = rect(layer);
  const img = layer.querySelector("img");
  const imgStyle = getComputedStyle(img);
  const [posX, posY] = imgStyle.objectPosition.split(" ").map((v) => parseFloat(v) / 100);
  const natural = { w: img.naturalWidth || 1920, h: img.naturalHeight || 1280 };
  const scale = Math.max(layerBox.w / natural.w, layerBox.h / natural.h);
  const rendered = { w: natural.w * scale, h: natural.h * scale };
  const offset = {
    x: layerBox.x + (layerBox.w - rendered.w) * posX,
    y: layerBox.y + (layerBox.h - rendered.h) * posY,
  };
  const project = (f) => ({
    x: offset.x + f.x0 * rendered.w,
    y: offset.y + f.y0 * rendered.h,
    right: offset.x + f.x1 * rendered.w,
    bottom: offset.y + f.y1 * rendered.h,
  });
  // Zona em que a mascara deixa a foto visivel (alfa > 0,1): lg+ horizontal a partir de 43 % da
  // camada; abaixo de lg vertical ate --hero-fade - 80px + 10 % do degrade.
  const lg = innerWidth >= 1024;
  const fade = parseFloat(getComputedStyle(q("[data-hero-block]")).getPropertyValue("--hero-fade"));
  const visible = lg
    ? { x: layerBox.x + 0.43 * layerBox.w, y: layerBox.y, right: layerBox.right, bottom: layerBox.bottom }
    : { x: layerBox.x, y: layerBox.y, right: layerBox.right, bottom: layerBox.y + fade - 72 };
  const clip = (a, b) => ({
    x: Math.max(a.x, b.x),
    y: Math.max(a.y, b.y),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
  });
  const intersects = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
  const textEls = [...q("#inicio").querySelectorAll("h1, p, a, li, b, span, strong")].filter(
    (el) => el.innerText && el.innerText.trim() !== "" && !layer.contains(el),
  );
  const zones = Object.fromEntries(
    Object.entries(person).map(([name, f]) => {
      const zone = clip(project(f), visible);
      const empty = zone.right <= zone.x || zone.bottom <= zone.y;
      const hits = empty
        ? []
        : textEls
            .filter((el) => intersects(rect(el), zone))
            .map((el) => `${el.tagName.toLowerCase()}:${el.innerText.trim().slice(0, 28)}`);
      return [name, { zone: empty ? null : round(zone), hits: [...new Set(hits)] }];
    }),
  );
  const cta = q('#inicio a[href="#planos"]');
  return {
    vw: innerWidth,
    vh: innerHeight,
    scrollW: document.documentElement.scrollWidth,
    headerBottom: Math.round(rect(q("header")).bottom),
    blockTop: Math.round(block.y),
    blockBottom: Math.round(block.bottom),
    blockW: Math.round(block.w),
    h1: {
      size: fontSize,
      weight: h1Style.fontWeight,
      family: h1Style.fontFamily.split(",")[0],
      lines: Math.round(rect(h1).h / lineH),
      right: Math.round(rect(h1).right),
    },
    copyTop: Math.round(rect(copy).y),
    copyRight: Math.round(Math.max(...copyChildren.map((c) => c.right))),
    copyRightPct: Math.round(((Math.max(...copyChildren.map((c) => c.right)) - block.x) / block.w) * 100),
    priceBottom: Math.round(rect(q("[data-hero-price]")).bottom),
    ctaBottom: Math.round(rect(cta).bottom),
    factsRight: Math.round(facts.right),
    factsBottom: Math.round(facts.bottom),
    photo: {
      x: Math.round(layerBox.x),
      w: Math.round(layerBox.w),
      h: Math.round(layerBox.h),
      opacity: getComputedStyle(layer).opacity,
      objectPosition: imgStyle.objectPosition,
      loaded: img.complete && img.naturalWidth > 0,
      natural,
      rendered: round(rendered),
      alt: img.alt.slice(0, 40),
      text: layer.innerText.trim(),
      fetchpriority: img.getAttribute("fetchpriority"),
    },
    person: zones,
    preloads: document.querySelectorAll('head link[rel="preload"][as="image"][imagesrcset*="pexels"]').length,
    mono: document.querySelectorAll("#inicio .font-mono").length,
    emDash: q("#inicio").innerText.includes("\u2014"),
  };
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const report = {};
  for (const w of WIDTHS) {
    const mobile = w < 768;
    const h = HEIGHTS[w] || (mobile ? 740 : 900);
    const page = await browser.newPage({
      viewport: { width: w, height: h },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text().slice(0, 160)}`);
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(4000);
    const r = await page.evaluate(measure, PERSON);
    await page.screenshot({ path: `${out}/main-${w}.png`, clip: { x: 0, y: 0, width: w, height: h } });
    report[w] = { ...r, errors };
    await page.close();
  }
  // Reduced motion em 1440: a foto nasce opaca.
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 120000 });
  const reduced = await rm.evaluate(measure, PERSON);
  report.reducedMotion1440 = { photoOpacity: reduced.photo.opacity, loaded: reduced.photo.loaded };
  await browser.close();
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
