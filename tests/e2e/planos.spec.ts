import { expect, test } from "@playwright/test";
import { plansSection } from "../../src/content/site";

test.describe("Planos", () => {
  test("mostra os tres valores sem interacao, sem foto, sem seletor e sem badge", async ({
    page,
  }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    await expect(planos.getByText(/49,90/)).toBeVisible();
    await expect(planos.getByText(/129,90/)).toBeVisible();
    await expect(planos.getByText(/32,48/)).toBeVisible();
    await expect(planos.locator("img")).toHaveCount(0);
    await expect(planos.locator("[role=radiogroup]")).toHaveCount(0);
    await expect(planos.getByText(/Mais escolhido/)).toHaveCount(0);
    await expect(planos.locator("[data-plan-chip]")).toHaveCount(0);
  });

  test("o Familiar leva o anel de destaque e o painel lista o que entra e o que nao entra", async ({
    page,
  }) => {
    await page.goto("/#planos");
    const planos = page.locator("#planos");
    const familiar = planos.locator('article[data-plan="familiar"]');
    await expect(familiar).toBeVisible();
    await expect(familiar).toHaveClass(/ring-2/);
    await expect(familiar).not.toHaveClass(/bg-ink/);
    const included = planos.getByRole("list", { name: plansSection.includedTitle });
    const notIncluded = planos.getByRole("list", { name: plansSection.notIncludedTitle });
    await expect(included.getByRole("listitem")).toHaveCount(plansSection.included.length);
    await expect(notIncluded.getByRole("listitem")).toHaveCount(plansSection.notIncluded.length);
  });
});

test.describe("Planos com reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("os precos chegam opacos, sem depender de animacao", async ({ page }) => {
    await page.goto("/#planos", { waitUntil: "domcontentloaded" });
    const planos = page.locator("#planos");
    const familiar = planos.locator('article[data-plan="familiar"]');
    // A secao e dinamica e chega por streaming, entao espera-se so o ATTACHED. Aqui se le o
    // estilo computado, nao isVisible(): no quadro em que o card nasce o layout ainda nao correu
    // e a medida de visibilidade seria uma corrida. O que o criterio 7 do brief exige e que
    // preco e botao nunca cheguem ao HTML com opacity 0 esperando animacao.
    await familiar.waitFor({ state: "attached" });
    const opacidades = await familiar.evaluate((card) => {
      const alvo = [...card.querySelectorAll("*")].find(
        (node) => /129,90/.test(node.textContent ?? "") && node.children.length === 0,
      );
      const cadeia: string[] = [];
      for (let node = alvo as Element | null; node && node !== card.parentElement; ) {
        cadeia.push(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return cadeia;
    });
    expect(opacidades.length).toBeGreaterThan(0);
    expect(opacidades.every((valor) => valor === "1")).toBe(true);

    // E, sem nenhuma interacao nem rolagem, os tres valores ficam visiveis.
    for (const valor of [/49,90/, /129,90/, /32,48/]) {
      await expect(planos.getByText(valor)).toBeVisible();
    }
  });
});
