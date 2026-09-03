import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { steps } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { StepsTrail } from "./steps-trail";

// useInView e useReducedMotion controlados por teste (ver 10.1 do brief).
const mockInView = vi.fn<() => boolean>(() => true);
const mockReduced = vi.fn<() => boolean>(() => false);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => mockInView(),
    useReducedMotion: () => mockReduced(),
  };
});

function litStates(): string[] {
  return Array.from(document.querySelectorAll("[data-lit]")).map(
    (node) => node.getAttribute("data-lit") ?? "",
  );
}

describe("StepsTrail", () => {
  beforeEach(() => {
    mockInView.mockReturnValue(true);
    mockReduced.mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("acende os nos em cascata a 0, 350, 700 e 1050 ms depois de entrar em vista", () => {
    vi.useFakeTimers();
    renderWithMotion(<StepsTrail steps={steps} />);
    expect(screen.getByRole("list", { name: "Passos" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(litStates()).toEqual(["true", "false", "false", "false"]);

    act(() => {
      vi.advanceTimersByTime(349);
    });
    expect(litStates()).toEqual(["true", "false", "false", "false"]);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(litStates()).toEqual(["true", "true", "false", "false"]);

    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(litStates()).toEqual(["true", "true", "true", "false"]);

    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(litStates()).toEqual(["true", "true", "true", "true"]);
  });

  it("nao acende nada antes de entrar em vista", () => {
    vi.useFakeTimers();
    mockInView.mockReturnValue(false);
    renderWithMotion(<StepsTrail steps={steps} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(litStates()).toEqual(["false", "false", "false", "false"]);
  });

  it("limpa os timers ao desmontar", () => {
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<StepsTrail steps={steps} />);
    unmount();
    expect(() => {
      act(() => {
        vi.runAllTimers();
      });
    }).not.toThrow();
  });

  it("tem trilha horizontal (desktop) e regua vertical (mobile) decorativas", () => {
    renderWithMotion(<StepsTrail steps={steps} />);
    const horizontal = document.querySelector("[data-track='horizontal']");
    const vertical = document.querySelector("[data-track='vertical']");
    expect(horizontal).toHaveAttribute("aria-hidden", "true");
    expect(horizontal).toHaveClass("hidden", "lg:block");
    // Centro da primeira e da ultima coluna com 4 colunas e gap-6: 12,5% - 0,5625rem.
    expect(horizontal).toHaveClass("left-[calc(12.5%-0.5625rem)]", "right-[calc(12.5%-0.5625rem)]");
    expect(vertical).toHaveAttribute("aria-hidden", "true");
    expect(vertical).toHaveClass("lg:hidden");
  });

  it("solta um cometa continuo na trilha horizontal depois do desenho", () => {
    vi.useFakeTimers();
    renderWithMotion(<StepsTrail steps={steps} />);
    expect(document.querySelector("[data-comet]")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1400);
    });
    const comet = document.querySelector("[data-comet]");
    expect(comet).toHaveAttribute("pathLength", "100");
    expect(comet).toHaveAttribute("stroke-dasharray", "12 100");
    expect(comet).toHaveAttribute("stroke-linecap", "round");
    expect(comet).toHaveClass("animate-comet");
    expect(comet?.closest("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("sob reduced motion nao ha cometa na trilha", () => {
    mockReduced.mockReturnValue(true);
    vi.useFakeTimers();
    renderWithMotion(<StepsTrail steps={steps} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(document.querySelector("[data-comet]")).toBeNull();
  });
});
