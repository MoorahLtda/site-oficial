"use client";

import {
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cardSection, mocks, site } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Palco do Cartao Moorah dentro do bloco fundido #beneficios (brief v4-secoes, 4.4).
  Carregado em beneficios.tsx via next/dynamic. Devolve so a coluna do cartao: o
  SegmentedControl de titular, o cartao com o numero ilustrativo e a nota. O heading e a lista
  de beneficios sao server e vivem em beneficios.tsx.

  Motion (um gesto em duas fases):
  - Entrada com useInView (once, 0.4): o cartao sobe e desdobra (rotateX 12 -> 0) em 800 ms
    enquanto os digitos "se resolvem" com um unico setInterval de 60 ms: o digito i mostra
    (tick * 7 + i * 3) % 10 ate assentar no tick 6 + i; o intervalo para no tick do ultimo
    digito. Troca de titular: 12 ticks. Intervalo pausa com document.hidden e limpa no unmount.
  - Tilt so com ponteiro fino (hover + pointer: fine) e so depois que a entrada terminou
    (ponteiro ignorado enquanto run nao for null).
  - Reduced motion: cartao plano e opaco no primeiro quadro, digitos finais, sem tilt.

  O HTML do servidor ja traz o numero final; toda animacao termina nesse mesmo estado.
  Texto sobre o cartao e permitido (objeto da marca, nao fotografia): excecao declarada
  [data-card-stage] do criterio de aceite 4 do brief.
*/

const DIGIT_COUNT = 12;
const POSITIONS = Array.from({ length: DIGIT_COUNT }, (_, i) => i);
const GROUPS = [POSITIONS.slice(0, 4), POSITIONS.slice(4, 8), POSITIONS.slice(8, 12)] as const;
const TICK_MS = 60;
const EASE = [0.22, 1, 0.36, 1] as const;

interface Run {
  // Tick em que o digito i assenta no valor real.
  settle: (i: number) => number;
  // Ultimo tick da execucao; depois dele o intervalo para.
  end: number;
}

// Entrada: digito i assenta em 6 + i; o intervalo para quando o ultimo digito assenta.
const ENTRY_RUN: Run = { settle: (i) => 6 + i, end: 6 + (DIGIT_COUNT - 1) };

const SWITCH_RUN: Run = {
  settle: (i) => 1 + Math.round((i * 10) / (DIGIT_COUNT - 1)),
  end: 12,
};

function scrambled(tick: number, i: number): string {
  return String((tick * 7 + i * 3) % 10);
}

function groupDigits(sample: string): string {
  return GROUPS.map((group) => group.map((i) => sample[i] ?? "0").join("")).join(" ");
}

export interface CardStageProps {
  className?: string;
  // Nota curta abaixo do cartao (ex.: plans[1].features[1]).
  note?: string;
}

export function CardStage({ className, note }: CardStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.4 });
  const reduced = useReducedMotion() === true;

  const [holder, setHolder] = useState<string>(mocks.cardHolders[0].value);
  const [run, setRun] = useState<Run | null>(null);
  const [tick, setTick] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [tilting, setTilting] = useState(false);

  const holderIndex = mocks.cardHolders.findIndex((h) => h.value === holder);
  const holderOption = mocks.cardHolders[holderIndex] ?? mocks.cardHolders[0];
  const sample = mocks.cardSamples[holderIndex] ?? mocks.cardSamples[0];

  // Entrada em vista: dispara a resolucao (sob reduced motion os digitos ja sao os finais).
  useEffect(() => {
    if (!inView || reduced) return;
    setRun(ENTRY_RUN);
    setTick(0);
  }, [inView, reduced]);

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

  // Fim da execucao: para o intervalo.
  useEffect(() => {
    if (!run || tick < run.end) return;
    setRun(null);
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

  // So depois que a entrada terminou (run null); nunca sob reduced motion.
  const tilt = finePointer && !reduced && inView && run === null;

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

  const groupedNumber = groupDigits(sample);

  return (
    <div className={cn("flex w-full flex-col items-center gap-8", className)}>
      {/*
        2x2 no mobile, linha unica de 640 em diante (brief 4.4): cn usa tailwind-merge, entao
        grid vence o inline-flex base e rounded-2xl vence rounded-full; sem wrapper de rolagem.
      */}
      <SegmentedControl
        tone="plum"
        size="lg"
        label={cardSection.holderLabel}
        options={mocks.cardHolders}
        value={holder}
        onValueChange={handleHolderChange}
        className="grid max-w-md grid-cols-2 gap-1 rounded-2xl sm:inline-flex sm:w-auto sm:max-w-full sm:rounded-full sm:[&_button]:flex-none sm:[&_button]:whitespace-nowrap sm:[&_button]:px-3"
      />

      <div ref={stageRef} data-card-stage className="relative w-full max-w-[560px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -inset-y-12 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-berry-500)_28%,transparent),transparent)]"
        />
        <m.div
          data-card-entry
          initial={reduced ? false : { opacity: 0, y: 40, rotateX: 12 }}
          animate={reduced || inView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
          transition={reduced ? { duration: 0 } : { duration: 0.8, ease: EASE }}
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

      {note ? <p className="max-w-prose text-center text-sm text-berry-200">{note}</p> : null}
    </div>
  );
}
