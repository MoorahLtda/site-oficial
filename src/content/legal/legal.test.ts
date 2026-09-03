import { describe, expect, it } from "vitest";
import { legalDocuments, legalNav, legalSlugs } from "./index";
import type { LegalBlock, LegalDocument, LegalSlug } from "./types";

/*
  Contrato dos documentos legais: cada arquivo em src/content/legal/<slug>.ts precisa ser
  renderizavel pelo LegalPage e navegavel pelo sumario. Nenhum texto pode ter travessao.
*/

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EM_DASH = "—";

function textsOf(block: LegalBlock): string[] {
  return [block.text ?? "", ...(block.items ?? [])];
}

function allTexts(doc: LegalDocument): string[] {
  const out = [doc.title, doc.description, doc.version, doc.draftNotice ?? "", ...doc.intro];
  for (const section of doc.sections) {
    out.push(section.title);
    for (const block of section.blocks) out.push(...textsOf(block));
  }
  return out;
}

const entries = Object.entries(legalDocuments) as [LegalSlug, LegalDocument][];

describe("registro legalDocuments", () => {
  it("tem exatamente os tres documentos, na ordem do sumario", () => {
    expect(legalSlugs).toEqual(["termos", "privacidade", "lgpd"]);
    expect(Object.keys(legalDocuments)).toEqual(legalSlugs);
  });

  it("legalNav aponta para cada documento com o titulo dele", () => {
    expect(legalNav).toHaveLength(3);
    for (const item of legalNav) {
      expect(item.href).toBe(`/${item.slug}`);
      expect(item.title).toBe(legalDocuments[item.slug].title);
    }
  });
});

describe.each(entries)("documento %s", (slug, doc) => {
  it("slug bate com a chave do registro", () => {
    expect(doc.slug).toBe(slug);
  });

  it("tem titulo, descricao curta e versao", () => {
    expect(doc.title.trim().length).toBeGreaterThan(0);
    expect(doc.description.trim().length).toBeGreaterThan(0);
    expect(doc.description.length).toBeLessThanOrEqual(160);
    expect(doc.version.trim().length).toBeGreaterThan(0);
  });

  it("updatedAt esta em AAAA-MM-DD e e uma data valida", () => {
    expect(doc.updatedAt).toMatch(ISO_DATE);
    const [y, m, d] = doc.updatedAt.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    expect(date.getUTCFullYear()).toBe(y);
    expect(date.getUTCMonth()).toBe(m - 1);
    expect(date.getUTCDate()).toBe(d);
  });

  it("e uma minuta com draftNotice", () => {
    expect(doc.draftNotice?.trim().length).toBeGreaterThan(0);
  });

  it("tem introducao e entre 8 e 14 secoes", () => {
    expect(doc.intro.length).toBeGreaterThan(0);
    expect(doc.sections.length).toBeGreaterThanOrEqual(8);
    expect(doc.sections.length).toBeLessThanOrEqual(14);
  });

  it("ids de secao sao unicos e em kebab-case", () => {
    const ids = doc.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(KEBAB);
  });

  it("toda secao tem titulo e blocos coerentes com o tipo", () => {
    for (const section of doc.sections) {
      expect(section.title.trim().length).toBeGreaterThan(0);
      expect(section.blocks.length).toBeGreaterThan(0);
      for (const block of section.blocks) {
        if (block.type === "ul" || block.type === "ol") {
          expect(block.items?.length ?? 0).toBeGreaterThan(0);
          for (const item of block.items ?? []) expect(item.trim().length).toBeGreaterThan(0);
        } else {
          expect(block.text?.trim().length ?? 0).toBeGreaterThan(0);
        }
      }
    }
  });

  it("nenhum texto contem travessao (U+2014)", () => {
    for (const text of allTexts(doc)) expect(text).not.toContain(EM_DASH);
  });

  it("nao usa jargao corporativo proibido", () => {
    const banned =
      /\b(alavanc\w*|transformador\w*|fluid[oa]s?|destrav\w*|otimiz\w*|robust\w*|sinergi\w*)\b/i;
    for (const text of allTexts(doc)) expect(text).not.toMatch(banned);
  });
});
