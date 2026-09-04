import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";
import { heroDynamic, specialties } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Faixa de especialidades abaixo da grade do hero (docs/design-brief-v2.md, 3). Server: e so
  conteudo. O Marquee cuida do loop CSS, da pausa no hover e do estado estatico sob reduced
  motion; o grupo rotulado existe porque o Marquee nao recebe aria-label.

  `tone` plum (hero v3): chips translucidos do Badge sobre o bloco escuro e icones berry-300.
  `speed` e repassado ao Marquee (segundos por ciclo; 64 s vira textura, nao chamariz).
*/

export type HeroMarqueeTone = "light" | "plum";

const CHIP_TONE: Record<HeroMarqueeTone, { badge: "neutral" | "plum"; icon: string }> = {
  light: { badge: "neutral", icon: "text-berry-600" },
  plum: { badge: "plum", icon: "text-berry-300" },
};

export interface HeroMarqueeProps {
  tone?: HeroMarqueeTone;
  speed?: number;
  className?: string;
}

export function HeroMarquee({ tone = "light", speed, className }: HeroMarqueeProps) {
  const chip = CHIP_TONE[tone];
  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset e de formulario; o role group aqui so carrega o rotulo da faixa.
    <div
      role="group"
      aria-label={heroDynamic.stripLabel}
      data-hero-strip=""
      // min-w-0: item de grade com min-width auto herdaria o min-content da faixa e estouraria.
      className={cn("relative w-full min-w-0", className)}
    >
      <Marquee className="py-1" speed={speed}>
        {specialties.map((specialty) => (
          <Badge
            key={specialty.name}
            tone={chip.badge}
            size="md"
            className="gap-2 whitespace-nowrap px-4 py-2 text-[13px]"
            icon={<Icon name={specialty.icon} size={15} className={chip.icon} />}
          >
            {specialty.name}
          </Badge>
        ))}
      </Marquee>
    </div>
  );
}
