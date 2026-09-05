import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { HeroAlt } from "@/components/sections/hero-alt";

/*
  Preview interno da variante "Sala de casa" (docs/design-brief-v4-hero.md, secao 3.4): so header
  e hero, sem outras secoes, sem rodape, sem barra mobile e sem link para esta rota em lugar nenhum
  da home. Os CTAs levam as ancoras da home (prefixo "/"). Nao indexavel.
*/

export const metadata: Metadata = {
  title: "Preview · hero alternativo",
  robots: { index: false, follow: false, nocache: true },
};

export default function HeroAltPreview() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        <HeroAlt linkPrefix="/" />
      </main>
    </>
  );
}
