import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";
import { heroDynamic, specialties } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Faixa de especialidades abaixo da grade do hero (docs/design-brief-v2.md, 3). Server: e so
  conteudo. O Marquee cuida do loop CSS, da pausa no hover e do estado estatico sob reduced
  motion; o grupo rotulado existe porque o Marquee nao recebe aria-label.
*/

export function HeroMarquee({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset e de formulario; o role group aqui so carrega o rotulo da faixa.
    <div
      role="group"
      aria-label={heroDynamic.stripLabel}
      data-hero-strip=""
      // min-w-0: item de grade com min-width auto herdaria o min-content da faixa e estouraria.
      className={cn("relative w-full min-w-0", className)}
    >
      <Marquee className="py-1">
        {specialties.map((specialty) => (
          <Badge
            key={specialty.name}
            tone="neutral"
            size="md"
            className="gap-2 whitespace-nowrap px-4 py-2 text-[13px]"
            icon={<Icon name={specialty.icon} size={15} className="text-berry-600" />}
          >
            {specialty.name}
          </Badge>
        ))}
      </Marquee>
    </div>
  );
}
