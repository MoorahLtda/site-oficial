"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export type DialogVariant = "center" | "sheet";

export interface DialogContentProps extends ComponentProps<typeof RadixDialog.Content> {
  // sheet = folha lateral direita (menu mobile).
  variant?: DialogVariant;
  // Obrigatorio: nome acessivel do dialog (DialogTitle).
  title: string;
  titleSrOnly?: boolean;
  description?: string;
}

const variantClasses: Record<DialogVariant, string> = {
  center:
    "fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-deep sm:p-8 data-[state=open]:animate-zoom-in",
  sheet:
    "fixed inset-y-0 right-0 z-[70] flex w-[86vw] max-w-sm flex-col bg-white p-6 shadow-deep data-[state=open]:animate-slide-in-right",
};

// Overlay e conteudo animam por CSS (data-state); o CSS global zera sob reduced motion.
export function DialogContent({
  variant = "center",
  title,
  titleSrOnly = false,
  description,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[60] bg-berry-950/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <RadixDialog.Content
        className={cn("outline-none", variantClasses[variant], className)}
        // Sem descricao, o Radix avisa no console a menos que o atributo venha explicitamente undefined.
        {...(description ? {} : { "aria-describedby": undefined })}
        {...props}
      >
        <RadixDialog.Close
          type="button"
          aria-label="Fechar"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
        >
          <X size={20} aria-hidden="true" focusable="false" />
        </RadixDialog.Close>
        <RadixDialog.Title
          className={cn(
            titleSrOnly ? "sr-only" : "pr-12 font-display text-2xl font-bold text-gray-900",
          )}
        >
          {title}
        </RadixDialog.Title>
        {description ? (
          <RadixDialog.Description className="mt-1 text-sm text-gray-600">
            {description}
          </RadixDialog.Description>
        ) : null}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
