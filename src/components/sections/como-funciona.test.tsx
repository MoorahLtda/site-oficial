import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { howItWorks, photos, steps } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { ComoFunciona } from "./como-funciona";

/*
  Brief v4-secoes, 4.2: foto idosoTablet de um lado, lista vertical dos quatro passos do outro,
  dentro de <ol aria-label="Passos"> com li filhos diretos (Reveal as="li"). Sem trilha, sem
  cometa, sem indices, sem mini UIs. Assertivas por presenca (Reveal fica hidden no jsdom).
*/
describe("ComoFunciona", () => {
  it("usa Section com id como-funciona, h2 ligado por aria-labelledby e a lead", () => {
    renderWithMotion(<ComoFunciona />);
    const section = document.getElementById("como-funciona");
    expect(section?.tagName).toBe("SECTION");
    const h2 = screen.getByRole("heading", { level: 2, name: howItWorks.title });
    expect(h2).toHaveAttribute("id");
    expect(section).toHaveAttribute("aria-labelledby", h2.getAttribute("id"));
    expect(screen.getByText(howItWorks.lead)).toBeInTheDocument();
    // Sem eyebrow: a secao abre direto no h2 (tabela da secao 2 do brief).
    expect(section?.querySelector(".eyebrow")).toBeNull();
  });

  it("renderiza 4 li filhos diretos de ol 'Passos', cada um com h3 na ordem de steps", () => {
    renderWithMotion(<ComoFunciona />);
    const list = screen.getByRole("list", { name: "Passos" });
    expect(list.tagName).toBe("OL");
    const items = list.querySelectorAll(":scope > li");
    expect(items).toHaveLength(4);
    const headings = within(list).getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(steps.map((s) => s.title));
    for (const step of steps) {
      expect(screen.getByText(step.text)).toBeInTheDocument();
    }
  });

  it("traz a foto idosoTablet lazy com sizes e nenhuma outra img", () => {
    renderWithMotion(<ComoFunciona />);
    const img = screen.getByAltText(photos.idosoTablet.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    expect(img.parentElement).toHaveClass("overflow-hidden", "rounded-3xl");
    expect(document.querySelectorAll("#como-funciona img")).toHaveLength(1);
  });

  it("corta a foto pela esquerda, onde esta o senhor (principio 1: uma pessoa em cena)", () => {
    renderWithMotion(<ComoFunciona />);
    const img = screen.getByAltText(photos.idosoTablet.alt);
    /*
      A origem e 3:2 deitada, com o senhor na borda esquerda em primeiro plano. object-left
      mantem a pessoa no quadro; um recorte centrado devolve uma mesa com um tablet e ninguem,
      que e o oposto do que o alt promete. O quadro quadrado em lg mostra 67% da largura
      (4:5 mostraria 53% e nao caberiam pessoa e tablet juntos).
    */
    expect(img).toHaveClass("object-left");
    expect(img.parentElement).toHaveClass("lg:aspect-square");
  });

  it("nao tem trilha, cometa, indices, ilustracoes nem borda entre os passos", () => {
    renderWithMotion(<ComoFunciona />);
    const section = document.getElementById("como-funciona");
    expect(section?.querySelectorAll("[data-track]")).toHaveLength(0);
    expect(section?.querySelectorAll("[data-comet]")).toHaveLength(0);
    expect(section?.querySelectorAll("[data-lit]")).toHaveLength(0);
    expect(section?.querySelectorAll("[data-illustration]")).toHaveLength(0);
    expect(section?.textContent).not.toMatch(/\b0\d\b/);
    const list = screen.getByRole("list", { name: "Passos" });
    expect(list.className).not.toContain("divide-y");
    for (const li of list.querySelectorAll(":scope > li")) {
      expect(li.className).not.toContain("border");
    }
  });
});
