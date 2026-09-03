"use client";

import { AlertCircle, CircleCheck } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { z } from "zod";
import { type PlanId, plans, ui } from "@/content/site";
import { leadSchema } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface LeadFormProps {
  defaultPlan?: PlanId;
  onSuccess?: () => void;
  className?: string;
}

type Field = "name" | "email" | "whatsapp" | "plan" | "consent";
type FieldErrors = Partial<Record<Field, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELDS: readonly Field[] = ["name", "email", "whatsapp", "plan", "consent"];

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-800";
const inputClass =
  "h-12 w-full rounded-control border border-gray-300 bg-white px-3.5 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-berry-500 focus:ring-4 focus:ring-berry-500/15 aria-invalid:border-critical-500";

// Microcopy de interface para campos que a API devolveu como invalidos (400 so traz os nomes).
const SERVER_FIELD_MESSAGE = "Verifique este campo.";

function isField(value: string): value is Field {
  return (FIELDS as readonly string[]).includes(value);
}

function firstErrors(fieldErrors: Record<string, string[] | undefined>): FieldErrors {
  const result: FieldErrors = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (isField(key) && messages?.[0]) result[key] = messages[0];
  }
  return result;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-900">
      <AlertCircle size={16} aria-hidden="true" focusable="false" className="text-critical-500" />
      {message}
    </p>
  );
}

function ConsentLabel(): ReactNode {
  // ui.leadForm.consent contem a expressao "Política de privacidade", que vira link.
  const text = ui.leadForm.consent;
  const anchor = "Política de privacidade";
  const at = text.indexOf(anchor);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Link
        href="/privacidade"
        className="font-semibold text-berry-700 underline underline-offset-4 hover:text-berry-800"
      >
        {anchor}
      </Link>
      {text.slice(at + anchor.length)}
    </>
  );
}

// Formulario de lead. Valida no cliente com o mesmo schema da rota e envia para /api/leads.
// Nunca registra e-mail ou telefone no console (LGPD).
export function LeadForm({ defaultPlan = "familiar", onSuccess, className }: LeadFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const ids = {
    name: `${id}-nome`,
    email: `${id}-email`,
    whatsapp: `${id}-whatsapp`,
    plan: `${id}-plano`,
    consent: `${id}-consentimento`,
    website: `${id}-website`,
  } as const;

  function describedBy(field: Field): string | undefined {
    return errors[field] ? `${ids[field]}-erro` : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (key: string) => {
      const value = data.get(key);
      return typeof value === "string" ? value : "";
    };

    const result = leadSchema.safeParse({
      name: read("name"),
      email: read("email"),
      whatsapp: read("whatsapp"),
      plan: read("plan"),
      consent: data.get("consent") === "on",
      website: read("website"),
    });

    if (!result.success) {
      setErrors(firstErrors(z.flattenError(result.error).fieldErrors));
      setFormError(null);
      setStatus("idle");
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          whatsapp: result.data.whatsapp ?? "",
          plan: result.data.plan,
          consent: true,
          website: result.data.website ?? "",
        }),
      });

      if (response.ok) {
        setStatus("success");
        onSuccess?.();
        return;
      }

      if (response.status === 400) {
        const body: unknown = await response.json().catch(() => null);
        const rawFields =
          body && typeof body === "object" ? (body as { fields?: unknown }).fields : undefined;
        const next: FieldErrors = {};
        if (Array.isArray(rawFields)) {
          for (const field of rawFields) {
            if (typeof field === "string" && isField(field)) next[field] = SERVER_FIELD_MESSAGE;
          }
        }
        setErrors(next);
        setFormError(ui.leadForm.errorGeneric);
        setStatus("error");
        return;
      }

      setFormError(
        response.status === 429 ? ui.leadForm.errorRateLimited : ui.leadForm.errorGeneric,
      );
      setStatus("error");
    } catch {
      setFormError(ui.leadForm.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={cn("rounded-2xl bg-white p-6 text-center", className)}>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-50">
          <CircleCheck size={28} aria-hidden="true" focusable="false" className="text-leaf-600" />
        </span>
        <p className="mt-4 font-display text-xl font-bold text-gray-900">
          {ui.leadForm.successTitle}
        </p>
        <p className="mt-1 text-sm text-gray-600">{ui.leadForm.successText}</p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn("relative space-y-4", className)}
      aria-busy={submitting || undefined}
    >
      <div>
        <label htmlFor={ids.name} className={labelClass}>
          {ui.leadForm.name}
        </label>
        <input
          id={ids.name}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          className={inputClass}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
        />
        <FieldError id={`${ids.name}-erro`} message={errors.name} />
      </div>

      <div>
        <label htmlFor={ids.email} className={labelClass}>
          {ui.leadForm.email}
        </label>
        <input
          id={ids.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={120}
          className={inputClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
        />
        <FieldError id={`${ids.email}-erro`} message={errors.email} />
      </div>

      <div>
        <label htmlFor={ids.whatsapp} className={labelClass}>
          {ui.leadForm.whatsapp}
        </label>
        <input
          id={ids.whatsapp}
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder={ui.leadForm.whatsappPlaceholder}
          className={inputClass}
          aria-invalid={errors.whatsapp ? true : undefined}
          aria-describedby={describedBy("whatsapp")}
        />
        <FieldError id={`${ids.whatsapp}-erro`} message={errors.whatsapp} />
      </div>

      <div>
        <label htmlFor={ids.plan} className={labelClass}>
          {ui.leadForm.plan}
        </label>
        <select
          id={ids.plan}
          name="plan"
          defaultValue={defaultPlan}
          className={cn(inputClass, "appearance-auto")}
          aria-invalid={errors.plan ? true : undefined}
          aria-describedby={describedBy("plan")}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        <FieldError id={`${ids.plan}-erro`} message={errors.plan} />
      </div>

      <div>
        <div className="flex items-start gap-3 py-1.5">
          <input
            id={ids.consent}
            name="consent"
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-berry-600"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy("consent")}
          />
          <label
            htmlFor={ids.consent}
            className="cursor-pointer text-sm leading-snug text-gray-700"
          >
            <ConsentLabel />
          </label>
        </div>
        <FieldError id={`${ids.consent}-erro`} message={errors.consent} />
      </div>

      {/* Honeypot: humanos nao veem nem preenchem; a rota finge sucesso se vier preenchido. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={ids.website}>
          Site
          <input id={ids.website} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && formError ? (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-gray-900">
          <AlertCircle
            size={16}
            aria-hidden="true"
            focusable="false"
            className="shrink-0 text-critical-500"
          />
          {formError}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting}>
        {submitting ? ui.leadForm.sending : ui.leadForm.submit}
      </Button>
    </form>
  );
}
