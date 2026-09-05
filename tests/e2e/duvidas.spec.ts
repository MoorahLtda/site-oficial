import { expect, test } from "@playwright/test";
import { faq } from "../../src/content/site";

test.describe("Duvidas", () => {
  test("segunda pergunta aberta por padrao e a primeira abre ao clicar", async ({ page }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    const first = section.getByRole("button", { name: faq[0].q });
    const second = section.getByRole("button", { name: faq[1].q });
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(section.getByRole("region", { name: faq[0].q })).toContainText(faq[0].a);
  });

  test("a secao nao traz cartao de emergencia nem menciona 192", async ({ page }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    await expect(section).not.toHaveAttribute("data-emergency-open");
    await expect(section.locator("[data-emergency]")).toHaveCount(0);
    await expect(section.getByText(/\b192\b|SAMU|LGPD/)).toHaveCount(0);
  });
});
