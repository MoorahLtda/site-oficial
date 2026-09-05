import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqSection, site, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";
import { FaqPanel } from "./faq-panel";

const TITLE_ID = "duvidas-titulo";

/*
  Secao Duvidas (surface soft). A coluna lateral vem PRIMEIRA no DOM e so tem links, para que o
  primeiro <button> da secao seja o gatilho da primeira pergunta (contrato de tests/e2e/landing.spec.ts).
  A coluna lateral traz apenas o titulo e o card de contato (e-mail e WhatsApp opcional).
*/
export function Duvidas() {
  const whatsapp = site.contact.whatsapp;

  return (
    <Section
      id="duvidas"
      surface="soft"
      aria-labelledby={TITLE_ID}
      innerClassName="grid gap-10 lg:grid-cols-12 lg:gap-12"
    >
      <div className="order-2 self-start space-y-8 lg:sticky lg:top-28 lg:order-1 lg:col-span-4">
        <div>
          <SectionHeading id={TITLE_ID} eyebrow={faqSection.eyebrow} title={faqSection.title} />
        </div>

        <RevealGroup stagger={0.1} className="space-y-4">
          <RevealItem>
            <div
              data-contact=""
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-berry-50 text-berry-600">
                  <Mail size={20} aria-hidden="true" focusable="false" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-snug text-gray-900">
                    {faqSection.contactTitle}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{faqSection.contactText}</p>
                </div>
              </div>
              <a
                href={`mailto:${site.contact.email}`}
                className="mt-4 inline-block break-all font-sans text-sm text-berry-700 underline decoration-berry-300 underline-offset-4 transition-colors duration-200 hover:decoration-berry-700"
              >
                {site.contact.email}
              </a>
              {whatsapp ? (
                <div className="mt-4">
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={whatsappUrl(whatsapp, ui.leadForm.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle
                        size={18}
                        aria-hidden="true"
                        focusable="false"
                        className="text-leaf-600"
                      />
                      {ui.leadForm.whatsappCta}
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>
          </RevealItem>
        </RevealGroup>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-8">
        <FaqPanel />
      </div>
    </Section>
  );
}
