import { inflateSync } from "node:zlib";
import { expect, type Page, test } from "@playwright/test";

/*
  Hero v4 "Em casa, com medico" (docs/design-brief-v4-hero.md, secao 11.1). Roda contra
  `npm run build && npm run start` com no maximo 4 workers (playwright.config.ts).
*/

const TITLE = "Um médico por vídeo, quando você precisar.";
// Travessao (U+2014) como escape: o caractere nao pode existir na pagina.
const EM_DASH = "\u2014";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function box(page: Page, selector: string): Promise<Box> {
  const locator = page.locator(selector).first();
  await expect(locator).toBeAttached();
  const rect = await locator.evaluate((element) => {
    const r = element.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  return rect;
}

async function childBoxes(page: Page, selector: string): Promise<Box[]> {
  return page
    .locator(selector)
    .first()
    .evaluate((element) =>
      Array.from(element.children).map((child) => {
        const r = child.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }),
    );
}

/*
  Le a cor de um pixel da tela: captura de 1x1 em PNG e decodificacao manual (IHDR para o tipo de
  cor, IDAT inflado; com uma so amostra na linha todos os filtros do PNG degeneram para o valor
  bruto). Evita dependencia nova so para ler um pixel.
*/
async function pixelAt(page: Page, x: number, y: number): Promise<[number, number, number]> {
  const png = await page.screenshot({
    clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 },
    animations: "disabled",
  });
  let offset = 8;
  let colorType = 6;
  const idat: Buffer[] = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") colorType = data[9] ?? 6;
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(idat));
  // raw[0] e o byte de filtro da linha; depois vem a amostra.
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 1;
  if (channels === 1) return [raw[1] ?? 0, raw[1] ?? 0, raw[1] ?? 0];
  return [raw[1] ?? 0, raw[2] ?? 0, raw[3] ?? 0];
}

test.describe("Hero: Em casa, com medico", () => {
  test("360x740: h1, preco e CTA primario dentro da dobra, texto abaixo da faixa da foto", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const h1 = await box(page, "h1");
    const price = await box(page, "#inicio [data-hero-price]");
    const cta = await page
      .locator("#inicio")
      .getByRole("link", { name: "Escolher meu plano" })
      .boundingBox();
    expect(cta).not.toBeNull();
    if (!cta) return;
    expect(h1.y + h1.height).toBeLessThanOrEqual(740);
    expect(price.y + price.height).toBeLessThanOrEqual(740);
    expect(cta.y + cta.height).toBeLessThanOrEqual(740);

    const block = await box(page, "#inicio [data-hero-block]");
    const copy = await box(page, "#inicio [data-hero-copy]");
    const photo = await box(page, "#inicio [data-hero-photo]");
    // O espacador (280 px) empurra a copy para depois da mascara chegar a transparente.
    expect(copy.y - block.y).toBeGreaterThanOrEqual(270);
    // A camada existe atras da copy, mas so o gradiente aparece onde a mascara e transparente.
    expect(photo.y + photo.height).toBeGreaterThanOrEqual(copy.y);
  });

  test("sem rolagem horizontal em 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });

  test("o bloco plum comeca abaixo do header", async ({ page, isMobile }) => {
    test.skip(isMobile, "medida do header fixo em desktop");
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("#inicio [data-hero-block]")).toBeVisible();
    const header = await box(page, "header");
    const block = await box(page, "#inicio [data-hero-block]");
    expect(header.y + header.height).toBeLessThanOrEqual(block.y);
  });

  test("1440x900: texto ate 52 % do bloco, fatos ate 62 %, bloco fecha na dobra", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "medida de desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const block = await box(page, "#inicio [data-hero-block]");
    for (const child of await childBoxes(page, "#inicio [data-hero-copy]")) {
      expect(child.x + child.width).toBeLessThanOrEqual(block.x + 0.52 * block.width);
    }
    const facts = await box(page, "#inicio [data-hero-facts]");
    expect(facts.x + facts.width).toBeLessThanOrEqual(block.x + 0.62 * block.width);
    expect(block.y + block.height).toBeLessThanOrEqual(900);
  });

  test("1024x768: texto so sobre area lisa (pixel a direita da copy e plum)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "medida de desktop");
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForFunction(() => {
      const img = document.querySelector<HTMLImageElement>("#inicio [data-hero-photo] img");
      return img?.complete === true && img.naturalWidth > 0;
    });
    const block = await box(page, "#inicio [data-hero-block]");
    const copy = await box(page, "#inicio [data-hero-copy]");
    const h1 = await box(page, "h1");
    for (const child of await childBoxes(page, "#inicio [data-hero-copy]")) {
      expect(child.x + child.width).toBeLessThanOrEqual(block.x + 0.6 * block.width);
    }
    const y = h1.y + h1.height / 2;
    const edge = await pixelAt(page, copy.x + copy.width + 4, y);
    const plum = await pixelAt(page, block.x + 8, y);
    for (let channel = 0; channel < 3; channel += 1) {
      expect(Math.abs((edge[channel] ?? 0) - (plum[channel] ?? 0))).toBeLessThanOrEqual(12);
    }
  });

  test("foto com alt, priority e um unico preload do Pexels no head", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("#inicio [data-hero-photo] img");
    const alt = await img.getAttribute("alt");
    expect(alt?.length ?? 0).toBeGreaterThan(10);
    await expect(img).toHaveAttribute("fetchpriority", "high");
    await expect
      .poll(() =>
        img.evaluate((element) => {
          const image = element as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        }),
      )
      .toBe(true);
    const preloads = page.locator('head link[rel="preload"][as="image"][imagesrcset*="pexels"]');
    await expect(preloads).toHaveCount(1);
    // Nenhum texto sobre a foto: a camada nao tem conteudo textual.
    expect((await page.locator("#inicio [data-hero-photo]").innerText()).trim()).toBe("");
  });

  test("a foto entra por fade em CSS e chega a opacidade 1", async ({ page }) => {
    await page.goto("/");
    const layer = page.locator("#inicio [data-hero-photo]");
    await expect
      .poll(() => layer.evaluate((element) => getComputedStyle(element).opacity), {
        timeout: 2_000,
      })
      .toBe("1");
  });

  test("com reduced motion a foto nasce opaca", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const layer = page.locator("#inicio [data-hero-photo]");
    await expect(layer).toBeAttached();
    // A regra global de reduced motion zera a duracao da animacao (0,01 ms), entao o estado final
    // (opacidade 1) chega no primeiro frame util. No build de producao o primeiro paint corre mais
    // que dois rAF, entao a leitura e por polling: prova a duracao zerada e o estado final, sem
    // depender do instante em que o navegador resolve o start time da animacao.
    const durationMs = await layer.evaluate(
      (element) => parseFloat(getComputedStyle(element).animationDuration) * 1000,
    );
    expect(durationMs).toBeLessThanOrEqual(1);
    await expect
      .poll(() => layer.evaluate((element) => getComputedStyle(element).opacity), {
        timeout: 2_000,
      })
      .toBe("1");
  });

  test("ausencias: rede, discos, cometas, faixa, mono, LGPD, plano de saude, CFM e travessao", async ({
    page,
  }) => {
    await page.goto("/");
    const inicio = page.locator("#inicio");
    await expect(inicio.locator("[data-trail-cluster]")).toHaveCount(0);
    await expect(inicio.locator("[data-photo-node]")).toHaveCount(0);
    await expect(inicio.locator("[data-comet]")).toHaveCount(0);
    await expect(inicio.locator("[data-hero-rotating]")).toHaveCount(0);
    await expect(inicio.getByRole("group", { name: "Especialidades disponíveis" })).toHaveCount(0);
    await expect(inicio.locator(".font-mono")).toHaveCount(0);
    const text = await inicio.innerText();
    expect(text).not.toMatch(/LGPD|não é plano de saúde|CFM|por dia/i);
    expect(text).not.toContain(EM_DASH);
  });

  test("h1 com a frase inteira e os dois precos visiveis no bloco", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(TITLE, { useInnerText: true });
    const inicio = page.locator("#inicio");
    await expect(inicio).toContainText("49,90");
    await expect(inicio).toContainText("129,90");
    await expect(inicio).toContainText("até 4 pessoas");
  });
});
