import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { privacidade } from "@/content/legal/privacidade";

/*
  Politica de privacidade. Conteudo em src/content/legal/privacidade.ts; layout em LegalPage.
*/

export const metadata: Metadata = {
  title: privacidade.title,
  description: privacidade.description,
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return <LegalPage doc={privacidade} />;
}
