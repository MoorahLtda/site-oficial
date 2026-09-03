import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithMotion } from "@/test/render";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

describe("Reveal", () => {
  it("renderiza div por padrao com o conteudo e className", () => {
    renderWithMotion(
      <Reveal className="mt-4">
        <p>Texto revelado</p>
      </Reveal>,
    );
    const child = screen.getByText("Texto revelado");
    expect(child).toBeInTheDocument();
    expect(child.parentElement?.tagName).toBe("DIV");
    expect(child.parentElement).toHaveClass("mt-4");
  });

  it("aceita a tag via as", () => {
    renderWithMotion(
      <ul>
        <Reveal as="li" variant="fade">
          Item
        </Reveal>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });

  it("comeca escondido no jsdom (IntersectionObserver nunca dispara)", () => {
    renderWithMotion(<Reveal>Oculto</Reveal>);
    expect(screen.getByText("Oculto")).toHaveStyle({ opacity: "0" });
  });

  it("variant line parte de scaleX 0", () => {
    renderWithMotion(
      <Reveal variant="line" className="origin-left h-0.5 w-full bg-ink">
        <span>linha</span>
      </Reveal>,
    );
    const line = screen.getByText("linha").parentElement;
    expect(line?.style.transform).toContain("scaleX(0)");
  });
});

describe("RevealGroup e RevealItem", () => {
  it("renderiza lista com itens e preserva semantica", () => {
    renderWithMotion(
      <RevealGroup as="ul" stagger={0.06} className="grid">
        <RevealItem as="li">Um</RevealItem>
        <RevealItem as="li">Dois</RevealItem>
        <RevealItem as="li" variant="fade">
          Três
        </RevealItem>
      </RevealGroup>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(list).toHaveTextContent("UmDoisTrês");
  });

  it("RevealItem herda o gatilho do pai e nasce escondido", () => {
    renderWithMotion(
      <RevealGroup>
        <RevealItem as="article">Card</RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByRole("article")).toHaveStyle({ opacity: "0" });
  });
});
