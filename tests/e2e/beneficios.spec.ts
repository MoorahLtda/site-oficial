import { expect, test } from "@playwright/test";
import { photos } from "../../src/content/site";

test.describe("Beneficios e portal do paciente", () => {
  test("o portal mostra as abas depois de entrar em vista", async ({ page }) => {
    await page.goto("/#beneficios");
    // Com a secao ancorada no topo, o mock do portal fica abaixo da dobra: as abas so entram
    // quando ele aparece de fato (useInView com amount 0.3), que e o comportamento pretendido.
    await page.locator("[data-portal-mock]").scrollIntoViewIfNeeded();
    const tablist = page.locator("#beneficios [role=tablist]");
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole("tab")).toHaveCount(3);
    await expect(tablist.getByRole("tab").first()).toHaveAttribute("aria-selected", "true");
  });

  test("ArrowRight na primeira aba seleciona a segunda", async ({ page }) => {
    await page.goto("/#beneficios");
    await page.locator("[data-portal-mock]").scrollIntoViewIfNeeded();
    const tabs = page.locator("#beneficios [role=tablist]").getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toBeFocused();
  });

  test("as celulas Portal e Exames trazem as fotos do manifesto", async ({ page }) => {
    await page.goto("/#beneficios");
    const portal = page.locator("#beneficios article:has([data-tile-header])");
    await expect(portal.locator("img")).toHaveAttribute("alt", photos.idosoTablet.alt);
    const exams = page.locator("#beneficios article:has([data-photo-overlay])");
    await expect(exams).toHaveCount(1);
    await expect(exams.locator("img")).toHaveAttribute("alt", photos.exame.alt);
    await expect(exams.locator("[data-photo-overlay]")).toHaveCount(1);
  });

  test("a rede de exames desenha cometas brancos sobre a foto", async ({ page }) => {
    await page.goto("/#beneficios");
    await page.locator("#beneficios article:has([data-photo-overlay])").scrollIntoViewIfNeeded();
    await expect(page.locator("#beneficios [data-comet]")).toHaveCount(8, { timeout: 4_000 });
  });
});
