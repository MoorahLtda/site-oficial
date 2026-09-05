"use client";

import { Check } from "lucide-react";
import { m, useInView, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { mocks, photos, type Step } from "@/content/site";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;

// Compasso da secao: a trilha se desenha em 1400 ms; cada no acende 350 ms depois do anterior
// (0, 350, 700, 1050 ms) e o card correspondente entra no mesmo instante.
const NODE_STEP_MS = 350;
const NODE_STEP_S = NODE_STEP_MS / 1000;
const TRACK_DURATION_S = 1.4;
const CARD_DURATION_S = 0.55;
// Detalhes da ilustracao aparecem quando o card ja assentou.
const ILLUSTRATION_LAG_S = 0.4;
const CHIP_STAGGER_S = 0.14;
// O cometa da trilha horizontal so entra quando o desenho termina (CSS puro, sem timer proprio).
const COMET_START_MS = TRACK_DURATION_S * 1000;

// Foto do passo 3: largura util da ilustracao (card de 1/4 da grade, menos os paddings).
const VIDEO_PHOTO_SIZES = "(min-width: 1024px) 200px, (min-width: 640px) 42vw, 78vw";
// Sobreposicao padrao para texto sobre foto (docs/design-brief-v2.md, item 1).
const PHOTO_OVERLAY = "bg-[linear-gradient(to_top,rgb(31_11_32/0.75),transparent_55%)]";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const stamp: Variants = {
  hidden: { opacity: 0, scale: 1.2, rotate: -3 },
  show: { opacity: 1, scale: 1, rotate: -3 },
};

interface IllustrationProps {
  // A secao entrou em vista.
  show: boolean;
  // Reduced motion: renderiza o estado final sem esperar.
  instant: boolean;
  // Segundos ate o detalhe aparecer (depois do card).
  delay: number;
}

type IllustrationComponent = (props: IllustrationProps) => React.JSX.Element;

function detailTransition(instant: boolean, delay: number, duration = 0.4) {
  return {
    duration: instant ? 0 : duration,
    delay: instant ? 0 : delay,
    ease: EASE_OUT_EXPO,
  };
}

// Passo 1: grade de horarios com uma celula escolhida e o selo de confirmacao.
const CALENDAR_CELLS = Array.from({ length: 21 }, (_, cell) => cell);
const CHOSEN_CELL = 10;

function SlotIllustration({ show, instant, delay }: IllustrationProps) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-3">
      <div className="grid grid-cols-7 gap-1.5">
        {CALENDAR_CELLS.map((cell) => (
          <span
            key={cell}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              cell === CHOSEN_CELL ? "bg-berry-500 ring-[3px] ring-berry-500/20" : "bg-gray-300",
            )}
          />
        ))}
      </div>
      <m.div
        variants={fadeUpSmall}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        transition={detailTransition(instant, delay)}
      >
        <Badge tone="leaf" size="sm" icon={<Check size={12} aria-hidden="true" />}>
          {mocks.slotConfirmed}
        </Badge>
      </m.div>
    </div>
  );
}

// Passo 2: tres lembretes empilhados, deslocados 6 px; o ultimo ja "deu certo" (ponto leaf).
const CHIP_OFFSETS = ["ml-0", "ml-1.5", "ml-3"] as const;

function RemindersIllustration({ show, instant, delay }: IllustrationProps) {
  const last = mocks.reminderChips.length - 1;
  return (
    <div className="flex h-full flex-col justify-center gap-1">
      {mocks.reminderChips.map((chip, j) => (
        <m.span
          key={chip}
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-800 shadow-card",
            CHIP_OFFSETS[j] ?? "ml-0",
          )}
          variants={fadeUpSmall}
          initial="hidden"
          animate={show ? "show" : "hidden"}
          transition={detailTransition(instant, delay + j * CHIP_STAGGER_S)}
        >
          {j === last ? <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" /> : null}
          {chip}
        </m.span>
      ))}
    </div>
  );
}

// Passo 3: moldura de video com o medico atendendo e o chip "Conectado" em leaf.
function VideoIllustration({ show, instant, delay }: IllustrationProps) {
  const photo = photos.medicoVideo;
  return (
    <div className="relative h-full overflow-hidden rounded-lg bg-ink">
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={VIDEO_PHOTO_SIZES}
        className="h-full w-full object-cover object-[50%_28%]"
      />
      <span className={cn("pointer-events-none absolute inset-0", PHOTO_OVERLAY)} />
      {/* Janela do proprio paciente, como em uma chamada de video. */}
      <span className="absolute right-2 top-2 grid h-7 w-10 place-items-center rounded-[4px] bg-ink/70 ring-1 ring-white/25">
        <span className="h-3 w-3 rounded-full bg-berry-300" />
      </span>
      <m.span
        className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-leaf-300"
        variants={fadeUpSmall}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        transition={detailTransition(instant, delay)}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
        {mocks.connected}
      </m.span>
    </div>
  );
}

// Passo 4: folha com tres linhas e o carimbo de assinatura digital.
function DocumentIllustration({ show, instant, delay }: IllustrationProps) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-lg bg-white p-3 shadow-card">
      <span className="h-1.5 w-[80%] rounded bg-gray-200" />
      <span className="h-1.5 w-[60%] rounded bg-gray-200" />
      <span className="h-1.5 w-[70%] rounded bg-gray-200" />
      <m.span
        className="mt-auto self-end max-w-full text-right rounded border border-leaf-300 px-1.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-leaf-700"
        variants={stamp}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        transition={detailTransition(instant, delay, 0.35)}
      >
        {mocks.signed}
      </m.span>
    </div>
  );
}

const ILLUSTRATIONS: readonly IllustrationComponent[] = [
  SlotIllustration,
  RemindersIllustration,
  VideoIllustration,
  DocumentIllustration,
];

export interface StepsTrailProps {
  steps: readonly Step[];
  className?: string;
}

export function StepsTrail({ steps, className }: StepsTrailProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.3 });
  // useReducedMotion devolve null no servidor e no primeiro render do cliente (hidratacao segura).
  const reduced = useReducedMotion() === true;
  const [litCount, setLitCount] = useState(0);
  // Cometa continuo da trilha: entra por efeito (nunca no primeiro render) para o HTML do
  // cliente bater com o do servidor, e nunca sob reduced motion.
  const [cometOn, setCometOn] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(() => setCometOn(true), COMET_START_MS);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setLitCount(steps.length);
      return;
    }
    const timers = steps.map((_, i) =>
      window.setTimeout(() => setLitCount(i + 1), i * NODE_STEP_MS),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [inView, reduced, steps]);

  const trackTransition = {
    duration: reduced ? 0 : TRACK_DURATION_S,
    ease: EASE_IN_OUT_SOFT,
  };

  return (
    <div className={cn("relative", className)}>
      {/*
        Trilha horizontal (desktop): do centro do primeiro card ao centro do ultimo.
        Com 4 colunas e gap-6, o centro da primeira coluna fica em 12,5% - 3 * 1,5rem / 8
        (largura da coluna = (100% - 3 gaps) / 4; metade dela = 12,5% - 0,5625rem).
      */}
      <div
        aria-hidden="true"
        data-track="horizontal"
        className="absolute top-[7px] left-[calc(12.5%-0.5625rem)] right-[calc(12.5%-0.5625rem)] hidden h-0.5 overflow-hidden rounded-full bg-gray-200 lg:block"
      >
        <m.div
          className="h-full w-full origin-left bg-berry-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={trackTransition}
        />
        {cometOn ? (
          <svg
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="absolute inset-0 h-full w-full"
          >
            <line
              data-comet=""
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              pathLength="100"
              strokeDasharray="12 100"
              strokeLinecap="round"
              // A trilha desenhada e berry-400: um cometa berry-500 sobre ela da 1,6:1 de
              // contraste e nao se ve. O brilho claro da marca e o tom que le como movimento.
              stroke="var(--color-berry-100)"
              strokeWidth={2}
              opacity={0.9}
              vectorEffect="non-scaling-stroke"
              className="animate-comet"
            />
          </svg>
        ) : null}
      </div>

      {/* Regua vertical (mobile): nasce no primeiro no e some suavemente depois do ultimo. */}
      <div
        aria-hidden="true"
        data-track="vertical"
        className="absolute top-11 bottom-8 left-[7px] w-0.5 overflow-hidden rounded-full bg-gray-200 [mask-image:linear-gradient(to_bottom,black_80%,transparent)] lg:hidden"
      >
        <m.div
          className="h-full w-full origin-top bg-berry-400"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: inView ? 1 : 0 }}
          transition={trackTransition}
        />
      </div>

      <ol
        ref={listRef}
        aria-label="Passos"
        className="relative grid gap-6 pl-8 lg:grid-cols-4 lg:pl-0"
      >
        {steps.map((step, i) => {
          const Illustration = ILLUSTRATIONS[i];
          const lit = i < litCount;
          const cardDelay = i * NODE_STEP_S;
          return (
            <li key={step.n} className="relative flex flex-col lg:pt-8">
              {/* No da trilha: acende em ink quando o passo "acontece". */}
              <span
                aria-hidden="true"
                className="absolute top-9 -left-8 h-4 w-4 lg:top-0 lg:left-1/2 lg:-translate-x-1/2"
              >
                <span
                  data-lit={lit ? "true" : "false"}
                  className="block h-full w-full rounded-full border-2 border-gray-300 bg-white transition-[background-color,border-color,box-shadow] duration-300 data-[lit=true]:animate-pulse-once data-[lit=true]:border-ink data-[lit=true]:bg-ink data-[lit=true]:shadow-glow"
                />
              </span>

              <m.div
                className="flex flex-1 flex-col"
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                transition={{
                  duration: reduced ? 0 : CARD_DURATION_S,
                  delay: reduced ? 0 : cardDelay,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-card transition duration-250 ease-out-expo hover:-translate-y-0.5 hover:shadow-float">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold tabular-nums text-gray-600">
                      {String(step.n).padStart(2, "0")}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-berry-50 text-berry-600">
                      <Icon name={step.icon} size={22} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display font-semibold text-xl leading-snug text-gray-900 lg:text-[1.375rem]">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600">{step.text}</p>
                  </div>
                  {Illustration ? (
                    <div
                      aria-hidden="true"
                      data-illustration
                      className="relative mt-auto h-28 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-3"
                    >
                      <Illustration
                        show={inView}
                        instant={reduced}
                        delay={cardDelay + ILLUSTRATION_LAG_S}
                      />
                    </div>
                  ) : null}
                </div>
              </m.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
