import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { formatBRL, getPlan, ui } from "@/content/site";
import { LeadDialogButton } from "./lead-dialog";

describe("LeadDialogButton", () => {
  it("renderiza um botao com o cta do plano e aceita props de Button", () => {
    render(<LeadDialogButton plan="familiar" variant="plum" size="lg" fullWidth />);
    const button = screen.getByRole("button", { name: getPlan("familiar").cta });
    expect(button).toHaveClass("bg-white", "text-ink", "h-[52px]", "w-full");
    expect(button).toHaveAttribute("type", "button");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("aceita label customizado", () => {
    render(<LeadDialogButton plan="individual" label="Começar agora" />);
    expect(screen.getByRole("button", { name: "Começar agora" })).toBeInTheDocument();
  });

  it("abre o dialog com titulo, descricao e o formulario com o plano pre-selecionado", async () => {
    const user = userEvent.setup();
    const plan = getPlan("familiar");
    render(<LeadDialogButton plan="familiar" />);
    await user.click(screen.getByRole("button", { name: plan.cta }));
    const dialog = screen.getByRole("dialog", { name: plan.cta });
    expect(dialog).toHaveAccessibleDescription(
      `${plan.peopleLabel}. ${formatBRL(plan.priceCents)} por mês.`,
    );
    const select = await screen.findByLabelText(ui.leadForm.plan);
    expect(select).toHaveValue("familiar");
    expect(screen.getByRole("button", { name: ui.leadForm.submit })).toBeInTheDocument();
  });

  it("valida o formulario vazio dentro do dialog e fecha com Escape", async () => {
    const user = userEvent.setup();
    render(<LeadDialogButton plan="individual" />);
    await user.click(screen.getByRole("button", { name: getPlan("individual").cta }));
    expect(await screen.findByLabelText(ui.leadForm.plan)).toHaveValue("individual");
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    expect(screen.getByText("Informe seu nome.")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cada botao tem o proprio dialog", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LeadDialogButton plan="individual" />
        <LeadDialogButton plan="familiar" />
      </>,
    );
    await user.click(screen.getByRole("button", { name: getPlan("individual").cta }));
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("dialog")).toHaveAccessibleName(getPlan("individual").cta);
  });
});
