# Design brief - Landing page Moorah Telemedicina

Fonte única de verdade para os agentes que vão implementar a landing em paralelo, um agente por
seção, sem conversar entre si. Tudo que um agente precisa saber está aqui, em `CLAUDE.md`, em
`src/content/site.ts` e em `src/app/globals.css`. Quando este brief e o código existente
divergirem, o código de `src/lib/leads.ts`, `src/app/api/leads/route.ts` e `tests/e2e/landing.spec.ts`
prevalece (eles já existem e já passam); o resto segue o brief.

Regras de escrita valem para código, comentários, copy e testes: nunca travessão (U+2014), use
hífen; sem emoji; sem jargão corporativo; sem números inventados; sem depoimentos; sem logos de
parceiros; copy em português do Brasil, tom acolhedor, preciso, institucional e sereno.

---

## 1. Direção escolhida, conceito e princípios

**Direção vencedora: Trilha da Amora (editorial acolhedor)**, 92 pontos no júri (30 conversão, 30
marca, 32 técnica). Concordo com o resultado: é a única direção que passa no teste dos 5 segundos
(preço no hero), respeita a proporção 70/20/8 do manual como percepção e não como soma de alturas,
e cabe nos limites técnicos (stroke draw e reveals curtos, HTML final igual ao SSR).

Enxertos das outras direções, já incorporados nas seções abaixo:

| Origem | Ideia incorporada | Onde |
| --- | --- | --- |
| Produto vivo | Painel "Incluído na assinatura / Não está incluído" em duas colunas | 5.9 Planos |
| Produto vivo | "A Moorah não é plano de saúde" na linha de confiança do hero | 5.3 Hero |
| Produto vivo | Callout de emergência com 192 logo abaixo dos cards de plano | 5.9 Planos |
| Produto vivo | FAQ com "A Moorah é um plano de saúde?" aberto por padrão | 5.11 Dúvidas |
| Produto vivo | Barra inferior mobile com WhatsApp quando a variável existir | 5.2 Barra mobile |
| Produto vivo | Chips de prova abaixo da dobra | 5.3 Hero |
| Produto vivo | Segmented control Titular / Dependente 1-3 trocando o número do cartão | 5.7 Cartão |
| Produto vivo | Intervalos pausados com useInView e document.hidden | 2. Motion |
| Produto vivo | Regra "toda animação comunica um evento do produto" | 2. Motion |
| Plum cinematográfico | CTA primário "Escolher meu plano" | 5.3 Hero, 5.12 Contato |
| Plum cinematográfico | "Faz mais sentido a partir de 2 pessoas" quando 1 pessoa é escolhida | 5.9 Planos |
| Plum cinematográfico | Card fixo de "192 SAMU" em mono grande ao lado do FAQ | 5.11 Dúvidas |
| Plum cinematográfico | planNotes[1] com link direto para a pergunta do FAQ | 5.9 Planos |
| Plum cinematográfico | H2 "Agendou, foi lembrado, consultou." | 5.5 Como funciona |
| Plum cinematográfico | Vocabulário explícito: leaf significa "deu certo" | 3. Cor |

Fraquezas da vencedora corrigidas neste brief:

- A "Constelação da Amora" com cálice em leaf e silhueta de fruta foi substituída pela **Trilha da
  Amora**: um hub central e 12 nós ligados por trilhas de circuito em 45 graus (geometria em 9.2).
  Não há contorno de fruta nem cálice; o símbolo oficial aparece só em header, footer e 404.
- Os gomos deixaram de ser `<button>`: o cluster é `role="img"` decorativo. O espelho lista-cluster
  em Especialidades é só por hover, de mão única, sem paradas de foco.
- A espinha SVG contínua entre seções foi eliminada. Cada seção tem trilhas próprias, sem contrato
  entre agentes.
- Cartão flutuante "Pediatria, hoje às 19:30" perdeu o horário (24h não está confirmado).
- Linha de confiança sem número de resolução do CFM; linguagem que a família entende.
- Página mais curta: dor e "tudo em um lugar" fundidos em uma seção, portal dentro do bento de
  benefícios, padding vertical de 80/96/112 px, sem numerais decorativos de 88 px.
- `useScroll` só no header (scrollY) e no parallax do hero (desktop). Tudo o mais é `whileInView once`.
- Objeções tratadas onde a decisão acontece: hero (trust line), planos (painel e 192), FAQ.

Conceito em uma frase: a página é lida como uma revista de saúde serena, em neutros tingidos de
ameixa, e o único motivo gráfico recorrente é a trilha de circuito da amora, que acende um nó em
leaf sempre que algo dá certo.

Princípios (para qualquer decisão não coberta aqui):

1. Texto primeiro: o H1 é o LCP, renderizado no servidor, sem animação de entrada.
2. Nada gira, nada pisca, nenhum loop em texto. Toda animação termina e comunica um evento do
   produto (consulta confirmada, receita emitida, cartão reconhecido).
3. Plum é bloco de peso inserido na página (rounded-3xl com margem), em três momentos: Cartão,
   card Familiar e CTA final. Nunca faixa infinita.
4. Leaf só como confirmação. Berry para marca e ação. Critical uma vez por bloco de emergência.
5. Estado final da animação é igual ao HTML do servidor; sob reduced-motion, a página estática está
   completa.
6. Copy vive em `src/content/site.ts`. Componentes só recebem dados; microcopy de interface
   (aria-labels, "Fechar", "Carregando") é a única exceção.
7. Cada seção é autossuficiente, testável isolada e não depende de outra seção existir.

---

## 2. Sistema de motion

Imports permitidos: `import { m, useScroll, useTransform, useInView, AnimatePresence, useMotionValue,
useSpring, useMotionValueEvent, useReducedMotion } from "motion/react"`. `motion.*` quebra (LazyMotion
strict). Sem layout animations, sem `drag`, sem `layoutId`, sem `mode="popLayout"`.

### 2.1 Velocidades

| Camada | Duração | Easing | Distância | Onde roda |
| --- | --- | --- | --- | --- |
| Micro (hover, foco, troca de cor, sombra) | 150 a 250 ms | `ease-out-expo` | translateY 1 a 2 px, shadow-card para shadow-float | CSS (`transition-*`) |
| Revelação (texto, cards, linhas) | 450 a 650 ms | `ease-out-expo` cubic-bezier(0.22, 1, 0.36, 1) | y 16 a 24 px partindo de opacity 0 | `m.*` com `whileInView` |
| Desenho (trilhas de circuito, hairlines) | 700 a 1600 ms | `ease-in-out-soft` cubic-bezier(0.65, 0, 0.35, 1) | `pathLength` 0 para 1, `scaleX` 0 para 1 | `m.path` / `m.span` |
| Hero (cascata do cluster e cards) | 0 a 2200 ms no total | `ease-out-expo` | scale 0.6 a 1, y 16 px | `m.*` com `animate` |
| Físico (tilt, contador, indicador do header) | contínuo | spring stiffness 90 a 180, damping 18 a 26 | rotate até 8 graus | `useMotionValue` + `useSpring` |
| Abertura (accordion, dialog, folha do menu) | 250 a 380 ms | `ease-out-expo` | fade + scale 0.96 ou slide 100% | CSS keyframes com `data-state` |

### 2.2 Regras

- Stagger: 50 a 120 ms entre irmãos, no máximo 12 filhos animados por grupo, stagger acumulado
  abaixo de 1 s.
- `whileInView` sempre com `viewport={{ once: true, amount: 0.25 }}` (0.2 para listas longas, 0.4
  para blocos curtos). `useInView(ref, { once: true, amount: 0.3 })` quando precisar de estado.
- `useScroll` apenas em `header.tsx` (scrollY) e em `hero-stage.tsx` (parallax). Nenhuma outra
  seção usa scroll-linked.
- Loops permitidos: spinner do botão durante envio (`animate-spin`) e shimmer do `skeleton`
  enquanto algo carrega de verdade. Nada mais.
- Intervalos (`setInterval`) só em `card-stage.tsx`, `portal-mock.tsx` e `pharmacy-mock.tsx`; um
  por componente, disparado uma vez ao entrar em vista, limpo no unmount, pausado se
  `document.hidden`.
- Elementos com transform ganham `will-change-transform` apenas enquanto animam (tilt do cartão).
- SVG de trilhas: `vector-effect="non-scaling-stroke"`, paths com menos de 40 segmentos, `pathLength`
  animado pelo motion (`initial={{ pathLength: 0 }}`, `animate={{ pathLength: 1 }}`).
- Números que mudam (preço por pessoa): `useSpring(motionValue, { stiffness: 90, damping: 20 })` e
  `useTransform(spring, (v) => formatBRL(Math.round(v)))` renderizado como filho de `m.span`.

### 2.3 Reduced motion

`MotionConfig reducedMotion="user"` (já aplicado em `motion-provider.tsx`) converte transforms em
opacity. Além disso cada componente com parallax, tilt, intervalo, contador ou `pathLength` lê
`useReducedMotion()` e, quando `true`: desliga `useScroll` e springs de ponteiro, renderiza
`pathLength: 1` e nós acesos, mostra dígitos e números finais, pula o skeleton demonstrativo do
portal. O CSS de `globals.css` já zera animações e transições sob a media query.

### 2.4 Componente de reveal reutilizável (`src/components/ui/reveal.tsx`, "use client")

Implementação canônica; todos os agentes usam esta, não criam a própria.

```tsx
"use client";

import { m, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Variant = "fade-up" | "fade" | "line";

function makeVariants(variant: Variant, y: number, duration: number, delay: number): Variants {
  if (variant === "line") {
    return {
      hidden: { scaleX: 0 },
      show: { scaleX: 1, transition: { duration: duration / 1000, ease: [0.65, 0, 0.35, 1], delay } },
    };
  }
  if (variant === "fade") {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: duration / 1000, ease: EASE, delay } },
    };
  }
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: duration / 1000, ease: EASE, delay } },
  };
}

interface RevealProps {
  as?: "div" | "section" | "li" | "span" | "p";
  variant?: Variant;
  delay?: number; // segundos
  duration?: number; // ms, padrao 550
  y?: number; // px, padrao 20
  once?: boolean; // padrao true
  amount?: number; // padrao 0.25
  className?: string;
  children?: ReactNode;
}

export function Reveal({
  as = "div",
  variant = "fade-up",
  delay = 0,
  duration = 550,
  y = 20,
  once = true,
  amount = 0.25,
  className,
  children,
}: RevealProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag
      className={className}
      variants={makeVariants(variant, y, duration, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </Tag>
  );
}

interface RevealGroupProps {
  as?: "div" | "ul" | "ol" | "section";
  stagger?: number; // segundos, padrao 0.08
  once?: boolean;
  amount?: number;
  className?: string;
  children?: ReactNode;
}

// Pai que dispara os filhos RevealItem em cascata.
export function RevealGroup({
  as = "div",
  stagger = 0.08,
  once = true,
  amount = 0.25,
  className,
  children,
}: RevealGroupProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

interface RevealItemProps {
  as?: "div" | "li" | "span" | "article";
  variant?: Variant;
  y?: number;
  duration?: number;
  className?: string;
  children?: ReactNode;
}

// Filho de RevealGroup: herda o gatilho do pai, so declara as variants.
export function RevealItem({
  as = "div",
  variant = "fade-up",
  y = 20,
  duration = 550,
  className,
  children,
}: RevealItemProps) {
  const Tag = m[as] as ElementType;
  return (
    <Tag className={className} variants={makeVariants(variant, y, duration, 0)}>
      {children}
    </Tag>
  );
}
```

Uso: `<Reveal>` em blocos únicos; `<RevealGroup as="ul" stagger={0.06}><RevealItem as="li">...` em
listas. `variant="line"` em hairlines (`className="origin-left h-0.5 w-full bg-ink"`).

Nota de teste: em jsdom o `IntersectionObserver` é um mock que nunca dispara (ver `tests/setup.ts`),
então filhos de Reveal ficam com `opacity: 0` inline. Assertivas unitárias usam `toBeInTheDocument`,
`toHaveTextContent`, `toHaveAttribute`, nunca `toBeVisible` para conteúdo dentro de Reveal.

---

## 3. Ritmo de cor e tipografia

### 3.1 Sequência de superfícies

| Ordem | Seção | id | Superfície | Observação |
| --- | --- | --- | --- | --- |
| 1 | Header | - | transparente, depois `bg-white/85` com blur | fixo |
| 2 | Hero | `inicio` | light (`bg-white`) | halo radial berry-50 atrás do cluster |
| 3 | Por que / Tudo em um | `por-que` | soft (`bg-gray-50`) | |
| 4 | Como funciona | `como-funciona` | light | |
| 5 | Especialidades | `especialidades` | soft | |
| 6 | Cartão Moorah | `cartao` | **plum** inserido | gradiente ink para berry-950, rounded-3xl |
| 7 | Benefícios + Portal | `beneficios` | light | |
| 8 | Planos | `planos` | soft | card Familiar em `bg-ink` |
| 9 | Diferenciais | `diferenciais` | light | |
| 10 | Dúvidas | `duvidas` | soft | |
| 11 | CTA final + formulário | `contato` | **plum** inserido | |
| 12 | Footer | - | light | hairline gray-200 no topo |

Proporção resultante: cerca de 70% de superfícies claras (alternando branco e gray-50), cerca de
20% de amora (dois blocos plum, card Familiar, botões berry-600, eyebrows, ícones), cerca de 8% de
leaf como pontuação.

### 3.2 Vocabulário de cor

| Uso | Token | Regra |
| --- | --- | --- |
| Texto principal em claro | `text-gray-900` | nunca `text-ink` em texto corrido |
| Texto secundário em claro | `text-gray-600` | `gray-500` falha AA em texto pequeno (4,37:1); só em 24 px ou mais |
| Texto em plum | `text-white` principal, `text-berry-100` secundário, `text-berry-300` eyebrow e rótulos | berry-300 sobre ink = 5,8:1 |
| Ação primária | `bg-berry-600 text-white hover:bg-berry-700` | 7,5:1 |
| Ícones de marca | `text-berry-600` sobre `bg-berry-50` (círculo) | |
| Eyebrow | utilitário `eyebrow` (`berry-500`, 12 px, 800); em plum acrescente `text-berry-300` | |
| Confirmação (check, "Conectado", "Cartão reconhecido", sucesso do formulário, nós que acendem) | ícone `text-leaf-500` (claro) ou `text-leaf-300` (plum); texto `text-leaf-700`; fundo `bg-leaf-50` só em selo pequeno | leaf-500 como TEXTO falha AA (3,5:1); só como ícone ou fundo |
| Destaque comercial (badge "Mais escolhido") | `bg-berry-500 text-white` | nunca leaf |
| Emergência | `text-critical-500` só no "192" em 2rem bold e em ícone Siren; texto ao lado em `text-gray-900`; borda `border-critical-500/40` | critical-500 falha AA em texto pequeno (4,2:1) |
| Erro de formulário | texto `text-gray-900` com ícone `text-critical-500`, input `border-critical-500` | |
| Bordas | `border-gray-200` (1 px) | |
| Hairlines animadas | `bg-ink` ou `bg-berry-300` | |
| Trilhas SVG | stroke `var(--color-berry-300)` em claro, `var(--color-berry-700)` em plum; nós `fill var(--color-ink)`; nó aceso `fill var(--color-berry-500)`; nó confirmado `fill var(--color-leaf-500)` | |

Gradiente plum (único permitido): `bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]`.

### 3.3 Escala tipográfica (classes Tailwind concretas)

| Papel | Classes | Tamanhos |
| --- | --- | --- |
| H1 (hero) | `font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 text-balance` | 44 / 48 / 60 / 72 px |
| H2 de seção | `font-display font-bold tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-gray-900` (em plum `text-white`) | 30 / 36 / 48 px |
| H2 do CTA final | `font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] text-white` | 36 / 48 / 56 px |
| Frase-manifesto (h3) | `font-display font-bold tracking-tight text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1]` | 30 / 36 / 44 px |
| H3 de card | `font-display font-semibold text-xl lg:text-[1.375rem] leading-snug text-gray-900` | 20 / 22 px |
| Lead | `text-lg sm:text-xl leading-relaxed text-gray-600` (plum `text-berry-100`) | 18 / 20 px |
| Corpo | `text-base leading-relaxed text-gray-600` | 16 px |
| Notas | `text-sm text-gray-600` e legais `text-[13px] text-gray-600` | 14 / 13 px |
| Eyebrow | `eyebrow` | 12 px |
| Botão | `font-display font-bold text-[15px] lg:text-base` | 15 / 16 px |
| Preço do plano | `font-display font-extrabold tabular-nums leading-none text-5xl lg:text-[3.5rem]` | 48 / 56 px |
| Número do cartão | `font-mono tabular-nums text-xl lg:text-[1.625rem] tracking-[0.12em]` | 20 / 26 px |
| Rótulos mono | `font-mono text-[11px] uppercase tracking-[0.18em]` | 11 px |
| Índices (01, 02) | `font-mono text-xs tracking-[0.1em] text-gray-600` | 12 px |
| Preço por pessoa | `font-mono text-sm` | 14 px |
| 192 | `font-mono font-bold text-[2rem] leading-none text-critical-500` | 32 px |
| Preços na barra mobile | `font-mono text-xs` | 12 px |

Largura de leitura: parágrafos `max-w-[34rem]` (hero) ou `max-w-prose`; blocos centrados
`max-w-2xl`. Títulos com `text-balance` (já no base CSS).

---

## 4. Primitivos compartilhados (`src/components/ui/*`)

Criados na Fase 0, antes das seções. Todos exportam componentes nomeados (sem default export),
usam `cn()` de `@/lib/utils` e aceitam `className`. "Server" significa arquivo sem `"use client"`,
importável por qualquer lado.

| Arquivo | Tipo | Resumo |
| --- | --- | --- |
| `button.tsx` | server | cva; variantes primary, secondary, ghost, plum, outline-light; tamanhos sm, md, lg; `asChild` |
| `badge.tsx` | server | tons berry, leaf, neutral, plum, critical; ícone opcional |
| `container.tsx` | server | `container-x` |
| `section.tsx` | server | `<section>` com id, superfície light/soft/plum, padding e `scroll-mt-20` |
| `section-heading.tsx` | server | eyebrow + título + descrição |
| `reveal.tsx` | client | Reveal, RevealGroup, RevealItem (código em 2.4) |
| `accordion.tsx` | client | wrapper Radix Accordion |
| `dialog.tsx` | client | wrapper Radix Dialog, variantes center e sheet |
| `segmented-control.tsx` | client | radiogroup acessível (pessoas, titular/dependentes) |
| `lead-form.tsx` | client | formulário de lead completo |
| `lead-dialog.tsx` | client | botão que abre Dialog com LeadForm e plano pré-selecionado |
| `trail-cluster.tsx` | client | SVG da Trilha da Amora (hero, especialidades, CTA final) |
| `marquee.tsx` | server | faixa CSS contínua; reservada, não usada na v1 |
| `section-skeleton.tsx` | server | placeholder para `next/dynamic` e `loading.tsx` |

### 4.1 Button

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "plum" | "outline-light"; // padrao primary
  size?: "sm" | "md" | "lg"; // padrao md
  asChild?: boolean; // Radix Slot; use para <a href>
  fullWidth?: boolean;
  loading?: boolean; // desabilita, aria-busy, Loader2 com animate-spin
}
```

Base: `inline-flex items-center justify-center gap-2 rounded-full font-display font-bold
whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200
ease-out-expo disabled:opacity-60 disabled:pointer-events-none active:translate-y-px`.
Variantes: primary `bg-berry-600 text-white shadow-card hover:bg-berry-700 hover:shadow-float`;
secondary `bg-white text-gray-900 border border-gray-200 hover:bg-gray-50`; ghost `text-gray-700
hover:bg-gray-100 hover:text-gray-900`; plum (para uso sobre plum) `bg-white text-ink hover:bg-berry-50`;
outline-light (sobre plum) `border border-berry-300 text-white hover:bg-white/10`.
Tamanhos: sm `h-10 px-4 text-sm`; md `h-12 px-6 text-[15px]`; lg `h-13 px-7 text-base` (52 px, use
`h-[52px]`). Foco vem do `:focus-visible` global. Ícones lucide dentro do botão: `size={18}`,
`aria-hidden`.

### 4.2 Badge

```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "berry" | "leaf" | "neutral" | "plum" | "critical"; // padrao neutral
  size?: "sm" | "md";
  icon?: React.ReactNode; // ja com aria-hidden
}
```

Base `inline-flex items-center gap-1.5 rounded-full font-sans font-semibold`; sm `px-2.5 py-0.5
text-[11px]`, md `px-3 py-1 text-xs`. Tons: berry `bg-berry-500 text-white`; leaf `bg-leaf-50
text-leaf-700 border border-leaf-200` (só para confirmações); neutral `bg-gray-100 text-gray-700`;
plum `bg-white/10 text-berry-100 border border-white/15`; critical `bg-white text-gray-900 border
border-critical-500/40` com o número em `font-mono font-bold text-critical-500`.

### 4.3 Container e Section

```ts
// container.tsx
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>)
// -> <div className={cn("container-x", className)} {...props} />

// section.tsx
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  surface?: "light" | "soft" | "plum"; // padrao light
  innerClassName?: string; // aplicado no Container interno
  bleed?: boolean; // true = nao envolve os filhos em Container
}
```

Light: `<section id className="relative scroll-mt-20 bg-white py-20 sm:py-24 lg:py-28">`.
Soft: idem com `bg-gray-50`. Plum: `<section id className="scroll-mt-20 px-3 py-3 sm:px-4 lg:px-6">
<div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(160deg,var(--color-ink),
var(--color-berry-950))] py-20 text-white sm:py-24 lg:py-28"><Container>...`. `className` extra é
mesclado com `cn` (twMerge resolve conflitos, então o hero pode sobrescrever o padding).

### 4.4 SectionHeading

```ts
interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center"; // padrao start
  tone?: "light" | "plum";
  as?: "h2" | "h3"; // padrao h2
  id?: string; // id do titulo para aria-labelledby
  className?: string;
}
```

Renderiza `<div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>` com
`<p className="eyebrow">` (plum: `text-berry-300`), título com as classes de H2 da tabela 3.3
(`mt-3`), descrição `mt-4` em lead. Server.

### 4.5 Accordion (Radix)

Exports: `Accordion` (Root, repassa `type`, `collapsible`, `defaultValue`, `value`,
`onValueChange`), `AccordionItem` (`value`, `className`; base `border-b border-gray-200`),
`AccordionTrigger` (renderiza `Accordion.Header asChild` como `<h3>` e `Accordion.Trigger` com
`className="group flex w-full items-start justify-between gap-4 py-5 text-left font-display text-lg
font-semibold text-gray-900 hover:text-berry-700"` e ícone `Plus` `size={20}` `text-berry-600
transition-transform duration-250 ease-out-expo group-data-[state=open]:rotate-45`),
`AccordionContent` (`overflow-hidden data-[state=open]:animate-accordion-down
data-[state=closed]:animate-accordion-up`; filho `<div className="pb-5 leading-relaxed text-gray-700">`).
Keyframes `accordion-down/up` usam `--radix-accordion-content-height` (adicionados em `globals.css`
na Fase 0, ver 4.12). Radix cuida de `aria-expanded`, `aria-controls` e teclado.

### 4.6 Dialog (Radix)

Exports: `Dialog` (Root), `DialogTrigger`, `DialogClose`, `DialogContent`.

```ts
interface DialogContentProps extends React.ComponentProps<typeof RadixDialog.Content> {
  variant?: "center" | "sheet"; // sheet = folha lateral direita (menu mobile)
  title: string; // obrigatorio; renderizado em DialogTitle
  titleSrOnly?: boolean;
  description?: string;
}
```

Overlay `fixed inset-0 z-[60] bg-berry-950/60 backdrop-blur-sm data-[state=open]:animate-fade-in`.
Center: `fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2
rounded-2xl bg-white p-6 shadow-deep sm:p-8 data-[state=open]:animate-zoom-in`. Sheet: `fixed
inset-y-0 right-0 z-[70] flex w-[86vw] max-w-sm flex-col bg-white p-6 shadow-deep
data-[state=open]:animate-slide-in-right`. Botão fechar `absolute right-4 top-4 grid h-11 w-11
place-items-center rounded-full text-gray-600 hover:bg-gray-100` com `X` e `aria-label="Fechar"`.
Título `font-display text-2xl font-bold text-gray-900`; descrição `mt-1 text-sm text-gray-600`.

### 4.7 SegmentedControl

```ts
interface SegmentedOption { value: string; label: string }
interface SegmentedControlProps {
  options: readonly SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  label: string; // aria-label do grupo
  tone?: "light" | "plum";
  size?: "md" | "lg"; // lg = alvo 52 px (mobile)
  className?: string;
}
```

`<div role="radiogroup" aria-label className="inline-flex rounded-full border border-gray-200
bg-white p-1">`; cada opção `<button type="button" role="radio" aria-checked tabIndex={checked ? 0 : -1}
className="min-w-11 h-11 rounded-full px-4 font-display text-sm font-bold text-gray-700
transition-colors duration-200 aria-checked:bg-ink aria-checked:text-white hover:text-gray-900">`.
Tone plum: contêiner `border-white/15 bg-white/10`, opção `text-berry-100 aria-checked:bg-white
aria-checked:text-ink`. Teclado: ArrowLeft/ArrowRight/Home/End movem a seleção e o foco (roving
tabindex). Sem pílula deslizante; a troca de cor é CSS.

### 4.8 LeadForm

```ts
interface LeadFormProps {
  defaultPlan?: PlanId; // padrao "familiar"
  onSuccess?: () => void;
  className?: string;
}
```

Campos (ids via `useId()` para permitir várias instâncias na página): Nome (`text`,
`autoComplete="name"`), E-mail (`email`, `inputMode="email"`, `autoComplete="email"`), WhatsApp
(opcional; `tel`, `inputMode="tel"`, `autoComplete="tel"`, placeholder `(11) 99999-1234`), Plano de
interesse (`<select>` nativo com `plans.map`, valor inicial `defaultPlan`), consentimento (checkbox
com label `ui.leadForm.consent` contendo `<Link href="/privacidade">Política de privacidade</Link>`),
honeypot `website` (`<div aria-hidden="true" className="absolute -left-[9999px] h-px w-px
overflow-hidden"><label>Site<input name="website" tabIndex={-1} autoComplete="off" /></label></div>`).
Todos os rótulos visíveis: `block text-sm font-semibold text-gray-800 mb-1.5`. Inputs: `h-12 w-full
rounded-control border border-gray-300 bg-white px-3.5 text-base text-gray-900
placeholder:text-gray-400 outline-none transition focus:border-berry-500 focus:ring-4
focus:ring-berry-500/15 aria-invalid:border-critical-500`.

Validação no cliente com `leadSchema.safeParse` de `@/lib/leads` (zod v4; erros por campo via
`z.flattenError(result.error).fieldErrors`). Mensagens do próprio schema ("Informe seu nome.",
"Informe um e-mail válido.", "Escolha um plano.", "É preciso aceitar a política de privacidade.")
em `<p id={`${id}-erro`} className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-900">` com
`AlertCircle size={16} className="text-critical-500"`; o input recebe `aria-invalid` e
`aria-describedby`.

Envio: `fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, email, whatsapp, plan, consent: true, website }) })`. O schema é
`.strict()`: não envie outras chaves. Respostas: 200 `{ok:true}` sucesso; 400 `{fields}` marca os
campos; 429 mensagem `ui.leadForm.errorRateLimited`; qualquer outra `ui.leadForm.errorGeneric`.
Estados: `idle`, `submitting` (Button `loading`, `aria-busy`, texto `ui.leadForm.sending`),
`success` (substitui o formulário por `<div role="status" className="rounded-2xl bg-white p-6
text-center">` com círculo `bg-leaf-50` e `CircleCheck size={28} className="text-leaf-600"`, título
`ui.leadForm.successTitle`, texto `ui.leadForm.successText`), `error` (`<p role="alert">` acima do
botão). Botão de envio: `ui.leadForm.submit` ("Quero assinar"), primary, `fullWidth`.
Nunca logue o e-mail ou telefone no cliente (nem `console.log` de debug).

### 4.9 LeadDialogButton

```ts
interface LeadDialogButtonProps extends Omit<ButtonProps, "asChild"> {
  plan: PlanId;
  label?: string; // padrao getPlan(plan).cta
}
```

Renderiza `Dialog` + `DialogTrigger asChild` com `Button` + `DialogContent variant="center"
title={plan.cta} description={`${plan.peopleLabel}. ${formatBRL(plan.priceCents)} por mês.`}` +
`LeadForm defaultPlan={plan}`. O `LeadForm` entra por `next/dynamic` dentro deste arquivo (client),
com `loading` = quatro blocos `skeleton` de 48 px, para não pesar o bundle inicial. Cada botão tem o
próprio Dialog (estado local); não há store global.

### 4.10 TrailCluster

```ts
interface TrailClusterProps {
  variant?: "full" | "mini" | "outline"; // full = hero; mini = especialidades; outline = CTA final
  animate?: "intro" | "draw" | "static"; // intro = cascata do hero; draw = pathLength ao entrar em vista
  active?: number | null; // indice 0..11 do no aceso (berry-500)
  confirmed?: number | null; // indice do no confirmado (leaf-500), usado no fim da intro
  label?: string; // aria-label; se ausente, aria-hidden="true"
  className?: string;
}
```

Geometria completa em 9.2. `"use client"` (usa `m.path`, `m.circle`, `useReducedMotion`). Renderiza
`<svg viewBox="0 0 560 560" role={label ? "img" : undefined} aria-hidden={label ? undefined : true}
aria-label={label}>`. Cada nó tem `data-node={i}` e `data-specialty={specialties[i].name}`. Sem
interatividade própria; `active` vem de fora.

### 4.11 Marquee e SectionSkeleton

`Marquee` (server): `<div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,
transparent,black_10%,black_90%,transparent)]"><div className="flex w-max gap-8 animate-marquee
group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap">{children}
<div aria-hidden="true">{children}</div></div></div>`. Prop `speed` (segundos) via
`style={{ animationDuration }}`. Reservado para logos de parceiros quando houver autorização;
não entra na v1.

`SectionSkeleton` (server): `<div aria-hidden="true" className={cn("container-x py-20", className)}>`
com um bloco `skeleton h-8 w-40`, um `skeleton mt-4 h-12 w-3/4 max-w-xl`, e uma grade
`mt-10 grid gap-6 md:grid-cols-3` de três `skeleton h-56`. Prop `minHeight` (classe, ex.:
`min-h-[640px]`) para reservar a altura da seção real e evitar CLS.

### 4.12 Alterações de Fase 0 fora de `ui/`

- `src/app/globals.css`, dentro de `@theme`: acrescentar
  `--animate-accordion-down: accordion-down 320ms var(--ease-out-expo)`,
  `--animate-accordion-up: accordion-up 250ms var(--ease-out-expo)`,
  `--animate-fade-in: fade-in 250ms var(--ease-out-expo)`,
  `--animate-zoom-in: zoom-in 300ms var(--ease-out-expo)`,
  `--animate-slide-in-right: slide-in-right 380ms var(--ease-out-expo)` e os keyframes:
  accordion-down `from { height: 0 } to { height: var(--radix-accordion-content-height) }`;
  accordion-up inverso; fade-in `from { opacity: 0 }`; zoom-in `from { opacity: 0; transform:
  translate(-50%, -50%) scale(0.96) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) }`;
  slide-in-right `from { transform: translateX(100%) }`.
- `src/lib/utils.ts`: acrescentar `whatsappUrl(number: string, text: string): string` que retorna
  `https://wa.me/${onlyDigits}?text=${encodeURIComponent(text)}`.
- `src/content/site.ts`: acrescentar os blocos de conteúdo da seção 11 deste brief. Nenhum agente
  de seção edita `site.ts`; se faltar copy, usa microcopy de interface e registra a falta no
  relatório final.
- `src/test/render.tsx`: `export function renderWithMotion(ui: ReactElement, options?)` que envolve
  em `MotionProvider` e devolve o resultado de `render`. Também exporta o snippet padrão para
  mockar `useInView` (documentado em 10.3).

---

## 5. Seções, na ordem da página

### 5.0 Contratos que já existem (não quebrar)

`tests/e2e/landing.spec.ts` já define o que a página precisa ter. Resumo dos pontos que afetam
as seções:

- Um único `<h1>` na página (o do hero). Todo título de seção é `<h2>`; cards usam `<h3>`.
- Ids obrigatórios: `#como-funciona`, `#especialidades`, `#beneficios`, `#planos`, `#duvidas`.
- O primeiro link cujo nome contém "Planos" (busca sem diferenciar caixa) leva a `#planos`. No header,
  o link de nav "Planos" e o botão "Ver planos" / "Planos" são `<a href="#planos">`, nunca `<button>`.
- Em `#planos` aparecem visíveis "49,90", "97,90", "24,48" e a frase "não é plano de saúde". Por
  isso o seletor de pessoas nasce em 4 e `planNotes[1]` fica visível, fora de qualquer disclosure.
- Em `#duvidas`, o primeiro `<button>` na ordem do DOM é o gatilho da primeira pergunta e começa
  com `aria-expanded="false"`. Portanto a coluna lateral do FAQ (cards de emergência e contato) só
  usa `<a>`, e o item aberto por padrão é o segundo (`faq[1]`).
- O botão "Assinar Familiar" (role button) abre um `role="dialog"` cujo campo com label "Plano..."
  tem valor `familiar`; clicar em "Quero assinar" com o formulário vazio mostra "Informe seu nome";
  Escape fecha.
- No mobile, após rolar 1200 px, `data-testid="cta-mobile"` está visível, e um botão com nome
  contendo "menu" abre um dialog.
- Nenhum texto visível contém travessão. Axe não pode achar violações serious ou critical.
- Nenhum erro de console no carregamento (cuidado com keys duplicadas e hydration mismatch: nada
  de `Math.random()` ou `Date.now()` no render).

### 5.1 Header

- **id**: sem id de seção (é `<header>`); ancora o skip link `#conteudo` no `<main>`.
- **Arquivo**: `src/components/sections/header.tsx`, `"use client"`.
- **Dados**: `site.name`, `nav`, `site.appUrl`, `ui.header` (11.10).
- **Layout desktop** (`lg+`): `<header className="fixed inset-x-0 top-0 z-50 transition-[background-color,
  box-shadow,border-color] duration-250 ease-out-expo" data-scrolled={scrolled}>` com classes
  condicionais `scrolled ? "border-b border-gray-200 bg-white/85 shadow-card backdrop-blur-md" :
  "bg-transparent"`. Dentro, `<Container className="flex h-16 items-center justify-between lg:h-[72px]">`.
  Esquerda: `<Link href="/" aria-label="Moorah, página inicial">` com `<Image src="/brand/moorah-wordmark.png"
  alt="" width={130} height={21} priority className="h-4 w-auto lg:h-[21px]" />`. Centro: `<nav
  aria-label="Principal" className="hidden lg:flex items-center gap-8 relative">` com um `<a
  href={`#${id}`}>` por item de `nav`, classes `relative py-2 font-sans text-[15px] font-semibold
  text-gray-700 transition-colors hover:text-gray-900 aria-[current=true]:text-gray-900`. Direita:
  `hidden lg:flex items-center gap-3`: `Entrar` (Button ghost sm, asChild `<a href={site.appUrl}>`,
  só se `site.appUrl`), `Ver planos` (Button primary sm, asChild `<a href="#planos">`).
- **Layout mobile**: mesma barra com `h-16`; direita `flex lg:hidden items-center gap-2`: Button primary
  sm asChild `<a href="#planos">Planos</a>` e botão de menu `grid h-11 w-11 place-items-center rounded-full
  text-gray-800 hover:bg-gray-100` com ícone `Menu`, `aria-label={ui.header.menuOpen}`,
  `aria-expanded`, `aria-controls`. O menu é `DialogContent variant="sheet" title="Menu" titleSrOnly`:
  links `font-display text-[28px] font-bold text-gray-900 py-3 border-b border-gray-100` (fecham o
  dialog no clique via `DialogClose asChild`), rodapé da folha com Button primary lg fullWidth
  `Ver planos` e `Entrar` (condicional).
- **Skip link**: primeiro filho do header, `<a href="#conteudo" className="sr-only focus:not-sr-only
  focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4
  focus:py-2 focus:shadow-float">Pular para o conteúdo</a>`.
- **Spec visual**: indicador de nó ativo: `<m.span aria-hidden className="absolute -bottom-1 h-1.5 w-1.5
  rounded-full bg-ink" style={{ x }} />` posicionado no centro do link ativo (`offsetLeft +
  offsetWidth / 2 - 3`), recalculado em `resize`. Sem link ativo (topo da página) fica `opacity-0`.
- **Motion**: `const { scrollY } = useScroll(); useMotionValueEvent(scrollY, "change", (v) =>
  setScrolled(v > 24))`. Indicador: `const x = useSpring(useMotionValue(0), { stiffness: 180, damping:
  26 })`. Scroll spy: um `IntersectionObserver` sobre os cinco ids de `nav` com `rootMargin: "-45% 0px
  -50% 0px"`; o último a intersectar vira ativo; ids ausentes são ignorados (páginas auxiliares).
  Folha e overlay animam por CSS (`animate-slide-in-right`, `animate-fade-in`); itens da folha com
  `style={{ animationDelay: `${i * 40}ms` }}` e classe `animate-fade-in`. Reduced motion: tudo
  instantâneo (CSS global já zera).
- **Estados**: hover em link `text-gray-900`; foco visível global; ativo `aria-current="true"`.
- **Acessibilidade**: `<header>` (banner), `<nav aria-label="Principal">`, botão de menu com
  `aria-expanded` e `aria-controls`, foco preso no sheet (Radix), Escape fecha, wordmark com `alt=""`
  dentro de link com `aria-label`.
- **Testes unitários** (`header.test.tsx`): (1) renderiza 5 links com `href` igual a `#${id}` de
  `nav`; (2) não renderiza "Entrar" quando `site.appUrl` é vazio (mock parcial de `@/content/site`
  com `vi.mock`); (3) botão de menu tem `aria-expanded="false"` e, após `userEvent.click`, o dialog
  aparece com os 5 links e `aria-expanded="true"`; (4) o link "Ver planos" é um `<a href="#planos">`.
- **Testes e2e** (`tests/e2e/header.spec.ts`): (1) após `page.mouse.wheel(0, 600)` o header tem
  `data-scrolled="true"`; (2) clicar em "Especialidades" na nav leva a URL com `#especialidades` e o
  link recebe `aria-current="true"` em até 2 s.

### 5.2 Barra de CTA fixa (mobile)

- **Arquivo**: `src/components/sections/mobile-cta-bar.tsx`, `"use client"`. Renderizada em
  `page.tsx` depois do footer.
- **Dados**: `plans`, `formatBRL`, `site.contact.whatsapp`, `ui.mobileBar`, `ui.leadForm.whatsappMessage`.
- **Layout**: `<div data-testid="cta-mobile" className="fixed inset-x-0 bottom-0 z-40 flex items-center
  justify-between gap-3 border-t border-gray-200 bg-white/92 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]
  backdrop-blur-md md:hidden">`. Esquerda: `<p className="font-mono text-xs leading-tight text-gray-700">`
  com `<span className="sr-only">Planos: </span>` e duas linhas `Individual R$ 49,90` / `Familiar R$ 97,90`
  (nomes e preços vindos de `plans`). Direita: Button primary sm asChild `<a href="#planos">{ui.mobileBar.cta}</a>`
  e, se houver WhatsApp, Button secondary sm asChild `<a href={whatsappUrl(...)} target="_blank"
  rel="noopener noreferrer" aria-label={ui.leadForm.whatsappCta}>` com `MessageCircle size={18}
  className="text-leaf-600"` (o ícone em leaf é a única pontuação; fundo branco).
- **Visibilidade**: um `IntersectionObserver` (threshold 0.05) sobre `#inicio`, `#planos`, `#contato` e
  `document.querySelector("footer")`; `visible = !heroVisible && !planosVisible && !contatoVisible &&
  !footerVisible`. Prop `forceVisible?: boolean` só para testes.
- **Motion**: `AnimatePresence` montando e desmontando: `initial={{ y: "100%" }} animate={{ y: 0 }}
  exit={{ y: "100%" }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}`. Desmontar de fato
  (não só esconder) para que `toBeVisible` reflita o estado.
- **Acessibilidade**: `role="region" aria-label="Atalho para planos"`; alvos de 40 px de altura no
  mínimo (sm = 40 px; use `size="md"` se o teste de toque reclamar). Não sobrepõe o footer porque some
  ao chegar nele.
- **Testes unitários**: (1) com `forceVisible` renderiza os dois preços formatados (`R$ 49,90` e
  `R$ 97,90`, normalizando NBSP); (2) sem WhatsApp configurado não há link para `wa.me`; (3) o link
  "Ver planos" aponta para `#planos`.
- **Testes e2e** (projeto mobile, `tests/e2e/mobile-bar.spec.ts`): (1) após rolar 1200 px a barra
  está visível (já coberto em `landing.spec.ts`); (2) em `page.goto("/#planos")` a barra não está
  visível.

### 5.3 Hero: Trilha da Amora

- **id**: `inicio`.
- **Arquivos**: `src/components/sections/hero.tsx` (server, copy e estrutura) e
  `src/components/sections/hero-stage.tsx` (`"use client"`, cluster animado, cards e parallax).
- **Dados**: `hero.*` (11.1), `plans[0].priceCents` via `formatBRL`, `specialties` (nomes dos nós),
  `Icon` para os cards.
- **Layout desktop**: `<Section id="inicio" surface="light" className="flex min-h-[88svh] items-center
  pt-28 pb-16 lg:pt-36 lg:pb-24" innerClassName="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">`.
  Coluna de copy `lg:col-span-6`: `<p className="eyebrow">{hero.eyebrow}</p>`, `<h1 className="mt-4
  ...classes H1">{hero.title}</h1>`, `<p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-gray-600
  sm:text-xl">{hero.lead}</p>`, linha de preço `<p className="mt-3 font-display text-base font-semibold
  text-gray-900">` com `hero.priceLine` onde `{price}` vira `<span className="font-mono">{formatBRL(plans[0].priceCents)}</span>`,
  CTAs `<div className="mt-8 flex flex-col gap-3 sm:flex-row">`: Button primary lg asChild `<a
  href="#planos">{hero.primaryCta}</a>` e Button secondary lg asChild `<a href="#como-funciona">{hero.secondaryCta}
  <ArrowRight size={18} aria-hidden /></a>`, trust `<p className="mt-6 flex max-w-[34rem] items-start gap-2
  text-sm text-gray-600"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-berry-600" aria-hidden />
  {hero.trust}</p>`. Coluna do palco `lg:col-span-6 relative`: `<HeroStage />`.
  Abaixo da grade, dentro do mesmo Section (`bleed` false), `<ul className="mt-14 flex flex-wrap gap-2"
  aria-label="Resumo da assinatura">` com um `Badge tone="neutral" size="md"` por item de
  `hero.proofChips`, cada um com `<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-berry-500" />`.
- **Layout mobile**: coluna única na ordem eyebrow, H1, lead, preço, CTA primário (largura total, 52 px),
  CTA secundário (largura total, secondary), trust, palco com cluster `max-w-[300px] mx-auto` e um único
  card (`hero.moments[0]`) renderizado estático abaixo do cluster; chips em `flex-wrap`.
- **HeroStage (spec visual)**: `<div ref className="relative mx-auto w-full max-w-[560px]">` com halo
  `<div aria-hidden className="absolute inset-[-10%] -z-10 rounded-full bg-[radial-gradient(closest-side,
  var(--color-berry-50),transparent)] opacity-90" />`, `<TrailCluster variant="full" animate="intro"
  confirmed={0} label={hero.clusterAlt} />` e três cards `<m.div aria-hidden className="absolute hidden
  w-[240px] items-center gap-3 rounded-card border border-gray-200 bg-white px-4 py-3 shadow-float lg:flex">`
  nas posições A `top-[6%] right-[-4%]`, B `bottom-[10%] right-[-6%]`, C `top-[46%] left-[-8%]`. Card:
  círculo `h-9 w-9 rounded-full grid place-items-center` (`bg-leaf-50 text-leaf-600` para os dois
  primeiros momentos, `bg-berry-50 text-berry-600` para o lembrete) com `Icon name size={18}`, rótulo
  `font-display text-sm font-bold text-gray-900`, texto `text-xs text-gray-600`.
- **Motion**: cascata do cluster (detalhe em 9.2, `animate="intro"`): hub 200 ms; trilhas internas a partir
  de 500 ms (700 ms, stagger 60); nós internos a partir de 700 ms (pop scale 0.7 para 1, 450 ms, stagger
  60); trilhas externas a partir de 1000 ms (600 ms, stagger 50); nós externos a partir de 1200 ms; cards
  `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}` com `delay` 1.4, 1.52 e 1.64 s e
  `duration` 0.5; nó 0 (Clínico geral) confirma em leaf com um único halo (r 22 para 40, opacity 0.6 para
  0, 600 ms) em 1900 ms. Tudo termina antes de 2,2 s; nada repete. Parallax (só `lg+` via
  `matchMedia("(min-width: 1024px)")` em efeito, e só sem reduced motion): `useScroll({ target, offset:
  ["start start", "end start"] })`, cluster `y = useTransform(p, [0, 1], [0, -40])`, cards `[0, -80]`,
  opacity do cluster `[1, 0.85]`. O texto do hero NÃO anima (é o LCP).
- **Estados**: CTAs seguem Button; cards não têm hover.
- **Acessibilidade**: um `<h1>`; cluster `role="img"` com `aria-label={hero.clusterAlt}`; cards
  `aria-hidden` (ilustração; o conteúdo real está no texto); chips em `<ul>` com `aria-label`.
- **Testes unitários** (`hero.test.tsx`, renderizando `Hero`): (1) `getByRole("heading", { level: 1 })`
  tem texto `hero.title`; (2) o link `hero.primaryCta` tem `href="#planos"` e o secundário
  `#como-funciona`; (3) a linha de preço contém `formatBRL(plans[0].priceCents)` (normalize NBSP);
  (4) a trust line contém "não é plano de saúde" e o cluster tem `role="img"` com `aria-label`.
- **Testes e2e** (`tests/e2e/hero.spec.ts`): (1) em viewport 360x740 o H1 e o CTA primário estão
  dentro da dobra (`boundingBox().y + height <= 740`); (2) após 2,5 s o nó `[data-node="0"]` do cluster
  tem `data-state="confirmed"`.

### 5.4 Por que a Moorah / Tudo em um lugar

- **id**: `por-que`.
- **Arquivos**: `src/components/sections/por-que.tsx` (server) e
  `src/components/sections/convergence-trail.tsx` (`"use client"`).
- **Dados**: `problems`, `problemsSection`, `manifesto` (11.2).
- **Layout desktop**: `<Section id="por-que" surface="soft">`. Bloco 1: `grid gap-10 lg:grid-cols-12`:
  `SectionHeading` (`lg:col-span-5`, eyebrow `problemsSection.eyebrow`, título `problemsSection.title`);
  `<RevealGroup as="ol" stagger={0.1} className="lg:col-span-7 divide-y divide-gray-200">` com um
  `<RevealItem as="li" className="grid grid-cols-[3rem_1fr] gap-4 py-6">` por problema: índice
  `<span className="font-mono text-xs tracking-[0.1em] text-gray-600 pt-1.5">0{n}</span>`, `<h3>` em
  classes de H3 de card, `<p className="mt-1 text-gray-600">`. Bloco 2 (`mt-20 lg:mt-24`): `<Reveal
  className="mx-auto max-w-[52rem] text-center">` com `<p className="eyebrow">{manifesto.eyebrow}</p>`,
  `<h3 className="mt-3 ...frase-manifesto">{manifesto.title}</h3>`, `<p className="mt-5 lead">{manifesto.text}</p>`,
  e `<ConvergenceTrail className="mt-12" />`.
- **Layout mobile**: coluna única; índice e título na mesma linha; ConvergenceTrail em versão vertical
  (viewBox 0 0 320 360), largura total, `max-w-[360px] mx-auto`.
- **ConvergenceTrail (spec visual)**: desktop `viewBox="0 0 1100 260"` (`hidden md:block`), mobile
  `viewBox="0 0 320 360"` (`md:hidden`). Cinco nós de origem r=8 `fill var(--color-ink)` em x=80,
  y=30/80/130/180/230 (desktop) com rótulo `manifesto.nodes[i]` em `<text class="font-mono text-[12px]
  fill-gray-700">` à direita do nó (x=100). Trilhas 2 px `stroke var(--color-berry-300)`, cantos em
  45 graus, pads r=4 `fill var(--color-ink)` nas dobras: n1 `M 96 30 H 660 L 760 130 H 972`, n2 `M 96 80
  H 710 L 760 130 H 972`, n3 `M 96 130 H 972`, n4 `M 96 180 H 710 L 760 130 H 972`, n5 `M 96 230 H 660
  L 760 130 H 972`. Hub r=28 em (1000,130), `fill var(--color-berry-100)` e `stroke var(--color-ink)`
  2 px; quando aceso `fill var(--color-berry-500)`. Rótulo `manifesto.hub` em HTML abaixo do SVG
  (`font-display font-semibold text-gray-900`), centrado sob o hub via grid. Mobile: nós em y=30, x=40,
  100, 160, 220, 280; hub em (160,320); trilhas `V 200` e depois 45 graus até (160, 292).
- **Motion**: `useInView(ref, { once: true, amount: 0.4 })`; trilhas `m.path initial={{ pathLength: 0 }}
  animate={inView ? { pathLength: 1 } : undefined}` 1000 ms `ease-in-out-soft` stagger 80 ms; rótulos
  `opacity` 0 para 1 acompanhando a própria trilha; hub `fill` berry-100 para berry-500 em 400 ms com
  delay 1,1 s; halo `m.circle` r 28 para 50 e opacity 0.6 para 0 em 700 ms, uma vez. Reduced motion:
  tudo no estado final (`pathLength: 1`, hub aceso).
- **Acessibilidade**: `<ol>` semântico; SVG `role="img"` com `aria-label={manifesto.svgAlt}`; textos
  dentro do SVG `aria-hidden`.
- **Testes unitários** (`por-que.test.tsx`): (1) renderiza os 3 títulos de `problems` como h3; (2) renderiza
  `manifesto.title`; (3) o SVG tem `role="img"` e `aria-label`; (4) os 5 rótulos de `manifesto.nodes`
  aparecem no documento.
- **Testes e2e** (`tests/e2e/por-que.spec.ts`): (1) `#por-que` existe e, após rolar até ele, o texto
  `manifesto.hub` está visível; (2) em desktop o hub `[data-hub]` recebe `data-state="lit"` em até 3 s.

### 5.5 Como funciona

- **id**: `como-funciona`.
- **Arquivos**: `src/components/sections/como-funciona.tsx` (server) e
  `src/components/sections/steps-trail.tsx` (`"use client"`, trilha, nós e cards).
- **Dados**: `steps`, `howItWorks` (11.3), `mocks` (11.7: `reminderChips`, `connected`, `signed`,
  `slotConfirmed`).
- **Layout desktop**: `<Section id="como-funciona" surface="light">`. `SectionHeading align="center"`
  (eyebrow, `howItWorks.title`, `howItWorks.lead`). `<StepsTrail />` em `mt-14`: `<ol aria-label="Passos"
  className="relative grid gap-6 lg:grid-cols-4">`. Trilha horizontal (`hidden lg:block`): `<div aria-hidden
  className="absolute left-[12.5%] right-[12.5%] top-2 h-0.5 bg-gray-200"><m.div className="h-full
  origin-left bg-berry-400" style={{ scaleX }} /></div>`. Cada `<li className="relative flex flex-col
  pt-8">` tem um nó `<span data-lit className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2
  rounded-full border-2 border-gray-300 bg-white transition-colors duration-300 data-[lit=true]:border-ink
  data-[lit=true]:bg-ink" />` e um card `rounded-2xl border border-gray-200 bg-white p-6 shadow-card flex
  flex-1 flex-col gap-4`: cabeçalho `flex items-center justify-between` com índice mono `0{n}` e
  `<span className="grid h-10 w-10 place-items-center rounded-full bg-berry-50 text-berry-600"><Icon
  name={step.icon} size={22} /></span>`; `<h3>` H3 de card; `<p className="text-gray-600">`; ilustração
  `<div aria-hidden className="mt-auto relative h-28 overflow-hidden rounded-xl border border-gray-100
  bg-gray-50 p-3">`.
- **Ilustrações por passo** (todas `aria-hidden`, sem datas nem horários):
  1. Grade 7x3 de pontos `h-1.5 w-1.5 rounded-full bg-gray-300` com uma célula `bg-berry-500` e, ao
     lado, `Badge tone="leaf" size="sm" icon={<Check size={12} />}` com `mocks.slotConfirmed`.
  2. Três chips `rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold
     text-gray-800 shadow-card` empilhados com deslocamento de 6 px (`mocks.reminderChips`); o último
     tem um ponto `bg-leaf-500` antes do texto.
  3. Moldura `h-full rounded-lg bg-ink p-2` com dois retângulos `rounded bg-white/10` lado a lado, cada
     um com um círculo (`bg-berry-300` e `bg-gray-200`) e, embaixo à esquerda, chip `bg-white/10
     text-leaf-300 text-[10px] font-semibold` com ponto `bg-leaf-400` e `mocks.connected`.
  4. Folha branca `rounded-lg bg-white p-3 shadow-card` com três linhas `h-1.5 rounded bg-gray-200` de
     larguras 80/60/70% e carimbo `font-mono text-[10px] uppercase tracking-[0.18em] text-leaf-700 border
     border-leaf-300 rounded px-1.5 py-0.5` com `mocks.signed`.
- **Layout mobile**: `<ol className="relative grid gap-6 pl-8">` com régua `absolute left-[7px] top-2 bottom-2
  w-0.5 bg-gray-200` e segmento `origin-top bg-berry-400` com `scaleY`; nós `absolute -left-8 top-6`
  por item; cards em largura total.
- **Motion**: `useInView(ref, { once: true, amount: 0.3 })` no `<ol>`. Linha `scaleX` (ou `scaleY`) 0 para 1
  em 1400 ms `ease-in-out-soft`. Nós acendem com `setTimeout` em 0, 350, 700 e 1050 ms (`data-lit`).
  Cards `m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55,
  delay: i * 0.35 }}`. Chips do passo 2 `initial={{ opacity: 0, y: 8 }}` com stagger 140 ms após o card.
  Reduced motion: linha completa, nós acesos, cards visíveis.
- **Estados**: card hover `hover:-translate-y-0.5 hover:shadow-float transition duration-250`.
- **Acessibilidade**: `<ol aria-label="Passos">`, `<h3>` por passo, ilustrações `aria-hidden`, índice
  visível é texto normal (não `aria-hidden`).
- **Testes unitários** (`como-funciona.test.tsx`): (1) 4 `<h3>` com os títulos de `steps` na ordem;
  (2) índices "01" a "04" presentes; (3) todas as ilustrações têm `aria-hidden="true"` (4 elementos
  `[data-illustration]`); (4) os três chips de lembrete estão no documento.
- **Testes e2e** (`tests/e2e/como-funciona.spec.ts`): (1) `#como-funciona` tem 4 headings nível 3;
  (2) em desktop, após rolar até a seção, os 4 nós `[data-lit]` ficam `data-lit="true"` em até 3 s.

### 5.6 Especialidades

- **id**: `especialidades`.
- **Arquivos**: `src/components/sections/especialidades.tsx` (server, heading e dados) e
  `src/components/sections/specialties-index.tsx` (`"use client"`, lista + cluster espelhado).
- **Dados**: `specialties`, `specialtiesSection` (11.4), `faq[2].a` como lead, `Icon`.
- **Layout desktop**: `<Section id="especialidades" surface="soft" innerClassName="grid gap-10
  lg:grid-cols-12">`. Coluna esquerda `lg:col-span-4 lg:sticky lg:top-28 self-start`: `SectionHeading`
  (eyebrow, `specialtiesSection.title`, description `faq[2].a`) e `<TrailCluster variant="mini"
  animate="draw" active={active} className="mt-8 hidden w-[260px] lg:block" />` (sem `label`, logo
  `aria-hidden`). Coluna direita `lg:col-span-8`: `<RevealGroup as="ul" stagger={0.05} amount={0.15}
  className="grid gap-x-8 sm:grid-cols-2" aria-label="Especialidades disponíveis">` com um `<RevealItem
  as="li">` por especialidade: `<div data-specialty={i} onPointerEnter onPointerLeave className="group
  -mx-2 flex items-start gap-4 rounded-control px-2 py-4 border-b border-gray-200 transition-colors
  duration-200 hover:bg-white">` com `<span className="grid h-10 w-10 shrink-0 place-items-center
  rounded-full bg-berry-50 text-berry-600 transition-transform duration-200 group-hover:translate-x-0.5">
  <Icon name size={20} /></span>`, `<h3 className="font-display text-lg font-semibold text-gray-900
  lg:text-[1.375rem]">{name}</h3>`, `<p className="mt-0.5 text-sm text-gray-600 lg:text-base">{blurb}</p>`.
- **Layout mobile**: cluster oculto; lista em uma coluna, 12 linhas compactas (ícone 36 px, nome 18 px,
  blurb 14 px).
- **Interação assinatura**: `onPointerEnter` na linha define `active = i`; `onPointerLeave` volta a `null`.
  O nó `i` do cluster acende (`fill` berry-500, trilha ligada com `stroke-width` 3). Só hover, de mão
  única, sem foco em elementos não interativos. Sob `pointer: coarse` o handler não faz nada.
- **Motion**: linhas `fade-up` 450 ms, stagger 50 ms; cluster `animate="draw"` desenha as trilhas em
  1200 ms ao entrar em vista; troca de nó ativo em 220 ms (transição CSS de `fill`).
- **Acessibilidade**: `<ul aria-label>`, `<h3>` por especialidade, cluster decorativo `aria-hidden`; nenhuma
  informação aparece só no hover (o nome está na lista).
- **Testes unitários** (`especialidades.test.tsx`): (1) 12 `<li>` e 12 `<h3>` com os nomes de
  `specialties`; (2) não há `<button>` dentro da lista; (3) `fireEvent.pointerEnter` na linha 3 faz o
  cluster ter `data-active="3"`, e `pointerLeave` remove.
- **Testes e2e** (`tests/e2e/especialidades.spec.ts`): (1) `#especialidades li` conta 12; (2) em desktop,
  hover em "Pediatria" deixa `[data-node="1"]` com `data-state="active"`.

### 5.7 Cartão Moorah

- **id**: `cartao`.
- **Arquivos**: `src/components/sections/cartao.tsx` (server, casca e texto) e
  `src/components/sections/card-stage.tsx` (`"use client"`, importado em `cartao.tsx` via `next/dynamic`
  com `loading: () => <div className="skeleton aspect-[1400/933] w-full max-w-[560px] rounded-xl" />`).
- **Dados**: `benefits[0]`, `cardSection` (11.5), `plans[1].features[1]`, `mocks.cardSamples`,
  `mocks.cardHolders`, asset `cartao-moorah.webp`.
- **Layout desktop**: `<Section id="cartao" surface="plum" innerClassName="grid items-center gap-12
  lg:grid-cols-12">`. Texto `lg:col-span-5`: `SectionHeading tone="plum"` (eyebrow `cardSection.eyebrow`,
  título `cardSection.title`, description `benefits[0].text`); lista de usos `<ul className="mt-8 grid
  grid-cols-2 gap-3">` com `<li data-use className="flex items-center gap-2 text-berry-100"><span
  className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-leaf-300"><Check size={14}
  /></span>{use}</li>` para `cardSection.uses`; `<p className="mt-6 text-sm text-berry-200">
  {plans[1].features[1]}</p>`. O `CardStage` ocupa `lg:col-span-7` e contém o segmented control e o
  cartão.
- **CardStage (spec visual)**: `<div className="flex flex-col items-center gap-8">`. `SegmentedControl
  tone="plum" label={cardSection.holderLabel} options={mocks.cardHolders}` (valores `0..3`). Palco
  `<div className="relative w-full max-w-[560px] [perspective:1200px]">` com `<m.div style={{ rotateX,
  rotateY }} className="relative will-change-transform">`: `<Image src="/brand/cartao-moorah.webp"
  alt={cardSection.imageAlt} width={1400} height={933} sizes="(min-width: 1024px) 560px, 92vw"
  className="h-auto w-full rounded-xl shadow-deep" />`; brilho `<m.div aria-hidden style={{ x: glareX }}
  className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(115deg,transparent_35%,
  rgb(255_255_255/0.12)_50%,transparent_65%)]" />`; sobreposição `<div className="absolute inset-x-[7%]
  bottom-[13%] text-white">`: `<p className="font-mono text-[11px] uppercase tracking-[0.18em]
  text-berry-200">{cardSection.numberLabel}</p>`, número `<p aria-label={`${cardSection.sampleAria}:
  ${grouped}`} className="mt-1 font-mono text-xl tabular-nums tracking-[0.12em] lg:text-[1.625rem]">`
  com 12 `<span aria-hidden data-digit>` agrupados 4-4-4 por `gap-3`, e `<div className="mt-3 flex
  items-center justify-between text-xs text-white/80"><span>{mocks.cardHolders[holder].label}</span>
  <span>{site.product}</span></div>`. Confirme no arquivo real que a faixa inferior esquerda do cartão é
  lisa (a amora em relevo fica à direita); ajuste `bottom-[13%]` se necessário.
- **Layout mobile**: texto acima, segmented control `size="lg"` em largura total (rolável se não
  couber), cartão em `w-[92vw]` sem tilt.
- **Motion**: entrada `useInView(ref, { once: true, amount: 0.4 })`: cartão `initial={{ opacity: 0, y: 40,
  rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}` 800 ms `ease-out-expo`. Dígitos "se
  resolvem": um único `setInterval` de 60 ms por 20 ticks; o dígito `i` mostra `(tick * 7 + i * 3) % 10`
  até o tick `6 + i` e então assenta no valor real; ao terminar, os `<li data-use>` recebem `data-lit`
  em sequência (stagger 90 ms, o ponto do check passa de `bg-white/10` para `bg-leaf-500/20`). Trocar
  de titular reexecuta a resolução com 12 ticks. Tilt: `useMotionValue` para x/y normalizados (-0.5 a
  0.5) atualizados em `onPointerMove`, `useSpring` (stiffness 120, damping 18), `rotateY = useTransform(sx,
  [-0.5, 0.5], [-8, 8])`, `rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])`, `glareX = useTransform(sx,
  [-0.5, 0.5], ["-30%", "30%"])`; `onPointerLeave` zera; só com `matchMedia("(hover: hover) and
  (pointer: fine)")`. Pausa do intervalo com `document.hidden`. Reduced motion: cartão plano, dígitos
  finais imediatos, usos já acesos.
- **Estados**: segmented control conforme 4.7 (tone plum).
- **Acessibilidade**: radiogroup rotulado; número com `aria-label` que diz "Exemplo de numeração" e o
  valor final; dígitos individuais `aria-hidden`; `alt` do cartão descritivo; sem `aria-live` (evita
  ruído durante a resolução).
- **Testes unitários** (`card-stage.test.tsx`, com `vi.mock("motion/react")` devolvendo `useInView: () =>
  true` e `vi.useFakeTimers()`): (1) renderiza 4 radios e "Titular" começa `aria-checked="true"`;
  (2) após `vi.advanceTimersByTime(1500)` os 12 dígitos concatenados são `mocks.cardSamples[0]`;
  (3) clicar em "Dependente 1" e avançar 1000 ms resulta em `mocks.cardSamples[1]`; (4) com
  `useReducedMotion` mockado `true`, os dígitos finais aparecem sem avançar timers.
- **Testes e2e** (`tests/e2e/cartao.spec.ts`): (1) `#cartao img[alt]` visível com o alt esperado;
  (2) clicar em "Dependente 2" muda o `aria-label` do número para terminar em `3002` agrupado.

### 5.8 Benefícios e portal do paciente

- **id**: `beneficios`.
- **Arquivos**: `src/components/sections/beneficios.tsx` (server, bento e textos),
  `src/components/sections/portal-mock.tsx` (`"use client"`), `src/components/sections/pharmacy-mock.tsx`
  (`"use client"`), `src/components/sections/exams-network.tsx` (`"use client"`). Os três mocks entram
  em `beneficios.tsx` por `next/dynamic` com `loading` em `skeleton` do mesmo tamanho.
- **Dados**: `benefits[1..5]`, `benefitsSection` (11.6), `mocks` (11.7), `specialties[0..2].name`,
  `mocks.cardSamples`, `mocks.cardHolders`, `steps[1].text` (chip de lembrete), `Icon`.
- **Layout desktop**: `<Section id="beneficios" surface="light">`. `SectionHeading` (eyebrow, título,
  lead). `<RevealGroup stagger={0.08} amount={0.15} className="mt-12 grid gap-5 lg:grid-cols-6
  lg:auto-rows-[minmax(220px,auto)]">`. Tiles (`RevealItem as="article"`), na ordem do DOM:
  Portal (`benefits[4]`, `lg:col-span-3 lg:row-span-2`), Exames (`benefits[2]`, `lg:col-span-3`),
  Farmácias (`benefits[1]`, `lg:col-span-3`), Lojas (`benefits[3]`, `lg:col-span-3`), Segurança
  (`benefits[5]`, `lg:col-span-3`). Tile: `group flex flex-col gap-4 rounded-2xl border border-gray-200
  bg-white p-6 shadow-card transition-[transform,box-shadow] duration-250 ease-out-expo
  hover:-translate-y-0.5 hover:shadow-float lg:p-8`; `<span className="grid h-11 w-11 place-items-center
  rounded-full bg-berry-50 text-berry-600"><Icon size={22} /></span>`, `<h3>` H3 de card, `<p
  className="text-gray-600">`, ilustração em `mt-auto`.
- **Layout mobile**: coluna única na mesma ordem; portal com `min-h-[280px]`.
- **PortalMock**: `<div className="rounded-xl border border-gray-200 bg-gray-50 p-3 min-h-[280px]">`.
  Fase skeleton (900 ms após `useInView`): três barras `skeleton h-7 w-20` e quatro linhas `skeleton
  h-10`. Fase conteúdo (crossfade 400 ms com `AnimatePresence`): chip `Badge tone="berry"` no topo com
  `mocks.reminderChip` (texto derivado de `steps[1]`), `<div role="tablist" aria-label={mocks.portalTabsLabel}>`
  com três `<button role="tab" aria-selected aria-controls id tabIndex>` (`mocks.portalTabs`), classes
  `rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 aria-selected:bg-ink aria-selected:text-white`,
  navegação por ArrowLeft/ArrowRight. Painéis (`role="tabpanel"`): Histórico com 3 linhas `flex
  items-center justify-between rounded-control bg-white px-3 py-2 text-sm` (nome de `specialties[i]` e
  `Badge tone="leaf" size="sm"` com `mocks.statusDone` nas duas primeiras, `Badge tone="berry" size="sm"`
  com `mocks.statusScheduled` na terceira); Documentos com 3 linhas (`mocks.documents`) e carimbo mono
  `mocks.signed` em `text-leaf-700`; Dependentes com 4 linhas (`mocks.cardHolders`), cada uma com um
  mini cartão `h-6 w-10 rounded-[4px] bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]`
  e os 4 últimos dígitos de `mocks.cardSamples[i]` em mono. Linhas entram com stagger 60 ms.
- **PharmacyMock**: `<div className="rounded-xl border border-gray-200 bg-gray-50 p-3">`: `<p className="font-mono
  text-[11px] uppercase tracking-[0.18em] text-gray-600">{mocks.cardNumberField}</p>`, caixa `mt-1 h-11
  rounded-control border border-gray-300 bg-white px-3 font-mono text-sm tracking-[0.12em] flex items-center`
  onde os 12 dígitos de `mocks.cardSamples[0]` (agrupados) aparecem um a um a cada 70 ms após entrar em
  vista, seguidos de `Badge tone="leaf" size="sm" icon={<Check size={12} />}` com `mocks.cardRecognized`
  (scale 0.9 para 1, 300 ms). Sem percentual de desconto.
- **ExamsNetwork**: SVG `viewBox="0 0 320 120"` `aria-hidden`: nó central r=8 em (160,60) `fill
  var(--color-ink)`; 8 nós r=5 em (40,20), (100,20), (220,20), (280,20), (40,100), (100,100), (220,100),
  (280,100) `fill var(--color-gray-300)`; trilhas 2 px `stroke var(--color-berry-300)` em 45 graus
  (ex.: `M 160 60 H 120 L 100 40 V 25`). Ao entrar em vista, `pathLength` 0 para 1 em 1200 ms e os nós
  trocam para `fill var(--color-berry-500)` com stagger 60 ms; ao final aparece `Badge tone="leaf"
  size="sm"` com `mocks.discountApplied` no canto do tile.
- **Lojas** e **Segurança**: sem mock animado. Segurança traz `<ul className="mt-auto flex flex-wrap gap-2">`
  com `Badge tone="neutral" icon={<Lock size={12} />}` para cada item de `mocks.securityChips`.
- **Motion**: tiles `fade-up` 550 ms, stagger 80 ms; mocks conforme acima; hover em CSS. Intervalos
  pausam com `document.hidden`. Reduced motion: portal já no estado de conteúdo (sem skeleton
  demonstrativo), farmácia com número completo e selo visível, rede desenhada.
- **Acessibilidade**: tabs reais com roles, `aria-selected`, `aria-controls`, roving tabindex; mocks
  não interativos (`PharmacyMock`, `ExamsNetwork`) com `aria-hidden`; textos dos painéis são legíveis
  por leitor de tela.
- **Testes unitários** (`beneficios.test.tsx` e `portal-mock.test.tsx`, com `useInView` mockado e
  fake timers): (1) 5 `<h3>` com `benefits[1..5].title`; (2) após 1000 ms o portal mostra 3 tabs, a
  primeira com `aria-selected="true"`; (3) clicar em "Dependentes" mostra 4 titulares
  (`mocks.cardHolders`); (4) `PharmacyMock` mostra `mocks.cardRecognized` após 1200 ms.
- **Testes e2e** (`tests/e2e/beneficios.spec.ts`): (1) `#beneficios [role=tablist]` visível após rolar;
  (2) focar a primeira tab e pressionar ArrowRight seleciona a segunda (`aria-selected="true"`).

### 5.9 Planos

- **id**: `planos`.
- **Arquivos**: `src/components/sections/planos.tsx` (server, heading, painel incluído/não incluído,
  callout) e `src/components/sections/plan-selector.tsx` (`"use client"`, seletor de pessoas e os dois
  cards).
- **Dados**: `plans`, `planNotes`, `formatBRL`, `perPersonCents`, `plansSection` (11.8), `LeadDialogButton`.
- **Layout desktop**: `<Section id="planos" surface="soft">`. `SectionHeading align="center"` (eyebrow,
  `plansSection.title`, `plansSection.lead`). `<PlanSelector />`: `SegmentedControl` centralizado em
  `mt-10` (label `plansSection.peopleQuestion`, opções "1" a "4", valor inicial `"4"`); `<div className="mx-auto
  mt-10 grid max-w-[960px] gap-6 lg:grid-cols-2 lg:items-stretch">` com Individual à esquerda e Familiar
  à direita (`order-first lg:order-last` no Familiar para vir primeiro no mobile). Card base
  `<article aria-labelledby data-plan data-active className="relative flex flex-col rounded-3xl p-8
  transition-[box-shadow,transform,opacity] duration-300 ease-out-expo lg:p-10">`. Individual:
  `border border-gray-200 bg-white shadow-card`; Familiar: `bg-ink text-white shadow-deep lg:scale-[1.02]`.
  Ativo: `data-[active=true]:ring-2 data-[active=true]:ring-berry-500 data-[active=true]:ring-offset-2
  data-[active=true]:ring-offset-gray-50`; inativo `data-[active=false]:opacity-90`. Conteúdo: nome
  `<h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-berry-600">` (Familiar
  `text-berry-300`); badge `Badge tone="berry"` com `plan.badge` em `absolute right-6 top-6`; headline
  `mt-3 text-gray-600` (Familiar `text-berry-100`); preço `<p className="mt-6 flex items-end gap-1">
  <span className="...preço">{formatBRL(plan.priceCents)}</span><span className="pb-1 text-gray-600">/mês</span></p>`
  (Familiar `text-berry-200` no sufixo); linha por pessoa `<p className="mt-2 font-mono text-sm">`:
  Individual mostra `plansSection.coversOne`; Familiar mostra `plansSection.perPersonLabel` com `{price}`
  substituído pelo contador, ou `plansSection.singleHint` quando 1 pessoa; `<p className="mt-1 text-sm">
  {plan.peopleLabel}</p>`; features `<ul className="mt-8 space-y-3">` com `<li className="flex gap-3
  text-[15px]"><Check size={18} className="mt-0.5 shrink-0 text-leaf-500" />` (Familiar `text-leaf-300`);
  CTA `<LeadDialogButton plan={plan.id} size="lg" fullWidth className="mt-8" variant={plan.id ===
  "familiar" ? "plum" : "primary"} />`; Familiar ainda tem `<p className="mt-3 text-center text-xs
  text-berry-200">{plansSection.familyNote}</p>`.
  Abaixo do seletor (em `planos.tsx`, `mx-auto mt-10 max-w-[960px] space-y-6`): `<p className="text-center
  text-sm text-gray-600">{planNotes[0]}</p>`; `<p className="text-center text-sm text-gray-700">{planNotes[1]}
  <a href="#duvidas" className="ml-1 font-semibold text-berry-700 underline underline-offset-4">
  {plansSection.faqLink}</a></p>`; painel `<div className="grid overflow-hidden rounded-2xl border
  border-gray-200 bg-white md:grid-cols-2">`: coluna incluído `p-6 lg:p-8` com `<h3 className="flex
  items-center gap-2 font-display font-semibold text-gray-900"><CircleCheck size={20} className="text-leaf-600" />
  {plansSection.includedTitle}</h3>` e `<ul className="mt-4 space-y-2.5">` (`Check` leaf-500, texto
  `text-[15px] text-gray-700`) para `plansSection.included`; coluna não incluído `border-t border-gray-200
  bg-gray-50 p-6 md:border-l md:border-t-0 lg:p-8` com `Minus` gray-500 no título e `Minus` gray-400
  nos itens de `plansSection.notIncluded`. Callout `<p className="flex items-start gap-3 rounded-card
  border border-critical-500/40 bg-white p-4 text-sm text-gray-900"><Siren size={20} className="mt-0.5
  shrink-0 text-critical-500" />` com `plansSection.emergency`, onde "192" vem em `<span className="font-mono
  font-bold">`.
- **Layout mobile**: seletor `size="lg"` em largura total; cards empilhados com Familiar primeiro; painel
  em uma coluna.
- **Interação assinatura**: `people` (1 a 4). `active = people === 1 ? "individual" : "familiar"`.
  `familiarPerPerson = perPersonCents({ priceCents: plans[1].priceCents, people })` (4 = 2448, 3 = 3263,
  2 = 4895). Só aritmética sobre `site.ts`.
- **Motion**: cards `Reveal` stagger 120 ms; troca de ativo por CSS 300 ms; contador `const mv =
  useMotionValue(familiarPerPerson); useEffect(() => mv.set(familiarPerPerson))`, `const spring =
  useSpring(mv, { stiffness: 90, damping: 20 })`, `const text = useTransform(spring, (v) =>
  formatBRL(Math.round(v)))`, `<m.span>{text}</m.span>`; reduced motion: renderiza `formatBRL(familiarPerPerson)`
  direto. Painel e callout `Reveal`.
- **Estados**: radiogroup conforme 4.7; cards ativo/inativo; botões seguem Button; link do FAQ com
  `hover:text-berry-800`.
- **Acessibilidade**: `article aria-labelledby` apontando para o `<h3>` do nome; `<span className="sr-only"
  aria-live="polite">` com o valor final por pessoa (não o valor animado); seletor rotulado; CTAs são
  `<button>` (abrem dialog).
- **Testes unitários** (`plan-selector.test.tsx` e `planos.test.tsx`, reduced motion mockado `true` para
  texto imediato): (1) padrão 4 pessoas mostra "24,48" e Familiar `data-active="true"`; (2) escolher
  "1" mostra `plansSection.singleHint` e Individual `data-active="true"`; (3) escolher "2" mostra
  "48,95"; (4) `planos.tsx` renderiza "não é plano de saúde", 5 itens incluídos, 5 não incluídos e o
  callout com "192"; (5) os dois CTAs são `role="button"` com os textos de `plans[].cta`.
- **Testes e2e** (`tests/e2e/planos.spec.ts`): (1) o teste existente de preços em `landing.spec.ts`
  continua passando; (2) clicar em "2" no seletor faz "48,95" aparecer em até 2 s.

### 5.10 Diferenciais

- **id**: `diferenciais`.
- **Arquivo**: `src/components/sections/diferenciais.tsx` (server; usa `RevealGroup`/`RevealItem`).
- **Dados**: `differentiators`, `differentiatorsSection` (11.9), `Icon`.
- **Layout**: `<Section id="diferenciais" surface="light">`. `SectionHeading` (eyebrow, título). `<RevealGroup
  as="ul" stagger={0.15} amount={0.4} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">`;
  cada `<RevealItem as="li" className="relative pt-6">` contém `<RevealItem as="span" variant="line"
  className="absolute left-0 top-0 h-0.5 w-full origin-left bg-ink" aria-hidden />` (irmão dentro do mesmo
  grupo, herda o stagger), `<span className="font-mono text-xs tracking-[0.1em] text-gray-600">0{i+1}</span>`,
  `<span className="mt-4 grid h-10 w-10 place-items-center rounded-full bg-berry-50 text-berry-600"><Icon
  size={22} /></span>`, `<h3 className="mt-4 ...H3">`, `<p className="mt-2 text-gray-600">`.
  Mobile: 1 coluna; `sm`: 2 colunas.
- **Motion**: hairlines `scaleX` 0 para 1 em 500 ms `ease-in-out-soft` com stagger 150 ms; conteúdo
  `fade-up` 450 ms no mesmo stagger. Reduced motion: estático.
- **Acessibilidade**: `<ul>` com `<li>`, `<h3>` por item, hairline `aria-hidden`.
- **Testes unitários** (`diferenciais.test.tsx`): (1) 4 `<h3>` com os títulos de `differentiators`;
  (2) índices "01" a "04"; (3) `differentiatorsSection.title` presente como h2.
- **Testes e2e** (`tests/e2e/diferenciais.spec.ts`): (1) `#diferenciais` tem 4 headings nível 3.

### 5.11 Dúvidas frequentes

- **id**: `duvidas`.
- **Arquivos**: `src/components/sections/duvidas.tsx` (server, casca e coluna lateral) e
  `src/components/sections/faq-panel.tsx` (`"use client"`, accordion + estado da pergunta aberta).
- **Dados**: `faq`, `faqSection` (11.11), `legalNotes[2]`, `site.contact.email`, `site.contact.whatsapp`.
- **Layout desktop**: `<Section id="duvidas" surface="soft" innerClassName="grid gap-10 lg:grid-cols-12">`.
  Coluna lateral (PRIMEIRA no DOM, `order-2 lg:order-1 lg:col-span-4 lg:sticky lg:top-28 self-start
  space-y-6`): `SectionHeading` (eyebrow, `faqSection.title`); card de emergência `<div data-emergency
  className="rounded-2xl border border-gray-200 border-l-4 border-l-critical-500 bg-white p-6
  transition-transform duration-500">` com `<p className="font-mono text-[11px] uppercase tracking-[0.18em]
  text-gray-600">{faqSection.emergencyTitle}</p>`, `<p className="mt-2 flex items-baseline gap-2"><span
  className="font-mono text-[2rem] font-bold leading-none text-critical-500">192</span><span className="font-display
  font-semibold text-gray-900">{faqSection.emergencyLabel}</span></p>`, `<p className="mt-2 text-sm
  text-gray-700">{faqSection.emergencyText}</p>`; card de contato `rounded-2xl border border-gray-200
  bg-white p-6` com `<h3>` `faqSection.contactTitle`, `<p className="mt-1 text-sm text-gray-600">
  {faqSection.contactText}</p>`, `<a href={`mailto:${site.contact.email}`} className="mt-3 inline-block
  font-mono text-sm text-berry-700 underline underline-offset-4">{site.contact.email}</a>` e, se houver
  WhatsApp, `Button secondary sm asChild <a href={whatsappUrl(...)} target="_blank" rel="noopener
  noreferrer">` com `MessageCircle` leaf-600. Só links nesta coluna, nenhum `<button>`. Accordion
  (`order-1 lg:order-2 lg:col-span-8`): `<FaqPanel />` renderiza `<Accordion type="single" collapsible
  defaultValue="faq-1" onValueChange>` com `<AccordionItem value={`faq-${i}`}>` por item, `AccordionTrigger`
  com `faq[i].q`, `AccordionContent` com `faq[i].a`; no item 7 (`faq[7]`, emergência) o conteúdo
  termina com `Badge tone="critical" size="md"` mostrando `192` em mono e `faqSection.emergencyLabel`.
- **Layout mobile**: accordion primeiro (por `order`), depois os cards.
- **Interação assinatura**: quando `faq-7` abre, `FaqPanel` seta `data-emergency-open="true"` no
  contêiner da seção (via `ref` no ancestral `[data-faq-root]`), e o card de emergência ganha uma
  única animação CSS `pulse-once` (scale 1 para 1.03 para 1, 500 ms) definida com `@keyframes` local
  via classe `data-[emergency-open=true]:animate-[pulse-once_500ms_var(--ease-out-expo)]` (declare o
  keyframe em `globals.css` na Fase 0 como `--animate-pulse-once` se preferir; ambas as formas são
  aceitas).
- **Motion**: itens `Reveal` stagger 50 ms (`RevealGroup` envolvendo os items); abertura por CSS
  (`animate-accordion-down/up`); ícone `Plus` gira 45 graus em 250 ms. Reduced motion: sem transição.
- **Acessibilidade**: Radix cuida de `aria-expanded`/`aria-controls`; triggers dentro de `<h3>`;
  `defaultValue` no segundo item; a coluna lateral não tem botões; e-mail como link `mailto`.
- **Testes unitários** (`duvidas.test.tsx`): (1) 9 gatilhos `role="button"` com os textos de `faq[].q`;
  (2) o segundo começa `aria-expanded="true"` e o primeiro `"false"`; (3) clicar no primeiro abre-o e
  fecha o segundo; (4) o card de emergência mostra "192" e não há `<button>` antes do primeiro gatilho
  na ordem do DOM (`container.querySelector("button")` é o gatilho de `faq[0].q`).
- **Testes e2e** (`tests/e2e/duvidas.spec.ts`): (1) o teste existente de teclado continua passando;
  (2) abrir "E em caso de emergência?" mostra o selo com "192" dentro do accordion e o card lateral
  recebe `data-emergency-open="true"`.

### 5.12 CTA final e formulário

- **id**: `contato`.
- **Arquivo**: `src/components/sections/contato.tsx` (server; usa `LeadForm` via `next/dynamic` com
  `loading` de 5 blocos `skeleton h-12`, `TrailCluster variant="outline"` e `Reveal`).
- **Dados**: `finalCta` (11.12), `ui.leadForm.whatsappCta`, `ui.leadForm.whatsappMessage`,
  `site.contact.whatsapp`, `legalNotes[0]`.
- **Layout desktop**: `<Section id="contato" surface="plum" innerClassName="relative grid items-center
  gap-12 lg:grid-cols-12">`. Fundo: `<TrailCluster variant="outline" animate="draw" className="pointer-events-none
  absolute -left-24 top-1/2 hidden w-[520px] -translate-y-1/2 opacity-25 lg:block" />` (sem `label`).
  Texto `relative lg:col-span-6`: `<Reveal><p className="eyebrow text-berry-300">{finalCta.eyebrow}</p>
  <h2 className="mt-3 ...H2 do CTA final">{finalCta.title}</h2><p className="mt-6 max-w-[32rem] text-lg
  text-berry-100 lg:text-xl">{finalCta.text}</p></Reveal>`; botões `<div className="mt-8 flex flex-col
  gap-3 sm:flex-row">`: Button `variant="plum" size="lg"` asChild `<a href="#planos">{finalCta.primaryCta}</a>`
  e, se houver WhatsApp, Button `variant="outline-light" size="lg"` asChild `<a target="_blank"
  rel="noopener noreferrer">` com `MessageCircle` e `ui.leadForm.whatsappCta`. Formulário `lg:col-span-6`:
  `<Reveal delay={0.2}><div className="rounded-2xl bg-white p-6 shadow-deep sm:p-8"><h3 className="font-display
  text-2xl font-bold text-gray-900">{ui.leadForm.title}</h3><p className="mt-1 text-sm text-gray-600">
  {ui.leadForm.subtitle}</p><LeadForm defaultPlan="familiar" className="mt-6" /><p className="mt-4 text-xs
  text-gray-600">{legalNotes[0]}</p></div></Reveal>`.
- **Layout mobile**: texto, botões em largura total, formulário abaixo; cluster oculto.
- **Motion**: cluster outline desenha em 1600 ms ao entrar em vista (stagger 50 ms por trilha); texto
  `fade-up` 600 ms; formulário `fade-up` com delay 200 ms; estados do formulário conforme 4.8. Reduced
  motion: cluster desenhado, tudo visível.
- **Acessibilidade**: `<h2>` da seção; `<h3>` do formulário; labels visíveis; `role="status"` no sucesso e
  `role="alert"` no erro; contraste berry-100 sobre ink 10:1.
- **Testes unitários** (`contato.test.tsx`): (1) `finalCta.title` como h2; (2) o formulário tem campos
  com labels "Nome", "E-mail" e "Plano de interesse", e o select começa em `familiar`; (3) sem WhatsApp
  configurado não há link `wa.me`; (4) o link primário aponta para `#planos`.
- **Testes e2e** (`tests/e2e/contato.spec.ts`): (1) com `page.route("**/api/leads", ...)` devolvendo
  `{ ok: true }`, preencher nome, e-mail, marcar o consentimento e enviar mostra `ui.leadForm.successTitle`
  em `role="status"`; (2) enviar vazio mostra "Informe seu nome." e o campo Nome fica com
  `aria-invalid="true"`.

### 5.13 Footer

- **Arquivo**: `src/components/sections/footer.tsx` (server).
- **Dados**: `site.*`, `nav`, `legalNotes`, `site.contact.cnpj`, `site.social`, `ui.footer` (11.10).
- **Layout desktop**: `<footer className="border-t border-gray-200 bg-white py-16 lg:py-20">` com
  `<Reveal variant="fade"><Container className="grid gap-10 lg:grid-cols-12">`. Marca `lg:col-span-4`:
  `<div className="flex items-center gap-3"><Image src="/brand/moorah-mark.png" alt="" width={35}
  height={48} /><Image src="/brand/moorah-wordmark.png" alt={site.name} width={120} height={19} /></div>`
  e `<p className="mt-4 max-w-xs text-sm text-gray-600">{site.description}</p>`. Navegação `lg:col-span-3`:
  `<nav aria-label={ui.footer.navLabel}><ul className="space-y-2">` com links `text-sm text-gray-700
  hover:text-gray-900` para `#${id}`. Legal `lg:col-span-2`: links `/termos` e `/privacidade`
  (`ui.footer.terms`, `ui.footer.privacy`). Contato `lg:col-span-3`: `mailto`, WhatsApp (condicional),
  Instagram e LinkedIn (condicionais, `target="_blank" rel="noopener noreferrer"`). Linha inferior
  `mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 text-[13px] text-gray-600 lg:flex-row
  lg:items-center lg:justify-between`: `<ul className="flex flex-wrap gap-x-4 gap-y-1">` com as três
  `legalNotes`; `<p>` com `© {ano} {site.legalName}` e, se houver, ` · CNPJ {site.contact.cnpj}`.
  O ano vem de `new Date().getFullYear()` apenas no servidor (o footer é server component; sem
  mismatch).
- **Layout mobile**: colunas empilhadas na ordem marca, navegação, legal, contato.
- **Motion**: `Reveal variant="fade"` de 500 ms no bloco todo; underline dos links por CSS (`hover:underline
  underline-offset-4`).
- **Acessibilidade**: `<footer>` (contentinfo), `<nav aria-label>`, wordmark com `alt={site.name}`, mark
  com `alt=""` (decorativo ao lado do wordmark), links externos com `rel`.
- **Testes unitários** (`footer.test.tsx`): (1) links para `/termos` e `/privacidade`; (2) as três
  `legalNotes` presentes; (3) sem CNPJ não aparece "CNPJ"; (4) `site.legalName` presente.
- **Testes e2e** (`tests/e2e/footer.spec.ts`): (1) `footer` visível ao final; (2) no projeto mobile,
  com o footer em vista, `data-testid="cta-mobile"` não está visível.

---

## 6. Composição da página (`src/app/page.tsx`)

```tsx
import dynamic from "next/dynamic";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { PorQue } from "@/components/sections/por-que";
import { ComoFunciona } from "@/components/sections/como-funciona";
import { Especialidades } from "@/components/sections/especialidades";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Footer } from "@/components/sections/footer";
import { MobileCtaBar } from "@/components/sections/mobile-cta-bar";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

const Cartao = dynamic(() => import("@/components/sections/cartao").then((m) => m.Cartao), {
  loading: () => <SectionSkeleton minHeight="min-h-[640px]" />,
});
const Beneficios = dynamic(() => import("@/components/sections/beneficios").then((m) => m.Beneficios), {
  loading: () => <SectionSkeleton minHeight="min-h-[900px]" />,
});
const Planos = dynamic(() => import("@/components/sections/planos").then((m) => m.Planos), {
  loading: () => <SectionSkeleton minHeight="min-h-[960px]" />,
});
const Duvidas = dynamic(() => import("@/components/sections/duvidas").then((m) => m.Duvidas), {
  loading: () => <SectionSkeleton minHeight="min-h-[720px]" />,
});
const Contato = dynamic(() => import("@/components/sections/contato").then((m) => m.Contato), {
  loading: () => <SectionSkeleton minHeight="min-h-[640px]" />,
});

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        <Hero />
        <PorQue />
        <ComoFunciona />
        <Especialidades />
        <Cartao />
        <Beneficios />
        <Planos />
        <Diferenciais />
        <Duvidas />
        <Contato />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
```

- Sem `ssr: false` (não é permitido em Server Components; e o HTML precisa vir do servidor para os
  testes e2e e para SEO). O `loading` só aparece enquanto o chunk cliente da seção carrega.
- Ordem de âncoras e ids: `inicio`, `por-que`, `como-funciona`, `especialidades`, `cartao`, `beneficios`,
  `planos`, `diferenciais`, `duvidas`, `contato`. `Section` aplica `scroll-mt-20` para compensar o header.
- Header: transparente no topo, `bg-white/85` com blur após 24 px, `aria-current` no link da seção
  visível (só os cinco ids de `nav`). Rolagem suave já vem de `html { scroll-behavior: smooth }`.
- Barra fixa mobile: renderizada depois do footer, `md:hidden`, aparece quando o hero sai e some em
  `#planos`, `#contato` e no footer.
- `layout.tsx` não muda (fontes, metadata, MotionProvider já estão lá). Se um agente precisar de
  keyframes novos, eles vão para `globals.css` na Fase 0 (4.12), nunca inline em `<style>`.

---

## 7. Fluxo de lead

Já implementado e testado: `src/lib/leads.ts` (schema zod, máscaras LGPD, rate limiter em memória,
assinatura HMAC, `forwardLead`) e `src/app/api/leads/route.ts` (POST, 5 requisições por IP a cada 10
minutos, `Content-Type` obrigatório, corpo até 8 kB, honeypot `website`, encaminhamento para
`LEAD_WEBHOOK_URL` com `X-Moorah-Signature` = HMAC SHA-256 do corpo com `LEAD_WEBHOOK_SECRET`, log
mascarado quando não há webhook, resposta `{ ok: true }` sem ecoar dados pessoais). Não reescrever;
o front se adapta a eles.

Contrato do corpo (todas as chaves fora desta lista fazem o `.strict()` rejeitar):

| Campo | Regra | Origem no formulário |
| --- | --- | --- |
| `name` | string 2 a 80 | input Nome |
| `email` | e-mail válido, até 120 | input E-mail |
| `whatsapp` | opcional; vazio ou 10 a 13 dígitos após remover não dígitos | input WhatsApp (opcional) |
| `plan` | `"individual"` ou `"familiar"` | select Plano de interesse |
| `message` | opcional, até 500 | não usado na v1 (não enviar) |
| `consent` | literal `true` | checkbox de consentimento |
| `website` | honeypot; se preenchido a rota finge sucesso | input oculto |

Respostas: `200 {ok:true}`; `400 {ok:false, error:"invalid", fields:[...]}` (só nomes de campos);
`413`, `415`, `429 {error:"rate_limited"}`, `502 {error:"upstream"}`.

Quem abre o `Dialog` com `LeadForm` e plano pré-selecionado: apenas os CTAs dos dois cards de plano
(`LeadDialogButton plan="individual" | "familiar"`). Todos os outros CTAs são âncoras: "Escolher meu
plano" (hero e CTA final) e "Ver planos" / "Planos" (header e barra mobile) levam a `#planos`; "Como
funciona" leva a `#como-funciona`. A seção `contato` traz o `LeadForm` inline (padrão `familiar`).

WhatsApp: botão secundário só quando `site.contact.whatsapp` não é vazio, com
`whatsappUrl(site.contact.whatsapp, ui.leadForm.whatsappMessage)`, `target="_blank"` e
`rel="noopener noreferrer"`. Aparece na barra mobile, no card de contato do FAQ e no CTA final.

LGPD no cliente: nenhum `console.*` com dados do formulário; nenhum armazenamento em
`localStorage`/`sessionStorage`; o checkbox de consentimento linka para `/privacidade`. A rota já
mascara e-mail e telefone nos logs do servidor.

---

## 8. Páginas auxiliares

| Arquivo | Conteúdo |
| --- | --- |
| `src/app/termos/page.tsx` | server; `metadata.title = ui.pages.termsTitle`; `<Header />`, `<main id="conteudo" className="container-x pt-32 pb-24 max-w-3xl">` com `<p className="eyebrow">{site.product}</p>`, `<h1>` H2-size, card `rounded-2xl border border-gray-200 bg-gray-50 p-6` com `Badge tone="neutral"` `ui.pages.inProgressBadge` e `<p>{ui.pages.inProgress}</p>`, link `ui.pages.backHome` para `/`; `<Footer />` |
| `src/app/privacidade/page.tsx` | idem com `ui.pages.privacyTitle`; acrescenta `<p className="mt-4 text-sm text-gray-600">{ui.pages.privacyContact}</p>` com `mailto` para `site.contact.email` |
| `src/app/not-found.tsx` | server; `<Header />`, `<main className="container-x flex min-h-[70svh] flex-col items-center justify-center text-center">` com `<Image src="/brand/moorah-mark.png" alt="" width={70} height={96} />`, `<p className="eyebrow mt-8">404</p>`, `<h1>{ui.pages.notFoundTitle}</h1>`, `<p className="mt-4 text-gray-600">{ui.pages.notFoundText}</p>`, Button primary asChild `<Link href="/">{ui.pages.backHome}</Link>`; `<Footer />` |
| `src/app/loading.tsx` | server; `<div aria-busy="true" aria-label="Carregando" className="container-x pt-32">` com skeleton do hero (`grid gap-12 lg:grid-cols-12`: coluna de texto com `skeleton h-4 w-40`, `skeleton mt-6 h-14 w-full max-w-xl`, `skeleton mt-3 h-14 w-4/5`, `skeleton mt-8 h-6 w-full max-w-md`, dois `skeleton h-12 w-40 rounded-full`; coluna do palco `skeleton aspect-square w-full max-w-[560px] rounded-full`) seguido de `<SectionSkeleton />` três vezes |

Nenhuma dessas páginas tem `<h2>` antes do `<h1>`; a única `<h1>` de cada uma é o título.

---

## 9. Assets e SVGs

### 9.1 Arquivos de `public/brand`

| Arquivo | Dimensões | Uso | `next/image` |
| --- | --- | --- | --- |
| `moorah-wordmark.png` | 518x82 | header (130x21 desktop, 104x16 mobile, `priority`), footer (120x19), páginas auxiliares | `width={130} height={21}`; classe `h-4 w-auto lg:h-[21px]` |
| `moorah-mark.png` | 194x265 | footer (35x48), 404 (70x96) | `width={35} height={48}` |
| `moorah-mark-white.png` | 194x265 | reservado (não usar na v1; o símbolo em plum sobre superfícies claras basta) | - |
| `moorah-wordmark-white.png` | 518x82 | reservado (o header nunca fica sobre plum) | - |
| `moorah-lockup-white.png` | 534x404 | reservado (possível uso futuro em OG ou materiais) | - |
| `cartao-moorah.webp` | 1400x933 | seção Cartão; único uso da imagem | `width={1400} height={933} sizes="(min-width: 1024px) 560px, 92vw"`, lazy |

Regras do manual: logo nunca recolorido (só plum `#4B244D` ou branco), nunca distorcido (sempre
`h-auto` ou `w-auto`), nunca sobre foto ou ruído. Não use os PNGs dentro de SVG.

### 9.2 TrailCluster (geometria da Trilha da Amora)

`viewBox="0 0 560 560"`. Trilhas com `stroke-width="2"`, `stroke-linecap="round"`,
`stroke-linejoin="round"`, `fill="none"`, `vector-effect="non-scaling-stroke"`. Nós com `stroke="var(--color-ink)"
stroke-width="2"`. Pads (dobras) r=4 `fill="var(--color-ink)"`.

| Elemento | Posição | Raio | Fill padrão | Trilha até o pai |
| --- | --- | --- | --- | --- |
| Hub (assinatura) | (280, 280) | 34 | gradiente radial berry-500 para berry-700 (`<radialGradient id>` com id único via `useId`) | - |
| N0 Clínico geral | (280, 160) | 22 | berry-100 | `M 280 246 V 182` |
| N1 Pediatria | (400, 220) | 22 | berry-100 | `M 314 280 H 340 L 384 236` com pad em (340, 280) |
| N2 Cardiologia | (380, 380) | 22 | berry-100 | `M 304 304 L 364 364` |
| N3 Dermatologia | (180, 380) | 22 | berry-100 | `M 256 304 L 196 364` |
| N4 Ginecologia | (160, 220) | 22 | berry-100 | `M 246 280 H 220 L 176 236` com pad em (220, 280) |
| N5 Ortopedia | (280, 60) | 18 | berry-100 | `M 280 138 V 78` (pai N0) |
| N6 Endocrinologia | (450, 110) | 18 | berry-100 | `M 302 160 H 400 L 437 123` com pad em (400, 160) (pai N0) |
| N7 Otorrinolaringologia | (500, 300) | 18 | berry-100 | `M 422 220 H 440 L 500 280 V 282` simplificado para `M 422 220 H 440 L 488 268` com pad em (440, 220) (pai N1) |
| N8 Oftalmologia | (430, 470) | 18 | berry-100 | `M 380 402 V 420 L 417 457` com pad em (380, 420) (pai N2) |
| N9 Geriatria | (230, 510) | 18 | berry-100 | `M 180 402 V 460 L 217 497` com pad em (180, 460) (pai N3) |
| N10 Nutrição | (70, 400) | 18 | berry-100 | `M 158 380 H 90 L 83 387` com pad em (90, 380) (pai N3) |
| N11 Psicologia | (80, 180) | 18 | berry-100 | `M 138 220 H 120 L 93 193` com pad em (120, 220) (pai N4) |

Estados por nó (`data-state`): `idle` (fill berry-100), `active` (fill berry-500, trilha ligada com
`stroke-width` 3 e `stroke var(--color-berry-500)`), `confirmed` (fill leaf-500 e um halo `m.circle`
que cresce uma vez). A ordem do índice segue `specialties` para o espelho em Especialidades. Trilhas
`stroke var(--color-berry-300)` no `full` e `mini`; no `outline` tudo é só stroke (`fill none`) em
`var(--color-berry-300)`, sem gradiente. Variante `mini`: mesma geometria, sem halo e sem cards.

Cascata `intro` (hero): hub scale 0.6 para 1 em 600 ms a partir de 200 ms; trilhas do hub aos nós
internos (`pathLength`) a partir de 500 ms, 700 ms cada, stagger 60 ms; nós internos scale 0.7 para 1
em 450 ms a partir de 700 ms, stagger 60 ms; trilhas externas a partir de 1000 ms, 600 ms cada,
stagger 50 ms; nós externos a partir de 1200 ms, 450 ms, stagger 50 ms; `confirmed` no índice recebido
via prop em 1900 ms (halo r 22 para 40, opacity 0.6 para 0, 600 ms). `draw`: só `pathLength` 0 para 1
em 1200 ms (stagger 50 ms) ao entrar em vista, nós já visíveis. `static`: tudo no estado final.

### 9.3 Outros SVGs

- **ConvergenceTrail** (5.4): paths e posições descritos na seção.
- **ExamsNetwork** (5.8): posições descritas na seção.
- **Ilustrações de passos** (5.5) e **mocks** (5.8) são HTML/CSS, não SVG.
- Nenhum SVG usa `filter: blur`, `offset-path`, `<image>` ou texto que dependa de fonte externa
  (textos do ConvergenceTrail usam `font-mono` já carregada).

---

## 10. Checklist de qualidade por agente

Antes de declarar a seção pronta:

1. `npm run typecheck` sem erros (no PowerShell do Filipe: `npm.cmd run typecheck`).
2. `npx biome check --write <arquivos que você criou ou alterou>` sem erros (organizeImports está
   ligado; aspas duplas; ponto e vírgula; linha de 100).
3. `npx vitest run <seu arquivo>.test.tsx` verde. Não altere `tests/setup.ts` nem
   `vitest.config.mts`.
4. Nenhum travessão (U+2014) em nenhum arquivo seu: `grep -n $'\xe2\x80\x94' <arquivos>` deve voltar vazio.
5. Nenhum texto de marketing fixo em componente: só dados de `site.ts` e microcopy de interface
   (aria-labels, "Fechar", "Carregando", "Pular para o conteúdo").
6. Só `m.*` de `motion/react`; nunca `motion.*`, `layout`, `layoutId`, `drag`, `mode="popLayout"`.
7. Toda `<Image>` tem `alt` (vazio só se decorativa ao lado de texto equivalente), `width`, `height` e
   `sizes` quando responsiva; `priority` só no wordmark do header.
8. Reduced motion respeitado: se o componente tem intervalo, parallax, tilt, contador ou `pathLength`,
   ele lê `useReducedMotion()` e renderiza o estado final.
9. Ícones lucide decorativos com `aria-hidden` (o componente `Icon` já faz isso; ícones importados
   direto de `lucide-react` precisam de `aria-hidden` manual).
10. Contraste: siga a tabela 3.2 (`gray-500`, `leaf-500` e `critical-500` nunca como texto pequeno).
11. Classes Tailwind sempre como strings estáticas completas (nada de `bg-${cor}-500`); o scanner do
    v4 não vê classes montadas em tempo de execução.
12. Nenhum `Math.random()`, `Date.now()` ou acesso a `window` durante o render (hydration mismatch e
    erro de console). Efeitos colaterais só em `useEffect`.
13. Sem loops infinitos além de `animate-spin` no envio e `skeleton` durante carregamento real.
14. Alvos de toque de 44 px em tudo que é interativo no mobile; foco visível (o global já cuida);
    ordem de tabulação natural (sem `tabIndex` positivo).
15. Antes de terminar, rode também `npx vitest run` completo para garantir que não quebrou o teste de
    outro agente.

### 10.1 Como testar componentes com `useInView` ou `whileInView`

O mock de `IntersectionObserver` em `tests/setup.ts` nunca dispara. Para testar o estado "em vista":

```ts
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useInView: () => true, useReducedMotion: () => true };
});
```

Com `useReducedMotion: () => true` os componentes renderizam o estado final sem timers. Para testar
timers (dígitos, skeleton do portal), deixe `useReducedMotion: () => false` e use
`vi.useFakeTimers()` + `act(() => vi.advanceTimersByTime(ms))`.

### 10.2 Render helper

`src/test/render.tsx` exporta `renderWithMotion(ui)` (envolve em `MotionProvider`). Use-o em todo
teste de componente cliente. Componentes server puros podem usar `render` direto.

### 10.3 O que NÃO fazer

- Não editar `site.ts`, `globals.css`, `layout.tsx`, `tests/setup.ts`, `landing.spec.ts` ou arquivos de
  outra seção. Se algo faltar, escreva no relatório final o que faltou e onde.
- Não instalar dependências novas.
- Não criar `README`, notas ou resumos em `.md`.
- Não usar `three.js`, canvas, WebGL, GSAP, partículas, `offset-path`, `filter: blur` animado.
- Não colocar foto de banco de imagens em lugar nenhum.

---

## 11. Conteúdo a adicionar em `src/content/site.ts` (Fase 0)

Adicionar ao final do arquivo, todos `as const`, sem travessão. Chaves com `{price}` são
substituídas pelo componente com `formatBRL(...)`.

### 11.1 `hero`

```ts
export const hero = {
  eyebrow: "Telemedicina por assinatura",
  title: "Consultas médicas ilimitadas, sem fila, para você e sua família.",
  lead: "Médico por vídeo em qualquer especialidade, receitas e atestados digitais e o Cartão Moorah com descontos em farmácias, exames e lojas parceiras.",
  priceLine: "A partir de {price} por mês, sem taxa de adesão.",
  primaryCta: "Escolher meu plano",
  secondaryCta: "Como funciona",
  trust: "Médicos habilitados e telemedicina regulamentada no Brasil. Dados criptografados e protegidos pela LGPD. A Moorah não é plano de saúde.",
  proofChips: ["Qualquer especialidade", "Receitas com validade nacional", "Cartão Moorah incluso"],
  clusterAlt: "Ilustração de circuito: doze nós, um para cada especialidade, ligados por trilhas a um centro que representa a assinatura Moorah.",
  moments: [
    { icon: "calendar-check", label: "Consulta confirmada", text: "Pediatria por vídeo", tone: "leaf" },
    { icon: "file-check", label: "Receita digital emitida", text: "Válida em todo o Brasil", tone: "leaf" },
    { icon: "bell-ring", label: "Lembrete enviado", text: "Sua consulta começa em 30 minutos", tone: "berry" },
  ],
} as const;
```

### 11.2 `problemsSection` e `manifesto`

```ts
export const problemsSection = {
  eyebrow: "Por que a Moorah existe",
  title: "Cuidar da saúde não devia ser tão difícil.",
} as const;

export const manifesto = {
  eyebrow: "Tudo em um lugar",
  title: "Chega de mil soluções separadas.",
  text: "Consulta, receita, exame, farmácia e histórico da família em uma única assinatura, com um só cartão e um só portal.",
  nodes: ["Consulta por vídeo", "Receitas e atestados", "Exames", "Farmácias", "Portal do paciente"],
  hub: "Sua assinatura Moorah",
  svgAlt: "Cinco trilhas, consulta, receitas, exames, farmácias e portal, convergindo para um único nó: sua assinatura Moorah.",
} as const;
```

### 11.3 `howItWorks`

```ts
export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Agendou, foi lembrado, consultou.",
  lead: "Quatro passos, do agendamento ao documento digital, tudo dentro da plataforma da Moorah.",
} as const;
```

### 11.4 `specialtiesSection`

```ts
export const specialtiesSection = {
  eyebrow: "Especialidades",
  title: "Toda especialidade, um só lugar.",
} as const;
```

(O lead da seção reutiliza `faq[2].a`.)

### 11.5 `cardSection`

```ts
export const cardSection = {
  eyebrow: "Cartão Moorah",
  title: "Um número. Todos os benefícios.",
  uses: ["Telemedicina", "Farmácias", "Exames", "Lojas parceiras"],
  holderLabel: "Escolha o cartão",
  numberLabel: "Nº do cartão",
  sampleAria: "Exemplo de numeração, sem validade",
  imageAlt: "Cartão Moorah em tom ameixa escuro, com a amora em relevo e linhas onduladas.",
} as const;
```

### 11.6 `benefitsSection`

```ts
export const benefitsSection = {
  eyebrow: "Vantagens no dia a dia",
  title: "Uma rede que acompanha a sua família.",
  lead: "Exames, farmácias, lojas parceiras e o portal do paciente, tudo ligado ao seu Cartão Moorah.",
} as const;
```

### 11.7 `mocks` (rótulos de ilustração; nunca dados reais)

```ts
export const mocks = {
  cardHolders: [
    { value: "0", label: "Titular" },
    { value: "1", label: "Dependente 1" },
    { value: "2", label: "Dependente 2" },
    { value: "3", label: "Dependente 3" },
  ],
  // Numeros ilustrativos de 12 digitos, fora de qualquer faixa de cartao bancario. Confirmar formato real.
  cardSamples: ["100020003000", "100020003001", "100020003002", "100020003003"],
  reminderChips: ["Véspera", "Hoje", "30 min antes"],
  reminderChip: "Lembrete: sua consulta começa em 30 minutos",
  slotConfirmed: "Horário confirmado",
  connected: "Conectado",
  signed: "Assinado digitalmente",
  cardNumberField: "Número do cartão",
  cardRecognized: "Cartão reconhecido",
  discountApplied: "Desconto aplicado na rede",
  portalTabsLabel: "Áreas do portal",
  portalTabs: ["Histórico", "Documentos", "Dependentes"],
  statusDone: "Realizada",
  statusScheduled: "Agendada",
  documents: ["Receita digital", "Atestado", "Pedido de exame"],
  securityChips: ["Criptografia", "Infraestrutura no Brasil", "LGPD"],
} as const;
```

### 11.8 `plansSection`

```ts
export const plansSection = {
  eyebrow: "Planos",
  title: "Um plano para você ou para toda a família.",
  lead: "Assinatura mensal, sem taxa de adesão. Escolha quantas pessoas vão usar e veja o valor por pessoa.",
  peopleQuestion: "Para quantas pessoas?",
  perPersonLabel: "equivale a {price} por pessoa",
  coversOne: "Cobre 1 pessoa.",
  singleHint: "Faz mais sentido a partir de 2 pessoas.",
  familyNote: "O Familiar cobre até 4 pessoas pelo mesmo valor.",
  faqLink: "Entenda a diferença",
  includedTitle: "Incluído na assinatura",
  notIncludedTitle: "Não está incluído",
  included: [
    "Consultas por vídeo ilimitadas, em qualquer especialidade",
    "Receitas, atestados e pedidos de exame digitais",
    "Cartão Moorah para cada pessoa",
    "Descontos em farmácias, exames e lojas parceiras",
    "Portal do paciente com histórico e dependentes",
  ],
  notIncluded: [
    "Internação e cirurgia",
    "Atendimento presencial",
    "Pronto-socorro e emergências",
    "Cobertura de plano de saúde (ANS)",
    "Custo de exames e medicamentos, que têm desconto na rede e são pagos pelo assinante",
  ],
  emergency: "Em emergências, ligue 192 (SAMU). A telemedicina não substitui o pronto-socorro.",
} as const;
```

### 11.9 `differentiatorsSection`

```ts
export const differentiatorsSection = {
  eyebrow: "Diferenciais",
  title: "Por que a Moorah.",
} as const;
```

### 11.10 `ui` (microcopy de interface)

```ts
export const ui = {
  header: { cta: "Ver planos", ctaShort: "Planos", login: "Entrar", menuOpen: "Abrir menu", menuClose: "Fechar menu", menuTitle: "Menu", skip: "Pular para o conteúdo" },
  mobileBar: { cta: "Ver planos", label: "Atalho para planos" },
  footer: { navLabel: "Rodapé", terms: "Termos de uso", privacy: "Política de privacidade" },
  leadForm: {
    title: "Quero saber mais",
    subtitle: "Deixe seu contato e retornamos por e-mail.",
    name: "Nome",
    email: "E-mail",
    whatsapp: "WhatsApp (opcional)",
    whatsappPlaceholder: "(11) 99999-1234",
    plan: "Plano de interesse",
    consent: "Li e aceito a Política de privacidade e autorizo o contato da Moorah.",
    submit: "Quero assinar",
    sending: "Enviando...",
    successTitle: "Recebemos seu pedido.",
    successText: "Vamos entrar em contato pelo e-mail informado.",
    errorGeneric: "Não foi possível enviar agora. Tente novamente em instantes.",
    errorRateLimited: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
    whatsappCta: "Falar no WhatsApp",
    whatsappMessage: "Olá, quero saber mais sobre os planos da Moorah.",
  },
  pages: {
    termsTitle: "Termos de uso",
    privacyTitle: "Política de privacidade",
    inProgressBadge: "Em elaboração",
    inProgress: "Este documento está em elaboração e será publicado antes do lançamento comercial.",
    privacyContact: "Dúvidas sobre dados pessoais podem ser enviadas para o e-mail comercial.",
    backHome: "Voltar ao início",
    notFoundTitle: "Página não encontrada",
    notFoundText: "O endereço pode ter mudado ou não existe.",
  },
} as const;
```

### 11.11 `faqSection`

```ts
export const faqSection = {
  eyebrow: "Dúvidas frequentes",
  title: "Perguntas que recebemos com frequência.",
  contactTitle: "Ainda com dúvida?",
  contactText: "Escreva para a gente e respondemos pelo e-mail.",
  emergencyTitle: "Emergência",
  emergencyLabel: "SAMU",
  emergencyText: "A telemedicina não substitui o pronto-socorro.",
} as const;
```

### 11.12 `finalCta`

```ts
export const finalCta = {
  eyebrow: "Comece hoje",
  title: "Saúde acessível para quem importa.",
  text: "Escolha o plano e agende a primeira consulta por vídeo pela plataforma da Moorah. Sem fila e sem taxa de adesão.",
  primaryCta: "Escolher meu plano",
} as const;
```

Também na Fase 0: incluir `hero`, `manifesto`, `plansSection`, `mocks`, `ui`, `faqSection` e `finalCta`
no teste de travessão de `src/content/site.test.ts` (`walkStrings`).

---

## 12. Ordem de trabalho e perguntas abertas

### 12.1 Fases

1. **Fase 0 (um agente, antes de tudo)**: primitivos de `src/components/ui/*`, alterações de 4.12
   (`globals.css`, `utils.ts`, `site.ts`, `src/test/render.tsx`), testes unitários dos primitivos
   (`button.test.tsx`, `badge.test.tsx`, `segmented-control.test.tsx`, `accordion.test.tsx`,
   `dialog.test.tsx`, `lead-form.test.tsx`, `lead-dialog.test.tsx`, `trail-cluster.test.tsx`,
   `reveal.test.tsx`).
2. **Fase 1 (paralela, um agente por seção)**: 5.1 a 5.13, cada um com seus testes unitários e e2e em
   arquivo próprio (`tests/e2e/<secao>.spec.ts`).
3. **Fase 2 (um agente)**: `page.tsx`, `loading.tsx`, `not-found.tsx`, `/termos`, `/privacidade`,
   `npm run build`, `npm run test:e2e`, Lighthouse mobile (meta: LCP < 2,5 s, CLS < 0,05, JS inicial
   da rota abaixo de 130 kB gzip lido na saída do build), atualização de `docs/conteudo-a-confirmar.md`
   com os itens de 12.2.

### 12.2 Perguntas abertas (registrar em `docs/conteudo-a-confirmar.md`)

- Formato real da numeração do Cartão Moorah (prefixo, dígito verificador). Os exemplos
  `1000 2000 3000` a `3003` são ilustrativos.
- Aprovação de marca do motivo Trilha da Amora (hub + 12 nós em trilhas de 45 graus, sem cálice e
  sem contorno de fruta).
- "Sem carência" e "cancela quando quiser" permanecem só no FAQ (`faq[4]`), pendentes de confirmação.
- Disponibilidade 24h não é afirmada em nenhum lugar; confirmar antes de adicionar.
- Revisão jurídica do painel "Incluído / Não está incluído" e das frases "não é plano de saúde".
- Mostrar ou não os valores por pessoa intermediários (2 e 3 pessoas). A lógica fica em
  `plan-selector.tsx`; esconder é remover as opções 2 e 3 do seletor.
- As telas do portal e os mocks são ilustrativos; alinhar com o produto real antes do lançamento.
- Destino dos leads (`LEAD_WEBHOOK_URL`) e WhatsApp comercial (depende do CNPJ).
