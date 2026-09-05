import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatBRL, hero, heroDynamic, photos, plans, specialties } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Hero } from "./hero";

// O IntersectionObserver de tests/setup.ts nunca dispara. Com reduced motion a rede renderiza o
// estado final (no confirmado, primeira foto em cada disco) sem timers.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

// Intl usa NBSP entre "R$" e o valor; normalizamos para comparar.
function plain(text: string | null | undefined): string {
  return (text ?? "").replace(/ /g, " ");
}

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";

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

  it("titulo em duas linhas: a estatica e a primeira frase do rodizio em berry-200, ja no primeiro render", () => {
    renderWithMotion(<Hero />);
    const heading = screen.getAllByRole("heading", { level: 1 })[0];
    expect(screen.getByText(heroDynamic.titleStatic)).toBeInTheDocument();
    const rotating = heading?.querySelector("[data-hero-rotating]");
    expect(rotating).toHaveAttribute("data-phrase", "0");
    const active = rotating?.querySelector("[data-rotating-active]");
    expect(active).toHaveTextContent(heroDynamic.rotating[0]);
    // Sobre plum a frase e berry-200 solida (o gradiente da marca morre no escuro).
    expect(active).toHaveClass("text-berry-200");
    expect(active).not.toHaveClass("text-gradient-berry");
    // O bloco visivel do titulo e decorativo; quem le e o sr-only.
    expect(rotating).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(heroDynamic.titleStatic)).toHaveAttribute("aria-hidden", "true");
  });

  it("CTA primario branco leva a #planos e o secundario em contorno a #como-funciona", () => {
    renderWithMotion(<Hero />);
    const primary = screen.getByRole("link", { name: hero.primaryCta });
    expect(primary).toHaveAttribute("href", "#planos");
    expect(primary).toHaveClass("bg-white", "text-ink");
    const secondary = screen.getByRole("link", { name: hero.secondaryCta });
    expect(secondary).toHaveAttribute("href", "#como-funciona");
    expect(secondary).toHaveClass("border-berry-300");
  });

  it("mostra o preco do primeiro plano na linha de preco, em mono berry-200", () => {
    renderWithMotion(<Hero />);
    const price = formatBRL(plans[0].priceCents);
    const line = screen.getByText(/A partir de/);
    expect(plain(line.textContent)).toContain(plain(price));
    const mono = line.querySelector(".font-mono");
    expect(plain(mono?.textContent)).toBe(plain(price));
    expect(mono).toHaveClass("text-berry-200");
  });

  it("trust line, rede plum rotulada com tres discos de foto sem nada por cima, e nenhum card", () => {
    renderWithMotion(<Hero />);
    // O cliente pediu para nao repetir "nao e plano de saude" no hero; a trust line segue visivel.
    expect(screen.getByText(hero.trust)).toBeInTheDocument();

    const cluster = screen.getByRole("img", { name: hero.clusterAlt });
    expect(cluster.tagName.toLowerCase()).toBe("svg");
    expect(cluster).toHaveAttribute("data-tone", "plum");
    // Sob reduced motion o no 0 (Clinico geral) ja nasce confirmado em leaf.
    expect(cluster.querySelector('[data-node="0"]')).toHaveAttribute("data-state", "confirmed");

    const discs = document.querySelectorAll("[data-photo-node]");
    expect(discs).toHaveLength(3);
    for (const element of discs) {
      expect(element.textContent).toBe("");
    }
    expect(screen.getByAltText(photos.medicaSorrindo.alt)).toBeInTheDocument();
    expect(screen.getByAltText(photos.familiaSofa.alt)).toBeInTheDocument();
    expect(screen.getByAltText(photos.heroPaciente.alt)).toBeInTheDocument();

    // Nenhum card de momento (v2) e nenhuma foto com preload: o h1 e o LCP.
    expect(document.querySelector("[data-moment]")).not.toBeInTheDocument();
    expect(document.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(0);
  });

  it("faixa de especialidades em plum, colofao mono sem Badge, bloco com o gradiente e nenhum h2", () => {
    renderWithMotion(<Hero />);
    const strip = screen.getByRole("group", { name: heroDynamic.stripLabel });
    expect(specialties).toHaveLength(12);
    for (const specialty of specialties) {
      expect(strip).toHaveTextContent(specialty.name);
    }
    expect(screen.getAllByText(specialties[0].name)[0]).toHaveClass("bg-white/10");

    const list = screen.getByRole("list", { name: "Resumo da assinatura" });
    expect(list.querySelectorAll("li")).toHaveLength(hero.proofChips.length);
    for (const chip of hero.proofChips) {
      expect(list).toHaveTextContent(chip);
    }
    expect(list).toHaveClass("font-mono", "uppercase");
    expect(list.querySelector(".rounded-full")).toBeNull();

    expect(document.querySelector("[data-hero-block]")).toHaveClass(PLUM_GRADIENT);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
