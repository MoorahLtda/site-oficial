import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { planNotes, plans, plansSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Planos } from "./planos";

describe("Planos", () => {
  it("e uma secao #planos soft, com heading centrado rotulando a secao e a lead", () => {
    renderWithMotion(<Planos />);
    const section = screen.getByRole("region", { name: plansSection.title });
    expect(section).toHaveAttribute("id", "planos");
    expect(section).toHaveClass("bg-gray-50");
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(plansSection.title);
    expect(heading.parentElement).toHaveClass("text-center");
    expect(screen.getByText(plansSection.lead)).toBeInTheDocument();
    expect(screen.getByText(plansSection.eyebrow)).toHaveClass("eyebrow");
  });

  it("mostra os dois precos e o valor por pessoa sem interacao, com os dois CTAs", () => {
    renderWithMotion(<Planos />);
    expect(screen.getByText(/49,90/)).toBeInTheDocument();
    expect(screen.getByText(/129,90/)).toBeInTheDocument();
    expect(screen.getByText(/32,48/)).toBeInTheDocument();
    for (const plan of plans) {
      expect(screen.getByRole("button", { name: plan.cta })).toBeInTheDocument();
    }
  });

  it("traz a nota comercial com o link para as duvidas", () => {
    renderWithMotion(<Planos />);
    expect(screen.getByText(planNotes[0], { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: plansSection.faqLink })).toHaveAttribute(
      "href",
      "#duvidas",
    );
  });

  it("o painel lista incluidos e nao incluidos sem caixa e sem hairline", () => {
    renderWithMotion(<Planos />);
    const included = screen.getByRole("list", { name: plansSection.includedTitle });
    const notIncluded = screen.getByRole("list", { name: plansSection.notIncludedTitle });
    expect(within(included).getAllByRole("listitem")).toHaveLength(plansSection.included.length);
    expect(within(notIncluded).getAllByRole("listitem")).toHaveLength(
      plansSection.notIncluded.length,
    );
    // Sem caixa (border/bg/sombra) em volta do painel: separacao por respiro (principio 13).
    const panel = included.closest("div")?.parentElement as HTMLElement;
    expect(panel.className).not.toMatch(/border|bg-white|shadow/);
  });

  it("destaca o Familiar por anel, sem fundo escuro", () => {
    renderWithMotion(<Planos />);
    const familiar = document.querySelector('article[data-plan="familiar"]');
    expect(familiar).toHaveClass("ring-2");
    expect(familiar).not.toHaveClass("bg-ink");
  });

  it("nao tem foto, chip, seletor de pessoas, badge nem termos vetados", () => {
    renderWithMotion(<Planos />);
    const section = document.getElementById("planos") as HTMLElement;
    expect(section.querySelector("img")).toBeNull();
    expect(section.querySelector("[data-plan-chip]")).toBeNull();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.queryByText(/Mais escolhido/)).not.toBeInTheDocument();
    for (const h3 of section.querySelectorAll("h3")) {
      expect(h3.className).not.toContain("uppercase");
    }
    expect(section.textContent).not.toMatch(/\b192\b|SAMU|LGPD|plano de saúde/i);
    expect(section.querySelector(".font-mono")).toBeNull();
  });
});
