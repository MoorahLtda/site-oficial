import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  createRateLimiter,
  forwardLead,
  leadSchema,
  maskEmail,
  maskPhone,
  onlyDigits,
  signPayload,
} from "./leads";

const valid = {
  name: "Maria Clara",
  email: "Maria@Exemplo.com.br",
  whatsapp: "(11) 99999-1234",
  plan: "familiar",
  consent: true,
};

describe("leadSchema", () => {
  it("aceita um lead valido e normaliza e-mail e telefone", () => {
    const r = leadSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.email).toBe("maria@exemplo.com.br");
    expect(r.data.whatsapp).toBe("11999991234");
    expect(r.data.plan).toBe("familiar");
  });

  it("aceita whatsapp vazio ou ausente", () => {
    expect(leadSchema.safeParse({ ...valid, whatsapp: "" }).success).toBe(true);
    const { whatsapp: _omitted, ...rest } = valid;
    expect(leadSchema.safeParse(rest).success).toBe(true);
  });

  it("rejeita nome curto, e-mail invalido, plano desconhecido e telefone fora do padrao", () => {
    expect(leadSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, email: "nao-e-email" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, plan: "premium" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, whatsapp: "123" }).success).toBe(false);
  });

  it("exige consentimento LGPD", () => {
    expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejeita campos nao previstos (mass assignment)", () => {
    const r = leadSchema.safeParse({ ...valid, isAdmin: true });
    expect(r.success).toBe(false);
  });
});

describe("mascaramento LGPD", () => {
  it("mascara e-mail preservando dominio", () => {
    expect(maskEmail("maria@exemplo.com.br")).toBe("m***@exemplo.com.br");
    expect(maskEmail("ab@x.io")).toBe("a***@x.io");
  });

  it("mascara telefone deixando os 4 ultimos digitos", () => {
    expect(maskPhone("11999991234")).toBe("*******1234");
    expect(maskPhone("")).toBe("");
  });

  it("extrai apenas digitos", () => {
    expect(onlyDigits("+55 (11) 9 9999-1234")).toBe("5511999991234");
  });
});

describe("createRateLimiter", () => {
  it("permite ate o limite e bloqueia depois, liberando apos a janela", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    const t0 = 1_000_000;
    expect(limiter.check("ip-a", t0).allowed).toBe(true);
    expect(limiter.check("ip-a", t0 + 10).allowed).toBe(true);
    expect(limiter.check("ip-a", t0 + 20).allowed).toBe(true);
    const blocked = limiter.check("ip-a", t0 + 30);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(limiter.check("ip-b", t0 + 30).allowed).toBe(true);
    expect(limiter.check("ip-a", t0 + 1001).allowed).toBe(true);
  });
});

describe("assinatura e encaminhamento", () => {
  it("gera HMAC SHA-256 em hex compativel com node:crypto", async () => {
    const body = JSON.stringify({ a: 1 });
    const expected = createHmac("sha256", "segredo").update(body).digest("hex");
    expect(await signPayload(body, "segredo")).toBe(expected);
  });

  it("envia POST JSON com header de assinatura quando ha segredo", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 204 }));
    const lead = { name: "Ana", email: "ana@x.com", plan: "individual" as const };
    const r = await forwardLead(lead, { url: "https://hook.test/leads", secret: "s", fetchImpl });
    expect(r.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://hook.test/leads");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Moorah-Signature"]).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.parse(init.body as string)).toEqual(lead);
  });

  it("retorna ok=false quando o webhook falha ou lanca", async () => {
    const failing = vi.fn(async () => new Response("erro", { status: 500 }));
    const r1 = await forwardLead(
      { name: "A", email: "a@a.com", plan: "individual" },
      {
        url: "https://hook.test",
        fetchImpl: failing,
      },
    );
    expect(r1.ok).toBe(false);
    expect(r1.status).toBe(500);
    const throwing = vi.fn(async () => {
      throw new Error("rede");
    });
    const r2 = await forwardLead(
      { name: "A", email: "a@a.com", plan: "individual" },
      {
        url: "https://hook.test",
        fetchImpl: throwing,
      },
    );
    expect(r2.ok).toBe(false);
  });
});
