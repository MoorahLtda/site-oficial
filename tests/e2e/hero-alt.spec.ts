import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/*
  Variante de preview do hero (docs/design-brief-v4-hero.md, secoes 3 e 11.2), em /previews/hero-alt.
  Checagens: rota nao indexavel com um h1 e CTAs prefixados; mobile 360x740 sem rolagem
  horizontal e com h1 e CTA primario na primeira tela; desktop 1440x900 com a foto carregada,
  nada por cima dela e o bloco fechando na dobra; reduced motion com a foto ja opaca; axe
  (wcag2a/aa, 2.1) sem violacoes serias ou criticas, como em landing.spec.ts.
*/

const ROUTE = "/previews/hero-alt";
const TITLE = "Um médico por vídeo, quando você precisar.";

async function box(page: Page, selector: string) {
  const locator = page.locator(selector).first();
  // boundingBox devolve null se o elemento ainda nao pintou; esperar a visibilidade primeiro
  // tira a corrida (vista uma vez no projeto mobile com o viewport de 1440).
  await expect(locator, `sem caixa para ${selector}`).toBeVisible();
  const rect = await locator.boundingBox();
  expect(rect, `sem caixa para ${selector}`).not.toBeNull();
  return rect as { x: number; y: number; width: number; height: number };
}

test.describe("Hero alternativo (/previews/hero-alt)", () => {
  test("nao indexa, tem um unico h1 com a frase completa e CTAs para as ancoras da home", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(TITLE);
    await expect(page.locator("#inicio")).toContainText("49,90");
    await expect(page.locator("#inicio")).toContainText("129,90");
    await expect(page.locator("#inicio")).toContainText("até 4 pessoas");

    const inicio = page.locator("#inicio");
    await expect(inicio.getByRole("link", { name: "Escolher meu plano" })).toHaveAttribute(
      "href",
      "/#planos",
    );
    await expect(inicio.getByRole("link", { name: "Como funciona" })).toHaveAttribute(
      "href",
      "/#como-funciona",
    );

    const text = await inicio.innerText();
    // Travessao (U+2014) como escape: o caractere nao pode existir nem no codigo.
    for (const forbidden of ["LGPD", "não é plano de saúde", "Cancele quando quiser", "\u2014"]) {
      expect(text, `texto proibido no hero: ${forbidden}`).not.toContain(forbidden);
    }
  });

  test("360x740: sem rolagem horizontal, h1 e CTA primario na primeira tela, arco da foto perto", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(ROUTE);
    await expect(page.locator("h1")).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);

    const header = await box(page, "header");
    const block = await box(page, "[data-hero-block]");
    expect(header.y + header.height).toBeLessThanOrEqual(block.y + 0.5);

    const h1 = await box(page, "h1");
    expect(h1.y + h1.height).toBeLessThanOrEqual(740);
    const cta = await box(page, '#inicio a[href="/#planos"]');
    expect(cta.y + cta.height).toBeLessThanOrEqual(740);

    // A borda do arco da foto entra no primeiro gesto de rolagem.
    const photo = await box(page, "[data-hero-photo]");
    expect(photo.y).toBeLessThan(740 + 60);
    // A copy termina antes da foto comecar: nada de texto sobre a pessoa.
    const copy = await box(page, "[data-hero-copy]");
    expect(copy.y + copy.height).toBeLessThanOrEqual(photo.y + 0.5);
  });

  test("1440x900: foto carregada com priority, nada de texto sobre ela e bloco fechando na dobra", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    const img = page.locator("#inicio [data-hero-photo] img");
    await expect(img).toHaveAttribute("fetchpriority", "high");
    const alt = (await img.getAttribute("alt")) ?? "";
    expect(alt.length).toBeGreaterThan(10);
    // 20 s: no projeto mobile (DPR 2,625) este viewport pede o maior bucket do otimizador de
    // imagens e o primeiro transcode em disco frio passa dos 10 s padrao.
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth), {
        timeout: 20_000,
      })
      .toBeGreaterThan(0);
    await expect(
      page.locator('head link[rel="preload"][as="image"][imagesrcset*="pexels"]'),
    ).toHaveCount(1);

    const block = await box(page, "[data-hero-block]");
    const photo = await box(page, "[data-hero-photo]");
    expect(photo.width).toBeGreaterThanOrEqual(0.5 * block.width);
    expect(block.y + block.height).toBeLessThanOrEqual(900);

    // Nenhum elemento com texto proprio intersecta o retangulo da camada da foto.
    const overlaps = await page.evaluate(() => {
      const layer = document.querySelector("[data-hero-photo]")?.getBoundingClientRect();
      if (!layer) return ["sem camada"];
      const hits: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(
        "#inicio h1, #inicio p, #inicio li, #inicio a, #inicio b, #inicio span",
      )) {
        if (el.closest("[data-hero-photo]")) continue;
        if (!el.innerText.trim()) continue;
        const r = el.getBoundingClientRect();
        const intersects =
          r.right > layer.left &&
          r.left < layer.right &&
          r.bottom > layer.top &&
          r.top < layer.bottom;
        if (intersects) hits.push(`${el.tagName}: ${el.innerText.slice(0, 40)}`);
      }
      return hits;
    });
    expect(overlaps, overlaps.join("\n")).toEqual([]);

    // Fade em CSS: a camada chega a opacidade 1 em ate 2 s.
    await expect
      .poll(
        () => page.locator("[data-hero-photo]").evaluate((el) => getComputedStyle(el).opacity),
        { timeout: 2000 },
      )
      .toBe("1");
  });

  test("reduced motion: a foto nasce no estado final, sem esperar o fade", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ROUTE);
    await expect(page.locator("h1")).toBeVisible();
    const opacity = await page
      .locator("[data-hero-photo]")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });

  test("nao tem violacoes de acessibilidade serias ou criticas", async ({ page }) => {
    await page.goto(ROUTE);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const severe = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(severe, severe.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`).join("\n")).toEqual(
      [],
    );
  });
});
