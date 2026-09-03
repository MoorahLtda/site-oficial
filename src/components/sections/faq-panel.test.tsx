import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { FaqPanel } from "./faq-panel";

const emergencyIndex = faq.findIndex((item) => item.a.includes("192"));

describe("FaqPanel", () => {
  it("abre faq-1 por padrao e mantem um unico item aberto", () => {
    renderWithMotion(<FaqPanel />);
    const open = screen.getAllByRole("button", { expanded: true });
    expect(open).toHaveLength(1);
    expect(open[0]).toHaveTextContent(faq[1].q);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(faq.length);
  });

  it("marca o ancestral [data-faq-root] enquanto a pergunta de emergencia esta aberta", async () => {
    const user = userEvent.setup();
    renderWithMotion(
      <div data-faq-root="" data-testid="root">
        <FaqPanel />
      </div>,
    );
    const root = screen.getByTestId("root");
    expect(root).not.toHaveAttribute("data-emergency-open");
    await user.click(screen.getByRole("button", { name: faq[emergencyIndex].q }));
    expect(root).toHaveAttribute("data-emergency-open", "true");
    // A resposta comum nao ganha o selo 192.
    await user.click(screen.getByRole("button", { name: faq[0].q }));
    expect(root).not.toHaveAttribute("data-emergency-open");
    expect(screen.getByRole("region", { name: faq[0].q })).not.toHaveTextContent("192");
  });
});
