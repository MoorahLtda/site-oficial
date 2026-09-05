"use client";

import { m, type Transition, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { manifesto } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Trilha de convergencia (docs/design-brief.md, 5.4): cinco nos rotulados (consulta, receitas,
  exames, farmacias, portal) ligados por trilhas de circuito em 45 graus a um unico hub, a
  assinatura. Desktop: nos empilhados a esquerda, hub a direita (viewBox 1100x260). Mobile: nos em
  linha no topo, hub embaixo (viewBox 320x360). As trilhas se desenham ao entrar em vista
  (pathLength, 1000 ms, stagger 80 ms) e o hub acende em berry-500 quando a ultima chega.
  Reduced motion: tudo no estado final, hub aceso, sem halo.
*/

type Layout = "desktop" | "mobile";
type Point = readonly [number, number];

interface TrailGeometry {
  cx: number;
  cy: number;
  // Trilha do no ate a borda do hub.
  d: string;
  // Pad (dobra de 45 graus) da trilha, quando ha curva.
  pad?: Point;
}

interface LayoutGeometry {
  viewBox: string;
  hub: { cx: number; cy: number; r: number };
  // Ponto onde as trilhas se encontram antes do hub.
  junction: Point;
  nodes: readonly TrailGeometry[];
}

const NODE_R = 8;
const PAD_R = 4;
const HUB_CORE_R = 6;

const DESKTOP: LayoutGeometry = {
  viewBox: "0 0 1100 260",
  hub: { cx: 1000, cy: 130, r: 28 },
  junction: [760, 130],
  nodes: [
    { cx: 80, cy: 30, d: "M 96 30 H 660 L 760 130 H 972", pad: [660, 30] },
    { cx: 80, cy: 80, d: "M 96 80 H 710 L 760 130 H 972", pad: [710, 80] },
    { cx: 80, cy: 130, d: "M 96 130 H 972" },
    { cx: 80, cy: 180, d: "M 96 180 H 710 L 760 130 H 972", pad: [710, 180] },
    { cx: 80, cy: 230, d: "M 96 230 H 660 L 760 130 H 972", pad: [660, 230] },
  ],
};

const MOBILE: LayoutGeometry = {
  viewBox: "0 0 320 360",
  hub: { cx: 160, cy: 320, r: 28 },
  junction: [160, 260],
  nodes: [
    { cx: 40, cy: 30, d: "M 40 46 V 140 L 160 260 V 292", pad: [40, 140] },
    { cx: 100, cy: 30, d: "M 100 46 V 200 L 160 260 V 292", pad: [100, 200] },
    { cx: 160, cy: 30, d: "M 160 46 V 292" },
    { cx: 220, cy: 30, d: "M 220 46 V 200 L 160 260 V 292", pad: [220, 200] },
    { cx: 280, cy: 30, d: "M 280 46 V 140 L 160 260 V 292", pad: [280, 140] },
  ],
};

// Grade de 32 colunas: os nos do mobile ficam em 4/32, 10/32, 16/32, 22/32 e 28/32 da largura;
// cada rotulo ocupa 6 colunas centradas no proprio no.
const MOBILE_LABEL_COLUMN = [
  "col-start-2",
  "col-start-8",
  "col-start-14",
  "col-start-20",
  "col-start-26",
] as const;

const COLOR = {
  trail: "var(--color-berry-300)",
  ink: "var(--color-ink)",
  hubIdle: "var(--color-berry-100)",
  hubLit: "var(--color-berry-500)",
} as const;

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;
const INSTANT: Transition = { duration: 0, delay: 0 };

const TRAIL = { duration: 1, stagger: 0.08 } as const;
const LABEL = { duration: 0.5, stagger: 0.08, delay: 0.15 } as const;
// O hub acende enquanto a ultima trilha chega (delay de 1,1 s do brief).
const HUB_LIT_MS = 1100;
const HALO = { from: 28, to: 50, duration: 0.7 } as const;

function trailTransition(index: number, reduced: boolean): Transition {
  if (reduced) return INSTANT;
  return { duration: TRAIL.duration, delay: index * TRAIL.stagger, ease: EASE_IN_OUT_SOFT };
}

function labelTransition(index: number, reduced: boolean): Transition {
  if (reduced) return INSTANT;
  return {
    duration: LABEL.duration,
    delay: LABEL.delay + index * LABEL.stagger,
    ease: EASE_OUT_EXPO,
  };
}

interface TrailSvgProps {
  layout: Layout;
  geometry: LayoutGeometry;
  shown: boolean;
  reduced: boolean;
  lit: boolean;
  // Rotulos dentro do svg (desktop). No mobile eles ficam em HTML acima do svg. O tamanho da fonte
  // e em unidades do viewBox (1100): em md o svg encolhe para ~0,65x, por isso a fonte sobe ali.
  withLabels: boolean;
}

function TrailSvg({ layout, geometry, shown, reduced, lit, withLabels }: TrailSvgProps) {
  const { viewBox, hub, junction, nodes } = geometry;
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={manifesto.svgAlt}
      data-layout={layout}
      className="block h-auto w-full overflow-visible"
    >
      <g data-trails="">
        {nodes.map((node, index) => (
          <m.path
            key={manifesto.nodes[index]}
            data-trail={index}
            d={node.d}
            fill="none"
            stroke={COLOR.trail}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: shown ? 1 : 0 }}
            transition={trailTransition(index, reduced)}
          />
        ))}
      </g>

      <g data-pads="">
        {nodes.map((node, index) =>
          node.pad ? (
            <circle
              key={manifesto.nodes[index]}
              data-pad={index}
              cx={node.pad[0]}
              cy={node.pad[1]}
              r={PAD_R}
              fill={COLOR.ink}
            />
          ) : null,
        )}
        <circle data-pad="junction" cx={junction[0]} cy={junction[1]} r={PAD_R} fill={COLOR.ink} />
      </g>

      <g data-nodes="">
        {nodes.map((node, index) => (
          <g key={manifesto.nodes[index]}>
            <circle data-node={index} cx={node.cx} cy={node.cy} r={NODE_R} fill={COLOR.ink} />
            {withLabels ? (
              <m.text
                data-label={index}
                aria-hidden="true"
                x={node.cx + 24}
                y={node.cy - 10}
                className="font-display text-[15px] font-medium fill-gray-700 lg:text-[13px] xl:text-[12px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={labelTransition(index, reduced)}
              >
                {manifesto.nodes[index]}
              </m.text>
            ) : null}
          </g>
        ))}
      </g>

      {lit && !reduced ? (
        <m.circle
          data-halo=""
          cx={hub.cx}
          cy={hub.cy}
          fill={COLOR.hubLit}
          className="pointer-events-none"
          initial={{ r: HALO.from, opacity: 0.6 }}
          animate={{ r: HALO.to, opacity: 0 }}
          transition={{ duration: HALO.duration, ease: EASE_OUT_EXPO }}
        />
      ) : null}

      <circle
        data-hub={layout}
        data-state={lit ? "lit" : "idle"}
        cx={hub.cx}
        cy={hub.cy}
        r={hub.r}
        fill={lit ? COLOR.hubLit : COLOR.hubIdle}
        stroke={COLOR.ink}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        className="transition-[fill] duration-400 ease-out-expo"
      />
      <circle
        data-hub-core=""
        cx={hub.cx}
        cy={hub.cy}
        r={HUB_CORE_R}
        className={cn(
          "transition-[fill] duration-400 ease-out-expo",
          lit ? "fill-white" : "fill-ink",
        )}
      />
    </svg>
  );
}

export interface ConvergenceTrailProps {
  className?: string;
}

export function ConvergenceTrail({ className }: ConvergenceTrailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // null no servidor; so `true` desliga o desenho.
  const reduced = useReducedMotion() === true;
  const shown = inView || reduced;

  // O hub acende em efeito (nunca no render) para o HTML do cliente bater com o do servidor.
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!shown) return;
    if (reduced) {
      setLit(true);
      return;
    }
    const timer = window.setTimeout(() => setLit(true), HUB_LIT_MS);
    return () => window.clearTimeout(timer);
  }, [shown, reduced]);

  const hubLabelClass = "font-display font-semibold text-gray-900";

  return (
    <div ref={ref} data-convergence-trail="" className={cn("w-full", className)}>
      {/* Desktop: hub a direita; o rotulo fica sob ele via grade de 11 colunas (x=1000 de 1100). */}
      <div className="hidden md:block">
        <TrailSvg
          layout="desktop"
          geometry={DESKTOP}
          shown={shown}
          reduced={reduced}
          lit={lit}
          withLabels
        />
        <div className="grid grid-cols-11">
          <p className={cn(hubLabelClass, "col-span-2 col-start-10 -mt-1 text-center text-base")}>
            {manifesto.hub}
          </p>
        </div>
      </div>

      {/* Mobile: rotulos em HTML acima dos nos (nao cabem no svg a 60 unidades de distancia). */}
      <div className="mx-auto max-w-[360px] md:hidden">
        <div aria-hidden="true" className="grid grid-cols-[repeat(32,minmax(0,1fr))] items-end">
          {manifesto.nodes.map((label, index) => (
            <m.span
              key={label}
              data-mobile-label={index}
              className={cn(
                "col-span-6 text-center font-display text-[10px] font-medium leading-tight text-gray-700 min-[400px]:text-[11px]",
                MOBILE_LABEL_COLUMN[index],
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: shown ? 1 : 0 }}
              transition={labelTransition(index, reduced)}
            >
              {label}
            </m.span>
          ))}
        </div>
        <TrailSvg
          layout="mobile"
          geometry={MOBILE}
          shown={shown}
          reduced={reduced}
          lit={lit}
          withLabels={false}
        />
        <p className={cn(hubLabelClass, "mt-2 text-center text-[15px]")}>{manifesto.hub}</p>
      </div>
    </div>
  );
}
