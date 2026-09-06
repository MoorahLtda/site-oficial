import { Check, X } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { planNotes, plansSection } from "@/content/site";
import { PlanCards } from "./plan-cards";

const TITLE_ID = "planos-titulo";
const INCLUDED_ID = "planos-incluido";
const NOT_INCLUDED_ID = "planos-nao-incluido";

/*
  Secao Planos (brief v4-secoes, 4.5): heading centrado (a unica secao centrada da pagina),
  dois cards estaticos lado a lado, nota comercial com link para as duvidas e painel
  Incluido / Nao esta incluido sem caixa e sem hairline. Nenhum movimento de entrada:
  a secao de preco e a que mais perde se o preco demorar a aparecer.
*/
export function Planos() {
  return (
    <Section id="planos" surface="soft" aria-labelledby={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        align="center"
        eyebrow={plansSection.eyebrow}
        title={plansSection.title}
        description={plansSection.lead}
      />

      <div className="mx-auto mt-12 grid max-w-[960px] gap-6 lg:grid-cols-2 lg:items-stretch">
        <PlanCards />
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        {planNotes[0]}
        <a
          href="#duvidas"
          className="ml-1 font-semibold text-berry-700 underline underline-offset-4 transition-colors duration-200 hover:text-berry-800"
        >
          {plansSection.faqLink}
        </a>
      </p>

      <div className="mx-auto mt-20 grid max-w-[960px] gap-10 md:grid-cols-2">
        <div>
          <h3 id={INCLUDED_ID} className="font-display text-lg font-semibold text-gray-900">
            {plansSection.includedTitle}
          </h3>
          <ul aria-labelledby={INCLUDED_ID} className="mt-4 space-y-2.5">
            {plansSection.included.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-gray-700">
                <Check
                  size={18}
                  aria-hidden="true"
                  focusable="false"
                  className="mt-0.5 shrink-0 text-leaf-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 id={NOT_INCLUDED_ID} className="font-display text-lg font-semibold text-gray-900">
            {plansSection.notIncludedTitle}
          </h3>
          <ul aria-labelledby={NOT_INCLUDED_ID} className="mt-4 space-y-2.5">
            {plansSection.notIncluded.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-gray-700">
                <X
                  size={16}
                  aria-hidden="true"
                  focusable="false"
                  className="mt-1 shrink-0 text-gray-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
