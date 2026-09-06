import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { faq, specialties, specialtiesSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Especialidades } from "./especialidades";

/*
  Brief v4-secoes, 4.3: indice tipografico em duas colunas, nome como h3 e frase abaixo.
  Sem foto, sem cluster, sem hover com estado, sem indices, sem icone, sem eyebrow.
  Assertivas por presenca (RevealItem fica hidden no jsdom).
*/
describe("Especialidades", () => {
  it("renderiza a Section soft com h2 (aria-labelledby) e a lead nova", () => {
    renderWithMotion(<Especialidades />);
    const section = document.getElementById("especialidades");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("bg-gray-50");

    const heading = screen.getByRole("heading", { level: 2, name: specialtiesSection.title });
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    expect(screen.getByText(specialtiesSection.lead)).toBeInTheDocument();
    // O paragrafo sobre dependentes (faq[2].a) saiu junto com a coluna sticky.
    expect(screen.queryByText(faq[2].a)).toBeNull();
    expect(section?.querySelector(".eyebrow")).toBeNull();
  });

  it("lista as 12 especialidades como h3 na ordem, com as frases", () => {
    renderWithMotion(<Especialidades />);
    const list = screen.getByRole("list", { name: "Especialidades disponíveis" });
    const items = list.querySelectorAll(":scope > li");
    expect(items).toHaveLength(12);
    const names = within(list)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(specialties.map((s) => s.name));
    for (const s of specialties) {
      expect(within(list).getByText(s.blurb)).toBeInTheDocument();
    }
  });

  it("nao tem foto, svg, indices, nem li com borda ou fundo", () => {
    renderWithMotion(<Especialidades />);
    const section = document.getElementById("especialidades");
    expect(section?.querySelectorAll("img")).toHaveLength(0);
    expect(section?.querySelectorAll("svg")).toHaveLength(0);
    expect(section?.querySelectorAll("[data-trail-cluster]")).toHaveLength(0);
    expect(section?.querySelectorAll("[data-specialty]")).toHaveLength(0);
    expect(section?.textContent).not.toMatch(/\b0\d\b/);
    const list = screen.getByRole("list", { name: "Especialidades disponíveis" });
    for (const li of list.querySelectorAll(":scope > li")) {
      expect(li.className).not.toContain("border");
      expect(li.className).not.toMatch(/\bbg-/);
    }
  });

  it("a lista nao tem botoes, links nem tabindex: nada interativo", () => {
    renderWithMotion(<Especialidades />);
    const list = screen.getByRole("list", { name: "Especialidades disponíveis" });
    expect(within(list).queryAllByRole("button")).toHaveLength(0);
    expect(within(list).queryAllByRole("link")).toHaveLength(0);
    expect(list.querySelectorAll("[tabindex]")).toHaveLength(0);
  });
});
