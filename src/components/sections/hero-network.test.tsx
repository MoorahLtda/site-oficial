import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { heroDynamic, photos } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { HeroNetwork } from "./hero-network";

const mockReduced = vi.fn<() => boolean>(() => true);

// O IntersectionObserver de tests/setup.ts nunca dispara: useInView vira `true` para o compasso
// andar; useReducedMotion e controlado por teste (docs/design-brief.md 10.1).
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => mockReduced() };
});

// jsdom nao deixa alternar document.hidden; sobrescrevemos o getter no proprio document.
function setHidden(value: boolean): void {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
}

function getSvg(): Element {
  const svg = document.querySelector("svg[data-trail-cluster]");
  if (!svg) throw new Error("svg da rede nao encontrado");
  return svg;
}

function activeNode(): string | null {
  return getSvg().getAttribute("data-active");
}

function disc(id: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(`[data-photo-node="${id}"]`);
  if (!element) throw new Error(`disco ${id} nao encontrado`);
  return element;
}

function photoIndex(id: string): string | null {
  return disc(id).getAttribute("data-photo-index");
}

// Um compasso do metronomo (heroDynamic.eventEveryMs = 4,2 s).
function tick(times = 1): void {
  act(() => {
    vi.advanceTimersByTime(heroDynamic.eventEveryMs * times);
  });
}

describe("HeroNetwork", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sob reduced motion mostra a rede plum parada, com a primeira foto em cada disco e nada por cima", () => {
    renderWithMotion(<HeroNetwork />);

    const discs = document.querySelectorAll("[data-photo-node]");
    expect(discs).toHaveLength(3);
    expect(Array.from(discs).map((el) => el.getAttribute("data-photo-node"))).toEqual([
      "medicos",
      "familia",
      "paciente",
    ]);
    for (const element of discs) {
      expect(element).toHaveAttribute("data-photo-index", "0");
      // Nenhum texto, chip ou simbolo dentro do disco de foto (restricao dura 1).
      expect(element.textContent).toBe("");
    }
    expect(screen.getByAltText(photos.medicaSorrindo.alt)).toBeInTheDocument();
    expect(screen.getByAltText(photos.familiaSofa.alt)).toBeInTheDocument();
    expect(screen.getByAltText(photos.heroPaciente.alt)).toBeInTheDocument();

    // Sem priority (o h1 e o LCP). Next 16 preanuncia toda imagem eager, entao so a foto visivel
    // de cada disco e eager; a escondida fica lazy. O simbolo do hub tambem nao e lazy.
    expect(document.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-photo-current] img[loading="lazy"]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-photo-node] img[loading="lazy"]')).toHaveLength(3);
    expect(document.querySelector("[data-hero-mark] img")).not.toHaveAttribute("loading", "lazy");

    const svg = getSvg();
    expect(svg).toHaveAttribute("data-tone", "plum");
    expect(svg.querySelector('[data-node="0"]')).toHaveAttribute("data-state", "confirmed");
    for (const index of [5, 7, 8]) {
      expect(svg.querySelector(`[data-node="${index}"]`)).toHaveAttribute("data-emphasis", "true");
    }
    expect(svg.querySelectorAll("[data-comet]")).toHaveLength(0);

    const mark = document.querySelector("[data-hero-mark] img");
    expect(mark?.getAttribute("src")).toContain("moorah-mark");
    expect(mark).toHaveAttribute("alt", "");
    expect(document.querySelector("[data-hub-pulse]")).not.toBeInTheDocument();
  });

  it("liga os cometas so depois da cascata das trilhas", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<HeroNetwork />);
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(2199);
    });
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(12);
  });

  it("cada compasso acende o no do evento e troca a foto do disco filho; sem no, so o hub pulsa", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<HeroNetwork />);
    expect(activeNode()).toBeNull();

    // events[0]: no 2 (Cardiologia) > disco paciente (N8).
    tick();
    expect(activeNode()).toBe("2");
    expect(photoIndex("paciente")).toBe("1");
    expect(photoIndex("medicos")).toBe("0");
    expect(photoIndex("familia")).toBe("0");

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(activeNode()).toBeNull();

    // events[1]: sem no. So o anel do hub pulsa; nenhuma foto troca.
    tick();
    expect(activeNode()).toBeNull();
    expect(document.querySelector('[data-hub-pulse][data-step="1"]')).toBeInTheDocument();
    expect(photoIndex("paciente")).toBe("1");
    expect(photoIndex("medicos")).toBe("0");

    // events[2]: no 0 (Clinico geral) > disco medicos (N5).
    tick();
    expect(activeNode()).toBe("0");
    expect(photoIndex("medicos")).toBe("1");
    expect(photoIndex("familia")).toBe("0");

    // events[3] sem no; events[4]: no 1 (Pediatria) > disco familia (N7).
    tick(2);
    expect(activeNode()).toBe("1");
    expect(photoIndex("familia")).toBe("1");
  });

  it("nao avanca o compasso com a aba escondida", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    setHidden(true);
    renderWithMotion(<HeroNetwork />);

    tick(3);
    expect(activeNode()).toBeNull();
    for (const id of ["medicos", "familia", "paciente"]) {
      expect(photoIndex(id)).toBe("0");
    }

    setHidden(false);
    tick();
    expect(activeNode()).toBe("2");
    expect(photoIndex("paciente")).toBe("1");
  });

  it("posiciona os discos em % das coordenadas do svg (viewBox 560)", () => {
    renderWithMotion(<HeroNetwork />);
    // N8 Oftalmologia: centro (430, 470), raio 52 -> diametro util 2r - 8.
    const paciente = disc("paciente");
    expect(paciente).toHaveAttribute("data-node-index", "8");
    expect(Number.parseFloat(paciente.style.left)).toBeCloseTo(76.79, 1);
    expect(Number.parseFloat(paciente.style.top)).toBeCloseTo(83.93, 1);
    expect(Number.parseFloat(paciente.style.width)).toBeCloseTo(17.14, 1);
    expect(disc("medicos")).toHaveAttribute("data-node-index", "5");
    expect(disc("familia")).toHaveAttribute("data-node-index", "7");
  });

  it("limpa intervalo e timers ao desmontar", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<HeroNetwork />);
    tick();
    unmount();
    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
    expect(document.querySelector("[data-photo-node]")).toBeNull();
  });
});
