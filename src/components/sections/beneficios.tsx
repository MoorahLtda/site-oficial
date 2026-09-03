import { Lock } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { type Benefit, benefits, benefitsSection, mocks, type Photo, photos } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  Bento de beneficios (secao 5.8 do brief). O Cartao Moorah (benefits[0]) tem secao propria;
  aqui entram Portal, Exames, Farmacias, Lojas e Seguranca. Os tres mocks animados sao
  carregados por next/dynamic com skeleton do mesmo tamanho.
  Fotografia (brief v2, item 1): idosoTablet como cabecalho da celula Portal e exame como fundo
  da celula Exames, com overlay plum e a rede de exames desenhada em branco por cima.
*/

const TITLE_ID = "beneficios-titulo";

// Celulas de meia largura do bento: metade do container de 1200 px no desktop.
const TILE_PHOTO_SIZES = "(min-width: 1024px) 560px, 92vw";

const PortalMock = dynamic(() => import("./portal-mock").then((mod) => mod.PortalMock), {
  loading: () => <PortalMockSkeleton />,
});

const ExamsNetwork = dynamic(() => import("./exams-network").then((mod) => mod.ExamsNetwork), {
  // Mesma altura do ExamsNetwork: svg 320x120 mais a linha do selo (mt-2 + min-h-6).
  // A celula Exames e escura (foto com overlay plum), por isso o placeholder e um bloco
  // translucido em branco: o `skeleton` cinza claro piscaria sobre a foto.
  loading: () => (
    <div aria-hidden="true">
      <div className="aspect-[320/120] w-full rounded-card bg-white/10" />
      <div className="mt-2 h-6" />
    </div>
  ),
});

const PharmacyMock = dynamic(() => import("./pharmacy-mock").then((mod) => mod.PharmacyMock), {
  loading: () => <div aria-hidden="true" className="skeleton h-[118px] w-full rounded-xl" />,
});

// Mesmo tamanho do PortalMock em fase skeleton, para nao haver salto de layout.
function PortalMockSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[280px] rounded-xl border border-gray-200 bg-gray-50 p-3"
    >
      <div className="flex gap-2">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-7 w-20" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
        <div className="skeleton h-10" />
      </div>
    </div>
  );
}

interface TilePhotoProps {
  photo: Photo;
  // object-position em classe estatica, para preservar rostos no recorte.
  position: string;
}

// Cabecalho fotografico da celula: sangra ate as bordas do card (que e overflow-hidden).
function TileHeaderPhoto({ photo, position }: TilePhotoProps) {
  return (
    <div
      data-tile-header=""
      className="relative -mx-6 -mt-6 aspect-video overflow-hidden lg:-mx-8 lg:-mt-8"
    >
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={TILE_PHOTO_SIZES}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]",
          position,
        )}
      />
    </div>
  );
}

// Foto de fundo da celula com overlay plum: sustenta o contraste do texto branco por cima.
function TileBackgroundPhoto({ photo, position }: TilePhotoProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={TILE_PHOTO_SIZES}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]",
          position,
        )}
      />
      <div
        aria-hidden="true"
        data-photo-overlay=""
        className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))] opacity-[0.86]"
      />
    </div>
  );
}

interface TileProps {
  benefit: Benefit;
  index: string;
  className?: string;
  // Foto sangrada no topo do card (celula Portal).
  header?: ReactNode;
  // Foto de fundo com overlay plum: o card inverte para texto branco (celula Exames).
  background?: ReactNode;
  children?: ReactNode;
}

function Tile({ benefit, index, className, header, background, children }: TileProps) {
  const onPhoto = background !== undefined;
  return (
    <RevealItem
      as="article"
      className={cn(
        // Tailwind v4 move o hover pela propriedade `translate` (nao `transform`); e ela que transiciona.
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 shadow-card transition-[translate,box-shadow] duration-250 ease-out-expo hover:-translate-y-0.5 hover:shadow-float lg:p-8",
        onPhoto ? "isolate border-white/10 text-white" : "border-gray-200 bg-white",
        className,
      )}
    >
      {background}
      {header}
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-250 ease-out-expo",
            onPhoto
              ? "bg-white/10 text-white ring-1 ring-white/20 group-hover:bg-white/15"
              : "bg-berry-50 text-berry-600 group-hover:bg-berry-100",
          )}
        >
          <Icon name={benefit.icon} size={22} />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-xs tracking-[0.1em]",
            onPhoto ? "text-berry-300" : "text-gray-600",
          )}
        >
          {index}
        </span>
      </div>
      <div>
        <h3
          className={cn(
            "font-display text-xl font-semibold leading-snug lg:text-[1.375rem]",
            onPhoto ? "text-white" : "text-gray-900",
          )}
        >
          {benefit.title}
        </h3>
        <p className={cn("mt-2 leading-relaxed", onPhoto ? "text-berry-100" : "text-gray-600")}>
          {benefit.text}
        </p>
      </div>
      {children ? <div className="mt-auto pt-2">{children}</div> : null}
    </RevealItem>
  );
}

export function Beneficios() {
  const [, pharmacy, exams, stores, portal, security] = benefits;

  return (
    <Section id="beneficios" surface="light" aria-labelledby={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        eyebrow={benefitsSection.eyebrow}
        title={benefitsSection.title}
        description={benefitsSection.lead}
        className="max-w-2xl"
      />

      <RevealGroup
        stagger={0.08}
        amount={0.15}
        className="mt-12 grid gap-5 lg:grid-cols-6 lg:auto-rows-[minmax(220px,auto)]"
      >
        <Tile
          benefit={portal}
          index="01"
          className="min-h-[280px] lg:col-span-3 lg:row-span-2"
          header={<TileHeaderPhoto photo={photos.idosoTablet} position="object-[50%_35%]" />}
        >
          <PortalMock />
        </Tile>

        <Tile
          benefit={exams}
          index="02"
          className="lg:col-span-3"
          background={<TileBackgroundPhoto photo={photos.exame} position="object-[50%_40%]" />}
        >
          <ExamsNetwork tone="photo" />
        </Tile>

        <Tile benefit={pharmacy} index="03" className="lg:col-span-3">
          <PharmacyMock />
        </Tile>

        <Tile benefit={stores} index="04" className="lg:col-span-3">
          <TrailHairline />
        </Tile>

        <Tile benefit={security} index="05" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-2">
            {mocks.securityChips.map((chip) => (
              <li key={chip} className="flex">
                <Badge tone="neutral" icon={<Lock size={12} aria-hidden="true" />}>
                  {chip}
                </Badge>
              </li>
            ))}
          </ul>
        </Tile>
      </RevealGroup>
    </Section>
  );
}

// Trilha estatica de circuito para o card sem mock (Lojas): tres nos ligados por hairline.
function TrailHairline() {
  return (
    <svg
      viewBox="0 0 320 24"
      aria-hidden="true"
      focusable="false"
      className="block h-6 w-full overflow-visible"
    >
      <path
        d="M 6 12 H 100 L 112 0 H 208 L 220 12 H 314"
        fill="none"
        stroke="var(--color-berry-300)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={6} cy={12} r={4} fill="var(--color-ink)" />
      <circle cx={160} cy={0} r={4} fill="var(--color-berry-500)" />
      <circle cx={314} cy={12} r={4} fill="var(--color-ink)" />
    </svg>
  );
}
