"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { formatBRL, getPlan, type PlanId } from "@/content/site";
import { Button, type ButtonProps } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

// O formulario so entra no bundle quando o primeiro dialog abre.
const LeadForm = dynamic(() => import("./lead-form").then((mod) => mod.LeadForm), {
  loading: () => <LeadFormSkeleton />,
});

function LeadFormSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 space-y-4">
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
    </div>
  );
}

export interface LeadDialogButtonProps extends Omit<ButtonProps, "asChild"> {
  plan: PlanId;
  // Padrao: getPlan(plan).cta
  label?: string;
}

// Botao que abre um Dialog central com o LeadForm ja no plano escolhido.
// Cada botao tem o proprio estado; nao ha store global.
export function LeadDialogButton({ plan, label, children, ...buttonProps }: LeadDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const data = getPlan(plan);
  const description = `${data.peopleLabel}. ${formatBRL(data.priceCents)} por mês.`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" {...buttonProps}>
          {children ?? label ?? data.cta}
        </Button>
      </DialogTrigger>
      <DialogContent variant="center" title={data.cta} description={description}>
        <LeadForm defaultPlan={plan} className="mt-6" />
      </DialogContent>
    </Dialog>
  );
}
