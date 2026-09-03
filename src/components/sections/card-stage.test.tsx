import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cardSection, mocks } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { CardStage } from "./card-stage";

// O IntersectionObserver de tests/setup.ts nunca dispara: useInView e useReducedMotion sao
// controlados por teste (brief 10.1). Por padrao o palco esta em vista e sem reduced motion.
const mockReduced = vi.fn<() => boolean>(() => false);
const mockInView = vi.fn<() => boolean>(() => true);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useInView: () => mockInView(),
    useReducedMotion: () => mockReduced(),
  };
});

function readDigits(): string {
  return Array.from(document.querySelectorAll("[data-digit]"))
    .map((el) => el.textContent)
    .join("");
}

function grouped(sample: string): string {
  return `${sample.slice(0, 4)} ${sample.slice(4, 8)} ${sample.slice(8, 12)}`;
}

describe("CardStage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReduced.mockReturnValue(false);
    mockInView.mockReturnValue(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza 4 radios com Titular marcado, o cartao com alt e a lista de usos", () => {
    renderWithMotion(<CardStage heading={<h2>Cartao</h2>} note="Nota" />);
    const group = screen.getByRole("radiogroup", { name: cardSection.holderLabel });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "Titular" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByAltText(cardSection.imageAlt)).toBeInTheDocument();
    expect(document.querySelectorAll("[data-use]")).toHaveLength(cardSection.uses.length);
    expect(document.querySelectorAll("[data-use][data-lit]")).toHaveLength(0);
    expect(document.querySelectorAll("[data-digit]")).toHaveLength(12);
    expect(document.querySelectorAll("[data-digit][aria-hidden='true']")).toHaveLength(12);
  });

  it("fora de vista (estado do servidor) mostra o numero final, sem timers e sem usos acesos", () => {
    mockInView.mockReturnValue(false);
    renderWithMotion(<CardStage />);
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    expect(document.querySelectorAll("[data-use][data-lit]")).toHaveLength(0);
  });

  it("embaralha e resolve os 12 digitos do titular em ate 1500 ms, depois acende os usos", () => {
    renderWithMotion(<CardStage />);
    // Ao entrar em vista os digitos embaralham (tick 0) e assentam um a um.
    expect(readDigits()).not.toBe(mocks.cardSamples[0]);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(document.querySelectorAll("[data-use][data-lit]")).toHaveLength(cardSection.uses.length);
    const number = screen.getByRole("img", {
      name: `${cardSection.sampleAria}: ${grouped(mocks.cardSamples[0])}`,
    });
    expect(number).toBeInTheDocument();
  });

  it("trocar para Dependente 1 reexecuta a resolucao e termina em cardSamples[1]", () => {
    renderWithMotion(<CardStage />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByRole("radio", { name: "Dependente 1" }));
    expect(screen.getByRole("radio", { name: "Dependente 1" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    // O rotulo acessivel muda na hora; os digitos visiveis se resolvem em seguida.
    expect(
      screen.getByRole("img", {
        name: `${cardSection.sampleAria}: ${grouped(mocks.cardSamples[1])}`,
      }),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(readDigits()).toBe(mocks.cardSamples[1]);
    expect(screen.getByText("Dependente 1", { selector: "[data-holder]" })).toBeInTheDocument();
  });

  it("com reduced motion mostra os digitos finais e os usos acesos sem avancar timers", () => {
    mockReduced.mockReturnValue(true);
    renderWithMotion(<CardStage />);
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    expect(document.querySelectorAll("[data-use][data-lit]")).toHaveLength(cardSection.uses.length);
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
  });
});
