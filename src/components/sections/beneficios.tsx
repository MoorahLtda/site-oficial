import dynamic from "next/dynamic";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cardSection, plans } from "@/content/site";

/*
  Cartao + Beneficios fundidos em um unico bloco plum (brief v4-secoes, 3.2 e 4.4).
  Casca server: heading (eyebrow "Cartao Moorah", h2 "Um numero. Todos os beneficios." e o
  paragrafo do cartao) e a lista tipografica de quatro beneficios saem no HTML do servidor.
  O palco do cartao (segmented control, digitos, tilt) e o cliente card-stage.tsx, carregado
  por next/dynamic com skeleton na mesma celula do grid.

  Grid lg de tres filhos: heading (col 1-5, linha 1), palco (col 6-12, row-span-2), lista
  (col 1-5, linha 2). No mobile o DOM ja e a ordem visual: heading, cartao, lista.
*/

const TITLE_ID = "beneficios-titulo";

// Mesma celula do grid para o palco e para o skeleton (o loading do dynamic nao recebe props).
const STAGE_CLASS = "lg:col-span-7 lg:row-span-2 lg:self-center";

const CardStage = dynamic(() => import("./card-stage").then((mod) => mod.CardStage), {
  loading: () => <CardStageSkeleton />,
});

// Reserva o espaco da coluna do cartao enquanto o chunk carrega (evita CLS).
function CardStageSkeleton() {
  return (
    <div aria-hidden="true" className={`flex w-full flex-col items-center gap-8 ${STAGE_CLASS}`}>
      <div className="skeleton h-[114px] w-full max-w-md rounded-2xl opacity-20 sm:h-[52px] sm:rounded-full" />
      <div className="skeleton aspect-[1400/933] w-full max-w-[560px] rounded-xl opacity-20" />
      <div className="skeleton h-5 w-64 opacity-20" />
    </div>
  );
}

export function Beneficios() {
  return (
    <Section
      id="beneficios"
      surface="plum"
      aria-labelledby={TITLE_ID}
      innerClassName="grid gap-y-12 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:items-start"
    >
      <div className="lg:col-span-5">
        <SectionHeading
          id={TITLE_ID}
          tone="plum"
          eyebrow={cardSection.eyebrow}
          title={cardSection.title}
          description={cardSection.lead}
        />
      </div>

      <CardStage className={STAGE_CLASS} note={plans[1].features[1]} />

      <ul className="space-y-7 lg:col-span-5">
        {cardSection.benefits.map((benefit) => (
          <li key={benefit.title}>
            <h3 className="font-display text-lg font-semibold leading-snug text-white">
              {benefit.title}
            </h3>
            <p className="mt-1 text-[15px] leading-relaxed text-berry-100">{benefit.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
