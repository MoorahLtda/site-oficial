import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { faq, specialtiesSection } from "@/content/site";
import { SpecialtiesIndex } from "./specialties-index";

const TITLE_ID = "especialidades-titulo";

/*
  Secao 5.6 do brief: superficie soft, coluna esquerda sticky (heading + Trilha da Amora mini)
  e indice de 12 especialidades em duas colunas. O heading e renderizado aqui (server) e entra
  na coluna sticky do componente cliente via prop, para que o estado de hover da lista e o no
  aceso do cluster vivam no mesmo lugar.
*/
export function Especialidades() {
  return (
    <Section
      id="especialidades"
      surface="soft"
      aria-labelledby={TITLE_ID}
      innerClassName="grid gap-12 lg:grid-cols-12 lg:gap-x-14"
    >
      <SpecialtiesIndex
        heading={
          <SectionHeading
            id={TITLE_ID}
            eyebrow={specialtiesSection.eyebrow}
            title={specialtiesSection.title}
            description={faq[2].a}
          />
        }
      />
    </Section>
  );
}
