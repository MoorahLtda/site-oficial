import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { hero } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import HeroAltPreview, { metadata } from "./page";

// appUrl e whatsapp vem de variaveis de ambiente; fixamos vazio para o teste ser deterministico.
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    site: { ...actual.site, appUrl: "", contact: { ...actual.site.contact, whatsapp: "" } },
  };
});

describe("/previews/hero-alt", () => {
  it("nao e indexavel e tem titulo proprio de preview", () => {
    expect(metadata.title).toBe("Preview · hero alternativo");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("renderiza so header e hero alternativo dentro de main#conteudo, com um unico h1", () => {
    renderWithMotion(<HeroAltPreview />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "conteudo");
    expect(main).toHaveClass("flex-1");

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(within(main).getByRole("heading", { level: 1 })).toHaveTextContent(hero.title);
    expect(main.querySelector('[data-hero-block][data-hero-variant="alt"]')).not.toBeNull();

    // Nada alem do hero: sem outras secoes, sem rodape, sem barra mobile.
    expect(main.querySelectorAll(":scope > section")).toHaveLength(1);
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cta-mobile")).not.toBeInTheDocument();
  });

  it("CTAs do hero levam as ancoras da home com prefixo /", () => {
    renderWithMotion(<HeroAltPreview />);
    const main = screen.getByRole("main");
    expect(within(main).getByRole("link", { name: hero.primaryCta })).toHaveAttribute(
      "href",
      "/#planos",
    );
    expect(within(main).getByRole("link", { name: hero.secondaryCta })).toHaveAttribute(
      "href",
      "/#como-funciona",
    );
  });
});
