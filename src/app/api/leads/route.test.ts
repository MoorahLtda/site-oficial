// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function request(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = {
  name: "Joana Souza",
  email: "joana@exemplo.com",
  whatsapp: "11 98888-7777",
  plan: "individual",
  consent: true,
};

describe("POST /api/leads", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("aceita lead valido e nao ecoa dados pessoais", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await POST(
      request({ ...valid, email: "unico1@exemplo.com" }, { "x-forwarded-for": "10.0.0.1" }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(res.headers.get("cache-control")).toBe("no-store");
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain("unico1@exemplo.com");
    expect(logged).not.toContain("11988887777");
  });

  it("rejeita corpo invalido devolvendo so os nomes dos campos", async () => {
    const res = await POST(
      request({ ...valid, email: "x", name: "A" }, { "x-forwarded-for": "10.0.0.2" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fields).toEqual(expect.arrayContaining(["email", "name"]));
    expect(JSON.stringify(body)).not.toContain("Joana");
  });

  it("rejeita content-type diferente de JSON e JSON quebrado", async () => {
    const r1 = await POST(
      request(valid, { "content-type": "text/plain", "x-forwarded-for": "10.0.0.3" }),
    );
    expect(r1.status).toBe(415);
    const r2 = await POST(request("{nao e json", { "x-forwarded-for": "10.0.0.4" }));
    expect(r2.status).toBe(400);
  });

  it("finge sucesso quando o honeypot esta preenchido, sem encaminhar", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hook.test/leads");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const res = await POST(
      request({ ...valid, website: "http://spam" }, { "x-forwarded-for": "10.0.0.5" }),
    );
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("encaminha para o webhook com assinatura quando configurado", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hook.test/leads");
    vi.stubEnv("LEAD_WEBHOOK_SECRET", "segredo");
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));
    const res = await POST(request(valid, { "x-forwarded-for": "10.0.0.6" }));
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers["X-Moorah-Signature"]).toMatch(/^[a-f0-9]{64}$/);
    const sent = JSON.parse(init.body as string);
    expect(sent.email).toBe("joana@exemplo.com");
    expect(sent.whatsapp).toBe("11988887777");
    expect(sent.source).toBe("landing");
    expect(sent).not.toHaveProperty("consent");
  });

  it("responde 502 quando o webhook falha", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hook.test/leads");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("x", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(request(valid, { "x-forwarded-for": "10.0.0.7" }));
    expect(res.status).toBe(502);
  });

  it("aplica rate limit por IP", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const ip = "198.51.100.9";
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await POST(request(valid, { "x-forwarded-for": ip }));
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });
});
