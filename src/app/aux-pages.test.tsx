import { render, screen, within } from "@testing-library/react";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { legalDocuments } from "@/content/legal";
import type { LegalDocument, LegalSlug } from "@/content/legal/types";
import { site, ui } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import Lgpd, { metadata as lgpdMetadata } from "./lgpd/page";
import Loading from "./loading";
import NotFound from "./not-found";
import Privacidade, { metadata as privacidadeMetadata } from "./privacidade/page";
import Termos, { metadata as termosMetadata } from "./termos/page";

// appUrl e whatsapp vem de variaveis de ambiente; fixamos vazio para o teste ser deterministico.
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    site: { ...actual.site, appUrl: "", contact: { ...actual.site.contact, whatsapp: "" } },
  };
});

// Nenhum h2 pode vir antes do h1 (os h2 das secoes e do rodape ficam depois).
function expectSingleH1First(title: string) {
  const h1s = screen.getAllByRole("heading", { level: 1 });
  expect(h1s).toHaveLength(1);
  expect(h1s[0]).toHaveTextContent(title);
  for (const h2 of screen.getAllByRole("heading", { level: 2 })) {
    expect(h1s[0].compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
}

/*
  As tres paginas legais compartilham o LegalPage, entao a checagem e a mesma: metadata vinda
  do documento, um h1 com o titulo, sumario completo e banner de minuta.
*/
interface LegalPageCase {
  slug: LegalSlug;
  Page: () => ReactElement;
  metadata: Metadata;
  doc: LegalDocument;
}

const legalPages: readonly LegalPageCase[] = [
  { slug: "termos", Page: Termos, metadata: termosMetadata, doc: legalDocuments.termos },
  {
    slug: "privacidade",
    Page: Privacidade,
    metadata: privacidadeMetadata,
    doc: legalDocuments.privacidade,
  },
  { slug: "lgpd", Page: Lgpd, metadata: lgpdMetadata, doc: legalDocuments.lgpd },
];

describe.each(legalPages)("pagina /$slug", ({ Page, metadata, doc }) => {
  it("usa titulo e descricao do documento na metadata", () => {
    expect(metadata.title).toBe(doc.title);
    expect(metadata.description).toBe(doc.description);
  });

  it("tem header, footer e main#conteudo com um h1 unico antes de qualquer h2", () => {
    renderWithMotion(<Page />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "conteudo");
    expectSingleH1First(doc.title);
    expect(within(main).getByText(site.product)).toHaveClass("eyebrow");
  });

  it("lista todas as secoes no sumario, avisa que e minuta e volta para o inicio", () => {
    renderWithMotion(<Page />);
    const sumario = screen.getByRole("navigation", { name: /sumário/i });
    expect(within(sumario).getAllByRole("link")).toHaveLength(doc.sections.length);
    expect(screen.getByRole("status")).toHaveTextContent(doc.draftNotice ?? "");
    expect(
      within(screen.getByRole("main")).getByRole("link", { name: ui.pages.backHome }),
    ).toHaveAttribute("href", "/");
  });
});

describe("Ligacao entre os documentos legais", () => {
  it("o rodape leva para termos, privacidade e LGPD", () => {
    renderWithMotion(<Termos />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("link", { name: ui.footer.terms })).toHaveAttribute(
      "href",
      "/termos",
    );
    expect(within(footer).getByRole("link", { name: ui.footer.privacy })).toHaveAttribute(
      "href",
      "/privacidade",
    );
    expect(within(footer).getByRole("link", { name: legalDocuments.lgpd.title })).toHaveAttribute(
      "href",
      "/lgpd",
    );
  });

  it("cada documento aponta para os outros dois", () => {
    renderWithMotion(<Lgpd />);
    const outros = screen.getByRole("navigation", { name: /outros documentos/i });
    expect(within(outros).getByRole("link", { name: legalDocuments.termos.title })).toHaveAttribute(
      "href",
      "/termos",
    );
    expect(
      within(outros).getByRole("link", { name: legalDocuments.privacidade.title }),
    ).toHaveAttribute("href", "/privacidade");
    expect(
      within(outros).queryByRole("link", { name: legalDocuments.lgpd.title }),
    ).not.toBeInTheDocument();
  });
});

describe("Pagina nao encontrada", () => {
  it("mostra 404 com h1 unico, marca decorativa e botao para o inicio", () => {
    renderWithMotion(<NotFound />);
    const main = screen.getByRole("main");
    expectSingleH1First(ui.pages.notFoundTitle);
    expect(within(main).getByText("404")).toHaveClass("eyebrow");
    expect(within(main).getByText(ui.pages.notFoundText)).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: ui.pages.backHome })).toHaveAttribute(
      "href",
      "/",
    );
    // O mark e decorativo: alt vazio, sem role img.
    expect(within(main).queryByRole("img")).not.toBeInTheDocument();
    // Simbolo grande (h-24) e sem distorcao, sem competir com o lockup menor do header.
    const mark = main.querySelector("img");
    expect(mark?.getAttribute("src")).toContain("moorah-mark.png");
    expect(mark?.className).toContain("h-24");
    expect(mark?.className).toContain("w-auto");
  });
});

describe("Loading", () => {
  it("e um placeholder ocupado, rotulado e sem headings", () => {
    const { container } = render(<Loading />);
    const busy = container.querySelector('[aria-busy="true"]');
    expect(busy).not.toBeNull();
    expect(busy).toHaveAttribute("aria-label", "Carregando");
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(6);
  });

  it("mostra o símbolo da marca pulsando acima do esqueleto, fora da árvore acessível", () => {
    const { container } = render(<Loading />);
    const mark = container.querySelector("img");
    expect(mark).not.toBeNull();
    expect(mark?.getAttribute("src")).toContain("moorah-mark.png");
    expect(mark).toHaveAttribute("alt", "");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark?.className).toContain("h-12");
    expect(mark?.className).toContain("w-auto");
    expect(mark?.className).toContain("animate-pulse-soft");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
