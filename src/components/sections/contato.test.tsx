import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { finalCta, ui } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Contato } from "./contato";

// O LeadForm entra por next/dynamic. No OneDrive o primeiro import do chunk oscila entre 1 s e
// mais de 8 s, entao o mock resolve o modulo real de forma sincrona e guarda as opcoes passadas
// (o `loading`) para testar o skeleton sem depender de tempo.
const { dynamicOptions } = vi.hoisted(() => ({
  dynamicOptions: { current: null as { loading?: ComponentType } | null },
}));

vi.mock("next/dynamic", async () => {
  const { LeadForm } = await import("@/components/ui/lead-form");
  return {
    default: (_loader: unknown, options?: { loading?: ComponentType }) => {
      dynamicOptions.current = options ?? null;
      return LeadForm;
    },
  };
});

// `site.contact.whatsapp` vem de variavel de ambiente; o getter deixa cada teste escolher o valor
// sem reimportar o modulo (o restante de site.ts segue real).
const { whatsappMock } = vi.hoisted(() => ({ whatsappMock: vi.fn<() => string>(() => "") }));

vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return {
    ...actual,
    site: {
      ...actual.site,
      contact: {
        ...actual.site.contact,
        get whatsapp() {
          return whatsappMock();
        },
      },
    },
  };
});

// O IntersectionObserver de tests/setup.ts nunca dispara; com reduced motion o Reveal do card
// renderiza o estado final sem timers.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("Contato", () => {
  beforeEach(() => {
    whatsappMock.mockReturnValue("");
  });

  it("renderiza a secao #contato em plum rotulada pelo h2, sem eyebrow", () => {
    renderWithMotion(<Contato />);
    const heading = screen.getByRole("heading", { level: 2, name: finalCta.title });
    const section = document.getElementById("contato");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    expect(section?.firstElementChild).toHaveClass("rounded-3xl", "text-white");
    // Hierarquia por peso, nao por ornamento: semibold, sem tracking-tight adicional.
    expect(heading).toHaveClass("font-display", "font-semibold");
    expect(heading).not.toHaveClass("font-bold", "tracking-tight");
    expect(screen.getByText(finalCta.text)).toBeInTheDocument();
    // O eyebrow "Comece hoje" saiu de site.ts: a secao abre direto no h2 (brief v4-secoes, 4.7).
    expect(screen.queryByText("Comece hoje")).not.toBeInTheDocument();
    expect(section?.querySelector(".eyebrow")).toBeNull();
  });

  it("nao traz trilha, lockup nem fotografia: a unica img e a marca d'agua", () => {
    renderWithMotion(<Contato />);
    expect(document.querySelector("svg[data-trail-cluster]")).toBeNull();
    expect(document.querySelector("[data-comet]")).toBeNull();
    expect(document.querySelector("[data-brand-lockup]")).toBeNull();
    const images = Array.from(document.querySelectorAll("#contato img"));
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute("data-brand-watermark");
  });

  it("card 'Fale com a Moorah': h3, subtitulo e formulario com botao Enviar", () => {
    renderWithMotion(<Contato />);
    expect(screen.getByLabelText(ui.leadForm.name)).toBeInTheDocument();
    expect(screen.getByLabelText(ui.leadForm.email)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(ui.leadForm.plan)).toHaveValue("familiar");
    const title = screen.getByRole("heading", { level: 3, name: ui.leadForm.title });
    expect(title).toHaveClass("font-semibold");
    expect(screen.getByText(ui.leadForm.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: ui.leadForm.submit })).toBeInTheDocument();
    expect(screen.queryByText(/LGPD/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\b192\b/)).not.toBeInTheDocument();
    // Hook do card branco: o e2e mede a folga da marca d'agua contra o card, nao contra o botao.
    const card = title.closest("[data-lead-card]");
    expect(card).toHaveClass("bg-white", "rounded-2xl");
  });

  it("'Escolher meu plano' vira secundario (outline-light) apontando para #planos", () => {
    renderWithMotion(<Contato />);
    const link = screen.getByRole("link", { name: finalCta.primaryCta });
    expect(link).toHaveAttribute("href", "#planos");
    // outline-light: o destino principal da secao e o formulario (pesquisa 4.9).
    expect(link).toHaveClass("border-berry-300", "text-white", "h-[52px]");
    expect(link).not.toHaveClass("bg-white", "text-ink");
    const links = screen.getAllByRole("link");
    expect(links.some((item) => item.getAttribute("href")?.includes("wa.me"))).toBe(false);
    expect(screen.queryByRole("link", { name: ui.leadForm.whatsappCta })).not.toBeInTheDocument();
  });

  it("com WhatsApp configurado mostra o botao outline-light abrindo wa.me em nova aba", () => {
    whatsappMock.mockReturnValue("5511999999999");
    renderWithMotion(<Contato />);
    const link = screen.getByRole("link", { name: ui.leadForm.whatsappCta });
    expect(link).toHaveAttribute(
      "href",
      `https://wa.me/5511999999999?text=${encodeURIComponent(ui.leadForm.whatsappMessage)}`,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("border-berry-300", "text-white");
  });

  it("reserva a altura do formulario com cinco blocos skeleton enquanto o chunk carrega", () => {
    renderWithMotion(<Contato />);
    const Loading = dynamicOptions.current?.loading;
    expect(Loading).toBeTypeOf("function");
    if (!Loading) throw new Error("next/dynamic sem loading");
    const { container } = render(<Loading />);
    const blocks = container.querySelectorAll(".skeleton");
    expect(blocks).toHaveLength(5);
    for (const block of blocks) expect(block).toHaveClass("h-12");
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("marca d'agua no canto inferior esquerdo, decorativa e so a partir de xl", () => {
    renderWithMotion(<Contato />);
    const watermark = document.querySelector("[data-brand-watermark]");
    expect(watermark).not.toBeNull();
    expect(watermark).toHaveAttribute("aria-hidden", "true");
    expect(watermark).toHaveAttribute("alt", "");
    expect(watermark?.getAttribute("src")).toContain("moorah-mark-white");
    expect(watermark).toHaveClass(
      "absolute",
      "left-0",
      "-bottom-24",
      "h-[200px]",
      "w-auto",
      "opacity-[0.07]",
      "pointer-events-none",
      "hidden",
      "xl:block",
    );
    expect(watermark).toHaveAttribute("loading", "lazy");
    expect(watermark).not.toHaveAttribute("fetchpriority", "high");
  });
});
