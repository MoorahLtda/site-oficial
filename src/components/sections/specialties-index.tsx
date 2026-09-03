"use client";

import { useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TrailCluster } from "@/components/ui/trail-cluster";
import { manifesto, photos, specialties } from "@/content/site";

export interface SpecialtiesIndexProps {
  // SectionHeading renderizado no servidor; entra na coluna sticky, acima do cluster.
  heading: ReactNode;
}

const LIST_LABEL = "Especialidades disponíveis";

// Coluna sticky de 4/12 do container de 1200 px: cerca de 340 px de largura no desktop.
// Abaixo de lg o bloco nao existe (hidden), por isso o candidato minimo de 1px.
const PHOTO_SIZES = "(min-width: 1024px) 360px, 1px";
// Ultima trilha do cluster mini termina em 1200 ms de desenho mais 600 ms de stagger.
const CLUSTER_DRAW_MS = 1800;

// Sob toque nao ha hover de verdade: o no acenderia e ficaria preso. So mouse e caneta acendem.
function isHoverPointer(event: PointerEvent<HTMLElement>): boolean {
  return event.pointerType !== "touch";
}

function indexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/*
  Interacao assinatura da secao: passar o mouse por uma linha acende o no correspondente da
  Trilha da Amora (data-active no svg, fill berry-500 e trilha engrossada). De mao unica, sem
  botoes e sem foco em elementos nao interativos: toda informacao ja esta na lista.
*/
export function SpecialtiesIndex({ heading }: SpecialtiesIndexProps) {
  const [active, setActive] = useState<number | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(photoRef, { once: true, amount: 0.3 });
  // null no servidor; so `true` desliga o movimento continuo.
  const reduced = useReducedMotion() === true;
  // Cometas so depois do desenho das trilhas, e por efeito (o primeiro render tem de bater
  // com o HTML do servidor).
  const [comets, setComets] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const timer = window.setTimeout(() => setComets(true), CLUSTER_DRAW_MS);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  // Handlers inline por linha: useCallback nao evitaria nada, ja que cada linha cria a sua arrow.
  const handleEnter = (index: number, event: PointerEvent<HTMLElement>) => {
    if (isHoverPointer(event)) setActive(index);
  };

  const handleLeave = (event: PointerEvent<HTMLElement>) => {
    if (isHoverPointer(event)) setActive(null);
  };

  const caption = active === null ? manifesto.hub : specialties[active]?.name;

  return (
    <>
      <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
        {heading}
        {/*
          Foto da coluna sticky com o cluster mini sobreposto em um card branco (brief v2, item 1).
          Fica so no desktop, onde a coluna existe: no mobile a lista assume a secao inteira.
        */}
        <div ref={photoRef} data-specialties-photo="" className="relative mt-10 hidden lg:block">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-black/5">
            <Image
              src={photos.medicaSorrindo.src}
              width={photos.medicaSorrindo.width}
              height={photos.medicaSorrindo.height}
              alt={photos.medicaSorrindo.alt}
              sizes={PHOTO_SIZES}
              className="h-full w-full object-cover object-[50%_22%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
            />
          </div>
          <div className="absolute -bottom-6 -right-3 w-56 rounded-2xl bg-white p-3 shadow-float">
            <TrailCluster variant="mini" animate="draw" active={active} comets={comets} />
            <p
              aria-hidden="true"
              data-cluster-caption=""
              className="mt-2 flex h-4 w-full items-center justify-center overflow-hidden font-mono text-[11px] uppercase tracking-[0.18em] text-gray-600"
            >
              {/* Nome longo (Otorrinolaringologia) chega perto dos 200 px uteis do card: trunca
                  em vez de quebrar em duas linhas dentro da caixa de altura fixa. */}
              <span
                key={caption}
                className={
                  active === null
                    ? "inline-block max-w-full animate-fade-in truncate"
                    : "inline-block max-w-full animate-fade-in truncate text-berry-600"
                }
              >
                {caption}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <RevealGroup stagger={0.05} amount={0.15}>
          <ul aria-label={LIST_LABEL} className="grid gap-x-8 sm:grid-cols-2">
            {specialties.map((specialty, index) => (
              <RevealItem key={specialty.name} as="li" duration={450} y={16}>
                <div
                  data-specialty={index}
                  onPointerEnter={(event) => handleEnter(index, event)}
                  onPointerLeave={handleLeave}
                  className="group -mx-2 flex items-start gap-4 rounded-control border-b border-gray-200 px-2 py-4 transition-[background-color,box-shadow] duration-200 ease-out-expo hover:bg-white hover:shadow-card lg:py-5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-berry-50 text-berry-600 transition-[transform,background-color] duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:bg-berry-100 lg:h-10 lg:w-10">
                    <Icon name={specialty.icon} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-display text-lg font-semibold leading-snug text-gray-900 lg:text-[1.375rem]">
                      {specialty.name}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600 lg:text-base">
                      {specialty.blurb}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="pt-1.5 font-mono text-xs tracking-[0.1em] text-gray-600 transition-colors duration-200 group-hover:text-berry-600"
                  >
                    {indexLabel(index)}
                  </span>
                </div>
              </RevealItem>
            ))}
          </ul>
        </RevealGroup>
      </div>
    </>
  );
}
