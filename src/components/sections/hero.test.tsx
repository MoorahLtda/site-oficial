import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatBRL, getPlan, hero, photos } from "@/content/site";
import { Hero } from "./hero";

/*
  Hero v4 "Em casa, com medico" (docs/design-brief-v4-hero.md, secao 11.1). O hero e Server
  Component sem estado: `render` puro serve, sem MotionProvider.
*/

// Intl usa NBSP entre "R$" e o valor; normalizamos para comparar.
function plain(text: string | null | undefined): string {
  return (text ?? "").replace(/\u00a0/g, " ");
}

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";
// Travessao (U+2014) como escape: o caractere nao pode existir no repositorio.
const EM_DASH = "\u2014";

describe("Hero v4", () => {
  it("um unico h1 com a frase completa visivel, em duas linhas por peso, rotulando a section #inicio", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    const heading = headings[0];
    expect(heading).toHaveAttribute("id", "inicio-titulo");
    expect(plain(heading?.textContent)).toBe(hero.title);
    expect(heading?.querySelector(".sr-only")).toBeNull();
    expect(heading?.querySelector("[aria-hidden]")).toBeNull();

    const lines = heading?.querySelectorAll(":scope > span") ?? [];
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent(hero.titleLines[0]);
    expect(lines[0]).toHaveClass("font-semibold");
    expect(lines[1]).toHaveTextContent(hero.titleLines[1]);
    expect(lines[1]).toHaveClass("font-bold", "text-berry-100");
    // O contraste da segunda linha e visual: nao muda a entonacao do leitor de tela.
    expect(lines[1]?.tagName).toBe("SPAN");

    const section = document.getElementById("inicio");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", "inicio-titulo");
  });

  it("lead de uma frase e os dois precos de plans[] em negrito na propria frase, com a nota fora do strong", () => {
    render(<Hero />);
    expect(screen.getByText(hero.lead)).toBeInTheDocument();

    const price = document.querySelector("[data-hero-price]");
    expect(price?.tagName).toBe("P");
    const text = plain(price?.textContent);
    expect(text).toContain(plain(formatBRL(getPlan("individual").priceCents)));
    expect(text).toContain(plain(formatBRL(getPlan("familiar").priceCents)));
    expect(text).toContain(`${getPlan("familiar").people} pessoas`);
    expect(text).not.toMatch(/[{}]/);

    const strong = price?.querySelector("strong");
    expect(strong).toHaveClass("font-bold", "text-white");
    expect(plain(strong?.textContent)).not.toContain(hero.priceNote);
    expect(text).toContain(hero.priceNote);
    // Nenhuma aritmetica de preco nem "a partir de".
    expect(text).not.toMatch(/por dia|a partir de/i);
  });

  it("CTA primario branco leva a #planos e o secundario em contorno a #como-funciona", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: hero.primaryCta });
    expect(primary).toHaveAttribute("href", "#planos");
    expect(primary).toHaveClass("bg-white", "text-ink");
    const secondary = screen.getByRole("link", { name: hero.secondaryCta });
    expect(secondary).toHaveAttribute("href", "#como-funciona");
    expect(secondary).toHaveClass("border-berry-300");
    expect(secondary.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("foto heroCasa com priority (unico preload), camada mascarada sem texto e com o fade em CSS", () => {
    render(<Hero />);
    const img = screen.getByAltText(photos.heroCasa.alt);
    expect(img).toHaveAttribute("fetchpriority", "high");
    expect(img.getAttribute("src")).toContain("17489833");
    expect(img).toHaveAttribute("sizes");
    expect(document.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(1);

    const layer = document.querySelector("[data-hero-photo]");
    expect(layer).not.toBeNull();
    expect(layer?.textContent).toBe("");
    expect(layer).toHaveClass("animate-hero-photo-in", "pointer-events-none");
    expect(layer?.contains(img)).toBe(true);
    const veils = layer?.querySelectorAll("span") ?? [];
    expect(veils.length).toBeGreaterThan(0);
    for (const veil of veils) {
      expect(veil).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("tres fatos em texto puro, sem icone, na lista 'Resumo da assinatura'", () => {
    render(<Hero />);
    const list = screen.getByRole("list", { name: "Resumo da assinatura" });
    const items = list.querySelectorAll("li");
    expect(items).toHaveLength(3);
    expect(hero.facts).toHaveLength(3);
    hero.facts.forEach((fact, index) => {
      const item = items[index];
      const value = item?.querySelector("b");
      expect(value).toHaveClass("font-display");
      expect(value).toHaveTextContent(fact.value);
      expect(item?.querySelector("span")).toHaveTextContent(fact.label);
    });
    expect(list.querySelector("svg")).toBeNull();
  });

  it("ausencias: rede, rotativo, faixa, grupo, mono, verde, LGPD, plano de saude, CFM, h2", () => {
    const { container } = render(<Hero />);
    for (const selector of [
      "[data-hero-network]",
      "[data-hero-rotating]",
      "[data-hero-strip]",
      "[data-trail-cluster]",
      "[data-photo-node]",
      '[role="group"]',
      ".font-mono",
      ".text-leaf-300",
      ".text-gradient-berry",
    ]) {
      expect(container.querySelector(selector)).toBeNull();
    }
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    const text = plain(container.textContent);
    expect(text).not.toMatch(/LGPD|plano de sa[úu]de|por dia|CFM/i);
    expect(text).not.toContain(EM_DASH);
    expect(container.innerHTML).not.toContain(EM_DASH);
  });

  it("bloco com o gradiente da marca e espacador do mobile do mesmo tamanho da mascara", () => {
    render(<Hero />);
    expect(document.querySelector("[data-hero-block]")).toHaveClass(PLUM_GRADIENT);
    const spacer = document.querySelector("[data-hero-spacer]");
    expect(spacer).toHaveClass("lg:hidden", "h-(--hero-fade)");
    expect(spacer).toHaveAttribute("aria-hidden", "true");
    // Copy e fatos ficam acima da camada da foto, no fluxo da grade.
    expect(document.querySelector("[data-hero-copy]")).toHaveClass("relative", "z-10");
    expect(document.querySelector("[data-hero-facts]")).toHaveClass("relative", "z-10");
  });
});
