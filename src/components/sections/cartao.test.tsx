import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { benefits, cardSection, plans } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Cartao } from "./cartao";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("Cartao", () => {
  it("renderiza a secao plum #cartao rotulada pelo h2", async () => {
    renderWithMotion(<Cartao />);
    const section = document.getElementById("cartao");
    expect(section).not.toBeNull();
    expect(section?.tagName.toLowerCase()).toBe("section");
    // O palco (e o cabecalho, entregue a ele) chega via next/dynamic.
    const heading = await screen.findByRole("heading", { level: 2, name: cardSection.title });
    expect(heading).toHaveAttribute("id", "cartao-title");
    expect(section).toHaveAttribute("aria-labelledby", "cartao-title");
    expect(screen.getByText(cardSection.eyebrow)).toHaveClass("eyebrow", "text-berry-300");
    expect(screen.getByText(benefits[0].text)).toBeInTheDocument();
  });

  it("traz os usos do cartao, a nota do Familiar e o palco com o seletor de cartao", async () => {
    renderWithMotion(<Cartao />);
    expect(
      await screen.findByRole("radiogroup", { name: cardSection.holderLabel }),
    ).toBeInTheDocument();
    for (const use of cardSection.uses) {
      expect(screen.getByText(use)).toBeInTheDocument();
    }
    expect(screen.getByText(plans[1].features[1])).toBeInTheDocument();
    expect(screen.getByAltText(cardSection.imageAlt)).toBeInTheDocument();
  });

  it("abre o bloco com o lockup branco decorativo, acima do eyebrow", async () => {
    renderWithMotion(<Cartao />);
    // Escopo em #cartao: o lockup tem de nascer dentro do bloco plum, nao em qualquer lugar.
    const lockup = document.querySelector("#cartao [data-brand-lockup]");
    expect(lockup).not.toBeNull();
    expect(lockup).toHaveAttribute("aria-hidden", "true");
    expect(lockup).toHaveClass("opacity-90");

    const images = lockup?.querySelectorAll("img") ?? [];
    expect(images).toHaveLength(2);
    const [mark, wordmark] = Array.from(images);
    expect(mark.getAttribute("src")).toContain("moorah-mark-white");
    expect(mark).toHaveClass("h-8", "w-auto");
    expect(mark).toHaveAttribute("alt", "");
    expect(wordmark.getAttribute("src")).toContain("moorah-wordmark-white");
    expect(wordmark).toHaveClass("h-4", "w-auto");
    expect(wordmark).toHaveAttribute("alt", "");
    // `priority` so no lockup do header e na foto do hero (brief v2, item 1).
    for (const image of [mark, wordmark]) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).not.toHaveAttribute("fetchpriority", "high");
    }

    // O lockup vem antes do eyebrow no documento (o palco chega por next/dynamic).
    const eyebrow = await screen.findByText(cardSection.eyebrow);
    expect(lockup?.compareDocumentPosition(eyebrow)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
