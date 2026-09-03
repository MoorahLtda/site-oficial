import { expect, test } from "@playwright/test";
import { finalCta, photos } from "../../src/content/site";

// CTA final e formulario (docs/design-brief.md, 5.12). A API e interceptada: nenhum lead real sai.
test.describe("Contato: formulario de lead", () => {
  test("envio valido mostra a confirmacao em role=status", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );
    await page.goto("/#contato");
    const contato = page.locator("#contato");
    await contato.getByLabel("Nome", { exact: true }).fill("Maria Exemplo");
    await contato.getByLabel("E-mail", { exact: true }).fill("maria@exemplo.com.br");
    await contato.getByRole("checkbox").check();
    await contato.getByRole("button", { name: "Quero assinar" }).click();
    await expect(contato.getByRole("status")).toContainText("Recebemos seu pedido.");
  });

  test("envio vazio marca o campo Nome como invalido", async ({ page }) => {
    await page.goto("/#contato");
    const contato = page.locator("#contato");
    const nome = contato.getByLabel("Nome", { exact: true });
    await expect(nome).toBeVisible();
    await contato.getByRole("button", { name: "Quero assinar" }).click();
    await expect(contato.getByText("Informe seu nome.")).toBeVisible();
    await expect(nome).toHaveAttribute("aria-invalid", "true");
  });
});

// Marca presente e fotografia (docs/design-brief-v2.md, itens 1 e 2).
test.describe("Contato: marca e foto", () => {
  test("mostra o lockup branco, a foto retrato e o CTA para #planos", async ({ page }) => {
    await page.goto("/#contato");
    const contato = page.locator("#contato");

    const lockup = contato.locator("[data-brand-lockup]");
    await expect(lockup).toBeVisible();
    await expect(lockup.locator("img")).toHaveCount(2);

    const photo = contato.getByAltText(photos.medicaHeadset.alt);
    await expect(photo).toBeVisible();

    await expect(contato.getByRole("link", { name: finalCta.primaryCta })).toHaveAttribute(
      "href",
      "#planos",
    );
  });

  test("no desktop a marca d'agua nao cobre a foto nem o formulario", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile === true, "a marca d'agua e decorativa e so aparece no desktop");
    await page.goto("/#contato");
    const contato = page.locator("#contato");

    const watermark = contato.locator("[data-brand-watermark]");
    await expect(watermark).toBeVisible();
    await expect(watermark).toHaveAttribute("aria-hidden", "true");

    const mark = await watermark.boundingBox();
    const photo = await contato.getByAltText(photos.medicaHeadset.alt).boundingBox();
    // Mede o card branco inteiro, e nao o botao (que para dentro do padding do card).
    const card = await contato.locator("[data-lead-card]").boundingBox();
    // Bloco plum: o `overflow-hidden` dele e quem corta a marca.
    const block = await page.locator("#contato > div").first().boundingBox();
    if (!mark || !photo || !card || !block) throw new Error("boundingBox indisponivel");

    // A marca fica abaixo da foto e fora da faixa horizontal do card do formulario.
    expect(mark.y).toBeGreaterThanOrEqual(photo.y + photo.height);
    expect(mark.x).toBeGreaterThanOrEqual(card.x + card.width);
    // E nao vaza para fora do bloco: nenhuma rolagem horizontal por causa dela.
    expect(mark.x + mark.width).toBeLessThanOrEqual(block.x + block.width);
  });

  test("no mobile a marca fica no lockup e a marca d'agua nao aparece", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile !== true, "somente no projeto mobile");
    await page.goto("/#contato");
    const contato = page.locator("#contato");

    await expect(contato.locator("[data-brand-lockup]")).toBeVisible();
    await expect(contato.getByAltText(photos.medicaHeadset.alt)).toBeVisible();
    // Sem canto livre no empilhamento: a marca d'agua ficaria atras do card branco.
    await expect(contato.locator("[data-brand-watermark]")).toBeHidden();
  });
});
