import { expect, test } from "@playwright/test";
import { faq } from "../../src/content/site";

const emergencyQuestion =
  faq.find((item) => item.a.includes("192"))?.q ?? "E em caso de emergência?";

test.describe("Duvidas", () => {
  test("abrir a pergunta de emergencia mostra o selo 192 e marca a secao", async ({ page }) => {
    await page.goto("/#duvidas");
    const section = page.locator("#duvidas");
    await section.getByRole("button", { name: emergencyQuestion }).click();
    const answer = section.getByRole("region", { name: emergencyQuestion });
    await expect(answer.getByText("192", { exact: true })).toBeVisible();
    await expect(section).toHaveAttribute("data-emergency-open", "true");
  });
});
