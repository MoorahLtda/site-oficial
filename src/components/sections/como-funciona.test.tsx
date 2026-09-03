import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { howItWorks, mocks, photos, steps } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { ComoFunciona } from "./como-funciona";

// O IntersectionObserver de tests/setup.ts nunca dispara; com useInView true e reduced motion
// o componente renderiza o estado final sem timers (ver 10.1 do brief).
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("ComoFunciona", () => {
  it("usa Section com id como-funciona e h2 ligado por aria-labelledby", () => {
    renderWithMotion(<ComoFunciona />);
    const section = document.getElementById("como-funciona");
    expect(section?.tagName).toBe("SECTION");
    const h2 = screen.getByRole("heading", { level: 2, name: howItWorks.title });
    expect(h2).toHaveAttribute("id");
    expect(section).toHaveAttribute("aria-labelledby", h2.getAttribute("id"));
    expect(screen.getByText(howItWorks.lead)).toBeInTheDocument();
  });

  it("renderiza 4 h3 com os titulos de steps na ordem, dentro de ol 'Passos'", () => {
    renderWithMotion(<ComoFunciona />);
    const list = screen.getByRole("list", { name: "Passos" });
    expect(list.tagName).toBe("OL");
    const headings = within(list).getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(steps.map((s) => s.title));
    expect(within(list).getAllByRole("listitem")).toHaveLength(4);
  });

  it("mostra os indices 01 a 04 como texto visivel", () => {
    renderWithMotion(<ComoFunciona />);
    for (const index of ["01", "02", "03", "04"]) {
      const el = screen.getByText(index);
      expect(el).not.toHaveAttribute("aria-hidden");
    }
  });

  it("tem 4 ilustracoes decorativas com aria-hidden", () => {
    renderWithMotion(<ComoFunciona />);
    const illustrations = document.querySelectorAll("[data-illustration]");
    expect(illustrations).toHaveLength(4);
    for (const el of illustrations) {
      expect(el).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("inclui os tres chips de lembrete e os rotulos de confirmacao dos mocks", () => {
    renderWithMotion(<ComoFunciona />);
    for (const chip of mocks.reminderChips) {
      expect(screen.getByText(chip)).toBeInTheDocument();
    }
    expect(screen.getByText(mocks.slotConfirmed)).toBeInTheDocument();
    expect(screen.getByText(mocks.connected)).toBeInTheDocument();
    expect(screen.getByText(mocks.signed)).toBeInTheDocument();
  });

  it("com reduced motion todos os nos ja estao acesos", () => {
    renderWithMotion(<ComoFunciona />);
    const nodes = document.querySelectorAll("[data-lit]");
    expect(nodes).toHaveLength(4);
    for (const node of nodes) {
      expect(node).toHaveAttribute("data-lit", "true");
    }
  });

  it("passo 3 traz a foto do medico na moldura de video, com sizes e lazy", () => {
    renderWithMotion(<ComoFunciona />);
    const img = screen.getByAltText(photos.medicoVideo.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img.getAttribute("sizes")).toContain("(min-width: 1024px)");
    expect(img.closest("[data-illustration]")).toHaveAttribute("aria-hidden", "true");
  });
});
