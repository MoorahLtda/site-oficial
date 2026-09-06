import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { plans, site } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import Home from "./page";

/*
  As secoes carregadas por next/dynamic (Beneficios, Planos, Duvidas, Contato) tem testes
  proprios. Aqui o mock devolve um marcador por chamada: o teste confere a composicao da pagina
  (ordem, landmarks, h1 unico, JSON-LD) sem depender do tempo de import dos chunks no OneDrive.
*/
const { dynamicCalls } = vi.hoisted(() => ({ dynamicCalls: { count: 0 } }));

vi.mock("next/dynamic", () => ({
  default: () => {
    dynamicCalls.count += 1;
    const index = dynamicCalls.count;
    return function DynamicSectionStub() {
      return <section data-testid="secao-dinamica" data-index={index} />;
    };
  },
}));

// appUrl e whatsapp vem de variaveis de ambiente; fixamos vazio para o teste ser deterministico.
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    site: { ...actual.site, appUrl: "", contact: { ...actual.site.contact, whatsapp: "" } },
  };
});

function readJsonLd(container: HTMLElement): { "@context": string; "@graph": unknown[] } {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script?.textContent ?? "{}");
}

describe("Home", () => {
  it("compoe header, main#conteudo, footer e barra mobile com um unico h1", () => {
    renderWithMotion(<Home />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "conteudo");
    expect(main).toHaveClass("flex-1");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(within(main).getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("o skip link aponta para #conteudo e vem antes do main", () => {
    renderWithMotion(<Home />);
    const skip = screen.getByRole("link", { name: /pular para o conteúdo/i });
    expect(skip).toHaveAttribute("href", "#conteudo");
    const main = screen.getByRole("main");
    expect(skip.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("mantem a ordem das secoes: quatro estaticas e quatro dinamicas, sem Diferenciais nem Cartao", () => {
    renderWithMotion(<Home />);
    const main = screen.getByRole("main");
    const ids = Array.from(main.querySelectorAll(":scope > section, :scope > div > section"))
      .map((el) => el.id || el.getAttribute("data-testid") || "")
      .filter(Boolean);
    expect(ids.slice(0, 4)).toEqual(["inicio", "por-que", "como-funciona", "especialidades"]);
    // Beneficios (fundido com o Cartao no pacote B do brief v4-secoes), Planos, Duvidas e
    // Contato (dinamicos).
    expect(ids.slice(4)).toEqual([
      "secao-dinamica",
      "secao-dinamica",
      "secao-dinamica",
      "secao-dinamica",
    ]);
  });

  it("emite JSON-LD com Organization e Product com uma Offer por plano, sem dados inventados", () => {
    const { container } = renderWithMotion(<Home />);
    const data = readJsonLd(container);
    expect(data["@context"]).toBe("https://schema.org");

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const org = graph.find((node) => node["@type"] === "Organization");
    const product = graph.find((node) => node["@type"] === "Product");
    expect(org).toMatchObject({
      name: site.product,
      legalName: site.legalName,
      url: site.url,
      email: site.contact.email,
    });
    expect(org).not.toHaveProperty("aggregateRating");
    expect(product).toMatchObject({ name: site.product, description: site.description });
    expect(product).not.toHaveProperty("review");
    expect(product).not.toHaveProperty("aggregateRating");

    const offers = (product as { offers: Array<Record<string, unknown>> }).offers;
    expect(offers).toHaveLength(plans.length);
    plans.forEach((plan, index) => {
      expect(offers[index]).toMatchObject({
        "@type": "Offer",
        name: plan.name,
        price: (plan.priceCents / 100).toFixed(2),
        priceCurrency: "BRL",
      });
    });
    expect(offers.map((offer) => offer.price)).toEqual(["49.90", "129.90"]);
  });

  it("escapa < no JSON-LD para nao abrir tag dentro do script", () => {
    const { container } = renderWithMotion(<Home />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).not.toContain("<");
  });
});
