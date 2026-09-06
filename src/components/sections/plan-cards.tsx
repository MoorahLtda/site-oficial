import { Check } from "lucide-react";
import { LeadDialogButton } from "@/components/ui/lead-dialog";
import { formatBRL, getPlan, type Plan, perPersonCents, plans, plansSection } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Os dois cards de plano (brief v4-secoes, 4.5). Server component: preco e botao saem no HTML
  inicial, sem m.* e sem opacity 0 (criterio 7); so o LeadDialogButton e cliente. O destaque do
  Familiar e o anel berry, o preco 4 px maior e o botao primario; nunca fundo escuro nem badge.
*/

// "equivale a {price} por pessoa" quebrado em volta do valor, que ganha peso proprio.
const [PER_PERSON_BEFORE = "", PER_PERSON_AFTER = ""] =
  plansSection.perPersonLabel.split("{price}");
const FAMILIAR_PER_PERSON = formatBRL(perPersonCents(getPlan("familiar")));

function PlanCard({ plan }: { plan: Plan }) {
  const nameId = `plano-${plan.id}-nome`;
  return (
    <article
      aria-labelledby={nameId}
      data-plan={plan.id}
      className={cn(
        "flex flex-col rounded-3xl bg-white p-8 lg:p-10",
        plan.highlight
          ? "order-first shadow-deep ring-2 ring-berry-600 lg:order-last"
          : "border border-gray-200 shadow-card",
      )}
    >
      <h3 id={nameId} className="font-display text-2xl font-semibold leading-tight text-gray-900">
        {plan.name}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-gray-600">{plan.headline}</p>
      <p className="mt-6 flex items-end gap-1">
        <span
          className={cn(
            "font-display text-5xl font-bold leading-none tabular-nums text-gray-900",
            plan.highlight && "lg:text-[3.75rem]",
          )}
        >
          {formatBRL(plan.priceCents)}
        </span>
        <span className="pb-1 text-base text-gray-600">/mês</span>
      </p>
      {plan.highlight ? (
        <p className="mt-2 font-display text-sm text-gray-600 tabular-nums">
          {PER_PERSON_BEFORE}
          <span className="font-semibold text-gray-900">{FAMILIAR_PER_PERSON}</span>
          {PER_PERSON_AFTER}
        </p>
      ) : null}
      <p className={cn("text-sm text-gray-600", plan.highlight ? "mt-1" : "mt-2")}>
        {plan.peopleLabel}
      </p>
      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[15px] leading-snug text-gray-700">
            <Check
              size={18}
              aria-hidden="true"
              focusable="false"
              className="mt-0.5 shrink-0 text-leaf-500"
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
        variant={plan.highlight ? "primary" : "secondary"}
      />
      {plan.highlight ? (
        <p className="mt-3 text-center text-xs text-gray-600">{plansSection.familyNote}</p>
      ) : null}
    </article>
  );
}

// Individual a esquerda e Familiar a direita no desktop; no mobile o Familiar vem primeiro
// (order-first no card em destaque). O grid de duas colunas vive em planos.tsx.
export function PlanCards() {
  return (
    <>
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </>
  );
}
