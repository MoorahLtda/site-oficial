import { expect, test } from "@playwright/test";
import { cardSection, mocks } from "../../src/content/site";

function grouped(sample: string): string {
  return `${sample.slice(0, 4)} ${sample.slice(4, 8)} ${sample.slice(8, 12)}`;
}

test.describe("Cartao Moorah", () => {
  test("mostra o cartao com alt descritivo", async ({ page }) => {
    await page.goto("/#cartao");
    // Filtra pelo alt: o lockup da marca tambem tem img, com alt vazio (decorativo).
    const card = page.locator("#cartao").getByAltText(cardSection.imageAlt);
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("alt", cardSection.imageAlt);
  });

  test("abre o bloco plum com o lockup branco da marca", async ({ page }) => {
    await page.goto("/#cartao");
    const lockup = page.locator("#cartao [data-brand-lockup]");
    await expect(lockup).toBeVisible();
    await expect(lockup.locator("img")).toHaveCount(2);
    await expect(lockup.locator("img").first()).toHaveAttribute("src", /moorah-mark-white/);
    await expect(lockup.locator("img").last()).toHaveAttribute("src", /moorah-wordmark-white/);
  });

  test("o numero exemplo do titular e 1234 5678 9012", async ({ page }) => {
    await page.goto("/#cartao");
    await expect(page.locator("#cartao [data-card-number]")).toHaveAttribute(
      "aria-label",
      new RegExp(`${grouped(mocks.cardSamples[0])}$`),
    );
  });

  test("trocar para Dependente 2 muda o numero ilustrativo do cartao", async ({ page }) => {
    await page.goto("/#cartao");
    await page.locator("#cartao").getByRole("radio", { name: "Dependente 2" }).click();
    await expect(page.locator("#cartao [data-card-number]")).toHaveAttribute(
      "aria-label",
      new RegExp(`${grouped(mocks.cardSamples[2])}$`),
    );
  });
});
