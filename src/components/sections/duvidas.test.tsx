import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq, faqSection, site } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Duvidas } from "./duvidas";

describe("Duvidas", () => {
  it("renderiza a secao light com o titulo novo ligado por aria-labelledby", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    const heading = screen.getByRole("heading", { level: 2, name: faqSection.title });
    expect(section).toHaveClass("bg-white");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    for (const item of faq) {
      expect(screen.getByRole("button", { name: item.q })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("button")).toHaveLength(faq.length);
  });

  it("o primeiro botao do DOM e o gatilho de faq[0] fechado; o segundo item comeca aberto", () => {
    const { container } = renderWithMotion(<Duvidas />);
    const first = screen.getByRole("button", { name: faq[0].q });
    const second = screen.getByRole("button", { name: faq[1].q });
    expect(container.querySelector("button")).toBe(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(faq[1].a)).toBeInTheDocument();
  });

  it("clicar no primeiro gatilho abre a resposta e fecha o segundo", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Duvidas />);
    const first = screen.getByRole("button", { name: faq[0].q });
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: faq[1].q })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText(faq[0].a)).toBeInTheDocument();
    expect(screen.queryByText(faq[1].a)).not.toBeInTheDocument();
  });

  it("a linha de contato vem depois do acordeao, em Manrope, sem card e sem WhatsApp por padrao", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    expect(section?.querySelector("[data-contact]")).toBeNull();
    const email = screen.getByRole("link", { name: site.contact.email });
    expect(email).toHaveAttribute("href", `mailto:${site.contact.email}`);
    expect(email).toHaveClass("font-sans");
    expect(email).not.toHaveClass("font-mono");
    expect(screen.getByText(faqSection.contactTitle, { exact: false })).toBeInTheDocument();
    // O contato precisa vir DEPOIS do ultimo gatilho, para o primeiro <button> ser o de faq[0].
    const lastTrigger = screen.getByRole("button", { name: faq[faq.length - 1].q });
    const position = lastTrigger.compareDocumentPosition(email);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // Sem NEXT_PUBLIC_WHATSAPP nao ha link de WhatsApp.
    expect(section?.querySelector('a[href*="wa.me"]')).toBeNull();
  });

  it("sem numeracao, sem eyebrow, sem mono e sem svg alem do Plus dos gatilhos", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas") as HTMLElement;
    expect(section.textContent).not.toMatch(/\b0\d\b/);
    expect(section.querySelector(".eyebrow")).toBeNull();
    expect(section.querySelector(".font-mono")).toBeNull();
    expect(section.querySelectorAll("svg")).toHaveLength(faq.length);
    expect(section.textContent).not.toMatch(/\b192\b|SAMU/);
  });
});
