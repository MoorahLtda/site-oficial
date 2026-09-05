import { describe, expect, it } from "vitest";
import { fillPlanTokens, formatBRL, getPlan, hero, type PhotoKey, photos, plans } from "./site";

// Copy e fotos do hero v4 (docs/design-brief-v4-hero.md). Intl usa NBSP entre "R$" e o valor.
const NBSP = / /g;
// Travessao (U+2014) como escape: o caractere nao pode existir no repositorio.
const EM_DASH = "\u2014";
const plain = (text: string): string => text.replace(NBSP, " ");
const HERO_PHOTOS: readonly PhotoKey[] = ["heroCasa", "heroFamilia", "heroMaeFilha", "heroSenior"];

describe("hero v4: copy", () => {
  it("titulo em duas linhas que somam a frase completa, com ponto final", () => {
    expect(hero.titleLines).toHaveLength(2);
    expect(hero.titleLines.join(" ")).toBe(hero.title);
    expect(hero.title.endsWith(".")).toBe(true);
  });

  it("frase de preco traz os dois planos, sempre a partir de plans[]", () => {
    for (const token of ["{individual}", "{familiar}", "{people}"]) {
      expect(hero.prices).toContain(token);
    }
    const text = plain(fillPlanTokens(hero.prices));
    expect(text).toContain(plain(formatBRL(getPlan("individual").priceCents)));
    expect(text).toContain(plain(formatBRL(getPlan("familiar").priceCents)));
    expect(text).toContain(`${getPlan("familiar").people} pessoas`);
    expect(text).not.toMatch(/[{}]/);
  });

  it("fillPlanTokens resolve {price} (plans[0]) e nao mexe em texto sem token", () => {
    expect(fillPlanTokens("{price}")).toBe(formatBRL(plans[0].priceCents));
    expect(fillPlanTokens("sem token")).toBe("sem token");
  });

  it("tres fatos verificaveis: sem LGPD, sem 'plano de saude', sem CFM nem conta por dia", () => {
    expect(hero.facts).toHaveLength(3);
    for (const fact of hero.facts) {
      expect(fact.value.length).toBeGreaterThan(0);
      expect(fact.label.length).toBeGreaterThan(0);
      expect(`${fact.value} ${fact.label}`).not.toMatch(/LGPD|plano de sa|por dia|CFM/i);
    }
  });

  it("tres bullets da variante, cada um com um trecho em destaque e o primeiro com os dois precos", () => {
    expect(hero.bullets).toHaveLength(3);
    const first = hero.bullets[0] ?? [];
    const joined = first.map((seg) => (typeof seg === "string" ? seg : seg.strong)).join("");
    const text = plain(fillPlanTokens(joined));
    expect(text).toContain(plain(formatBRL(getPlan("individual").priceCents)));
    expect(text).toContain(plain(formatBRL(getPlan("familiar").priceCents)));
    for (const bullet of hero.bullets) {
      expect(bullet.some((seg) => typeof seg !== "string")).toBe(true);
    }
  });

  it("copy do hero nao repete 'nao e plano de saude', nao cita o parceiro medico e mantem 'qualquer especialidade'", () => {
    const all = JSON.stringify(hero);
    expect(all).not.toMatch(/plano de sa[úu]de/i);
    expect(all).not.toMatch(/click ?life/i);
    expect(all).toMatch(/qualquer especialidade/i);
    expect(all).not.toContain(EM_DASH);
  });
});

describe("hero v4: fotos", () => {
  it("fotos do hero: CDN em 1920, medidas reais 3:2, alt em frase e sem travessao", () => {
    for (const key of HERO_PHOTOS) {
      const photo = photos[key];
      expect(photo.src).toMatch(
        /^https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg\?auto=compress&cs=tinysrgb&w=1920$/,
      );
      expect(photo.width).toBe(1920);
      expect(photo.height).toBe(1280);
      expect(photo.alt.length).toBeGreaterThan(30);
      expect(photo.alt.endsWith(".")).toBe(true);
      expect(photo.alt).not.toContain(EM_DASH);
      expect(photo.alt).not.toMatch(/^imagem de/i);
    }
  });

  it("as demais fotos continuam pedindo 1600 ao CDN", () => {
    const others = (Object.keys(photos) as PhotoKey[]).filter((key) => !HERO_PHOTOS.includes(key));
    expect(others.length).toBeGreaterThan(0);
    for (const key of others) {
      expect(photos[key].src).toContain("w=1600");
    }
  });
});
