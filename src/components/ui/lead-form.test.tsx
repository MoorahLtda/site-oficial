import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { plans, ui } from "@/content/site";
import { LeadForm } from "./lead-form";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(ui.leadForm.name), "Maria Teste");
  await user.type(screen.getByLabelText(ui.leadForm.email), "Maria@Exemplo.com.br");
  await user.click(screen.getByRole("checkbox"));
}

describe("LeadForm", () => {
  it("renderiza campos rotulados, plano padrao familiar, consentimento e honeypot", () => {
    render(<LeadForm />);
    expect(screen.getByLabelText(ui.leadForm.name)).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText(ui.leadForm.email)).toHaveAttribute("type", "email");
    const whatsapp = screen.getByLabelText(ui.leadForm.whatsapp);
    expect(whatsapp).toHaveAttribute("type", "tel");
    expect(whatsapp).toHaveAttribute("placeholder", ui.leadForm.whatsappPlaceholder);
    const select = screen.getByLabelText(ui.leadForm.plan);
    expect(select).toHaveValue("familiar");
    expect(screen.getAllByRole("option")).toHaveLength(plans.length);
    const consent = screen.getByRole("checkbox");
    expect(consent).not.toBeChecked();
    expect(screen.getByRole("link", { name: "Política de privacidade" })).toHaveAttribute(
      "href",
      "/privacidade",
    );
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.getByRole("button", { name: ui.leadForm.submit })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("respeita defaultPlan e gera ids distintos por instancia", () => {
    render(
      <>
        <LeadForm defaultPlan="individual" />
        <LeadForm defaultPlan="familiar" />
      </>,
    );
    const selects = screen.getAllByLabelText(ui.leadForm.plan);
    expect(selects[0]).toHaveValue("individual");
    expect(selects[1]).toHaveValue("familiar");
    const names = screen.getAllByLabelText(ui.leadForm.name);
    expect(names[0].id).not.toBe(names[1].id);
    expect(names[0].id).not.toBe("");
  });

  it("mostra erros do schema sem chamar a API quando o formulario esta vazio", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    expect(fetchMock).not.toHaveBeenCalled();
    const nameInput = screen.getByLabelText(ui.leadForm.name);
    const nameError = screen.getByText("Informe seu nome.");
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", nameError.id);
    expect(nameError.querySelector("svg")).toHaveClass("text-critical-500");
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
    expect(screen.getByText("É preciso aceitar a política de privacidade.")).toBeInTheDocument();
    expect(screen.getByLabelText(ui.leadForm.whatsapp)).not.toHaveAttribute("aria-invalid");
  });

  it("envia o corpo estrito para /api/leads e mostra o estado de sucesso", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    render(<LeadForm defaultPlan="individual" onSuccess={onSuccess} />);
    await fillValid(user);
    await user.type(screen.getByLabelText(ui.leadForm.whatsapp), "(11) 99999-1234");
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/leads");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("Content-Type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual({
      name: "Maria Teste",
      email: "maria@exemplo.com.br",
      whatsapp: "11999991234",
      plan: "individual",
      consent: true,
      website: "",
    });

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent(ui.leadForm.successTitle);
    expect(status).toHaveTextContent(ui.leadForm.successText);
    expect(status.querySelector("svg")).toHaveClass("text-leaf-600");
    expect(screen.queryByRole("button", { name: ui.leadForm.submit })).not.toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("marca o botao como enviando enquanto aguarda a resposta", async () => {
    const user = userEvent.setup();
    let resolve: ((r: Response) => void) | undefined;
    fetchMock.mockReturnValueOnce(
      new Promise<Response>((r) => {
        resolve = r;
      }),
    );
    render(<LeadForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    const sending = await screen.findByRole("button", { name: ui.leadForm.sending });
    expect(sending).toBeDisabled();
    expect(sending).toHaveAttribute("aria-busy", "true");
    resolve?.(jsonResponse({ ok: true }));
    await screen.findByRole("status");
  });

  it("mostra a mensagem de rate limit em 429", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: "rate_limited" }, 429));
    render(<LeadForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(ui.leadForm.errorRateLimited);
    expect(screen.getByRole("button", { name: ui.leadForm.submit })).toBeEnabled();
  });

  it("mostra erro generico em falha de rede ou 5xx e marca campos devolvidos em 400", async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    render(<LeadForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    expect(await screen.findByRole("alert")).toHaveTextContent(ui.leadForm.errorGeneric);

    fetchMock.mockResolvedValueOnce(
      jsonResponse({ ok: false, error: "invalid", fields: ["email"] }, 400),
    );
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    await waitFor(() =>
      expect(screen.getByLabelText(ui.leadForm.email)).toHaveAttribute("aria-invalid", "true"),
    );
    expect(screen.getByLabelText(ui.leadForm.name)).not.toHaveAttribute("aria-invalid");
  });

  it("nao escreve dados do formulario no console", async () => {
    const user = userEvent.setup();
    const spies = [
      vi.spyOn(console, "log").mockImplementation(() => {}),
      vi.spyOn(console, "info").mockImplementation(() => {}),
      vi.spyOn(console, "warn").mockImplementation(() => {}),
      vi.spyOn(console, "error").mockImplementation(() => {}),
      vi.spyOn(console, "debug").mockImplementation(() => {}),
    ];
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    render(<LeadForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: ui.leadForm.submit }));
    await screen.findByRole("status");
    const logged = spies.flatMap((s) => s.mock.calls.flat()).map((v) => JSON.stringify(v) ?? "");
    expect(logged.some((v) => /maria|exemplo\.com/i.test(v))).toBe(false);
    for (const s of spies) s.mockRestore();
  });
});
