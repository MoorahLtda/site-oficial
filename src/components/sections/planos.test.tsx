import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatBRL, getPlan, perPersonCents, photos, plans, plansSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Planos } from "./planos";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("Planos", () => {
  it("e uma secao #planos rotulada pelo h2 e com o aviso de plano de saude ligado ao FAQ", () => {
    renderWithMotion(<Planos />);
    const section = screen.getByRole("region", { name: plansSection.title });
    expect(section).toHaveAttribute("id", "planos");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(plansSection.title);
    expect(screen.getByText(/não é plano de saúde/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: plansSection.faqLink })).toHaveAttribute(
      "href",
      "#duvidas",
    );
  });

  it("lista 5 itens incluidos, 5 nao incluidos e o callout com 192", () => {
    renderWithMotion(<Planos />);
    const included = screen.getByRole("list", { name: plansSection.includedTitle });
    const notIncluded = screen.getByRole("list", { name: plansSection.notIncludedTitle });
    expect(within(included).getAllByRole("listitem")).toHaveLength(5);
    expect(within(notIncluded).getAllByRole("listitem")).toHaveLength(5);
    const emergency = screen.getByText("192");
    expect(emergency).toHaveClass("font-mono", "font-bold");
    expect(emergency.closest("p")).toHaveTextContent(plansSection.emergency);
  });

  it("mostra os dois precos e os dois CTAs", () => {
    renderWithMotion(<Planos />);
    expect(screen.getByText(/49,90/)).toBeInTheDocument();
    expect(screen.getByText(/97,90/)).toBeInTheDocument();
    for (const plan of plans) {
      expect(screen.getByRole("button", { name: plan.cta })).toBeInTheDocument();
    }
  });

  it("mostra a foto da familia ao lado do heading, com chip flutuante do Familiar", () => {
    renderWithMotion(<Planos />);
    const img = screen.getByAltText(photos.familiaSofa.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    expect(img.parentElement).toHaveClass("aspect-video", "overflow-hidden", "rounded-3xl");

    const chip = document.querySelector("[data-plan-chip]");
    const familiar = getPlan("familiar");
    // O chip ancora o preco: valor por pessoa do Familiar (R$ 24,48) com a copy de site.ts.
    const perPerson = formatBRL(perPersonCents(familiar)).replace(/ /g, " ");
    expect(chip?.textContent?.replace(/ /g, " ")).toContain(perPerson);
    expect(chip).toHaveTextContent(plansSection.photoChip.split("{price}")[1].trim());
    expect(chip).toHaveClass("animate-float-slow", "bg-white", "shadow-float", "font-mono");
  });
});
