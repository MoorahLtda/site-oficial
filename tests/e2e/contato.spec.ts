import { expect, test } from "@playwright/test";
import { finalCta, ui } from "../../src/content/site";

// Fechamento (docs/design-brief-v4-secoes.md, 4.7). A API e interceptada: nenhum lead real sai.
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
    await contato.getByRole("button", { name: ui.leadForm.submit, exact: true }).click();
    await expect(contato.getByRole("status")).toContainText("Recebemos seu pedido.");
  });

  test("envio vazio marca o campo Nome como invalido", async ({ page }) => {
    await page.goto("/#contato");
    const contato = page.locator("#contato");
    const nome = contato.getByLabel("Nome", { exact: true });
    await expect(nome).toBeVisible();
    await contato.getByRole("button", { name: ui.leadForm.submit, exact: true }).click();
    await expect(contato.getByText("Informe seu nome.")).toBeVisible();
    await expect(nome).toHaveAttribute("aria-invalid", "true");
  });
});

// Promessa e acao batem: card "Fale com a Moorah" com botao "Enviar"; CTA de planos secundario.
test.describe("Contato: fechamento sem foto, sem trilha e sem lockup", () => {
  test("card do formulario e CTA secundario para #planos, sem os ornamentos antigos", async ({
    page,
  }) => {
    await page.goto("/#contato");
    const contato = page.locator("#contato");

    await expect(contato.getByRole("heading", { level: 3, name: ui.leadForm.title })).toBeVisible();
    await expect(contato.getByText(ui.leadForm.subtitle)).toBeVisible();
    await expect(
      contato.getByRole("button", { name: ui.leadForm.submit, exact: true }),
    ).toBeVisible();
    await expect(contato.getByRole("link", { name: finalCta.primaryCta })).toHaveAttribute(
      "href",
      "#planos",
    );

    // Vetos do redesenho: nada de trilha fantasma, lockup repetido ou foto de banco.
    await expect(contato.locator("svg[data-trail-cluster]")).toHaveCount(0);
    await expect(contato.locator("[data-comet]")).toHaveCount(0);
    await expect(contato.locator("[data-brand-lockup]")).toHaveCount(0);
    await expect(contato.locator("img:not([data-brand-watermark])")).toHaveCount(0);
  });

  test("em 1440 a marca d'agua fica abaixo do texto e a esquerda do card", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile === true, "a marca d'agua e decorativa e so aparece a partir de xl");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#contato");
    const contato = page.locator("#contato");

    const watermark = contato.locator("[data-brand-watermark]");
    await expect(watermark).toBeVisible();
    await expect(watermark).toHaveAttribute("aria-hidden", "true");

    const mark = await watermark.boundingBox();
    const text = await contato.locator("[data-contact-copy]").boundingBox();
    // Mede o card branco inteiro, e nao o botao (que para dentro do padding do card).
    const card = await contato.locator("[data-lead-card]").boundingBox();
    if (!mark || !text || !card) throw new Error("boundingBox indisponivel");

    // Nunca cruza texto, botao ou card: abaixo da coluna de texto e a esquerda do formulario.
    expect(mark.y).toBeGreaterThanOrEqual(text.y + text.height);
    expect(mark.x + mark.width).toBeLessThanOrEqual(card.x);
  });

  test("em 1024 a marca d'agua fica oculta (breakpoint xl)", async ({ page, isMobile }) => {
    test.skip(isMobile === true, "viewport fixa de desktop");
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/#contato");
    await expect(page.locator("#contato [data-brand-watermark]")).toBeHidden();
  });

  test("no mobile nao ha imagem visivel na secao", async ({ page, isMobile }) => {
    test.skip(isMobile !== true, "somente no projeto mobile");
    await page.goto("/#contato");
    const contato = page.locator("#contato");
    await expect(contato.getByRole("heading", { level: 3, name: ui.leadForm.title })).toBeVisible();
    await expect(contato.locator("[data-brand-watermark]")).toBeHidden();
    await expect(contato.locator("img:visible")).toHaveCount(0);
  });
});
