import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { manifesto, photos, problems, problemsSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PorQue } from "./por-que";

// Conteudo dentro de Reveal fica com opacity 0 no jsdom (IntersectionObserver nunca dispara),
// entao as assertivas usam presenca no DOM e atributos, nunca toBeVisible.
describe("PorQue", () => {
  it("renderiza a secao #por-que rotulada pelo h2 e os 3 problemas como h3 em uma lista ordenada", () => {
    renderWithMotion(<PorQue />);
    const section = document.getElementById("por-que");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("bg-gray-50");

    const title = screen.getByRole("heading", { level: 2, name: problemsSection.title });
    expect(title.id).not.toBe("");
    expect(section).toHaveAttribute("aria-labelledby", title.id);

    const list = section?.querySelector("ol");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll(":scope > li")).toHaveLength(problems.length);
    for (const problem of problems) {
      const heading = screen.getByRole("heading", { level: 3, name: problem.title });
      expect(list).toContainElement(heading);
      expect(screen.getByText(problem.text)).toBeInTheDocument();
    }
    // Indices em mono (01, 02, 03), decorativos: o <ol> ja numera para leitores de tela.
    const indices = Array.from(list?.querySelectorAll("[data-index]") ?? []);
    expect(indices.map((el) => el.textContent)).toEqual(["01", "02", "03"]);
    for (const index of indices) expect(index).toHaveAttribute("aria-hidden", "true");
  });

  it("renderiza o manifesto (eyebrow, titulo como h3, texto e rotulo do hub)", () => {
    renderWithMotion(<PorQue />);
    expect(screen.getByText(manifesto.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: manifesto.title })).toBeInTheDocument();
    expect(screen.getByText(manifesto.text)).toBeInTheDocument();
    expect(screen.getAllByText(manifesto.hub).length).toBeGreaterThanOrEqual(1);
  });

  it("o SVG da trilha tem role img e aria-label com o texto alternativo do manifesto", () => {
    renderWithMotion(<PorQue />);
    // Duas versoes (desktop e mobile); uma sempre fica escondida por CSS.
    const images = screen.getAllByRole("img", { name: manifesto.svgAlt });
    expect(images).toHaveLength(2);
    for (const svg of images) {
      expect(svg.tagName.toLowerCase()).toBe("svg");
      expect(svg).toHaveAttribute("aria-label", manifesto.svgAlt);
    }
  });

  it("mostra os 5 rotulos dos nos do manifesto", () => {
    renderWithMotion(<PorQue />);
    expect(manifesto.nodes).toHaveLength(5);
    for (const label of manifesto.nodes) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("traz a foto da consulta em casa com legenda e sem passar de 320 px", () => {
    renderWithMotion(<PorQue />);
    const img = screen.getByAltText(photos.pacienteCama.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("88vw");
    const figure = img.closest("figure");
    expect(figure).toHaveClass("max-w-xs", "aspect-[4/5]", "overflow-hidden");
    expect(figure?.querySelector("figcaption")).toHaveTextContent("Consulta em casa");
  });
});
