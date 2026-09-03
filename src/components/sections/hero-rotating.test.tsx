import { act, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "@/components/providers/motion-provider";
import { heroDynamic } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { RotatingWord } from "./hero-rotating";

const mockReduced = vi.fn<() => boolean>(() => false);

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => mockReduced() };
});

/*
  O motion guarda a referencia do requestAnimationFrame no import, entao com fake timers as
  animacoes nao avancam e o AnimatePresence mode="wait" segura a frase que esta saindo. Os
  testes de tempo olham data-phrase (a fila de frases) e um teste com timers reais confirma
  que o texto na tela realmente troca.
*/

function activeText(): string {
  return document.querySelector("[data-rotating-active]")?.textContent ?? "";
}

function phraseIndex(): string | null {
  return document.querySelector("[data-hero-rotating]")?.getAttribute("data-phrase") ?? null;
}

// jsdom nao deixa alternar document.hidden; sobrescrevemos o getter no proprio document.
function setHidden(value: boolean): void {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
}

describe("RotatingWord", () => {
  beforeEach(() => {
    mockReduced.mockReturnValue(false);
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renderiza a primeira frase no servidor, visivel e sem opacity 0", () => {
    const markup = renderToStaticMarkup(
      <MotionProvider>
        <RotatingWord />
      </MotionProvider>,
    );
    expect(markup).toContain(heroDynamic.rotating[0]);
    // AnimatePresence initial={false}: o estado inicial e o final, entao nada nasce invisivel.
    expect(markup).not.toContain("opacity:0");
  });

  // Com timers reais e antes de qualquer fake timer: o motion so anima em frames de verdade.
  it("troca o texto na tela depois da saida da frase anterior", async () => {
    renderWithMotion(<RotatingWord />);
    expect(activeText()).toBe(heroDynamic.rotating[0]);

    await waitFor(() => expect(activeText()).toBe(heroDynamic.rotating[1]), {
      timeout: heroDynamic.rotateEveryMs + 5_000,
    });
  });

  it("reserva a altura de todas as frases na mesma celula da grade (sem CLS)", () => {
    renderWithMotion(<RotatingWord />);
    const block = document.querySelector("[data-hero-rotating]");
    expect(block).toHaveAttribute("aria-hidden", "true");
    expect(block).toHaveClass("inline-grid", "min-h-[1.05em]");
    const sizers = document.querySelectorAll("[data-rotating-sizer]");
    expect(sizers).toHaveLength(heroDynamic.rotating.length);
    for (const sizer of sizers) {
      expect(sizer).toHaveClass("invisible", "col-start-1", "row-start-1");
    }
    expect(document.querySelector("[data-rotating-active]")).toHaveClass(
      "text-gradient-berry",
      "col-start-1",
      "row-start-1",
    );
  });

  it("avanca a fila de frases a cada rotateEveryMs e volta ao inicio no fim da lista", () => {
    vi.useFakeTimers();
    renderWithMotion(<RotatingWord />);
    expect(activeText()).toBe(heroDynamic.rotating[0]);
    expect(phraseIndex()).toBe("0");

    act(() => {
      vi.advanceTimersByTime(heroDynamic.rotateEveryMs);
    });
    expect(phraseIndex()).toBe("1");

    act(() => {
      vi.advanceTimersByTime(heroDynamic.rotateEveryMs * (heroDynamic.rotating.length - 1));
    });
    expect(phraseIndex()).toBe("0");
  });

  it("nao avanca a fila enquanto a aba esta escondida", () => {
    vi.useFakeTimers();
    setHidden(true);
    renderWithMotion(<RotatingWord />);

    act(() => {
      vi.advanceTimersByTime(heroDynamic.rotateEveryMs * 3);
    });
    expect(phraseIndex()).toBe("0");

    setHidden(false);
    act(() => {
      vi.advanceTimersByTime(heroDynamic.rotateEveryMs);
    });
    expect(phraseIndex()).toBe("1");
  });

  it("fica estatico sob reduced motion", () => {
    mockReduced.mockReturnValue(true);
    vi.useFakeTimers();
    renderWithMotion(<RotatingWord />);

    act(() => {
      vi.advanceTimersByTime(heroDynamic.rotateEveryMs * 4);
    });
    expect(phraseIndex()).toBe("0");
    expect(activeText()).toBe(heroDynamic.rotating[0]);
  });

  it("limpa o intervalo ao desmontar", () => {
    vi.useFakeTimers();
    const { unmount } = renderWithMotion(<RotatingWord />);
    unmount();
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(heroDynamic.rotateEveryMs * 2);
      });
    }).not.toThrow();
    expect(document.querySelector("[data-rotating-active]")).toBeNull();
  });
});
