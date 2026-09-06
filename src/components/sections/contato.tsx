import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { finalCta, site, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

/*
  Fechamento (docs/design-brief-v4-secoes.md, 4.7). Bloco plum com texto a esquerda e o card
  branco do formulario a direita; a secao passou a ter um destino principal, o formulario:
  "Escolher meu plano" e o WhatsApp sao secundarios (outline-light), e o card diz o que acontece
  ("Fale com a Moorah", "Deixe seu contato e a Moorah retorna por e-mail.", botao "Enviar").
  Sairam a Trilha da Amora, o BrandLockup, o eyebrow e a foto de banco. Server Component: copy vem
  de site.ts; o formulario e client e entra por next/dynamic.

  Unico movimento da secao: o fade-up do card do formulario. Texto e botoes estaticos.
*/

const HEADING_ID = "contato-titulo";

// O formulario so entra no bundle quando o chunk cliente da secao carrega.
const LeadForm = dynamic(() => import("@/components/ui/lead-form").then((mod) => mod.LeadForm), {
  loading: () => <LeadFormSkeleton />,
});

// Reserva a altura dos cinco campos (nome, e-mail, WhatsApp, plano, consentimento) para evitar CLS.
function LeadFormSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 space-y-4">
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
      <div className="skeleton h-12" />
    </div>
  );
}

export function Contato() {
  const whatsapp = site.contact.whatsapp;

  return (
    <Section
      id="contato"
      surface="plum"
      aria-labelledby={HEADING_ID}
      innerClassName="relative grid gap-12 lg:grid-cols-12 lg:gap-x-12 lg:items-start"
    >
      {/* Coluna de texto: estatica (nada de conversao espera hidratacao para aparecer). */}
      <div data-contact-copy="" className="relative z-10 lg:col-span-6 lg:pr-8">
        <h2
          id={HEADING_ID}
          className="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[3.5rem]"
        >
          {finalCta.title}
        </h2>
        <p className="mt-6 max-w-[32rem] text-lg leading-relaxed text-berry-100 lg:text-xl">
          {finalCta.text}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline-light" size="lg" asChild className="w-full sm:w-auto">
            <a href="#planos">{finalCta.primaryCta}</a>
          </Button>
          {whatsapp ? (
            <Button variant="outline-light" size="lg" asChild className="w-full sm:w-auto">
              <a
                href={whatsappUrl(whatsapp, ui.leadForm.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} aria-hidden="true" focusable="false" />
                {ui.leadForm.whatsappCta}
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      {/*
        Marca d'agua: simbolo branco no canto inferior esquerdo do bloco, sobre o gradiente plum
        liso (permitida pelo manual: nao e fotografia). Abaixo da coluna de texto, que e self-start
        e termina antes da base porque o formulario e mais alto; o overflow-hidden do bloco plum
        corta a sangria de -bottom-24. Comeca em xl (1280+): em 1024 o h2 em 3,5rem quebra em tres
        linhas e a folga ate a base fica pequena (brief 4.7). O e2e mede a folga real.
      */}
      <Image
        data-brand-watermark=""
        aria-hidden="true"
        src="/brand/moorah-mark-white.png"
        alt=""
        width={194}
        height={265}
        className="pointer-events-none absolute -bottom-24 left-0 hidden h-[200px] w-auto select-none opacity-[0.07] xl:block"
      />

      {/* Unico movimento da secao: o card do formulario sobe e aparece (600 ms, delay 100 ms). */}
      <Reveal
        delay={0.1}
        duration={600}
        y={24}
        className="relative z-10 lg:col-span-5 lg:col-start-8"
      >
        <div
          data-lead-card=""
          className="rounded-2xl bg-white p-6 text-gray-900 shadow-deep sm:p-8"
        >
          <h3 className="font-display text-2xl font-semibold text-gray-900">{ui.leadForm.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{ui.leadForm.subtitle}</p>
          <LeadForm defaultPlan="familiar" className="mt-6" />
        </div>
      </Reveal>
    </Section>
  );
}
