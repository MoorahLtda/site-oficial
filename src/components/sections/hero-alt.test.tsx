import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatBRL, getPlan, hero, photos } from "@/content/site";
import { HeroAlt } from "./hero-alt";

// Intl usa NBSP entre "R$" e o valor; normalizamos para comparar.
function plain(text: string | null | undefined): string {
  return (text ?? "").replace(/ /g, " ");
}

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";

// Server Component puro: `render` direto, sem MotionProvider.
describe("HeroAlt (variante de preview, direcao C corrigida)", () => {
  it("renderiza um unico h1 com hero.title em duas linhas de peso distinto e a section rotulada", () => {
    render(<HeroAlt />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    const h1 = headings[0];
    expect(h1).toHaveAttribute("id", "inicio-titulo");
    expect(h1).toHaveTextContent(hero.title);
    expect(h1?.querySelector(".sr-only")).toBeNull();

    const lines = h1?.querySelectorAll(":scope > span") ?? [];
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent(hero.titleLines[0]);
    expect(lines[0]).toHaveClass("font-semibold");
    expect(lines[1]).toHaveTextContent(hero.titleLines[1]);
    expect(lines[1]).toHaveClass("font-bold", "text-berry-100");
    expect(lines[1]?.tagName).toBe("SPAN");

    const section = document.getElementById("inicio");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", "inicio-titulo");
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("tres bullets com check berry-300, o primeiro com os dois precos de plans[] e 4 pessoas", () => {
    render(<HeroAlt />);
    const list = screen.getByRole("list", { name: "O que está incluído" });
    const items = list.querySelectorAll(":scope > li");
    expect(items).toHaveLength(3);

    const first = plain(items[0]?.textContent);
    expect(first).toContain(plain(formatBRL(getPlan("individual").priceCents)));
    expect(first).toContain(plain(formatBRL(getPlan("familiar").priceCents)));
    expect(first).toContain(`até ${getPlan("familiar").people} pessoas`);
    expect(first).not.toContain("{");

    for (const item of items) {
      const check = item.querySelector('svg[aria-hidden="true"]');
      expect(check).toHaveClass("text-berry-300");
      expect(item.querySelectorAll("b.font-bold.text-white").length).toBeGreaterThan(0);
    }
    expect(document.querySelector(".text-leaf-300")).toBeNull();
    expect(document.querySelector('[class*="leaf-"]')).toBeNull();
  });

  it("CTAs para #planos e #como-funciona por padrao e com prefixo quando linkPrefix e /", () => {
    const { unmount } = render(<HeroAlt />);
    expect(screen.getByRole("link", { name: hero.primaryCta })).toHaveAttribute("href", "#planos");
    expect(screen.getByRole("link", { name: hero.secondaryCta })).toHaveAttribute(
      "href",
      "#como-funciona",
    );
    unmount();

    render(<HeroAlt linkPrefix="/" />);
    const primary = screen.getByRole("link", { name: hero.primaryCta });
    expect(primary).toHaveAttribute("href", "/#planos");
    expect(primary).toHaveClass("bg-white", "text-ink");
    const secondary = screen.getByRole("link", { name: hero.secondaryCta });
    expect(secondary).toHaveAttribute("href", "/#como-funciona");
    expect(secondary).toHaveClass("border-berry-300");
  });

  it("microcopy, foto da familia com priority unico e camada sem texto, em arco e com fade CSS", () => {
    render(<HeroAlt />);
    expect(screen.getByText(hero.micro)).toBeInTheDocument();

    const img = screen.getByAltText(photos.heroFamilia.alt);
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img.getAttribute("src")).toContain("27176483");
    expect(document.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(1);

    const layer = document.querySelector("[data-hero-photo]");
    expect(layer).not.toBeNull();
    expect(layer?.textContent).toBe("");
    expect(layer).toHaveClass("animate-hero-photo-in");
    expect(layer?.className).toContain("clip-path:ellipse");
    expect(layer?.className).toContain("mask-image:");
    for (const span of layer?.querySelectorAll("span") ?? []) {
      expect(span).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("fatos no pe, bloco marcado como variante com o gradiente da marca e nenhum residuo da v3", () => {
    render(<HeroAlt />);
    const facts = screen.getByRole("list", { name: "Resumo da assinatura" });
    const items = facts.querySelectorAll(":scope > li");
    expect(items).toHaveLength(hero.facts.length);
    hero.facts.forEach((fact, index) => {
      expect(items[index]?.querySelector("b.font-display")).toHaveTextContent(fact.value);
      expect(items[index]).toHaveTextContent(fact.label);
    });
    expect(facts.querySelector("svg")).toBeNull();

    const block = document.querySelector("[data-hero-block]");
    expect(block).toHaveAttribute("data-hero-variant", "alt");
    expect(block).toHaveClass(PLUM_GRADIENT);

    for (const selector of [
      "[data-hero-network]",
      "[data-hero-rotating]",
      "[data-hero-strip]",
      "[data-trail-cluster]",
      "[data-photo-node]",
      '[role="group"]',
      ".font-mono",
      ".eyebrow",
    ]) {
      expect(document.querySelector(selector)).toBeNull();
    }
    const text = document.getElementById("inicio")?.textContent ?? "";
    // Travessao (U+2014) como escape: o caractere nao pode existir nem no codigo.
    for (const forbidden of ["LGPD", "plano de saúde", "por dia", "CFM", "Cancele", "\u2014"]) {
      expect(text).not.toContain(forbidden);
    }
  });
});
