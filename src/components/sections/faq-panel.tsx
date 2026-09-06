import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content/site";
import { cn } from "@/lib/utils";

// Segundo item aberto por padrao: o primeiro gatilho do DOM precisa comecar fechado (contrato e2e).
const DEFAULT_OPEN = "faq-1";

export interface FaqPanelProps {
  className?: string;
}

/*
  Acordeao das duvidas, sem card em volta e sem numeracao (brief v4-secoes, 4.6). O border-t da
  raiz mais o border-b de cada AccordionItem (em ui/) formam a unica hairline da pagina fora do
  hero: ali a linha demarca o alvo clicavel. Nao controlado (defaultValue): sem hook, sem
  "use client"; o Radix cuida de aria-expanded, aria-controls e teclado.
*/
export function FaqPanel({ className }: FaqPanelProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={DEFAULT_OPEN}
      className={cn("border-t border-gray-200", className)}
    >
      {faq.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`}>
          <AccordionTrigger className="min-h-11 py-5 text-lg data-[state=open]:text-berry-700">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pr-10">
            <p className="max-w-prose text-base leading-relaxed text-gray-600">{item.a}</p>
            {item.link ? (
              <a
                href={item.link.href}
                className="mt-3 inline-block font-semibold text-berry-700 underline underline-offset-4 transition-colors duration-200 hover:text-berry-800"
              >
                {item.link.label}
              </a>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
