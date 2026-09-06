import { describe, expect, it } from "vitest";
import {
  cardSection,
  faq,
  faqSection,
  finalCta,
  formatBRL,
  getPlan,
  hero,
  howItWorks,
  legalLinks,
  manifesto,
  mocks,
  nav,
  perPersonCents,
  photos,
  planNotes,
  plans,
  plansSection,
  problemsSection,
  specialties,
  specialtiesSection,
  steps,
  ui,
} from "./site";

// Travessao (U+2014) escrito como escape para o caractere nao existir no repositorio.
const EM_DASH = "\u2014";
const NBSP = / /g;

function walkStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) walkStrings(v, out);
  else if (value && typeof value === "object")
    for (const v of Object.values(value)) walkStrings(v, out);
  return out;
}

describe("formatBRL", () => {
  it("formata centavos em reais no padrao pt-BR", () => {
    expect(formatBRL(4990).replace(NBSP, " ")).toBe("R$ 49,90");
    expect(formatBRL(12990).replace(NBSP, " ")).toBe("R$ 129,90");
    expect(formatBRL(0).replace(NBSP, " ")).toBe("R$ 0,00");
  });
});

describe("planos", () => {
  it("tem exatamente um plano em destaque", () => {
    expect(plans.filter((p) => p.highlight)).toHaveLength(1);
  });

  it("calcula o valor por pessoa do familiar", () => {
    const familiar = getPlan("familiar");
    expect(perPersonCents(familiar)).toBe(3248);
    expect(formatBRL(perPersonCents(familiar)).replace(NBSP, " ")).toBe("R$ 32,48");
  });

  it("individual custa menos que o familiar, mas mais por pessoa", () => {
    const individual = getPlan("individual");
    const familiar = getPlan("familiar");
    expect(individual.priceCents).toBeLessThan(familiar.priceCents);
    expect(perPersonCents(individual)).toBeGreaterThan(perPersonCents(familiar));
  });

  it("lanca erro para plano desconhecido", () => {
    expect(() => getPlan("premium" as never)).toThrow();
  });
});

describe("conteudo", () => {
  it("tem 12 especialidades e 4 passos numerados", () => {
    expect(specialties).toHaveLength(12);
    expect(steps.map((s) => s.n)).toEqual([1, 2, 3, 4]);
  });

  // Pedido do cliente (05/09/2026): nenhuma mencao a 192, SAMU, LGPD, ANS ou "plano de saude"
  // no corpo da home. Os documentos legais continuam acessiveis pelos links do header e do
  // rodape (legalLinks), por isso o rotulo "LGPD e seus direitos" fica de fora desta varredura.
  // A varredura roda sobre os objetos de site.ts, nao sobre innerText: uppercase transforma o
  // texto e geraria falso positivo (criterio 6 do brief v4-secoes).
  it("home nao menciona 192, SAMU, LGPD, ANS nem plano de saude fora dos links legais", () => {
    const all = walkStrings({
      plans,
      planNotes,
      faq,
      faqSection,
      specialties,
      steps,
      hero,
      problemsSection,
      manifesto,
      howItWorks,
      specialtiesSection,
      cardSection,
      mocks,
      plansSection,
      ui,
      finalCta,
      photoAlts: Object.values(photos).map((photo) => photo.alt),
    });
    const offenders = all.filter((s) => /\b192\b|SAMU|LGPD|\bANS\b|plano de saúde/i.test(s));
    expect(offenders).toEqual([]);
  });

  it("links legais continuam expostos para Termos, Privacidade e LGPD", () => {
    expect(legalLinks.map((l) => l.slug)).toEqual(["termos", "privacidade", "lgpd"]);
    for (const link of legalLinks) expect(link.href).toBe(`/${link.slug}`);
  });

  it("ids de navegacao sao unicos e em kebab-case", () => {
    const ids = nav.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("nenhum texto contem travessao", () => {
    const all = walkStrings({
      plans,
      planNotes,
      legalLinks,
      faq,
      specialties,
      steps,
      hero,
      problemsSection,
      manifesto,
      howItWorks,
      specialtiesSection,
      cardSection,
      mocks,
      plansSection,
      ui,
      faqSection,
      finalCta,
      photoAlts: Object.values(photos).map((photo) => photo.alt),
    });
    const offenders = all.filter((s) => s.includes(EM_DASH));
    expect(offenders).toEqual([]);
  });

  it("tem exatamente 2 planos, base do grid de duas colunas de Planos", () => {
    expect(plans).toHaveLength(2);
  });

  it("cardSection.benefits tem 4 itens tipograficos, sem icone", () => {
    expect(cardSection.benefits).toHaveLength(4);
    for (const benefit of cardSection.benefits) {
      expect(benefit.title.length).toBeGreaterThan(0);
      expect(benefit.text.length).toBeGreaterThan(0);
      expect(benefit).not.toHaveProperty("icon");
    }
  });

  it("painel nao incluido nao carrega o aviso regulatorio disfarcado de bullet", () => {
    expect(plansSection.notIncluded.some((item) => /plano de saúde/i.test(item))).toBe(false);
    expect(plansSection.notIncluded).toContain("Atendimento de urgência e emergência");
  });

  it("faq fecha com a pergunta de dados ligada a Politica de privacidade e nao repete pergunta", () => {
    const last = faq[faq.length - 1];
    expect(last.q).toBe("Meus dados de saúde estão protegidos?");
    expect(last.link).toEqual({ href: "/privacidade", label: "Ler a Política de privacidade" });
    const questions = faq.map((item) => item.q);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("mocks do cartao tem 12 digitos ilustrativos e 4 titulares", () => {
    expect(mocks.cardSamples.every((s) => /^\d{12}$/.test(s))).toBe(true);
    expect(mocks.cardHolders).toHaveLength(4);
  });
});
