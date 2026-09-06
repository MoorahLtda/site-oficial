import { expect, test } from "@playwright/test";
import { manifesto, photos, problems } from "../../src/content/site";

/*
  Brief v4-secoes, 4.1: foto pessoaCasa grande sem nada por cima, tres dores em <ol>,
  manifesto tipografico, zero svg na secao.
*/
test.describe("Secao Por que a Moorah", () => {
  test("mostra a foto pessoaCasa visivel, sem legenda e sem svg na secao", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#por-que");
    await expect(section).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    const img = section.locator("figure img");
    await expect(img).toHaveAttribute("alt", photos.pessoaCasa.alt);
    await expect(img).toBeVisible();
    await expect(section.locator("figcaption")).toHaveCount(0);
    await expect(section.locator("svg")).toHaveCount(0);
  });

  test("tres dores como h3 dentro de ol e manifesto visivel ao rolar", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#por-que");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("ol > li")).toHaveCount(3);
    for (const problem of problems) {
      await expect(section.getByRole("heading", { level: 3, name: problem.title })).toBeAttached();
    }
    await section
      .getByRole("heading", { level: 3, name: manifesto.title })
      .scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 3, name: manifesto.title })).toBeVisible();
  });

  test("reduced motion: foto e dores visiveis sem depender da animacao", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#por-que");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("figure img")).toBeVisible();
    await expect(section.getByRole("heading", { level: 3, name: problems[0].title })).toBeVisible();
  });
});
