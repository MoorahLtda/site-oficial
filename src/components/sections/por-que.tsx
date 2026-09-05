import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { manifesto, photos, problems, problemsSection } from "@/content/site";
import { ConvergenceTrail } from "./convergence-trail";

/*
  Secao "Por que a Moorah / Tudo em um lugar" (docs/design-brief.md, 5.4). Superficie soft.
  Bloco 1: titulo a esquerda e a lista ordenada dos tres problemas a direita, com indice numerado em display.
  Bloco 2: manifesto centrado e a trilha de convergencia (cinco nos para um hub).
  Server Component: so recebe dados de site.ts; a animacao vive em Reveal* e ConvergenceTrail.
  A foto da consulta em casa (brief v2, item 1) fica sob o titulo, ao lado da lista: cabe em
  360 px porque o card para em max-w-xs (320 px).
*/

const TITLE_ID = "por-que-titulo";

// Legenda da foto: microcopy de interface (o brief v2 pede esta frase na legenda).
const PHOTO_CAPTION = "Consulta em casa";
// O card nunca passa de 320 px, no mobile e no desktop.
const PHOTO_SIZES = "(min-width: 640px) 320px, 88vw";

export function PorQue() {
  return (
    <Section id="por-que" surface="soft" aria-labelledby={TITLE_ID}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id={TITLE_ID}
            eyebrow={problemsSection.eyebrow}
            title={problemsSection.title}
          />

          <figure className="group relative mt-10 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl ring-1 ring-black/5">
            <Image
              src={photos.pacienteCama.src}
              width={photos.pacienteCama.width}
              height={photos.pacienteCama.height}
              alt={photos.pacienteCama.alt}
              sizes={PHOTO_SIZES}
              className="h-full w-full object-cover object-[50%_45%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(31_11_32/0.75),transparent_55%)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              {PHOTO_CAPTION}
            </figcaption>
          </figure>
        </div>

        <RevealGroup
          as="ol"
          stagger={0.1}
          amount={0.2}
          className="border-gray-200 border-t divide-y divide-gray-200 lg:col-span-7 lg:border-t-0 lg:pt-2"
        >
          {problems.map((problem, index) => (
            <RevealItem
              key={problem.title}
              as="li"
              className="grid grid-cols-[3rem_1fr] gap-4 py-6 lg:py-7"
            >
              <span
                data-index=""
                aria-hidden="true"
                className="pt-1.5 font-display text-xs font-semibold tabular-nums text-gray-600"
              >
                {`0${index + 1}`}
              </span>
              <div>
                <h3 className="font-display font-semibold text-xl leading-snug text-gray-900 lg:text-[1.375rem]">
                  {problem.title}
                </h3>
                <p className="mt-1 max-w-prose text-base leading-relaxed text-gray-600">
                  {problem.text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div className="mt-20 lg:mt-24">
        <Reveal className="mx-auto max-w-[52rem] text-center">
          <p className="eyebrow">{manifesto.eyebrow}</p>
          <h3 className="mt-3 font-display font-bold tracking-tight text-3xl leading-[1.1] text-gray-900 sm:text-4xl lg:text-[2.75rem]">
            {manifesto.title}
          </h3>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            {manifesto.text}
          </p>
        </Reveal>
        {/* Fora do Reveal: a trilha tem o proprio gatilho (pathLength) e nao deve competir com o fade. */}
        <ConvergenceTrail className="mt-12 lg:mt-14" />
      </div>
    </Section>
  );
}
