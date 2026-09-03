import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function renderFaq(defaultValue?: string) {
  return render(
    <Accordion type="single" collapsible defaultValue={defaultValue}>
      <AccordionItem value="faq-0">
        <AccordionTrigger>O que é telemedicina?</AccordionTrigger>
        <AccordionContent>Consulta por vídeo com médico habilitado.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-1" className="mt-2">
        <AccordionTrigger>A Moorah é um plano de saúde?</AccordionTrigger>
        <AccordionContent>Não. É uma assinatura de telemedicina.</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renderiza os gatilhos dentro de h3 e fechados por padrao", () => {
    renderFaq();
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(2);
    const trigger = screen.getByRole("button", { name: "O que é telemedicina?" });
    expect(headings[0]).toContainElement(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Consulta por vídeo com médico habilitado.")).not.toBeInTheDocument();
  });

  it("abre o item de defaultValue e fecha os demais", () => {
    renderFaq("faq-1");
    expect(screen.getByRole("button", { name: "A Moorah é um plano de saúde?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "O que é telemedicina?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("Não. É uma assinatura de telemedicina.")).toBeInTheDocument();
  });

  it("abre ao clicar, fecha o anterior e anima o conteudo por data-state", async () => {
    const user = userEvent.setup();
    renderFaq("faq-1");
    const first = screen.getByRole("button", { name: "O que é telemedicina?" });
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "A Moorah é um plano de saúde?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    const content = screen.getByText("Consulta por vídeo com médico habilitado.").parentElement;
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveClass(
      "overflow-hidden",
      "data-[state=open]:animate-accordion-down",
      "data-[state=closed]:animate-accordion-up",
    );
  });

  it("tem o icone Plus decorativo que gira 45 graus quando aberto", () => {
    renderFaq();
    const trigger = screen.getByRole("button", { name: "O que é telemedicina?" });
    const icon = trigger.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("text-berry-600", "group-data-[state=open]:rotate-45");
    expect(trigger).toHaveClass("group", "w-full", "text-left");
  });

  it("mescla className no item e mantem a borda base", () => {
    renderFaq();
    const item = screen
      .getByRole("button", { name: "A Moorah é um plano de saúde?" })
      .closest("h3")?.parentElement;
    expect(item).toHaveAttribute("data-state", "closed");
    expect(item).toHaveClass("border-b", "border-gray-200", "mt-2");
  });
});
