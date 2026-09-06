import { expect, test } from "@playwright/test";
import { specialties, specialtiesSection } from "../../src/content/site";

/*
  Brief v4-secoes, 4.3: indice tipografico com 12 nomes, sem foto, sem svg, sem cometa.
  Duas colunas de 640 em diante; "Otorrinolaringologia" em uma linha em 1024 e 1440.
  Medidas de layout em um unico evaluate: o HashScroll reafirma a ancora por 2 s e duas
  chamadas boundingBox seguidas podem ler a pagina em posicoes de rolagem diferentes.
*/
test.describe("Especialidades", () => {
  test("lista as 12 especialidades com o titulo novo, sem foto e sem svg", async ({ page }) => {
    await page.goto("/#especialidades");
    const section = page.locator("#especialidades");
    await expect(section.locator('ul[aria-label="Especialidades disponíveis"] > li')).toHaveCount(
      12,
    );
    await expect(
      section.getByRole("heading", { level: 2, name: specialtiesSection.title }),
    ).toBeVisible();
    await expect(section.locator("img")).toHaveCount(0);
    await expect(section.locator("svg")).toHaveCount(0);
    await expect(section.locator("[data-comet]")).toHaveCount(0);
  });

  test("duas colunas a partir de 640: os dois primeiros itens dividem a mesma linha", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "em 360 a lista fica em uma coluna");
    await page.goto("/#especialidades");
    await page.mouse.wheel(0, 1);
    const items = page.locator('#especialidades ul[aria-label="Especialidades disponíveis"] > li');
    await expect(items.first()).toBeVisible();
    const boxes = await page.evaluate(() => {
      const [first, second] = Array.from(
        document.querySelectorAll(
          '#especialidades ul[aria-label="Especialidades disponíveis"] > li',
        ),
      ).map((li) => li.getBoundingClientRect());
      return { first, second };
    });
    expect(Math.abs(boxes.first.y - boxes.second.y)).toBeLessThanOrEqual(2);
    expect(boxes.second.x).toBeGreaterThan(boxes.first.x + boxes.first.width - 2);
  });

  for (const width of [1024, 1440]) {
    test(`"Otorrinolaringologia" cabe em uma linha em ${width}`, async ({ page, isMobile }) => {
      test.skip(isMobile, "medida de desktop");
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/#especialidades");
      await page.mouse.wheel(0, 1);
      const name = page.locator("#especialidades h3", { hasText: "Otorrinolaringologia" });
      await expect(name).toBeAttached();
      const measure = await name.evaluate((el) => ({
        height: el.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(getComputedStyle(el).lineHeight) || 0,
      }));
      expect(measure.height).toBeLessThanOrEqual(measure.lineHeight * 1.5);
    });
  }

  test("reduced motion: a lista inteira fica visivel ao rolar", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#especialidades");
    await section.scrollIntoViewIfNeeded();
    const items = section.locator('ul[aria-label="Especialidades disponíveis"] > li');
    await expect(items).toHaveCount(12);
    await expect(items.first()).toBeVisible();
    await expect(items.last()).toBeVisible();
    expect(specialties).toHaveLength(12);
  });
});
