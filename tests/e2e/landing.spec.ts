import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Landing Moorah Telemedicina", () => {
  test("carrega com titulo, h1 unico e sem erros de console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await expect(page).toHaveTitle(/Moorah/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("navegacao por ancoras leva as secoes", async ({ page }) => {
    await page.goto("/");
    for (const id of ["como-funciona", "especialidades", "beneficios", "planos", "duvidas"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    const link = page.getByRole("link", { name: "Planos" }).first();
    await link.click();
    await expect(page).toHaveURL(/#planos$/);
  });

  test("mostra os dois planos com precos e valor por pessoa", async ({ page }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await expect(planos.getByText(/49,90/)).toBeVisible();
    await expect(planos.getByText(/97,90/)).toBeVisible();
    // O valor por pessoa aparece no card do Familiar e no chip da foto (brief v2, item 1).
    await expect(planos.getByText(/24,48/).first()).toBeVisible();
    await expect(planos.getByText(/não é plano de saúde/i)).toBeVisible();
  });

  test("FAQ abre e fecha com teclado", async ({ page }) => {
    await page.goto("/#duvidas");
    const trigger = page.locator("#duvidas").getByRole("button").first();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("CTA do plano abre formulario com plano pre-selecionado e valida campos", async ({
    page,
  }) => {
    await page.goto("/#planos");
    await page
      .getByRole("button", { name: /Assinar Familiar/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/Plano/)).toHaveValue("familiar");
    await dialog.getByRole("button", { name: /Quero assinar|Enviar/ }).click();
    await expect(dialog.getByText(/Informe seu nome/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("nao tem violacoes de acessibilidade serias ou criticas", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const severe = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(severe, severe.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`).join("\n")).toEqual(
      [],
    );
  });

  test("nenhum texto visivel contem travessao", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("body").innerText();
    // Travessao (U+2014) como escape: o caractere nao pode existir nem no codigo.
    expect(text).not.toContain("\u2014");
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "somente no projeto mobile");

  test("CTA fixo aparece ao rolar e menu abre", async ({ page }) => {
    await page.goto("/");
    // A barra aparece quando o hero sai de vista. Rolar por secao em vez de por pixels:
    // a altura do hero mobile muda com a foto, o cluster e a faixa de especialidades.
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("cta-mobile")).toBeVisible();
    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
