import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { manifesto, specialties } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { SpecialtiesIndex } from "./specialties-index";

// Por padrao reduced motion: o cluster nasce no estado final e sem cometas.
const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => mockReduced() };
});

function getCluster(): Element {
  const svg = document.querySelector("svg[data-trail-cluster]");
  if (!svg) throw new Error("cluster nao encontrado");
  return svg;
}

describe("SpecialtiesIndex", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza o heading recebido na coluna sticky, antes do cluster", () => {
    renderWithMotion(<SpecialtiesIndex heading={<h2 id="t">Título</h2>} />);
    const heading = screen.getByRole("heading", { level: 2, name: "Título" });
    const column = heading.parentElement;
    expect(column).toHaveClass("lg:sticky", "lg:top-28", "self-start");
    expect(column).toContainElement(getCluster() as HTMLElement);
  });

  it("ignora toque (pointer coarse): so o mouse acende o no", () => {
    renderWithMotion(<SpecialtiesIndex heading={null} />);
    const row = document.querySelector<HTMLElement>('[data-specialty="1"]');
    if (!row) throw new Error("linha nao encontrada");

    fireEvent.pointerEnter(row, { pointerType: "touch" });
    expect(getCluster()).not.toHaveAttribute("data-active");

    fireEvent.pointerEnter(row, { pointerType: "mouse" });
    expect(getCluster()).toHaveAttribute("data-active", "1");
  });

  it("legenda mono do cluster mostra o hub em repouso e a especialidade no hover", () => {
    renderWithMotion(<SpecialtiesIndex heading={null} />);
    const caption = document.querySelector("[data-cluster-caption]");
    expect(caption).toHaveAttribute("aria-hidden", "true");
    expect(caption).toHaveTextContent(manifesto.hub);

    const row = document.querySelector<HTMLElement>('[data-specialty="7"]');
    if (!row) throw new Error("linha nao encontrada");
    fireEvent.pointerEnter(row, { pointerType: "mouse" });
    expect(caption).toHaveTextContent(specialties[7].name);
    // Indices editoriais 01..12 acompanham cada linha.
    expect(row).toHaveTextContent("08");
  });

  it("liga os cometas do cluster mini depois do desenho das trilhas", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<SpecialtiesIndex heading={null} />);
    expect(document.querySelector("[data-comet]")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1800);
    });
    const comets = document.querySelectorAll("[data-comet]");
    expect(comets).toHaveLength(specialties.length);
    expect(comets[0]).toHaveAttribute("pathLength", "100");
    expect(comets[0]).toHaveAttribute("stroke-dasharray", "12 100");
    expect(comets[0]).toHaveClass("animate-comet");
  });

  it("sob reduced motion o cluster mini nunca ganha cometas", () => {
    vi.useFakeTimers();
    renderWithMotion(<SpecialtiesIndex heading={null} />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(document.querySelector("[data-comet]")).toBeNull();
  });
});
