import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./dialog";

describe("Dialog", () => {
  it("abre ao clicar no gatilho, com titulo, descricao e botao Fechar de 44 px", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Assinar Familiar</DialogTrigger>
        <DialogContent title="Assinar Familiar" description="até 4 pessoas. R$ 97,90 por mês.">
          <p>Conteúdo do formulário</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Assinar Familiar" }));
    const dialog = screen.getByRole("dialog", { name: "Assinar Familiar" });
    expect(dialog).toHaveAccessibleDescription("até 4 pessoas. R$ 97,90 por mês.");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveClass("max-w-md", "rounded-2xl", "data-[state=open]:animate-zoom-in");
    expect(screen.getByText("Conteúdo do formulário")).toBeInTheDocument();
    const close = screen.getByRole("button", { name: "Fechar" });
    expect(close).toHaveClass("h-11", "w-11", "rounded-full");
    expect(close.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("fecha com Escape e com o botao Fechar", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent title="Menu">Links</DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("variant sheet usa a folha lateral e titleSrOnly esconde o titulo visualmente", () => {
    render(
      <Dialog open>
        <DialogContent variant="sheet" title="Menu" titleSrOnly>
          <DialogClose>Ir para planos</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveClass("right-0", "max-w-sm", "data-[state=open]:animate-slide-in-right");
    expect(dialog).not.toHaveClass("rounded-2xl");
    expect(screen.getByText("Menu")).toHaveClass("sr-only");
    expect(screen.getByRole("button", { name: "Ir para planos" })).toBeInTheDocument();
  });

  it("DialogClose asChild fecha o dialog controlado", async () => {
    const user = userEvent.setup();
    function Controlled() {
      return (
        <Dialog defaultOpen>
          <DialogContent title="Menu">
            <DialogClose asChild>
              <a href="#planos">Ver planos</a>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole("link", { name: "Ver planos" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renderiza o overlay com blur e mescla className no conteudo", () => {
    render(
      <Dialog open>
        <DialogContent title="Teste" className="p-10">
          Corpo
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("p-10");
    expect(document.querySelector(".backdrop-blur-sm")).toHaveClass(
      "fixed",
      "inset-0",
      "data-[state=open]:animate-fade-in",
    );
  });
});
