"use client";

import { m, type Transition, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TRAIL_NODES, TRAIL_SIZE, TrailCluster } from "@/components/ui/trail-cluster";
import { hero, heroDynamic, type PhotoKey, photos } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Rede de pessoas do hero v3 (docs/design-brief-v3-hero.md, 7.3 a 7.7): a Trilha da Amora em
  tom plum vira o palco. Tres nos externos crescem e recebem uma foto recortada em circulo
  (medicos, familia, paciente); o hub carrega o simbolo da marca num disco branco. Nao existe
  retangulo de foto, entao nao ha onde por caixa: a foto e o proprio no.

  Um unico setInterval (heroDynamic.eventEveryMs) e o metronomo. Cada evento do produto so
  entra como cadencia: com `node`, a trilha acende e o disco filho desse no troca de foto em
  crossfade; sem `node`, o anel do hub pulsa uma vez. Nenhum texto dos eventos aparece.
  O intervalo nao avanca com a aba escondida nem com a rede fora da tela; sob reduced motion
  nada roda e o estado final aparece de uma vez.
*/

type PoolId = "medicos" | "familia" | "paciente";

interface PoolPhoto {
  readonly key: PhotoKey;
  // object-position da foto dentro do circulo (rosto centrado). Conferir no navegador.
  readonly position: string;
}

interface Pool {
  // Indice do no da Trilha que vira o anel do disco.
  readonly node: number;
  // Raio novo desse no no viewBox (o padrao e 18).
  readonly r: number;
  // No que, ao acender, troca a foto deste disco (pai topologico na trilha).
  readonly trigger: number;
  readonly photos: readonly [PoolPhoto, PoolPhoto];
}

const POOL_IDS: readonly PoolId[] = ["medicos", "familia", "paciente"];

const POOLS: Record<PoolId, Pool> = {
  medicos: {
    node: 5,
    r: 52,
    trigger: 0,
    photos: [
      { key: "medicaSorrindo", position: "50% 22%" },
      { key: "medicaHeadset", position: "50% 35%" },
    ],
  },
  familia: {
    node: 7,
    r: 56,
    trigger: 1,
    photos: [
      { key: "familiaSofa", position: "50% 40%" },
      { key: "familiaCasa", position: "50% 45%" },
    ],
  },
  paciente: {
    node: 8,
    r: 52,
    trigger: 2,
    photos: [
      { key: "heroPaciente", position: "50% 28%" },
      { key: "idosoTablet", position: "40% 35%" },
    ],
  },
};

// Indice do no -> raio, para o TrailCluster desenhar o anel de cada disco.
const EMPHASIS: Readonly<Partial<Record<number, number>>> = Object.fromEntries(
  POOL_IDS.map((id) => [POOLS[id].node, POOLS[id].r]),
);

// Cada disco entra logo depois do proprio anel (nos externos terminam em 1,65 s).
const DISC_DELAY: Record<PoolId, number> = { medicos: 1.3, familia: 1.45, paciente: 1.6 };

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;
const INSTANT: Transition = { duration: 0, delay: 0 };

// Fim da cascata das trilhas; os cometas so entram depois, para nao correrem por trilha em desenho.
const INTRO_DONE_MS = 2200;
// Tempo que a trilha do evento fica acesa.
const ACTIVE_MS = 1600;
// Atraso entre a trilha acender e a foto do disco filho trocar.
const PHOTO_SWAP_DELAY = 0.35;

const EVENTS = heroDynamic.events;
const PHOTO_SIZES = "(min-width: 1024px) 144px, 20vw";

type PhotoIndex = Record<PoolId, 0 | 1>;
const FIRST_PHOTOS: PhotoIndex = { medicos: 0, familia: 0, paciente: 0 };

function percent(value: number): string {
  return `${(value / TRAIL_SIZE) * 100}%`;
}

export function HeroNetwork({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // null no servidor; so `true` desliga cascata, compasso e cometas.
  const reduced = useReducedMotion() === true;
  // Sem `once`: fora da tela o compasso para e os cometas saem do DOM; de volta, retomam.
  const inView = useInView(ref);
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  const [comets, setComets] = useState(false);
  // -1 = antes do primeiro compasso (estado do servidor).
  const [step, setStep] = useState(-1);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState<PhotoIndex>(FIRST_PHOTOS);
  const [pulseStep, setPulseStep] = useState<number | null>(null);

  // Cometas por efeito: o primeiro render do cliente tem de bater com o HTML do servidor.
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setComets(true), INTRO_DONE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  // Um unico intervalo, um unico consumidor: nao ha provider de compasso.
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (document.hidden || !inViewRef.current) return;
      setStep((current) => current + 1);
    }, heroDynamic.eventEveryMs);
    return () => window.clearInterval(timer);
  }, [reduced]);

  // Evento com no: trilha acende por ACTIVE_MS e o disco filho troca de foto. Sem no: o hub pulsa.
  useEffect(() => {
    if (step < 0) return;
    const event = EVENTS[step % EVENTS.length];
    const node = event.node;
    if (node === null) {
      setActiveNode(null);
      setPulseStep(step);
      return;
    }
    setActiveNode(node);
    setPhotoIndex((current) => {
      const next = { ...current };
      for (const id of POOL_IDS) {
        if (POOLS[id].trigger === node) next[id] = current[id] === 0 ? 1 : 0;
      }
      return next;
    });
    const timer = window.setTimeout(() => setActiveNode(null), ACTIVE_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <div
      ref={ref}
      data-hero-network=""
      className={cn("relative isolate aspect-square w-full", className)}
    >
      {/* Halo estatico (sem deriva): berry-500 a 28 % atras da rede. */}
      <div
        aria-hidden="true"
        data-hero-halo=""
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(164_69_156/0.28),transparent)]"
      />

      <TrailCluster
        variant="full"
        animate="intro"
        tone="plum"
        emphasis={EMPHASIS}
        comets={comets && inView}
        active={activeNode}
        confirmed={0}
        label={hero.clusterAlt}
      />

      {/* Disco branco do hub com o simbolo (so plum, so sobre branco) e o anel de pulso. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <m.span
          data-hero-mark=""
          className="relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-deep ring-[6px] ring-berry-400/30 lg:h-[104px] lg:w-[104px]"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduced ? INSTANT : { delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <Image
            src="/brand/moorah-mark.png"
            alt=""
            width={194}
            height={265}
            sizes="56px"
            loading="eager"
            className="h-9 w-auto lg:h-14"
          />
          {pulseStep !== null && !reduced ? (
            <m.span
              key={pulseStep}
              data-hub-pulse=""
              data-step={pulseStep}
              className="absolute inset-0 rounded-full border-2 border-berry-300"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
            />
          ) : null}
        </m.span>
      </div>

      {/* Discos de foto: um por pool, centrados no no do svg; o anel do svg aparece em volta. */}
      {POOL_IDS.map((id) => {
        const pool = POOLS[id];
        const geometry = TRAIL_NODES[pool.node];
        if (!geometry) return null;
        const index = photoIndex[id];
        return (
          <div
            key={id}
            data-photo-node={id}
            data-node-index={pool.node}
            data-photo-index={index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: percent(geometry.cx),
              top: percent(geometry.cy),
              width: percent(2 * pool.r - 8),
            }}
          >
            <m.div
              className="relative aspect-square overflow-hidden rounded-full bg-berry-900"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduced ? INSTANT : { delay: DISC_DELAY[id], duration: 0.6, ease: EASE_OUT_EXPO }
              }
            >
              {pool.photos.map((photo, i) => {
                const current = i === index;
                const source = photos[photo.key];
                return (
                  <m.div
                    key={photo.key}
                    data-photo-current={current ? "" : undefined}
                    aria-hidden={current ? undefined : true}
                    className="absolute inset-0"
                    initial={false}
                    animate={current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
                    transition={
                      reduced
                        ? INSTANT
                        : { delay: PHOTO_SWAP_DELAY, duration: 0.9, ease: EASE_IN_OUT_SOFT }
                    }
                  >
                    {/*
                      Next 16 preanuncia no head toda imagem eager, nao so as priority. Por isso
                      so a foto visivel e eager (3 preloads pequenos); a escondida fica lazy e
                      carrega logo depois do layout, sem competir com as fontes.
                    */}
                    <Image
                      src={source.src}
                      alt={current ? source.alt : ""}
                      fill
                      sizes={PHOTO_SIZES}
                      loading={current ? "eager" : "lazy"}
                      className="object-cover"
                      style={{ objectPosition: photo.position }}
                    />
                  </m.div>
                );
              })}
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
