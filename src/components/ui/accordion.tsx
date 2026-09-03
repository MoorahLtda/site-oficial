"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type AccordionProps = ComponentProps<typeof RadixAccordion.Root>;

// Raiz: repassa type, collapsible, defaultValue, value e onValueChange ao Radix.
export function Accordion({ className, ...props }: AccordionProps) {
  return <RadixAccordion.Root className={cn("w-full", className)} {...props} />;
}

export type AccordionItemProps = ComponentProps<typeof RadixAccordion.Item>;

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <RadixAccordion.Item className={cn("border-b border-gray-200", className)} {...props} />;
}

export type AccordionTriggerProps = ComponentProps<typeof RadixAccordion.Trigger>;

// Header vira <h3>; Radix cuida de aria-expanded, aria-controls e teclado.
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <RadixAccordion.Header asChild>
      <h3 className="m-0 flex">
        <RadixAccordion.Trigger
          className={cn(
            "group flex w-full items-start justify-between gap-4 py-5 text-left font-display text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-berry-700",
            className,
          )}
          {...props}
        >
          <span className="flex-1">{children}</span>
          <Plus
            size={20}
            aria-hidden="true"
            focusable="false"
            className="mt-1 shrink-0 text-berry-600 transition-transform duration-250 ease-out-expo group-data-[state=open]:rotate-45"
          />
        </RadixAccordion.Trigger>
      </h3>
    </RadixAccordion.Header>
  );
}

export type AccordionContentProps = ComponentProps<typeof RadixAccordion.Content>;

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  return (
    <RadixAccordion.Content
      className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div className={cn("pb-5 leading-relaxed text-gray-700", className)}>{children}</div>
    </RadixAccordion.Content>
  );
}
