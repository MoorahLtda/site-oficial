import { expect, test } from "@playwright/test";

test.describe("Footer", () => {
  test("rodape visivel ao final da pagina, com notas legais", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/não é plano de saúde/i)).toBeVisible();
    await expect(footer.getByText("Fotografias ilustrativas (Pexels)")).toBeVisible();
  });

  test("lockup vertical na primeira coluna, com o simbolo acima da palavra", async ({ page }) => {
    await page.goto("/");
    const lockup = page.getByRole("contentinfo").getByTestId("footer-lockup");
    await lockup.scrollIntoViewIfNeeded();

    const mark = lockup.locator('img[src*="moorah-mark.png"]');
    const wordmark = lockup.locator('img[src*="moorah-wordmark.png"]');
    await expect(mark).toBeVisible();
    await expect(wordmark).toBeVisible();

    const markBox = await mark.boundingBox();
    const wordBox = await wordmark.boundingBox();
    expect(markBox).not.toBeNull();
    expect(wordBox).not.toBeNull();
    if (!markBox || !wordBox) return;
    // Vertical: a palavra comeca abaixo do simbolo e os dois alinhados a esquerda.
    expect(wordBox.y).toBeGreaterThan(markBox.y + markBox.height - 1);
    expect(Math.abs(wordBox.x - markBox.x)).toBeLessThan(2);
    expect(markBox.height).toBeGreaterThanOrEqual(56);
    expect(markBox.width / markBox.height).toBeCloseTo(194 / 265, 1);
  });

  test("a marca d agua do rodape nao cria rolagem horizontal", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByTestId("footer-watermark")).toHaveAttribute("aria-hidden", "true");

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("no mobile, com o rodape em vista, a barra de CTA some", async ({ page, isMobile }) => {
    test.skip(!isMobile, "somente no projeto mobile");
    await page.goto("/");
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("cta-mobile")).toBeHidden();
  });
});
