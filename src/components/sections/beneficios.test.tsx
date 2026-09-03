import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { benefits, benefitsSection, mocks, photos } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Beneficios } from "./beneficios";

// Os mocks animados entram por next/dynamic; aqui interessa a estrutura do bento (server).
vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="mock-dinamico" />,
}));

describe("Beneficios", () => {
  it("renderiza 5 cards h3 com benefits[1..5] na ordem do bento", () => {
    renderWithMotion(<Beneficios />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(5);
    const titles = headings.map((h) => h.textContent);
    expect(titles).toEqual([
      benefits[4].title,
      benefits[2].title,
      benefits[1].title,
      benefits[3].title,
      benefits[5].title,
    ]);
    // O Cartao Moorah (benefits[0]) tem secao propria.
    expect(screen.queryByRole("heading", { level: 3, name: benefits[0].title })).toBeNull();
  });

  it("usa Section com id beneficios rotulada pelo h2", () => {
    renderWithMotion(<Beneficios />);
    const section = document.getElementById("beneficios");
    expect(section?.tagName).toBe("SECTION");
    const h2 = screen.getByRole("heading", { level: 2, name: benefitsSection.title });
    expect(h2.id).toBeTruthy();
    expect(section).toHaveAttribute("aria-labelledby", h2.id);
    expect(screen.getByText(benefitsSection.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(benefitsSection.lead)).toBeInTheDocument();
  });

  it("card de seguranca lista os chips de mocks.securityChips", () => {
    renderWithMotion(<Beneficios />);
    const card = screen
      .getByRole("heading", { level: 3, name: benefits[5].title })
      .closest("article");
    if (!card) throw new Error("card de seguranca nao encontrado");
    const list = within(card).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([...mocks.securityChips]);
  });

  it("os tres mocks entram por next/dynamic", () => {
    renderWithMotion(<Beneficios />);
    expect(screen.getAllByTestId("mock-dinamico")).toHaveLength(3);
  });

  it("a celula Portal tem a foto do idoso no tablet como cabecalho em aspect-video", () => {
    renderWithMotion(<Beneficios />);
    const card = screen
      .getByRole("heading", { level: 3, name: benefits[4].title })
      .closest("article");
    if (!card) throw new Error("card do portal nao encontrado");
    const img = within(card).getByAltText(photos.idosoTablet.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    expect(img.parentElement).toHaveClass("aspect-video", "overflow-hidden");
    expect(card).toHaveClass("overflow-hidden");
    expect(card.querySelector("[data-tile-header]")).not.toBeNull();
    expect(card.querySelector("[data-photo-overlay]")).toBeNull();
  });

  it("a celula Exames usa a foto de exame como fundo, com overlay plum e texto branco", () => {
    renderWithMotion(<Beneficios />);
    const card = screen
      .getByRole("heading", { level: 3, name: benefits[2].title })
      .closest("article");
    if (!card) throw new Error("card de exames nao encontrado");
    expect(card).toHaveClass("text-white", "isolate");
    const img = within(card).getByAltText(photos.exame.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    const overlay = card.querySelector("[data-photo-overlay]");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay).toHaveClass("absolute", "inset-0");
  });
});
