import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export type SectionSurface = "light" | "soft" | "plum";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string;
  surface?: SectionSurface;
  // Aplicado no Container interno (grids, gaps).
  innerClassName?: string;
  // true = nao envolve os filhos em Container.
  bleed?: boolean;
}

const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";

function wrap(children: ReactNode, bleed: boolean, innerClassName?: string) {
  if (bleed) return children;
  return <Container className={innerClassName}>{children}</Container>;
}

export function Section({
  id,
  surface = "light",
  innerClassName,
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  if (surface === "plum") {
    // Bloco de peso inserido na pagina, com margem e cantos rounded-3xl (nunca faixa infinita).
    return (
      <section
        id={id}
        className={cn("scroll-mt-20 px-3 py-3 sm:px-4 lg:px-6", className)}
        {...props}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl py-20 text-white sm:py-24 lg:py-28",
            PLUM_GRADIENT,
          )}
        >
          {wrap(children, bleed, innerClassName)}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 py-20 sm:py-24 lg:py-28",
        surface === "soft" ? "bg-gray-50" : "bg-white",
        className,
      )}
      {...props}
    >
      {wrap(children, bleed, innerClassName)}
    </section>
  );
}
