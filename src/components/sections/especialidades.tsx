import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { specialties, specialtiesSection } from "@/content/site";

/*
  Secao "Especialidades" (docs/design-brief-v4-secoes.md, 4.3). Superficie soft.
  Indice tipografico: titulo e lead a esquerda (4 colunas em lg), 12 nomes em duas colunas
  a direita, nome grande como h3 e frase logo abaixo. Sem foto, sem cluster, sem hover com
  estado, sem icone, sem numero, sem borda ou fundo por item. Unico movimento: cascata
  rapida dos 12 nomes (RevealGroup como div envolvendo o <ul>, que mantem div > ul > li
  valido; os RevealItem herdam a cascata pela arvore React).
*/

const TITLE_ID = "especialidades-titulo";

export function Especialidades() {
  return (
    <Section
      id="especialidades"
      surface="soft"
      aria-labelledby={TITLE_ID}
      innerClassName="grid gap-12 lg:grid-cols-12 lg:gap-x-16"
    >
      <div className="lg:col-span-4">
        <SectionHeading
          id={TITLE_ID}
          title={specialtiesSection.title}
          description={specialtiesSection.lead}
        />
      </div>

      <RevealGroup as="div" stagger={0.04} amount={0.15} className="lg:col-span-8">
        <ul
          aria-label="Especialidades disponíveis"
          className="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:gap-y-10"
        >
          {specialties.map((specialty) => (
            <RevealItem key={specialty.name} as="li" y={12} duration={400}>
              <h3 className="font-display font-semibold text-xl leading-snug text-gray-900 [hyphens:auto] lg:text-2xl">
                {specialty.name}
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-gray-600">{specialty.blurb}</p>
            </RevealItem>
          ))}
        </ul>
      </RevealGroup>
    </Section>
  );
}
