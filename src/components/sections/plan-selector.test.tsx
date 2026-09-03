import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { plans, plansSection } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { PlanSelector } from "./plan-selector";

// Reduced motion ligado: o contador por pessoa mostra o valor final sem spring.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("PlanSelector", () => {
  it("nasce em 4 pessoas, mostra 24,48 por pessoa e destaca o Familiar", () => {
    renderWithMotion(<PlanSelector />);
    const group = screen.getByRole("radiogroup", { name: plansSection.peopleQuestion });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "4" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText(/24,48/)).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Familiar" })).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(screen.getByRole("article", { name: "Individual" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("com 1 pessoa mostra a dica e destaca o Individual", async () => {
    const user = userEvent.setup();
    renderWithMotion(<PlanSelector />);
    await user.click(screen.getByRole("radio", { name: "1" }));
    expect(screen.getByText(plansSection.singleHint)).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Individual" })).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(screen.getByRole("article", { name: "Familiar" })).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("com 2 pessoas mostra 48,95 por pessoa", async () => {
    const user = userEvent.setup();
    renderWithMotion(<PlanSelector />);
    await user.click(screen.getByRole("radio", { name: "2" }));
    expect(screen.getByText(/48,95/)).toBeInTheDocument();
    expect(screen.queryByText(plansSection.singleHint)).not.toBeInTheDocument();
  });

  it("os dois CTAs sao botoes com o texto de cada plano", () => {
    renderWithMotion(<PlanSelector />);
    for (const plan of plans) {
      expect(screen.getByRole("button", { name: plan.cta })).toHaveAttribute("type", "button");
    }
  });
});
