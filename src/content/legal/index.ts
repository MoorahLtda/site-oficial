/*
  Registro dos documentos legais. Uma unica fonte de verdade para as rotas /termos,
  /privacidade e /lgpd e para a navegacao entre eles no LegalPage.
  A ordem de legalSlugs e a ordem exibida na navegacao.
  Nada aqui pode conter travessao (U+2014); use hifen.
*/

import { lgpd } from "./lgpd";
import { privacidade } from "./privacidade";
import { termos } from "./termos";
import type { LegalDocument, LegalSlug } from "./types";

export const legalSlugs: readonly LegalSlug[] = ["termos", "privacidade", "lgpd"];

export const legalDocuments: Record<LegalSlug, LegalDocument> = {
  termos,
  privacidade,
  lgpd,
};

export interface LegalNavItem {
  slug: LegalSlug;
  title: string;
  // Caminho da rota, sempre /<slug>.
  href: string;
}

export const legalNav: readonly LegalNavItem[] = legalSlugs.map((slug) => ({
  slug,
  title: legalDocuments[slug].title,
  href: `/${slug}`,
}));

export type { LegalBlock, LegalDocument, LegalSection, LegalSlug } from "./types";
