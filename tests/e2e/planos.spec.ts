import { expect, test } from "@playwright/test";
import { getPlan, photos } from "../../src/content/site";

test.describe("Planos", () => {
  test("escolher 2 pessoas atualiza o valor por pessoa do Familiar", async ({ page }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await planos.getByRole("radio", { name: "2" }).click();
    // Timeout padrao (10 s): sob carga a secao dinamica e a hidratacao chegam a passar de 2 s.
    await expect(planos.getByText(/64,95/)).toBeVisible();
  });

  test("escolher 1 pessoa destaca o Individual e mostra a dica", async ({ page }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await planos.getByRole("radio", { name: "1" }).click();
    await expect(planos.locator('[data-plan="individual"]')).toHaveAttribute("data-active", "true");
    await expect(planos.getByText(/a partir de 2 pessoas/i)).toBeVisible();
  });

  test("a foto da familia aparece com o chip flutuante do Familiar", async ({ page }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await expect(planos.locator("img").first()).toHaveAttribute("alt", photos.familiaSofa.alt);
    const chip = planos.locator("[data-plan-chip]");
    await expect(chip).toBeVisible();
    await expect(chip).toContainText(getPlan("familiar").name);
  });
});
