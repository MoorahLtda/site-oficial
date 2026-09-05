import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq, faqSection, site } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Duvidas } from "./duvidas";

describe("Duvidas", () => {
  it("renderiza a secao soft com h2 ligado por aria-labelledby e um gatilho por pergunta", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    const heading = screen.getByRole("heading", { level: 2, name: faqSection.title });
    expect(section).toHaveClass("bg-gray-50");
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

  it("coluna lateral vem antes do painel no DOM, so tem links e traz o contato por e-mail", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    const contactCard = section?.querySelector("[data-contact]");
    expect(contactCard).not.toBeNull();
    expect(contactCard?.querySelector("button")).toBeNull();
    expect(contactCard).toHaveTextContent(faqSection.contactTitle);
    // A coluna lateral (com o card de contato) precede o primeiro gatilho do FAQ.
    const firstTrigger = screen.getByRole("button", { name: faq[0].q });
    const position = contactCard?.compareDocumentPosition(firstTrigger) ?? 0;
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const email = screen.getByRole("link", { name: site.contact.email });
    expect(email).toHaveAttribute("href", `mailto:${site.contact.email}`);
    expect(email).toHaveClass("font-sans");
    expect(email).not.toHaveClass("font-mono");
    // Sem NEXT_PUBLIC_WHATSAPP nao ha link de WhatsApp.
    expect(section?.querySelector('a[href*="wa.me"]')).toBeNull();
  });

  it("nao mostra cartao de emergencia, telefone de urgencia nem texto em mono", () => {
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    expect(section?.querySelector("[data-emergency]")).toBeNull();
    expect(section?.querySelector('a[href^="tel:"]')).toBeNull();
    expect(section?.querySelector(".font-mono")).toBeNull();
    expect(section).not.toHaveAttribute("data-faq-root");
  });
});
