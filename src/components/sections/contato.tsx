import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { TrailCluster } from "@/components/ui/trail-cluster";
import { finalCta, legalNotes, photos, site, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

/*
  CTA final e formulario (docs/design-brief.md, 5.12; brief v2, itens 1 e 2). Segundo bloco plum
  inserido na pagina: a Trilha da Amora em contorno se desenha ao fundo, com cometas correndo pelas
  trilhas, enquanto o texto, a foto e o card branco com o LeadForm entram em cascata.
  Server Component: copy vem de site.ts; o formulario e client e entra por next/dynamic.

  Ritmo do grid (lg:grid-cols-12): texto 5, formulario 4, foto 3. O texto fica com a coluna mais
  larga porque carrega o h2 de 3,5rem; o formulario, com campos empilhados, respira bem em 4; a foto
  entra como retrato estreito na borda direita, alinhada ao topo (lg:self-start). O que sobra abaixo
  dela e justamente o canto inferior direito onde mora a marca d'agua: assim o simbolo grande nunca
  cruza a foto, o formulario, o texto ou os botoes, em nenhuma altura de formulario.

  Ordem: no mobile o DOM ja entrega texto, foto e formulario (a foto acima do formulario, como pede
  o brief); no desktop as classes order trocam a foto e o formulario de lugar.
*/

const HEADING_ID = "contato-titulo";

const PHOTO = photos.medicaHeadset;
// Coluna de 3/12 no container de 1200 px (padding 2rem, gap-8): cerca de 260 px.
const PHOTO_SIZES = "(min-width: 1024px) 280px, 92vw";

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
      innerClassName="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8"
    >
      {/* Fundo: trilha de circuito em contorno, a 25%, desenhando ao entrar em vista (so desktop). */}
      <TrailCluster
        variant="outline"
        animate="draw"
        comets
        className="pointer-events-none absolute -left-24 top-1/2 z-0 hidden w-[520px] -translate-y-1/2 opacity-25 lg:block"
      />

      <div className="relative z-10 lg:col-span-5">
        <Reveal duration={600} y={24}>
          <BrandLockup tone="white" className="opacity-90" />
          <p className="eyebrow mt-6 text-berry-300">{finalCta.eyebrow}</p>
          <h2
            id={HEADING_ID}
            className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            {finalCta.title}
          </h2>
          <p className="mt-6 max-w-[32rem] text-lg leading-relaxed text-berry-100 lg:text-xl">
            {finalCta.text}
          </p>
        </Reveal>

        <Reveal delay={0.12} duration={600} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="plum" size="lg" asChild className="w-full sm:w-auto">
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
        </Reveal>
      </div>

      {/* Foto: retrato no desktop, paisagem no mobile (a origem e paisagem, corta menos). */}
      <Reveal
        delay={0.16}
        duration={600}
        y={24}
        className="relative z-10 order-2 lg:order-3 lg:col-span-3 lg:self-start"
      >
        <div className="group relative aspect-[3/2] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 lg:aspect-[4/5]">
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            width={PHOTO.width}
            height={PHOTO.height}
            sizes={PHOTO_SIZES}
            className="h-full w-full object-cover object-[50%_30%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
          />
        </div>

        {/*
          Marca d'agua: simbolo branco grande no canto inferior direito do bloco, sobre a superficie
          lisa do gradiente plum. Ancorado abaixo da foto (top-full) e alinhado a borda direita dela,
          de modo que nao cruza a foto, o formulario, o texto nem os botoes em nenhuma altura de
          formulario. Sangra para baixo e o overflow-hidden do bloco plum corta. So no desktop: no
          mobile a pilha termina no formulario e nao existe canto livre.
        */}
        <Image
          data-brand-watermark=""
          aria-hidden="true"
          src="/brand/moorah-mark-white.png"
          alt=""
          width={194}
          height={265}
          className="pointer-events-none absolute right-0 top-full mt-8 hidden h-[265px] w-auto select-none opacity-[0.07] lg:block"
        />
      </Reveal>

      <Reveal
        delay={0.2}
        duration={600}
        y={24}
        className="relative z-10 order-3 lg:order-2 lg:col-span-4"
      >
        <div
          data-lead-card=""
          className="rounded-2xl bg-white p-6 text-gray-900 shadow-deep sm:p-8"
        >
          <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900">
            {ui.leadForm.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{ui.leadForm.subtitle}</p>
          <LeadForm defaultPlan="familiar" className="mt-6" />
          <p className="mt-5 flex items-start gap-2 text-[13px] leading-snug text-gray-600">
            <Icon name="shield-check" size={14} className="mt-0.5 shrink-0 text-berry-600" />
            <span>{legalNotes[0]}</span>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
