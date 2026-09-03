import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorks, steps } from "@/content/site";
import { StepsTrail } from "./steps-trail";

const TITLE_ID = "como-funciona-titulo";

// Secao "Como funciona" (brief 5.5): titulo centrado e trilha de quatro passos.
// Server Component; a parte animada vive em steps-trail.tsx.
export function ComoFunciona() {
  return (
    <Section id="como-funciona" surface="light" aria-labelledby={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        align="center"
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        description={howItWorks.lead}
      />
      <StepsTrail steps={steps} className="mt-14" />
    </Section>
  );
}
