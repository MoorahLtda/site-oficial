import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { manifesto, photos, problems, problemsSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PorQue } from "./por-que";

/*
  Brief v4-secoes, 4.1: heading + foto grande (pessoaCasa) + lista das tres dores, manifesto
  tipografico abaixo. Sem indices, sem hairline, sem svg, sem nada sobre a fotografia.
  Conteudo dentro de Reveal fica com opacity 0 no jsdom (IntersectionObserver nunca dispara),
  entao as assertivas usam presenca no DOM e atributos, nunca toBeVisible.
*/
describe("PorQue", () => {
  it("renderiza a secao soft rotulada pelo h2, com eyebrow e as 3 dores como h3 em <ol>", () => {
    renderWithMotion(<PorQue />);
    const section = document.getElementById("por-que");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("bg-gray-50");

    const title = screen.getByRole("heading", { level: 2, name: problemsSection.title });
    expect(title.id).not.toBe("");
    expect(section).toHaveAttribute("aria-labelledby", title.id);
    expect(screen.getByText(problemsSection.eyebrow)).toHaveClass("eyebrow");

    const list = section?.querySelector("ol");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll(":scope > li")).toHaveLength(problems.length);
    const headings = within(list as HTMLElement).getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(problems.map((p) => p.title));
    for (const problem of problems) {
      expect(screen.getByText(problem.text)).toBeInTheDocument();
    }
  });

  it("nao tem indice 01..03, hairline entre itens nem svg na secao", () => {
    renderWithMotion(<PorQue />);
    const section = document.getElementById("por-que");
    expect(section?.textContent).not.toMatch(/\b0\d\b/);
    expect(section?.querySelectorAll("[data-index]")).toHaveLength(0);
    expect(section?.querySelectorAll("svg")).toHaveLength(0);
    const list = section?.querySelector("ol");
    expect(list?.className).not.toContain("divide-y");
    for (const li of list?.querySelectorAll(":scope > li") ?? []) {
      expect(li.className).not.toContain("border");
    }
  });

  it("traz a foto pessoaCasa em 4:5, lazy, sem legenda e sem nada por cima", () => {
    renderWithMotion(<PorQue />);
    const img = screen.getByAltText(photos.pessoaCasa.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    const figure = img.closest("figure");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("figcaption")).toBeNull();
    // Nada sobre a fotografia: o unico conteudo com texto dentro do figure e a propria img.
    expect(figure?.textContent).toBe("");
    expect(img.parentElement).toHaveClass("aspect-[4/5]", "overflow-hidden", "rounded-3xl");
  });

  it("renderiza o manifesto como h3 + paragrafo, sem eyebrow, nos e hub", () => {
    renderWithMotion(<PorQue />);
    expect(screen.getByRole("heading", { level: 3, name: manifesto.title })).toBeInTheDocument();
    expect(screen.getByText(manifesto.text)).toBeInTheDocument();
    // Ornamentos antigos (eyebrow "Tudo em um lugar", hub e nos da trilha) sairam de site.ts;
    // os literais garantem que nenhum componente os reintroduz.
    expect(screen.queryByText("Tudo em um lugar")).toBeNull();
    expect(screen.queryByText("Sua assinatura Moorah")).toBeNull();
  });
});
