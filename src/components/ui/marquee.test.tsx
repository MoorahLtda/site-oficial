import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marquee } from "./marquee";

describe("Marquee", () => {
  it("duplica os filhos e esconde a copia de leitores de tela", () => {
    render(
      <Marquee>
        <span>Logo A</span>
      </Marquee>,
    );
    const copies = screen.getAllByText("Logo A");
    expect(copies).toHaveLength(2);

    // Estrutura: faixa animada > duas copias irmas > filhos.
    const firstCopy = copies[0].parentElement;
    const clone = copies[1].parentElement;
    const track = firstCopy?.parentElement;
    expect(track).toHaveClass("animate-marquee", "motion-reduce:animate-none", "w-max");
    expect(track).toHaveClass("group-hover:[animation-play-state:paused]");
    expect(clone).toHaveAttribute("aria-hidden", "true");
    expect(clone?.parentElement).toBe(track);
  });

  it("as duas copias tem a mesma largura para a emenda fechar em -50%", () => {
    render(
      <Marquee>
        <span>Logo A</span>
      </Marquee>,
    );
    const copies = screen.getAllByText("Logo A");
    const firstCopy = copies[0].parentElement;
    const clone = copies[1].parentElement;
    // O gap final (pr-8) entra nas duas copias: sem ele o loop salta meio gap por ciclo.
    for (const copy of [firstCopy, clone]) {
      expect(copy).toHaveClass("flex", "gap-8", "pr-8");
    }
    // Sob reduced motion a copia sai da tela e a primeira quebra em linhas.
    expect(firstCopy).toHaveClass("motion-reduce:flex-wrap", "motion-reduce:pr-0");
    expect(clone).toHaveClass("motion-reduce:hidden");
  });

  it("aplica a velocidade em segundos e mescla className", () => {
    render(
      <Marquee speed={30} className="mt-8">
        <span>Logo B</span>
      </Marquee>,
    );
    const track = screen.getAllByText("Logo B")[0].parentElement?.parentElement;
    expect(track).toHaveStyle({ animationDuration: "30s" });
    expect(track?.parentElement).toHaveClass("group", "overflow-hidden", "mt-8");
  });
});
