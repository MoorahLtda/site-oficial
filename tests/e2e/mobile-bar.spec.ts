import { expect, test } from "@playwright/test";

test.describe("barra de CTA mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "somente no projeto mobile");

  test("some enquanto o hero esta em vista e aparece ao rolar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cta-mobile")).toHaveCount(0);
    // Ancora em vez de pixels: o hero mobile e mais alto desde que ganhou foto e faixa.
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("cta-mobile")).toBeVisible();
  });

  test("nao aparece com #planos em vista", async ({ page }) => {
    await page.goto("/#planos");
    await expect(page.locator("#planos")).toBeInViewport();
    await expect(page.getByTestId("cta-mobile")).toHaveCount(0);
  });

  test("nao aparece com #contato em vista e o botao Enviar fica livre", async ({ page }) => {
    await page.goto("/#contato");
    await expect(page.locator("#contato")).toBeInViewport();
    await expect(page.getByTestId("cta-mobile")).toHaveCount(0);
    // Com a barra desmontada, o botao de envio do formulario nao fica sob nada fixo.
    const submit = page.locator("#contato").getByRole("button", { name: "Enviar", exact: true });
    await submit.scrollIntoViewIfNeeded();
    await expect(submit).toBeVisible();
    await expect(page.getByTestId("cta-mobile")).toHaveCount(0);
  });
});
