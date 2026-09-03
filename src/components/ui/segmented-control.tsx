"use client";

import { type KeyboardEvent, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: readonly SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  // aria-label do grupo.
  label: string;
  tone?: "light" | "plum";
  // lg = alvo de 52 px (mobile).
  size?: "md" | "lg";
  className?: string;
}

const groupTone = {
  light: "border-gray-200 bg-white",
  plum: "border-white/15 bg-white/10",
} as const;

const optionTone = {
  light: "text-gray-700 hover:text-gray-900 aria-checked:bg-ink aria-checked:text-white",
  plum: "text-berry-100 hover:text-white aria-checked:bg-white aria-checked:text-ink",
} as const;

const optionSize = {
  md: "h-11 min-w-11 px-4 text-sm",
  lg: "h-[52px] min-w-[52px] flex-1 px-5 text-base",
} as const;

// Radiogroup com roving tabindex: so a opcao marcada entra na ordem de tabulacao;
// setas, Home e End movem selecao e foco juntos. Sem pilula deslizante: a troca e por CSS.
export function SegmentedControl({
  options,
  value,
  onValueChange,
  label,
  tone = "light",
  size = "md",
  className,
}: SegmentedControlProps) {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  function select(index: number) {
    const option = options[index];
    if (!option) return;
    onValueChange(option.value);
    buttonsRef.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = options.findIndex((o) => o.value === value);
    const last = options.length - 1;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = current >= last ? 0 : current + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = current <= 0 ? last : current - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex max-w-full rounded-full border p-1",
        size === "lg" && "w-full",
        groupTone[tone],
        className,
      )}
    >
      {options.map((option, index) => {
        const checked = option.value === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: padrao ARIA de radiogroup com botoes e roving tabindex (brief 4.7); input radio nativo nao permite o estilo de segmento.
          <button
            key={option.value}
            ref={(el) => {
              buttonsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "rounded-full font-display font-bold transition-colors duration-200",
              optionSize[size],
              optionTone[tone],
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
