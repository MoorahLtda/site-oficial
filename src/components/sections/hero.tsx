import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fillPlanTokens, hero, photos } from "@/content/site";

/*
  Hero v4 "Em casa, com medico" (docs/design-brief-v4-hero.md, secao 2). Bloco plum inserido com
  margem (aplicacao principal da marca) e, dentro dele, uma pessoa em casa com o celular ocupando
  a direita do cartao, dissolvida no gradiente por mask-image: onde a mascara e transparente o que
  aparece e o gradiente do bloco, nao uma cor pintada por cima. Texto so sobre o plum liso; no pe
  do cartao, tres fatos em texto. Server Component: zero JS proprio, um so movimento (fade da foto
  em keyframe CSS, `animate-hero-photo-in` em globals.css), nenhum rotulo mono.

  Mobile (< lg): a camada da foto tem altura fixa e a mascara vertical chega a transparente em
  --hero-fade; um espacador da mesma altura empurra a copy para baixo dela. Por construcao o texto
  nunca encosta na pessoa. lg+: camada absoluta nos 84 % da direita, mascara horizontal, copy
  centrada na linha 1 da grade e fatos na linha 2.

  overflow-hidden no bloco e overflow-x-clip na section: zero rolagem horizontal. O pt da section e
  a altura real do header fixo (64 / 96 / 104 px) + 16 px.
*/

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";
const PHOTO = photos.heroCasa;

// O anel de foco global (berry-500/50) some sobre plum; aqui ele e branco.
const CTA_CLASSES = "w-full focus-visible:outline-white/70 sm:w-auto";

// Bloco: grade de uma coluna; em lg, duas linhas (copy centrada, fatos no pe) e altura da dobra.
const BLOCK_CLASSES =
  "relative isolate grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl text-white [--hero-fade:280px] sm:[--hero-fade:380px] lg:min-h-[calc(100svh-8.25rem)] lg:max-h-[880px] lg:grid-rows-[1fr_auto]";

/*
  Camada da foto. Mobile: faixa de 440 px (560 em sm) colada no topo, mascara vertical opaca ate
  --hero-fade - 80px e transparente em --hero-fade (o sublinhado vira espaco no valor arbitrario,
  e o calc precisa dos espacos em volta do sinal). lg+: 84 % da direita, mascara horizontal
  transparente ate 31 % da camada (42 % do bloco), alfa 0,1 em 43 %, 0,55 em 57 %, 0,9 em 71 %,
  opaca de 83 % em diante. Em lg (1024 a 1279) a camada sangra 10 % para fora do bloco, cortando o
  canto da varanda, para o pixel a direita da copy ja ser plum liso (alfa da mascara < 0,07 na borda
  do texto, medido em 1024x768); em xl volta a right-0.
*/
const PHOTO_LAYER_CLASSES =
  "pointer-events-none absolute inset-x-0 top-0 isolate h-[440px] animate-hero-photo-in [mask-image:linear-gradient(180deg,#000_calc(var(--hero-fade)_-_80px),transparent_var(--hero-fade))] sm:h-[560px] lg:inset-y-0 lg:right-[-10%] lg:left-auto lg:h-auto lg:w-[84%] lg:[mask-image:linear-gradient(90deg,transparent_31%,rgb(0_0_0/0.1)_43%,rgb(0_0_0/0.55)_57%,rgb(0_0_0/0.9)_71%,#000_83%)] xl:right-0";

// 40 / 52 / 48 / 56 / 64 px. O brief pedia 60 px em 1440, mas "Um médico por vídeo," a 60 px mede
// 611 px e a coluna de texto em xl tem 608 px: quebrava em quatro linhas. Fica 56 ate 2xl.
const H1_CLASSES =
  "font-display font-semibold tracking-[-0.02em] leading-[1.04] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4rem]";

const BODY_CLASSES =
  "max-w-[30rem] text-[15px] leading-[1.55] sm:text-base sm:leading-relaxed lg:max-w-[28rem] lg:text-lg xl:max-w-[32rem]";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]"
    >
      <div data-hero-block="" className={`${BLOCK_CLASSES} ${PLUM_GRADIENT}`}>
        <div data-hero-photo="" className={PHOTO_LAYER_CLASSES}>
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            priority
            // Next 16 nao deriva fetchPriority de `priority`; a foto e o LCP em desktop.
            fetchPriority="high"
            sizes="(min-width: 1024px) 84vw, 100vw"
            className="object-cover object-[72%_0%] saturate-[.92] lg:object-[100%_42%]"
          />
          {/* Tingimento: o isolate da camada faz o multiply agir so sobre a foto. */}
          <span aria-hidden="true" className="absolute inset-0 bg-ink/25 mix-blend-multiply" />
          {/* Sombra do pe (lg+): os fatos leem sobre o sofa. Dentro da camada, entao tambem mascarada. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 hidden h-[40%] bg-[linear-gradient(0deg,rgb(31_11_32/0.75),rgb(31_11_32/0.25)_55%,transparent)] lg:block"
          />
        </div>

        {/* Respiro da foto no mobile: mesma altura em que a mascara chega a transparente. */}
        <div aria-hidden="true" data-hero-spacer="" className="h-(--hero-fade) lg:hidden" />

        <div
          data-hero-copy=""
          className="relative z-10 px-5 pb-7 sm:px-10 sm:pb-8 lg:max-w-[calc(32rem+3.5rem)] lg:self-center lg:py-14 lg:pr-0 lg:pl-14 xl:max-w-[calc(38rem+4.5rem)] xl:pl-[4.5rem] 2xl:max-w-[calc(42rem+5rem)] 2xl:pl-20"
        >
          <h1 id="inicio-titulo" className={H1_CLASSES}>
            <span className="font-semibold sm:block">{hero.titleLines[0]}</span>{" "}
            <span className="font-bold text-berry-100 sm:block">{hero.titleLines[1]}</span>
          </h1>
          <p className={`mt-4 text-berry-100 lg:mt-5 ${BODY_CLASSES}`}>{hero.lead}</p>
          <p data-hero-price="" className={`mt-2.5 ${BODY_CLASSES}`}>
            <strong className="font-bold text-white">{fillPlanTokens(hero.prices)}</strong>{" "}
            <span className="text-berry-100">{hero.priceNote}</span>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-7">
            <Button variant="plum" size="lg" asChild className={CTA_CLASSES}>
              <a href="#planos">{hero.primaryCta}</a>
            </Button>
            <Button variant="outline-light" size="lg" asChild className={CTA_CLASSES}>
              <a href="#como-funciona">
                {hero.secondaryCta}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <ul
          data-hero-facts=""
          aria-label="Resumo da assinatura"
          className="relative z-10 grid gap-y-3.5 px-5 pt-1 pb-7 sm:grid-cols-3 sm:gap-x-8 sm:px-10 sm:pb-8 lg:flex lg:max-w-[42rem] lg:gap-x-10 lg:px-14 lg:pt-0 lg:pb-11 xl:px-[4.5rem] xl:pb-12 2xl:px-20 2xl:pb-[3.25rem]"
        >
          {hero.facts.map((fact) => (
            <li key={fact.value} className="flex flex-col gap-0.5">
              {/* Em lg o valor fica em uma linha e a legenda quebra; a lista cabe em 42rem. */}
              <b className="font-display text-[17px] font-semibold tracking-[-0.01em] text-white lg:whitespace-nowrap lg:text-lg">
                {fact.value}
              </b>
              <span className="text-[13px] font-medium text-berry-200">{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
