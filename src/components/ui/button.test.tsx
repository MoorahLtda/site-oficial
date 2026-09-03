import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renderiza um botao primary md por padrao", () => {
    render(<Button>Escolher meu plano</Button>);
    const button = screen.getByRole("button", { name: "Escolher meu plano" });
    expect(button).toHaveClass("bg-berry-600", "text-white", "h-12", "rounded-full");
    expect(button).not.toHaveAttribute("aria-busy");
  });

  it("aplica variantes e tamanhos", () => {
    render(
      <Button variant="outline-light" size="lg">
        Falar no WhatsApp
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Falar no WhatsApp" });
    expect(button).toHaveClass("border-berry-300", "h-[52px]");
    expect(button).not.toHaveClass("bg-berry-600");
  });

  it("renderiza o filho como elemento raiz com asChild", () => {
    render(
      <Button asChild variant="secondary" size="sm">
        <a href="#planos">Ver planos</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Ver planos" });
    expect(link).toHaveAttribute("href", "#planos");
    expect(link).toHaveClass("bg-white", "h-10");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("ocupa a largura toda com fullWidth e mescla className", () => {
    render(
      <Button fullWidth className="mt-4">
        Quero assinar
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Quero assinar" })).toHaveClass("w-full", "mt-4");
  });

  it("em loading desabilita, marca aria-busy e mostra o spinner", () => {
    render(<Button loading>Enviando...</Button>);
    const button = screen.getByRole("button", { name: "Enviando..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("svg.animate-spin")).toHaveAttribute("aria-hidden", "true");
  });

  it("repassa atributos nativos como type e disabled", () => {
    render(
      <Button type="submit" disabled>
        Enviar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Enviar" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("exporta buttonVariants para compor classes fora do componente", () => {
    expect(buttonVariants({ variant: "ghost", size: "sm" })).toContain("hover:bg-gray-100");
  });
});
