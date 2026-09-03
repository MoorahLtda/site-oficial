import { expect, test } from "@playwright/test";
import { photos } from "../../src/content/site";

test.describe("Como funciona", () => {
  test("tem quatro passos com titulo nivel 3", async ({ page }) => {
    await page.goto("/#como-funciona");
    const section = page.locator("#como-funciona");
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(4);
  });

  test("no desktop, os quatro nos acendem em ate 3 s ao rolar ate a secao", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "trilha horizontal so no desktop");
    await page.goto("/");
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();
    await expect(page.locator("#como-funciona [data-lit='true']")).toHaveCount(4, {
      timeout: 3_000,
    });
  });

  test("o passo 3 mostra a foto do medico dentro da moldura de video", async ({ page }) => {
    await page.goto("/#como-funciona");
    const photo = page.locator("#como-funciona [data-illustration] img");
    await expect(photo).toHaveCount(1);
    await expect(photo).toHaveAttribute("alt", photos.medicoVideo.alt);
    await expect(photo).toHaveAttribute("loading", "lazy");
  });

  test("no desktop a trilha ganha um cometa depois do desenho", async ({ page, isMobile }) => {
    test.skip(isMobile, "cometa so na trilha horizontal");
    await page.goto("/");
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();
    await expect(page.locator("#como-funciona [data-comet]")).toHaveCount(1, { timeout: 4_000 });
  });
});
