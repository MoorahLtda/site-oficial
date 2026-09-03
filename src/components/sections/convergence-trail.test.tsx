import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { manifesto } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { ConvergenceTrail } from "./convergence-trail";

// O IntersectionObserver de tests/setup.ts nunca dispara; useInView e useReducedMotion
// sao controlados aqui (ver 10.1 do brief).
const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => mockReduced(),
  };
});

function getSvg(layout: "desktop" | "mobile"): Element {
  const svg = document.querySelector(`svg[data-layout="${layout}"]`);
  if (!svg) throw new Error(`svg ${layout} nao encontrado`);
  return svg;
}

function getHub(layout: "desktop" | "mobile"): Element {
  const hub = document.querySelector(`[data-hub="${layout}"]`);
  if (hub?.tagName.toLowerCase() !== "circle") throw new Error(`hub ${layout} nao encontrado`);
  return hub;
}

function getTrail(svg: Element, index: number): Element {
  const trail = svg.querySelector(`[data-trail="${index}"]`);
  if (trail?.tagName.toLowerCase() !== "path") throw new Error(`trilha ${index} nao encontrada`);
  return trail;
}

describe("ConvergenceTrail", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza as duas versoes como role img com o alt do manifesto e mescla className", () => {
    renderWithMotion(<ConvergenceTrail className="mt-12" />);
    const images = screen.getAllByRole("img", { name: manifesto.svgAlt });
    expect(images).toHaveLength(2);
    expect(getSvg("desktop")).toHaveAttribute("viewBox", "0 0 1100 260");
    expect(getSvg("mobile")).toHaveAttribute("viewBox", "0 0 320 360");
    expect(document.querySelector("[data-convergence-trail]")).toHaveClass("mt-12");
  });

  it("segue a geometria do brief no desktop: 5 nos a esquerda, dobras em 45 graus e hub a direita", () => {
    renderWithMotion(<ConvergenceTrail />);
    const svg = getSvg("desktop");
    expect(svg.querySelectorAll("[data-trail]")).toHaveLength(5);
    expect(svg.querySelectorAll("[data-node]")).toHaveLength(5);
    expect(getTrail(svg, 0)).toHaveAttribute("d", "M 96 30 H 660 L 760 130 H 972");
    expect(getTrail(svg, 1)).toHaveAttribute("d", "M 96 80 H 710 L 760 130 H 972");
    expect(getTrail(svg, 2)).toHaveAttribute("d", "M 96 130 H 972");
    expect(getTrail(svg, 3)).toHaveAttribute("d", "M 96 180 H 710 L 760 130 H 972");
    expect(getTrail(svg, 4)).toHaveAttribute("d", "M 96 230 H 660 L 760 130 H 972");

    const trail = getTrail(svg, 0);
    expect(trail).toHaveAttribute("stroke-width", "2");
    expect(trail).toHaveAttribute("fill", "none");
    expect(trail).toHaveAttribute("vector-effect", "non-scaling-stroke");
    expect(trail.getAttribute("stroke")).toContain("--color-berry-300");

    const node = svg.querySelector('[data-node="4"]');
    expect(node).toHaveAttribute("cx", "80");
    expect(node).toHaveAttribute("cy", "230");
    expect(node).toHaveAttribute("r", "8");
    expect(node?.getAttribute("fill")).toContain("--color-ink");

    // Pads nas quatro dobras e na juncao; a trilha do meio e reta.
    expect(svg.querySelector('[data-pad="2"]')).not.toBeInTheDocument();
    expect(svg.querySelectorAll("[data-pad]")).toHaveLength(5);
    const junction = svg.querySelector('[data-pad="junction"]');
    expect(junction).toHaveAttribute("cx", "760");
    expect(junction).toHaveAttribute("cy", "130");

    const hub = getHub("desktop");
    expect(hub).toHaveAttribute("cx", "1000");
    expect(hub).toHaveAttribute("cy", "130");
    expect(hub).toHaveAttribute("r", "28");
    expect(hub.getAttribute("stroke")).toContain("--color-ink");

    // Rotulos dentro do svg sao decorativos (o aria-label do svg ja descreve tudo).
    const labels = Array.from(svg.querySelectorAll("[data-label]"));
    expect(labels.map((el) => el.textContent)).toEqual([...manifesto.nodes]);
    for (const label of labels) expect(label).toHaveAttribute("aria-hidden", "true");
  });

  it("no mobile os nos ficam em linha no topo e descem em 45 graus ate o hub embaixo", () => {
    renderWithMotion(<ConvergenceTrail />);
    const svg = getSvg("mobile");
    expect(getTrail(svg, 0)).toHaveAttribute("d", "M 40 46 V 140 L 160 260 V 292");
    expect(getTrail(svg, 1)).toHaveAttribute("d", "M 100 46 V 200 L 160 260 V 292");
    expect(getTrail(svg, 2)).toHaveAttribute("d", "M 160 46 V 292");
    expect(getTrail(svg, 3)).toHaveAttribute("d", "M 220 46 V 200 L 160 260 V 292");
    expect(getTrail(svg, 4)).toHaveAttribute("d", "M 280 46 V 140 L 160 260 V 292");
    const hub = getHub("mobile");
    expect(hub).toHaveAttribute("cx", "160");
    expect(hub).toHaveAttribute("cy", "320");
    // Rotulos em HTML acima do svg (nao cabem entre nos a 60 unidades de distancia).
    const labels = Array.from(document.querySelectorAll("[data-mobile-label]"));
    expect(labels.map((el) => el.textContent)).toEqual([...manifesto.nodes]);
  });

  it("com reduced motion o hub ja nasce aceso, sem halo", () => {
    mockReduced.mockReturnValue(true);
    renderWithMotion(<ConvergenceTrail />);
    const hub = getHub("desktop");
    expect(hub).toHaveAttribute("data-state", "lit");
    expect(hub.getAttribute("fill")).toContain("--color-berry-500");
    expect(getHub("mobile")).toHaveAttribute("data-state", "lit");
    expect(document.querySelector("[data-halo]")).not.toBeInTheDocument();
  });

  it("sem reduced motion o hub acende 1100 ms depois de entrar em vista e dispara o halo", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<ConvergenceTrail />);
    const hub = getHub("desktop");
    expect(hub).toHaveAttribute("data-state", "idle");
    expect(hub.getAttribute("fill")).toContain("--color-berry-100");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(hub).toHaveAttribute("data-state", "idle");
    expect(document.querySelector("[data-halo]")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(hub).toHaveAttribute("data-state", "lit");
    expect(hub.getAttribute("fill")).toContain("--color-berry-500");
    const halo = getSvg("desktop").querySelector("[data-halo]");
    expect(halo).toHaveAttribute("cx", "1000");
    expect(halo).toHaveAttribute("cy", "130");
  });

  it("limpa o timer ao desmontar", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<ConvergenceTrail />);
    unmount();
    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
  });
});
