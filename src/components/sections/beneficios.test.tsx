import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cardSection, plans } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Beneficios } from "./beneficios";

/*
  Bloco fundido Cartao + Beneficios (brief v4-secoes, 4.4): unico bloco plum id=beneficios.
  O palco do cartao entra por next/dynamic de verdade (sem mock): os casos que precisam dele
  usam findByRole e esperam o chunk resolver.
*/

describe("Beneficios (bloco fundido com o Cartao)", () => {
  it("usa Section plum com id beneficios, wrapper rounded-3xl text-white e aria-labelledby do h2", () => {
    renderWithMotion(<Beneficios />);
    const section = document.getElementById("beneficios");
    expect(section?.tagName).toBe("SECTION");
    const wrapper = section?.querySelector(".rounded-3xl");
    expect(wrapper).toHaveClass("text-white");
    const h2 = screen.getByRole("heading", { level: 2, name: cardSection.title });
    expect(h2.id).toBeTruthy();
    expect(section).toHaveAttribute("aria-labelledby", h2.id);
  });

  it("abre com o eyebrow em berry-300 e o paragrafo do cartao como lead", () => {
    renderWithMotion(<Beneficios />);
    const eyebrow = screen.getByText(cardSection.eyebrow);
    expect(eyebrow).toHaveClass("eyebrow", "text-berry-300");
    expect(screen.getByText(cardSection.lead)).toBeInTheDocument();
  });

  it("lista 4 beneficios como h3 na ordem de cardSection.benefits, com os textos", () => {
    renderWithMotion(<Beneficios />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(
      cardSection.benefits.map((benefit) => benefit.title),
    );
    for (const benefit of cardSection.benefits) {
      expect(screen.getByText(benefit.text)).toBeInTheDocument();
    }
  });

  it("no DOM a ordem e heading, palco do cartao, lista (ordem visual do mobile)", async () => {
    renderWithMotion(<Beneficios />);
    const h2 = screen.getByRole("heading", { level: 2, name: cardSection.title });
    const stage = await screen.findByRole("radiogroup", { name: cardSection.holderLabel });
    const list = screen.getByRole("list");
    expect(h2.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(stage.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("o palco entra por next/dynamic com o radiogroup, o cartao e a nota", async () => {
    renderWithMotion(<Beneficios />);
    const group = await screen.findByRole("radiogroup", { name: cardSection.holderLabel });
    expect(group).toBeInTheDocument();
    expect(await screen.findByAltText(cardSection.imageAlt)).toBeInTheDocument();
    expect(screen.getByText(plans[1].features[1])).toBeInTheDocument();
  });

  it("nao traz lockup, tablist, svg nem fotografia dentro do bloco", async () => {
    renderWithMotion(<Beneficios />);
    await screen.findByRole("radiogroup", { name: cardSection.holderLabel });
    const section = document.getElementById("beneficios");
    expect(section?.querySelector("[data-brand-lockup]")).toBeNull();
    expect(section?.querySelector("[role=tablist]")).toBeNull();
    expect(section?.querySelectorAll("svg")).toHaveLength(0);
    // Uma unica img: o cartao (objeto da marca); nenhuma foto de photos.* no bloco.
    expect(section?.querySelectorAll("img")).toHaveLength(1);
    expect(section?.querySelectorAll("[data-use]")).toHaveLength(0);
  });
});
