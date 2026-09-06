import { expect, test } from "@playwright/test";
import { faq, faqSection } from "../../src/content/site";

test.describe("Duvidas", () => {
  test("titulo novo, segunda pergunta aberta por padrao e a primeira abre ao clicar", async ({
    page,
  }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(faqSection.title);
    const first = section.getByRole("button", { name: faq[0].q });
    const second = section.getByRole("button", { name: faq[1].q });
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(section.getByRole("region", { name: faq[0].q })).toContainText(faq[0].a);
  });

  test("sem card lateral, sem numeracao, e o ultimo item aberto mostra o link da privacidade", async ({
    page,
  }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    await expect(section.locator("[data-contact]")).toHaveCount(0);
    expect(await section.innerText()).not.toMatch(/\b0\d\b/);

    const last = faq[faq.length - 1];
    await section.getByRole("button", { name: last.q }).click();
    const link = section.getByRole("link", { name: last.link?.label ?? "" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/privacidade");
  });

  test("a secao nao traz cartao de emergencia nem menciona 192", async ({ page }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    await expect(section).not.toHaveAttribute("data-emergency-open");
    await expect(section.locator("[data-emergency]")).toHaveCount(0);
    await expect(section.getByText(/\b192\b|SAMU|LGPD/)).toHaveCount(0);
  });
});
