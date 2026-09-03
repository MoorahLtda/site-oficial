import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "berry" | "leaf" | "neutral" | "plum" | "critical";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  // leaf so para confirmacoes; berry para destaque comercial; critical para o bloco 192.
  tone?: BadgeTone;
  size?: BadgeSize;
  // Icone ja com aria-hidden (Icon ou lucide direto).
  icon?: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  berry: "bg-berry-500 text-white",
  leaf: "bg-leaf-50 text-leaf-700 border border-leaf-200",
  neutral: "bg-gray-100 text-gray-700",
  plum: "bg-white/10 text-berry-100 border border-white/15",
  critical: "bg-white text-gray-900 border border-critical-500/40",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-[11px]",
  md: "px-3 py-1 text-xs",
};

export function Badge({
  tone = "neutral",
  size = "md",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-sans font-semibold",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
