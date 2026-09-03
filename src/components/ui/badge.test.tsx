import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renderiza um span neutro md por padrao", () => {
    render(<Badge>Em elaboração</Badge>);
    const badge = screen.getByText("Em elaboração");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveClass("bg-gray-100", "text-gray-700", "px-3", "py-1", "text-xs");
  });

  it("aplica os tons berry, leaf, plum e critical", () => {
    const { rerender } = render(<Badge tone="berry">Mais escolhido</Badge>);
    expect(screen.getByText("Mais escolhido")).toHaveClass("bg-berry-500", "text-white");

    rerender(<Badge tone="leaf">Conectado</Badge>);
    expect(screen.getByText("Conectado")).toHaveClass("bg-leaf-50", "text-leaf-700");

    rerender(<Badge tone="plum">Titular</Badge>);
    expect(screen.getByText("Titular")).toHaveClass("bg-white/10", "text-berry-100");

    rerender(<Badge tone="critical">192</Badge>);
    expect(screen.getByText("192")).toHaveClass("border-critical-500/40", "text-gray-900");
  });

  it("aplica o tamanho sm", () => {
    render(<Badge size="sm">Novo</Badge>);
    expect(screen.getByText("Novo")).toHaveClass("px-2.5", "py-0.5", "text-[11px]");
  });

  it("renderiza o icone antes do texto e mescla className", () => {
    render(
      <Badge icon={<svg data-testid="icone" aria-hidden="true" />} className="ml-2">
        Cartão reconhecido
      </Badge>,
    );
    const badge = screen.getByText("Cartão reconhecido");
    expect(badge).toHaveClass("ml-2");
    expect(badge.firstElementChild).toBe(screen.getByTestId("icone"));
  });

  it("repassa atributos nativos", () => {
    render(<Badge data-state="idle">Aguardando</Badge>);
    expect(screen.getByText("Aguardando")).toHaveAttribute("data-state", "idle");
  });
});
