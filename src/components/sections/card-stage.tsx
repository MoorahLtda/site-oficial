"use client";

import { Check } from "lucide-react";
import {
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cardSection, mocks, site } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Palco do Cartao Moorah (brief 5.7). Carregado em cartao.tsx via next/dynamic.
  Devolve as duas colunas do grid da secao: texto (heading, usos, nota) e o cartao com o
  segmented control. As duas colunas vivem aqui porque os usos acendem quando os digitos
  terminam de se resolver, e esse estado e do palco.

  Motion:
  - Entrada com useInView (once, 0.4): o cartao sobe e desdobra (rotateX 12 -> 0) em 800 ms.
  - Digitos "se resolvem" com um unico setInterval de 60 ms: o digito i mostra
    (tick * 7 + i * 3) % 10 ate o tick em que assenta no valor real. Entrada: 20 ticks, digito i
    assenta em 6 + i. Troca de titular: 12 ticks. Ao terminar a entrada, os usos acendem em
    sequencia (90 ms). Intervalo pausado com document.hidden, limpo no unmount.
  - Tilt so com ponteiro fino (hover + pointer: fine): springs de rotateX/rotateY ate 8 graus e
    brilho que acompanha o ponteiro.
  - Reduced motion: cartao plano, digitos finais imediatos, usos ja acesos.

  O HTML do servidor ja traz o numero final e os usos apagados (a media query motion-reduce do
  CSS acende os usos sem JS); toda animacao termina nesse mesmo estado.
*/

const DIGIT_COUNT = 12;
const POSITIONS = Array.from({ length: DIGIT_COUNT }, (_, i) => i);
const GROUPS = [POSITIONS.slice(0, 4), POSITIONS.slice(4, 8), POSITIONS.slice(8, 12)] as const;
const TICK_MS = 60;
const USE_STAGGER_TICKS = 1.5; // 90 ms

interface Run {
  // Tick em que o digito i assenta no valor real.
  settle: (i: number) => number;
  // Tick a partir do qual os usos comecam a acender (null = nao acende).
  lightFrom: number | null;
  // Ultimo tick da execucao; depois dele o intervalo para.
  end: number;
}

function entryRun(useCount: number): Run {
  const lightFrom = 20;
  return {
    settle: (i) => 6 + i,
    lightFrom,
    end: lightFrom + Math.ceil((useCount - 1) * USE_STAGGER_TICKS),
  };
}

const SWITCH_RUN: Run = {
  settle: (i) => 1 + Math.round((i * 10) / (DIGIT_COUNT - 1)),
  lightFrom: null,
  end: 12,
};

function scrambled(tick: number, i: number): string {
  return String((tick * 7 + i * 3) % 10);
}

// Quantos usos ja acenderam neste tick (stagger de 90 ms a partir de run.lightFrom).
function countLit(run: Run | null, tick: number, useCount: number): number {
  if (!run || run.lightFrom === null) return 0;
  const from = run.lightFrom;
  let count = 0;
  for (let i = 0; i < useCount; i++) {
    if (tick >= from + Math.ceil(i * USE_STAGGER_TICKS)) count++;
  }
  return count;
}

function groupDigits(sample: string): string {
  return GROUPS.map((group) => group.map((i) => sample[i] ?? "0").join("")).join(" ");
}

export interface CardStageProps {
  // Cabecalho da secao, renderizado no servidor (SectionHeading) e passado pronto.
  heading?: ReactNode;
  uses?: readonly string[];
  // Nota curta abaixo dos usos (ex.: plans[1].features[1]).
  note?: string;
}

export function CardStage({ heading, uses = cardSection.uses, note }: CardStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.4 });
  const reduced = useReducedMotion() === true;

  const [holder, setHolder] = useState<string>(mocks.cardHolders[0].value);
  const [run, setRun] = useState<Run | null>(null);
  const [tick, setTick] = useState(0);
  const [usesLit, setUsesLit] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [tilting, setTilting] = useState(false);

  const holderIndex = mocks.cardHolders.findIndex((h) => h.value === holder);
  const holderOption = mocks.cardHolders[holderIndex] ?? mocks.cardHolders[0];
  const sample = mocks.cardSamples[holderIndex] ?? mocks.cardSamples[0];

  // Entrada em vista: dispara a resolucao (ou, sob reduced motion, acende tudo de uma vez).
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setUsesLit(true);
      return;
    }
    setRun(entryRun(uses.length));
    setTick(0);
  }, [inView, reduced, uses.length]);

  // Pausa o intervalo quando a aba fica oculta.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Unico setInterval do componente.
  useEffect(() => {
    if (!run || hidden) return;
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, [run, hidden]);

  // Fim da execucao: para o intervalo e fixa os usos acesos.
  useEffect(() => {
    if (!run || tick < run.end) return;
    setRun(null);
    if (run.lightFrom !== null) setUsesLit(true);
  }, [run, tick]);

  // Tilt so com mouse/trackpad; toque e caneta ficam com o cartao plano.
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 18 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["-30%", "30%"]);

  const tilt = finePointer && !reduced;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
    setTilting(false);
  }

  function handleHolderChange(value: string) {
    setHolder(value);
    if (reduced) return;
    setRun(SWITCH_RUN);
    setTick(0);
  }

  const digits = POSITIONS.map((i) =>
    run && tick < run.settle(i) ? scrambled(tick, i) : (sample[i] ?? "0"),
  );

  const litCount = usesLit ? uses.length : countLit(run, tick, uses.length);
  const groupedNumber = groupDigits(sample);

  return (
    <>
      <div className="lg:col-span-5">
        {heading}
        <ul className="mt-8 grid grid-cols-2 gap-3">
          {uses.map((use, i) => (
            <li
              key={use}
              data-use
              data-lit={i < litCount ? "" : undefined}
              className="group flex items-center gap-2.5 text-berry-100"
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-leaf-300",
                  "transition-colors duration-300 ease-out-expo",
                  "group-data-[lit]:bg-leaf-500/20 motion-reduce:bg-leaf-500/20",
                )}
              >
                <Check size={14} strokeWidth={2.5} aria-hidden="true" focusable="false" />
              </span>
              <span className="text-[15px] leading-snug sm:text-base">{use}</span>
            </li>
          ))}
        </ul>
        {note ? <p className="mt-6 max-w-prose text-sm text-berry-200">{note}</p> : null}
      </div>

      <div className="flex flex-col items-center gap-8 lg:col-span-7">
        <div className="w-full overflow-x-auto p-1.5 [scrollbar-width:none] lg:w-auto lg:overflow-visible">
          <SegmentedControl
            tone="plum"
            size="lg"
            label={cardSection.holderLabel}
            options={mocks.cardHolders}
            value={holder}
            onValueChange={handleHolderChange}
            className="min-w-max lg:w-auto"
          />
        </div>

        <div ref={stageRef} className="relative w-full max-w-[560px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 -inset-y-12 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-berry-500)_28%,transparent),transparent)]"
          />
          <m.div
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
            className="relative"
          >
            <m.div
              style={{ rotateX, rotateY, transformPerspective: 1200 }}
              onPointerEnter={tilt ? () => setTilting(true) : undefined}
              onPointerMove={tilt ? handlePointerMove : undefined}
              onPointerLeave={tilt ? handlePointerLeave : undefined}
              className={cn(
                "relative overflow-hidden rounded-xl shadow-deep",
                tilting && "will-change-transform",
              )}
            >
              <Image
                src="/brand/cartao-moorah.webp"
                alt={cardSection.imageAlt}
                width={1400}
                height={933}
                sizes="(min-width: 1024px) 560px, 92vw"
                className="h-auto w-full rounded-xl"
              />
              <m.div
                aria-hidden="true"
                style={{ x: glareX }}
                className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.12)_50%,transparent_65%)]"
              />
              {/* A faixa inferior esquerda do cartao e lisa; a amora em relevo ocupa a direita. */}
              <div className="absolute bottom-[12%] left-[7%] right-[32%] text-white">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-berry-200">
                  {cardSection.numberLabel}
                </p>
                {/* Numero ilustrativo lido como um unico rotulo (role img); os digitos sao decorativos e animam. */}
                <p
                  role="img"
                  aria-label={`${cardSection.sampleAria}: ${groupedNumber}`}
                  data-card-number
                  className="mt-1 flex gap-3 font-display text-xl font-semibold tabular-nums lg:text-[1.625rem]"
                >
                  {GROUPS.map((group) => (
                    <span key={group.join("")} className="flex">
                      {group.map((i) => (
                        <span key={i} aria-hidden="true" data-digit>
                          {digits[i]}
                        </span>
                      ))}
                    </span>
                  ))}
                </p>
                <div className="mt-3 flex items-center justify-between gap-4 text-xs text-white/80">
                  <span data-holder>{holderOption.label}</span>
                  <span>{site.product}</span>
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </>
  );
}
