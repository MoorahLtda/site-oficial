import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HashScroll } from "./hash-scroll";

// rAF controlado: cada avanco de quadro roda um passo do reposicionamento.
let frames: Array<() => void> = [];
let now = 0;

function flushFrames(times: number) {
  for (let i = 0; i < times; i++) {
    const queued = frames;
    frames = [];
    for (const fn of queued) fn();
  }
}

function setHash(hash: string) {
  window.history.replaceState(null, "", hash ? `/${hash}` : "/");
}

function addTarget(id: string) {
  const el = document.createElement("section");
  el.id = id;
  el.scrollIntoView = vi.fn();
  document.body.append(el);
  return el;
}

function callsOf(el: HTMLElement) {
  return (el.scrollIntoView as ReturnType<typeof vi.fn>).mock.calls.length;
}

beforeEach(() => {
  frames = [];
  now = 0;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    frames.push(() => cb(0));
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
  document.body.innerHTML = "";
  setHash("");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("HashScroll", () => {
  it("nao faz nada sem hash na URL", () => {
    const target = addTarget("planos");
    setHash("");
    render(<HashScroll />);
    act(() => flushFrames(3));
    expect(callsOf(target)).toBe(0);
  });

  it("reafirma o destino a cada quadro, porque o router reposiciona depois da hidratacao", () => {
    const target = addTarget("planos");
    setHash("#planos");
    render(<HashScroll />);
    act(() => flushFrames(1));
    expect(callsOf(target)).toBe(1);
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({ block: "start", behavior: "auto" });
    act(() => flushFrames(3));
    expect(callsOf(target)).toBe(4);
  });

  it("para na primeira interacao do usuario, para nao disputar a rolagem", () => {
    const target = addTarget("planos");
    setHash("#planos");
    render(<HashScroll />);
    act(() => flushFrames(1));
    expect(callsOf(target)).toBe(1);
    act(() => {
      window.dispatchEvent(new Event("wheel"));
    });
    act(() => flushFrames(3));
    expect(callsOf(target)).toBe(1);
  });

  it("desiste depois da janela de tentativa", () => {
    const target = addTarget("planos");
    setHash("#planos");
    render(<HashScroll />);
    act(() => flushFrames(2));
    const before = callsOf(target);
    now = 5000;
    act(() => flushFrames(1));
    act(() => flushFrames(3));
    // Um ultimo quadro roda e encerra: nada depois dele.
    expect(callsOf(target)).toBe(before + 1);
  });

  it("ignora hash que nao existe na pagina, sem quebrar", () => {
    setHash("#nao-existe");
    expect(() => {
      render(<HashScroll />);
      act(() => flushFrames(3));
    }).not.toThrow();
  });
});
