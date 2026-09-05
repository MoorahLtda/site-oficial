import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { finalCta, photos, ui } from "@/content/site";
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

// O IntersectionObserver de tests/setup.ts nunca dispara; com reduced motion o cluster
// renderiza o estado final (trilhas desenhadas) sem timers.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});

describe("Contato", () => {
  beforeEach(() => {
    whatsappMock.mockReturnValue("");
  });

  it("renderiza a secao #contato em plum rotulada pelo h2 com finalCta.title", () => {
    renderWithMotion(<Contato />);
    const heading = screen.getByRole("heading", { level: 2, name: finalCta.title });
    const section = document.getElementById("contato");
    expect(section?.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
    expect(section?.firstElementChild).toHaveClass("rounded-3xl", "text-white");
    expect(screen.getByText(finalCta.eyebrow)).toHaveClass("eyebrow", "text-berry-300");
    expect(screen.getByText(finalCta.text)).toBeInTheDocument();
  });

  it("carrega o formulario com labels, select em familiar e h3, sem nota legal", () => {
    renderWithMotion(<Contato />);
    expect(screen.getByLabelText(ui.leadForm.name)).toBeInTheDocument();
    expect(screen.getByLabelText(ui.leadForm.email)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(ui.leadForm.plan)).toHaveValue("familiar");
    expect(screen.getByRole("heading", { level: 3, name: ui.leadForm.title })).toBeInTheDocument();
    expect(screen.getByText(ui.leadForm.subtitle)).toBeInTheDocument();
    expect(screen.queryByText(/LGPD/)).not.toBeInTheDocument();
    expect(screen.queryByText(/192/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: ui.leadForm.submit })).toBeInTheDocument();
    // Hook do card branco: o e2e mede a folga da marca d'agua contra o card, nao contra o botao.
    const card = screen
      .getByRole("heading", { level: 3, name: ui.leadForm.title })
      .closest("[data-lead-card]");
    expect(card).toHaveClass("bg-white", "rounded-2xl");
  });

  it("o link primario aponta para #planos e nao ha wa.me sem WhatsApp configurado", () => {
    renderWithMotion(<Contato />);
    const primary = screen.getByRole("link", { name: finalCta.primaryCta });
    expect(primary).toHaveAttribute("href", "#planos");
    expect(primary).toHaveClass("bg-white", "text-ink", "h-[52px]");
    const links = screen.getAllByRole("link");
    expect(links.some((link) => link.getAttribute("href")?.includes("wa.me"))).toBe(false);
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

  it("desenha a Trilha da Amora outline decorativa ao fundo, em modo draw e com cometas", () => {
    renderWithMotion(<Contato />);
    const svg = document.querySelector("svg[data-trail-cluster]");
    expect(svg).toHaveAttribute("data-variant", "outline");
    expect(svg).toHaveAttribute("data-animate", "draw");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("pointer-events-none", "opacity-25", "hidden", "lg:block");
    expect(svg).not.toHaveClass("block");
    // Cometas continuos (CSS): a media query de reduced motion em globals.css os zera.
    const comets = svg?.querySelectorAll("[data-comet]") ?? [];
    expect(comets.length).toBeGreaterThan(0);
    for (const comet of comets) expect(comet).toHaveClass("animate-comet");
  });

  it("traz o lockup branco decorativo acima do eyebrow", () => {
    renderWithMotion(<Contato />);
    const lockup = document.querySelector("[data-brand-lockup]");
    expect(lockup).not.toBeNull();
    expect(lockup).toHaveAttribute("aria-hidden", "true");
    expect(lockup).toHaveClass("opacity-90");

    const images = Array.from(lockup?.querySelectorAll("img") ?? []);
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute("src")).toContain("moorah-mark-white");
    expect(images[0]).toHaveClass("h-8", "w-auto");
    expect(images[0]).toHaveAttribute("alt", "");
    expect(images[1].getAttribute("src")).toContain("moorah-wordmark-white");
    expect(images[1]).toHaveClass("h-4", "w-auto");
    expect(images[1]).toHaveAttribute("alt", "");
    // `priority` so no lockup do header e na foto do hero (brief v2, item 1).
    for (const image of images) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).not.toHaveAttribute("fetchpriority", "high");
    }

    const eyebrow = screen.getByText(finalCta.eyebrow);
    expect(lockup?.compareDocumentPosition(eyebrow)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("mostra a marca d'agua do simbolo branco, decorativa e so no desktop", () => {
    renderWithMotion(<Contato />);
    const watermark = document.querySelector("[data-brand-watermark]");
    expect(watermark).not.toBeNull();
    expect(watermark).toHaveAttribute("aria-hidden", "true");
    expect(watermark).toHaveAttribute("alt", "");
    expect(watermark?.getAttribute("src")).toContain("moorah-mark-white");
    expect(watermark).toHaveClass(
      "absolute",
      "right-0",
      "top-full",
      "h-[265px]",
      "w-auto",
      "opacity-[0.07]",
      "pointer-events-none",
      "hidden",
      "lg:block",
    );
    expect(watermark).toHaveAttribute("loading", "lazy");
    expect(watermark).not.toHaveAttribute("fetchpriority", "high");
  });

  it("traz a foto da medica como card retrato ao lado do formulario", () => {
    renderWithMotion(<Contato />);
    const photo = screen.getByAltText(photos.medicaHeadset.alt);
    expect(photo).toHaveAttribute("sizes", "(min-width: 1024px) 280px, 92vw");
    expect(photo).toHaveAttribute("loading", "lazy");
    expect(photo).toHaveClass("object-cover", "h-full", "w-full");

    const frame = photo.parentElement;
    expect(frame).toHaveClass("aspect-[3/2]", "lg:aspect-[4/5]", "rounded-3xl", "ring-white/10");

    // Desktop: foto na terceira coluna (order-3) e formulario na segunda (order-2).
    const photoColumn = frame?.parentElement;
    expect(photoColumn).toHaveClass("order-2", "lg:order-3", "lg:col-span-3", "lg:self-start");
    const formColumn = screen
      .getByRole("heading", { level: 3, name: ui.leadForm.title })
      .closest("div.lg\\:order-2");
    expect(formColumn).toHaveClass("order-3", "lg:order-2", "lg:col-span-4");
    // No mobile a foto vem antes do formulario no DOM.
    expect(photoColumn?.compareDocumentPosition(formColumn as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
