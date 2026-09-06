import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cardSection, mocks, plans } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { CardStage } from "./card-stage";

/*
  O IntersectionObserver de tests/setup.ts nunca dispara: useInView e useReducedMotion sao
  controlados por teste. Por padrao o palco esta em vista e sem reduced motion.
  Brief v4-secoes, 4.4: o palco perdeu heading e uses; a maquina de ticks para no tick em que o
  ultimo digito assenta (ENTRY end = 6 + 11) e o intervalo nao pode vazar depois disso.
*/
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

  it("renderiza so a coluna do cartao: radiogroup, cartao com alt e nota; sem usos e sem svg", () => {
    renderWithMotion(<CardStage note={plans[1].features[1]} />);
    const group = screen.getByRole("radiogroup", { name: cardSection.holderLabel });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "Titular" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByAltText(cardSection.imageAlt)).toBeInTheDocument();
    expect(screen.getByText(plans[1].features[1])).toBeInTheDocument();
    expect(document.querySelector("[data-card-stage]")).not.toBeNull();
    // A lista de usos saiu do palco (brief 4.4); nenhum icone sobrou.
    expect(document.querySelectorAll("[data-use]")).toHaveLength(0);
    expect(document.querySelectorAll("svg")).toHaveLength(0);
    expect(document.querySelectorAll("[data-digit][aria-hidden='true']")).toHaveLength(12);
  });

  it("o segmented control vira grade 2x2 no mobile, sem wrapper de rolagem horizontal", () => {
    renderWithMotion(<CardStage />);
    const group = screen.getByRole("radiogroup", { name: cardSection.holderLabel });
    expect(group).toHaveClass("grid", "grid-cols-2", "rounded-2xl");
    expect(group.className).toContain("sm:inline-flex");
    expect(group.className).toContain("sm:rounded-full");
    // tailwind-merge: o display base inline-flex cede lugar ao grid.
    expect(group.className.split(" ")).not.toContain("inline-flex");
    expect(group.parentElement?.className ?? "").not.toContain("overflow-x-auto");
  });

  it("fora de vista (estado do servidor) mostra o numero final e nao arma intervalo", () => {
    mockInView.mockReturnValue(false);
    renderWithMotion(<CardStage />);
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
  });

  it("na entrada os digitos embaralham, assentam ate o tick final e o intervalo nao vaza", () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    renderWithMotion(<CardStage />);
    // Ao entrar em vista os digitos embaralham (tick 0) e assentam um a um.
    expect(readDigits()).not.toBe(mocks.cardSamples[0]);
    // ENTRY end = 6 + 11 = 17 ticks de 60 ms; 1100 ms cobre com folga.
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    // run voltou a null: todo setInterval armado foi limpo e nada mais muda.
    expect(clearIntervalSpy.mock.calls.length).toBeGreaterThanOrEqual(
      setIntervalSpy.mock.calls.length,
    );
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    expect(
      screen.getByRole("img", {
        name: `${cardSection.sampleAria}: ${grouped(mocks.cardSamples[0])}`,
      }),
    ).toBeInTheDocument();
  });

  it("trocar para Dependente 1 atualiza o rotulo na hora e reassenta em cardSamples[1]", () => {
    renderWithMotion(<CardStage />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    fireEvent.click(screen.getByRole("radio", { name: "Dependente 1" }));
    expect(screen.getByRole("radio", { name: "Dependente 1" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    // O rotulo acessivel muda na hora; os digitos visiveis se resolvem em seguida (12 ticks).
    expect(
      screen.getByRole("img", {
        name: `${cardSection.sampleAria}: ${grouped(mocks.cardSamples[1])}`,
      }),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(readDigits()).toBe(mocks.cardSamples[1]);
    expect(screen.getByText("Dependente 1", { selector: "[data-holder]" })).toBeInTheDocument();
  });

  it("com reduced motion mostra os digitos finais sem nenhum tick", () => {
    mockReduced.mockReturnValue(true);
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    renderWithMotion(<CardStage />);
    expect(readDigits()).toBe(mocks.cardSamples[0]);
    expect(setIntervalSpy).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(readDigits()).toBe(mocks.cardSamples[0]);
  });
});
