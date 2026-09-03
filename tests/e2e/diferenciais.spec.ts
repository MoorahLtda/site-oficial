import { expect, test } from "@playwright/test";
import { differentiators, differentiatorsSection } from "../../src/content/site";

test.describe("Secao Diferenciais", () => {
  test("#diferenciais tem o h2 da secao e quatro headings de nivel 3", async ({ page }) => {
    await page.goto("/#diferenciais");
    const section = page.locator("#diferenciais");
    await expect(section).toHaveCount(1);
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      differentiatorsSection.title,
    );
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(differentiators.length);
  });
});
