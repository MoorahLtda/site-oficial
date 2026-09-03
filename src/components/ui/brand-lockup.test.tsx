import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLockup } from "./brand-lockup";

// O lockup e decorativo: fica fora da arvore de acessibilidade por padrao, entao os testes
// consultam o DOM em vez de papeis.
function parts(container: HTMLElement) {
  const group = container.querySelector("[data-brand-lockup]");
  const images = Array.from(container.querySelectorAll("img"));
  return { group, mark: images[0], wordmark: images[1], images };
}

describe("BrandLockup", () => {
  it("desenha simbolo e palavra em branco, na geometria dos blocos plum", () => {
    const { container } = render(<BrandLockup tone="white" />);
    const { group, mark, wordmark, images } = parts(container);

    expect(images).toHaveLength(2);
    expect(mark).toHaveAttribute("src", expect.stringContaining("moorah-mark-white"));
    expect(wordmark).toHaveAttribute("src", expect.stringContaining("moorah-wordmark-white"));
    // Alturas que os dois blocos plum usam hoje (brief v2, item 2).
    expect(mark).toHaveClass("h-8");
    expect(wordmark).toHaveClass("h-4");
    expect(group).toHaveClass("flex", "items-center", "gap-2");
  });

  it("nunca distorce: largura automatica nas duas pecas", () => {
    const { container } = render(<BrandLockup tone="white" />);
    const { mark, wordmark } = parts(container);
    for (const img of [mark, wordmark]) {
      expect(img).toHaveClass("w-auto");
      expect(img).not.toHaveClass("h-auto");
    }
    // width/height reais dos arquivos, para o next/image reservar o espaco certo.
    expect(mark).toHaveAttribute("width", "194");
    expect(mark).toHaveAttribute("height", "265");
    expect(wordmark).toHaveAttribute("width", "518");
    expect(wordmark).toHaveAttribute("height", "82");
  });

  it("e decorativo por padrao: alt vazio e grupo fora da leitura", () => {
    const { container } = render(<BrandLockup tone="white" />);
    const { group, mark, wordmark } = parts(container);
    expect(mark).toHaveAttribute("alt", "");
    expect(wordmark).toHaveAttribute("alt", "");
    expect(group).toHaveAttribute("aria-hidden", "true");
    expect(group).not.toHaveAttribute("aria-label");
  });

  it("com label o grupo entra na leitura como imagem nomeada, sem duplicar o nome nos alts", () => {
    const { container } = render(<BrandLockup tone="white" label="Moorah" />);
    const { group, mark, wordmark } = parts(container);
    expect(group).toHaveAttribute("aria-label", "Moorah");
    expect(group).not.toHaveAttribute("aria-hidden");
    expect(mark).toHaveAttribute("alt", "");
    expect(wordmark).toHaveAttribute("alt", "");
  });

  it("usa os arquivos plum quando o tom nao e branco", () => {
    const { container } = render(<BrandLockup />);
    const { mark, wordmark } = parts(container);
    expect(mark).toHaveAttribute("src", expect.stringContaining("moorah-mark.png"));
    expect(wordmark).toHaveAttribute("src", expect.stringContaining("moorah-wordmark.png"));
    expect(mark?.getAttribute("src")).not.toContain("white");
  });

  it("carrega em lazy por padrao, porque priority e so do header e da foto do hero", () => {
    const { container } = render(<BrandLockup tone="white" />);
    for (const img of parts(container).images) {
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).not.toHaveAttribute("fetchpriority", "high");
    }
  });

  it("com priority as duas pecas entram juntas na primeira pintura", () => {
    const { container } = render(<BrandLockup priority />);
    for (const img of parts(container).images) {
      // Neste Next o priority nao marca o <img>: ele tira o lazy e preanuncia no <head>,
      // que fica fora do que este render alcanca.
      expect(img).not.toHaveAttribute("loading", "lazy");
    }
  });

  it("empilha na vertical quando pedido, como no rodape", () => {
    const { container } = render(
      <BrandLockup direction="column" markClassName="h-16 w-auto" wordmarkClassName="h-5 w-auto" />,
    );
    const { group, mark, wordmark } = parts(container);
    expect(group).toHaveClass("flex-col", "items-start");
    expect(mark).toHaveClass("h-16");
    expect(wordmark).toHaveClass("h-5");
  });

  it("aceita alturas responsivas, como as do header", () => {
    const { container } = render(
      <BrandLockup
        markClassName="h-6 w-auto sm:h-7 lg:h-8"
        wordmarkClassName="h-3.5 w-auto sm:h-4 lg:h-[21px]"
      />,
    );
    const { mark, wordmark } = parts(container);
    expect(mark).toHaveClass("h-6", "sm:h-7", "lg:h-8");
    expect(wordmark).toHaveClass("h-3.5", "sm:h-4", "lg:h-[21px]");
  });

  it("mescla className e deixa o consumidor trocar o espacamento", () => {
    const { container } = render(<BrandLockup tone="white" className="opacity-90 gap-2.5" />);
    const group = parts(container).group;
    expect(group).toHaveClass("opacity-90", "gap-2.5");
    // twMerge resolve o conflito: fica so o gap do consumidor.
    expect(group).not.toHaveClass("gap-2");
  });
});
