"use client";

import { AnimatePresence, m, useInView, useReducedMotion, type Variants } from "motion/react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mocks, specialties } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Ilustracao do portal do paciente. Ao entrar em vista mostra um skeleton por 900 ms e depois o
  conteudo com um tablist real (Historico, Documentos, Dependentes). Sob reduced motion o
  conteudo aparece direto. O timer pausa quando a aba do navegador fica oculta.
*/

const SKELETON_MS = 900;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

type Phase = "skeleton" | "content";

const TABS = mocks.portalTabs;
type TabIndex = 0 | 1 | 2;

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function rowVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT_EXPO },
    },
  };
}

export interface PortalMockProps {
  className?: string;
}

export function PortalMock({ className }: PortalMockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion() === true;
  const baseId = useId();

  const [phase, setPhase] = useState<Phase>("skeleton");
  const [selected, setSelected] = useState<TabIndex>(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Skeleton demonstrativo: um timer, disparado ao entrar em vista, pausado com document.hidden.
  useEffect(() => {
    if (!inView || phase === "content") return;
    if (reduced) {
      setPhase("content");
      return;
    }
    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };
    const start = () => {
      if (timer !== undefined || document.hidden) return;
      timer = window.setTimeout(() => setPhase("content"), SKELETON_MS);
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [inView, reduced, phase]);

  function tabId(index: number) {
    return `${baseId}-tab-${index}`;
  }
  function panelId(index: number) {
    return `${baseId}-panel-${index}`;
  }

  function select(index: TabIndex, focus: boolean) {
    setSelected(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = (TABS.length - 1) as TabIndex;
    let next: TabIndex | null = null;
    if (event.key === "ArrowRight") next = ((selected + 1) % TABS.length) as TabIndex;
    else if (event.key === "ArrowLeft")
      next = ((selected - 1 + TABS.length) % TABS.length) as TabIndex;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  return (
    <div
      ref={ref}
      data-portal-mock=""
      data-phase={phase}
      className={cn(
        "relative min-h-[280px] rounded-xl border border-gray-200 bg-gray-50 p-3",
        className,
      )}
    >
      {/*
        Sob reduced motion o skeleton sai sem crossfade (remocao sincrona, sem AnimatePresence),
        mas com a mesma marcacao do caminho animado: useReducedMotion e null no servidor e o
        primeiro render do cliente precisa bater com o HTML (hidratacao).
      */}
      {reduced ? (
        phase === "skeleton" ? (
          <m.div
            key="skeleton"
            aria-hidden="true"
            className="absolute inset-3"
            initial={{ opacity: 1 }}
          >
            <SkeletonRows />
          </m.div>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {phase === "skeleton" ? (
            <m.div
              key="skeleton"
              aria-hidden="true"
              className="absolute inset-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <SkeletonRows />
            </m.div>
          ) : null}
        </AnimatePresence>
      )}

      {phase === "content" ? (
        <m.div
          key="content"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone="berry" size="sm" className="max-w-full whitespace-normal text-left">
              {mocks.reminderChip}
            </Badge>
            <span className="inline-flex items-center gap-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
              {mocks.connected}
            </span>
          </div>

          <div
            role="tablist"
            aria-label={mocks.portalTabsLabel}
            className="mt-3 flex flex-wrap gap-1"
            onKeyDown={onKeyDown}
          >
            {TABS.map((label, index) => {
              const active = index === selected;
              return (
                <button
                  key={label}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={active}
                  aria-controls={panelId(index)}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(index as TabIndex, false)}
                  className="min-h-11 rounded-full px-3 text-xs font-semibold text-gray-600 transition-colors duration-200 ease-out-expo hover:text-gray-900 aria-selected:bg-ink aria-selected:text-white sm:min-h-0 sm:py-1.5"
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={panelId(selected)}
            aria-labelledby={tabId(selected)}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: padrao APG de tabs; o painel sem controle focavel recebe tabIndex 0 para o Tab do teclado parar nele.
            tabIndex={0}
            className="mt-3 rounded-control"
          >
            <m.ul
              key={selected}
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {selected === 0 ? <HistoryRows reduced={reduced} /> : null}
              {selected === 1 ? <DocumentRows reduced={reduced} /> : null}
              {selected === 2 ? <DependentRows reduced={reduced} /> : null}
            </m.ul>
          </div>
        </m.div>
      ) : null}
    </div>
  );
}

// Tres barras (tabs) e quatro linhas, no tamanho do conteudo real.
function SkeletonRows() {
  return (
    <>
      <div className="flex gap-2">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-7 w-20" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
      </div>
    </>
  );
}

const ROW =
  "flex items-center justify-between gap-3 rounded-control bg-white px-3 py-2 text-sm text-gray-900 shadow-card";

function HistoryRows({ reduced }: { reduced: boolean }) {
  const variants = rowVariants(reduced);
  return (
    <>
      {specialties.slice(0, 3).map((specialty, index) => (
        <m.li key={specialty.name} variants={variants} className={ROW}>
          <span className="font-medium">{specialty.name}</span>
          {index < 2 ? (
            <Badge
              tone="leaf"
              size="sm"
              // Unica pulsacao permitida na pagina: o ponto da consulta realizada mais recente.
              icon={
                <span
                  aria-hidden="true"
                  data-status-dot={index === 0 ? "live" : "static"}
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500",
                    index === 0 && "animate-pulse-soft",
                  )}
                />
              }
            >
              {mocks.statusDone}
            </Badge>
          ) : (
            <Badge tone="berry" size="sm">
              {mocks.statusScheduled}
            </Badge>
          )}
        </m.li>
      ))}
    </>
  );
}

function DocumentRows({ reduced }: { reduced: boolean }) {
  const variants = rowVariants(reduced);
  return (
    <>
      {mocks.documents.map((doc) => (
        <m.li key={doc} variants={variants} className={ROW}>
          <span className="font-medium">{doc}</span>
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf-700">
            {mocks.signed}
          </span>
        </m.li>
      ))}
    </>
  );
}

function DependentRows({ reduced }: { reduced: boolean }) {
  const variants = rowVariants(reduced);
  return (
    <>
      {mocks.cardHolders.map((holder, index) => {
        const sample = mocks.cardSamples[index] ?? mocks.cardSamples[0];
        return (
          <m.li key={holder.value} variants={variants} className={ROW}>
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-6 w-10 shrink-0 rounded-[4px] bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]"
              />
              <span className="font-medium">{holder.label}</span>
            </span>
            <span className="font-display text-xs font-semibold tabular-nums text-gray-600">
              <span aria-hidden="true">.... </span>
              {sample.slice(-4)}
            </span>
          </m.li>
        );
      })}
    </>
  );
}
