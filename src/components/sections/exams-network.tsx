"use client";

import { Check } from "lucide-react";
import { m, type Transition, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mocks } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Rede de exames: um hub (o cartao) e 8 nos (laboratorios e clinicas) ligados por trilhas de
  circuito em 45 graus. Ao entrar em vista as trilhas se desenham (1200 ms), os nos acendem em
  berry-500 com stagger de 60 ms e, ao final, o selo em leaf confirma o desconto na rede.
  Decorativo: aria-hidden. Sob reduced motion nasce no estado final.
  Com `tone="photo"` (celula Exames, sobre a foto com overlay plum) a rede e desenhada em branco
  e ganha cometas continuos nas trilhas depois do desenho (brief v2, item 4).
*/

interface ExamNode {
  cx: number;
  cy: number;
  d: string;
}

const HUB = { cx: 160, cy: 60, r: 8 } as const;
const NODE_R = 5;

// Trilhas saem do hub em 45 graus, ramificam nos pads e chegam a cada no.
const NODES: readonly ExamNode[] = [
  { cx: 40, cy: 20, d: "M 154 54 L 140 40 H 60 L 44 24" },
  { cx: 100, cy: 20, d: "M 154 54 L 120 20 H 105" },
  { cx: 220, cy: 20, d: "M 166 54 L 200 20 H 215" },
  { cx: 280, cy: 20, d: "M 166 54 L 180 40 H 260 L 276 24" },
  { cx: 40, cy: 100, d: "M 154 66 L 140 80 H 60 L 44 96" },
  { cx: 100, cy: 100, d: "M 154 66 L 120 100 H 105" },
  { cx: 220, cy: 100, d: "M 166 66 L 200 100 H 215" },
  { cx: 280, cy: 100, d: "M 166 66 L 180 80 H 260 L 276 96" },
];

// Pontos de ramificacao das trilhas.
const PADS: readonly [number, number][] = [
  [140, 40],
  [180, 40],
  [140, 80],
  [180, 80],
];

/*
  Duas paletas: `light` no card branco e `photo` sobre a foto de exame com overlay plum, onde a
  rede e desenhada em branco (brief v2, item 1) e ganha cometas continuos (item 4).
  Valores literais so aqui, dentro do SVG decorativo; o resto vem dos tokens do tema.
*/
export type ExamsNetworkTone = "light" | "photo";

interface ToneSpec {
  trail: string;
  trailOpacity: number;
  pad: string;
  hub: string;
  idle: string;
  idleOpacity: number;
  lit: string;
  litOpacity: number;
  nodeStroke: string;
  comets: boolean;
}

const TONES: Record<ExamsNetworkTone, ToneSpec> = {
  light: {
    trail: "var(--color-berry-300)",
    trailOpacity: 1,
    pad: "var(--color-ink)",
    hub: "var(--color-ink)",
    idle: "var(--color-gray-300)",
    idleOpacity: 1,
    lit: "var(--color-berry-500)",
    litOpacity: 1,
    nodeStroke: "#ffffff",
    comets: false,
  },
  photo: {
    trail: "#ffffff",
    trailOpacity: 0.45,
    pad: "#ffffff",
    hub: "#ffffff",
    idle: "#ffffff",
    idleOpacity: 0.4,
    lit: "#ffffff",
    litOpacity: 1,
    nodeStroke: "none",
    comets: true,
  },
};

const DRAW_MS = 1200;
const NODE_STAGGER_MS = 60;
// Defasagem entre os cometas: valor fixo por indice (nada de aleatorio no render).
const COMET_DELAY_STEP_S = 0.37;
// Nos acendem quando as trilhas estao quase chegando (desenho de 1200 ms); o selo vem depois do ultimo no.
const NODES_START_MS = 900;
const SEAL_MS = NODES_START_MS + NODE_STAGGER_MS * NODES.length + 400;
const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export interface ExamsNetworkProps {
  // "photo" = sobre a foto de exame (traco branco e cometas); padrao "light" (card branco).
  tone?: ExamsNetworkTone;
  className?: string;
}

export function ExamsNetwork({ tone = "light", className }: ExamsNetworkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion() === true;
  const [lit, setLit] = useState(false);
  const [sealed, setSealed] = useState(false);
  // Cometas entram por efeito, depois do desenho, e nunca sob reduced motion (CSS puro).
  const [cometsOn, setCometsOn] = useState(false);
  const palette = TONES[tone];

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setLit(true);
      setSealed(true);
      return;
    }
    const litTimer = window.setTimeout(() => setLit(true), NODES_START_MS);
    const sealTimer = window.setTimeout(() => setSealed(true), SEAL_MS);
    const cometTimer = palette.comets
      ? window.setTimeout(() => setCometsOn(true), DRAW_MS)
      : undefined;
    return () => {
      window.clearTimeout(litTimer);
      window.clearTimeout(sealTimer);
      if (cometTimer !== undefined) window.clearTimeout(cometTimer);
    };
  }, [inView, reduced, palette.comets]);

  const drawTarget = inView || reduced ? 1 : 0;
  const trailTransition = (index: number): Transition =>
    reduced
      ? { duration: 0 }
      : { duration: DRAW_MS / 1000, delay: index * 0.04, ease: EASE_IN_OUT_SOFT };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-exams-network-wrap=""
      data-tone={tone}
      className={cn("block", className)}
    >
      <svg
        viewBox="0 0 320 120"
        data-exams-network=""
        aria-hidden="true"
        focusable="false"
        className="block h-auto w-full overflow-visible"
      >
        <g data-trails="">
          {NODES.map((node, index) => (
            <m.path
              key={node.d}
              data-trail={index}
              d={node.d}
              fill="none"
              stroke={palette.trail}
              strokeOpacity={palette.trailOpacity}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawTarget }}
              transition={trailTransition(index)}
            />
          ))}
        </g>
        {cometsOn ? (
          <g data-comets="">
            {NODES.map((node, index) => (
              <path
                key={node.d}
                data-comet={index}
                d={node.d}
                fill="none"
                stroke={palette.trail}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="100"
                strokeDasharray="12 100"
                opacity={0.9}
                vectorEffect="non-scaling-stroke"
                className="animate-comet"
                style={{ animationDelay: `${(index * COMET_DELAY_STEP_S).toFixed(2)}s` }}
              />
            ))}
          </g>
        ) : null}
        <g data-pads="">
          {PADS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} data-pad="" cx={cx} cy={cy} r={2.5} fill={palette.pad} />
          ))}
        </g>
        <circle data-hub="" cx={HUB.cx} cy={HUB.cy} r={HUB.r} fill={palette.hub} />
        <g data-nodes="">
          {NODES.map((node, index) => (
            <circle
              key={`${node.cx}-${node.cy}`}
              data-node={index}
              data-state={lit ? "lit" : "idle"}
              cx={node.cx}
              cy={node.cy}
              r={NODE_R}
              fill={lit ? palette.lit : palette.idle}
              fillOpacity={lit ? palette.litOpacity : palette.idleOpacity}
              stroke={palette.nodeStroke}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="transition-[fill,fill-opacity] duration-300 ease-out-expo"
              style={{ transitionDelay: `${index * NODE_STAGGER_MS}ms` }}
            />
          ))}
        </g>
      </svg>

      <div className="mt-2 flex min-h-6 items-center justify-end">
        {sealed ? (
          <m.span
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE_OUT_EXPO }}
            className="inline-flex"
          >
            <Badge tone="leaf" size="sm" icon={<Check size={12} aria-hidden="true" />}>
              {mocks.discountApplied}
            </Badge>
          </m.span>
        ) : null}
      </div>
    </div>
  );
}
