# Design brief v4 - hero "Em casa, com médico" e variante "Sala de casa" (05/09/2026)

Substitui a seção 7 de `docs/design-brief-v3-hero.md`. As seções 1 a 3 do v3 (feedback literal
do cliente, manual da marca, restrições duras) continuam valendo, com a restrição 1 na forma
atualizada: texto pode ficar sobre a área lisa do gradiente da foto, nunca sobre a pessoa, e
nenhuma caixa, card ou chip sobre foto. Base de pesquisa: `docs/pesquisa-heros-telemedicina.md`
(70 heros vistos), capturas em `.shots/refs/**`, mocks das três direções em `.shots/direcao-a/`,
`.shots/direcao-b/` e `.shots/pexels/mock-*-v3-*.png`.

Decisões do cliente de 04/09/2026 que prevalecem sobre a pesquisa: Familiar a R$ 129,90 para até
4 pessoas (já em `plans[]`); fotos podem e devem parecer de gente brasileira; nada de "não é plano
de saúde" no hero nem nas seções de venda; fundo do hero segue o bloco plum arredondado com
margem abaixo do header; sem vídeo; sem citar o parceiro médico; promessa "consultas ilimitadas em
qualquer especialidade".

Regras de escrita deste documento e de tudo que sair dele: nenhum travessão, separador é "·",
nenhum traço decorativo, nenhum número inventado.

## 1. Decisão e placar

| Direção | Cliente e conversão | Marca | Engenharia | Total | Posição |
| --- | --- | --- | --- | --- | --- |
| A · Retrato editorial em plum | 33 | 30 | 29 | 92 | hero principal |
| C · Sala de casa (duas colunas, arco) | 32 | 29 | 32 | 93 | variante de preview |
| B · Uma frase, um preço, uma casa | 28 | 28 | 28 | 84 | fora; duas ideias aproveitadas |

C tem um ponto a mais no total e mesmo assim o hero principal é a direção A. Justificativa, na
ordem de peso:

1. Um ponto em 93 é empate técnico. Dois dos três júris (cliente e marca) puseram A em primeiro;
   só a engenharia preferiu C, e por viabilidade, não por resultado na tela.
2. Toda fraqueza de engenharia apontada em A tem correção barata e está aplicada nesta spec: o
   véu por `onLoad` vira fade em CSS puro (receita de C), a linha mono sai (não existe `font-mono`
   no projeto e o CLAUDE.md proíbe mono em texto de interface), `quality` fica no padrão 75, o
   gradiente do mobile foi recalculado para o texto nunca encostar na pessoa, e o hero inteiro
   passa a ser Server Component sem um byte de JS próprio. Depois disso A e C empatam em
   engenharia.
3. A fraqueza central de C não tem correção sem virar A: é a arquitetura "texto à esquerda, imagem
   à direita" que o cliente chamou de repetitiva, com bullets de check que são o desenho padrão de
   plano de saúde. O próprio júri de engenharia escreveu que, se o veto do cliente a duas colunas
   for absoluto, o caminho é construir A.
4. O cliente quer comparar. C é exatamente a comparação útil: a versão segura, de conversão, ao
   lado da aposta. B não entra porque é o esqueleto centrado de template de Framer, mantém a frase
   rotativa que o cliente e a pesquisa leram como mecânica e abre sem gente no mobile.

O que cada direção emprestou ao resultado:

- De B: a frase de preço com os dois planos na mesma sentença ("Individual por R$ 49,90 por mês.
  Familiar por R$ 129,90 para até 4 pessoas.") em Manrope 700, e a microcopy curta sob os CTAs na
  variante.
- De C: hero 100 % servidor, fade da foto em keyframe CSS que começa no primeiro paint, zero
  rótulo mono, teste e2e de não sobreposição entre texto e foto, e a foto da mãe com o bebê
  (27176483) como protagonista da variante.
- De A: tudo o mais: foto em sangria dentro do bloco com o texto no espaço liso, contraste do h1
  por peso e tom da mesma família, fatos em texto puro no pé do cartão, um movimento que termina.

Fraquezas de A corrigidas aqui, uma a uma:

| Fraqueza apontada | Correção |
| --- | --- |
| Texto do mobile sobre ombro, mão e celular da modelo | A foto no mobile vive em uma camada de altura fixa com máscara que chega a transparente antes do primeiro texto; um espaçador do mesmo tamanho da máscara garante que nada se sobrepõe (seção 2.4) |
| Fundo berry-950 chapado apagava o plum | O bloco mantém o gradiente 160deg ink para berry-950 (decisão 4); a foto é dissolvida por `mask-image`, então o gradiente da marca aparece através dela, sem cor pintada por cima |
| Multiply de 38 % tingia pele de roxo | Tingimento `bg-ink/25` (calibrar entre 20 e 28 %); regra: pele não pode ler como lilás |
| Duas provas (mono + fatos) | Só os fatos. Nenhum mono no hero |
| "R$ 1,67 por dia" é conta sem aval | Sai. Nenhuma aritmética de preço; os dois preços vêm de `plans[]` |
| "CFM 2.314/2022" e "LGPD" na primeira dobra | Saem. O teste de conteúdo já proíbe LGPD na home; o fato regulatório vira "Médicos habilitados · telemedicina regulamentada" |
| Familiar só nos fatos do pé | Familiar na frase de preço, visível na primeira tela do mobile |
| Véu dependente de `onLoad` e hidratação | Fade em CSS (`animate-hero-photo-in`), sem componente cliente |
| `quality={72}` coerçado para 75 no Next 16 | Sem `quality`; padrão do projeto |
| Lead de cinco linhas no mobile | Lead de uma frase; preço em parágrafo próprio |

Fraquezas de C corrigidas na variante: título troca para o de A (o anterior repetia o h1 rejeitado
na v3); check em berry-300, não em leaf (sai o terceiro matiz); "Cancele quando quiser" sai da
microcopy até o jurídico confirmar; primeiro bullet reescrito sem ambiguidade ("Individual por
R$ 49,90 por mês e Familiar por R$ 129,90 para até 4 pessoas"); fusão do arco com o bloco por
máscara, não por cor pintada; bullets e fatos não repetem informação.

Trilha da Amora: sai do hero nas duas versões e continua em Especialidades e Contato
(`TrailCluster`). Dizer isso ao cliente com todas as letras, porque ele elogiou o elemento na v1.

## 2. Hero principal: "Em casa, com médico" (direção A corrigida)

### 2.1 O que a pessoa vê em três segundos

O bloco plum de sempre, e dentro dele uma mulher brasileira em casa, sentada no sofá com o celular,
luz quente de janela, ocupando o lado direito do cartão e dissolvida no plum à esquerda. Sobre o
plum liso: "Um médico por vídeo, quando você precisar.", uma frase de lead, os dois preços em
negrito, dois pills. No pé do cartão, três fatos em texto. Nenhum diagrama, nenhum cartão, nenhum
rosto em bolinha, nada em cima da pessoa. Referências: Conexa
(`.shots/refs/telemedicina-br/conexa-1440.png`), Superpower
(`.shots/refs/saude-assinatura/superpower-1440.png`), Function mobile
(`.shots/refs/saude-assinatura/function-mobile.png`). Mock de partida:
`.shots/direcao-a/mock-17489833-1440.png` e `mock-17489833-1024.png` (o mock 360 está errado no
mobile e não deve ser copiado; ver 2.4).

### 2.2 Estrutura (`src/components/sections/hero.tsx`, Server Component, sem `"use client"`)

Imports: `ArrowRight` de lucide, `Image` de next/image, `Button`, e de `@/content/site`:
`fillPlanTokens`, `hero`, `photos`. Nada de `motion/react`, `HeroNetwork`, `RotatingWord`,
`HeroMarquee` ou `Icon`.

```tsx
const PLUM_GRADIENT = "bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]";
const PHOTO = photos.heroCasa;

<section id="inicio" aria-labelledby="inicio-titulo"
  className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]">
  <div data-hero-block=""
    className={`relative isolate grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl text-white [--hero-fade:280px] sm:[--hero-fade:380px] lg:min-h-[calc(100svh-8.25rem)] lg:max-h-[880px] lg:grid-rows-[1fr_auto] ${PLUM_GRADIENT}`}>

    {/* Camada da foto: absoluta, fora da grade, mascarada. Ver 2.3. */}
    <div data-hero-photo=""
      className="pointer-events-none absolute inset-x-0 top-0 isolate h-[440px] animate-hero-photo-in [mask-image:linear-gradient(180deg,#000_calc(var(--hero-fade)_-_80px),transparent_var(--hero-fade))] sm:h-[560px] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[84%] lg:[mask-image:linear-gradient(90deg,transparent_31%,rgb(0_0_0/0.1)_43%,rgb(0_0_0/0.55)_57%,rgb(0_0_0/0.9)_71%,#000_83%)]">
      <Image src={PHOTO.src} alt={PHOTO.alt} fill priority
        sizes="(min-width: 1024px) 84vw, 100vw"
        className="object-cover object-[72%_0%] saturate-[.92] lg:object-[100%_42%]" />
      <span aria-hidden="true" className="absolute inset-0 bg-ink/25 mix-blend-multiply" />
      <span aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden h-[40%] bg-[linear-gradient(0deg,rgb(31_11_32/0.75),rgb(31_11_32/0.25)_55%,transparent)] lg:block" />
    </div>

    {/* Respiro da foto no mobile: mesma altura em que a máscara chega a transparente. */}
    <div aria-hidden="true" data-hero-spacer="" className="h-(--hero-fade) lg:hidden" />

    <div data-hero-copy=""
      className="relative z-10 px-5 pb-7 sm:px-10 sm:pb-8 lg:max-w-[calc(36rem+3.5rem)] lg:self-center lg:py-14 lg:pr-0 lg:pl-14 xl:max-w-[calc(38rem+4.5rem)] xl:pl-[4.5rem] 2xl:max-w-[calc(42rem+5rem)] 2xl:pl-20">
      <h1 id="inicio-titulo"
        className="font-display font-semibold tracking-[-0.02em] leading-[1.04] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[3rem] xl:text-[3.5rem] min-[1440px]:text-[3.75rem] 2xl:text-[4rem]">
        <span className="sm:block">{hero.titleLines[0]}</span>{" "}
        <span className="font-bold text-berry-100 sm:block">{hero.titleLines[1]}</span>
      </h1>
      <p className="mt-4 max-w-[30rem] text-[15px] leading-[1.55] text-berry-100 sm:text-base sm:leading-relaxed lg:mt-5 lg:max-w-[28rem] lg:text-lg xl:max-w-[32rem]">
        {hero.lead}
      </p>
      <p data-hero-price=""
        className="mt-2.5 max-w-[30rem] text-[15px] leading-[1.55] sm:text-base sm:leading-relaxed lg:max-w-[28rem] lg:text-lg xl:max-w-[32rem]">
        <strong className="font-bold text-white">{fillPlanTokens(hero.prices)}</strong>{" "}
        <span className="text-berry-100">{hero.priceNote}</span>
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-7">
        <Button variant="plum" size="lg" asChild className="w-full focus-visible:outline-white/70 sm:w-auto">
          <a href="#planos">{hero.primaryCta}</a>
        </Button>
        <Button variant="outline-light" size="lg" asChild className="w-full focus-visible:outline-white/70 sm:w-auto">
          <a href="#como-funciona">{hero.secondaryCta}<ArrowRight size={18} aria-hidden="true" /></a>
        </Button>
      </div>
    </div>

    <ul data-hero-facts="" aria-label="Resumo da assinatura"
      className="relative z-10 grid gap-y-3.5 px-5 pt-1 pb-7 sm:grid-cols-3 sm:gap-x-8 sm:px-10 sm:pb-8 lg:flex lg:max-w-[46rem] lg:gap-x-10 lg:px-14 lg:pt-0 lg:pb-11 xl:px-[4.5rem] xl:pb-12 2xl:px-20 2xl:pb-[3.25rem]">
      {hero.facts.map((fact) => (
        <li key={fact.value} className="flex flex-col gap-0.5">
          <b className="font-display text-[17px] font-semibold tracking-[-0.01em] text-white lg:text-lg">{fact.value}</b>
          <span className="text-[13px] font-medium text-berry-200">{fact.label}</span>
        </li>
      ))}
    </ul>
  </div>
</section>
```

Observações de implementação:

- `calc(var(--hero-fade)_-_80px)`: dentro de valor arbitrário do Tailwind o sublinhado vira espaço;
  o `calc` precisa dos espaços em volta do sinal.
- `h-(--hero-fade)` é a sintaxe do Tailwind v4 para `height: var(--hero-fade)`. Espaçador e máscara
  leem a mesma variável: é o que garante, por construção, que o texto começa depois da foto acabar.
- A camada da foto é `absolute`, então não ocupa célula da grade. No mobile a altura do bloco é
  espaçador + copy + fatos; em `lg` é `min-h`/`max-h` com a copy centrada na linha 1 e os fatos na
  linha 2.
- Só um `Image` com `priority` na página fora do header. Sem `quality`.
- O segundo `span` do h1 não é `<b>` nem `<strong>`: o contraste é visual, e o leitor de tela não
  deve mudar a entonação.

### 2.3 Camadas, de baixo para cima

0. Bloco com o gradiente 160deg ink para berry-950 (inalterado; decisão 4 do cliente).
1. Camada da foto (`[data-hero-photo]`): `next/image` `fill`, `object-cover`, `saturate(.92)`.
   Em `lg+` ocupa os 84 % da direita, ancorada à direita (`object-position: 100% 42%`); abaixo de
   `lg` é uma faixa de 440 px (560 px em `sm`) colada no topo, com `object-position: 72% 0%`.
2. Tingimento: `span` `bg-ink/25 mix-blend-multiply` dentro da camada (o `isolate` da camada faz o
   multiply agir só sobre a foto). Calibrar entre 20 e 28 %: sombras puxam para o plum, pele
   continua pele.
3. Sombra do pé (só `lg+`): gradiente berry-950 de 0,75 a transparente nos 40 % de baixo da camada,
   para os fatos lerem sobre o sofá. Está dentro da camada, então também é mascarado.
4. Máscara da camada (`mask-image`): em `lg+`, horizontal, transparente até 31 % da camada (42 % do
   bloco), alfa 0,1 em 43 %, 0,55 em 57 %, 0,9 em 71 %, opaca de 83 % em diante. Abaixo de `lg`,
   vertical: opaca até `--hero-fade - 80px`, transparente em `--hero-fade`. Onde a máscara é
   transparente, o que aparece é o gradiente do bloco, não uma cor pintada: por isso o plum da
   marca sobrevive.
5. Copy e fatos, `relative z-10`, no fluxo da grade. Nunca sobre a pessoa.

Não existe camada 6. Nenhum véu, nenhum halo, nenhuma rede, nenhum marquee.

### 2.4 Medidas por largura (alvos; o construtor confirma no navegador real)

Geometria da foto 17489833 medida no mock 1440: rosto (cabelo ao queixo) em x 61 a 70 % e y 7 a
28 % da imagem; celular e mãos em x 49 a 58 % e y 33 a 46 %. Use estes números para conferir as
contas abaixo.

- 360x740 (header 64 px, bloco em y=80, largura 336): camada da foto 336x440, imagem coberta em
  660x440 (escala 0,344), `object-position 72% 0%`: rosto em x≈171..230, y≈31..123; mãos em
  y≈145..202. Máscara opaca até 200 px e transparente em 280 px, espaçador de 280 px: o texto começa
  em y≈360 sobre plum liso. h1 40 px em três linhas (y≈360..485), lead de duas linhas (mt 16,
  ≈499..545), preço em duas ou três linhas em 700 (mt 10, ≈555..624), CTA primário `w-full` de
  52 px terminando em ≈696 (contrato do e2e: h1, preço e CTA primário dentro de 740), CTA
  secundário, e os fatos em coluna abaixo. Rosto com cerca de 90 px de altura, inteiro na zona
  opaca. Sem rolagem horizontal (`overflow-hidden` no bloco, `overflow-x-clip` na section).
- 390x844: mesma geometria; sobra respiro abaixo do CTA.
- 640 a 1023 (tablet retrato): camada 560 px, `--hero-fade` 380 px (opaca até 300 px), h1 52 px em
  duas linhas (`sm:block`), CTAs lado a lado, fatos em três colunas. Em 1023 a imagem fica
  limitada pela largura (escala 0,533) e as mãos entram no início da zona de fade; aceitável porque
  o texto começa em 380 px.
- 1024x768: bloco 976x636; camada 820x636 (imagem 954x636, ancorada à direita). Texto de x=80 até
  no máximo x≈560 (h1 48 px, lead `max-w-[28rem]`). Regra a medir: na borda direita de cada
  elemento de texto, a máscara tem alfa ≤ 0,1 (ler a cor do pixel em `copy.right + 4` e comparar
  com o plum do gradiente; diferença ≤ 12/255 por canal). Se as mãos aparecerem sob a lead, use
  `lg:right-[-6%] xl:right-0` na camada (sangra 59 px para fora do bloco, cortando o canto da
  varanda) antes de mexer em fonte.
- 1280x800 e 1366x768: bloco 1232x668 e 1318x636; h1 56 px; copy até x≈688; pessoa inteira; bloco
  fecha na dobra (`min-h` = 100svh menos 8,25 rem).
- 1440x900: bloco 1392x768 em y=120; coluna de texto x 104..712 (608 px); h1 60 px em duas linhas;
  mãos começam em x≈820; folga mínima de 100 px entre texto e pessoa; fatos em y≈794..830 até
  x≈840, sobre a sombra do pé. Contrato do e2e: borda direita de qualquer elemento de texto da
  copy ≤ 52 % da largura do bloco.
- 1920x1080: bloco 1872x880 (`max-h`); h1 64 px (`2xl`); copy até 42 rem; o plum entre o texto e a
  pessoa cresce para ≈500 px, como na Conexa. Aceito.

Procedimento de calibração (obrigatório antes de dizer que está pronto): rodar
`node scripts/check-hero.cjs .shots/v4` (reescrito, seção 11) nas larguras 360, 390, 768, 1024,
1366x768, 1440 e 1920; abrir cada PNG e conferir que o rosto está inteiro e nítido na zona opaca,
que nenhum texto toca pessoa, celular ou mão, e que a pele não ficou lilás. Não use o painel de
navegador do Claude Code: use Playwright com `chromium.launch({ channel: "msedge" })`.

## 3. Variante de preview: "Sala de casa" (direção C corrigida)

Renderizada em `/previews/hero-alt` (noindex), só header e hero. Serve para o cliente comparar a
aposta (A) com a versão de conversão (C) na mesma sessão, com a mesma copy e a mesma paleta.

### 3.1 O que muda em relação ao principal

Duas colunas honestas: à esquerda o mesmo h1, três bullets (o primeiro com os dois preços) no lugar
da lead, os mesmos dois CTAs e uma microcopy; à direita uma foto de família em casa ocupando a altura
inteira do bloco, sangrando na borda direita e cortada à esquerda por um arco largo (Kry,
`.shots/refs/exterior/kry-1440-v2.png`). Nada sobre a foto. Fatos no pé da coluna de texto. Mock de
partida: `.shots/pexels/mock-27176483-v3-1440.png` e `mock-27176483-v3-360.png`.

### 3.2 Estrutura (`src/components/sections/hero-alt.tsx`, Server Component)

```tsx
export interface HeroAltProps {
  // "/" na página de preview, para os CTAs levarem às âncoras da home.
  linkPrefix?: string;
}

<section id="inicio" aria-labelledby="inicio-titulo"
  className="scroll-mt-20 overflow-x-clip px-3 pt-20 pb-3 sm:px-4 md:pt-28 lg:px-6 lg:pt-[7.5rem]">
  <div data-hero-block="" data-hero-variant="alt"
    className={`relative isolate overflow-hidden rounded-3xl text-white ${PLUM_GRADIENT}`}>
    <div className="grid grid-cols-[minmax(0,1fr)] lg:min-h-[calc(100svh-8.25rem)] lg:max-h-[880px] lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_auto]">

      <div data-hero-copy=""
        className="relative z-10 px-5 pt-10 pb-8 sm:px-10 sm:pt-14 lg:col-span-6 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:py-14 lg:pr-4 lg:pl-14 xl:col-span-5 xl:pl-20 [&>*]:max-w-[34rem]">
        <h1 id="inicio-titulo"
          className="font-display font-semibold tracking-[-0.02em] leading-[1.04] text-balance text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[2.5rem] xl:text-[2.875rem] 2xl:text-[3.25rem]">
          <span className="sm:block">{hero.titleLines[0]}</span>{" "}
          <span className="font-bold text-berry-100 sm:block">{hero.titleLines[1]}</span>
        </h1>
        <ul aria-label="O que está incluído" className="mt-7 grid gap-3 text-[17px] leading-[1.45] text-berry-100">
          {hero.bullets.map((segments, index) => (
            <li key={index} className="flex gap-3">
              <Check size={18} strokeWidth={2.25} aria-hidden="true" className="mt-[3px] shrink-0 text-berry-300" />
              <span>
                {segments.map((segment, i) =>
                  typeof segment === "string"
                    ? fillPlanTokens(segment)
                    : <b key={i} className="font-bold text-white whitespace-nowrap">{fillPlanTokens(segment.strong)}</b>,
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">{/* mesmos dois Buttons; href={`${linkPrefix}#planos`} e `${linkPrefix}#como-funciona` */}</div>
        <p className="mt-[18px] text-[13px] leading-normal text-berry-100/80">{hero.micro}</p>
      </div>

      <div data-hero-photo=""
        className="relative isolate aspect-[4/3] overflow-hidden animate-hero-photo-in [clip-path:ellipse(115%_100%_at_50%_100%)] [mask-image:linear-gradient(180deg,transparent,#000_16%)] lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:h-full lg:[clip-path:ellipse(88%_118%_at_100%_50%)] lg:[mask-image:linear-gradient(90deg,transparent,#000_18%)] xl:col-span-7 xl:col-start-6">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority
          sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[42%_20%] lg:object-[40%_30%]" />
        <span aria-hidden="true" className="absolute inset-0 bg-ink/12 mix-blend-multiply" />
      </div>

      <ul data-hero-facts="" aria-label="Resumo da assinatura"
        className="flex flex-wrap gap-x-6 gap-y-1.5 px-5 pt-5 pb-7 text-sm text-berry-100 sm:px-10 lg:col-span-6 lg:row-start-2 lg:pt-0 lg:pr-4 lg:pl-14 xl:col-span-5 xl:pl-20">
        {hero.facts.map((fact) => (
          <li key={fact.value}>
            <b className="font-display font-semibold text-white">{fact.value}</b>
            <span className="before:mx-2 before:text-berry-300 before:content-['·']">{fact.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

`PHOTO = photos.heroFamilia`. As chaves dos bullets podem ser o índice: a lista é estática e vem
de `site.ts`. Se o Biome reclamar de `key={index}`, use `segments.map(...).join("")` como chave.

### 3.3 Medidas (do mock C, com a fonte do h1 ajustada)

- 1440x900: coluna 5/12 = 580 px (texto útil 484 px); foto 812x768 de x=604 até a borda direita,
  arco recuando ≈97 px no meio da altura; h1 46 px em duas linhas; CTA primário termina em ≈600;
  bloco fecha em 888; fatos em duas linhas no pé da coluna.
- 1366x768: foto 769x636; bloco fecha em 756.
- 1024x768: coluna 6/12 = 488 px; h1 40 px (pode quebrar em três linhas com `text-balance`); foto
  488x636 com a mãe parcialmente cortada pelo arco. É o ponto mais apertado; conferir que o rosto
  da mãe e o do bebê ficam inteiros (ajustar `object-position` para 36 % se precisar).
- 360x740: h1 40 px em quatro linhas (y≈120..286), bullets (≈314..513), CTA primário `w-full`
  terminando em ≈597 (contrato: ≤ 740), secundário, microcopy, foto 336x252 começando em ≈697 (a
  borda do arco já aparece na primeira tela), fatos empilhados. `scrollWidth` 360.

### 3.4 Página de preview (`src/app/previews/hero-alt/page.tsx`)

```tsx
import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { HeroAlt } from "@/components/sections/hero-alt";

export const metadata: Metadata = {
  title: "Prévia do hero alternativo",
  robots: { index: false, follow: false, nocache: true },
};

export default function HeroAltPreview() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        <HeroAlt linkPrefix="/" />
      </main>
    </>
  );
}
```

Sem `MobileCtaBar`, sem outras seções, sem link para esta rota em lugar nenhum da home. Os links
do header apontam para âncoras que não existem nesta página; é preview, não produto.

## 4. Fotos

Todas verificadas em 05/09/2026 com `fetch` no CDN em `w=1920`: HTTP 200, `image/jpeg`, dimensões
lidas do cabeçalho JPEG. Placeholders do Pexels até a Moorah ter fotos próprias com gente
brasileira em casa; é a decisão que mais muda o resultado (pesquisa, 9.5). O rodapé mantém
"Fotografias ilustrativas (Pexels)". Todas já estão em `photos` de `src/content/site.ts`.

| Chave | Pexels | Uso | Peso | Por quê | Tratamento |
| --- | --- | --- | --- | --- | --- |
| `heroCasa` | 17489833 (Sandro Tavares, fotógrafo brasileiro) | hero principal | 168 KB, 1920x1280 | Mulher em apartamento brasileiro, sofá, celular, luz de janela, roupa neutra, olhar fora da câmera; dois terços da imagem são espaço negativo que aceita o plum | `object-[72%_0%]` no mobile, `100% 42%` em lg+; `bg-ink/25` multiply; máscara da seção 2.3 |
| `heroFamilia` | 27176483 (Helena Lopes, Belo Horizonte) | variante | 234 KB, 1920x1280 | Mãe com o bebê no colo olhando o celular, filho maior ao fundo, casa brasileira de verdade (piso, carrinho); é a cena literal do Familiar | `object-[42%_20%]` no mobile, `40% 30%` em lg+; `bg-ink/12` multiply; arco e máscara da seção 3.2 |
| `heroMaeFilha` | 8259883 | alternativa para o hero se o cliente pedir família na versão A; candidata a Planos | 263 KB, 1920x1280 | Mãe e filha rindo juntas com o celular no sofá; pessoas que leem como brasileiras | Se usada no hero A: camada `lg:w-[78%]`, `object-position 100% 45%` (mobile `58% 30%`), máscara transparente até 36 %, copy `lg:max-w-[32rem]` (o rosto da filha cai na zona de fade com os valores de `heroCasa`; ver `.shots/direcao-a/mock-8259883-1440.png`) |
| `heroSenior` | 27086767 (Helena Lopes) | público 60+; candidata a Planos ou Especialidades | 221 KB, 1920x1280 | Senhor de polo no sofá sorrindo para o celular, mesma casa da série | `object-position 50% 30%`; ele ocupa o centro do quadro, então funciona melhor na variante (arco) do que no principal |

Pendência de foto registrada: a modelo de `heroCasa` tem 30 e poucos anos e o público declarado é
40 a 55 ou pai/mãe com criança. Duas buscas adicionais no Pexels (mulher brasileira 40 anos sofá
celular; casal brasileiro sala celular) não trouxeram nada melhor do que as quatro acima. Foto
própria resolve; até lá, `heroMaeFilha` é a troca de uma chave se o cliente preferir família no
principal.

## 5. Copy (já aplicada em `src/content/site.ts`; construtores não editam o arquivo)

Chaves v4 em `hero`:

- `title`: "Um médico por vídeo, quando você precisar." (frase completa do h1, visível; sem sr-only,
  sem rotação).
- `titleLines`: ["Um médico por vídeo,", "quando você precisar."] (linha 1 em 600 branco, linha 2 em
  700 berry-100; `titleLines.join(" ") === title`, testado).
- `lead`: "Consultas ilimitadas em qualquer especialidade, para você ou para toda a família."
- `prices`: "Individual por {individual} por mês. Familiar por {familiar} para até {people}
  pessoas." Renderizar com `fillPlanTokens(hero.prices)` em `<strong>` Manrope 700 branco.
- `priceNote`: "Sem taxa de adesão." (regular, berry-100, na mesma linha).
- `primaryCta` / `secondaryCta`: inalterados ("Escolher meu plano" para `#planos`, "Como funciona"
  para `#como-funciona`).
- `facts` (três, valor + legenda): "Médicos habilitados · telemedicina regulamentada", "Receitas e
  atestados · digitais, válidos em todo o Brasil", "Cartão Moorah incluso · desconto em farmácias,
  exames e lojas parceiras". Não repetem lead nem preço; nenhum número, nota, selo, LGPD ou CFM.
- `bullets` (variante; trechos `string | { strong }`): (1) "Individual por {individual} por mês e
  Familiar por {familiar} para até {people} pessoas", com os dois "Plano por preço" em negrito;
  (2) "Consultas ilimitadas em qualquer especialidade, para você ou para toda a família"; (3) "Agende
  e consulte pelo celular ou computador, sem instalar nada" (fato já afirmado em `faq[5]`).
- `micro` (variante): "Assinatura mensal, sem taxa de adesão." (`planNotes[0]` já afirma).

Helper novo em `site.ts`: `fillPlanTokens(text)` resolve `{individual}`, `{familiar}`, `{people}` e
`{price}` a partir de `plans[]` com `formatBRL`. Nenhum componente escreve número de preço.

Chaves v3 que continuam no arquivo só porque `hero-network.tsx`, `hero-rotating.tsx` e
`hero-marquee.tsx` ainda existem: `hero.eyebrow`, `hero.priceLine`, `hero.trust`,
`hero.proofChips`, `hero.clusterAlt`, `hero.moments`, `heroDynamic` inteiro e o tipo `HeroEvent`.
Saem na limpeza final (seção 12), junto com o teste "momentos do hero usam icones e tons
conhecidos" de `src/content/site.test.ts`.

O que não entra em nenhuma versão: "não é plano de saúde" (fica em Planos, rodapé e termos), LGPD,
"CFM 2.314/2022", "R$ 1,67 por dia", "Cancele quando quiser" (até o jurídico confirmar), número de
especialidades, nome do parceiro médico, notas de app, depoimentos, selos, "Mais escolhido" no hero.

Testes de conteúdo já verdes: `src/content/site.hero.test.ts` (novo) e `src/content/site.test.ts`.

## 6. Tipografia

- h1: Plus Jakarta Sans (`font-display`), linha 1 peso 600 branco, linha 2 peso 700 berry-100;
  `tracking-[-0.02em]`, `leading-[1.04]`, `text-balance`. Nunca 800, nunca gradiente, nunca matiz
  diferente: o contraste é por peso e por um tom mais claro da mesma família (Conexa).
  Principal: 40 px (base) / 52 (sm) / 48 (lg) / 56 (xl) / 60 (1440) / 64 (2xl). Variante: 40 / 52 /
  40 (lg) / 46 (xl) / 52 (2xl). A partir de `sm` cada linha é `block`; no base as duas fluem em
  três linhas.
- Lead e preço: Manrope (`font-sans`), 15 px / 1,55 no base, 16 px / relaxed em sm, 18 px em lg+.
  Preço em Manrope 700 branco dentro da frase (Function, Superpower, One Medical); nota em 400
  berry-100.
- Bullets (variante): Manrope 17 px / 1,45 berry-100, trechos em 700 branco com `whitespace-nowrap`
  para "R$ 129,90" nunca quebrar.
- Fatos: valor em Plus Jakarta 600, 17 px (18 px em lg), `tracking-[-0.01em]`, branco; legenda em
  Manrope 500, 13 px, berry-200 (principal) ou Manrope 14 px berry-100 com "·" em berry-300 via
  `before:content` (variante).
- CTAs: `Button size="lg"` (52 px, Plus Jakarta 700 16 px), como está.
- Microcopy (variante): Manrope 13 px, berry-100 a 80 %.
- Mono: nenhum. Não existe `font-mono` no projeto e nenhum texto de interface pode usar mono
  (CLAUDE.md). Nenhuma caixa alta com tracking no hero.

## 7. Cores, por token

- Fundo do bloco: `bg-[linear-gradient(160deg,var(--color-ink),var(--color-berry-950))]`
  (inalterado).
- Tingimento da foto: `bg-ink/25` em `mix-blend-multiply` (principal; calibrar 20 a 28 %),
  `bg-ink/12` (variante).
- Sombra do pé (principal, lg+): `rgb(31 11 32 / 0.75)` para transparente (berry-950).
- Texto: branco (h1 linha 1, preço, valores dos fatos, trechos em negrito), `text-berry-100` (h1
  linha 2, lead, nota de preço, bullets), `text-berry-200` (legendas dos fatos do principal),
  `text-berry-100/80` (microcopy da variante).
- Acentos: `text-berry-300` (check dos bullets e "·" dos fatos da variante; borda do CTA
  secundário via `variant="outline-light"`).
- CTA primário: `variant="plum"` (branco cheio, texto `ink`). Foco: `focus-visible:outline-white/70`
  nos dois CTAs (o anel global berry-500/50 some sobre plum).
- Proibidos no hero: `leaf-*` (nenhum verde), `text-gradient-berry`, qualquer `berry-4xx/5xx`
  saturado como fundo, halo radial.
- Símbolo da marca: só no header. Nunca sobre a foto, nunca dentro do bloco.

## 8. Movimento

Um só, e ele termina: a foto entra. `animate-hero-photo-in` (já em `globals.css`:
`--animate-hero-photo-in: hero-photo-in 700ms var(--ease-out-expo) both`, keyframe de opacidade
0 para 1) aplicado à camada da foto nas duas versões. É CSS puro: começa no primeiro paint, não
depende de hidratação, não envolve texto, e com `both` a foto fica opaca ao terminar. Sob
`prefers-reduced-motion` a regra global de `globals.css` zera a duração e a foto nasce no estado
final.

Compromisso assumido, para constar: a animação começa quando a camada pinta, não quando a imagem
chega. Com `priority` e o preload no head a imagem costuma chegar dentro dos 700 ms; em rede lenta
ela aparece sem fade. É preferível a um véu por `onLoad` que esconde a foto até a hidratação e
exige componente cliente (crítica do júri de engenharia à direção A original).

Nada mais se move: sem palavra rotativa, sem cometa, sem marquee, sem halo em deriva, sem Ken Burns,
sem `setInterval`. O header continua ganhando fundo branco com `scrollY > 24`, como hoje. Vídeo fica
para quando houver material próprio (decisão 5).

## 9. Acessibilidade

- Um único `h1#inicio-titulo`, renderizado no servidor, com a frase inteira visível; `section#inicio`
  com `aria-labelledby`. Sem sr-only, sem `aria-hidden` em texto.
- Listas: `ul[aria-label="Resumo da assinatura"]` (fatos) e, na variante,
  `ul[aria-label="O que está incluído"]` (bullets). "·" via CSS `content`, fora da leitura; `Check`
  com `aria-hidden="true"`.
- Foto com `alt` descritivo em pt-BR (cena, não "imagem de"); `span`s de tingimento e sombra com
  `aria-hidden="true"`; camada com `pointer-events-none` no principal.
- Contraste sobre o gradiente (pior caso ink #4b244d): branco 11,5:1; berry-100 10,3:1; berry-200
  (13 px) acima de 8:1; berry-100/80 acima de 7:1; berry-300 só em acento decorativo. Onde os fatos
  do principal avançam sobre a sombra do pé (alfa 0,75 de berry-950 sobre sofá tingido), medir no
  navegador: mínimo 4,5:1 para a legenda de 13 px.
- CTAs: `<a>` dentro de `Button asChild`, 52 px de altura, `w-full` no mobile, ordem de tabulação
  primário depois secundário, `ArrowRight` com `aria-hidden`.
- Nenhuma informação só por cor; nenhum texto sobre pessoa; nenhum conteúdo dependente de hover
  ou de JS.
- `landing.spec.ts` continua rodando o axe (wcag2a/aa, 2.1) na home; a variante ganha a mesma
  varredura na sua rota.

## 10. Performance

- LCP: em desktop é a foto (≈1170x768 px em 1440); em mobile disputa com o h1. Por isso a foto tem
  `priority` (preload com `fetchpriority="high"` no head), `sizes` real por breakpoint e AVIF/WebP
  pelo servidor de imagens do Next a partir do JPEG de 1920 px (168 KB de origem no principal, 234 KB na
  variante; estimativa de 120 a 200 KB em AVIF no bucket 1920 e 60 a 90 KB no bucket 1080 do
  mobile; medir no build). Exatamente um `link[rel=preload][as=image]` do Pexels no head.
- O h1 e todo o texto saem do SSR e pintam no primeiro frame sobre o plum; a restrição 3 do brief
  v3 ("h1 é o LCP ou pinta antes da foto") continua satisfeita na segunda forma.
- CLS zero por construção: camada da foto absoluta (principal) ou com `aspect-[4/3]` e linha `1fr`
  (variante), espaçador de altura fixa, botões de 52 px, fontes auto-hospedadas, nenhum texto que
  muda de altura.
- JS do hero: zero. Somem `hero-network.tsx` (TrailCluster de 12 nós, 24 caminhos, 6 `Image`,
  `useInView`, `setInterval`), `hero-rotating.tsx` e `hero-marquee.tsx` do bundle da home.
- Custo de compositing: `mix-blend-multiply` + `mask-image` + `saturate` em uma camada de
  ≈1170x768. Se em celular fraco o scroll engasgar, o primeiro corte é `saturate`, o segundo é
  trocar o multiply por um `bg-ink/20` normal.
- Medir: `node scripts/check-hero.cjs .shots/v4` (LCP não, mas preload, opacidade, medidas) e
  pagespeed.web.dev depois de `npm run build`. Meta da instrução global: tela em menos de 2 s.

## 11. Testes a escrever (TDD: teste antes do componente)

### 11.1 Construtor 1 (hero principal)

`src/components/sections/hero.test.tsx` (reescrever; `render` puro serve, o hero não tem cliente):

1. Um único heading nível 1, com texto igual a `hero.title`, id `inicio-titulo`; `section#inicio`
   com `aria-labelledby` para ele; nenhum `.sr-only` dentro do h1; dois `span` filhos, o primeiro
   com `font-semibold` e o segundo com `font-bold text-berry-100`.
2. Lead igual a `hero.lead`; parágrafo `[data-hero-price]` contém
   `formatBRL(getPlan("individual").priceCents)`, `formatBRL(getPlan("familiar").priceCents)` e
   `"4 pessoas"` (normalizar NBSP), o `<strong>` tem `font-bold text-white`, e `hero.priceNote`
   aparece fora do strong.
3. CTA primário `bg-white text-ink` para `#planos`; secundário `border-berry-300` para
   `#como-funciona`.
4. `img` com `alt === photos.heroCasa.alt`, atributo `fetchpriority="high"` (exatamente um na
   renderização), `src` contendo `17489833`; a camada `[data-hero-photo]` tem `textContent` vazio
   e classe `animate-hero-photo-in`; os `span` dentro dela têm `aria-hidden="true"`.
5. `ul[aria-label="Resumo da assinatura"]` com 3 `li`, cada um com `b.font-display` igual a
   `fact.value` e um `span` igual a `fact.label`; nenhum `svg` dentro da lista.
6. Ausências: nenhum `[data-hero-network]`, `[data-hero-rotating]`, `[data-hero-strip]`,
   `role="group"`, `.font-mono`, `.text-leaf-300`, nenhum texto contendo "LGPD", "plano de saúde",
   "por dia" ou "CFM"; nenhum heading nível 2.
7. `[data-hero-block]` tem a classe do gradiente `PLUM_GRADIENT` e `[data-hero-spacer]` existe com
   `lg:hidden`.

`tests/e2e/hero.spec.ts` (reescrever; rodar contra `npm run build && npm run start`, máximo 4
workers):

1. 360x740: `h1`, `[data-hero-price]` e o link "Escolher meu plano" terminam em y ≤ 740;
   `[data-hero-copy].top - [data-hero-block].top ≥ 270`; `[data-hero-photo].bottom ≥ copy.top`
   (a camada existe atrás, mas mascarada).
2. 360x740: `document.documentElement.scrollWidth ≤ 360`.
3. Desktop: `header.bottom ≤ [data-hero-block].top`.
4. 1440x900: para cada filho de `[data-hero-copy]`, `right ≤ block.left + 0.52 * block.width`;
   `[data-hero-facts].right ≤ block.left + 0.62 * block.width`; `block.bottom ≤ 900`.
5. 1024x768: filhos da copy com `right ≤ block.left + 0.6 * block.width`; pixel em
   `(copy.right + 4, h1.centerY)` lido via `page.screenshot` recortado ou `canvas` dista ≤ 12/255
   por canal do pixel em `(block.left + 8, mesma y)` (o plum liso). É o teste de "texto só sobre
   área lisa".
6. Foto: `#inicio [data-hero-photo] img` com `alt.length > 10`, `fetchpriority="high"`,
   `naturalWidth > 0` após `load`; exatamente um
   `head link[rel="preload"][as="image"][imagesrcset*="pexels"]`.
7. Sem reduced motion: `getComputedStyle([data-hero-photo]).opacity` chega a "1" em até 2 s. Com
   `emulateMedia({ reducedMotion: "reduce" })`: opacidade "1" imediatamente após `goto`.
8. Ausências no `#inicio`: `[data-trail-cluster]`, `[data-photo-node]`, `[data-comet]`,
   `getByRole("group", { name: "Especialidades disponíveis" })`, `.font-mono`; texto do `#inicio`
   não contém "LGPD", "não é plano de saúde", "CFM" nem o caractere travessão (U+2014).
9. `h1` tem texto exatamente "Um médico por vídeo, quando você precisar." e o `#inicio` mostra
   "49,90", "129,90" e "até 4 pessoas".

`scripts/check-hero.cjs`: reescrever para medir, por largura, `blockTop/Bottom`, `copyRight` (maior
`right` entre os filhos), `priceBottom`, `ctaBottom`, `factsRight`, `photo` (`x`, `w`, `opacity`,
`loaded`, `alt`), `preloads`, `scrollW`, `h1` (tamanho, peso, linhas), e salvar PNG em 360, 390,
768, 1024, 1366x768, 1440 e 1920 (`WIDTHS` por env, como hoje). Remover rede, discos, cometas,
marquee e hub.

`landing.spec.ts`: sem mudança de contrato (h1 único e visível, ids, `#planos`, axe, travessão).

### 11.2 Construtor 2 (variante)

`src/components/sections/hero-alt.test.tsx`:

1. Um único h1 igual a `hero.title`, mesmas classes de peso das duas linhas.
2. `ul[aria-label="O que está incluído"]` com 3 `li`; o primeiro contém os dois preços de `plans[]`
   e "4 pessoas"; cada `li` tem um `svg[aria-hidden="true"]` com `text-berry-300` e pelo menos um
   `b.font-bold.text-white`; nenhum `.text-leaf-300`.
3. CTAs para `#planos` e `#como-funciona` por padrão; com `linkPrefix="/"`, para `/#planos` e
   `/#como-funciona`.
4. `hero.micro` renderizado; `img` com `alt === photos.heroFamilia.alt`, `fetchpriority="high"`
   único; `[data-hero-photo]` com `textContent` vazio, classe `animate-hero-photo-in` e classe
   contendo `clip-path:ellipse`.
5. `ul[aria-label="Resumo da assinatura"]` com 3 `li`; ausências iguais às do principal (rede,
   marquee, mono, LGPD, "plano de saúde"); `[data-hero-block][data-hero-variant="alt"]` com o
   gradiente.

`src/app/previews/hero-alt/page.test.tsx`: `metadata.robots` com `index: false`; a página renderiza
um `header`, um `main#conteudo`, um único h1 e nenhum `[data-testid="cta-mobile"]`.

`tests/e2e/hero-alt.spec.ts` (rota `/previews/hero-alt`):

1. `head meta[name="robots"]` contém `noindex`.
2. 360x740: h1 e CTA primário terminam em y ≤ 740; `scrollWidth ≤ 360`; `[data-hero-photo].top`
   < 740 + 60 (a borda do arco entra no primeiro gesto de rolagem).
3. 1440x900: `[data-hero-photo].width ≥ 0.5 * block.width`; nenhum elemento com texto próprio
   (`h1, p, li, a, b, span` com `innerText` não vazio) intersecta o retângulo de
   `[data-hero-photo]`; `block.bottom ≤ 900`.
4. Foto: `alt.length > 10`, `fetchpriority="high"`, um preload do Pexels no head; reduced motion
   deixa `[data-hero-photo]` com opacidade "1".
5. CTAs com `href` `/#planos` e `/#como-funciona`; texto do `#inicio` sem "LGPD", "não é plano de
   saúde", "Cancele quando quiser" nem o caractere travessão (U+2014).
6. Axe (wcag2a/aa, 2.1) sem violações sérias ou críticas.

## 12. Divisão do trabalho (paralelo, sem colisão)

Já feito por este brief: `src/content/site.ts` (copy v4, `fillPlanTokens`, quatro fotos, `pexels()`
com largura), `src/content/site.hero.test.ts`, `src/app/globals.css` (`--animate-hero-photo-in` e
keyframe `hero-photo-in`). `tsc --noEmit` e `vitest run src/content` verdes em 05/09/2026.

Construtor 1 (hero principal) toca só em: `src/components/sections/hero.tsx` (reescrever),
`src/components/sections/hero.test.tsx` (reescrever), `tests/e2e/hero.spec.ts` (reescrever),
`scripts/check-hero.cjs` (reescrever), `docs/conteudo-a-confirmar.md` (registrar as quatro fotos
com crédito e a pendência da idade da modelo). Remove `hero-network.tsx`, `hero-network.test.tsx`,
`hero-rotating.tsx`, `hero-rotating.test.tsx`, `hero-marquee.tsx`, `hero-marquee.test.tsx`
(`trail-cluster.tsx` e `marquee.tsx` ficam: Contato, Especialidades e `ui/marquee` ainda usam).
Não toca em `site.ts`, `globals.css`, `header.tsx`, `page.tsx` nem em nada de `hero-alt*`.

Construtor 2 (variante) toca só em: `src/components/sections/hero-alt.tsx`,
`src/components/sections/hero-alt.test.tsx`, `src/app/previews/hero-alt/page.tsx`,
`src/app/previews/hero-alt/page.test.tsx`, `tests/e2e/hero-alt.spec.ts` e, se quiser medir,
`scripts/check-hero-alt.cjs` (novo). Não toca em `hero.tsx`, `hero.spec.ts`, `site.ts`,
`globals.css` nem em `docs/`. Pendências de conteúdo que encontrar vão no resumo final, não no
arquivo de docs.

Os dois usam `animate-hero-photo-in`, `PLUM_GRADIENT` (constante local em cada arquivo, mesmo
valor), `Button`, `fillPlanTokens`, `hero`, `photos`. Nenhum importa do arquivo do outro. Os dois
rodam, antes de encerrar: `npx.cmd biome check --write <seus arquivos>`,
`npx.cmd tsc --noEmit -p tsconfig.json`, `npx.cmd vitest run <seus testes> --maxWorkers=1`, e o
script de medida com Playwright em Edge contra `http://localhost:3000`, abrindo os PNGs.

Limpeza final (uma passada só, depois dos dois construtores, por quem edita `site.ts`): remover
`hero.eyebrow`, `hero.priceLine`, `hero.trust`, `hero.proofChips`, `hero.clusterAlt`,
`hero.moments`, `heroDynamic`, `HeroEvent` e `HeroMoment` de `site.ts`; remover o teste "momentos
do hero usam icones e tons conhecidos" de `site.test.ts` (manter as asserções de `mocks` em outro
`it`); avaliar `--animate-comet`, `--animate-drift`, `--animate-float*` e a dependência
`@fontsource-variable/jetbrains-mono` (sem importador) com `grep` e Knip; rodar `npm run check` e
`npm run test:e2e`.

## 13. Checklist do construtor e do revisor

Marcar uma a uma, com evidência (PNG ou saída de teste), antes de mostrar ao cliente:

1. Uma pessoa inteira, em cena real, ocupando pelo menos 40 % do bloco em 1440 e com o rosto
   inteiro e nítido na primeira tela do 360x740. Sem jaleco, sem círculo, sem recorte.
2. Nenhum texto, chip, card, símbolo ou traço sobre a pessoa; onde texto e foto convivem, a máscara
   já está em alfa ≤ 0,1 (teste 5 do e2e do principal; teste 3 do e2e da variante).
3. Bloco plum arredondado com margem e o gradiente ink para berry-950 intacto; a foto dissolve por
   máscara, não por cor pintada.
4. h1 único, no servidor, frase completa visível, Plus Jakarta 600 na linha 1 e 700 na linha 2,
   sem gradiente, sem matiz diferente, sem 800.
5. Preço dos dois planos em Manrope 700 dentro da frase, vindo de `plans[]` por `fillPlanTokens`;
   "Sem taxa de adesão." em regular; nada de card, mono, riscado, "por dia" ou "a partir de".
6. Dois CTAs pill (`plum` e `outline-light`), foco branco, `w-full` no mobile, `#planos` e
   `#como-funciona` (com prefixo `/` na página de preview).
7. Um só elemento de prova: os três fatos em texto (ou os três bullets mais fatos na variante, sem
   repetição). Zero ícone em círculo, zero numeração, zero mono, zero verde.
8. Um movimento (fade da foto em CSS), que termina; reduced motion mostra o estado final; nenhum
   `setInterval`, nenhum componente cliente no hero.
9. Nenhum travessão e nenhum traço decorativo em código, texto ou teste; separador "·".
10. Sem "não é plano de saúde", LGPD, CFM, "Cancele quando quiser", nome do parceiro ou número de
    especialidades no hero.
11. Símbolo da marca só no header.
12. Sem rolagem horizontal em 360; h1, preço e CTA primário dentro de 740 no 360x740; bloco começa
    abaixo do header; bloco fecha na dobra em 1366x768 e 1440x900.
13. Um preload de imagem no head; `fetchpriority="high"` na foto; CLS zero; nenhum erro de console
    (contrato de `landing.spec.ts`).
14. Contraste AA medido no navegador para as legendas de 13 px sobre a sombra do pé.
15. Capturas em `.shots/v4/` (principal) e `.shots/v4-alt/` (variante) nas larguras 360, 390, 768,
    1024, 1366x768, 1440 e 1920, abertas e conferidas por quem construiu.
16. Trilha da Amora fora do hero, e o cliente avisado disso explicitamente.
17. `npm run check` verde; `hero.spec.ts`, `hero-alt.spec.ts` e `landing.spec.ts` verdes contra o
    build.

## 14. Riscos e pendências que ficam registradas

- A direção vive da foto. 17489833 é a melhor que o Pexels deu em seis buscas, mas é banco: foto
  própria com gente brasileira em casa, 40 a 55 anos ou pai/mãe com criança, é a decisão que mais
  muda o resultado. O layout aceita a troca sem mudar nada além da chave em `photos` (mesma
  proporção 3:2, pessoa à direita, espaço negativo à esquerda).
- "Qualquer especialidade" na lead é decisão do cliente; a seção Especialidades lista 12. O FAQ já
  qualifica ("disponível na plataforma") e essa qualificação pode entrar na lead se o jurídico
  pedir.
- "Médicos habilitados · telemedicina regulamentada" é a `hero.trust` de hoje reescrita em fato;
  "Receitas e atestados digitais válidos em todo o Brasil" vem de `steps[3]`; "Sem taxa de
  adesão" de `planNotes`. Nada novo a confirmar além do que já está em `docs/conteudo-a-confirmar.md`.
- O fade em CSS não espera a imagem: em rede lenta a foto aparece sem transição. Aceito em troca de
  zero JS no hero.
- Em 1920+ sobra plum entre texto e pessoa; Conexa faz o mesmo. Se incomodar, `2xl:max-w-[46rem]`
  na copy antes de mexer na foto.
- Este hero corrige uma seção. A pesquisa (6.13) mostra que a cara de IA vem das nove seções
  seguintes com o mesmo compasso (eyebrow mono, numeração 01 a 0n, ícones em círculo, mini UIs).
  `heroMaeFilha` (Planos) e `heroSenior` (Especialidades) já servem para começar a troca das fotos
  posadas e da médica de jaleco na próxima rodada.
