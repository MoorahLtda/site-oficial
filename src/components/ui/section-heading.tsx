import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  tone?: "light" | "plum";
  as?: "h2" | "h3";
  // id do titulo, para aria-labelledby na Section.
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  tone = "light",
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  const plum = tone === "plum";
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? <p className={cn("eyebrow", plum && "text-berry-300")}>{eyebrow}</p> : null}
      <Heading
        id={id}
        className={cn(
          // Peso 600 e tracking do base CSS (-0.02em): hierarquia por peso e escala, sem aperto extra.
          "font-display font-semibold leading-[1.08] text-3xl sm:text-4xl lg:text-5xl",
          plum ? "text-white" : "text-gray-900",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-4 text-lg sm:text-xl leading-relaxed",
            align === "start" && "max-w-[36rem]",
            plum ? "text-berry-100" : "text-gray-600",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
