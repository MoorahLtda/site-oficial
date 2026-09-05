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

  it("numera as perguntas de 01 a 0n em font-display, sem mono", () => {
    const { container } = renderWithMotion(<FaqPanel />);
    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(faq.length);
    triggers.forEach((trigger, i) => {
      const number = trigger.querySelector("[aria-hidden='true']");
      expect(number).toHaveTextContent(String(i + 1).padStart(2, "0"));
      expect(number).toHaveClass("font-display", "font-semibold", "tabular-nums");
      expect(number).not.toHaveClass("font-mono");
    });
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("abre qualquer pergunta sem marcar o ancestral nem acrescentar selo a resposta", async () => {
    const user = userEvent.setup();
    renderWithMotion(
      <div data-faq-root="" data-testid="root">
        <FaqPanel />
      </div>,
    );
    const root = screen.getByTestId("root");
    for (const item of faq) {
      await user.click(screen.getByRole("button", { name: item.q }));
      expect(root.getAttributeNames()).toEqual(["data-faq-root", "data-testid"]);
      const region = screen.getByRole("region", { name: item.q });
      expect(region).toHaveTextContent(item.a);
      expect(region.querySelectorAll("p")).toHaveLength(1);
    }
  });
});
