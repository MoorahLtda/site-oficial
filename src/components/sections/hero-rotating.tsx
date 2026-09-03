"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { heroDynamic } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Segunda linha do H1 (docs/design-brief-v2.md, 3): alterna heroDynamic.rotating a cada
  rotateEveryMs com AnimatePresence mode="wait".

  Tres cuidados:
  1. `initial={false}` no AnimatePresence faz o primeiro filho nascer no estado final, entao a
     primeira frase sai visivel do HTML do servidor (e o primeiro render do cliente e igual).
  2. Todas as frases ficam empilhadas na mesma celula da grade, invisiveis, reservando a altura
     da mais alta: a troca nunca mexe no layout (sem CLS), mesmo quando uma frase quebra em duas
     linhas no mobile.
  3. O bloco e aria-hidden; a frase completa fica em sr-only no h1 (hero.title).
*/

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
const PHRASES = heroDynamic.rotating;
const DURATION = 0.45;
const SHIFT = 16;

export function RotatingWord({ className }: { className?: string }) {
  // null no servidor; so `true` congela a troca.
  const reduced = useReducedMotion() === true;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || PHRASES.length < 2) return;
    const timer = window.setInterval(() => {
      // Aba escondida: nao gasta frame nem adianta a fila de frases.
      if (document.hidden) return;
      setIndex((current) => (current + 1) % PHRASES.length);
    }, heroDynamic.rotateEveryMs);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const phrase = PHRASES[index];

  return (
    <span
      aria-hidden="true"
      data-hero-rotating=""
      data-phrase={index}
      className={cn("inline-grid min-h-[1.05em] align-top", className)}
    >
      {PHRASES.map((item) => (
        <span key={item} data-rotating-sizer="" className="invisible col-start-1 row-start-1">
          {item}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={phrase}
          data-rotating-active=""
          className="col-start-1 row-start-1 text-gradient-berry"
          initial={{ opacity: 0, y: SHIFT }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -SHIFT }}
          transition={{ duration: DURATION, ease: EASE_OUT_EXPO }}
        >
          {phrase}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
