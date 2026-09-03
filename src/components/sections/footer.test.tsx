import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { legalNotes, nav, site, ui } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Footer } from "./footer";

describe("Footer", () => {
  it("expõe o landmark contentinfo com a navegação rotulada", () => {
    renderWithMotion(<Footer />);
    const footer = screen.getByRole("contentinfo");
    const navigation = within(footer).getByRole("navigation", { name: ui.footer.navLabel });
    for (const item of nav) {
      expect(within(navigation).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        `#${item.id}`,
      );
    }
  });

  it("rotula as colunas com h2 e nunca usa h1", () => {
    renderWithMotion(<Footer />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["Navegação", "Legal", "Contato"]);
  });

  it("tem links para /termos e /privacidade", () => {
    renderWithMotion(<Footer />);
    expect(screen.getByRole("link", { name: ui.footer.terms })).toHaveAttribute("href", "/termos");
    expect(screen.getByRole("link", { name: ui.footer.privacy })).toHaveAttribute(
      "href",
      "/privacidade",
    );
  });

  it("mostra as três notas legais e o crédito das fotografias", () => {
    renderWithMotion(<Footer />);
    for (const note of legalNotes) {
      expect(screen.getByText(note)).toBeInTheDocument();
    }
    expect(screen.getByText("Fotografias ilustrativas (Pexels)")).toBeInTheDocument();
  });

  it("mostra a razão social e só exibe CNPJ quando existir", () => {
    renderWithMotion(<Footer />);
    expect(screen.getByText(new RegExp(site.legalName))).toBeInTheDocument();
    if (site.contact.cnpj === "") {
      expect(screen.queryByText(/CNPJ/)).not.toBeInTheDocument();
    } else {
      expect(screen.getByText(/CNPJ/)).toHaveTextContent(site.contact.cnpj);
    }
  });

  it("wordmark leva o nome da marca e o mark é decorativo", () => {
    renderWithMotion(<Footer />);
    expect(screen.getByRole("img", { name: site.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.contact.email })).toHaveAttribute(
      "href",
      `mailto:${site.contact.email}`,
    );
  });

  it("primeira coluna traz o lockup vertical: símbolo grande acima da palavra", () => {
    renderWithMotion(<Footer />);
    const lockup = within(screen.getByRole("contentinfo")).getByTestId("footer-lockup");
    expect(lockup).toHaveClass("flex-col", "items-start");

    const [mark, wordmark] = lockup.querySelectorAll("img");
    expect(mark.getAttribute("src")).toContain("moorah-mark.png");
    expect(mark).toHaveAttribute("alt", "");
    expect(mark.className).toContain("h-16");
    expect(wordmark.getAttribute("src")).toContain("moorah-wordmark.png");
    expect(wordmark).toHaveAttribute("alt", site.name);
    expect(wordmark.className).toContain("h-5");
    for (const image of [mark, wordmark]) expect(image.className).toContain("w-auto");
  });

  it("marca d'água decorativa do símbolo, contida pelo overflow do rodapé", () => {
    renderWithMotion(<Footer />);
    const footer = screen.getByRole("contentinfo");
    // overflow-hidden + isolate: a marca d'agua nao gera rolagem horizontal nem escapa o rodape.
    expect(footer).toHaveClass("relative", "isolate", "overflow-hidden");

    const watermark = within(footer).getByTestId("footer-watermark");
    expect(watermark.getAttribute("src")).toContain("moorah-mark.png");
    expect(watermark).toHaveAttribute("aria-hidden", "true");
    expect(watermark).toHaveAttribute("alt", "");
    expect(watermark.className).toContain("absolute");
    expect(watermark.className).toContain("pointer-events-none");
    // 265 px e a altura nativa do PNG: acima disso o navegador ampliaria a imagem.
    expect(watermark.className).toContain("h-[265px]");
    expect(watermark.className).toContain("w-auto");
    expect(watermark.className).toContain("opacity-[0.04]");
    // Fora da arvore acessivel: continua existindo apenas um img com o nome da marca.
    expect(within(footer).getAllByRole("img")).toHaveLength(1);
  });
});
