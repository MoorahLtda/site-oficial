import { expect, test } from "@playwright/test";
import { manifesto, photos } from "../../src/content/site";

test.describe("Secao Por que a Moorah", () => {
  test("#por-que existe e, ao rolar ate ela, o rotulo do hub fica visivel", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#por-que");
    await expect(section).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    // Ha duas versoes da trilha (desktop e mobile); so uma esta visivel por vez.
    await expect(section.getByText(manifesto.hub).filter({ visible: true })).toBeVisible();
  });

  test("no desktop o hub acende em ate 3 s depois de entrar em vista", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "versao desktop da trilha");
    await page.goto("/");
    await page.locator("#por-que svg[data-layout='desktop']").scrollIntoViewIfNeeded();
    await expect(page.locator('[data-hub="desktop"]')).toHaveAttribute("data-state", "lit", {
      timeout: 3_000,
    });
  });

  test("a foto da consulta em casa aparece com a legenda", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#por-que");
    await section.scrollIntoViewIfNeeded();
    const figure = section.locator("figure");
    await expect(figure.locator("img")).toHaveAttribute("alt", photos.pacienteCama.alt);
    await expect(figure.locator("figcaption")).toHaveText("Consulta em casa");
  });
});
