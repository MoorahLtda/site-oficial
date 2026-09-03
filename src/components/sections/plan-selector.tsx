"use client";

import { Check } from "lucide-react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LeadDialogButton } from "@/components/ui/lead-dialog";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  formatBRL,
  getPlan,
  type Plan,
  type PlanId,
  perPersonCents,
  plans,
  plansSection,
} from "@/content/site";
import { cn } from "@/lib/utils";

const individual = getPlan("individual");
const familiar = getPlan("familiar");

// Opcoes "1" a "4", derivadas da lotacao do Familiar (nunca numero solto no componente).
const peopleOptions = Array.from({ length: familiar.people }, (_, i) => {
  const value = String(i + 1);
  return { value, label: value };
});

// Forma falada do valor, para a regiao aria-live. Evita repetir os digitos visiveis
// (o leitor de tela ouve "24 reais e 48 centavos" em vez do simbolo R$).
function spokenBRL(cents: number): string {
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  const reaisText = `${reais} ${reais === 1 ? "real" : "reais"}`;
  if (centavos === 0) return reaisText;
  return `${reaisText} e ${centavos} ${centavos === 1 ? "centavo" : "centavos"}`;
}

interface PerPersonCounterProps {
  cents: number;
  reduced: boolean;
}

// Contador do valor por pessoa: spring de 90/20 sobre o valor em centavos, formatado a cada frame.
// Sob reduced-motion renderiza o valor final direto (mesmo HTML do servidor).
function PerPersonCounter({ cents, reduced }: PerPersonCounterProps) {
  const mv = useMotionValue(cents);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (v) => formatBRL(Math.round(v)));

  useEffect(() => {
    mv.set(cents);
  }, [mv, cents]);

  if (reduced) {
    return <span className="font-semibold text-white tabular-nums">{formatBRL(cents)}</span>;
  }
  return <m.span className="font-semibold text-white tabular-nums">{text}</m.span>;
}

interface PeopleNodesProps {
  lit: number;
  total: number;
  plum: boolean;
}

// Cores da trilha de nos por superficie: [no aceso, trilha acesa, apagado].
const nodeTone = {
  plum: { node: "bg-berry-300", trail: "bg-berry-300", off: "bg-white/15" },
  light: { node: "bg-berry-500", trail: "bg-berry-300", off: "bg-gray-200" },
} as const;

// Trilha de nos: um por pessoa coberta. Acende conforme a escolha do seletor (so CSS).
function PeopleNodes({ lit, total, plum }: PeopleNodesProps) {
  const tone = plum ? nodeTone.plum : nodeTone.light;
  const slots = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <span aria-hidden="true" className="mt-4 flex items-center gap-1.5">
      {slots.map((slot) => {
        const on = slot <= lit;
        return (
          <span key={slot} className="flex items-center gap-1.5">
            {slot > 1 ? (
              <span
                className={cn(
                  "h-px w-3 transition-colors duration-300 ease-out-expo",
                  on ? tone.trail : tone.off,
                )}
              />
            ) : null}
            <span
              className={cn(
                "block h-2 w-2 rounded-full transition-colors duration-300 ease-out-expo",
                on ? tone.node : tone.off,
              )}
            />
          </span>
        );
      })}
    </span>
  );
}

interface PlanCardProps {
  plan: Plan;
  active: boolean;
  people: number;
  perPersonLine: ReactNode;
}

function PlanCard({ plan, active, people, perPersonLine }: PlanCardProps) {
  const plum = plan.id === "familiar";
  const titleId = `plano-${plan.id}-nome`;

  return (
    <article
      aria-labelledby={titleId}
      data-plan={plan.id}
      data-active={active}
      className={cn(
        "relative flex w-full flex-col rounded-3xl p-8 transition-[box-shadow,transform,opacity] duration-300 ease-out-expo lg:p-10",
        "data-[active=true]:ring-2 data-[active=true]:ring-berry-500 data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-gray-50",
        "data-[active=false]:opacity-90",
        plum
          ? "bg-ink text-white shadow-deep lg:scale-[1.02]"
          : "border border-gray-200 bg-white shadow-card",
      )}
    >
      {plan.badge ? (
        <Badge tone="berry" className="absolute right-6 top-6 lg:right-8 lg:top-8">
          {plan.badge}
        </Badge>
      ) : null}

      <h3
        id={titleId}
        className={cn(
          "font-display text-sm font-bold uppercase tracking-[0.18em]",
          plum ? "text-berry-300" : "text-berry-600",
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "mt-3 max-w-[26ch] text-base leading-relaxed",
          plum ? "text-berry-100" : "text-gray-600",
        )}
      >
        {plan.headline}
      </p>

      <p className="mt-6 flex items-end gap-1">
        <span
          className={cn(
            "font-display font-extrabold tabular-nums leading-none text-5xl lg:text-[3.5rem]",
            plum ? "text-white" : "text-gray-900",
          )}
        >
          {formatBRL(plan.priceCents)}
        </span>
        <span className={cn("pb-1 text-base", plum ? "text-berry-200" : "text-gray-600")}>
          /mês
        </span>
      </p>

      <p
        className={cn("mt-2 min-h-5 font-mono text-sm", plum ? "text-berry-100" : "text-gray-600")}
      >
        {perPersonLine}
      </p>
      <p className={cn("mt-1 text-sm", plum ? "text-berry-200" : "text-gray-600")}>
        {plan.peopleLabel}
      </p>

      <PeopleNodes lit={plum ? people : 1} total={familiar.people} plum={plum} />

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex gap-3 text-[15px] leading-snug",
              plum ? "text-berry-100" : "text-gray-700",
            )}
          >
            <Check
              size={18}
              aria-hidden="true"
              className={cn("mt-0.5 shrink-0", plum ? "text-leaf-300" : "text-leaf-500")}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <LeadDialogButton
        plan={plan.id}
        size="lg"
        fullWidth
        className="mt-8"
        variant={plum ? "plum" : "primary"}
      />
      {plum ? (
        <p className="mt-3 text-center text-xs text-berry-200">{plansSection.familyNote}</p>
      ) : null}
    </article>
  );
}

// Seletor de pessoas e os dois cards. `people` vai de 1 ao limite do Familiar; com 1 pessoa o
// Individual e o plano ativo, do contrario o Familiar. Toda a aritmetica sai de site.ts.
export function PlanSelector() {
  const reduced = useReducedMotion() ?? false;
  const [people, setPeople] = useState<number>(familiar.people);
  const active: PlanId = people === 1 ? "individual" : "familiar";
  const familiarPerPerson = perPersonCents({ priceCents: familiar.priceCents, people });

  const [before, after] = plansSection.perPersonLabel.split("{price}");
  const familiarLine =
    people === 1 ? (
      <span className="text-berry-100">{plansSection.singleHint}</span>
    ) : (
      <>
        {before}
        <PerPersonCounter cents={familiarPerPerson} reduced={reduced} />
        {after}
      </>
    );

  const announcement =
    people === 1
      ? `Para 1 pessoa, o plano indicado é o ${individual.name}, ${spokenBRL(individual.priceCents)} por mês.`
      : `Para ${people} pessoas, o ${familiar.name} equivale a ${spokenBRL(familiarPerPerson)} por pessoa.`;

  return (
    <div className="mt-10">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
        <p className="font-display text-base font-semibold text-gray-900">
          {plansSection.peopleQuestion}
        </p>
        <div className="w-full sm:w-auto sm:min-w-[20rem]">
          <SegmentedControl
            options={peopleOptions}
            value={String(people)}
            onValueChange={(value) => setPeople(Number(value))}
            label={plansSection.peopleQuestion}
            size="lg"
          />
        </div>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>

      <RevealGroup
        stagger={0.12}
        amount={0.2}
        className="mx-auto mt-10 grid max-w-[960px] gap-6 lg:grid-cols-2 lg:items-stretch"
      >
        {plans.map((plan) => (
          <RevealItem
            key={plan.id}
            y={24}
            duration={600}
            className={cn("flex", plan.id === "familiar" && "order-first lg:order-last")}
          >
            <PlanCard
              plan={plan}
              active={plan.id === active}
              people={people}
              perPersonLine={plan.id === "familiar" ? familiarLine : plansSection.coversOne}
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
