/*
  Estrutura dos documentos legais (Termos de uso, Politica de privacidade, LGPD).
  Conteudo em src/content/legal/<slug>.ts; renderizacao em src/components/legal/legal-page.tsx.
  Nada aqui pode conter travessao (U+2014); use hifen.
*/

export type LegalSlug = "termos" | "privacidade" | "lgpd";

export interface LegalBlock {
  // p = paragrafo; ul/ol = listas; h3 = subtitulo dentro da secao; note = aviso destacado
  type: "p" | "ul" | "ol" | "h3" | "note";
  text?: string;
  items?: readonly string[];
}

export interface LegalSection {
  // id em kebab-case, usado na ancora do sumario
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  // Descricao curta para metadata (ate 160 caracteres)
  description: string;
  // Data ISO (AAAA-MM-DD) da ultima atualizacao
  updatedAt: string;
  version: string;
  // Aviso exibido no topo enquanto o documento nao passou por revisao juridica
  draftNotice?: string;
  intro: readonly string[];
  sections: readonly LegalSection[];
}
