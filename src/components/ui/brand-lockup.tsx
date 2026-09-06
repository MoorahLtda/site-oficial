import Image from "next/image";
import { cn } from "@/lib/utils";

/*
  Lockup da marca Moorah: simbolo (amora-circuito) + palavra MOORAH, lado a lado ou empilhados.
  Regras do manual: as duas pecas so existem em plum (#4B244D) ou branco, nunca recoloridas,
  nunca distorcidas (a altura manda, a largura e w-auto) e nunca sobre foto.

  Decorativo por padrao (aria-hidden e alt vazio): quem carrega o nome acessivel e o link ou o
  titulo em volta. Passe `label` apenas quando o lockup for a unica referencia a marca naquele
  trecho, como no rodape.

  Sem consumidor hoje: os dois blocos plum que o usavam (cartao.tsx, fundido em beneficios.tsx, e
  contato.tsx) deixaram de repetir a marca dentro da secao no brief v4-secoes (4.4 e 4.7). O
  primitivo fica de pe para o proximo bloco que precise do lockup completo.

  Os outros tres lockups da pagina NAO foram migrados, de proposito:

  - header.tsx: as duas imagens sao filhas diretas do <Link>, que ja e o flex, carrega gap-2.5,
    h-11 de alvo de toque e o aria-label da marca. Migrar acrescenta um <div> entre o link e as
    imagens e obriga a mover o flex do link para o primitivo. As alturas responsivas
    (h-6 sm:h-7 lg:h-8) e o priority nas duas pecas ja cabem nas props; o impedimento e a
    estrutura, nao a API. Vale migrar junto com uma revisao dos testes do header.
  - footer.tsx: e vertical com gap-3, o que o primitivo faz. A diferenca e de acessibilidade: la o
    nome vive no alt do wordmark (um <img> nomeado), aqui viveria no grupo via `label` (role="img"
    com alt vazio nas duas pecas). Os dois caminhos sao validos, mas trocar muda qual elemento
    carrega o nome e o teste do rodape afirma "exatamente um img com nome acessivel".
  - o hero v4 (hero.tsx): usa a marca so no header fixo acima dele; nao repete o lockup dentro
    do bloco plum.
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
        // gap-2 e o espacamento dos dois blocos plum; o header usa 2.5 e passa por className.
        direction === "row" ? "items-center gap-2" : "flex-col items-start gap-3",
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
