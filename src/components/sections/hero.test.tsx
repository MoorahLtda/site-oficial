import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatBRL, hero, heroDynamic, photos, plans, specialties } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Hero } from "./hero";

// O IntersectionObserver de tests/setup.ts nunca dispara. Com reduced motion o palco
// renderiza o estado final (no confirmado, cards visiveis) sem timers.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

// Intl usa NBSP entre "R$" e o valor; normalizamos para comparar.
function plain(text: string | null | undefined): string {
  return (text ?? "").replace(/ /g, " ");
}

describe("Hero", () => {
  it("renderiza um unico h1 com hero.title e a section #inicio rotulada por ele", () => {
    renderWithMotion(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    // A frase completa continua no h1, em sr-only, para leitores de tela.
    const srOnly = headings[0]?.querySelector(".sr-only");
    expect(srOnly).toHaveTextContent(hero.title);

    const section = document.getElementById("inicio");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", headings[0]?.id);
    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(hero.lead)).toBeInTheDocument();
  });

  it("titulo em duas linhas: a estatica e a primeira frase do rodizio, ja no primeiro render", () => {
    renderWithMotion(<Hero />);
    const heading = screen.getAllByRole("heading", { level: 1 })[0];
    expect(screen.getByText(heroDynamic.titleStatic)).toBeInTheDocument();
    const rotating = heading?.querySelector("[data-hero-rotating]");
    expect(rotating).toHaveAttribute("data-phrase", "0");
    expect(rotating?.querySelector("[data-rotating-active]")).toHaveTextContent(
      heroDynamic.rotating[0],
    );
    // O bloco visivel do titulo e decorativo; quem le e o sr-only.
    expect(rotating).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(heroDynamic.titleStatic)).toHaveAttribute("aria-hidden", "true");
  });

  it("faixa de especialidades rotulada por heroDynamic.stripLabel com os 12 nomes", () => {
    renderWithMotion(<Hero />);
    const strip = screen.getByRole("group", { name: heroDynamic.stripLabel });
    expect(strip).toBeInTheDocument();
    expect(specialties).toHaveLength(12);
    for (const specialty of specialties) {
      expect(strip).toHaveTextContent(specialty.name);
    }
  });

  it("a foto do paciente e a base do palco, com alt do manifesto", () => {
    renderWithMotion(<Hero />);
    const photo = screen.getByAltText(photos.heroPaciente.alt);
    expect(photo).toHaveAttribute("sizes", "(min-width: 1024px) 440px, 80vw");
  });

  it("CTA primario leva a #planos e o secundario a #como-funciona", () => {
    renderWithMotion(<Hero />);
    expect(screen.getByRole("link", { name: hero.primaryCta })).toHaveAttribute("href", "#planos");
    expect(screen.getByRole("link", { name: hero.secondaryCta })).toHaveAttribute(
      "href",
      "#como-funciona",
    );
  });

  it("mostra o preco do primeiro plano na linha de preco, em mono", () => {
    renderWithMotion(<Hero />);
    const price = formatBRL(plans[0].priceCents);
    const line = screen.getByText(/A partir de/);
    expect(plain(line.textContent)).toContain(plain(price));
    const mono = line.querySelector(".font-mono");
    expect(plain(mono?.textContent)).toBe(plain(price));
  });

  it("trust line avisa que nao e plano de saude e o cluster e uma imagem rotulada", () => {
    renderWithMotion(<Hero />);
    expect(screen.getByText(hero.trust)).toHaveTextContent(/não é plano de saúde/);
    const cluster = screen.getByRole("img", { name: hero.clusterAlt });
    expect(cluster.tagName.toLowerCase()).toBe("svg");
    // Sob reduced motion o no 0 (Clinico geral) ja nasce confirmado em leaf.
    expect(cluster.querySelector('[data-node="0"]')).toHaveAttribute("data-state", "confirmed");
  });

  it("chips de prova e cards flutuantes: chips em lista rotulada, cards fora da arvore acessivel", () => {
    renderWithMotion(<Hero />);
    const list = screen.getByRole("list", { name: "Resumo da assinatura" });
    for (const chip of hero.proofChips) {
      expect(list).toHaveTextContent(chip);
    }
    // Tres cards desktop + um card estatico mobile, todos aria-hidden (ilustracao).
    const cards = document.querySelectorAll("[data-moment]");
    expect(cards).toHaveLength(hero.moments.length + 1);
    for (const card of cards) {
      expect(card).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
