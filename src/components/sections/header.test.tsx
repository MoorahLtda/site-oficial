import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { legalLinks, nav, site, ui } from "@/content/site";
import { renderWithMotion } from "@/test/render";
import { Header } from "./header";

// Tracos escritos por codigo para o caractere nao existir no repositorio.
const EN_DASH = String.fromCharCode(0x2013);
const EM_DASH = String.fromCharCode(0x2014);

// appUrl vem de variavel de ambiente; fixamos vazio para o teste ser deterministico.
vi.mock("@/content/site", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/content/site")>();
  return { ...actual, site: { ...actual.site, appUrl: "" } };
});

describe("Header", () => {
  it("renderiza a nav principal com um link por item de nav apontando para a ancora", () => {
    renderWithMotion(<Header />);
    const navigation = screen.getByRole("navigation", { name: "Principal" });
    const links = within(navigation).getAllByRole("link");
    expect(links).toHaveLength(nav.length);
    nav.forEach((item, index) => {
      expect(links[index]).toHaveAttribute("href", `#${item.id}`);
      expect(links[index]).toHaveTextContent(item.label);
      expect(links[index]).not.toHaveAttribute("aria-current");
    });
  });

  it("o link para a home traz o lockup de simbolo e palavra, ambos decorativos", () => {
    renderWithMotion(<Header />);
    const home = screen.getByRole("link", { name: `${site.name}, página inicial` });
    expect(home).toHaveAttribute("href", "/");
    // Alvo de 44 px e respiro entre simbolo e palavra.
    expect(home).toHaveClass("h-11", "gap-2.5");

    const images = home.querySelectorAll("img");
    expect(images).toHaveLength(2);
    const [mark, wordmark] = images;
    expect(mark.getAttribute("src")).toContain("moorah-mark.png");
    expect(wordmark.getAttribute("src")).toContain("moorah-wordmark.png");
    // alt vazio nas duas: o nome acessivel vem do aria-label do link.
    for (const image of images) {
      expect(image).toHaveAttribute("alt", "");
      // Nunca distorcido: uma dimensao sempre automatica.
      expect(image.className).toContain("w-auto");
    }
    // Escalas do brief v2: mobile menor, desktop maior.
    expect(mark.className).toContain("h-6");
    expect(mark.className).toContain("lg:h-8");
    expect(wordmark.className).toContain("h-3.5");
    expect(wordmark.className).toContain("lg:h-[21px]");
    // O lockup inteiro entra na primeira pintura da barra: nenhuma das duas partes em lazy.
    for (const image of images) expect(image).not.toHaveAttribute("loading", "lazy");
  });

  it("nao renderiza Entrar quando site.appUrl esta vazio", () => {
    renderWithMotion(<Header />);
    expect(screen.queryByRole("link", { name: ui.header.login })).not.toBeInTheDocument();
  });

  it("botao de menu abre a folha com os links e reflete aria-expanded", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Header />);
    const button = screen.getByRole("button", { name: ui.header.menuOpen });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveClass("h-11", "w-11");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(button);
    const dialog = screen.getByRole("dialog", { name: ui.header.menuTitle });
    expect(button).toHaveAttribute("aria-expanded", "true");
    for (const item of nav) {
      expect(within(dialog).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        `#${item.id}`,
      );
    }
    expect(within(dialog).getByRole("link", { name: ui.header.cta })).toHaveAttribute(
      "href",
      "#planos",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("os CTAs de planos sao ancoras para #planos e o skip link vem primeiro", () => {
    renderWithMotion(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-scrolled", "false");
    const skip = screen.getByRole("link", { name: ui.header.skip });
    expect(skip).toHaveAttribute("href", "#conteudo");
    expect(header.firstElementChild).toBe(skip);

    const cta = screen.getByRole("link", { name: ui.header.cta });
    expect(cta.tagName).toBe("A");
    expect(cta).toHaveAttribute("href", "#planos");
    // Link "Planos" da nav e botao curto do mobile: ambos ancoras, nunca <button>.
    const shortLinks = screen.getAllByRole("link", { name: ui.header.ctaShort });
    expect(shortLinks).toHaveLength(2);
    for (const link of shortLinks) expect(link).toHaveAttribute("href", "#planos");
  });

  it("traz a faixa de documentos legais com os tres links, separados por ponto mediano", () => {
    renderWithMotion(<Header />);
    const bar = screen.getByTestId("legal-bar");
    // No topo a faixa esta aberta: nada de inert.
    expect(bar).not.toHaveAttribute("inert");
    const navigation = within(bar).getByRole("navigation", { name: ui.header.legalLabel });
    const links = within(navigation).getAllByRole("link");
    expect(links).toHaveLength(legalLinks.length);
    legalLinks.forEach((item, index) => {
      expect(links[index]).toHaveAttribute("href", item.href);
      expect(links[index]).toHaveTextContent(item.label);
    });
    // Separador e "·"; nenhum traco (hifen, meia-risca ou travessao) solto no texto.
    expect(navigation.textContent).toContain("·");
    expect(navigation.textContent).not.toMatch(new RegExp(`[-${EN_DASH}${EM_DASH}]s`));
  });

  it("a folha do menu repete os documentos legais, ja que a faixa so aparece a partir de md", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Header />);
    await user.click(screen.getByRole("button", { name: ui.header.menuOpen }));
    const dialog = screen.getByRole("dialog", { name: ui.header.menuTitle });
    const legal = within(dialog).getByRole("navigation", { name: ui.header.legalLabel });
    expect(within(legal).getAllByRole("link")).toHaveLength(legalLinks.length);
    for (const item of legalLinks) {
      expect(within(legal).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href,
      );
    }
  });
});
