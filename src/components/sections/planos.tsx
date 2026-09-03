import { Check, CircleCheck, Minus, Siren } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  formatBRL,
  getPlan,
  perPersonCents,
  photos,
  planNotes,
  plansSection,
} from "@/content/site";
import { PlanSelector } from "./plan-selector";

const TITLE_ID = "planos-titulo";
const INCLUDED_ID = "planos-incluido";
const NOT_INCLUDED_ID = "planos-nao-incluido";

const SAMU = "192";

const familiar = getPlan("familiar");
// Ancora de preco ao lado da foto: o valor por pessoa do Familiar, o argumento mais forte da
// secao. Repete de proposito o numero do card, que fica mais abaixo na pagina.
const [CHIP_BEFORE = "", CHIP_AFTER = ""] = plansSection.photoChip.split("{price}");
const FAMILIAR_PER_PERSON = formatBRL(perPersonCents(familiar));
// Meia largura do container de 1200 px no desktop; largura quase total no mobile.
const PHOTO_SIZES = "(min-width: 1024px) 560px, 92vw";

/*
  Foto da familia ao lado do heading, com o chip flutuante do plano Familiar (brief v2, item 1).
  O chip flutua em animate-float-slow (CSS, zerado sob prefers-reduced-motion).
*/
function FamilyPhoto() {
  const photo = photos.familiaSofa;
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
      <div className="group relative aspect-video overflow-hidden rounded-3xl ring-1 ring-black/5">
        <Image
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          sizes={PHOTO_SIZES}
          className="h-full w-full object-cover object-[50%_35%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
        />
      </div>
      <p
        data-plan-chip=""
        className="absolute -bottom-4 left-4 inline-flex animate-float-slow items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-sm text-gray-900 shadow-float lg:left-6"
      >
        <Icon name="users" size={16} className="text-berry-600" />
        {CHIP_BEFORE}
        {FAMILIAR_PER_PERSON}
        {CHIP_AFTER}
      </p>
    </div>
  );
}

// Destaca o "192" em mono bold dentro da frase de emergencia, sem duplicar copy.
function EmergencyText({ text }: { text: string }) {
  const at = text.indexOf(SAMU);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="font-mono font-bold">{SAMU}</span>
      {text.slice(at + SAMU.length)}
    </>
  );
}

// Secao Planos: heading, seletor de pessoas com os dois cards (cliente), notas legais,
// painel "Incluido / Nao esta incluido" e callout de emergencia.
export function Planos() {
  return (
    <Section id="planos" surface="soft" aria-labelledby={TITLE_ID}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <SectionHeading
          id={TITLE_ID}
          eyebrow={plansSection.eyebrow}
          title={plansSection.title}
          description={plansSection.lead}
          className="max-w-[34rem]"
        />
        <FamilyPhoto />
      </div>

      <PlanSelector />

      <div className="mx-auto mt-10 max-w-[960px] space-y-6">
        <div className="space-y-2">
          <p className="text-center text-sm text-gray-600">{planNotes[0]}</p>
          <p className="text-center text-sm text-gray-700">
            {planNotes[1]}
            <a
              href="#duvidas"
              className="ml-1 font-semibold text-berry-700 underline underline-offset-4 transition-colors duration-200 hover:text-berry-800"
            >
              {plansSection.faqLink}
            </a>
          </p>
        </div>

        <Reveal amount={0.2}>
          <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card md:grid-cols-2">
            <div className="p-6 lg:p-8">
              <h3
                id={INCLUDED_ID}
                className="flex items-center gap-2 font-display text-lg font-semibold text-gray-900"
              >
                <CircleCheck size={20} aria-hidden="true" className="shrink-0 text-leaf-600" />
                {plansSection.includedTitle}
              </h3>
              <ul aria-labelledby={INCLUDED_ID} className="mt-4 space-y-2.5">
                {plansSection.included.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-snug text-gray-700">
                    <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-leaf-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-6 md:border-l md:border-t-0 lg:p-8">
              <h3
                id={NOT_INCLUDED_ID}
                className="flex items-center gap-2 font-display text-lg font-semibold text-gray-900"
              >
                <Minus size={20} aria-hidden="true" className="shrink-0 text-gray-500" />
                {plansSection.notIncludedTitle}
              </h3>
              <ul aria-labelledby={NOT_INCLUDED_ID} className="mt-4 space-y-2.5">
                {plansSection.notIncluded.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-snug text-gray-700">
                    <Minus size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-gray-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal amount={0.4} delay={0.1}>
          <p className="flex items-start gap-3 rounded-card border border-critical-500/40 bg-white p-4 text-sm leading-relaxed text-gray-900">
            <Siren size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-critical-500" />
            <span>
              <EmergencyText text={plansSection.emergency} />
            </span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
