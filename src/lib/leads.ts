import { z } from "zod";

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// Telefone brasileiro com DDD (10 ou 11 digitos) ou com DDI 55 (12 ou 13 digitos).
const whatsappSchema = z
  .string()
  .trim()
  .max(30)
  .transform(onlyDigits)
  .refine((d) => d.length === 0 || (d.length >= 10 && d.length <= 13), {
    message: "Informe DDD e número, por exemplo (11) 99999-1234.",
  });

export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome.").max(80),
    email: z
      .email("Informe um e-mail válido.")
      .max(120)
      .transform((v) => v.trim().toLowerCase()),
    whatsapp: whatsappSchema.optional(),
    plan: z.enum(["individual", "familiar"], { message: "Escolha um plano." }),
    message: z.string().trim().max(500).optional(),
    consent: z.literal(true, { message: "É preciso aceitar a política de privacidade." }),
    // Honeypot: campo invisivel que humanos nao preenchem. Tratado na rota.
    website: z.string().max(200).optional(),
  })
  .strict();

export type LeadInput = z.infer<typeof leadSchema>;

export interface LeadPayload {
  name: string;
  email: string;
  whatsapp?: string;
  plan: "individual" | "familiar";
  message?: string;
  receivedAt?: string;
  source?: string;
}

export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

export function maskPhone(phone: string): string {
  const digits = onlyDigits(phone);
  if (!digits) return "";
  const tail = digits.slice(-4);
  return `${"*".repeat(Math.max(digits.length - 4, 0))}${tail}`;
}

export interface RateLimiter {
  check(key: string, now?: number): { allowed: boolean; remaining: number };
}

// Janela deslizante em memoria: suficiente para uma instancia; troque por store
// compartilhado (Redis, Upstash) ao escalar horizontalmente.
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, remaining: 0 };
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return { allowed: true, remaining: limit - recent.length };
    },
  };
}

export async function signPayload(body: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface ForwardOptions {
  url: string;
  secret?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export async function forwardLead(
  lead: LeadPayload,
  { url, secret, fetchImpl = fetch, timeoutMs = 8000 }: ForwardOptions,
): Promise<{ ok: boolean; status: number }> {
  const body = JSON.stringify(lead);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) headers["X-Moorah-Signature"] = await signPayload(body, secret);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { method: "POST", headers, body, signal: controller.signal });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}
