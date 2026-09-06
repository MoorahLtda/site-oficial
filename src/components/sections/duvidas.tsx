import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqSection, site, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";
import { FaqPanel } from "./faq-panel";

const TITLE_ID = "duvidas-titulo";

/*
  Secao Duvidas (brief v4-secoes, 4.6): coluna unica estreita sobre fundo branco, sem eyebrow,
  sem card lateral e sem numeracao. A linha de contato vem DEPOIS do acordeao no DOM e so tem
  <a>, para que o primeiro <button> da secao seja o gatilho de faq[0] (contrato de
  tests/e2e/landing.spec.ts). Nenhum reveal de entrada: o unico movimento e o abrir e fechar
  do acordeao.
*/
export function Duvidas() {
  const whatsapp = site.contact.whatsapp;

  return (
    <Section id="duvidas" surface="light" aria-labelledby={TITLE_ID}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading id={TITLE_ID} title={faqSection.title} />

        <FaqPanel className="mt-10" />

        <p className="mt-10 text-base text-gray-600">
          {faqSection.contactTitle} {faqSection.contactText}{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="font-sans font-semibold text-berry-700 underline decoration-berry-300 underline-offset-4 transition-colors duration-200 hover:decoration-berry-700"
          >
            {site.contact.email}
          </a>
        </p>

        {whatsapp ? (
          <Button variant="secondary" size="sm" asChild className="mt-4">
            <a
              href={whatsappUrl(whatsapp, ui.leadForm.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ui.leadForm.whatsappCta}
            </a>
          </Button>
        ) : null}
      </div>
    </Section>
  );
}
