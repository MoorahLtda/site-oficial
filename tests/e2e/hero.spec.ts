import { expect, test } from "@playwright/test";

const TITLE_STATIC = "Consultas médicas ilimitadas,";
const FIRST_PHRASE = "sem fila.";
const STRIP_LABEL = "Especialidades disponíveis";

test.describe("Hero: Constelacao de cuidado", () => {
  test("no mobile o h1 e o CTA primario ficam dentro da dobra", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    const h1 = page.locator("h1");
    const cta = page.locator("#inicio").getByRole("link", { name: "Escolher meu plano" });
    const h1Box = await h1.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(h1Box).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    if (!h1Box || !ctaBox) return;
    expect(h1Box.y + h1Box.height).toBeLessThanOrEqual(740);
    expect(ctaBox.y + ctaBox.height).toBeLessThanOrEqual(740);
  });

  test("sem rolagem horizontal em 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });

  test("o bloco plum comeca abaixo do header", async ({ page, isMobile }) => {
    test.skip(isMobile, "medida do header fixo em desktop");
    await page.goto("/");
    const header = await page.locator("header").boundingBox();
    const block = await page.locator("#inicio [data-hero-block]").boundingBox();
    expect(header).not.toBeNull();
    expect(block).not.toBeNull();
    if (!header || !block) return;
    expect(header.y + header.height).toBeLessThanOrEqual(block.y);
  });

  test("a cascata termina com o no 0 confirmado", async ({ page }) => {
    await page.goto("/");
    const node = page.locator('#inicio svg[data-trail-cluster] [data-node="0"]');
    // A confirmacao acontece 1,9 s depois da montagem da rede, que e um chunk cliente: a folga
    // aqui cobre download e hidratacao em maquina carregada, sem afrouxar o que se afirma.
    await expect(node).toHaveAttribute("data-state", "confirmed", { timeout: 8_000 });
  });

  // A frase gira a cada 2800 ms, entao afirmar o indice inicial depois de um goto e uma corrida
  // com o proprio carrossel: sob carga o teste chega quando a frase ja avancou. Com reduced
  // motion a rotacao nao acontece, e ai o estado inicial e deterministico.
  test("com reduced motion o titulo fica na linha estatica e na primeira frase, sem cometas nem troca de foto", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(TITLE_STATIC);
    const rotating = h1.locator("[data-hero-rotating]");
    await expect(rotating).toHaveAttribute("data-phrase", "0");
    await expect(rotating.locator("[data-rotating-active]")).toHaveText(FIRST_PHRASE);
    // Continua na primeira frase: nada gira sob reduced motion.
    await page.waitForTimeout(3_500);
    await expect(rotating).toHaveAttribute("data-phrase", "0");
    // Nem cometas nem crossfade: primeira foto em cada disco.
    await expect(page.locator("#inicio [data-comet]")).toHaveCount(0);
    const discs = page.locator("#inicio [data-photo-node]");
    await expect(discs).toHaveCount(3);
    for (const disc of await discs.all()) {
      await expect(disc).toHaveAttribute("data-photo-index", "0");
    }
  });

  test("a frase alterna sozinha", async ({ page }) => {
    await page.goto("/");
    const rotating = page.locator("h1 [data-hero-rotating]");
    // Le o indice atual em vez de exigir o zero, e espera qualquer troca.
    const first = await rotating.getAttribute("data-phrase");
    expect(first).not.toBeNull();
    await expect(rotating).not.toHaveAttribute("data-phrase", first ?? "0", { timeout: 8_000 });
  });

  test("o titulo nao muda de altura quando a frase troca", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    const rotating = h1.locator("[data-hero-rotating]");
    const first = await rotating.getAttribute("data-phrase");
    const before = await h1.boundingBox();
    await expect(rotating).not.toHaveAttribute("data-phrase", first ?? "0", { timeout: 8_000 });
    const after = await h1.boundingBox();
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    if (!before || !after) return;
    expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(1);
  });

  test("tres discos de foto dentro da rede, sem nada por cima e sem preload", async ({ page }) => {
    await page.goto("/");
    const discs = page.locator("#inicio [data-photo-node]");
    await expect(discs).toHaveCount(3);
    for (const disc of await discs.all()) {
      await expect(disc).toBeVisible();
      const photo = disc.locator("[data-photo-current] img");
      const alt = await photo.getAttribute("alt");
      expect(alt?.length ?? 0).toBeGreaterThan(10);
      await expect(photo).not.toHaveAttribute("loading", "lazy");
      // Nenhum texto, chip ou simbolo sobre a foto (restricao dura 1).
      expect((await disc.innerText()).trim()).toBe("");
    }
    // Sem priority: nenhuma foto do hero e preanunciada no head (as imagens do header continuam).
    await expect(
      page.locator('head link[rel="preload"][as="image"][imagesrcset*="pexels"]'),
    ).toHaveCount(0);
  });

  test("um compasso acende o no do evento", async ({ page }) => {
    await page.goto("/");
    const svg = page.locator("#inicio svg[data-trail-cluster]");
    // events[0] acende o no 2 em 4,2 s (mais a hidratacao); o estado dura 1,6 s e o polling pega.
    await expect(svg).toHaveAttribute("data-active", "2", { timeout: 12_000 });
  });

  test("o simbolo da marca fica sobre o hub da rede, sem entrar na leitura", async ({ page }) => {
    await page.goto("/");
    const mark = page.locator("#inicio [data-hero-mark] img");
    await expect(mark).toHaveAttribute("src", /moorah-mark/);
    await expect(mark).toHaveAttribute("alt", "");
  });

  test("faixa de especialidades rotulada e cometas nas trilhas da rede", async ({ page }) => {
    await page.goto("/");
    const strip = page.locator("#inicio").getByRole("group", { name: STRIP_LABEL });
    await expect(strip).toHaveCount(1);
    await expect(strip.getByText("Cardiologia").first()).toBeAttached();
    // Os cometas entram depois da cascata das trilhas (2,2 s), com folga para maquina carregada.
    await expect(page.locator("#inicio svg[data-trail-cluster] [data-comet]")).toHaveCount(12, {
      timeout: 10_000,
    });
  });
});
