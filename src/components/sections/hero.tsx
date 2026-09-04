import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatBRL, hero, heroDynamic, plans } from "@/content/site";
import { HeroMarquee } from "./hero-marquee";
import { HeroNetwork } from "./hero-network";
import { RotatingWord } from "./hero-rotating";

/*
  Hero v3 "Constelacao de cuidado" (docs/design-brief-v3-hero.md, secao 7). Bloco plum inserido
  com margem (a aplicacao principal da marca), coluna de texto a esquerda e a Trilha da Amora em
  grande escala a direita, com fotos dentro dos nos. Server Component: o h1 e todo o texto saem
  prontos do servidor (o h1 e o LCP); so a rede (HeroNetwork) e a segunda linha do titulo
  (RotatingWord) sao cliente.

  O h1 tem duas linhas visiveis (heroDynamic.titleStatic e a frase que alterna), ambas
  aria-hidden, e a frase completa (hero.title) em sr-only para leitores de tela.

  Medidas (7.2): pt = altura real do header fixo (64 / 96 / 104 px) + 16 px; em lg o bloco fecha
  na dobra (100svh menos pt e pb) e a linha da faixa vai para o rodape do bloco. A rede sangra 6 %
  para a direita, dentro do padding do bloco; overflow-hidden no bloco e overflow-x-clip na
  section garantem zero rolagem horizontal.
*/

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";

// Peso 700 (specimen do manual). Tamanhos escolhidos para "Consultas medicas" caber em uma linha
// na coluna de 6/12 em cada breakpoint (7.9): 40 / 52 / 44 / 56 / 68 px (lg e xl recuaram um passo: em 1024 e 1280 "Consultas medicas" quebrava).
const H1_CLASSES =
  "mt-4 font-display font-bold tracking-[-0.03em] leading-[1.02] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[2.75rem] xl:text-[3.5rem] 2xl:text-[4.25rem]";

// O anel de foco global (berry-500/50) some sobre plum; aqui ele e branco.
const CTA_CLASSES = "w-full focus-visible:outline-white/70 sm:w-auto";

// Colofao: rotulo de sistema do manual (mono, caixa alta), separado por "·" via CSS content,
// que nao entra na leitura. Sem Badge, sem ponto colorido.
const COLOPHON_CLASSES =
  "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-berry-200 [&>li+li]:before:mr-3 [&>li+li]:before:text-berry-400 [&>li+li]:before:content-['·']";

// Rede: no mobile centrada e ate 420 px; em lg sai do fluxo, centrada na vertical, mede
// min(44vw, 620px) e sangra 6 % para a direita (cai no padding do bloco).
const NETWORK_CLASSES =
  "relative mx-auto aspect-square w-full max-w-[420px] lg:absolute lg:top-1/2 lg:right-[-6%] lg:w-[min(44vw,620px)] lg:max-w-none lg:-translate-y-1/2 2xl:w-[680px]";

function PriceLine() {
  const [before = "", after = ""] = hero.priceLine.split("{price}");
  return (
    <p className="mt-3 font-display text-base font-semibold text-white">
      {before}
      <span className="font-mono text-berry-200 tabular-nums">
        {formatBRL(plans[0].priceCents)}
      </span>
      {after}
    </p>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]"
    >
      <div
        data-hero-block=""
        className={`relative isolate overflow-hidden rounded-3xl text-white ${PLUM_GRADIENT}`}
      >
        {/*
          grid-cols-[minmax(0,1fr)] no mobile: sem ele a coluna implicita (auto) cresce ate o
          max-content da faixa de especialidades (~3900 px) e o bloco inteiro vaza na horizontal.
        */}
        <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pt-10 pb-8 sm:px-10 sm:pt-14 lg:min-h-[calc(100svh-8.25rem)] lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-8 lg:px-14 lg:py-12 xl:px-20">
          <div data-hero-copy="" className="relative z-10 lg:col-span-6">
            <p className="eyebrow text-berry-300">{hero.eyebrow}</p>
            <h1 id="inicio-titulo" className={H1_CLASSES}>
              <span className="sr-only">{hero.title}</span>
              <span aria-hidden="true" className="block">
                {heroDynamic.titleStatic}
              </span>
              <RotatingWord tone="plum" />
            </h1>
            <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-berry-100 sm:text-lg 2xl:text-xl">
              {hero.lead}
            </p>
            <PriceLine />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

            <p className="mt-5 flex max-w-[34rem] items-start gap-2 text-sm leading-relaxed text-berry-100/85">
              <Icon name="shield-check" size={18} className="mt-0.5 shrink-0 text-leaf-300" />
              {hero.trust}
            </p>
          </div>

          <div className="relative lg:col-span-6 lg:min-h-[560px]">
            <HeroNetwork className={NETWORK_CLASSES} />
          </div>

          {/* Linha da faixa: colofao a esquerda e especialidades ocupando o resto (lg+). */}
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-12 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-8">
            <ul
              data-hero-colophon=""
              aria-label="Resumo da assinatura"
              className={COLOPHON_CLASSES}
            >
              {hero.proofChips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
            <HeroMarquee tone="plum" speed={64} className="min-w-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
