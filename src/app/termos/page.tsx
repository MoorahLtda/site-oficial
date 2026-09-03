import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { termos } from "@/content/legal/termos";

/*
  Termos de uso. Conteudo em src/content/legal/termos.ts; layout em LegalPage.
*/

export const metadata: Metadata = {
  title: termos.title,
  description: termos.description,
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return <LegalPage doc={termos} />;
}
