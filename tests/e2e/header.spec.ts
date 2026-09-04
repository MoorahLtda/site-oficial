import { expect, test } from "@playwright/test";

test.describe("Header", () => {
  test("ganha fundo depois de rolar 24 px", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
  });

  test("o lockup de marca aparece no link para a home, no mobile e no desktop", async ({
    page,
  }) => {
    await page.goto("/");
    const home = page.getByRole("banner").getByRole("link", { name: /Moorah, página inicial/ });
    await expect(home).toBeVisible();

    const mark = home.locator('img[src*="moorah-mark.png"]');
    const wordmark = home.locator('img[src*="moorah-wordmark.png"]');
    await expect(mark).toBeVisible();
    await expect(wordmark).toBeVisible();
    await expect(home.locator("img")).toHaveCount(2);

    // Simbolo e palavra na mesma linha e sem distorcao (proporcao do arquivo: 194x265).
    const markBox = await mark.boundingBox();
    const wordBox = await wordmark.boundingBox();
    expect(markBox).not.toBeNull();
    expect(wordBox).not.toBeNull();
    if (!markBox || !wordBox) return;
    expect(markBox.height).toBeGreaterThanOrEqual(24);
    expect(markBox.width / markBox.height).toBeCloseTo(194 / 265, 1);
    expect(wordBox.x).toBeGreaterThan(markBox.x + markBox.width - 1);
  });

  test("link da nav leva a secao e recebe aria-current", async ({ page, isMobile }) => {
    test.skip(isMobile, "A nav principal so aparece a partir de lg.");
    await page.goto("/");
    const link = page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Especialidades" });
    await link.click();
    await expect(page).toHaveURL(/#especialidades$/);
    await expect(link).toHaveAttribute("aria-current", "true", { timeout: 2_000 });
  });

  test("documentos legais no topo: faixa no desktop (recolhe ao rolar) e menu no mobile", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    const banner = page.getByRole("banner");
    if (isMobile) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      const legal = page.getByRole("dialog").getByRole("navigation", { name: "Documentos legais" });
      await expect(legal.getByRole("link")).toHaveCount(3);
      await expect(legal.getByRole("link", { name: "Política de privacidade" })).toHaveAttribute(
        "href",
        "/privacidade",
      );
      return;
    }
    const bar = banner.getByTestId("legal-bar");
    const privacy = bar.getByRole("link", { name: "Política de privacidade" });
    await expect(privacy).toBeVisible();
    await expect(bar.getByRole("link")).toHaveCount(3);
    await expect(privacy).toHaveAttribute("href", "/privacidade");
    await expect(bar).toHaveJSProperty("inert", false);

    await page.mouse.wheel(0, 600);
    await expect(banner).toHaveAttribute("data-scrolled", "true");
    // A faixa fecha (altura zero) e sai do foco e da leitura.
    await expect.poll(async () => (await bar.boundingBox())?.height ?? 0).toBeLessThan(1);
    await expect(bar).toHaveJSProperty("inert", true);
  });
});
