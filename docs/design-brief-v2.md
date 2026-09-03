# Design brief v2 - ajustes pedidos pelo cliente (02/09/2026)

Complementa `docs/design-brief.md`. Onde este documento conflitar com o brief v1, este prevalece.
Origem: feedback do Filipe depois de ver a v1 no navegador. Regras de escrita continuam as mesmas:
nunca travessão (U+2014), sem emoji, sem jargão, sem números inventados, copy em `src/content/site.ts`.

## 0. O que muda

1. **Marca presente.** O símbolo amora-circuito (`public/brand/moorah-mark.png`) precisa aparecer com
   destaque; hoje só o wordmark aparece e a marca "parece escondida".
2. **Fotografia.** Pessoas reais em consulta por vídeo, médicos, famílias e exames. Manifesto em
   `site.ts` (`photos`), com URLs do CDN do Pexels já liberadas em `next.config.ts`.
3. **Dinamismo.** O hero e as seções ganham movimento contínuo e suave (ambient motion) e eventos
   do produto circulando; a v1 foi considerada bonita, mas parada.
4. **Cartão.** Número exemplo 1234 5678 9012 (`mocks.cardSamples` já atualizado).

## 1. Regras de fotografia

- Sempre `next/image` com `width`/`height` do manifesto, `sizes` adequado ao layout, `alt` do
  manifesto e `priority` só na foto do hero (`photos.heroPaciente`).
- Tratamento padrão: container `relative overflow-hidden rounded-3xl ring-1 ring-black/5`, imagem
  `object-cover` com `object-position` que preserve rostos. Quando houver texto sobre a foto, use o
  overlay `bg-[linear-gradient(to_top,rgb(31_11_32/0.75),transparent_55%)]` e texto branco.
- Nunca coloque o logo sobre a foto (regra do manual). Nunca aplique filtros de cor na foto.
- Hover leve em pointer fine: `transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]`.
- Proporções: `aspect-[4/5]` (retrato), `aspect-[3/2]`, `aspect-video`.
- Onde cada foto entra:

| Seção | Foto | Como |
| --- | --- | --- |
| Hero | `photos.heroPaciente` | Base do palco (ver 3). `priority`, `sizes="(min-width: 1024px) 440px, 80vw"`. |
| Como funciona, passo 3 | `photos.medicoVideo` | Dentro da moldura de vídeo da ilustração, com badge "Conectado" em leaf. Lazy. |
| Especialidades | `photos.medicaSorrindo` | Coluna sticky: card `aspect-[4/5]` com o TrailCluster mini sobreposto no canto inferior direito, dentro de um card branco `w-56 p-3 rounded-2xl shadow-float`. |
| Benefícios | `photos.exame` e `photos.idosoTablet` | `exame` como fundo da célula Exames (overlay plum; ExamsNetwork por cima em branco). `idosoTablet` como cabeçalho da célula Portal (aspect-video) acima do mock, mantendo a legibilidade. |
| Planos | `photos.familiaSofa` | Card `aspect-video` ao lado do SectionHeading (grid lg:grid-cols-2), com chip flutuante `animate-float-slow` "Familiar: {formatBRL(perPersonCents(familiar))} por pessoa" em `bg-white shadow-float rounded-full font-mono text-sm`. |
| Contato (CTA final) | `photos.medicaHeadset` | Card retrato ao lado do formulário no desktop (`lg:grid-cols-12`: foto 4, texto 4, formulário 4) ou acima do formulário no mobile. |
| Por que | `photos.pacienteCama` | Opcional: card `aspect-[4/5] max-w-xs` ao lado da lista de problemas com legenda "Consulta em casa" (microcopy). Só se couber sem quebrar em 360 px. |

- Crédito: o footer ganha, junto das notas legais, a linha "Fotografias ilustrativas (Pexels)".
  Registrar em `docs/conteudo-a-confirmar.md` que são placeholders até haver fotos próprias.

## 2. Marca presente

- **Header**: lockup horizontal. `<Image src="/brand/moorah-mark.png" width={194} height={265}
  className="h-7 w-auto lg:h-8" priority />` seguido do wordmark (`h-4 w-auto lg:h-[21px]`), `gap-2.5`,
  ambos plum, dentro do link para `/` com `aria-label="Moorah, página inicial"`. No mobile o símbolo
  fica visível (h-6) junto do wordmark (h-3.5).
- **Hero**: o hub do TrailCluster recebe o símbolo por sobreposição HTML (não dentro do SVG): `div`
  absoluto no centro do hub, `h-[72px] w-[72px] rounded-full bg-white shadow-float ring-4 ring-berry-100
  grid place-items-center`, com `<Image src="/brand/moorah-mark.png" width={194} height={265}
  className="h-[46px] w-auto" alt="" />`. O hub SVG continua embaixo como halo. Entra na cascata em
  200 ms (scale 0.6 para 1, como o hub).
- **Cartão**: canto superior esquerdo do bloco plum com lockup branco pequeno (`moorah-mark-white.png`
  h-8 + `moorah-wordmark-white.png` h-4, `opacity-90`), acima do eyebrow.
- **Contato (CTA final)**: lockup branco pequeno acima do eyebrow e símbolo branco grande decorativo
  (`moorah-mark-white.png`, `h-[320px] w-auto`, `opacity-[0.07]`, `aria-hidden`, absoluto no canto
  inferior direito, `pointer-events-none`, sem sobrepor a foto nem o formulário).
- **Footer**: lockup vertical grande (símbolo h-16 + wordmark h-5 abaixo) na primeira coluna; marca
  d'água do símbolo plum (`h-[420px] w-auto opacity-[0.04]`, `aria-hidden`, absoluto à direita,
  `overflow-hidden` no footer).
- **loading.tsx**: símbolo plum h-12 com `animate-pulse-soft` acima do skeleton do hero.
- Regras do manual: nunca recolorir (só plum #4B244D ou branco), nunca distorcer (`h-auto` ou
  `w-auto` sempre), nunca sobre foto ou textura.

## 3. Dinamismo do hero

Arquivos: `hero.tsx`, `hero-stage.tsx`, `trail-cluster.tsx`, novos `hero-rotating.tsx` e
`hero-marquee.tsx`, testes irmãos e `tests/e2e/hero.spec.ts`.

- **Título em duas linhas**: `heroDynamic.titleStatic` na primeira linha e, na segunda, o componente
  cliente `RotatingWord` (`hero-rotating.tsx`, "use client") que alterna `heroDynamic.rotating` a cada
  `heroDynamic.rotateEveryMs` com `AnimatePresence mode="wait"` (entrada `y: 16 -> 0`, `opacity 0 -> 1`,
  450 ms ease-out-expo; saída `y: 0 -> -16`). Container `inline-grid` com uma única célula e
  `min-h-[1.05em]` para não gerar CLS; a primeira frase é renderizada no servidor; `aria-hidden` no
  bloco animado e um `<span className="sr-only">{hero.title}</span>` com a frase completa para
  leitores de tela. Sob `useReducedMotion()` mostra a primeira frase e não troca. O `h1` continua
  único e visível (contrato do e2e). Segunda linha em `text-gradient-berry`.
- **Palco com foto**: `photos.heroPaciente` vira a base do palco: card `aspect-[4/5] w-full
  max-w-[440px] rounded-3xl` com leve `lg:-rotate-2`; o TrailCluster (largura 68% do palco) flutua à
  direita sobrepondo cerca de 30% da foto, com o hub + símbolo (item 2); os três cards de momentos
  continuam ao redor. Mobile: foto `aspect-[4/3]`, cluster reduzido (w-[60%]) sobreposto no canto
  inferior direito, um card de momento.
- **Ambient motion** (contínuo, lento, sem piscar): cards com `animate-float-slow` e `animationDelay`
  0 s, 1.2 s e 2.4 s; halo radial atrás do palco com `animate-drift`; trilhas do cluster com
  "cometas": para cada trilha do `variant="full"`, um segundo `<path>` idêntico com `pathLength="100"`,
  `strokeDasharray="12 100"`, `strokeLinecap="round"`, `className="animate-comet"`, stroke
  `var(--color-berry-500)`, opacity 0.9 e `style={{ animationDelay }}` entre 0 e 3 s (CSS puro; a
  media query de reduced-motion já zera). Prop nova `comets?: boolean` no TrailCluster, padrão `false`.
- **Eventos do produto**: depois da intro (2,4 s) os cards alternam conteúdo a cada
  `heroDynamic.eventEveryMs`, percorrendo `heroDynamic.events` em ordem, um card por vez em rodízio:
  troca com `AnimatePresence` (saída `y: -8`, `opacity 0`; entrada `y: 8 -> 0`, `opacity 0 -> 1`, 350 ms).
  Quando o evento tem `node`, o TrailCluster recebe `active={node}` por 1,6 s. Um único `setInterval`,
  limpo no unmount, pausado quando `document.hidden` e desligado sob reduced-motion (cards ficam com
  `hero.moments` estáticos).
- **Faixa de especialidades**: abaixo da grade do hero, dentro da mesma Section, `Marquee` com 12
  chips (`Icon` + nome, `Badge tone="neutral" size="md"`), `aria-label={heroDynamic.stripLabel}`,
  velocidade padrão (44 s), pausa no hover, estática sob reduced-motion (o Marquee já faz).
- Performance: sem novas dependências; `RotatingWord` e marquee são leves; a foto do hero com
  `priority` e `sizes` corretos; nada de `layout` animations.

## 4. Dinamismo nas demais seções

- **Como funciona**: após o desenho da trilha horizontal, um cometa contínuo (mesma técnica CSS sobre
  um `<path>` ou `<line>` com `pathLength="100"`); cards com hover lift (`hover:-translate-y-0.5
  hover:shadow-float`).
- **Especialidades**: TrailCluster mini com `comets` ligado depois do draw; hover na lista continua
  acendendo o nó.
- **Benefícios**: ponto de status "Realizada" com `animate-pulse-soft` (única pulsação permitida);
  ExamsNetwork ganha cometas em branco sobre a foto.
- **Planos**: chip flutuante da foto com `animate-float-slow`.
- **Contato**: TrailCluster outline com cometas em berry-300.

## 5. Checklist adicional (além do item 10 do brief v1)

- Nenhuma foto sem `alt`; nenhum logo sobre foto; `priority` só na foto do hero e no lockup do header.
- Nada gira. Loops permitidos: `float-slow`, `drift`, `comet`, `pulse-soft` em pontos de status,
  `marquee`, `spin` no envio, `shimmer` em carregamento real.
- Toda animação contínua para sob `prefers-reduced-motion` e, quando for JS, com `document.hidden`.
- Sem novas dependências. Não aumentar o JS inicial em mais de 20 kB gzip por agente.
- Atualize os testes existentes da seção (unitários e e2e) para o novo comportamento e mantenha os
  contratos de `tests/e2e/landing.spec.ts` (h1 único e visível, ids, preços, FAQ, dialog, barra mobile).
