import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fillPlanTokens, type HeroBulletSegment, hero, photos } from "@/content/site";

/*
  Hero variante "Sala de casa" (docs/design-brief-v4-hero.md, secao 3): direcao C corrigida,
  renderizada so em /previews/hero-alt para o cliente comparar com o hero principal. Duas colunas
  honestas dentro do mesmo bloco plum: a esquerda o mesmo h1 do principal, tres bullets (o primeiro
  com os dois precos de plans[]), os dois CTAs e uma microcopy; a direita a foto da familia em casa
  ocupando a altura inteira do bloco, sangrando na borda direita e cortada a esquerda por um arco
  (clip-path) fundido ao gradiente por mask-image. Fatos em texto no pe da coluna.

  Server Component: nenhum hook, nenhum byte de JS proprio. O unico movimento e o fade da foto em
  CSS (animate-hero-photo-in, globals.css), que reduced motion zera pela regra global. Nada fica
  sobre a foto: nem texto, nem chip, nem card, nem simbolo.
*/

export interface HeroAltProps {
  // "/" na pagina de preview, para os CTAs levarem as ancoras da home.
  linkPrefix?: string;
}

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";
const PHOTO = photos.heroFamilia;

// O anel de foco global (berry-500/50) some sobre plum; aqui ele e branco.
const CTA_CLASSES = "w-full focus-visible:outline-white/70 sm:w-auto";

// Variante: 40 / 52 / 40 (lg) / 46 (xl) / 52 (2xl). Linha 1 em 600 branco, linha 2 em 700 berry-100.
const H1_CLASSES =
  "font-display font-semibold tracking-[-0.02em] leading-[1.04] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[2.5rem] xl:text-[2.875rem] 2xl:text-[3.25rem]";

/*
  Camada da foto. Mobile: faixa 4:3 abaixo dos CTAs, arco largo no topo (elipse centrada na base)
  e mascara que dissolve os 16 % de cima no plum. lg+: colunas 7 a 12 (6 a 12 a partir de 1440 px), duas linhas
  da grade, arco vertical (elipse centrada na borda direita) recuando ~12 % da largura no meio da
  altura e ~20 % nos cantos; mascara dissolve os 18 % da esquerda. Onde clip e mascara abrem, o que
  aparece e o gradiente do bloco, nao uma cor pintada.
*/
const PHOTO_LAYER_CLASSES =
  "relative isolate aspect-[4/3] overflow-hidden animate-hero-photo-in [clip-path:ellipse(115%_100%_at_50%_100%)] [mask-image:linear-gradient(180deg,transparent,#000_16%)] min-[1024px]:col-span-6 min-[1024px]:col-start-7 min-[1440px]:col-span-7 min-[1440px]:col-start-6 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:[clip-path:ellipse(88%_118%_at_100%_50%)] lg:[mask-image:linear-gradient(90deg,transparent,#000_18%)]";

/*
  Colunas por largura: 6/12 + 6/12 de 1024 a 1439 px (em 1280 a coluna de 5/12 quebrava o h1 em
  quatro linhas) e 5/12 + 7/12 a partir de 1440 px. As duas larguras usam min-[...] porque o Tailwind
  emite os breakpoints arbitrarios antes de lg/xl: um lg:col-span-6 venceria o min-[1440px]:col-span-5.
*/

// Chave estavel de um bullet: o texto dos trechos concatenado (lista estatica de site.ts).
function bulletKey(segments: readonly HeroBulletSegment[]): string {
  return segments
    .map((segment) => (typeof segment === "string" ? segment : segment.strong))
    .join("");
}

export function HeroAlt({ linkPrefix = "" }: HeroAltProps) {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]"
    >
      <div
        data-hero-block=""
        data-hero-variant="alt"
        className={`relative isolate overflow-hidden rounded-3xl text-white ${PLUM_GRADIENT}`}
      >
        {/*
          grid-cols-[minmax(0,1fr)] no mobile: a coluna implicita (auto) cresceria ate o
          max-content do maior texto. Em lg: 12 colunas e duas linhas (copy / fatos), com a foto
          ocupando as duas linhas da direita.
        */}
        <div className="grid grid-cols-[minmax(0,1fr)] lg:min-h-[min(calc(100svh-8.25rem),880px)] lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_auto]">
          <div
            data-hero-copy=""
            className="relative z-10 px-5 pt-10 pb-8 sm:px-10 sm:pt-14 min-[1024px]:col-span-6 min-[1440px]:col-span-5 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:py-10 lg:pr-4 lg:pl-14 xl:py-14 xl:pl-20 [&>*]:max-w-[34rem]"
          >
            <h1 id="inicio-titulo" className={H1_CLASSES}>
              <span className="font-semibold sm:block">{hero.titleLines[0]}</span>{" "}
              {/* span, nao <b>: o contraste e visual e o leitor de tela nao muda a entonacao. */}
              <span className="font-bold text-berry-100 sm:block">{hero.titleLines[1]}</span>
            </h1>

            <ul
              aria-label="O que está incluído"
              className="mt-7 grid gap-3 text-[17px] leading-[1.45] text-berry-100"
            >
              {hero.bullets.map((segments) => (
                <li key={bulletKey(segments)} className="flex gap-3">
                  <Check
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="mt-[3px] shrink-0 text-berry-300"
                  />
                  <span>
                    {segments.map((segment) =>
                      typeof segment === "string" ? (
                        fillPlanTokens(segment)
                      ) : (
                        // nowrap: "R$ 129,90" nunca quebra entre o simbolo e o valor.
                        <b key={segment.strong} className="font-bold text-white whitespace-nowrap">
                          {fillPlanTokens(segment.strong)}
                        </b>
                      ),
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="plum" size="lg" asChild className={CTA_CLASSES}>
                <a href={`${linkPrefix}#planos`}>{hero.primaryCta}</a>
              </Button>
              <Button variant="outline-light" size="lg" asChild className={CTA_CLASSES}>
                <a href={`${linkPrefix}#como-funciona`}>
                  {hero.secondaryCta}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </Button>
            </div>

            <p className="mt-[18px] text-[13px] leading-normal text-berry-100/80">{hero.micro}</p>
          </div>

          <div data-hero-photo="" className={PHOTO_LAYER_CLASSES}>
            <Image
              src={PHOTO.src}
              alt={PHOTO.alt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1440px) 58vw, (min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[42%_20%] lg:object-[40%_30%]"
            />
            {/* Tingimento leve: sombras puxam para o plum, pele continua pele. */}
            <span aria-hidden="true" className="absolute inset-0 bg-ink/12 mix-blend-multiply" />
          </div>

          <ul
            data-hero-facts=""
            aria-label="Resumo da assinatura"
            className="relative z-10 flex flex-wrap gap-x-6 gap-y-1.5 px-5 pt-5 pb-7 text-sm text-berry-100 sm:px-10 min-[1024px]:col-span-6 min-[1440px]:col-span-5 lg:col-start-1 lg:row-start-2 lg:pt-0 lg:pr-4 lg:pl-14 lg:pb-8 xl:pl-20 xl:pb-10"
          >
            {hero.facts.map((fact) => (
              <li key={fact.value}>
                <b className="font-display font-semibold text-white">{fact.value}</b>
                {/* "·" via CSS content: separador visual fora da leitura. */}
                <span className="before:mx-2 before:text-berry-300 before:content-['·']">
                  {fact.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
