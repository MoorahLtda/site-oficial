import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./section";

describe("Section", () => {
  it("renderiza section light com id, scroll-mt-20 e Container interno", () => {
    render(
      <Section id="como-funciona" aria-labelledby="titulo">
        <h2 id="titulo">Título</h2>
      </Section>,
    );
    const section = document.getElementById("como-funciona");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveClass("relative", "scroll-mt-20", "bg-white", "py-20", "sm:py-24");
    expect(section).toHaveAttribute("aria-labelledby", "titulo");
    const inner = section?.querySelector(".container-x");
    expect(inner).not.toBeNull();
    expect(inner).toContainElement(screen.getByRole("heading", { name: "Título" }));
  });

  it("surface soft usa bg-gray-50", () => {
    render(<Section id="por-que" surface="soft" />);
    expect(document.getElementById("por-que")).toHaveClass("bg-gray-50");
  });

  it("surface plum insere bloco rounded-3xl com gradiente e texto branco", () => {
    render(
      <Section id="cartao" surface="plum">
        <p>Cartão</p>
      </Section>,
    );
    const section = document.getElementById("cartao");
    expect(section).toHaveClass("scroll-mt-20", "px-3", "py-3");
    expect(section).not.toHaveClass("bg-white");
    const block = section?.firstElementChild;
    expect(block).toHaveClass(
      "rounded-3xl",
      "overflow-hidden",
      "text-white",
      "py-20",
      "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]",
    );
    expect(block?.querySelector(".container-x")).toHaveTextContent("Cartão");
  });

  it("innerClassName vai para o Container e className sobrescreve o padding via twMerge", () => {
    render(
      <Section id="inicio" className="py-0 pt-28 pb-16" innerClassName="grid lg:grid-cols-12">
        <span>x</span>
      </Section>,
    );
    const section = document.getElementById("inicio");
    expect(section).toHaveClass("py-0", "pt-28", "pb-16");
    // twMerge so remove py-20 quando chega outro py-*; pt/pb sozinhos nao removem.
    expect(section).not.toHaveClass("py-20");
    expect(section?.querySelector(".container-x")).toHaveClass("grid", "lg:grid-cols-12");
  });

  it("bleed nao envolve os filhos em Container", () => {
    render(
      <Section id="livre" bleed>
        <div data-testid="filho">x</div>
      </Section>,
    );
    const section = document.getElementById("livre");
    expect(section?.querySelector(".container-x")).toBeNull();
    expect(screen.getByTestId("filho").parentElement).toBe(section);
  });
});
