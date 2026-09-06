import { expect, test } from "@playwright/test";
import { photos, steps } from "../../src/content/site";

/*
  Brief v4-secoes, 4.2: foto idosoTablet a esquerda em lg, quatro passos como li filhos
  diretos de ol[aria-label="Passos"], sem trilha, sem cometa, sem nos que acendem.
*/
test.describe("Como funciona", () => {
  test("tem quatro passos com titulo nivel 3 dentro de ol 'Passos'", async ({ page }) => {
    await page.goto("/#como-funciona");
    const list = page.locator('#como-funciona ol[aria-label="Passos"]');
    await expect(list.locator(":scope > li")).toHaveCount(4);
    await expect(page.locator("#como-funciona h3")).toHaveCount(4);
    for (const step of steps) {
      await expect(
        page.locator("#como-funciona").getByRole("heading", { level: 3, name: step.title }),
      ).toBeAttached();
    }
  });

  test("no desktop a foto fica visivel a esquerda da lista", async ({ page, isMobile }) => {
    test.skip(isMobile, "duas colunas so a partir de lg");
    await page.goto("/#como-funciona");
    await page.mouse.wheel(0, 1);
    const img = page.locator("#como-funciona img");
    await expect(img).toHaveCount(1);
    await expect(img).toHaveAttribute("alt", photos.idosoTablet.alt);
    await expect(img).toBeVisible();
    // Medida em um unico evaluate: o HashScroll pode rolar a pagina entre dois boundingBox.
    const boxes = await page.evaluate(() => ({
      img: document.querySelector("#como-funciona img")?.getBoundingClientRect(),
      list: document
        .querySelector('#como-funciona ol[aria-label="Passos"]')
        ?.getBoundingClientRect(),
    }));
    if (!boxes.img || !boxes.list) throw new Error("bounding box indisponivel");
    expect(boxes.img.x + boxes.img.width).toBeLessThanOrEqual(boxes.list.x);
  });

  test("nao ha cometa, trilha nem nos que acendem", async ({ page }) => {
    await page.goto("/#como-funciona");
    await expect(page.locator("#como-funciona [data-comet]")).toHaveCount(0);
    await expect(page.locator("#como-funciona [data-track]")).toHaveCount(0);
    await expect(page.locator("#como-funciona [data-lit]")).toHaveCount(0);
  });

  test("reduced motion: os quatro passos ficam visiveis ao rolar", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#como-funciona");
    await section.scrollIntoViewIfNeeded();
    const items = section.locator('ol[aria-label="Passos"] > li');
    await expect(items).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(items.nth(i)).toBeVisible();
    }
  });
});
