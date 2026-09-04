"use client";

import { m, type Transition, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { specialties } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Trilha da Amora: hub central (assinatura) e 12 nos (especialidades) ligados por trilhas de
  circuito em 45 graus. Geometria e cascata em docs/design-brief.md, secao 9.2.
  Decorativo por padrao (aria-hidden); com `label` vira role="img". Sem interatividade propria:
  `active` e `confirmed` chegam de fora.
*/

export type TrailClusterVariant = "full" | "mini" | "outline";
export type TrailClusterAnimate = "intro" | "draw" | "static";
export type TrailNodeState = "idle" | "active" | "confirmed";
// light = sobre superficie clara (padrao); plum = sobre o bloco escuro do hero.
export type TrailClusterTone = "light" | "plum";

export interface TrailClusterProps {
  // full = hero; mini = especialidades; outline = CTA final (so traco).
  variant?: TrailClusterVariant;
  // intro = cascata do hero; draw = pathLength ao entrar em vista; static = tudo no estado final.
  animate?: TrailClusterAnimate;
  // Indice 0..11 do no aceso (berry-500).
  active?: number | null;
  // Indice do no confirmado (leaf-500); na intro acende em 1900 ms.
  confirmed?: number | null;
  // aria-label; sem label o svg e aria-hidden.
  label?: string;
  // Cometas continuos correndo pelas trilhas (CSS animate-comet; a media query de
  // reduced-motion em globals.css ja zera). Padrao false.
  comets?: boolean;
  // Paleta. light e o padrao (Especialidades e Contato nao mudam); plum e a do hero v3.
  tone?: TrailClusterTone;
  // Indice do no -> raio novo. O circulo desse no cresce e vira o anel de um disco de foto
  // posicionado por cima em HTML (ver hero-network.tsx e TRAIL_NODES).
  emphasis?: Readonly<Partial<Record<number, number>>>;
  className?: string;
}

interface TrailNodeGeometry {
  cx: number;
  cy: number;
  r: number;
  // Trilha do pai ate o no.
  d: string;
  // Pad (dobra) da trilha, quando ha curva.
  pad?: readonly [number, number];
  ring: "inner" | "outer";
}

const HUB = { cx: 280, cy: 280, r: 34 } as const;

// A ordem segue `specialties` (espelho em Especialidades).
const NODES: readonly TrailNodeGeometry[] = [
  { cx: 280, cy: 160, r: 22, d: "M 280 246 V 182", ring: "inner" },
  { cx: 400, cy: 220, r: 22, d: "M 314 280 H 340 L 384 236", pad: [340, 280], ring: "inner" },
  { cx: 380, cy: 380, r: 22, d: "M 304 304 L 364 364", ring: "inner" },
  { cx: 180, cy: 380, r: 22, d: "M 256 304 L 196 364", ring: "inner" },
  { cx: 160, cy: 220, r: 22, d: "M 246 280 H 220 L 176 236", pad: [220, 280], ring: "inner" },
  { cx: 280, cy: 60, r: 18, d: "M 280 138 V 78", ring: "outer" },
  { cx: 450, cy: 110, r: 18, d: "M 302 160 H 400 L 437 123", pad: [400, 160], ring: "outer" },
  { cx: 500, cy: 300, r: 18, d: "M 422 220 H 440 L 488 268", pad: [440, 220], ring: "outer" },
  { cx: 430, cy: 470, r: 18, d: "M 380 402 V 420 L 417 457", pad: [380, 420], ring: "outer" },
  { cx: 230, cy: 510, r: 18, d: "M 180 402 V 460 L 217 497", pad: [180, 460], ring: "outer" },
  { cx: 70, cy: 400, r: 18, d: "M 158 380 H 90 L 83 387", pad: [90, 380], ring: "outer" },
  { cx: 80, cy: 180, r: 18, d: "M 138 220 H 120 L 93 193", pad: [120, 220], ring: "outer" },
];

const INNER_COUNT = NODES.filter((node) => node.ring === "inner").length;

// Lado do viewBox. O HTML que se sobrepoe ao svg converte coordenadas em % dividindo por ele.
export const TRAIL_SIZE = 560;

// Centro e raio padrao de cada no, na ordem de `specialties`.
export const TRAIL_NODES: readonly { cx: number; cy: number; r: number }[] = NODES.map(
  ({ cx, cy, r }) => ({ cx, cy, r }),
);

interface TrailPalette {
  trail: string;
  nodeStroke: string;
  idle: string;
  // Trilha do no aceso.
  active: string;
  // Fill do no aceso.
  activeNode: string;
  confirmed: string;
  pad: string;
  // Cometas (a variante outline continua usando `trail`).
  comet: string;
  // Anel dos nos com `emphasis`.
  emphasisFill: string;
  emphasisStroke: string;
  hubFrom: string;
  hubTo: string;
}

// Sempre var(--color-...): as cores acompanham o tema (docs/design-brief-v3-hero.md, 7.4).
const PALETTE: Record<TrailClusterTone, TrailPalette> = {
  light: {
    trail: "var(--color-berry-300)",
    nodeStroke: "var(--color-ink)",
    idle: "var(--color-berry-100)",
    active: "var(--color-berry-500)",
    activeNode: "var(--color-berry-500)",
    confirmed: "var(--color-leaf-500)",
    pad: "var(--color-ink)",
    comet: "var(--color-berry-500)",
    emphasisFill: "var(--color-berry-100)",
    emphasisStroke: "var(--color-ink)",
    hubFrom: "var(--color-berry-500)",
    hubTo: "var(--color-berry-700)",
  },
  plum: {
    trail: "var(--color-berry-500)",
    nodeStroke: "var(--color-berry-400)",
    idle: "var(--color-berry-800)",
    active: "var(--color-berry-300)",
    activeNode: "var(--color-berry-400)",
    confirmed: "var(--color-leaf-400)",
    pad: "var(--color-berry-400)",
    comet: "var(--color-berry-300)",
    emphasisFill: "var(--color-berry-900)",
    emphasisStroke: "var(--color-berry-300)",
    hubFrom: "var(--color-berry-500)",
    hubTo: "var(--color-berry-700)",
  },
};

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;

// Cascata da intro (segundos), conforme 9.2.
const INTRO = {
  hub: { delay: 0.2, duration: 0.6 },
  innerTrail: { delay: 0.5, duration: 0.7, stagger: 0.06 },
  innerNode: { delay: 0.7, duration: 0.45, stagger: 0.06 },
  outerTrail: { delay: 1.0, duration: 0.6, stagger: 0.05 },
  outerNode: { delay: 1.2, duration: 0.45, stagger: 0.05 },
  confirmMs: 1900,
  halo: { duration: 0.6, scale: 40 / 22 },
} as const;

// Desenho ao entrar em vista: 1200 ms (full, mini) ou 1600 ms (outline, CTA final), stagger 50 ms.
const DRAW = {
  stagger: 0.05,
  duration: { full: 1.2, mini: 1.2, outline: 1.6 },
} as const;

const INSTANT: Transition = { duration: 0, delay: 0 };

// Delay de cada cometa (12 trilhas x 0,25 s = 0 a 2,75 s), deterministico: sem Math.random.
const COMET_STAGGER = 0.25;

function ringIndex(index: number): number {
  return index < INNER_COUNT ? index : index - INNER_COUNT;
}

function trailTransition(
  index: number,
  ring: TrailNodeGeometry["ring"],
  mode: TrailClusterAnimate,
  variant: TrailClusterVariant,
  reduced: boolean,
): Transition {
  if (reduced) return INSTANT;
  if (mode === "draw") {
    return {
      duration: DRAW.duration[variant],
      delay: index * DRAW.stagger,
      ease: EASE_IN_OUT_SOFT,
    };
  }
  const step = ring === "inner" ? INTRO.innerTrail : INTRO.outerTrail;
  return {
    duration: step.duration,
    delay: step.delay + ringIndex(index) * step.stagger,
    ease: EASE_IN_OUT_SOFT,
  };
}

function nodeTransition(
  index: number,
  ring: TrailNodeGeometry["ring"],
  reduced: boolean,
): Transition {
  if (reduced) return INSTANT;
  const step = ring === "inner" ? INTRO.innerNode : INTRO.outerNode;
  return {
    duration: step.duration,
    delay: step.delay + ringIndex(index) * step.stagger,
    ease: EASE_OUT_EXPO,
  };
}

function nodeState(index: number, active: number | null, confirmed: number | null): TrailNodeState {
  if (confirmed === index) return "confirmed";
  if (active === index) return "active";
  return "idle";
}

function nodeFill(
  state: TrailNodeState,
  variant: TrailClusterVariant,
  palette: TrailPalette,
  emphasized: boolean,
): string {
  if (state === "confirmed") return palette.confirmed;
  if (state === "active") return palette.activeNode;
  if (variant === "outline") return "none";
  return emphasized ? palette.emphasisFill : palette.idle;
}

export function TrailCluster({
  variant = "full",
  animate: mode = "intro",
  active = null,
  confirmed = null,
  label,
  comets = false,
  tone = "light",
  emphasis,
  className,
}: TrailClusterProps) {
  const palette = PALETTE[tone];
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  // null no servidor; so `true` desliga a cascata.
  const reduced = useReducedMotion() === true;
  const gradientId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "_")}hub`;

  // Na intro o no confirmado so acende no fim da cascata (efeito, para nao divergir do SSR).
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    if (mode !== "intro" || confirmed === null) return;
    if (reduced) {
      setIntroDone(true);
      return;
    }
    const timer = window.setTimeout(() => setIntroDone(true), INTRO.confirmMs);
    return () => window.clearTimeout(timer);
  }, [mode, confirmed, reduced]);

  const confirmedReady = mode !== "intro" || introDone;
  const confirmedIndex = confirmedReady ? confirmed : null;
  const isOutline = variant === "outline";
  const nodeStroke = isOutline ? palette.trail : palette.nodeStroke;
  const padFill = isOutline ? palette.trail : palette.pad;
  const cometStroke = isOutline ? palette.trail : palette.comet;
  const drawTarget = mode === "draw" && !(inView || reduced) ? 0 : 1;
  const animated = mode !== "static";
  const confirmedNode = confirmedIndex === null ? undefined : NODES[confirmedIndex];
  const showHalo =
    variant === "full" && mode === "intro" && !reduced && confirmedNode !== undefined;

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 560"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      data-trail-cluster=""
      data-variant={variant}
      data-animate={mode}
      data-tone={tone}
      data-active={active ?? undefined}
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      {isOutline ? null : (
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor={palette.hubFrom} />
            <stop offset="100%" stopColor={palette.hubTo} />
          </radialGradient>
        </defs>
      )}

      <g data-trails="">
        {NODES.map((node, index) => {
          const state = nodeState(index, active, confirmedIndex);
          const lit = state === "active";
          const stroke = lit ? palette.active : palette.trail;
          const strokeWidth = lit ? 3 : 2;
          const motionProps = animated
            ? {
                initial: { pathLength: 0 },
                animate: { pathLength: drawTarget },
                transition: trailTransition(index, node.ring, mode, variant, reduced),
              }
            : {};
          return (
            <m.path
              key={specialties[index]?.name ?? index}
              data-trail={index}
              d={node.d}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="transition-[stroke,stroke-width] duration-200 ease-out-expo"
              {...motionProps}
            />
          );
        })}
      </g>

      {comets ? (
        <g data-comets="">
          {NODES.map((node, index) => (
            <path
              key={specialties[index]?.name ?? index}
              data-comet={index}
              d={node.d}
              fill="none"
              stroke={cometStroke}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={100}
              strokeDasharray="12 100"
              opacity={0.9}
              className="animate-comet"
              style={{ animationDelay: `${(index * COMET_STAGGER).toFixed(2)}s` }}
            />
          ))}
        </g>
      ) : null}

      <g data-pads="">
        {NODES.map((node, index) =>
          node.pad ? (
            <circle
              key={specialties[index]?.name ?? index}
              data-pad={index}
              cx={node.pad[0]}
              cy={node.pad[1]}
              r={4}
              fill={padFill}
            />
          ) : null,
        )}
      </g>

      <m.circle
        data-hub=""
        cx={HUB.cx}
        cy={HUB.cy}
        r={HUB.r}
        fill={isOutline ? "none" : `url(#${gradientId})`}
        stroke={isOutline ? palette.trail : undefined}
        strokeWidth={isOutline ? 2 : undefined}
        vectorEffect={isOutline ? "non-scaling-stroke" : undefined}
        {...(mode === "intro"
          ? {
              initial: { scale: 0.6, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: reduced
                ? INSTANT
                : { delay: INTRO.hub.delay, duration: INTRO.hub.duration, ease: EASE_OUT_EXPO },
            }
          : {})}
      />

      <g data-nodes="">
        {NODES.map((node, index) => {
          const state = nodeState(index, active, confirmedIndex);
          const emphasisRadius = emphasis?.[index];
          const emphasized = emphasisRadius !== undefined;
          const motionProps =
            mode === "intro"
              ? {
                  initial: { scale: 0.7, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: nodeTransition(index, node.ring, reduced),
                }
              : {};
          return (
            <m.circle
              key={specialties[index]?.name ?? index}
              data-node={index}
              data-specialty={specialties[index]?.name}
              data-state={state}
              data-emphasis={emphasized ? "true" : undefined}
              cx={node.cx}
              cy={node.cy}
              r={emphasisRadius ?? node.r}
              fill={nodeFill(state, variant, palette, emphasized)}
              stroke={emphasized ? palette.emphasisStroke : nodeStroke}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className="transition-[fill,stroke] duration-200 ease-out-expo"
              {...motionProps}
            />
          );
        })}
      </g>

      {showHalo && confirmedNode ? (
        <m.circle
          data-halo=""
          cx={confirmedNode.cx}
          cy={confirmedNode.cy}
          r={22}
          fill={palette.confirmed}
          className="pointer-events-none"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: INTRO.halo.scale, opacity: 0 }}
          transition={{ duration: INTRO.halo.duration, ease: EASE_OUT_EXPO }}
        />
      ) : null}
    </svg>
  );
}
