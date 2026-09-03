import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("Container", () => {
  it("renderiza uma div com container-x", () => {
    render(<Container data-testid="c">conteúdo</Container>);
    const el = screen.getByTestId("c");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("container-x");
    expect(el).toHaveTextContent("conteúdo");
  });

  it("mescla className e repassa atributos", () => {
    render(<Container className="flex h-16" id="topo" />);
    const el = document.getElementById("topo");
    expect(el).toHaveClass("container-x", "flex", "h-16");
  });
});
