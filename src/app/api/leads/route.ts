import type { NextRequest } from "next/server";
import { z } from "zod";
import { createRateLimiter, forwardLead, leadSchema, maskEmail, maskPhone } from "@/lib/leads";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!limiter.check(clientIp(req)).allowed) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) {
    // Devolve apenas os nomes dos campos com erro, nunca os valores enviados.
    const fields = Object.keys(z.flattenError(parsed.error).fieldErrors);
    return json({ ok: false, error: "invalid", fields }, 400);
  }

  const { website, consent: _consent, ...lead } = parsed.data;
  if (website) {
    // Honeypot preenchido: provavelmente bot. Responde sucesso sem encaminhar.
    return json({ ok: true });
  }

  const payload = {
    ...lead,
    whatsapp: lead.whatsapp || undefined,
    receivedAt: new Date().toISOString(),
    source: "landing",
  };

  const url = process.env.LEAD_WEBHOOK_URL;
  if (url) {
    const result = await forwardLead(payload, { url, secret: process.env.LEAD_WEBHOOK_SECRET });
    if (!result.ok) {
      console.error("[leads] falha ao encaminhar lead", { status: result.status, plan: lead.plan });
      return json({ ok: false, error: "upstream" }, 502);
    }
  } else {
    console.warn("[leads] novo lead (sem LEAD_WEBHOOK_URL)", {
      plan: lead.plan,
      email: maskEmail(lead.email),
      whatsapp: maskPhone(lead.whatsapp ?? ""),
    });
  }

  return json({ ok: true });
}
