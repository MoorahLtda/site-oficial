import Image from "next/image";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

/*
  Placeholder da rota enquanto o servidor responde (docs/design-brief.md, secao 8): esqueleto do
  hero (texto a esquerda, palco redondo a direita) seguido de tres secoes genericas. Server
  Component sem headings, para nao competir com o h1 da pagina real. role="status" da suporte
  valido ao aria-label e ao aria-busy. SectionSkeleton ja traz o proprio container-x, por isso
  fica fora do container do hero. O simbolo plum no topo (brief v2, item 2) da presenca a marca
  durante a espera: decorativo (`aria-hidden`, alt vazio) e com a unica pulsacao permitida.
*/
export default function Loading() {
  return (
    <div role="status" aria-busy="true" aria-label="Carregando">
      <div className="container-x pt-32">
        <Image
          src="/brand/moorah-mark.png"
          alt=""
          aria-hidden="true"
          width={194}
          height={265}
          className="h-12 w-auto animate-pulse-soft"
        />
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton mt-6 h-14 w-full max-w-xl" />
            <div className="skeleton mt-3 h-14 w-4/5" />
            <div className="skeleton mt-8 h-6 w-full max-w-md" />
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="skeleton h-12 w-40 rounded-full" />
              <div className="skeleton h-12 w-40 rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="skeleton aspect-square w-full max-w-[560px] rounded-full" />
          </div>
        </div>
      </div>
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
