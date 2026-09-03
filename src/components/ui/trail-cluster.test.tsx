import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { specialties } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { TrailCluster } from "./trail-cluster";

// O IntersectionObserver de tests/setup.ts nunca dispara; useInView e useReducedMotion
// sao controlados por teste via mockReduced (ver 10.1 do brief).
const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => mockReduced(),
  };
});

// jsdom nao expoe SVGCircleElement/SVGPathElement; checamos a tag.
function getSvg(): Element {
  const svg = document.querySelector("svg[data-trail-cluster]");
  if (!svg) throw new Error("svg da Trilha da Amora nao encontrado");
  return svg;
}

function getNode(index: number): Element {
  const node = document.querySelector(`[data-node="${index}"]`);
  if (node?.tagName.toLowerCase() !== "circle") {
    throw new Error(`no ${index} nao encontrado`);
  }
  return node;
}

function getTrail(index: number): Element {
  const trail = document.querySelector(`[data-trail="${index}"]`);
  if (trail?.tagName.toLowerCase() !== "path") {
    throw new Error(`trilha ${index} nao encontrada`);
  }
  return trail;
}

describe("TrailCluster", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza o svg 560x560 decorativo (aria-hidden) quando nao ha label", () => {
    renderWithMotion(<TrailCluster />);
    const svg = getSvg();
    expect(svg).toHaveAttribute("viewBox", "0 0 560 560");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("vira role img com aria-label quando recebe label e mescla className", () => {
    renderWithMotion(<TrailCluster label="Trilha da Amora" className="mt-8 w-[260px]" />);
    const svg = screen.getByRole("img", { name: "Trilha da Amora" });
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg).toHaveClass("mt-8", "w-[260px]");
  });

  it("tem hub, 12 nos e 12 trilhas com data-node, data-specialty e data-state idle", () => {
    renderWithMotion(<TrailCluster animate="static" />);
    expect(document.querySelector("[data-hub]")).toBeInTheDocument();
    const nodes = document.querySelectorAll("[data-node]");
    expect(nodes).toHaveLength(12);
    expect(document.querySelectorAll("[data-trail]")).toHaveLength(12);
    specialties.forEach((specialty, i) => {
      const node = getNode(i);
      expect(node).toHaveAttribute("data-specialty", specialty.name);
      expect(node).toHaveAttribute("data-state", "idle");
    });
  });

  it("segue a geometria da secao 9.2 do brief", () => {
    renderWithMotion(<TrailCluster animate="static" />);
    const hub = document.querySelector("[data-hub]");
    expect(hub).toHaveAttribute("cx", "280");
    expect(hub).toHaveAttribute("cy", "280");
    expect(hub).toHaveAttribute("r", "34");

    const clinico = getNode(0);
    expect(clinico).toHaveAttribute("cx", "280");
    expect(clinico).toHaveAttribute("cy", "160");
    expect(clinico).toHaveAttribute("r", "22");
    expect(getTrail(0)).toHaveAttribute("d", "M 280 246 V 182");

    const pediatria = getNode(1);
    expect(pediatria).toHaveAttribute("cx", "400");
    expect(pediatria).toHaveAttribute("cy", "220");
    expect(getTrail(1)).toHaveAttribute("d", "M 314 280 H 340 L 384 236");
    const padPediatria = document.querySelector('[data-pad="1"]');
    expect(padPediatria).toHaveAttribute("cx", "340");
    expect(padPediatria).toHaveAttribute("cy", "280");
    expect(padPediatria).toHaveAttribute("r", "4");

    const psicologia = getNode(11);
    expect(psicologia).toHaveAttribute("cx", "80");
    expect(psicologia).toHaveAttribute("cy", "180");
    expect(psicologia).toHaveAttribute("r", "18");
    expect(getTrail(11)).toHaveAttribute("d", "M 138 220 H 120 L 93 193");

    // Trilhas: stroke 2, pontas arredondadas e traco que nao escala com o svg.
    const trail = getTrail(2);
    expect(trail).toHaveAttribute("stroke-width", "2");
    expect(trail).toHaveAttribute("stroke-linecap", "round");
    expect(trail).toHaveAttribute("stroke-linejoin", "round");
    expect(trail).toHaveAttribute("fill", "none");
    expect(trail).toHaveAttribute("vector-effect", "non-scaling-stroke");
    expect(getNode(2)).toHaveAttribute("stroke-width", "2");
    // Sem pad nas trilhas retas (N0, N2, N3, N5); as outras 8 dobram uma vez.
    expect(document.querySelector('[data-pad="0"]')).not.toBeInTheDocument();
    expect(document.querySelectorAll("[data-pad]")).toHaveLength(8);
  });

  it("acende o no ativo em berry-500 e engrossa a trilha ligada", () => {
    renderWithMotion(<TrailCluster animate="static" active={3} />);
    expect(getSvg()).toHaveAttribute("data-active", "3");
    const node = getNode(3);
    expect(node).toHaveAttribute("data-state", "active");
    expect(node.getAttribute("fill")).toContain("--color-berry-500");
    expect(getTrail(3)).toHaveAttribute("stroke-width", "3");
    expect(getTrail(3).getAttribute("stroke")).toContain("--color-berry-500");
    expect(getNode(4)).toHaveAttribute("data-state", "idle");
    expect(getTrail(4)).toHaveAttribute("stroke-width", "2");
  });

  it("nao expoe data-active quando active e null", () => {
    renderWithMotion(<TrailCluster animate="static" active={null} />);
    expect(getSvg()).not.toHaveAttribute("data-active");
  });

  it("confirma em leaf-500 imediatamente quando animate e static", () => {
    renderWithMotion(<TrailCluster animate="static" confirmed={0} />);
    const node = getNode(0);
    expect(node).toHaveAttribute("data-state", "confirmed");
    expect(node.getAttribute("fill")).toContain("--color-leaf-500");
  });

  it("confirmed prevalece sobre active no mesmo no", () => {
    renderWithMotion(<TrailCluster animate="static" active={2} confirmed={2} />);
    expect(getNode(2)).toHaveAttribute("data-state", "confirmed");
  });

  it("na intro confirma o no apos 1900 ms sem reduced motion", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<TrailCluster variant="full" animate="intro" confirmed={0} />);
    expect(getNode(0)).toHaveAttribute("data-state", "idle");
    expect(document.querySelector("[data-halo]")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800);
    });
    expect(getNode(0)).toHaveAttribute("data-state", "idle");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(getNode(0)).toHaveAttribute("data-state", "confirmed");
    // Halo unico que cresce sobre o no confirmado, so na variante full.
    const halo = document.querySelector("[data-halo]");
    expect(halo).toHaveAttribute("cx", "280");
    expect(halo).toHaveAttribute("cy", "160");
  });

  it("na intro com reduced motion confirma sem esperar e nao desenha halo", () => {
    mockReduced.mockReturnValue(true);
    renderWithMotion(<TrailCluster variant="full" animate="intro" confirmed={5} />);
    expect(getNode(5)).toHaveAttribute("data-state", "confirmed");
    expect(document.querySelector("[data-halo]")).not.toBeInTheDocument();
  });

  it("limpa o timer da intro ao desmontar", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<TrailCluster animate="intro" confirmed={0} />);
    unmount();
    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
  });

  it("variante mini nao renderiza halo nem no confirmado", () => {
    mockReduced.mockReturnValue(false);
    renderWithMotion(<TrailCluster variant="mini" animate="static" confirmed={1} />);
    expect(getNode(1)).toHaveAttribute("data-state", "confirmed");
    expect(document.querySelector("[data-halo]")).not.toBeInTheDocument();
  });

  it("variantes full e mini usam gradiente no hub e fill berry-100 nos nos", () => {
    renderWithMotion(<TrailCluster variant="full" animate="static" />);
    const gradient = document.querySelector("radialGradient");
    expect(gradient).toBeInTheDocument();
    const hub = document.querySelector("[data-hub]");
    expect(hub?.getAttribute("fill")).toBe(`url(#${gradient?.getAttribute("id")})`);
    expect(getNode(0).getAttribute("fill")).toContain("--color-berry-100");
    expect(getNode(0).getAttribute("stroke")).toContain("--color-ink");
    expect(getTrail(0).getAttribute("stroke")).toContain("--color-berry-300");
  });

  it("variante outline e so traco em berry-300, sem gradiente", () => {
    renderWithMotion(<TrailCluster variant="outline" animate="static" />);
    expect(document.querySelector("radialGradient")).not.toBeInTheDocument();
    const hub = document.querySelector("[data-hub]");
    expect(hub).toHaveAttribute("fill", "none");
    expect(hub?.getAttribute("stroke")).toContain("--color-berry-300");
    expect(getNode(0)).toHaveAttribute("fill", "none");
    expect(getNode(0).getAttribute("stroke")).toContain("--color-berry-300");
    expect(getSvg()).toHaveAttribute("data-variant", "outline");
  });

  it("dois clusters na mesma pagina tem ids de gradiente distintos", () => {
    renderWithMotion(
      <>
        <TrailCluster variant="full" animate="static" />
        <TrailCluster variant="mini" animate="static" />
      </>,
    );
    const ids = Array.from(document.querySelectorAll("radialGradient")).map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("nao desenha cometas por padrao", () => {
    renderWithMotion(<TrailCluster variant="full" animate="static" />);
    expect(document.querySelectorAll("[data-comet]")).toHaveLength(0);
  });

  it("com comets desenha uma trilha extra por no, em berry-500, com delays escalonados", () => {
    renderWithMotion(<TrailCluster variant="full" animate="static" comets />);
    const comets = document.querySelectorAll("[data-comet]");
    expect(comets).toHaveLength(12);
    // Trilhas normais seguem 12: o cometa e um segundo path sobre o mesmo d.
    expect(document.querySelectorAll("[data-trail]")).toHaveLength(12);

    const first = comets[0];
    expect(first.tagName.toLowerCase()).toBe("path");
    expect(first).toHaveAttribute("d", getTrail(0).getAttribute("d") ?? "");
    expect(first).toHaveAttribute("pathLength", "100");
    expect(first).toHaveAttribute("stroke-dasharray", "12 100");
    expect(first).toHaveAttribute("stroke-linecap", "round");
    expect(first).toHaveClass("animate-comet");
    expect(first.getAttribute("stroke")).toContain("--color-berry-500");

    // Delays deterministicos (sem Math.random) entre 0 s e 3 s.
    const delays = Array.from(comets).map((comet) =>
      Number.parseFloat((comet as HTMLElement).style.animationDelay),
    );
    expect(delays[0]).toBe(0);
    expect(Math.max(...delays)).toBeLessThanOrEqual(3);
    expect(new Set(delays).size).toBe(delays.length);
  });

  it("cometas da variante outline seguem o berry-300 do traco", () => {
    renderWithMotion(<TrailCluster variant="outline" animate="static" comets />);
    const comet = document.querySelector("[data-comet]");
    expect(comet?.getAttribute("stroke")).toContain("--color-berry-300");
  });
});
