import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { lgpd } from "@/content/legal/lgpd";

/*
  LGPD e seus direitos: pagina explicativa que complementa a Politica de privacidade.
  Conteudo em src/content/legal/lgpd.ts; layout em LegalPage.
*/

export const metadata: Metadata = {
  title: lgpd.title,
  description: lgpd.description,
  alternates: { canonical: "/lgpd" },
};

export default function LgpdPage() {
  return <LegalPage doc={lgpd} />;
}
