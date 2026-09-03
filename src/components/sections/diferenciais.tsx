import { Icon } from "@/components/icons";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { differentiators, differentiatorsSection } from "@/content/site";

const TITLE_ID = "diferenciais-titulo";

/*
  Secao 5.10 do brief: quatro colunas editoriais, cada uma aberta por uma hairline
  que se desenha da esquerda para a direita (scaleX 0 -> 1, 500 ms, ease-in-out-soft)
  enquanto o conteudo sobe em fade-up (450 ms). O stagger de 150 ms vem do RevealGroup
  e a hairline, por ser neta do grupo, herda o mesmo atraso do seu item.
  Server Component: os unicos trechos cliente sao os primitivos Reveal.
*/
export function Diferenciais() {
  return (
    <Section id="diferenciais" surface="light" aria-labelledby={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        eyebrow={differentiatorsSection.eyebrow}
        title={differentiatorsSection.title}
        className="max-w-2xl"
      />

      <RevealGroup
        as="ul"
        stagger={0.15}
        amount={0.4}
        className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
      >
        {differentiators.map((item, i) => (
          <RevealItem
            key={item.title}
            as="li"
            duration={450}
            y={16}
            className="relative flex flex-col pt-6"
          >
            {/* Hairline que se desenha; o wrapper estatico garante aria-hidden e a posicao. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5">
              <RevealItem
                as="span"
                variant="line"
                duration={500}
                className="block h-full w-full origin-left bg-ink"
              />
            </span>

            <span className="font-mono text-xs tracking-[0.1em] text-gray-600">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="mt-4 grid h-10 w-10 place-items-center rounded-full bg-berry-50 text-berry-600">
              <Icon name={item.icon} size={22} />
            </span>

            <h3 className="mt-4 font-display font-semibold text-xl lg:text-[1.375rem] leading-snug text-gray-900">
              {item.title}
            </h3>
            <p className="mt-2 max-w-[28rem] text-base leading-relaxed text-gray-600">
              {item.text}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
