import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { FaqPanel } from "./faq-panel";

describe("FaqPanel", () => {
  it("abre faq-1 por padrao e mantem um unico item aberto", () => {
    renderWithMotion(<FaqPanel />);
    const open = screen.getAllByRole("button", { expanded: true });
    expect(open).toHaveLength(1);
    expect(open[0]).toHaveTextContent(faq[1].q);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(faq.length);
  });

  it("nao numera as perguntas nem envolve o acordeao em card", () => {
    const { container } = renderWithMotion(<FaqPanel />);
    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(faq.length);
    for (const trigger of triggers) {
      expect(trigger.textContent).not.toMatch(/\b0\d\b/);
    }
    expect(container.querySelector(".font-mono")).toBeNull();
    // A raiz e o proprio acordeao com border-t: sem rounded, borda em volta ou sombra de card.
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("border-t");
    expect(root.className).not.toMatch(/rounded|shadow/);
  });

  it("o item com link renderiza o anchor da Politica de privacidade; os demais nao tem <a>", async () => {
    const user = userEvent.setup();
    renderWithMotion(<FaqPanel />);
    for (const item of faq) {
      await user.click(screen.getByRole("button", { name: item.q }));
      const region = screen.getByRole("region", { name: item.q });
      expect(region).toHaveTextContent(item.a);
      const anchors = region.querySelectorAll("a");
      if (item.link) {
        expect(anchors).toHaveLength(1);
        expect(anchors[0]).toHaveAttribute("href", item.link.href);
        expect(anchors[0]).toHaveTextContent(item.link.label);
      } else {
        expect(anchors).toHaveLength(0);
      }
    }
  });

  it("abrir uma pergunta fecha a anterior sem marcar o ancestral", async () => {
    const user = userEvent.setup();
    renderWithMotion(
      <div data-faq-root="" data-testid="root">
        <FaqPanel />
      </div>,
    );
    const root = screen.getByTestId("root");
    await user.click(screen.getByRole("button", { name: faq[0].q }));
    expect(root.getAttributeNames()).toEqual(["data-faq-root", "data-testid"]);
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
  });
});
