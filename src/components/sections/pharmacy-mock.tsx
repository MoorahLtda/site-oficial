"use client";

import { Check } from "lucide-react";
import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mocks } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Ilustracao do balcao da farmacia: o numero do cartao e digitado (um digito a cada 70 ms) e,
  ao terminar, o selo "Cartao reconhecido" confirma em leaf. Um unico intervalo, disparado ao
  entrar em vista, pausado com document.hidden e limpo no unmount. Sem percentual de desconto.
*/

const DIGIT_MS = 70;
const SAMPLE = mocks.cardSamples[0];
const DIGITS = SAMPLE.split("");
const TOTAL = DIGITS.length;
const GROUPS = [DIGITS.slice(0, 4), DIGITS.slice(4, 8), DIGITS.slice(8, 12)] as const;
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export interface PharmacyMockProps {
  className?: string;
}

export function PharmacyMock({ className }: PharmacyMockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion() === true;
  const [shown, setShown] = useState(0);
  const done = shown >= TOTAL;

  useEffect(() => {
    if (!inView || done) return;
    if (reduced) {
      setShown(TOTAL);
      return;
    }
    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const start = () => {
      if (timer !== undefined || document.hidden) return;
      timer = window.setInterval(
        () => setShown((current) => Math.min(current + 1, TOTAL)),
        DIGIT_MS,
      );
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [inView, reduced, done]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-pharmacy-mock=""
      className={cn("rounded-xl border border-gray-200 bg-gray-50 p-3", className)}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-600">
        {mocks.cardNumberField}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <div
          data-card-digits=""
          data-shown={shown}
          className="flex h-11 min-w-0 flex-1 items-center rounded-control border border-gray-300 bg-white px-3 font-mono text-sm tracking-[0.12em] text-gray-900"
        >
          <span className="flex gap-2 tabular-nums">
            {GROUPS.map((group, groupIndex) => (
              <span key={group.join("")} className="flex">
                {group.map((digit, digitIndex) => {
                  const index = groupIndex * 4 + digitIndex;
                  const visible = index < shown;
                  return (
                    <span
                      key={`${index}-${digit}`}
                      data-digit={index}
                      className={cn(
                        "inline-block w-[1ch] transition-opacity duration-150 ease-out-expo",
                        visible ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {digit}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
          {/* Cursor estatico enquanto digita; some ao terminar (sem piscar). */}
          <span
            className={cn(
              "ml-0.5 h-4 w-px bg-berry-500 transition-opacity duration-150",
              done ? "opacity-0" : "opacity-100",
            )}
          />
        </div>
      </div>
      <div className="mt-2 flex min-h-6 items-center">
        {done ? (
          <m.span
            initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT_EXPO }}
            className="inline-flex origin-left"
          >
            <Badge tone="leaf" size="sm" icon={<Check size={12} aria-hidden="true" />}>
              {mocks.cardRecognized}
            </Badge>
          </m.span>
        ) : null}
      </div>
    </div>
  );
}
