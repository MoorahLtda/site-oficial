import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { manifesto, photos, problems, problemsSection } from "@/content/site";

/*
  Secao "Por que a Moorah" (docs/design-brief-v4-secoes.md, 4.1). Superficie soft.
  Grid de tres filhos, nesta ordem no DOM: heading, figura (foto 4:5, duas linhas em lg)
  e a lista das tres dores. Em 360 o DOM ja e a ordem visual (titulo, pessoa, dores);
  em lg a figura ocupa a direita e heading + lista empilham na esquerda.
  Sem indices, sem hairline, sem legenda e sem nada sobre a fotografia (veto do cliente).
  Abaixo do grid, o manifesto vira declaracao tipografica em duas colunas.
  Unico movimento da secao: fade da foto ao entrar em vista; texto e lista estaticos.
*/

const TITLE_ID = "por-que-titulo";
// A figura ocupa 6 de 12 colunas em lg (cerca de 560 px no container).
const PHOTO_SIZES = "(min-width: 1024px) 560px, 92vw";

export function PorQue() {
  return (
    <Section id="por-que" surface="soft" aria-labelledby={TITLE_ID}>
      {/*
        grid-rows-[auto_1fr]: a figura ocupa as duas linhas e e mais alta que heading +
        lista, entao com linhas automaticas a sobra se divide entre as duas e o vao entre
        o h2 e a lista cresce com a largura (59 px em 1024, 151 px em 1440, sem que nada na
        copy mude). Com 1fr na segunda linha a sobra fica embaixo da lista e o respiro
        entre titulo e lista e o mesmo nas duas larguras.
      */}
      <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16">
        <div className="lg:col-span-6">
          <SectionHeading
            id={TITLE_ID}
            eyebrow={problemsSection.eyebrow}
            title={problemsSection.title}
          />
        </div>

        <figure className="lg:col-span-6 lg:row-span-2">
          <Reveal variant="fade" duration={700} amount={0.3}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-black/5">
              <Image
                src={photos.pessoaCasa.src}
                width={photos.pessoaCasa.width}
                height={photos.pessoaCasa.height}
                alt={photos.pessoaCasa.alt}
                sizes={PHOTO_SIZES}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </figure>

        <ol className="space-y-9 lg:col-span-6 lg:col-start-1">
          {problems.map((problem) => (
            <li key={problem.title}>
              <h3 className="font-display font-semibold text-xl leading-snug text-gray-900 lg:text-[1.375rem]">
                {problem.title}
              </h3>
              <p className="mt-2 max-w-[30rem] text-base leading-relaxed text-gray-600">
                {problem.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24 grid gap-6 lg:mt-28 lg:grid-cols-12 lg:gap-x-16 lg:items-end">
        <h3 className="font-display font-semibold text-3xl leading-[1.1] text-gray-900 sm:text-4xl lg:col-span-7 lg:text-[2.75rem]">
          {manifesto.title}
        </h3>
        <p className="text-lg leading-relaxed text-gray-600 sm:text-xl lg:col-span-5">
          {manifesto.text}
        </p>
      </div>
    </Section>
  );
}
