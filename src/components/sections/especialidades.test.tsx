import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { faq, photos, specialties, specialtiesSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Especialidades } from "./especialidades";

// O IntersectionObserver de tests/setup.ts nunca dispara; com reduced motion o cluster
// renderiza as trilhas no estado final (ver 10.1 do brief).
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

function getCluster(): Element {
  const svg = document.querySelector("#especialidades svg[data-trail-cluster]");
  if (!svg) throw new Error("cluster mini nao encontrado na secao");
  return svg;
}

function getRow(index: number): HTMLElement {
  const row = document.querySelector<HTMLElement>(`#especialidades [data-specialty="${index}"]`);
  if (!row) throw new Error(`linha ${index} nao encontrada`);
  return row;
}

describe("Especialidades", () => {
  it("renderiza a Section soft com h2 (aria-labelledby), lead da FAQ e 12 linhas com h3", () => {
    renderWithMotion(<Especialidades />);
    const section = document.getElementById("especialidades");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("bg-gray-50");

    const heading = screen.getByRole("heading", { level: 2, name: specialtiesSection.title });
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    expect(screen.getByText(specialtiesSection.eyebrow)).toHaveClass("eyebrow");
    expect(screen.getByText(faq[2].a)).toBeInTheDocument();

    const list = screen.getByRole("list", { name: "Especialidades disponíveis" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(12);
    const names = within(list)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(names).toEqual(specialties.map((s) => s.name));
    specialties.forEach((s) => {
      expect(within(list).getByText(s.blurb)).toBeInTheDocument();
    });
  });

  it("a lista nao tem botoes nem links: a interacao e so de hover", () => {
    renderWithMotion(<Especialidades />);
    const list = screen.getByRole("list", { name: "Especialidades disponíveis" });
    expect(within(list).queryAllByRole("button")).toHaveLength(0);
    expect(within(list).queryAllByRole("link")).toHaveLength(0);
    expect(list.querySelectorAll("[tabindex]")).toHaveLength(0);
  });

  it("hover na linha 3 acende o no 3 do cluster e sair apaga", () => {
    renderWithMotion(<Especialidades />);
    const cluster = getCluster();
    expect(cluster).toHaveAttribute("aria-hidden", "true");
    expect(cluster).toHaveAttribute("data-variant", "mini");
    expect(cluster).toHaveAttribute("data-animate", "draw");
    expect(cluster).not.toHaveAttribute("data-active");

    fireEvent.pointerEnter(getRow(3), { pointerType: "mouse" });
    expect(cluster).toHaveAttribute("data-active", "3");
    expect(cluster.querySelector('[data-node="3"]')).toHaveAttribute("data-state", "active");
    expect(cluster.querySelector('[data-node="4"]')).toHaveAttribute("data-state", "idle");

    fireEvent.pointerLeave(getRow(3), { pointerType: "mouse" });
    expect(cluster).not.toHaveAttribute("data-active");
    expect(cluster.querySelector('[data-node="3"]')).toHaveAttribute("data-state", "idle");
  });

  it("a coluna sticky traz a foto da medica com o cluster mini em card branco por cima", () => {
    renderWithMotion(<Especialidades />);
    const block = document.querySelector("#especialidades [data-specialties-photo]");
    if (!block) throw new Error("bloco da foto nao encontrado");
    const img = within(block as HTMLElement).getByAltText(photos.medicaSorrindo.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    expect(img.parentElement).toHaveClass("aspect-[4/5]", "overflow-hidden", "rounded-3xl");

    const clusterCard = getCluster().parentElement;
    expect(clusterCard).toHaveClass("w-56", "rounded-2xl", "bg-white", "p-3", "shadow-float");
    expect(block).toContainElement(clusterCard as HTMLElement);
  });
});
