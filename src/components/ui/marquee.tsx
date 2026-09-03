import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  // Duracao de um ciclo, em segundos (padrao vem de --animate-marquee: 44s).
  speed?: number;
  className?: string;
  children?: ReactNode;
}

// Faixa continua em CSS puro (animate-marquee), pausa no hover e fica estatica sob
// reduced motion. Reservada para logos de parceiros autorizados; nao entra na v1.
export function Marquee({ speed, className, children }: MarqueeProps) {
  return (
    <div
      className={cn(
        // w-full + min-w-0: como item de flex ou grid, a faixa nunca empurra a largura do pai
        // (o filho `w-max` mediria centenas de px de min-content e estouraria a coluna).
        "group relative w-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      {/*
        As duas copias sao identicas e cada uma carrega o gap final (pr-8), entao a largura total
        e exatamente o dobro de uma copia e o translateX(-50%) cai no inicio da segunda copia,
        sem o salto de meio gap por ciclo. Sob reduced motion a copia sai e a primeira quebra linha.
      */}
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
        style={speed ? { animationDuration: `${speed}s` } : undefined}
      >
        <div className="flex gap-8 pr-8 motion-reduce:flex-wrap motion-reduce:pr-0">{children}</div>
        <div aria-hidden="true" className="flex gap-8 pr-8 motion-reduce:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
