import { expect, test } from "@playwright/test";
import { cardSection, mocks } from "../../src/content/site";

/*
  Bloco fundido Cartao + Beneficios (brief v4-secoes, 4.4): absorve os casos do antigo
  tests/e2e/cartao.spec.ts (removido). O id #cartao deixou de existir; a ancora do header
  continua #beneficios.
*/

function grouped(sample: string): string {
  return `${sample.slice(0, 4)} ${sample.slice(4, 8)} ${sample.slice(8, 12)}`;
}

test.describe("Beneficios (bloco fundido com o Cartao Moorah)", () => {
  test("mostra o cartao com alt descritivo e o numero exemplo do titular", async ({ page }) => {
    await page.goto("/#beneficios");
    const card = page.locator("#beneficios").getByAltText(cardSection.imageAlt);
    await expect(card).toBeVisible();
    await expect(page.locator("#beneficios [data-card-number]")).toHaveAttribute(
      "aria-label",
      new RegExp(`${grouped(mocks.cardSamples[0])}$`),
    );
  });

  test("abre com o h2 do cartao, quatro beneficios e sem o bento antigo", async ({ page }) => {
    await page.goto("/#beneficios");
    const section = page.locator("#beneficios");
    await expect(section.getByRole("heading", { level: 2, name: cardSection.title })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(4);
    await expect(section.locator("[data-brand-lockup]")).toHaveCount(0);
    await expect(section.locator("[role=tablist]")).toHaveCount(0);
    await expect(section.locator("[data-comet]")).toHaveCount(0);
    await expect(section.locator("[data-portal-mock]")).toHaveCount(0);
    // O id cartao deixou de existir: o bloco antigo nao pode renderizar em paralelo.
    await expect(page.locator("#cartao")).toHaveCount(0);
  });

  test("trocar para Dependente 2 muda o numero ilustrativo do cartao", async ({ page }) => {
    await page.goto("/#beneficios");
    // Um giro de roda cancela o HashScroll (que reafirma a ancora por 2 s e desfaria o
    // scroll programatico abaixo).
    await page.mouse.wheel(0, 1);
    await page.locator("#beneficios [role=radiogroup]").scrollIntoViewIfNeeded();
    await page.locator("#beneficios").getByRole("radio", { name: "Dependente 2" }).click();
    await expect(page.locator("#beneficios [data-card-number]")).toHaveAttribute(
      "aria-label",
      new RegExp(`${grouped(mocks.cardSamples[2])}$`),
    );
  });

  test("o radiogroup funciona por teclado: ArrowRight troca titular e numero", async ({ page }) => {
    await page.goto("/#beneficios");
    await page.mouse.wheel(0, 1);
    await page.locator("#beneficios [role=radiogroup]").scrollIntoViewIfNeeded();
    await page.locator("#beneficios").getByRole("radio", { name: "Titular" }).focus();
    await page.keyboard.press("ArrowRight");
    const dependente = page.locator("#beneficios").getByRole("radio", { name: "Dependente 1" });
    await expect(dependente).toHaveAttribute("aria-checked", "true");
    await expect(dependente).toBeFocused();
    await expect(page.locator("#beneficios [data-card-number]")).toHaveAttribute(
      "aria-label",
      new RegExp(`${grouped(mocks.cardSamples[1])}$`),
    );
  });

  test("em 360 nenhuma opcao do radiogroup vaza da tela", async ({ page, isMobile }) => {
    test.skip(!isMobile, "medida do mobile");
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/#beneficios");
    await page.mouse.wheel(0, 1);
    await page.locator("#beneficios [role=radiogroup]").scrollIntoViewIfNeeded();
    await expect(page.locator("#beneficios [role=radio]")).toHaveCount(4);
    const overflowing = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      return Array.from(document.querySelectorAll("#beneficios [role=radio]"))
        .map((el) => ({
          label: el.textContent ?? "",
          right: el.getBoundingClientRect().right,
        }))
        .filter((option) => option.right > width);
    });
    expect(overflowing).toEqual([]);
  });

  test("com reduced motion o numero final ja esta no primeiro quadro e o cartao nasce opaco", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#beneficios");
    const digits = page.locator("#beneficios [data-digit]");
    await expect(digits).toHaveCount(12);
    // Estado do servidor: os digitos finais chegam no HTML, sem esperar tick nenhum.
    expect((await digits.allTextContents()).join("")).toBe(mocks.cardSamples[0]);
    await expect(page.locator("#beneficios [data-card-entry]")).toHaveCSS("opacity", "1");
  });
});
