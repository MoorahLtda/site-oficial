import { expect, test } from "@playwright/test";
import { photos } from "../../src/content/site";

test.describe("Especialidades", () => {
  test("lista as 12 especialidades", async ({ page }) => {
    await page.goto("/#especialidades");
    await expect(page.locator("#especialidades li")).toHaveCount(12);
  });

  test("hover em Pediatria acende o no 1 da Trilha da Amora (desktop)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "o cluster fica oculto abaixo de lg");
    await page.goto("/#especialidades");
    const row = page.locator('#especialidades [data-specialty="1"]');
    await expect(row.getByRole("heading", { level: 3, name: "Pediatria" })).toBeVisible();
    await row.hover();
    await expect(page.locator('#especialidades [data-node="1"]')).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  test("a coluna sticky mostra a foto da medica com o cluster por cima (desktop)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "a coluna sticky existe a partir de lg");
    await page.goto("/#especialidades");
    const block = page.locator("#especialidades [data-specialties-photo]");
    await expect(block).toBeVisible();
    await expect(block.locator("img")).toHaveAttribute("alt", photos.medicaSorrindo.alt);
    await expect(block.locator("svg[data-trail-cluster]")).toBeVisible();
  });

  test("o cluster mini ganha cometas depois do desenho (desktop)", async ({ page, isMobile }) => {
    test.skip(isMobile, "o cluster fica oculto abaixo de lg");
    await page.goto("/");
    await page.locator("#especialidades [data-specialties-photo]").scrollIntoViewIfNeeded();
    await expect(page.locator("#especialidades [data-comet]")).toHaveCount(12, { timeout: 4_000 });
  });
});
