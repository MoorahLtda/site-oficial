import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorks, photos, steps } from "@/content/site";

/*
  Secao "Como funciona" (docs/design-brief-v4-secoes.md, 4.2). Superficie light.
  Foto idosoTablet a esquerda em lg e lista vertical dos quatro passos a direita, como a
  lista da Kry: sem trilha, sem cometa, sem indices, sem mini UIs, sem borda entre passos.
  Grid de tres filhos com posicao explicita em lg para que em 360 o DOM ja seja a ordem
  visual pedida no checklist (h2 + lead, foto, lista). O <ol aria-label="Passos"> e estatico
  e cada li e um Reveal (as="li"), o que mantem ol > li valido e a cascata como unico
  movimento da secao; a foto nao anima.
*/

const TITLE_ID = "como-funciona-titulo";
// A foto ocupa 5 de 12 colunas em lg (cerca de 460 px no container).
const PHOTO_SIZES = "(min-width: 1024px) 460px, 92vw";

export function ComoFunciona() {
  return (
    <Section
      id="como-funciona"
      surface="light"
      aria-labelledby={TITLE_ID}
      innerClassName="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:items-center"
    >
      <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
        <SectionHeading id={TITLE_ID} title={howItWorks.title} description={howItWorks.lead} />
      </div>

      <div className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        {/*
          A origem e 3:2 deitada: o senhor esta na borda esquerda, em primeiro plano
          desfocado, e a medica so aparece dentro do tablet, ao centro. Um quadro 4:5
          mostra 53% da largura e nao cabem os dois (era o corte anterior, que deixava a
          secao com uma mesa sem ninguem). Em lg o quadro e quadrado, mostra 67% da largura
          e com object-left entram o senhor e o tablet inteiro, como manda o principio 1
          (uma pessoa em cena por bloco de foto). Em mobile o 4:3 mostra 89% e cabe tudo.
          Remedir se a foto trocar.
        */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-black/5 lg:aspect-square">
          <Image
            src={photos.idosoTablet.src}
            width={photos.idosoTablet.width}
            height={photos.idosoTablet.height}
            alt={photos.idosoTablet.alt}
            sizes={PHOTO_SIZES}
            className="h-full w-full object-cover object-left"
          />
        </div>
      </div>

      <ol
        aria-label="Passos"
        className="space-y-9 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:space-y-10"
      >
        {steps.map((step, index) => (
          <Reveal key={step.title} as="li" y={16} duration={450} delay={index * 0.1} amount={0.3}>
            <h3 className="font-display font-semibold text-xl leading-snug text-gray-900 lg:text-[1.375rem]">
              {step.title}
            </h3>
            <p className="mt-2 max-w-[36rem] text-base leading-relaxed text-gray-600">
              {step.text}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
