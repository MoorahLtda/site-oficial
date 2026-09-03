import dynamic from "next/dynamic";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits, cardSection, plans } from "@/content/site";

/*
  Cartao Moorah (brief 5.7): primeiro bloco plum inserido na pagina.
  Casca server. O palco (segmented control, cartao, digitos, tilt) e o cliente card-stage.tsx,
  carregado via next/dynamic com skeleton. O cabecalho e renderizado aqui, no servidor, e
  entregue pronto ao palco, que devolve as duas colunas do grid.

  Marca (brief v2, item 2): o bloco abre com o lockup branco pequeno no canto superior esquerdo,
  em uma faixa propria acima do eyebrow. Fica fora do CardStage de proposito: assim a marca chega
  no HTML do servidor, sem esperar o chunk cliente do palco.
*/

const HEADING_ID = "cartao-title";

const CardStage = dynamic(() => import("./card-stage").then((mod) => mod.CardStage), {
  loading: () => <CardStageSkeleton />,
});

// Reserva o espaco das duas colunas enquanto o palco carrega (evita CLS).
function CardStageSkeleton() {
  return (
    <>
      <div aria-hidden="true" className="lg:col-span-5">
        <div className="skeleton h-4 w-32 opacity-20" />
        <div className="skeleton mt-4 h-12 w-full max-w-md opacity-20" />
        <div className="skeleton mt-5 h-20 w-full max-w-lg opacity-20" />
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="skeleton h-6 opacity-20" />
          <div className="skeleton h-6 opacity-20" />
          <div className="skeleton h-6 opacity-20" />
          <div className="skeleton h-6 opacity-20" />
        </div>
      </div>
      <div aria-hidden="true" className="flex flex-col items-center gap-8 lg:col-span-7">
        <div className="skeleton h-[52px] w-full max-w-md rounded-full opacity-20 lg:w-96" />
        <div className="skeleton aspect-[1400/933] w-full max-w-[560px] rounded-xl opacity-20" />
      </div>
    </>
  );
}

export function Cartao() {
  return (
    <Section
      id="cartao"
      surface="plum"
      aria-labelledby={HEADING_ID}
      innerClassName="grid items-center gap-x-12 gap-y-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12"
    >
      <Reveal variant="fade" duration={500} amount={0.4} className="lg:col-span-12">
        <BrandLockup tone="white" className="opacity-90" />
      </Reveal>

      <CardStage
        heading={
          <Reveal amount={0.3}>
            <SectionHeading
              id={HEADING_ID}
              tone="plum"
              eyebrow={cardSection.eyebrow}
              title={cardSection.title}
              description={benefits[0].text}
            />
          </Reveal>
        }
        uses={cardSection.uses}
        note={plans[1].features[1]}
      />
    </Section>
  );
}
