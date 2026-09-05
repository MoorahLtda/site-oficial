"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { faq } from "@/content/site";
import { cn } from "@/lib/utils";

// Segundo item aberto por padrao: o primeiro gatilho do DOM precisa comecar fechado (contrato e2e).
const DEFAULT_OPEN = "faq-1";

function itemValue(index: number): string {
  return `faq-${index}`;
}

export interface FaqPanelProps {
  className?: string;
}

export function FaqPanel({ className }: FaqPanelProps) {
  const [open, setOpen] = useState<string>(DEFAULT_OPEN);

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white px-5 shadow-card sm:px-8",
        className,
      )}
    >
      <RevealGroup stagger={0.05} amount={0.2}>
        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
          {faq.map((item, i) => {
            const value = itemValue(i);
            return (
              <RevealItem key={value} className="border-b border-gray-200 last:border-b-0">
                <AccordionItem value={value} className="border-b-0">
                  <AccordionTrigger className="min-h-11 data-[state=open]:text-berry-700">
                    <span className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-1 w-6 shrink-0 font-display text-xs font-semibold text-gray-600 tabular-nums transition-colors duration-200 group-data-[state=open]:text-berry-600"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 sm:pr-10">
                    <p className="max-w-prose text-base leading-relaxed text-gray-600">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              </RevealItem>
            );
          })}
        </Accordion>
      </RevealGroup>
    </div>
  );
}
