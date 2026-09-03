"use client";

import { Siren } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { type FaqItem, faq, faqSection } from "@/content/site";
import { cn } from "@/lib/utils";

// Segundo item aberto por padrao: o primeiro gatilho do DOM precisa comecar fechado (contrato e2e).
const DEFAULT_OPEN = "faq-1";
// Ancestral que recebe data-emergency-open (a Section de duvidas.tsx).
const ROOT_SELECTOR = "[data-faq-root]";
const EMERGENCY_ATTR = "data-emergency-open";

function itemValue(index: number): string {
  return `faq-${index}`;
}

// A pergunta de emergencia e a que orienta a ligar para o 192; nao depende da posicao na lista.
function isEmergency(item: FaqItem): boolean {
  return item.a.includes("192");
}

export interface FaqPanelProps {
  className?: string;
}

export function FaqPanel({ className }: FaqPanelProps) {
  const [open, setOpen] = useState<string>(DEFAULT_OPEN);
  const panelRef = useRef<HTMLDivElement>(null);
  const emergencyOpen = faq.some((item, i) => itemValue(i) === open && isEmergency(item));

  // Interacao assinatura: enquanto a pergunta de emergencia esta aberta, o container da secao
  // ganha data-emergency-open="true" e o card lateral do 192 pulsa uma vez (CSS).
  useEffect(() => {
    const root = panelRef.current?.closest(ROOT_SELECTOR);
    if (!root) return;
    if (emergencyOpen) {
      root.setAttribute(EMERGENCY_ATTR, "true");
    } else {
      root.removeAttribute(EMERGENCY_ATTR);
    }
    // Nao deixar a marca no ancestral se o painel sair da tela com a pergunta aberta.
    return () => root.removeAttribute(EMERGENCY_ATTR);
  }, [emergencyOpen]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "rounded-2xl border border-gray-200 bg-white px-5 shadow-card sm:px-8",
        className,
      )}
    >
      <RevealGroup stagger={0.05} amount={0.2}>
        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
          {faq.map((item, i) => {
            const value = itemValue(i);
            const emergency = isEmergency(item);
            return (
              <RevealItem key={value} className="border-b border-gray-200 last:border-b-0">
                <AccordionItem value={value} className="border-b-0">
                  <AccordionTrigger className="min-h-11 data-[state=open]:text-berry-700">
                    <span className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-1 w-6 shrink-0 font-mono text-xs tracking-[0.1em] text-gray-600 tabular-nums transition-colors duration-200 group-data-[state=open]:text-berry-600"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 sm:pr-10">
                    <p className="max-w-prose text-base leading-relaxed text-gray-600">{item.a}</p>
                    {emergency ? (
                      <p className="mt-4">
                        <Badge
                          tone="critical"
                          size="md"
                          icon={
                            <Siren
                              size={14}
                              aria-hidden="true"
                              focusable="false"
                              className="text-critical-500"
                            />
                          }
                        >
                          <span className="font-mono font-bold tabular-nums">192</span>
                          {faqSection.emergencyLabel}
                        </Badge>
                      </p>
                    ) : null}
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
