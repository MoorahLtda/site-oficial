import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { formatBRL, hero, heroDynamic, plans } from "@/content/site";
import { HeroMarquee } from "./hero-marquee";
import { RotatingWord } from "./hero-rotating";
import { HeroStage } from "./hero-stage";

/*
  Hero "Trilha da Amora" (docs/design-brief.md 5.3 e docs/design-brief-v2.md 3). Server
  Component: o texto e o LCP e sai pronto do servidor, sem animacao de entrada. So o palco
  (HeroStage) e a segunda linha do titulo (RotatingWord) sao cliente.

  O h1 tem duas linhas visiveis (heroDynamic.titleStatic e a frase que alterna), ambas
  aria-hidden, e a frase completa (hero.title) em sr-only para leitores de tela.
*/

const H1_CLASSES =
  "mt-4 font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 text-balance";

// pt/pb repetidos por breakpoint porque o Section traz py-20 sm:py-24 lg:py-28 e o twMerge
// nao remove py-* quando chega so pt-*/pb-*; dentro do mesmo breakpoint pt/pb vencem o py.
// overflow-x-clip: a aureola (inset -14%) e os cards flutuantes sangram de proposito para fora do
// palco; sem o corte no limite da secao isso vira rolagem horizontal no mobile.
const SECTION_CLASSES =
  "flex min-h-[88svh] items-center overflow-x-clip pt-28 pb-16 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24";

function PriceLine() {
  const [before = "", after = ""] = hero.priceLine.split("{price}");
  return (
    <p className="mt-3 font-display text-base font-semibold text-gray-900">
      {before}
      <span className="font-mono">{formatBRL(plans[0].priceCents)}</span>
      {after}
    </p>
  );
}

export function Hero() {
  return (
    <Section
      id="inicio"
      surface="light"
      aria-labelledby="inicio-titulo"
      className={SECTION_CLASSES}
      innerClassName="grid items-center gap-12 lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-6">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-6 shrink-0 bg-berry-300" />
          {hero.eyebrow}
        </p>
        <h1 id="inicio-titulo" className={H1_CLASSES}>
          <span className="sr-only">{hero.title}</span>
          <span aria-hidden="true" className="block">
            {heroDynamic.titleStatic}
          </span>
          <RotatingWord />
        </h1>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-gray-600 sm:text-xl">
          {hero.lead}
        </p>
        <PriceLine />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg" asChild className="w-full sm:w-auto">
            <a href="#planos">{hero.primaryCta}</a>
          </Button>
          <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
            <a href="#como-funciona">
              {hero.secondaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </Button>
        </div>

        <p className="mt-6 flex max-w-[34rem] items-start gap-2 text-sm text-gray-600">
          <Icon name="shield-check" size={18} className="mt-0.5 shrink-0 text-berry-600" />
          {hero.trust}
        </p>
      </div>

      <div className="relative lg:col-span-6">
        <HeroStage />
      </div>

      {/* mt pequeno porque o gap da grade (48 px / 32 px em lg) ja separa; total de 56 px. */}
      <ul
        aria-label="Resumo da assinatura"
        className="mt-2 flex flex-wrap gap-2 lg:col-span-12 lg:mt-6"
      >
        {hero.proofChips.map((chip) => (
          <li key={chip}>
            <Badge
              tone="neutral"
              size="md"
              icon={<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-berry-500" />}
            >
              {chip}
            </Badge>
          </li>
        ))}
      </ul>

      {/* Faixa continua de especialidades, fechando o hero (brief v2, item 3). */}
      <HeroMarquee className="mt-2 lg:col-span-12 lg:mt-4" />
    </Section>
  );
}
