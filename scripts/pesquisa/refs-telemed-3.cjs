const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const out = path.join(__dirname, "..", ".shots", "refs", "telemedicina-br");
const sites = [
  ["temsaude", "https://www.temsaude.com/", true],
  ["prontosocorroonline", "https://www.prontosocorroonline.com.br/", false],
  ["facilitta", "https://www.facilittasaude.com.br/", false],
  ["clicklife", "https://clicklifesaude.com/", false],
  ["medprev", "https://saude.medprev.online/telemedicina-nova/", false],
  ["clicksaude", "https://www.clicksaude.com.br/", false],
  ["conexa", "https://www.conexasaude.com.br/", false],
  ["drconsulta", "https://www.drconsulta.com/", false],
  ["valesaudesempre", "https://www.valesaudesempre.com.br/", false],
  ["cartaodetodos", "https://www.cartaodetodos.com.br/", false],
  ["einstein", "https://telemedicina.einstein.br/", false],
  ["televida", "https://televida.med.br/", false],
  ["cliam", "https://cliamtelemedicina.com.br/", false],
  ["docway", "https://www.docway.com.br/", false],
  ["kompa", "https://www.kompa.com.br/", false],
  ["saudeid", "https://www.saudeid.com.br/", false],
];
const probe = () => {
  const h1 = document.querySelector("h1");
  const cs = h1 ? getComputedStyle(h1) : null;
  const bodyFont = getComputedStyle(document.body).fontFamily;
  const btn = [...document.querySelectorAll("a,button")].find(e => /assin|agend|consult|contrat|come|saiba|falar|entre/i.test(e.innerText || "") && e.getBoundingClientRect().top < 900 && e.getBoundingClientRect().width > 80);
  const bcs = btn ? getComputedStyle(btn) : null;
  const html = document.documentElement.outerHTML;
  const libs = ["swiper", "slick", "aos", "gsap", "lottie", "framer", "wow.js", "animate.css", "elementor", "wp-content", "webflow", "next", "nuxt", "react", "vue", "splide", "owl-carousel", "typed", "countup", "wistia", "vimeo", "youtube"].filter(l => html.toLowerCase().includes(l));
  const vids = document.querySelectorAll("video").length;
  const animated = [...document.querySelectorAll("*")].filter(e => { const s = getComputedStyle(e); return (s.animationName && s.animationName !== "none") || (s.transitionDuration && s.transitionDuration !== "0s" && s.transitionDuration !== "0s, 0s"); }).length;
  const keyframes = [...document.styleSheets].reduce((n, ss) => { try { return n + [...ss.cssRules].filter(r => r.type === 7).length; } catch (e) { return n; } }, 0);
  const prices = (document.body.innerText.match(/R\$\s?\d+[\.,]?\d*/g) || []).slice(0, 8);
  return {
    h1: h1 ? h1.innerText.trim().slice(0, 200) : "", h1Font: cs ? cs.fontFamily : "", h1Size: cs ? cs.fontSize : "", h1Weight: cs ? cs.fontWeight : "", h1Color: cs ? cs.color : "",
    bodyFont, cta: btn ? btn.innerText.trim().slice(0, 60) : "", ctaBg: bcs ? bcs.backgroundColor : "", ctaRadius: bcs ? bcs.borderRadius : "",
    libs, vids, animated, keyframes, prices,
  };
};
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const results = [];
  for (const [slug, url, closeModal] of sites) {
    const r = { slug, url };
    try {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
      await page.waitForTimeout(7000);
      if (closeModal) {
        await page.keyboard.press("Escape").catch(() => {});
        await page.waitForTimeout(500);
        const x = page.locator("[class*=close], [aria-label*=echar], [aria-label*=lose]").first();
        if (await x.count()) await x.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(1500);
      }
      Object.assign(r, await page.evaluate(probe));
      await page.screenshot({ path: path.join(out, slug + "-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 900 } });
      await ctx.close();
    } catch (e) { r.err = e.message.split("\n")[0]; }
    console.log(JSON.stringify(r));
    results.push(r);
  }
  await b.close();
  fs.writeFileSync(path.join(out, "_probe.json"), JSON.stringify(results, null, 2));
})();
