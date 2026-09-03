import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mocks } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { ExamsNetwork } from "./exams-network";

const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => mockReduced(),
  };
});

describe("ExamsNetwork", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("desenha svg decorativo 320x120 com hub, 8 nos e 8 trilhas", () => {
    renderWithMotion(<ExamsNetwork />);
    const svg = document.querySelector("svg[data-exams-network]");
    expect(svg).toHaveAttribute("viewBox", "0 0 320 120");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    const hub = document.querySelector("[data-hub]");
    expect(hub).toHaveAttribute("cx", "160");
    expect(hub).toHaveAttribute("cy", "60");
    expect(hub).toHaveAttribute("r", "8");
    expect(document.querySelectorAll("[data-node]")).toHaveLength(8);
    const trails = document.querySelectorAll("[data-trail]");
    expect(trails).toHaveLength(8);
    expect(trails[0]).toHaveAttribute("vector-effect", "non-scaling-stroke");
    expect(trails[0]).toHaveAttribute("stroke-width", "2");
  });

  it("com reduced motion os nos ja estao acesos e o selo aparece", () => {
    renderWithMotion(<ExamsNetwork />);
    const node = document.querySelector('[data-node="3"]');
    expect(node?.getAttribute("fill")).toContain("--color-berry-500");
    expect(screen.getByText(mocks.discountApplied)).toBeInTheDocument();
  });

  it("sem reduced motion acende os nos e mostra o selo depois do desenho", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<ExamsNetwork />);
    const node = document.querySelector('[data-node="0"]');
    expect(node?.getAttribute("fill")).toContain("--color-gray-300");
    expect(screen.queryByText(mocks.discountApplied)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(node?.getAttribute("fill")).toContain("--color-berry-500");
    expect(screen.getByText(mocks.discountApplied)).toBeInTheDocument();
  });

  it("no tone photo a rede vira branca e ganha cometas depois do desenho", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<ExamsNetwork tone="photo" />);
    expect(document.querySelector("[data-exams-network-wrap]")).toHaveAttribute(
      "data-tone",
      "photo",
    );
    expect(document.querySelector("[data-comet]")).toBeNull();
    expect(document.querySelector('[data-trail="0"]')?.getAttribute("stroke")).toBe("#ffffff");

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    const comets = document.querySelectorAll("[data-comet]");
    expect(comets).toHaveLength(8);
    expect(comets[0]).toHaveAttribute("pathLength", "100");
    expect(comets[0]).toHaveAttribute("stroke-dasharray", "12 100");
    expect(comets[0]).toHaveAttribute("stroke", "#ffffff");
    expect(comets[0]).toHaveClass("animate-comet");
    expect(document.querySelector('[data-node="0"]')?.getAttribute("fill")).toBe("#ffffff");
  });

  it("no tone photo com reduced motion nao ha cometa", () => {
    vi.useFakeTimers();
    renderWithMotion(<ExamsNetwork tone="photo" />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(document.querySelector("[data-comet]")).toBeNull();
  });
});
