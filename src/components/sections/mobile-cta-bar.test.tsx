import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatBRL, plans, ui } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { MobileCtaBar } from "./mobile-cta-bar";

// formatBRL usa NBSP entre "R$" e o valor; o normalizador do Testing Library colapsa em espaco.
function plain(text: string): string {
  return text.replace(/\u00a0/g, " ");
}

describe("MobileCtaBar", () => {
  it("com forceVisible renderiza a regiao com os dois precos formatados", () => {
    renderWithMotion(<MobileCtaBar forceVisible />);
    const bar = screen.getByTestId("cta-mobile");
    expect(bar).toBe(screen.getByRole("region", { name: ui.mobileBar.label }));
    for (const plan of plans) {
      expect(screen.getByText(plain(formatBRL(plan.priceCents)))).toBeInTheDocument();
      expect(bar).toHaveTextContent(plan.name);
    }
  });

  it("o link 'Ver planos' aponta para #planos", () => {
    renderWithMotion(<MobileCtaBar forceVisible />);
    expect(screen.getByRole("link", { name: ui.mobileBar.cta })).toHaveAttribute("href", "#planos");
  });

  it("sem WhatsApp configurado nao ha link para wa.me", () => {
    renderWithMotion(<MobileCtaBar forceVisible />);
    expect(screen.queryByRole("link", { name: ui.leadForm.whatsappCta })).toBeNull();
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toContain("wa.me");
    }
  });

  it("sem forceVisible fica desmontada ate o IntersectionObserver liberar", () => {
    renderWithMotion(<MobileCtaBar />);
    expect(screen.queryByTestId("cta-mobile")).toBeNull();
  });

  it("com WhatsApp configurado mostra o link wa.me em nova aba", async () => {
    vi.resetModules();
    vi.doMock("@/content/site", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/content/site")>();
      return {
        ...actual,
        // Numero ficticio, so digitos com DDI, como documentado em site.ts.
        site: { ...actual.site, contact: { ...actual.site.contact, whatsapp: "5500000000000" } },
      };
    });
    try {
      const { MobileCtaBar: Bar } = await import("./mobile-cta-bar");
      renderWithMotion(<Bar forceVisible />);
      const link = screen.getByRole("link", { name: ui.leadForm.whatsappCta });
      expect(link).toHaveAttribute("href", expect.stringContaining("wa.me/5500000000000"));
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    } finally {
      vi.doUnmock("@/content/site");
      vi.resetModules();
    }
  });
});
