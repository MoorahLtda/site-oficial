import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { legalNav } from "@/content/legal";
import { termos } from "@/content/legal/termos";
import type { LegalDocument } from "@/content/legal/types";
import { site } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { formatUpdatedAt, LegalPage } from "./legal-page";

// appUrl e whatsapp vem de variaveis de ambiente; fixamos vazio para o teste ser deterministico.
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    site: { ...actual.site, appUrl: "", contact: { ...actual.site.contact, whatsapp: "" } },
  };
});

// Documento minimo com todos os tipos de bloco, para testar a renderizacao sem depender da copy.
const fixture: LegalDocument = {
  slug: "privacidade",
  title: "Documento de teste",
  description: "Descricao curta do documento de teste.",
  updatedAt: "2026-09-02",
  version: "0.1",
  draftNotice: "Minuta para revisao juridica.",
  intro: ["Primeiro paragrafo de introducao.", "Segundo paragrafo de introducao."],
  sections: [
    {
      id: "primeira-secao",
      title: "1. Primeira secao",
      blocks: [
        { type: "p", text: "Paragrafo simples." },
        { type: "h3", text: "Subtitulo da secao" },
        { type: "ul", items: ["Item um", "Item dois"] },
        { type: "ol", items: ["Passo um", "Passo dois", "Passo tres"] },
        { type: "note", text: "Aviso em destaque." },
      ],
    },
    {
      id: "segunda-secao",
      title: "2. Segunda secao",
      blocks: [
        { type: "p", text: "Paragrafo repetido." },
        { type: "p", text: "Paragrafo repetido." },
      ],
    },
  ],
};

describe("formatUpdatedAt", () => {
  it("formata a data ISO em portugues sem depender do relogio", () => {
    expect(formatUpdatedAt("2026-09-02")).toBe("2 de setembro de 2026");
    expect(formatUpdatedAt("2027-01-15")).toBe("15 de janeiro de 2027");
  });

  it("devolve a string original quando o formato nao e AAAA-MM-DD", () => {
    expect(formatUpdatedAt("setembro de 2026")).toBe("setembro de 2026");
  });
});

describe("LegalPage", () => {
  it("tem header, footer, main#conteudo e um unico h1 com o titulo", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "conteudo");
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(fixture.title);
    expect(within(main).getByText(site.product)).toHaveClass("eyebrow");
  });

  it("nenhum h2 aparece antes do h1", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    for (const h2 of screen.getAllByRole("heading", { level: 2 })) {
      expect(h1.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it("mostra versao e data de atualizacao em um <time>", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const main = screen.getByRole("main");
    expect(within(main).getByText(/versão 0\.1/i)).toBeInTheDocument();
    const time = main.querySelector("time");
    expect(time).toHaveAttribute("dateTime", "2026-09-02");
    expect(time).toHaveTextContent("2 de setembro de 2026");
  });

  it("exibe o banner de minuta quando draftNotice existe", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent("Minuta para revisao juridica.");
    expect(within(banner).getByText("Minuta")).toBeInTheDocument();
  });

  it("nao exibe o banner quando draftNotice esta ausente", () => {
    const { draftNotice: _omitted, ...rest } = fixture;
    renderWithMotion(<LegalPage doc={rest} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText("Minuta")).not.toBeInTheDocument();
  });

  it("renderiza os paragrafos de introducao", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    for (const text of fixture.intro) expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("tem um sumario com um link por secao, apontando para a ancora", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const sumario = screen.getByRole("navigation", { name: /sumário/i });
    const links = within(sumario).getAllByRole("link");
    expect(links).toHaveLength(fixture.sections.length);
    fixture.sections.forEach((section, index) => {
      expect(links[index]).toHaveAttribute("href", `#${section.id}`);
      expect(links[index]).toHaveTextContent(section.title);
    });
  });

  it("renderiza uma section com aria-labelledby e h2 por secao", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const article = screen.getByRole("article");
    for (const section of fixture.sections) {
      const el = article.querySelector(`section#${section.id}`);
      expect(el).not.toBeNull();
      const labelledBy = el?.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      const heading = within(article).getByRole("heading", { level: 2, name: section.title });
      expect(heading).toHaveAttribute("id", labelledBy);
    }
  });

  it("renderiza todos os tipos de bloco", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const article = screen.getByRole("article");
    expect(within(article).getByText("Paragrafo simples.").tagName).toBe("P");
    expect(
      within(article).getByRole("heading", { level: 3, name: "Subtitulo da secao" }),
    ).toBeInTheDocument();
    const ul = within(article).getByText("Item um").closest("ul");
    expect(ul).not.toBeNull();
    expect(within(ul as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
    const ol = within(article).getByText("Passo um").closest("ol");
    expect(ol).not.toBeNull();
    expect(within(ol as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
    expect(within(article).getByRole("note")).toHaveTextContent("Aviso em destaque.");
    // Paragrafos identicos na mesma secao nao podem colidir de key.
    expect(within(article).getAllByText("Paragrafo repetido.")).toHaveLength(2);
  });

  it("linka para os outros dois documentos, sem repetir o atual", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const outros = screen.getByRole("navigation", { name: /outros documentos/i });
    const links = within(outros).getAllByRole("link");
    const others = legalNav.filter((item) => item.slug !== fixture.slug);
    expect(links).toHaveLength(others.length);
    for (const item of others) {
      expect(within(outros).getByRole("link", { name: item.title })).toHaveAttribute(
        "href",
        item.href,
      );
    }
    expect(within(outros).queryByRole("link", { name: /^\/privacidade$/ })).toBeNull();
  });

  it("fecha com o bloco de contato do encarregado (mailto)", () => {
    renderWithMotion(<LegalPage doc={fixture} />);
    const main = screen.getByRole("main");
    expect(within(main).getByText(/dúvidas sobre este documento/i)).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: site.contact.dpoEmail })).toHaveAttribute(
      "href",
      `mailto:${site.contact.dpoEmail}`,
    );
  });

  it("renderiza um documento real inteiro sem erro", () => {
    renderWithMotion(<LegalPage doc={termos} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(termos.title);
    const sumario = screen.getByRole("navigation", { name: /sumário/i });
    expect(within(sumario).getAllByRole("link")).toHaveLength(termos.sections.length);
  });
});
