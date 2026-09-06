import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatBRL, getPlan, perPersonCents, plans, plansSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PlanCards } from "./plan-cards";

describe("PlanCards", () => {
  it("depende de plans ter exatamente 2 itens", () => {
    // O grid lg:grid-cols-2 de Planos e a ordem order-first/order-last do Familiar assumem
    // exatamente dois planos. Um terceiro plano exige redesenhar plan-cards.tsx e planos.tsx.
    expect(plans).toHaveLength(2);
  });

  it("renderiza um article por plano, rotulado pelo h3 com o nome em caixa normal", () => {
    renderWithMotion(<PlanCards />);
    for (const plan of plans) {
      const article = document.querySelector(`article[data-plan="${plan.id}"]`);
      expect(article).not.toBeNull();
      const heading = within(article as HTMLElement).getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(plan.name);
      expect(article).toHaveAttribute("aria-labelledby", heading.id);
      expect(heading.className).not.toContain("uppercase");
      expect(within(article as HTMLElement).getByText(plan.headline)).toBeInTheDocument();
      expect(within(article as HTMLElement).getByText(plan.peopleLabel)).toBeInTheDocument();
    }
  });

  it("mostra os precos estaticos em font-bold, sem opacity 0 e sem motion", () => {
    renderWithMotion(<PlanCards />);
    for (const plan of plans) {
      // formatBRL separa "R$" do valor com espaco duro (U+00A0); o matcher aceita qualquer espaco.
      const pattern = new RegExp(
        formatBRL(plan.priceCents).replace(/\$/g, "\\$").replace(/\s/g, "\\s"),
      );
      const price = screen.getByText(pattern);
      expect(price).toHaveClass("font-display", "font-bold", "tabular-nums");
      expect(price).not.toHaveClass("font-mono");
      expect(price.closest('[style*="opacity"]')).toBeNull();
    }
  });

  it("so o Familiar traz o valor por pessoa (32,48) e a nota da familia", () => {
    renderWithMotion(<PlanCards />);
    const familiar = document.querySelector('article[data-plan="familiar"]') as HTMLElement;
    const individual = document.querySelector('article[data-plan="individual"]') as HTMLElement;
    const perPerson = formatBRL(perPersonCents(getPlan("familiar")));
    expect(perPerson).toContain("32,48");
    expect(familiar.textContent).toContain("32,48");
    expect(familiar).toHaveTextContent(plansSection.familyNote);
    expect(individual.textContent).not.toContain("32,48");
    expect(individual.textContent).not.toContain("por pessoa");
  });

  it("destaca o Familiar por anel berry e ordem no mobile, nunca por fundo escuro ou badge", () => {
    renderWithMotion(<PlanCards />);
    const familiar = document.querySelector('article[data-plan="familiar"]') as HTMLElement;
    const individual = document.querySelector('article[data-plan="individual"]') as HTMLElement;
    expect(familiar).toHaveClass(
      "ring-2",
      "ring-berry-600",
      "shadow-deep",
      "order-first",
      "lg:order-last",
    );
    expect(familiar).not.toHaveClass("bg-ink");
    expect(familiar.className).toContain("bg-white");
    expect(individual).toHaveClass("border", "border-gray-200", "shadow-card");
    expect(screen.queryByText(/Mais escolhido/)).not.toBeInTheDocument();
  });

  it("lista as features com Check decorativo e fecha com o CTA do plano", () => {
    renderWithMotion(<PlanCards />);
    for (const plan of plans) {
      const article = document.querySelector(`article[data-plan="${plan.id}"]`) as HTMLElement;
      const items = within(article).getAllByRole("listitem");
      expect(items).toHaveLength(plan.features.length);
      for (const svg of article.querySelectorAll("svg")) {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      }
      expect(within(article).getByRole("button", { name: plan.cta })).toBeInTheDocument();
    }
  });

  it("nao renderiza imagem, radiogroup nem seletor de pessoas", () => {
    renderWithMotion(<PlanCards />);
    expect(document.querySelector("img")).toBeNull();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    // O seletor "Para quantas pessoas?" saiu de site.ts junto com o componente.
    expect(screen.queryByText("Para quantas pessoas?")).not.toBeInTheDocument();
  });
});
