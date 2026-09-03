"use client";

import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { TrailCluster } from "@/components/ui/trail-cluster";
import { type HeroMoment, hero, heroDynamic, photos } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Palco do hero (docs/design-brief.md 5.3 e docs/design-brief-v2.md 1, 2 e 3):
  foto do paciente como base, Trilha da Amora com cometas sobrepondo a foto com o simbolo da
  marca sobre o hub, halo em deriva lenta e tres cards de momentos que passam a mostrar os
  eventos do produto em rodizio. Tudo aqui e ilustracao: os cards sao aria-hidden e o conteudo
  real esta no texto do hero.

  Movimento continuo: `animate-float-slow` nos cards e `animate-drift` no halo (CSS, ja zerados
  pela media query de reduced motion) e um unico setInterval para o rodizio dos eventos, pausado
  com a aba escondida e desligado sob reduced motion.
*/

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

// Cards entram depois dos nos externos (1,2 s + 450 ms) e antes da confirmacao do no 0 (1,9 s).
const CARD_DELAYS = [1.4, 1.52, 1.64] as const;
const CARD_DURATION = 0.5;

// Deriva de cada card no float continuo, para nao subirem em bloco.
const FLOAT_DELAYS = ["0s", "1.2s", "2.4s"] as const;

// Posicoes A, B e C: duas a esquerda sobre a foto e uma abaixo do cluster, a direita.
const CARD_POSITIONS = [
  "top-[6%] left-[-6%]",
  "bottom-[6%] right-[-8%]",
  "top-[56%] left-[-8%]",
] as const;

const TONE_CLASSES: Record<HeroMoment["tone"], string> = {
  leaf: "bg-leaf-50 text-leaf-600",
  berry: "bg-berry-50 text-berry-600",
};

const CARD_CLASSES =
  "flex items-center gap-3 rounded-card border border-gray-200 bg-white px-4 py-3 shadow-float";

const DESKTOP_QUERY = "(min-width: 1024px)";

// Rodizio dos eventos: um evento por vez, em ordem, alternando entre os tres cards.
const EVENTS = heroDynamic.events;
const CARD_COUNT = hero.moments.length;
const EVENT_SWAP = 0.35;
const ACTIVE_MS = 1600;

// Fim da cascata das trilhas (outer trail: 1,0 s + 0,6 s + stagger); os cometas so entram
// depois disso, para nao correrem por uma trilha que ainda esta sendo desenhada.
const INTRO_DONE_MS = 2200;

const HERO_PHOTO = photos.heroPaciente;
const HERO_PHOTO_SIZES = "(min-width: 1024px) 440px, 80vw";

interface CardSlot {
  content: HeroMoment;
  key: string;
}

// Conteudo do card `cardIndex` no passo `step` (-1 = antes do primeiro evento).
function cardSlot(cardIndex: number, step: number): CardSlot {
  const last = step < 0 ? -1 : step - ((step - cardIndex + CARD_COUNT) % CARD_COUNT);
  if (last < 0) {
    return { content: hero.moments[cardIndex], key: `moment-${cardIndex}` };
  }
  const eventIndex = last % EVENTS.length;
  return { content: EVENTS[eventIndex], key: `event-${eventIndex}` };
}

function MomentContent({ moment }: { moment: HeroMoment }) {
  return (
    <>
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full",
          TONE_CLASSES[moment.tone],
        )}
      >
        <Icon name={moment.icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold text-gray-900">{moment.label}</span>
        <span className="block text-xs text-gray-600">{moment.text}</span>
      </span>
    </>
  );
}

export function HeroStage() {
  const ref = useRef<HTMLDivElement>(null);
  // null no servidor; so `true` desliga cascata, rodizio e parallax.
  const reduced = useReducedMotion() === true;

  // -1 = cards com os momentos estaticos de hero.moments (estado do servidor).
  const [step, setStep] = useState(-1);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Cometas so depois da cascata, e por efeito: o primeiro render do cliente tem de bater com o
  // HTML do servidor. Sob reduced motion nunca ligam (sem eles nao sobra tracejado parado).
  const [comets, setComets] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setComets(true), INTRO_DONE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  // Um unico intervalo: o primeiro evento cai em eventEveryMs (4,2 s), depois da intro (2,4 s).
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setStep((current) => current + 1);
    }, heroDynamic.eventEveryMs);
    return () => window.clearInterval(timer);
  }, [reduced]);

  // Evento com no acende a trilha correspondente por 1,6 s.
  useEffect(() => {
    if (step < 0) return;
    const node = EVENTS[step % EVENTS.length].node;
    if (node === null) {
      setActiveNode(null);
      return;
    }
    setActiveNode(node);
    const timer = window.setTimeout(() => setActiveNode(null), ACTIVE_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  // Parallax: 0 desliga (mobile, reduced motion, servidor), 1 liga. Nasce em 0 para o HTML do
  // cliente ser igual ao do servidor; o efeito liga em lg+ e acompanha o resize.
  const parallax = useMotionValue(0);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => parallax.set(query.matches && !reduced ? 1 : 0);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [parallax, reduced]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const clusterY = useTransform<number, number>(
    [scrollYProgress, parallax],
    ([progress, factor]) => progress * factor * -40,
  );
  const clusterOpacity = useTransform<number, number>(
    [scrollYProgress, parallax],
    ([progress, factor]) => 1 - progress * factor * 0.15,
  );
  const cardsY = useTransform<number, number>(
    [scrollYProgress, parallax],
    ([progress, factor]) => progress * factor * -80,
  );

  return (
    <div
      ref={ref}
      data-hero-stage=""
      className="relative isolate mx-auto w-full max-w-[420px] lg:max-w-[440px]"
    >
      {/*
        Moldura: ancora de tudo que flutua (cluster e cards). Fica separada da raiz porque no
        mobile o card de momento entra no fluxo abaixo e mudaria o `bottom` das camadas.
      */}
      <div data-hero-frame="" className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-[-14%] -z-10 animate-drift rounded-full bg-[radial-gradient(closest-side,var(--color-berry-50),transparent)] opacity-90"
        />

        {/* Base do palco: a foto do paciente em consulta por video. */}
        <div
          data-hero-photo=""
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-float ring-1 ring-black/5 lg:aspect-[4/5] lg:-rotate-2"
        >
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            priority
            sizes={HERO_PHOTO_SIZES}
            className="h-full w-full object-cover object-[50%_28%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
          />
        </div>

        {/* Trilha da Amora sobrepondo a foto, com o simbolo da marca sobre o hub. */}
        <m.div
          data-hero-cluster=""
          className="absolute bottom-[-8%] right-[-4%] w-[58%] lg:bottom-auto lg:right-[-8%] lg:top-[6%] lg:w-[62%]"
          style={{ y: clusterY, opacity: clusterOpacity }}
        >
          <TrailCluster
            variant="full"
            animate="intro"
            comets={comets}
            active={activeNode}
            confirmed={0}
            label={hero.clusterAlt}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <m.span
              data-hero-mark=""
              className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-float ring-4 ring-berry-100 lg:h-[72px] lg:w-[72px]"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                reduced ? { duration: 0 } : { delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }
              }
            >
              <Image
                src="/brand/moorah-mark.png"
                alt=""
                width={194}
                height={265}
                sizes="46px"
                className="h-9 w-auto lg:h-[46px]"
              />
            </m.span>
          </div>
        </m.div>

        {hero.moments.map((moment, index) => {
          const slot = cardSlot(index, step);
          return (
            <m.div
              key={moment.label}
              aria-hidden="true"
              data-moment={index}
              data-slot={slot.key}
              className={cn("absolute hidden w-[240px] lg:block", CARD_POSITIONS[index])}
              style={{ y: cardsY }}
            >
              <div className="animate-float-slow" style={{ animationDelay: FLOAT_DELAYS[index] }}>
                <m.div
                  className={CARD_CLASSES}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          delay: CARD_DELAYS[index] ?? 1.4,
                          duration: CARD_DURATION,
                          ease: EASE_OUT_EXPO,
                        }
                  }
                >
                  {/* Conteudo empilhado em uma celula: o evento que sai e o que entra
                      ocupam o mesmo lugar (crossfade sem esticar o card). */}
                  <span className="grid min-w-0 flex-1">
                    <AnimatePresence initial={false}>
                      <m.span
                        key={slot.key}
                        data-moment-slot={slot.key}
                        className="col-start-1 row-start-1 flex min-w-0 items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: EVENT_SWAP, ease: EASE_OUT_EXPO }}
                      >
                        <MomentContent moment={slot.content} />
                      </m.span>
                    </AnimatePresence>
                  </span>
                </m.div>
              </div>
            </m.div>
          );
        })}
      </div>

      {/* Mobile: um unico momento, estatico, abaixo do palco. */}
      <div aria-hidden="true" data-moment="mobile" className={cn(CARD_CLASSES, "mt-12 lg:hidden")}>
        <MomentContent moment={hero.moments[0]} />
      </div>
    </div>
  );
}
