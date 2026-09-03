import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Lockup da marca Moorah: simbolo (amora-circuito) + palavra MOORAH, lado a lado ou empilhados.
  Regras do manual: as duas pecas so existem em plum (#4B244D) ou branco, nunca recoloridas,
  nunca distorcidas (a altura manda, a largura e w-auto) e nunca sobre foto.

  Decorativo por padrao (aria-hidden e alt vazio): quem carrega o nome acessivel e o link ou o
  titulo em volta. Passe `label` apenas quando o lockup for a unica referencia a marca naquele
  trecho, como no rodape.
*/

// Dimensoes reais dos arquivos em public/brand: o next/image reserva o espaco pelo aspect-ratio.
const MARK = { width: 194, height: 265 } as const;
const WORDMARK = { width: 518, height: 82 } as const;

export interface BrandLockupProps {
  tone?: "plum" | "white";
  direction?: "row" | "column";
  // Classes de altura, sempre com w-auto no componente. Padrao: 32 px de simbolo, 16 px de palavra.
  markClassName?: string;
  wordmarkClassName?: string;
  // Nome acessivel. Sem ele o lockup sai da arvore de acessibilidade.
  label?: string;
  // priority so no lockup do header (primeira pintura).
  priority?: boolean;
  className?: string;
}

export function BrandLockup({
  tone = "plum",
  direction = "row",
  markClassName = "h-8 w-auto",
  wordmarkClassName = "h-4 w-auto",
  label,
  priority = false,
  className,
}: BrandLockupProps) {
  const suffix = tone === "white" ? "-white" : "";
  const decorative = label === undefined;
  return (
    <div
      data-brand-lockup={tone}
      // role="img" sempre: com label o lockup e uma imagem nomeada, sem label sai da arvore.
      role="img"
      aria-hidden={decorative ? "true" : undefined}
      aria-label={label}
      className={cn(
        "flex",
        direction === "row" ? "items-center gap-2.5" : "flex-col items-start gap-3",
        className,
      )}
    >
      <Image
        src={`/brand/moorah-mark${suffix}.png`}
        alt=""
        width={MARK.width}
        height={MARK.height}
        priority={priority}
        className={markClassName}
      />
      <Image
        src={`/brand/moorah-wordmark${suffix}.png`}
        alt=""
        width={WORDMARK.width}
        height={WORDMARK.height}
        priority={priority}
        className={wordmarkClassName}
      />
    </div>
  );
}
