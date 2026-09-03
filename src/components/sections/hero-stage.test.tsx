import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hero, heroDynamic, photos } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { HeroStage } from "./hero-stage";

const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => mockReduced() };
});

// jsdom nao deixa alternar document.hidden; sobrescrevemos o getter no proprio document.
function setHidden(value: boolean): void {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
}

function cardText(index: number): string {
  return document.querySelector(`[data-moment="${index}"]`)?.textContent ?? "";
}

// Conteudo que o card carrega agora (o card que sai fica no DOM ate a animacao terminar; com
// fake timers ela nao termina, entao a fonte de verdade e o data-slot do proprio card).
function cardSlot(index: number): string | null {
  return document.querySelector(`[data-moment="${index}"]`)?.getAttribute("data-slot") ?? null;
}

function activeNode(): string | null {
  const svg = document.querySelector("svg[data-trail-cluster]");
  return svg?.getAttribute("data-active") ?? null;
}

function tick(times = 1): void {
  act(() => {
    vi.advanceTimersByTime(heroDynamic.eventEveryMs * times);
  });
}

describe("HeroStage", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("usa a foto do paciente como base do palco, com priority e sizes do brief", () => {
    renderWithMotion(<HeroStage />);
    const photo = screen.getByAltText(photos.heroPaciente.alt);
    expect(photo.tagName.toLowerCase()).toBe("img");
    expect(photo).toHaveAttribute("sizes", "(min-width: 1024px) 440px, 80vw");
    // priority: o next/image nao marca loading="lazy" e faz o preload no head.
    expect(photo).not.toHaveAttribute("loading", "lazy");
    expect(photo.getAttribute("srcset")).toContain("_next/image");
    expect(photo).toHaveClass("object-cover");

    const card = document.querySelector("[data-hero-photo]");
    expect(card).toHaveClass("aspect-[4/3]", "lg:aspect-[4/5]", "rounded-3xl", "overflow-hidden");
  });

  it("poe o simbolo da marca em disco branco sobre o hub, fora da arvore acessivel", () => {
    renderWithMotion(<HeroStage />);
    const mark = document.querySelector("[data-hero-mark]");
    expect(mark).toHaveClass("rounded-full", "bg-white", "ring-berry-100");
    const image = mark?.querySelector("img");
    expect(image?.getAttribute("src")).toContain("moorah-mark");
    expect(image).toHaveAttribute("alt", "");
    expect(mark?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("halo em deriva e cards em float continuo com delays escalonados", () => {
    renderWithMotion(<HeroStage />);
    expect(document.querySelector(".animate-drift")).toBeInTheDocument();
    const floats = document.querySelectorAll(".animate-float-slow");
    expect(floats).toHaveLength(hero.moments.length);
    const delays = Array.from(floats).map((el) => (el as HTMLElement).style.animationDelay);
    expect(delays).toEqual(["0s", "1.2s", "2.4s"]);
  });

  it("cluster full rotulado, no 0 confirmado e sem cometas sob reduced motion", () => {
    renderWithMotion(<HeroStage />);
    const cluster = screen.getByRole("img", { name: hero.clusterAlt });
    expect(cluster).toHaveAttribute("data-variant", "full");
    expect(cluster.querySelector('[data-node="0"]')).toHaveAttribute("data-state", "confirmed");
    // Movimento continuo desligado: nenhum cometa (nem um tracejado parado) nas trilhas.
    expect(cluster.querySelectorAll("[data-comet]")).toHaveLength(0);
  });

  it("liga os cometas depois da cascata das trilhas", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<HeroStage />);
    // Durante o desenho das trilhas ainda nao ha cometa correndo por elas.
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(12);
  });

  it("sob reduced motion os cards ficam com os momentos estaticos, sem rodizio", () => {
    vi.useFakeTimers();
    renderWithMotion(<HeroStage />);
    hero.moments.forEach((moment, index) => {
      expect(cardText(index)).toContain(moment.label);
    });

    tick(3);
    hero.moments.forEach((moment, index) => {
      expect(cardSlot(index)).toBe(`moment-${index}`);
      expect(cardText(index)).toContain(moment.label);
    });
    expect(activeNode()).toBeNull();
  });

  it("faz o rodizio dos eventos um card por vez, em ordem", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<HeroStage />);

    // Antes do primeiro evento: os momentos de hero.moments (estado do servidor).
    expect(cardSlot(0)).toBe("moment-0");
    expect(cardText(0)).toContain(hero.moments[0].label);

    tick();
    expect(cardSlot(0)).toBe("event-0");
    expect(cardText(0)).toContain(heroDynamic.events[0].text);
    expect(cardSlot(1)).toBe("moment-1");
    expect(cardSlot(2)).toBe("moment-2");

    tick();
    expect(cardSlot(0)).toBe("event-0");
    expect(cardSlot(1)).toBe("event-1");
    expect(cardText(1)).toContain(heroDynamic.events[1].text);

    tick();
    expect(cardSlot(2)).toBe("event-2");
    expect(cardText(2)).toContain(heroDynamic.events[2].text);

    // Quarto evento volta para o primeiro card.
    tick();
    expect(cardSlot(0)).toBe("event-3");
    expect(cardText(0)).toContain(heroDynamic.events[3].text);
  });

  it("evento com no acende o cluster por 1,6 s", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<HeroStage />);
    expect(activeNode()).toBeNull();

    // events[0] tem node 2.
    tick();
    expect(activeNode()).toBe(String(heroDynamic.events[0].node));

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(activeNode()).toBeNull();

    // events[1] nao tem no: o cluster segue apagado.
    tick();
    expect(activeNode()).toBeNull();
  });

  it("nao avanca o rodizio com a aba escondida", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    setHidden(true);
    renderWithMotion(<HeroStage />);

    tick(3);
    expect(cardSlot(0)).toBe("moment-0");

    setHidden(false);
    tick();
    expect(cardSlot(0)).toBe("event-0");
  });

  it("limpa o intervalo ao desmontar", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<HeroStage />);
    unmount();
    expect(() => {
      tick(2);
    }).not.toThrow();
    expect(document.querySelector("[data-moment]")).toBeNull();
  });

  it("cards e card mobile ficam fora da arvore acessivel", () => {
    renderWithMotion(<HeroStage />);
    const cards = document.querySelectorAll("[data-moment]");
    expect(cards).toHaveLength(hero.moments.length + 1);
    for (const card of cards) {
      expect(card).toHaveAttribute("aria-hidden", "true");
    }
  });
});
