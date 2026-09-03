import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./section-heading";

describe("SectionHeading", () => {
  it("renderiza eyebrow, h2 e descricao alinhados ao inicio", () => {
    render(
      <SectionHeading
        eyebrow="Como funciona"
        title="Agendou, foi lembrado, consultou."
        description="Três passos."
        id="como-funciona-titulo"
      />,
    );
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Agendou, foi lembrado, consultou.",
    });
    expect(heading).toHaveAttribute("id", "como-funciona-titulo");
    expect(heading).toHaveClass("font-display", "text-gray-900", "mt-3");
    const eyebrow = screen.getByText("Como funciona");
    expect(eyebrow.tagName).toBe("P");
    expect(eyebrow).toHaveClass("eyebrow");
    expect(screen.getByText("Três passos.")).toHaveClass("mt-4", "text-gray-600");
    expect(heading.parentElement).not.toHaveClass("text-center");
  });

  it("omite eyebrow e descricao quando ausentes", () => {
    render(<SectionHeading title="Só título" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.parentElement?.childElementCount).toBe(1);
  });

  it("centraliza com align center", () => {
    render(<SectionHeading title="Planos" align="center" />);
    const wrapper = screen.getByRole("heading", { level: 2 }).parentElement;
    expect(wrapper).toHaveClass("mx-auto", "max-w-2xl", "text-center");
  });

  it("tone plum usa texto branco e eyebrow berry-300", () => {
    render(<SectionHeading eyebrow="Cartão" title="Cartão Moorah" description="Uso" tone="plum" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-white");
    expect(screen.getByText("Cartão")).toHaveClass("eyebrow", "text-berry-300");
    expect(screen.getByText("Uso")).toHaveClass("text-berry-100");
  });

  it("renderiza h3 quando as=h3 e aceita ReactNode no titulo", () => {
    render(
      <SectionHeading
        as="h3"
        title={
          <>
            Uma <em>frase</em>
          </>
        }
        className="mb-6"
      />,
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Uma frase");
    expect(heading.parentElement).toHaveClass("mb-6");
  });
});
