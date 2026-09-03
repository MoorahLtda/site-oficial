import { act, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mocks } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PharmacyMock } from "./pharmacy-mock";

const mockReduced = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => true,
    useReducedMotion: () => mockReduced(),
  };
});

describe("PharmacyMock", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("digita os 12 digitos e mostra Cartao reconhecido em ate 1200 ms", () => {
    mockReduced.mockReturnValue(false);
    vi.useFakeTimers();
    renderWithMotion(<PharmacyMock />);
    expect(screen.queryByText(mocks.cardRecognized)).toBeNull();
    const box = document.querySelector("[data-card-digits]");
    expect(box).toHaveAttribute("data-shown", "0");

    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(box).toHaveAttribute("data-shown", "5");
    expect(screen.queryByText(mocks.cardRecognized)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(850);
    });
    expect(box).toHaveAttribute("data-shown", "12");
    expect(screen.getByText(mocks.cardRecognized)).toBeInTheDocument();
  });

  it("com reduced motion mostra o numero completo e o selo de imediato", () => {
    renderWithMotion(<PharmacyMock />);
    expect(document.querySelector("[data-card-digits]")).toHaveAttribute("data-shown", "12");
    expect(screen.getByText(mocks.cardRecognized)).toBeInTheDocument();
    expect(screen.getByText(mocks.cardNumberField)).toBeInTheDocument();
    // Ilustracao: nao entra na arvore de acessibilidade.
    expect(document.querySelector("[data-pharmacy-mock]")).toHaveAttribute("aria-hidden", "true");
  });
});
