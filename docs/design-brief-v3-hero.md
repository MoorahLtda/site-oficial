# Design brief v3 - redesenho do hero (03/09/2026)

Complementa `docs/design-brief.md` e `docs/design-brief-v2.md`. Onde conflitar, este prevalece.
Vale só para o hero (`src/components/sections/hero*.tsx`, `trail-cluster.tsx`, testes e
`tests/e2e/hero.spec.ts`). O resto da página não muda nesta rodada.

## 1. O que o cliente disse, na ordem em que disse

Depois de ver a v2 (foto do paciente com três cards flutuantes por cima e a Trilha da Amora
sobreposta ao canto da foto):

> "tire essas caixas por cima da imagem e o hero tbm. ficou muito ruim. pense em outra coisa ou
> posição, mas você está usando heros repetitivos"

Antes, sobre a v1 (Trilha da Amora sozinha, sem foto):

> "os existentes eu gostei bastante mas não tem dinamismo ainda"

Referências que ele mandou para melhorar a interface: **curated.design** (galeria de sites de alto
acabamento) e **getlayers.ai** (fundo quase preto, título grande em peso leve com tracking
negativo, muito respiro, sensação cinematográfica). Leitura: ele quer sofisticação e movimento,
não "hero de SaaS" com imagem à direita e cartõezinhos.

Ele também pediu, e vale para o hero: nenhum traço horizontal curto em lugar nenhum (lê como
travessão), e respeito à tipografia da marca.

## 2. O que o manual da marca diz e que muda o jogo

- **Fundo escuro é a aplicação PRINCIPAL da marca** (página 3: "Fundo escuro · Principal";
  "Fundo claro · Alternativa"). Um hero em plum não é desvio: é a casa da marca.
- Símbolo só em plum `#4B244D` ou branco; nunca sobre foto ou textura; nunca redesenhado.
- Tipografia: Plus Jakarta Sans para títulos, "tracking levemente fechado"; o specimen do manual
  usa peso 700, não 800. Corpo em Manrope. Rótulos de sistema em JetBrains Mono, caixa alta,
  tracking amplo, separados por "·" (o utilitário `eyebrow` já faz isso).
- Tom: acolhedor, preciso, institucional, sereno. Nada gira, nada pisca.
- Proporção 70/20/8 vale para a página inteira, não para cada seção: um hero plum cabe se o
  resto da página continua claro (e continua).

## 3. Restrições duras (o construtor e o revisor checam uma a uma)

1. Nenhuma caixa, card, chip ou texto sobreposto a foto. Foto e texto podem coexistir na tela, mas
   em regiões separadas; se a foto for fundo, o texto fica sobre uma área de cor lisa (gradiente
   plum sólido o bastante), nunca sobre o rosto ou sobre detalhe da imagem.
2. Nada que lembre "copy à esquerda + imagem com cards flutuantes à direita". Se houver divisão
   em colunas, a coluna visual não pode ser "uma foto com coisas em cima".
3. Um único `h1`, renderizado no servidor, com a frase completa acessível (sr-only se houver
   rotação de palavras). O `h1` continua sendo o LCP ou pinta antes da foto.
4. CTAs: primário para `#planos` (`hero.primaryCta`), secundário para `#como-funciona`
   (`hero.secondaryCta`). Linha de preço a partir de `plans[0]` com `formatBRL`. Trust line
   (`hero.trust`) visível, com "não é plano de saúde".
5. Copy só de `site.ts` (`hero`, `heroDynamic`). Se precisar de texto novo, registre como
   pendência: o construtor não edita `site.ts`.
6. Sem travessão e sem traço decorativo. Separadores, se houver, são "·".
7. Reduced motion respeitado; nenhum loop em texto além da frase rotativa já existente (que pode
   ser mantida ou removida). Intervalos pausam com `document.hidden`.
8. Sem rolagem horizontal em 360 px. `overflow-x-clip` na seção se algo sangrar de propósito.
9. Nenhuma dependência nova. Sem WebGL, canvas pesado ou vídeo.
10. Os contratos de `tests/e2e/landing.spec.ts` continuam valendo (h1 visível, ids, links).
11. O símbolo da marca pode aparecer no hero (o cliente pediu marca presente), mas nunca sobre
    foto. O disco branco com o símbolo no hub da Trilha continua permitido.

## 4. Assets disponíveis

- `photos` em `site.ts`: heroPaciente (paisagem 3:2), medicaSorrindo (retrato), medicoVideo
  (16:9), medicaHeadset, idosoTablet, familiaSofa (16:9), familiaCasa, exame (retrato),
  pacienteCama (retrato). Todas via `next/image`, `priority` só na que for LCP.
- `TrailCluster` (`src/components/ui/trail-cluster.tsx`): variantes full/mini/outline, animate
  intro/draw/static, `comets`, `active`, `confirmed`. Pode ganhar props novas.
- `RotatingWord` (`hero-rotating.tsx`) e `HeroMarquee` (`hero-marquee.tsx`): podem ficar, mudar
  ou sair.
- Símbolo e wordmark em plum e branco (`public/brand`), `BrandLockup` em `src/components/ui`.
- Cartão (`cartao-moorah.webp`), já usado na seção Cartão; não repetir no hero.

## 5. Sementes (não são a resposta; são pontos de partida para divergir)

- **Rede de pessoas**: a Trilha da Amora em grande escala sobre plum, com fotos recortadas em
  círculo DENTRO dos nós (paciente, médica, família, idoso): o circuito vira uma rede de gente
  ligada ao hub Moorah. Sem caixa sobre foto porque a foto é o nó. Dinâmica: nós acendem em
  sequência, cometas correm, fotos dos nós se alternam com crossfade.
- **Editorial cinematográfico**: foto em sangria total com gradiente plum sólido cobrindo a metade
  do texto, título em Plus Jakarta 600 grande, faixa de especialidades embaixo. Ken Burns lento na
  foto. Parece capa de revista, não SaaS.
- **Tipográfico com faixa de fotos**: título centralizado, enorme e leve; abaixo, uma faixa
  horizontal de fotos com cantos arredondados rolando devagar (Marquee), sem nada por cima; a
  Trilha da Amora pequena como assinatura ao lado do CTA.
- **Palco de luz**: plum profundo, halo em deriva, o símbolo grande em branco como peça central e
  as fotos como uma coluna estreita de "frames" à direita que sobem devagar (parallax), separadas
  do texto por respiro, não por sobreposição.

## 6. O que cada conceito precisa entregar

Layout desktop e mobile com classes Tailwind sugeridas; camadas e o que é servidor e o que é
cliente; coreografia de entrada com tempos; movimento contínuo (o que se move, com que ritmo, e
como para); como a foto entra, ou por que não entra; o que acontece com os eventos do produto
(`heroDynamic.events`) e com a faixa de especialidades; tipografia (família, peso, tamanho por
breakpoint, tracking); superfície e cores; performance (LCP, peso); acessibilidade; riscos; e duas
frases: "por que não é repetitivo" e "o que o Filipe sente nos primeiros 3 segundos".

## 7. Especificação final

Preenchida pela síntese do painel, abaixo desta linha.

### 7.0 Decisão

**Vence o conceito 1, "Constelação de cuidado" (Rede de pessoas sobre plum)**, primeiro nas três
lentes (30 + 28 + 29). Concordo com o júri: é o único que responde às duas frases do cliente sem
disfarce. Não existe retângulo de foto (logo não há onde pôr caixa), a arquitetura "copy + imagem
com cartões" desaparece, e o elemento que ele elogiou na v1 (a Trilha da Amora) deixa de ser enfeite
e vira o palco, com gente dentro e em ritmo, sobre o fundo escuro que o manual chama de principal.
O conceito 2 é a mesma estrutura rejeitada com acabamento melhor; o conceito 3 abre em branco
quando a referência é escura e apoia o "caro" num marquee de fotos de banco.

Correções aplicadas ao vencedor (fraquezas apontadas):

1. **Ticker cortado.** Era um segundo loop de texto (restrição 7). Os eventos do produto viram só
   cadência: nó acende, disco troca, ou o anel do hub pulsa. Nenhum texto além da frase rotativa.
2. **Hierarquia hub > disco.** Disco branco do hub sobe para 104 px em lg; discos de foto ficam em
   raio 52/56/52 (viewBox), o que dá 115/124/115 px numa rede de 620 px: entre 1,1x e 1,2x o hub.
3. **Trilhas visíveis.** Em tom plum as trilhas usam berry-500 (não berry-700), nós abstratos em
   berry-800 com contorno berry-400, cometas berry-300.
4. **Pads e trilhas não somem sob os discos.** Os três nós com foto foram escolhidos para que o pad
   da trilha continue visível: N5 (sem pad, trilha reta), N7 (pad a 100 do centro) e N8 (pad a 70,7).
   Cada disco é filho topológico do nó que o evento acende (N0 > N5, N1 > N7, N2 > N8), então a
   causalidade "trilha acende, pessoa responde" é literal na geometria.
5. **Header sobre plum resolvido por medida.** O bloco começa 16 px abaixo do header real (64 / 96 /
   104 px); o header só ganha fundo com scrollY > 24, e nessa faixa sua borda entra no máximo 8 px no
   bloco, abaixo da linha dos links.
6. **Tipografia medida para a coluna.** Tamanhos do h1 escolhidos para "Consultas médicas" caber em
   uma linha na coluna de 6/12 em cada breakpoint (cálculo em 7.9).
7. **Menos ritmos simultâneos.** Halo estático (sem drift), marquee a 64 s, nenhum provider de
   contexto (um só consumidor do compasso, então um só `setInterval` dentro de `HeroNetwork`).

Enxertos dos outros conceitos:

- Do 3: cadência irregular (eventos com `node: null` não acendem nada; só o anel do hub pulsa uma
  vez), `useInView` sem `once` pausando o compasso e os cometas fora da tela, proofChips como `<ul>`
  mono com separador "·" via CSS `content`.
- Do 2: teste e2e de não sobreposição (nenhum texto dentro de disco de foto; nenhum preload de foto
  do hero), marquee a 64 s, `focus-visible:outline-white/70` nos CTAs, colofão dos proofChips na
  mesma linha da faixa em lg+.

### 7.1 Arquivos e fronteira servidor/cliente

| Ação | Arquivo | Tipo | Resumo |
| --- | --- | --- | --- |
| editar | `src/components/sections/hero.tsx` | server | section própria (sem `Section`), bloco plum, coluna de texto, `<HeroNetwork />`, colofão, `<HeroMarquee tone="plum" speed={64} />` |
| criar | `src/components/sections/hero-network.tsx` | client | halo, `TrailCluster tone="plum" emphasis`, disco do hub com símbolo e anel de pulso, três discos de foto, compasso único |
| criar | `src/components/sections/hero-network.test.tsx` | teste | ver 7.13 |
| editar | `src/components/sections/hero-rotating.tsx` | client | prop `tone?: "light" \| "plum"` |
| editar | `src/components/sections/hero-rotating.test.tsx` | teste | um caso novo |
| editar | `src/components/sections/hero-marquee.tsx` | server | props `tone?: "light" \| "plum"` e `speed?: number` |
| editar | `src/components/sections/hero-marquee.test.tsx` | teste | um caso novo |
| editar | `src/components/sections/hero.test.tsx` | teste | reescrito (7.13) |
| editar | `src/components/ui/trail-cluster.tsx` | client | props `tone`, `emphasis`; exports `TRAIL_NODES`, `TRAIL_SIZE` |
| editar | `src/components/ui/trail-cluster.test.tsx` | teste | três casos novos; os existentes continuam passando |
| editar | `tests/e2e/hero.spec.ts` | e2e | ver 7.13 |
| remover | `src/components/sections/hero-stage.tsx` | | substituído por `hero-network.tsx` |
| remover | `src/components/sections/hero-stage.test.tsx` | | |

Servidor: `hero.tsx`, `hero-marquee.tsx`, `marquee.tsx`, `button.tsx`, `badge.tsx`. Cliente:
`hero-network.tsx`, `hero-rotating.tsx`, `trail-cluster.tsx`. O h1 e todo o texto saem prontos do
SSR e nenhum `m.*` envolve texto. Imports de motion permitidos: `m`, `useInView`, `useReducedMotion`,
`AnimatePresence` (só no `RotatingWord`, já existente). Nunca `motion.*`.

### 7.2 Layout

**Desktop (lg+).** `hero.tsx` renderiza:

```tsx
<section
  id="inicio"
  aria-labelledby="inicio-titulo"
  className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]"
>
  <div
    data-hero-block=""
    className="relative isolate overflow-hidden rounded-3xl bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))] text-white"
  >
    <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pt-10 pb-8 sm:px-10 sm:pt-14 lg:min-h-[calc(100svh-8.25rem)] lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-8 lg:px-14 lg:py-12 xl:px-20">
      <div data-hero-copy="" className="relative z-10 lg:col-span-6">
        {/* eyebrow, h1, lead, PriceLine, CTAs, trust (7.9) */}
      </div>
      <div className="relative lg:col-span-6 lg:min-h-[560px]">
        <HeroNetwork className="relative mx-auto aspect-square w-full max-w-[420px] lg:absolute lg:top-1/2 lg:right-[-6%] lg:w-[min(44vw,620px)] lg:max-w-none lg:-translate-y-1/2 2xl:w-[680px]" />
      </div>
      <div className="flex flex-col gap-5 lg:col-span-12 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-8">
        <ul data-hero-colophon="" aria-label="Resumo da assinatura" className="...">{/* 7.8 */}</ul>
        <HeroMarquee tone="plum" speed={64} className="min-w-0" />
      </div>
    </div>
  </div>
</section>
```

Por que cada número:

- `pt-20 / md:pt-28 / lg:pt-[7.5rem]` = altura real do header fixo (64 px sem faixa legal; 96 px em
  md com a faixa `h-8`; 104 px em lg com `h-[72px]`) + 16 px de respiro. O header é transparente até
  `scrollY > 24`; nessa faixa a borda inferior dele entra no máximo 8 px no bloco e os links
  (centrados na barra) continuam sobre branco.
- `lg:min-h-[calc(100svh-8.25rem)]` = 100svh menos `pt` (120 px) e `pb-3` (12 px): o bloco fecha na
  dobra em 1440x900 (768 px de bloco). `lg:grid-rows-[1fr_auto]` pinta a linha da faixa no rodapé
  do bloco em vez de centralizá-la (grid estica trilhas `auto` quando há `min-h`).
- Rede `lg:w-[min(44vw,620px)]` e `lg:right-[-6%]`: em 1440 px a coluna tem 600 px, a rede 620 px e
  a sangria 36 px; a borda esquerda da rede fica 24 px dentro do gap de 32 px, sem entrar na coluna
  de texto. Em 1024 px (coluna 416, rede 451, sangria 25) a borda esquerda fica 10 px dentro do
  gap. Em 2xl a rede vai a 680 px (1920x1080: linha 1 tem 780 px de altura). A sangria cai no
  padding do bloco (56 px em lg, 80 px em xl), então nada é recortado; o `overflow-hidden` do bloco
  e o `overflow-x-clip` da section garantem zero rolagem horizontal.
- `max-w-[1400px]` no grid mantém a coluna de texto em ~604 px no 1920, o que o h1 de 68 px exige.

**Mobile (360 px, header 64 px).** Coluna única na ordem: eyebrow, h1 (40 px), lead (16 px), preço,
CTA primário `w-full` (52 px), CTA secundário `w-full`, trust, rede (aspect-square, `max-w-[420px]`,
centrada, 296 px de largura em 360), colofão (mono, `flex-wrap`), faixa de especialidades. Bloco com
`px-5 pt-10 pb-8`. Estimativa da dobra em 360x740: 80 (pt) + 40 (pt-10) + 16 (eyebrow) + 16 (mt-4)
+ 5 linhas de 40 px (h1: "Consultas / médicas / ilimitadas," + duas linhas reservadas pela frase
mais alta) = 352; lead `mt-5` 5 linhas de 26 px = 502; preço `mt-3` = 538; CTA `mt-7` termina em
~618. Folga de ~120 px para o contrato do e2e; mesmo com 6 linhas no h1 fecha em ~660.

**Tablet (sm a lg).** Mesma coluna única; h1 em 52 px, rede até 420 px.

### 7.3 Camadas (de baixo para cima, dentro do bloco `isolate`)

1. Gradiente plum do bloco (CSS, servidor).
2. Halo estático (dentro de `HeroNetwork`): `<div aria-hidden data-hero-halo className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(164_69_156/0.28),transparent)]" />`. Sem `animate-drift`.
3. `TrailCluster variant="full" animate="intro" tone="plum" emphasis={EMPHASIS} comets active confirmed={0} label={hero.clusterAlt}` (SVG inline, `w-full`).
4. Disco branco do hub (HTML absoluto centrado) com o símbolo plum e o anel de pulso.
5. Três discos de foto (HTML absoluto, posicionado em % das coordenadas do SVG).
6. Texto: coluna esquerda, servidor, `z-10`.

### 7.4 TrailCluster: props novas e geometria dos discos

```ts
export type TrailClusterTone = "light" | "plum";

export interface TrailClusterProps {
  // ...props existentes...
  // Paleta. light = claro (padrão, Especialidades e Contato não mudam); plum = sobre o bloco escuro.
  tone?: TrailClusterTone;
  // Índice do nó -> raio novo. O círculo SVG desse nó cresce e vira o anel do disco de foto.
  emphasis?: Readonly<Partial<Record<number, number>>>;
}

export const TRAIL_SIZE = 560;
// Centro e raio padrão de cada nó, para o HTML posicionar elementos em % sobre o SVG.
export const TRAIL_NODES: readonly { cx: number; cy: number; r: number }[] = NODES.map(
  ({ cx, cy, r }) => ({ cx, cy, r }),
);
```

Paletas (`COLOR` vira `PALETTE[tone]`; light é exatamente o objeto atual mais duas chaves):

| chave | light (atual) | plum |
| --- | --- | --- |
| trail | berry-300 | berry-500 |
| nodeStroke (hoje `ink`) | ink | berry-400 |
| idle | berry-100 | berry-800 |
| active (trilha) | berry-500 | berry-300 |
| activeNode (fill do nó ativo, chave nova) | berry-500 | berry-400 |
| confirmed | leaf-500 | leaf-400 |
| pad | ink | berry-400 |
| comet (chave nova; outline continua usando `trail`) | berry-500 | berry-300 |
| emphasisFill (chave nova) | berry-100 | berry-900 |
| emphasisStroke (chave nova) | ink | berry-300 |
| hubFrom / hubTo | berry-500 / berry-700 | iguais |

Sempre `var(--color-...)`. O svg ganha `data-tone={tone}`. Nó com `emphasis`: `r={emphasis[index]}`,
`fill={emphasisFill}`, `stroke={emphasisStroke}`, `strokeWidth={2}`, `data-emphasis="true"`; o
resto (trilha, pad, transição da intro) não muda. Nós enfatizados nunca recebem `active` nem
`confirmed` neste hero (os eventos só acendem 0, 1 e 2), então não há conflito de fill.

Geometria dos três discos (viewBox 560; distâncias conferidas):

| Disco | Nó | Centro | Raio | Pai (nó que o evento acende) | Pad da trilha | Vizinho mais próximo |
| --- | --- | --- | --- | --- | --- | --- |
| medicos | N5 Ortopedia | (280, 60) | 52 | N0 Clínico geral (evento "Receita digital") | sem pad; trilha reta visível por 26 unidades | N0: gap 26 |
| familia | N7 Otorrino | (500, 300) | 56 | N1 Pediatria (evento "Pediatria por vídeo") | (440, 220) a 100 do centro: gap 40 | N1: gap 50 |
| paciente | N8 Oftalmologia | (430, 470) | 52 | N2 Cardiologia (evento "Cardiologia por vídeo") | (380, 420) a 70,7 do centro: gap 14,7 | N2: gap 29 |

Bordas do viewBox: N5 topo em 8; N7 direita em 556; N8 base em 522. Todos dentro. Os outros nove nós
ficam com raio 22/18 e abstratos. `EMPHASIS = { 5: 52, 7: 56, 8: 52 }` vive em `hero-network.tsx`.

Posicionamento do HTML: `left = cx / 5.6 %`, `top = cy / 5.6 %`, `width = (2r - 8) / 5.6 %`,
`-translate-x-1/2 -translate-y-1/2`. O wrapper é `aspect-square` e o SVG `w-full`, então SVG e HTML
escalam juntos. Os 4 unidades que sobram do círculo SVG (fill berry-900, stroke berry-300) aparecem
como anel em volta da foto e servem de placeholder enquanto a imagem carrega. Tamanhos resultantes:
rede 620 px: 115 / 124 / 115 px (hub 104 px); rede 296 px (mobile): 55 / 59 / 55 px (hub 64 px).

### 7.5 HeroNetwork (`hero-network.tsx`, "use client")

Estado: `comets` (false), `step` (-1 = antes do primeiro compasso, estado do servidor),
`activeNode` (null), `photoIndex: Record<"medicos" | "familia" | "paciente", 0 | 1>` (tudo 0),
`pulseStep: number | null` (null). `reduced = useReducedMotion() === true`. `inView = useInView(ref)`
(sem `once`, amount padrão) no wrapper.

```ts
const INTRO_DONE_MS = 2200;
const ACTIVE_MS = 1600;
const EVENTS = heroDynamic.events;
const POOLS = {
  medicos: { node: 5, r: 52, trigger: 0, photos: [
    { key: "medicaSorrindo", position: "50% 22%" }, { key: "medicaHeadset", position: "50% 35%" } ] },
  familia: { node: 7, r: 56, trigger: 1, photos: [
    { key: "familiaSofa", position: "50% 40%" }, { key: "familiaCasa", position: "50% 45%" } ] },
  paciente: { node: 8, r: 52, trigger: 2, photos: [
    { key: "heroPaciente", position: "50% 28%" }, { key: "idosoTablet", position: "40% 35%" } ] },
} as const;
```

Efeitos (todos limpos no unmount; nenhum roda quando `reduced`):

1. `setTimeout(INTRO_DONE_MS)` liga `comets`. Cometas só renderizam com `comets && inView`.
2. Um único `setInterval(heroDynamic.eventEveryMs)`: `if (document.hidden || !inView) return;`
   senão `setStep(s => s + 1)`. Não existe provider: há um só consumidor.
3. Ao mudar `step >= 0`: `event = EVENTS[step % EVENTS.length]`. Se `event.node !== null`:
   `setActiveNode(node)`, `setTimeout(ACTIVE_MS)` para voltar a null, e o pool cujo `trigger ===
   node` alterna `photoIndex` (0 para 1, 1 para 0) no mesmo instante (o atraso visual de 350 ms fica
   na `transition.delay`). Se `node === null`: `setActiveNode(null)` e `setPulseStep(step)`.

Markup do disco de foto (um por pool):

```tsx
<div
  data-photo-node={id}
  data-node-index={pool.node}
  data-photo-index={index}
  className="absolute -translate-x-1/2 -translate-y-1/2"
  style={{ left: `${(cx / TRAIL_SIZE) * 100}%`, top: `${(cy / TRAIL_SIZE) * 100}%`, width: `${((2 * r - 8) / TRAIL_SIZE) * 100}%` }}
>
  <m.div
    className="relative aspect-square overflow-hidden rounded-full bg-berry-900"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={reduced ? INSTANT : { delay: DISC_DELAY[id], duration: 0.6, ease: EASE_OUT_EXPO }}
  >
    {pool.photos.map((photo, i) => {
      const current = i === index;
      return (
        <m.div
          key={photo.key}
          data-photo-current={current ? "" : undefined}
          aria-hidden={current ? undefined : true}
          className="absolute inset-0"
          initial={false}
          animate={current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={reduced ? INSTANT : { delay: 0.35, duration: 0.9, ease: EASE_IN_OUT_SOFT }}
        >
          <Image
            src={photos[photo.key].src}
            alt={current ? photos[photo.key].alt : ""}
            fill
            sizes="(min-width: 1024px) 144px, 20vw"
            loading="eager"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </m.div>
      );
    })}
  </m.div>
</div>
```

Pools de exatamente duas fotos: as duas ficam montadas, a atual em opacity 1 e a outra em 0, e a
troca é um crossfade simétrico (sem `AnimatePresence`, sem disco vazio, sem CLS). `INSTANT = {
duration: 0, delay: 0 }`; `initial` nunca vira `false` sob reduced motion (o HTML do servidor e o
primeiro render do cliente precisam ser iguais; a transição zerada faz o estado final aparecer no
primeiro frame). `DISC_DELAY = { medicos: 1.3, familia: 1.45, paciente: 1.6 }` segundos.

Disco do hub:

```tsx
<div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
  <m.span
    data-hero-mark=""
    className="relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-deep ring-[6px] ring-berry-400/30 lg:h-[104px] lg:w-[104px]"
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={reduced ? INSTANT : { delay: 0.2, duration: 0.6, ease: EASE_OUT_EXPO }}
  >
    <Image src="/brand/moorah-mark.png" alt="" width={194} height={265} sizes="56px" className="h-9 w-auto lg:h-14" />
    {pulseStep !== null && !reduced ? (
      <m.span
        key={pulseStep}
        data-hub-pulse=""
        data-step={pulseStep}
        className="absolute inset-0 rounded-full border-2 border-berry-300"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
      />
    ) : null}
  </m.span>
</div>
```

O anel monta com `key={step}`: toca uma vez por evento sem nó e fica em opacity 0 até o próximo.
Símbolo em 56 px (PNG 194x265, nunca acima de 265 px), só plum, só sobre branco.

### 7.6 Coreografia de entrada e movimento contínuo

Texto: nenhuma animação (h1, lead, preço, CTAs, trust e colofão saem prontos do servidor; o h1 é o
LCP). Tempos abaixo a partir da montagem de `HeroNetwork`, easing `ease-out-expo` [0.22, 1, 0.36, 1]
salvo indicado; sob reduced motion tudo é `INSTANT` e o estado final aparece de uma vez.

| t (ms) | O que acontece |
| --- | --- |
| 0 | Halo já visível (estático, servidor). |
| 200 a 800 | Hub SVG e disco branco do símbolo: scale 0.6 para 1, opacity 0 para 1 (INTRO.hub existente). |
| 500 a 1500 | Trilhas internas `pathLength` 0 para 1, 700 ms cada, stagger 60 ms, `ease-in-out-soft`. |
| 700 a 1450 | Nós internos scale 0.7 para 1, 450 ms, stagger 60 ms. |
| 1000 a 1950 | Trilhas externas, 600 ms, stagger 50 ms. |
| 1200 a 1950 | Nós externos (inclusive os três anéis grandes), 450 ms, stagger 50 ms. |
| 1300 / 1450 / 1600 | Discos medicos, familia, paciente: opacity 0 para 1, scale 0.9 para 1, 600 ms. Cada um entra depois do próprio anel. |
| 1900 | Nó 0 (Clínico geral) confirma em leaf com o halo único (existente, `confirmed={0}`). |
| 2200 | Cometas ligam (12 paths CSS `animate-comet`, 4,5 s linear, delays 0 a 2,75 s, berry-300). |
| 2800, 5600... | Segunda linha do título troca (`RotatingWord`, 450 ms, inalterado). |
| 4200, 8400... | Compasso: ver abaixo. |

Cada compasso T (a cada 4,2 s):

- Evento com nó (events 0, 2 e 4, nós 2, 0 e 1): em T a trilha do nó passa a berry-300 stroke 3 e o
  nó a berry-400 (transição CSS de 200 ms já existente no TrailCluster); em T + 350 ms o disco
  filho faz crossfade de 900 ms `ease-in-out-soft` (nova foto opacity 0 para 1 e scale 1.06 para 1,
  antiga o inverso); em T + 1600 ms trilha e nó apagam.
- Evento sem nó (events 1, 3 e 5): só o anel do hub pulsa uma vez (scale 1 para 1,7, opacity 0,6
  para 0, 1,2 s). Nada troca de foto. O ritmo fica irregular de propósito.
- Cada disco troca uma vez a cada 25,2 s (um ciclo de seis eventos). Devagar por decisão.

O que se move sem parar: cometas (CSS, só transform de dash), faixa de especialidades (CSS,
64 s por ciclo), frase do título (2,8 s). Nada pisca, nada gira, nada em texto além da frase.

Como para:

- `document.hidden`: o intervalo não avança (nenhum compasso, nenhum estado acumula); a frase já
  faz o mesmo; CSS pausa sozinho em aba escondida.
- Rede fora da tela (`useInView` sem `once`): intervalo não avança e cometas saem do DOM até voltar.
- `prefers-reduced-motion`: sem intervalo, sem cometas, sem crossfade, sem pulso, frase fixa,
  cascata instantânea; a media query de `globals.css` zera o marquee (que vira `flex-wrap` estático)
  e qualquer transição. Estado exibido: primeira foto de cada disco, nó 0 confirmado, primeira frase.
- Hover: nenhum (sem tilt, sem parallax; `useScroll` sai do hero). Marquee pausa no hover como hoje.

### 7.7 Fotos

Seis fotos, em pares por disco, sempre dentro de círculo, nunca com nada por cima (nem texto, nem
badge, nem símbolo). `next/image fill`, `sizes="(min-width: 1024px) 144px, 20vw"`, `loading="eager"`,
**sem `priority`** em nenhuma (o h1 é o LCP e não queremos preload de foto competindo com as fontes
auto-hospedadas). `object-cover` com `objectPosition` por foto (estimativas; conferir no navegador):

| Disco | Foto inicial | Alterna com | object-position |
| --- | --- | --- | --- |
| medicos (N5) | `medicaSorrindo` (retrato 2:3) | `medicaHeadset` (3:2) | 50% 22% / 50% 35% |
| familia (N7) | `familiaSofa` (16:9) | `familiaCasa` (3:2) | 50% 40% / 50% 45% |
| paciente (N8) | `heroPaciente` (3:2) | `idosoTablet` (3:2) | 50% 28% / 40% 35% |

Ficam de fora: `exame` (tubo de sangue não lê como pessoa em círculo pequeno), `pacienteCama` (tablet
na cama, sem rosto) e `medicoVideo` (16:9 com a pessoa pequena; recorta mal em círculo).
`medicaHeadset` repete a foto do CTA final; se incomodar ao vivo, trocar por `medicoVideo` com
`objectPosition` ~45% 35% e conferir o recorte. Nenhuma foto de fundo, nenhum Ken Burns: o único
"zoom" é o scale 1,06 para 1 do crossfade, contido no disco. O alt do manifesto vai na foto atual;
a outra fica `aria-hidden` com alt vazio.

### 7.8 Eventos do produto, colofão e faixa de especialidades

`heroDynamic.events` é o metrônomo da rede (7.5 e 7.6). Label, text e icon dos eventos não aparecem
(sem ticker, sem card, sem legenda): restrição 7 cumprida à letra. `hero.moments` deixa de ser
usado (pendência 7.14).

Colofão (`hero.proofChips`), na primeira coluna da linha da faixa:

```tsx
<ul
  data-hero-colophon=""
  aria-label="Resumo da assinatura"
  className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-berry-200 [&>li+li]:before:mr-3 [&>li+li]:before:text-berry-400 [&>li+li]:before:content-['·']"
>
  {hero.proofChips.map((chip) => <li key={chip}>{chip}</li>)}
</ul>
```

Sem `Badge`, sem ponto colorido: rótulo de sistema do manual. O separador é CSS `content`, não entra
na leitura. Em mobile a lista quebra linha acima da faixa; em lg+ fica à esquerda da faixa, na mesma
linha (`lg:grid-cols-[auto_minmax(0,1fr)]`).

Faixa (`HeroMarquee tone="plum" speed={64}`): permanece fechando o bloco, `role="group"` com
`aria-label={heroDynamic.stripLabel}`, 12 chips `Badge tone="plum" size="md" className="gap-2
whitespace-nowrap px-4 py-2 text-[13px]"` com `Icon` em `text-berry-300`, `speed` repassado ao
`Marquee` (64 s: a faixa vira textura). Sem hairline acima (o `gap` do grid separa). A máscara
lateral do `Marquee` funciona sobre plum sem mudança.

### 7.9 Tipografia

| Elemento | Classes | Tamanhos |
| --- | --- | --- |
| Eyebrow | `eyebrow text-berry-300` (JetBrains Mono 500, caixa alta, tracking 0.18em; o padrão já usado em Cartão e Contato) | 11 px |
| H1 | `mt-4 font-display font-bold tracking-[-0.03em] leading-[1.02] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[3rem] xl:text-[3.75rem] 2xl:text-[4.25rem]` | 40 / 52 / 48 / 60 / 68 px |
| Linha 1 do h1 | `heroDynamic.titleStatic` em `<span aria-hidden className="block">` branco | |
| Linha 2 do h1 | `<RotatingWord tone="plum" />`: frase ativa em `text-berry-200` sólido (gradiente morre sobre plum) | |
| sr-only | `<span className="sr-only">{hero.title}</span>` dentro do h1 | |
| Lead | `mt-5 max-w-[34rem] text-base leading-relaxed text-berry-100 sm:text-lg 2xl:text-xl` (Manrope) | 16 / 18 / 20 px |
| Preço | `mt-3 font-display text-base font-semibold text-white`, valor em `<span className="font-mono tabular-nums text-berry-200">{formatBRL(plans[0].priceCents)}</span>` | 16 px |
| CTAs | `mt-7 flex flex-col gap-3 sm:flex-row`; primário `Button variant="plum" size="lg" asChild className="w-full focus-visible:outline-white/70 sm:w-auto"` para `#planos`; secundário `variant="outline-light"` igual, para `#como-funciona`, com `<ArrowRight size={18} aria-hidden="true" />` | 16 px, 52 px de altura |
| Trust | `mt-5 flex max-w-[34rem] items-start gap-2 text-sm leading-relaxed text-berry-100/85` com `<Icon name="shield-check" size={18} className="mt-0.5 shrink-0 text-leaf-300" />` | 14 px |
| Colofão | `font-mono text-[11px] uppercase tracking-[0.18em] text-berry-200` | 11 px |
| Chips da faixa | `Badge tone="plum"`, `font-sans font-semibold text-[13px]` | 13 px |

Peso 700 no h1 (specimen do manual), não 800. Por que `lg` (48 px) é menor que `sm` (52 px): em
`sm` a coluna é única (até ~900 px de largura); em `lg` o texto passa a ocupar 6/12 da grade
(416 px em 1024). "Consultas médicas" mede cerca de 8,3 em com tracking -0.03em (Plus Jakarta 700),
então cabe em uma linha até: 416 px / 8,3 = 50 px (lg, 1024), 520 / 8,3 = 62 px (xl, 1280),
604 / 8,3 = 72 px (2xl, capado pelo `max-w-[1400px]`). Os tamanhos 48 / 60 / 68 ficam abaixo desses
tetos com folga de 4 a 6 %. Resultado: h1 sempre em 2 linhas estáticas + 1 ou 2 da frase (a frase
mais alta, "em qualquer especialidade.", reserva 2 linhas pelo sizer). Se ao vivo a linha quebrar,
recuar um passo (`xl:text-[3.5rem]`, `2xl:text-[4rem]`) sem mexer no layout. Nenhum traço
decorativo; o único separador é "·".

### 7.10 Cores por token

- Bloco: `bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]` (único gradiente
  permitido), inserido com margem (`px-3/4/6`, `pb-3`) e `rounded-3xl`, nunca faixa infinita.
- Halo: `rgb(164 69 156 / 0.28)` (berry-500 a 28 %) radial, estático.
- Rede (tone plum): trilhas berry-500; pads berry-400; nós abstratos fill berry-800 stroke
  berry-400; trilha ativa berry-300 stroke 3; nó ativo fill berry-400; nó confirmado leaf-400;
  cometas berry-300 opacity 0.9; anéis dos discos fill berry-900 stroke berry-300; hub SVG
  gradiente berry-500 para berry-700.
- Disco do hub: `bg-white shadow-deep ring-[6px] ring-berry-400/30`; símbolo plum.
- Texto: branco (11,6:1 sobre ink), berry-100 (~9:1), berry-200 (~7:1), berry-300 só em 11 px
  mono (5,8:1, AA). Ícone de confiança leaf-300. Botão primário `bg-white text-ink` (10:1);
  secundário `border-berry-300 text-white`.
- Faixa: `Badge tone="plum"` (`bg-white/10 text-berry-100 border-white/15`), ícones berry-300.
- O resto da página segue claro: 70/20/8 fecha no conjunto (hero, Cartão, card Familiar e CTA
  final são os únicos blocos plum; não adicionar mais).

### 7.11 Acessibilidade

- Um único `h1` no servidor (`id="inicio-titulo"`), `hero.title` completo em sr-only, as duas
  linhas visíveis `aria-hidden`. Section `aria-labelledby="inicio-titulo"`.
- SVG da rede `role="img"` com `aria-label={hero.clusterAlt}`. Foto atual de cada disco com o alt
  do manifesto; a outra `aria-hidden` e alt vazio. Disco do hub e anel de pulso dentro de um
  wrapper `aria-hidden`, imagem do símbolo com alt vazio. Halo `aria-hidden`.
- Colofão em `<ul aria-label="Resumo da assinatura">`; separador em CSS `content` (não é lido).
  Faixa `role="group"` rotulada; cópia do marquee `aria-hidden` (já é).
- Ordem de leitura: eyebrow, h1, lead, preço, CTAs, trust, rede (svg + 3 alts), colofão, faixa.
- Contraste AA em todo texto (7.10). Foco visível branco nos dois CTAs (`focus-visible:outline-white/70`;
  o anel global berry-500/50 some sobre plum). Interativos: só os dois links; nada na rede ou na
  faixa recebe foco; alvos de 52 px.
- Reduced motion: `MotionConfig reducedMotion="user"` + `useReducedMotion` em `HeroNetwork`,
  `RotatingWord` e `TrailCluster`: estado final imediato, sem intervalo, sem cometas, sem crossfade,
  sem pulso; CSS zerado pela media query. Intervalos pausam com `document.hidden` e fora da tela.
- Nenhum texto sobre imagem em nenhum breakpoint (o axe não precisa avaliar contraste sobre foto).

### 7.12 Performance

- LCP: o h1 branco sobre o bloco plum, renderizado no servidor, sem opacity inicial e sem `m.*`.
  Fundo é gradiente CSS (não conta como LCP). Nenhuma imagem do hero é maior que o bloco de texto.
- Fotos: seis imagens `eager` de 144 px de largura útil (AVIF via `next/image`, ~8 a 12 KB cada,
  ~60 KB no total), sem `priority` e sem `<link rel=preload>`. Símbolo: `/brand/moorah-mark.png`
  já em cache pelo header.
- JS: `hero-network.tsx` substitui `hero-stage.tsx` e tira `useScroll`, `useTransform`,
  `useMotionValue` e `AnimatePresence` dos cards; ganha um `useInView`, um `setInterval` e dois
  `setTimeout`. Bundle do hero menor ou igual ao atual; nenhuma dependência nova; reaproveita o
  `LazyMotion domAnimation` já carregado.
- SVG inline: 12 trilhas + 12 cometas, `vector-effect="non-scaling-stroke"`, menos de 40 segmentos
  por path (inalterado).
- Animação só em transform, opacity e stroke-dashoffset (compositor). Sem `will-change` permanente.
- CLS zero: discos absolutos dentro de `aspect-square`; `RotatingWord` com sizers; bloco com
  `min-h` em `svh` no desktop; colofão e faixa com altura fixa.
- Meta: página abrindo em menos de 2 s no pagespeed móvel; o hero adiciona ~60 KB de imagens e
  nenhuma requisição bloqueante.

### 7.13 Testes (TDD: escrever antes de implementar)

Ordem: (1) `trail-cluster.test.tsx` e `trail-cluster.tsx`; (2) `hero-rotating` e `hero-marquee`;
(3) `hero-network.test.tsx` e `hero-network.tsx`; (4) `hero.test.tsx` e `hero.tsx`, apagando
`hero-stage.tsx` e `hero-stage.test.tsx`; (5) `hero.spec.ts`; (6) verificação no navegador (7.15).
Mocks como em `docs/design-brief.md` 10.1 (`useInView: () => true`, `useReducedMotion` via
`mockReduced`); `document.hidden` via `Object.defineProperty` como em `hero-rotating.test.tsx`.

**`trail-cluster.test.tsx`** (três casos novos; os 18 existentes continuam verdes porque o padrão é
`tone="light"`):

1. `tone="plum"` com `comets`: svg `data-tone="plum"`; trilha 0 stroke contém `--color-berry-500`;
   nó 0 stroke contém `--color-berry-400` e fill `--color-berry-800`; cometa 0 stroke contém
   `--color-berry-300`; pad 1 fill contém `--color-berry-400`.
2. `emphasis={{ 5: 52 }}` em `animate="static"`: nó 5 tem `r="52"` e `data-emphasis="true"`, fill
   contém `--color-berry-100` (light) ; nó 6 continua `r="18"`; seguem 12 trilhas e 8 pads.
3. Exports: `TRAIL_SIZE === 560`; `TRAIL_NODES` tem 12 itens; `TRAIL_NODES[0]` é
   `{ cx: 280, cy: 160, r: 22 }` e `TRAIL_NODES[7]` é `{ cx: 500, cy: 300, r: 18 }`.

**`hero-rotating.test.tsx`** (um caso novo): `tone="plum"` faz `[data-rotating-active]` ter
`text-berry-200` e não ter `text-gradient-berry`; o padrão continua `text-gradient-berry`.

**`hero-marquee.test.tsx`** (um caso novo): `tone="plum" speed={64}`: o chip tem `bg-white/10` e
`text-berry-100`; o ícone tem `text-berry-300`; a faixa (`.animate-marquee`) tem
`style.animationDuration === "64s"`; o grupo continua rotulado por `heroDynamic.stripLabel`.

**`hero-network.test.tsx`** (novo, `renderWithMotion(<HeroNetwork />)`):

1. Sob reduced motion: três `[data-photo-node]` (medicos, familia, paciente), todos
   `data-photo-index="0"`, com `getByAltText` de `photos.medicaSorrindo.alt`, `familiaSofa.alt` e
   `heroPaciente.alt`; nenhuma imagem com `fetchpriority="high"` nem `loading="lazy"`; svg
   `data-tone="plum"`, nó 0 `data-state="confirmed"`, nós 5/7/8 com `data-emphasis`; zero
   `[data-comet]`; `[data-hero-mark] img` com `src` contendo `moorah-mark` e `alt=""`; nenhum
   `[data-hub-pulse]`; nenhum texto dentro de `[data-photo-node]` (`textContent === ""`).
2. Sem reduced motion, fake timers: zero cometas antes de 2200 ms, 12 depois.
3. Compasso: `tick()` (4200 ms) faz svg `data-active="2"` e `paciente` `data-photo-index="1"`
   (medicos e familia seguem "0"); +1600 ms apaga `data-active`; `tick()` (events[1], sem nó) monta
   `[data-hub-pulse][data-step="1"]` e não troca foto; `tick()` (events[2], nó 0) troca `medicos`
   para "1"; dois `tick()` (events[4], nó 1) trocam `familia` para "1".
4. Com `document.hidden = true`, três `tick()` não avançam nada (`data-active` ausente, índices 0);
   ao voltar visível, um `tick()` avança.
5. Posição: o disco `paciente` tem `style.left` ≈ 76,79 %, `style.top` ≈ 83,93 % e `style.width` ≈
   17,14 % (`toBeCloseTo`, 1 casa).
6. `unmount()` e `vi.runAllTimers()` não lançam.

**`hero.test.tsx`** (reescrito, `renderWithMotion(<Hero />)`, reduced motion):

1. Um único h1 com `hero.title` em sr-only; section `#inicio` rotulada por ele; eyebrow e lead
   presentes (mantido).
2. Título em duas linhas: `titleStatic` e `[data-hero-rotating][data-phrase="0"]` com a primeira
   frase, ambos `aria-hidden`; a frase ativa tem `text-berry-200` (mantido + tone).
3. CTAs: `hero.primaryCta` para `#planos` com classes `bg-white` e `text-ink`; `hero.secondaryCta`
   para `#como-funciona` com `border-berry-300`.
4. Preço: linha contém `formatBRL(plans[0].priceCents)` (NBSP normalizado) e o `.font-mono` tem só o
   preço e `text-berry-200` (mantido + cor).
5. Trust contém "não é plano de saúde"; `getByRole("img", { name: hero.clusterAlt })` é um svg com
   `data-tone="plum"` e nó 0 confirmado; três `[data-photo-node]` com as três fotos iniciais e sem
   texto dentro; nenhum `[data-moment]`; nenhum `img` com `fetchpriority="high"`.
6. Faixa: `getByRole("group", { name: heroDynamic.stripLabel })` com os 12 nomes e chips
   `bg-white/10`; colofão `getByRole("list", { name: "Resumo da assinatura" })` com os 3 chips e
   nenhum `Badge` (nenhum `.rounded-full` dentro da lista); `[data-hero-block]` tem a classe do
   gradiente; nenhum `h2`.

**`tests/e2e/hero.spec.ts`** (mantém: dobra 360x740 do h1 e do CTA; nó 0 confirmado em até 8 s;
título estático sob reduced motion; frase alterna; altura do h1 estável; símbolo no hub com alt
vazio; faixa rotulada e 12 cometas em até 10 s). Muda:

1. Substitui o teste da foto por "três discos de foto dentro da rede, sem nada por cima e sem
   preload": `#inicio [data-photo-node]` tem count 3; para cada um, `toBeVisible()`,
   `[data-photo-current] img` com `alt` maior que 10 caracteres e sem `loading="lazy"`, e
   `innerText()` vazio; `head link[rel="preload"][as="image"][imagesrcset*="pexels"]` tem count 0
   (as imagens do header continuam com preload, por isso o filtro).
2. Novo "sem rolagem horizontal em 360 px": viewport 360x740,
   `page.evaluate(() => document.documentElement.scrollWidth)` menor ou igual a 360.
3. Novo "o bloco plum começa abaixo do header": em desktop, `header` `boundingBox()` bottom menor
   ou igual a `[data-hero-block]` `boundingBox()` y.
4. Novo "um compasso acende o nó do evento": `#inicio svg[data-trail-cluster]` recebe
   `data-active="2"` em até 12 s (`toHaveAttribute` com timeout; o estado dura 1,6 s e o polling
   do Playwright pega).
5. Estende o teste de reduced motion: depois dos 3,5 s, `[data-comet]` tem count 0 e todo
   `[data-photo-node]` tem `data-photo-index="0"`.

### 7.14 Pendências

Registrar em `docs/conteudo-a-confirmar.md`, seção "Hero v3". Nada disso entra em `site.ts`
nesta rodada.

- `hero.moments` e o tipo `HeroMoment` ficam sem uso; `heroDynamic.events[].label/text/icon`
  ficam sem uso no hero (só `node` é lido). Manter por enquanto; remover em rodada de conteúdo.
- `src/app/loading.tsx` desenha um esqueleto de hero claro; em navegação cliente haverá salto de
  claro para plum. Fora do escopo do hero.
- Fotos são placeholders do Pexels; em círculo pequeno a cara de banco de imagens aparece mais.
  Fotos próprias enquadradas para círculo (rosto centrado, fundo limpo) melhoram muito.
- `medicaHeadset` repete a foto do CTA final. Alternativa registrada em 7.7.
- Header transparente sobre plum só ficaria em risco se o `pt` do hero cair abaixo de altura do
  header + 16 px; documentado em 7.2 para quem mexer no header.

### 7.15 Checklist final do construtor

1. `npm run typecheck` limpo; `npx biome check --write` nos arquivos tocados; `npx vitest run
   --maxWorkers=1` completo verde (não só os arquivos do hero).
2. `grep -n $'\xe2\x80\x94'` nos arquivos tocados volta vazio (sem travessão); nenhum traço
   decorativo; separadores só "·".
3. Só `m.*` de `motion/react`; nenhum `motion.*`, `layout`, `layoutId`, `drag`, `popLayout`.
   Nenhum `Math.random`, `Date.now` ou `window` no render.
4. Restrições duras de 3, uma a uma: nenhum texto, chip ou símbolo sobre foto; nenhuma coluna
   "foto com coisas em cima"; h1 único no servidor com frase completa; CTAs e preço de `site.ts`;
   copy só de `site.ts`; sem travessão; reduced motion e `document.hidden`; sem rolagem em 360;
   sem dependência nova; `landing.spec.ts` verde; símbolo só no disco branco do hub.
5. `npm run build` e `npm run test:e2e` (contra build + start, no máximo 4 workers) verdes.
6. No navegador real (obrigatório, não é opcional): 360, 1024, 1280, 1440 e 1920 de largura.
   Conferir: (a) `scripts/check-overflow.cjs` sem elemento vazando em 360 e 390; (b) borda inferior
   do header nunca sobre os links quando o bloco entra (rolar 0 a 24 px); (c) h1 em 2 linhas
   estáticas em lg, xl e 2xl (se quebrar, recuar um passo em 7.9); (d) rostos dentro dos círculos
   nas seis fotos (ajustar `objectPosition` em `POOLS`); (e) discos entre 1,1x e 1,2x o disco do
   hub em 1440; (f) pads de N7 e N8 visíveis fora do anel; (g) trilhas berry-500 legíveis sobre o
   canto escuro; (h) faixa dentro da dobra em 1440x900 e 1536x864; (i) console sem erro nem aviso de
   hidratação; (j) reduced motion emulado: nada se move, primeira foto em cada disco; (k) aba
   escondida por 30 s e de volta: nenhum salto acumulado.
7. `pagespeed.web.dev` móvel: LCP é o h1, abertura abaixo de 2 s, CLS 0.
8. Atualizar `docs/conteudo-a-confirmar.md` com a seção "Hero v3" (7.14) e o contexto do projeto
   no vault (`projetos/moorah/contexto.md`) com a decisão desta rodada.
