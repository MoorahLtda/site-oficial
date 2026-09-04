// Auditoria de tipografia: que familia cada tipo de elemento usa de fato no navegador.
// Uso: node scripts/check-fonts.cjs  (servidor em http://localhost:3000)
const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  await p.goto("http://localhost:3000/", { waitUntil: "load", timeout: 120000 });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const first = (f) => f.split(",")[0].replace(/"/g, "").trim();
    const groups = {
      h1: "h1", h2: "h2", h3: "h3", p: "main p", eyebrow: ".eyebrow", nav: "header nav a",
      button: "a[href='#planos']", mono: ".font-mono", li: "main li", input: "input", label: "label", footer: "footer p",
    };
    const out = {};
    for (const [k, sel] of Object.entries(groups)) {
      const els = Array.from(document.querySelectorAll(sel)).slice(0, 40);
      const fams = new Map();
      for (const el of els) {
        const cs = getComputedStyle(el);
        const key = `${first(cs.fontFamily)} ${cs.fontWeight}`;
        fams.set(key, (fams.get(key) || 0) + 1);
      }
      out[k] = { n: els.length, fams: Object.fromEntries(fams) };
    }
    // Familias carregadas de fato
    out.loaded = Array.from(document.fonts).filter(f => f.status === "loaded").map(f => `${f.family} ${f.weight}`).slice(0, 12);
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
