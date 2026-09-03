import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faq, faqSection, site } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Duvidas } from "./duvidas";

const emergencyItem = faq.find((item) => item.a.includes("192"));
if (!emergencyItem) throw new Error("site.ts precisa de uma pergunta de emergencia com 192.");

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

  it("coluna lateral so tem links, mostra 192 e reage a abertura da pergunta de emergencia", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Duvidas />);
    const section = document.getElementById("duvidas");
    const emergencyCard = section?.querySelector("[data-emergency]");
    expect(emergencyCard).not.toBeNull();
    expect(emergencyCard?.querySelector("button")).toBeNull();
    expect(emergencyCard).toHaveTextContent("192");
    expect(emergencyCard).toHaveTextContent(faqSection.emergencyLabel);
    expect(screen.getByRole("link", { name: site.contact.email })).toHaveAttribute(
      "href",
      `mailto:${site.contact.email}`,
    );
    // Sem NEXT_PUBLIC_WHATSAPP nao ha link de WhatsApp.
    expect(section?.querySelector('a[href*="wa.me"]')).toBeNull();
    expect(section).not.toHaveAttribute("data-emergency-open");

    const trigger = screen.getByRole("button", { name: emergencyItem.q });
    await user.click(trigger);
    expect(section).toHaveAttribute("data-emergency-open", "true");
    const region = screen.getByRole("region", { name: emergencyItem.q });
    expect(within(region).getByText("192")).toHaveClass("font-mono", "font-bold");
    expect(within(region).getByText("192")).not.toHaveClass("text-critical-500");
    expect(region).toHaveTextContent(faqSection.emergencyLabel);

    await user.click(trigger);
    expect(section).not.toHaveAttribute("data-emergency-open");
  });
});
