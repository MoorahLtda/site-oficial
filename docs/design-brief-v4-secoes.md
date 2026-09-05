# Design brief v4 - redesenho das seções fora do hero (05/09/2026, revisão 2)

A revisão 2 incorpora a crítica recebida no mesmo dia; a seção 10 registra o que foi acatado, o que
não foi e por quê. Complementa `docs/design-brief.md` (v1), `docs/design-brief-v2.md` e `docs/design-brief-v3-hero.md`.
Onde conflitar com a v1 (seções 5.4 a 5.13) ou com a v2 (fotos, dinamismo das seções), este
documento prevalece. O hero (`hero*.tsx`, `trail-cluster.tsx`, `tests/e2e/hero.spec.ts`) está com
outro time e não entra aqui: nenhum pacote deste brief toca nesses arquivos. A faixa de documentos
legais do header fica como está (pedido do cliente).

Fontes: `docs/pesquisa-heros-telemedicina.md` (seções 4, 5, 6 e 6.13), capturas do estado atual
em `.shots/limpeza/` (abertas uma a uma antes de escrever), referências em `.shots/refs/` (Conexa,
Alice, Function, Kry desktop e mobile, Superpower, dr.consulta, Oscar, Mira, Parsley, One Medical),
`src/content/site.ts` e `src/components/sections/*.tsx`.

Regras de escrita e de código continuam: nunca travessão (U+2014), separador é "·" ou hífen, sem
emoji, copy só em `site.ts`, nenhum número, depoimento, selo ou logo inventado, nenhuma dependência
nova de runtime (única exceção, declarada: `knip` como devDependency na integração final, seção 7),
nada de fonte mono na interface.

## 0. Diagnóstico em uma frase

O que o cliente chama de "cara de IA" não está em uma seção: está na repetição de seis hábitos por
11.000 px (eyebrow em toda seção, numeração 01 a 0n em seis, ícone em círculo em cinco, mini
interfaces falsas em três, circuito como metáfora em cinco, título com ponto final e tracking
apertado em todas). Cada seção sozinha é limpa; a soma é um template. Esta rodada corta os seis
hábitos, tira duas seções que não têm o que provar, funde outras duas e devolve à página o que os
sites bons têm: uma pessoa grande em cena real, texto com hierarquia por peso e escala, e ritmo
que muda a cada bloco.

## 1. Princípios desta rodada

Derivados da seção 4 da pesquisa (padrões que funcionam) e do diagnóstico 6.13. O construtor e o
revisor checam um a um.

1. **Uma pessoa em cena real por bloco de foto.** Foto ambientada, pessoa inteira ou de meio corpo,
   olhar fora da câmera, sem jaleco fora da tela (o médico só aparece dentro do tablet ou do
   celular que a pessoa olha, regra Teladoc). Nunca recorte sobre cor, nunca avatar em círculo,
   nunca família posando para a câmera. Fora do hero a página passa a ter duas fotos, grandes,
   em vez de sete pequenas.
2. **Nada sobre fotografia.** Nem chip, card, texto, legenda, símbolo, diagrama ou gradiente com
   texto sobre uma `img` de `photos.*`. Legenda de foto, se existir, vai abaixo do retângulo em
   HTML. Todo `absolute` que hoje pousa em cima de uma fotografia sai. Duas exceções, e só elas,
   porque não são fotografias: o Cartão Moorah (`[data-card-stage]`, objeto da marca com número,
   rótulo, titular e brilho sobre a faixa lisa, como hoje) e a marca d'água do símbolo em Contato
   (`[data-brand-watermark]`, `img` decorativa sobre plum liso, permitida pelo manual).
3. **Um só elemento de prova por seção, e só o que existe.** Prova aqui é fato de produto
   (`plans[]`, regras comerciais confirmadas) ou fato regulatório já publicado nos documentos
   legais. Sem "Mais escolhido", sem "rede em crescimento", sem tela de portal que o produto não
   tem, sem percentual de desconto.
4. **Hierarquia por peso e escala.** Plus Jakarta Sans 600 nos títulos e nos nomes de plano;
   700 só no preço, nos botões (incluindo as opções do `SegmentedControl`, que já são `font-bold`
   em `ui/`) e no utilitário `eyebrow` (700 por definição). Manrope no corpo, `text-gray-600` para
   o secundário. Nenhum ornamento faz o trabalho que tamanho e peso já fazem.
5. **Zero numeração 01 a 0n.** A ordem, quando importa, vive no `<ol>` para o leitor de tela e na
   leitura de cima para baixo para todo mundo.
6. **Zero ícone em círculo.** Nenhum `rounded-full bg-berry-50` ou `bg-white/10` com um lucide
   dentro. Ícones permitidos, sempre inline e a serviço do texto: `Check` em lista de itens
   incluídos, `X` em lista de não incluídos, `Plus` do acordeão, `Mail` e `MessageCircle` ao
   lado de um link, `Loader2` no envio.
7. **Zero mini interface falsa.** Saem o portal com abas, o campo de número do cartão, a grade de
   horários, os chips de lembrete, a moldura de vídeo com "Conectado" e o carimbo "Assinado
   digitalmente". O único objeto de produto que fica é o Cartão Moorah, porque ele existe.
8. **Zero circuito fora do hero.** A Trilha da Amora pertence ao hero (decisão do time do hero se
   fica lá). Saem: a trilha de convergência do Manifesto, o cluster mini de Especialidades, a rede
   de exames de Benefícios, a hairline com três pontos de Lojas, a trilha pontilhada de Como
   funciona, os "nós de pessoas" dos cards de plano e o outline de Contato. O componente
   `trail-cluster.tsx` não é editado; apenas deixa de ser importado fora do hero.
9. **Sem carrossel, sem marquee, sem cometa.** No máximo um movimento de entrada por seção, com
   sentido, e o resto parado; zero também vale (Planos e Dúvidas entram estáticas). Interação
   (acordeão, troca de titular, tilt) não conta como entrada, mas nenhum elemento além do cartão
   tem entrada e interação ao mesmo tempo, e no cartão o tilt só começa depois que a entrada
   termina. Nada que carregue conversão (preço, botão) entra com `opacity: 0` no HTML do servidor.
10. **Variar o ritmo.** Densidade, alinhamento e superfície mudam de uma seção para a outra (tabela
    na seção 2). Nenhuma seção repete a composição da vizinha (lado da foto, número de colunas,
    presença de objeto, alinhamento). O par "h3 + parágrafo" pode se repetir, porque é a forma
    mínima de texto, não um esqueleto de template; o que não pode se repetir é o ornamento em volta.
11. **No máximo um eyebrow por seção, e só em três seções.** O utilitário `eyebrow` (Plus Jakarta
    700, 12 px, caixa alta) fica em Por que, Benefícios e Planos. As demais abrem direto no h2. A
    regra vale pela aparência, não pela classe: nenhum outro texto da página em caixa alta com
    tracking largo e peso 700 (nome de plano, rótulo de painel, legenda). O único rótulo em caixa
    alta fora do eyebrow é "Nº do cartão", em 11 px, sobre o cartão.
12. **Títulos com cadência variada.** Nem todo h2 termina em ponto final; nem todo h2 é frase.
    Tracking volta ao padrão do base CSS (-0.02em): sai o `tracking-tight` adicional.
13. **Separação por respiro, não por linha.** O cliente lê traço horizontal como travessão, e
    para ele não importa se a linha é "estrutural". Listas se separam com `space-y-*`; painéis se
    separam com margem. A única hairline fora do hero é a do acordeão de Dúvidas (`border-b` do
    `AccordionItem`, em `ui/`), porque ali a linha demarca o alvo clicável. Traço curto, hairline
    que se desenha, linha com pontos, régua vertical, `border-t` de painel: nada disso volta.
14. **Fundo plum onde já existe fica.** Dois blocos plum inseridos (Benefícios fundido com Cartão
    e Contato), com margem e `rounded-3xl`, como hoje. Nenhum bloco plum novo.
15. **Preço só de `plans[]`**, com `formatBRL`, na mesma família do texto, em 700. Familiar
    R$ 129,90 para até 4 pessoas; Individual R$ 49,90. Valor por pessoa só o do Familiar cheio
    (R$ 32,48), nunca valores intermediários.
16. **Avisos regulatórios fora do corpo.** Nenhuma menção a 192, SAMU, LGPD, ANS ou "não é plano
    de saúde" nas seções. Isso vive nos documentos legais e nos links do header e do footer.

## 2. Ritmo da página depois desta rodada

| Ordem | Seção | id | Superfície | Alinhamento | Eyebrow | Foto | Densidade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero (outro time) | `inicio` | plum | (v3) | (v3) | (v3) | (v3) |
| 2 | Por que + Manifesto | `por-que` | soft | texto à esquerda, foto à direita | sim | 1 grande (4:5) | texto + lista + frase |
| 3 | Como funciona | `como-funciona` | light | foto à esquerda, lista à direita | não | 1 grande (4:5) | lista vertical |
| 4 | Especialidades | `especialidades` | soft | título à esquerda, índice tipográfico | não | nenhuma | 12 nomes em 2 colunas, tipo grande |
| 5 | Cartão + Benefícios (fundidos) | `beneficios` | plum | texto à esquerda, cartão à direita | sim | nenhuma (objeto real) | lista + objeto |
| 6 | Planos | `planos` | soft | centrado | sim | nenhuma | dois cards + painel |
| 7 | Dúvidas | `duvidas` | light | coluna única estreita | não | nenhuma | acordeão |
| 8 | Contato | `contato` | plum | texto à esquerda, formulário à direita | não | nenhuma | formulário |
| 9 | Footer | - | light | quatro colunas | não | nenhuma | links |

Saem da página: **Diferenciais** (removida) e **Benefícios em bento** (fundida ao Cartão). A ordem
das âncoras do header (`nav` em `site.ts`: como-funciona, especialidades, beneficios, planos,
duvidas) não muda.

## 3. Decisões sobre remoção e fusão

### 3.1 Diferenciais: removida

A pesquisa (6.9) chama de "a seção mais template da página" e está certa: quatro colunas com traço
no topo, número, ícone em círculo e títulos que qualquer telemedicina do país escreveria. Sem um
fato por item (número, nome, contrato) não há o que diferenciar, e "Rede em crescimento" confessa
que a rede ainda não existe. Manter a seção "mais limpa" não resolve: o problema é a ausência de
prova, não o layout.

O que sobrevive, realocado:

- "Atendimento humano" (a melhor linha: "Médicos de verdade, por videochamada. A tecnologia
  organiza; quem cuida é gente.") vira o texto do passo 3 de Como funciona.
- "Experiência simples" já é o título de Como funciona ("Agendou, foi lembrado, consultou.").
- "Tecnologia própria" está coberta pela pergunta "Posso usar em mais de um aparelho?" (funciona no
  navegador, sem instalar nada). Se o cliente quiser afirmar "plataforma própria", entra como
  pergunta no FAQ depois de confirmado.
- "Rede em crescimento" sai sem substituto até haver nome de parceiro com contrato.

Consequências: `src/components/sections/diferenciais.tsx` e `diferenciais.test.tsx` removidos;
`tests/e2e/diferenciais.spec.ts` removido; `differentiators` e `differentiatorsSection` saem de
`site.ts` e de `site.test.ts`; `page.tsx` deixa de importar `Diferenciais`; `page.test.tsx` deixa
de esperar `"diferenciais"` entre as dinâmicas.

### 3.2 Benefícios e Cartão: fundidas em um só bloco plum, id `beneficios`

Benefícios (6.7) é a seção com mais sinais acumulados: bento, cinco cards numerados, três mini
interfaces, diagrama sobre foto, chip sobre foto, linha com pontos, ícones em círculo. Os títulos
são bons ("Descontos em farmácias", "Exames com desconto", "Lojas e serviços parceiros", "Portal do
paciente"); as provas visuais são inventadas. Cartão (6.6) é a seção mais "de marca" da página, com
um objeto real. A fusão dá aos benefícios o objeto que eles não tinham (o cartão é a chave da
rede) e tira do cartão o vazio da coluna esquerda (hoje quatro checks e uma nota).

Regras da fusão:

- O bloco fica com `id="beneficios"` (contrato de `landing.spec.ts` e âncora do header). O id
  `cartao` deixa de existir; `tests/e2e/cartao.spec.ts` é absorvido por `beneficios.spec.ts`.
- O h2 é `cardSection.title` ("Um número. Todos os benefícios."), que contém a palavra do link de
  navegação.
- "Segurança de verdade" sai da lista de benefícios (é uma afirmação técnica, não uma vantagem
  de uso) e vira pergunta no FAQ, com resposta que remete à Política de privacidade.
- "Cartão Moorah" (benefits[0]) deixa de ser item de lista e vira o parágrafo de abertura do bloco.
- A lista final tem quatro itens: Farmácias, Exames, Lojas e serviços parceiros, Portal do paciente.

Consequências: `cartao.tsx`, `cartao.test.tsx`, `portal-mock.tsx`, `portal-mock.test.tsx`,
`pharmacy-mock.tsx`, `pharmacy-mock.test.tsx`, `exams-network.tsx`, `exams-network.test.tsx`
removidos; `beneficios.tsx` reescrito como casca server do bloco fundido; `card-stage.tsx`
simplificado (só a coluna do cartão); `page.tsx` deixa de importar `Cartao`.

### 3.3 O que fica como seção própria e por quê

- **Por que + Manifesto** fica, porque a copy das três dores é a melhor da página e o manifesto é a
  única frase de posicionamento; o que sai é o diagrama.
- **Como funciona** fica, porque "como funciona" é a segunda pergunta de quem chega; o que sai é o
  formato (cards com mini UI) em favor de lista vertical, como Kry.
- **Especialidades** fica, porque sustenta a promessa comercial; o que sai é a foto de banco com
  card por cima e a numeração.
- **Planos, Dúvidas, Contato e Footer** ficam, com cortes.

## 4. Seção por seção

Convenções: classes Tailwind v4 do projeto (tokens `berry-*`, `leaf-*`, `gray-*`, `ink`,
`font-display`, `font-sans`, `rounded-3xl`, `shadow-card|float|deep`, `ease-out-expo`); `Section`
e `SectionHeading` de `src/components/ui`; `Reveal*` de `src/components/ui/reveal.tsx`; imports de
motion só `m`, `useInView`, `useReducedMotion` (nunca `motion.*`). "Desktop" = 1024 em diante
(`lg:`), "mobile" = 360 a 767.

### 4.1 Por que a Moorah + Manifesto (`#por-que`, soft)

Captura atual: `.shots/limpeza/desktop-por-que.png`. Título à esquerda, foto pequena (320 px) do
tablet na cama com legenda "CONSULTA EM CASA" sobre a foto, lista 01 a 03 com hairlines, manifesto
centrado e diagrama de cinco linhas convergindo para um nó plum.

**Fica:** o eyebrow "Por que a Moorah existe", o h2 "Cuidar da saúde não devia ser tão difícil.",
as três dores como `<ol>` com h3, a frase "Chega de mil soluções separadas." como h3 e o parágrafo
do manifesto.

**Sai:** a foto do tablet (`pacienteCama`, terceiro "médico na tela" da página), a legenda sobre a
foto, os índices 01 a 03, as hairlines entre itens, o eyebrow "Tudo em um lugar" (segundo eyebrow
da seção), a trilha de convergência inteira (`convergence-trail.tsx`) com rótulos e hub.

**Muda:** a foto vira a peça grande da seção (uma pessoa em casa, sem médico), a lista vira texto
puro com respiro, e o manifesto vira uma declaração tipográfica em duas colunas abaixo do grid.

Layout desktop:

```
<Section id="por-que" surface="soft" aria-labelledby="por-que-titulo">
  <div class="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:items-start">
    <div class="lg:col-span-6">
      <SectionHeading id eyebrow={problemsSection.eyebrow} title={problemsSection.title} />
      <ol class="mt-12 space-y-9 lg:mt-14">
        <li>
          <h3 class="font-display text-xl font-semibold leading-snug text-gray-900 lg:text-[1.375rem]">Planos pesam no bolso</h3>
          <p class="mt-2 max-w-[30rem] text-base leading-relaxed text-gray-600">Mensalidades altas...</p>
        </li>
        ... (3 itens, sem índice, sem borda)
      </ol>
    </div>
    <figure class="lg:col-span-6">
      <Reveal variant="fade" duration={700} amount={0.3}>
        <div class="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-black/5">
          <Image src={photos.pessoaCasa.src} ... sizes="(min-width: 1024px) 560px, 92vw" class="h-full w-full object-cover object-[50%_35%]" />
        </div>
      </Reveal>
    </figure>
  </div>

  <div class="mt-24 grid gap-6 lg:mt-28 lg:grid-cols-12 lg:gap-x-16 lg:items-end">
    <h3 class="font-display text-3xl font-semibold leading-[1.1] text-gray-900 sm:text-4xl lg:col-span-7 lg:text-[2.75rem]">Chega de mil soluções separadas.</h3>
    <p class="text-lg leading-relaxed text-gray-600 lg:col-span-5 sm:text-xl">Consulta, receita, exame, farmácia e histórico...</p>
  </div>
</Section>
```

Layout mobile (360): eyebrow, h2, foto (`aspect-[4/5]`, largura total do container), lista das
três dores, h3 do manifesto, parágrafo. O grid de cima tem três filhos, nesta ordem no DOM:
heading (`lg:col-span-6`), figura (`lg:col-span-6 lg:row-span-2`), lista (`lg:col-span-6
lg:col-start-1`). Sem `order`: em 360 o DOM já é a ordem visual (título, pessoa, dores); em `lg`
a figura ocupa as duas linhas da direita e heading e lista empilham na esquerda. O código de
exemplo acima mostra heading e lista dentro do mesmo `div` só para encurtar; a forma final é a de
três filhos. Se a coluna de texto terminar acima de 60% da altura da foto em 1440, trocar
`lg:items-start` por `lg:items-center` em vez de esticar a lista.

**Copy (site.ts):** `problemsSection` e `problems` não mudam. `manifesto` reduz para
`{ title, text }`: saem `eyebrow`, `nodes`, `hub`, `svgAlt`.

**Foto:** chave nova `photos.pessoaCasa` (critério na seção 6): pessoa em casa, sem celular, sem
tablet, sem notebook na cena. O motivo "pessoa olhando um aparelho" já está no hero (`heroCasa`)
e em Como funciona (`idosoTablet`); uma terceira seguida seria o anti-padrão 5 da pesquisa. Nada
por cima. Sem legenda. Se a fase 0 não achar foto que atenda ao critério, o pacote A começa com
`heroMaeFilha` (mãe e filha abraçadas no sofá; o celular é secundário no quadro) e a troca fica
registrada como pendência, desde que o hero v4 não use essa chave (a fase 0 pergunta ao outro time).

**Motion:** um: fade da foto (700 ms, `ease-out-expo`) ao entrar em vista. Texto e lista estáticos
(nenhum `m.*` envolve texto nesta seção). Reduced motion: `MotionConfig` já entrega o estado final.

**Acessibilidade:** `aria-labelledby` no h2; `<ol>` numera para leitor de tela; `alt` do manifesto
de fotos; h3 do manifesto depois do `<ol>` mantém a hierarquia h2 > h3.

**Arquivos:** editar `por-que.tsx`, `por-que.test.tsx`, `tests/e2e/por-que.spec.ts`; remover
`convergence-trail.tsx`, `convergence-trail.test.tsx`.

**Testes a ajustar:** `por-que.test.tsx` deixa de afirmar índices "01..03", `svgAlt`, rótulos dos
nós e `figcaption`; passa a afirmar h2, `<ol>` com 3 `li` e 3 h3, h3 do manifesto, `manifesto.text`,
`<img alt={photos.pessoaCasa.alt}>` com `loading="lazy"`, nenhum `svg` na seção, nenhum elemento
com texto dentro do `figure` além da `img`. `por-que.spec.ts` deixa de esperar hub aceso e
figcaption; passa a esperar a `img` visível e `#por-que svg` com contagem 0.

### 4.2 Como funciona (`#como-funciona`, light)

Captura atual: `.shots/limpeza/desktop-como-funciona.png`. Título centrado, trilha pontilhada com
quatro nós, quatro cards iguais (01 a 04, ícone em círculo, mini UI dentro).

**Fica:** o h2 "Agendou, foi lembrado, consultou.", o lead, os quatro passos com h3 dentro de um
`<ol aria-label="Passos">` (contrato de `como-funciona.spec.ts` e do teste unitário).

**Sai:** o eyebrow, a trilha horizontal e a régua vertical, os nós que acendem, o cometa, os
cards com borda, os índices 01 a 04, os ícones em círculo, as quatro ilustrações (grade de
horários, chips de lembrete, moldura de vídeo, folha com carimbo) e todos os rótulos de `mocks`
que elas usavam.

**Muda:** passa a ser foto à esquerda e lista vertical à direita, como a lista "Få hjälp idag" da
Kry (`refs/exterior/kry-mobile-v2.png`), sem ícones.

Layout desktop:

```
<Section id="como-funciona" surface="light" aria-labelledby="como-funciona-titulo"
  innerClassName="grid gap-12 lg:grid-cols-12 lg:gap-x-16 lg:items-center">
  <div class="order-2 lg:order-1 lg:col-span-5">
    <div class="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-black/5">
      <Image src={photos.idosoTablet.src} ... sizes="(min-width: 1024px) 460px, 92vw" class="h-full w-full object-cover object-[55%_45%]" />
    </div>
  </div>
  <div class="order-1 lg:order-2 lg:col-span-7">
    <SectionHeading id title={howItWorks.title} description={howItWorks.lead} />  (sem eyebrow)
    <ol aria-label="Passos" class="mt-12 space-y-9 lg:mt-14 lg:space-y-10">
      <Reveal as="li" y={16} duration={450} delay={0} amount={0.3}>
        <h3 class="font-display text-xl font-semibold leading-snug text-gray-900 lg:text-[1.375rem]">Agende online</h3>
        <p class="mt-2 max-w-[36rem] text-base leading-relaxed text-gray-600">Escolha a especialidade...</p>
      </Reveal>
      ... (4 itens; delay = índice * 0.1)
    </ol>
  </div>
</Section>
```

O `<ol>` é estático e os `li` são `Reveal as="li"` com `delay` incremental (`Reveal` já aceita
`as="li"` e `delay`), o que mantém `ol > li` válido, o contrato `ol[aria-label="Passos"]` com 4
`li` filhos diretos e a cascata. Não envolver `RevealGroup` em `<ol>`: gera `ol > div > li`
(Axe `list`, serious) e `RevealItem` fora de um pai motion não anima. Sem `border-b` entre os
passos: a separação é o respiro (princípio 13). O que diferencia os passos das dores de Por que
é a foto do outro lado, o `<ol>` rotulado e a cascata; o esqueleto de texto é o mesmo de
propósito, porque os dois são "h3 + parágrafo", a forma mais simples que existe.

A `object-position` de `idosoTablet` precisa manter o rosto do senhor e o tablet no quadro 4:5;
conferir em 1024 e 1440 (a origem é 3:2). Se a foto cortar mal, usar `aspect-[3/4]`.

Layout mobile: h2, lead, foto (`aspect-[4/3]` para cortar menos), lista. Não editar `reveal.tsx`
(arquivo compartilhado); a forma acima não precisa.

**Copy (site.ts):** `howItWorks` perde `eyebrow`. `steps[2].text` passa a "Médicos de verdade,
por videochamada, pelo link seguro da própria plataforma, no celular ou no computador." (absorve
"Atendimento humano"). Os outros textos não mudam. O campo `icon` de `steps` fica sem consumidor;
pode sair do tipo `Step` (Knip não aponta campo de objeto, mas dado morto confunde).

**Foto:** `photos.idosoTablet` (já existe; libera-se com o fim do bento). Médico só dentro do
tablet, pessoa em casa: é a cena certa para "como funciona".

**Motion:** um: cascata dos quatro passos (`stagger 0.1`, `y 16`, 450 ms). Foto estática.

**Acessibilidade:** `<ol>` rotulado "Passos"; h3 por passo; `alt` da foto; nenhum `aria-hidden`
com texto informativo.

**Arquivos:** editar `como-funciona.tsx`, `como-funciona.test.tsx`, `tests/e2e/como-funciona.spec.ts`;
remover `steps-trail.tsx`, `steps-trail.test.tsx`.

**Testes a ajustar:** unitário deixa de esperar "01..04" visíveis, `[data-illustration]`,
`mocks.reminderChips`, `slotConfirmed`, `connected`, `signed`, `[data-lit]` e a foto
`medicoVideo`; passa a esperar `ol[aria-label="Passos"]` com 4 `li` e 4 h3 na ordem de `steps`,
`img alt={photos.idosoTablet.alt}` lazy, nenhum `[data-track]`, nenhum `[data-comet]`. E2E: 4 h3
no `#como-funciona`, foto visível no desktop, `[data-comet]` e `[data-lit]` com contagem 0.

### 4.3 Especialidades (`#especialidades`, soft)

Captura atual: `.shots/limpeza/desktop-especialidades.png`. Coluna sticky com título, parágrafo
sobre dependentes (texto da FAQ 3, que fala de outra coisa), foto da médica de jaleco com card
branco por cima (cluster mini + "SUA ASSINATURA MOORAH"), lista de 12 em duas colunas com ícone,
número e frase.

**Fica:** o `<ul aria-label="Especialidades disponíveis">` com 12 `li` e um h3 por especialidade
(contrato de `especialidades.spec.ts`: 12 `li`), as frases por especialidade (a melhor microcopy
da página: "Para os pequenos, a qualquer hora", "Cuidado atento para quem tem mais história").

**Sai:** a foto da médica (`medicaSorrindo`, anti-padrão 5), o card branco sobre a foto (veto
número um do cliente), o cluster mini e os cometas, o hover que acende nó, os ícones em círculo,
os índices 01 a 12, a borda inferior por item com hover em card, o eyebrow, o parágrafo sobre
dependentes, a coluna sticky.

**Muda:** vira índice tipográfico em duas colunas, com o nome grande e a frase logo abaixo em
corpo normal, como índice de revista. Sem foto de propósito: depois de duas fotos grandes, a
página muda de densidade (padrão Alice e Mira: hero com gente, depois bloco de texto). Não são
"12 células iguais" porque não há célula: não há borda, fundo, ícone ou número; o que o olho vê é
uma coluna de títulos com escala, e a leitura é a de um sumário, não a de uma grade de cards.

Layout desktop:

```
<Section id="especialidades" surface="soft" aria-labelledby="especialidades-titulo"
  innerClassName="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
  <div class="lg:col-span-4">
    <SectionHeading id title={specialtiesSection.title} description={specialtiesSection.lead} />  (sem eyebrow)
  </div>
  <RevealGroup as="div" stagger={0.04} amount={0.15} class="lg:col-span-8">
    <ul aria-label="Especialidades disponíveis" class="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:gap-y-10">
      <li>  (RevealItem as="li" y={12} duration={400})
        <h3 class="font-display text-xl font-semibold leading-snug text-gray-900 [hyphens:auto] lg:text-2xl">Clínico geral</h3>
        <p class="mt-1.5 text-base leading-relaxed text-gray-600">Primeira porta para qualquer sintoma.</p>
      </li>
      ... (12 itens, 6 por coluna)
    </ul>
  </RevealGroup>
</Section>
```

Em duas colunas de 8/12 a coluna tem cerca de 300 px em 1024 e 380 px em 1440;
"Otorrinolaringologia" em `text-2xl` (24 px) ocupa cerca de 265 px e cabe em uma linha nas duas
larguras. `[hyphens:auto]` fica como rede (o `<html lang="pt-BR">` já existe), mas o critério é
medir: se em 1024 a palavra quebrar, usar `lg:text-xl xl:text-2xl`. `RevealGroup` como `div`
envolvendo o `<ul>` é válido (`div > ul > li`) e os `RevealItem as="li"` herdam a cascata pela
árvore React, não pelo DOM.

Layout mobile: h2, lead, lista em uma coluna (`grid-cols-1`) até 639, duas colunas de 640 em
diante.

**Copy (site.ts):** `specialtiesSection` perde `eyebrow`, ganha `lead: "Consultas ilimitadas em
qualquer especialidade disponível na plataforma, sem custo adicional por consulta."` (mesma
afirmação de `faq[1].a`; não inventa nada nem sugere que há mais do que a lista mostra). Título
muda para `"Qualquer especialidade, quantas vezes precisar"` (sem ponto, seis
palavras, repete a promessa comercial em vez de nomear duas pontas de uma lista provisória). Não
nomear Psicologia nem Nutrição no título: não são especialidades médicas (CFM), e o hero fala de
"um médico por vídeo"; a pergunta 1 da seção 9 pede a lista real e a separação entre médicos e
outros profissionais. `specialties[].icon` fica sem consumidor.

**Foto:** nenhuma.

**Motion:** um: cascata rápida dos 12 nomes (`stagger 0.04`, total abaixo de 1 s).

**Acessibilidade:** lista rotulada; h3 por item; nada interativo (sem hover com estado).

**Arquivos:** editar `especialidades.tsx`, `especialidades.test.tsx`, `tests/e2e/especialidades.spec.ts`;
remover `specialties-index.tsx`, `specialties-index.test.tsx`.

**Testes a ajustar:** unitário deixa de esperar `bg-gray-50`? Não: a superfície continua soft.
Deixa de esperar eyebrow, `faq[2].a`, `[data-trail-cluster]`, `[data-specialty]`, hover e a foto;
passa a esperar h2 com o novo título, `specialtiesSection.lead`, 12 `li` com h3 na ordem de
`specialties`, 12 blurbs, nenhum `svg`, nenhuma `img`, nenhum botão ou link na lista. E2E: 12 `li`,
`#especialidades img` com contagem 0, `[data-comet]` 0.

### 4.4 Cartão + Benefícios (`#beneficios`, plum)

Capturas atuais: `.shots/limpeza/desktop-cartao.png` e `desktop-beneficios.png`.

**Fica:** o bloco plum com margem, o eyebrow "Cartão Moorah" (`text-berry-300`), o h2 "Um número.
Todos os benefícios.", o parágrafo do cartão (numeração exclusiva, chave para a rede), o
`SegmentedControl` Titular / Dependente 1 a 3 (é ferramenta, não decoração), o cartão
(`/brand/cartao-moorah.webp`) com o número ilustrativo, a entrada do cartão (sobe e desdobra) e o
tilt com ponteiro fino, a nota "Um Cartão Moorah para cada pessoa" (`plans[1].features[1]`).

**Sai:** o `BrandLockup` dentro do bloco (a wordmark já está no header), os quatro checks de
usos, os "usos que acendem", todo o bento de Benefícios (fotos, mocks, ícones em círculo, índices,
hairline com pontos, chips de segurança), o eyebrow "Vantagens no dia a dia" e o h2 "Uma rede que
acompanha a sua família.".

**Muda:** os benefícios entram como lista de quatro itens tipográficos ao lado do cartão.

Layout desktop:

```
<Section id="beneficios" surface="plum" aria-labelledby="beneficios-titulo"
  innerClassName="grid gap-y-12 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:items-start">
  <div class="lg:col-span-5">
    <SectionHeading id tone="plum" eyebrow={cardSection.eyebrow} title={cardSection.title} description={cardSection.lead} />
  </div>
  <CardStage class="lg:col-span-7 lg:row-span-2 lg:self-center" />
  <ul class="space-y-7 lg:col-span-5">
    <li>
      <h3 class="font-display text-lg font-semibold leading-snug text-white">Descontos em farmácias</h3>
      <p class="mt-1 text-[15px] leading-relaxed text-berry-100">Medicamentos com desconto na rede parceira. Basta informar o número do cartão no balcão.</p>
    </li>
    ... (Farmácias, Exames, Lojas e serviços parceiros, Portal do paciente; sem borda entre itens)
  </ul>
</Section>
```

`CardStage` (coluna direita) passa a devolver só: `SegmentedControl tone="plum" size="lg"`, o
cartão (`max-w-[560px]`, `rounded-xl shadow-deep`, halo radial atrás como hoje), o número em
`font-display text-xl font-semibold tabular-nums lg:text-[1.625rem]` sobre a faixa lisa do cartão
(o cartão é objeto da marca, não foto: texto sobre ele é permitido, como hoje) e a nota
`text-sm text-berry-200` centrada abaixo. O contêiner do cartão ganha `data-card-stage` (exceção
declarada do critério de aceite 4). Props: `className`, `note`. Saem as props `heading` e `uses`.

Com a saída de `uses`, a máquina de ticks precisa ser reescrita, não só podada: hoje `entryRun`
calcula `end` a partir de `useCount` e `countLit` conta usos acesos. Passa a ser `entryRun = {
settle: (i) => 6 + i, end: 6 + (DIGIT_COUNT - 1) }` (o intervalo para no tick em que o último
dígito assenta), `SWITCH_RUN` fica como está, e somem `lightFrom`, `countLit`, `usesLit` e o
`useEffect` que dependia de `uses.length`. Teste unitário obrigatório: com fake timers, depois de
`end` ticks os `[data-digit]` mostram `mocks.cardSamples[0]` e `run` voltou a `null` (o intervalo
não vaza); sob `useReducedMotion` os dígitos finais aparecem sem nenhum tick.

`SegmentedControl` em 360: quatro opções em `flex-1 px-5 text-base` somam mais que 330 px, e o
`overflow-x-auto` atual esconde isso do usuário de teclado e faz `check-overflow.cjs` listar as
opções como vazando. Sem editar `ui/`: `CardStage` passa `className="grid grid-cols-2 gap-1
rounded-2xl sm:inline-flex sm:rounded-full"` ao controle (`cn` usa `tailwind-merge`, então
`grid` vence `inline-flex` e `rounded-2xl` vence `rounded-full` no mobile) e remove o wrapper com
`overflow-x-auto` e `min-w-max`. Resultado: 2x2 em 360 a 639, linha única de 640 em diante.
Foco visível sobre plum: as opções já herdam o `focus-visible` global; conferir no checklist que
o anel aparece sobre `bg-white/10` (se não aparecer, `className` do controle recebe
`[&_button]:focus-visible:ring-white/70`).

Ordem no mobile (grid de uma coluna): heading, cartão com seletor, lista. Esse é o motivo dos três
filhos separados no grid: em `lg` o cartão ocupa as duas linhas da direita e heading + lista
empilham à esquerda.

**Copy (site.ts):** na fase 0 `cardSection` ganha `lead` (o texto atual de `benefits[0].text`) e
`benefits: readonly { title, text }[]` com quatro itens (Farmácias, Exames, Lojas e serviços
parceiros, Portal do paciente), nesta ordem, sem `icon`. O bloco lê `cardSection.benefits`; o
array antigo `benefits` (seis itens com `icon`), `benefitsSection`, `cardSection.uses` e o resto
de `mocks` continuam existindo até a integração final, que os remove quando nenhum componente
mais os consome (seção 5).

**Foto:** nenhuma. O cartão é o objeto.

**Motion:** a entrada da seção é o cartão: sobe e desdobra (y 40 para 0, rotateX 12 para 0,
800 ms) enquanto os dígitos assentam (o `setInterval` único de 60 ms já existente); são duas
fases do mesmo gesto, e nada mais na seção entra animado (heading e lista estáticos). Interações:
troca de titular reassenta os dígitos; tilt só com `(hover: hover) and (pointer: fine)` e só
depois que a entrada terminou (`onPointerEnter` ignorado enquanto `run` não for `null`). Sai a
coreografia de "usos acendem". Reduced motion: cartão plano, dígitos finais, sem tilt. Intervalo
pausa com `document.hidden` e limpa no unmount (já é assim).

**Acessibilidade:** `radiogroup` com roving tabindex (já é); número como `role="img"` com
`aria-label` (`cardSection.sampleAria`) e sem `aria-live` (a troca de titular não anuncia nada:
quem trocou já sabe o que mudou, e o `aria-label` atualizado é lido ao focar o número); h3 por
benefício. Contraste: não afirmar número; medir `berry-100` e `berry-200` sobre o ponto mais
claro do gradiente do bloco plum com o inspetor e exigir 4,5:1 para texto abaixo de 24 px.

**Arquivos:** reescrever `beneficios.tsx` e `beneficios.test.tsx`; editar `card-stage.tsx`,
`card-stage.test.tsx`; remover `cartao.tsx`, `cartao.test.tsx`, `portal-mock.tsx`,
`portal-mock.test.tsx`, `pharmacy-mock.tsx`, `pharmacy-mock.test.tsx`, `exams-network.tsx`,
`exams-network.test.tsx`; reescrever `tests/e2e/beneficios.spec.ts` absorvendo os casos de
`tests/e2e/cartao.spec.ts` (que é removido).

**Testes a ajustar:** unitário de Benefícios passa a afirmar: `section#beneficios` com o wrapper
`rounded-3xl text-white`, h2 = `cardSection.title` com `aria-labelledby`, eyebrow com
`text-berry-300`, `cardSection.lead`, 4 h3 na ordem de `benefits`, `radiogroup` nomeado por
`cardSection.holderLabel` (via `findByRole`, o palco entra por `next/dynamic`), `img alt=
{cardSection.imageAlt}`, nenhum `[data-brand-lockup]` na seção, nenhum `[role=tablist]`, nenhum
`svg`. E2E: `/#beneficios` mostra o cartão; trocar para "Dependente 2" muda o `aria-label` de
`[data-card-number]` para `mocks.cardSamples[2]` agrupado; `#beneficios [data-comet]` 0;
`#beneficios [role=tablist]` 0; nenhum `[data-brand-lockup]`; em 360 nenhuma opção do
`radiogroup` com `getBoundingClientRect().right` maior que `clientWidth`; e um caso com
`reducedMotion: "reduce"` no contexto do Playwright em que `[data-digit]` já mostra
`mocks.cardSamples[0]` no primeiro quadro e o cartão tem `opacity: 1` sem esperar (armadilha
documentada no CLAUDE.md: não afirmar quadro inicial de coisa que se move).

### 4.5 Planos (`#planos`, soft)

Captura atual: `.shots/limpeza/desktop-planos.png`. Título à esquerda, foto da família posando
com chip "R$ 32,48 por pessoa no Familiar" por cima, seletor "Para quantas pessoas? 1 2 3 4", dois
cards (Individual claro, Familiar plum com badge "Mais escolhido" e quatro pontos de "pessoas"),
nota com link, painel Incluído / Não está incluído.

**Fica:** o eyebrow "Planos", os dois cards com preço grande em Plus Jakarta 700, "equivale a
R$ 32,48 por pessoa" no Familiar, a lista de `features` com `Check` em leaf, os `LeadDialogButton`
("Assinar Individual", "Assinar Familiar"), a nota `planNotes[0]` com o link "Entenda a diferença"
para `#duvidas`, o painel Incluído / Não está incluído.

**Sai:** a foto da família e o chip sobre ela (veto e anti-padrão 1), o seletor de pessoas (gera
R$ 64,95 e R$ 43,30, valores que não são oferta e que a pendência do projeto já marcava como
duvidosos), o contador com spring, os pontos de pessoas (`PeopleNodes`, circuito em miniatura), o
badge "Mais escolhido" (prova inventada), o estado ativo/inativo dos cards e o `lg:scale-[1.02]`
do Familiar, o item "Cobertura de plano de saúde" do painel (é o aviso regulatório disfarçado de
bullet; ver pergunta 3 da seção 9).

**Muda:** heading centrado (única seção centrada da página, para variar o ritmo), dois cards
brancos e estáticos lado a lado, o Familiar destacado por anel berry e escala do preço (não por
fundo escuro: entre o bloco plum de Benefícios e o bloco plum de Contato, um card em `bg-ink`
faria plum, soft com card escuro, plum; Mira, Function e Superpower destacam o plano recomendado
sem fundo escuro), nome do plano em caixa normal, painel sem caixa e sem linha.

Layout desktop:

```
<Section id="planos" surface="soft" aria-labelledby="planos-titulo">
  <SectionHeading id align="center" eyebrow={plansSection.eyebrow} title={plansSection.title} description={plansSection.lead} />
  <div class="mx-auto mt-12 grid max-w-[960px] gap-6 lg:grid-cols-2 lg:items-stretch">
    <article aria-labelledby="plano-individual-nome" data-plan="individual"
      class="flex flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-card lg:p-10">
      <h3 id class="font-display text-2xl font-semibold leading-tight text-gray-900">Individual</h3>
      <p class="mt-3 text-base leading-relaxed text-gray-600">Para quem quer resolver a própria saúde sem fila e sem espera.</p>
      <p class="mt-6 flex items-end gap-1">
        <span class="font-display text-5xl font-bold leading-none tabular-nums text-gray-900">R$ 49,90</span>
        <span class="pb-1 text-base text-gray-600">/mês</span>
      </p>
      <p class="mt-2 text-sm text-gray-600">1 pessoa</p>
      <ul class="mt-8 flex-1 space-y-3"> <li class="flex gap-3 text-[15px] leading-snug text-gray-700"><Check size={18} class="mt-0.5 shrink-0 text-leaf-500"/>...</li> </ul>
      <LeadDialogButton plan="individual" size="lg" fullWidth class="mt-8" variant="secondary" />
    </article>
    <article aria-labelledby="plano-familiar-nome" data-plan="familiar"
      class="flex flex-col rounded-3xl bg-white p-8 shadow-deep ring-2 ring-berry-600 lg:p-10">
      <h3 id class="font-display text-2xl font-semibold leading-tight text-gray-900">Familiar</h3>
      <p class="mt-3 text-base leading-relaxed text-gray-600">Tudo do Individual, para cada pessoa da família.</p>
      <p class="mt-6 flex items-end gap-1"><span class="font-display text-5xl font-bold leading-none tabular-nums text-gray-900 lg:text-[3.75rem]">R$ 129,90</span><span class="pb-1 text-base text-gray-600">/mês</span></p>
      <p class="mt-2 font-display text-sm text-gray-600 tabular-nums">equivale a <span class="font-semibold text-gray-900">R$ 32,48</span> por pessoa</p>
      <p class="mt-1 text-sm text-gray-600">até 4 pessoas: titular + 3 dependentes</p>
      <ul> ... Check text-leaf-500 ... </ul>
      <LeadDialogButton plan="familiar" size="lg" fullWidth class="mt-8" variant="primary" />
      <p class="mt-3 text-center text-xs text-gray-600">O Familiar cobre até 4 pessoas pelo mesmo valor.</p>
    </article>
  </div>
  <p class="mt-8 text-center text-sm text-gray-600">{planNotes[0]} <a href="#duvidas" class="ml-1 font-semibold text-berry-700 underline underline-offset-4">Entenda a diferença</a></p>
  <div class="mx-auto mt-20 grid max-w-[960px] gap-10 md:grid-cols-2">
    <div><h3 id="planos-incluido" class="font-display text-lg font-semibold text-gray-900">Incluído na assinatura</h3><ul aria-labelledby class="mt-4 space-y-2.5">...Check leaf-500...</ul></div>
    <div><h3 id="planos-nao-incluido" ...>Não está incluído</h3><ul ...>...X gray-400...</ul></div>
  </div>
</Section>
```

Ordem dos cards: Individual à esquerda, Familiar à direita no desktop; no mobile o Familiar vem
primeiro (`order-first lg:order-last`, como hoje). O valor por pessoa é estático:
`formatBRL(perPersonCents(getPlan("familiar")))`, renderizado no servidor. Os cards não usam
`m.*`: preço e botão são o elemento de conversão e nunca podem chegar ao navegador com
`opacity: 0` inline à espera de hidratação. O destaque do Familiar (`Plan.highlight`) é o anel,
o preço 4 px maior e o botão `primary`; o Individual usa `secondary`.

Layout mobile: heading centrado, Familiar, Individual, nota, painel em uma coluna.

**Copy (site.ts):** na fase 0 `plansSection.title` vira `"Um plano para você ou para toda a
família"` (sem ponto) e `plansSection.lead` vira `"Assinatura mensal, sem taxa de adesão. O mesmo
cuidado nos dois planos; muda só quantas pessoas usam."`; `notIncluded` perde "Cobertura de plano
de saúde" e "Pronto-socorro e emergências" vira "Atendimento de urgência e emergência". O pacote C
simplesmente não lê `plans[1].badge`, `peopleQuestion`, `photoChip` e `singleHint`; a integração
final remove esses campos (e o opcional `badge` de `Plan`). Ficam `perPersonLabel`, `coversOne`
(pode virar `"1 pessoa"` direto de `plans[0].peopleLabel`), `familyNote`, `faqLink`,
`includedTitle`, `notIncludedTitle`, `included`, `notIncluded`.

**Foto:** nenhuma. Seções de preço das referências boas (Mira, Function, Superpower) não têm foto;
a foto de família posando era a parte fraca.

**Motion:** nenhum. Cards e painel entram estáticos; a seção de preço é a que menos precisa de
coreografia e a que mais perde se o preço demorar a aparecer.

**Acessibilidade:** `article aria-labelledby` pelo h3 do plano; preço e valor por pessoa como
texto normal (sem `aria-live`, já que nada muda); `Check` e `X` com `aria-hidden`; botões abrem
`role="dialog"` com o select em `familiar` (contrato de `landing.spec.ts`). O dialog continua com
`title={data.cta}` ("Assinar Familiar") sobre um formulário que só captura contato; é o mesmo
descompasso que a seção 4.7 corrige no card de Contato, mas vive em `ui/lead-dialog.tsx`, fora
dos pacotes. A integração final troca o título do dialog para `ui.leadForm.title` com o nome do
plano na descrição (uma linha mais `lead-dialog.test.tsx`), depois que a pergunta 7 da seção 9
fechar o texto.

**Arquivos:** editar `planos.tsx`, `planos.test.tsx`; criar `plan-cards.tsx` (server component:
os dois `article`; só `LeadDialogButton` é cliente) e `plan-cards.test.tsx`; remover
`plan-selector.tsx`, `plan-selector.test.tsx`; reescrever `tests/e2e/planos.spec.ts`.

**Testes a ajustar:** unitário de Planos deixa de esperar a foto, o chip, `data-active` e o
`radiogroup`; passa a esperar h2 com o novo título, `planNotes[0]`, link `#duvidas`, "49,90",
"129,90", "32,48", dois botões com `plans[].cta`, nenhuma `img`, nenhum `radiogroup`, nenhum
texto "Mais escolhido", nenhum h3 com `uppercase`, `article[data-plan="familiar"]` com `ring-2`
e sem `bg-ink`, 5 itens incluídos e 4 não incluídos, nenhum "192", "SAMU", "LGPD", "plano de
saúde". `plan-cards.test.tsx` trava `plans.length === 2` com mensagem explicando que o grid de
duas colunas depende disso. E2E: "49,90", "129,90" e "32,48" visíveis; `#planos img` 0; `#planos
[role=radiogroup]` 0; "Assinar Familiar" abre dialog (já coberto em `landing.spec.ts`); um caso
com `reducedMotion: "reduce"` em que os dois preços estão visíveis no primeiro quadro após
`domcontentloaded`, sem `waitFor`.

### 4.6 Dúvidas (`#duvidas`, light)

Captura atual: `.shots/limpeza/desktop-duvidas.png`. Título à esquerda em coluna sticky, card
"Ainda com dúvida?" com ícone em círculo e e-mail, acordeão em card branco com índices 01 a 06.

**Fica:** o acordeão Radix (`Accordion` de `ui/`) com uma pergunta por h3 e `aria-expanded`
(contrato de `landing.spec.ts`: primeiro `<button>` da seção é o gatilho da primeira pergunta e
começa fechado; segundo item aberto por padrão como hoje), a linha de contato por e-mail, o
WhatsApp opcional.

**Sai:** o eyebrow, a coluna lateral sticky, o card de contato com ícone em círculo, a caixa
branca em volta do acordeão, os índices 01 a 06, o `RevealGroup` por item.

**Muda:** coluna única estreita, título em primeira pessoa sem ponto ("O que perguntam antes de
assinar", em vez de "Perguntas frequentes", o título que qualquer FAQ usa), superfície light (a v1
alternava soft/light e, sem Diferenciais, dois softs ficariam vizinhos).

Layout desktop e mobile (o mesmo, só muda a largura):

```
<Section id="duvidas" surface="light" aria-labelledby="duvidas-titulo">
  <div class="mx-auto max-w-3xl">
    <SectionHeading id title={faqSection.title} />   ("O que perguntam antes de assinar", sem eyebrow)
    <FaqPanel class="mt-10" />
      -> <Accordion type="single" collapsible defaultValue="faq-1" class="border-t border-gray-200">
           <AccordionItem>   (ja tem border-b border-gray-200 em ui/; a hairline do acordeao e a unica da pagina fora do hero)
             <AccordionTrigger class="min-h-11 py-5 text-lg data-[state=open]:text-berry-700">{item.q}</AccordionTrigger>
             <AccordionContent class="pr-10">
               <p class="max-w-prose text-base leading-relaxed text-gray-600">{item.a}</p>
               {item.link ? <a href={item.link.href} class="mt-3 inline-block font-semibold text-berry-700 underline underline-offset-4">{item.link.label}</a> : null}
             </AccordionContent>
           </AccordionItem>
         </Accordion>
    <p class="mt-10 text-base text-gray-600">
      {faqSection.contactTitle} <a href="mailto:..." class="font-semibold text-berry-700 underline decoration-berry-300 underline-offset-4 hover:decoration-berry-700">{site.contact.email}</a>
    </p>
    {whatsapp ? <Button variant="secondary" size="sm" asChild class="mt-4"><a ...>Falar no WhatsApp</a></Button> : null}
  </div>
</Section>
```

A linha de contato vem depois do acordeão no DOM e só tem `<a>`, então o primeiro `<button>` da
seção continua sendo o gatilho de `faq[0]`.

**Copy (site.ts):** `faqSection.title` vira `"O que perguntam antes de assinar"`; `eyebrow` fica
no objeto até a integração final e deixa de ser lido; `contactTitle` "Ainda com dúvida?" e
`contactText` ficam (o texto pode ser incorporado à frase: "Ainda com dúvida? Escreva para
comercial@moorah.com.br."). `FaqItem` ganha o campo opcional `link?: { href: string; label:
string }` e `faq` ganha um item ao fim: `q: "Meus dados de saúde estão protegidos?"`, `a: "Sim.
Os dados de saúde ficam sob sigilo médico, e a Política de privacidade descreve quem acessa o quê
e em que situações."`, `link: { href: "/privacidade", label: "Ler a Política de privacidade" }`.
Substitui "Segurança de verdade". A resposta não afirma criptografia, infraestrutura no Brasil
nem registro de auditoria: `docs/conteudo-a-confirmar.md` lista tudo isso entre as afirmações
técnicas que a engenharia ainda precisa confirmar, e sigilo médico é dever legal do profissional,
não promessa de infraestrutura. Quando a engenharia confirmar, a frase ganha o que for verdade.

**Foto:** nenhuma.

**Motion:** só o abrir e fechar do acordeão (`animate-accordion-down|up`, já existente). Nenhum
reveal de entrada.

**Acessibilidade:** Radix cuida de `aria-expanded`, `aria-controls` e teclado; h3 por pergunta;
link de e-mail com texto visível igual ao endereço.

**Arquivos:** editar `duvidas.tsx`, `duvidas.test.tsx`, `faq-panel.tsx`, `faq-panel.test.tsx`,
`tests/e2e/duvidas.spec.ts`.

**Testes a ajustar:** unitário de Dúvidas deixa de esperar `bg-gray-50` (passa a `bg-white`),
`[data-contact]` e eyebrow; passa a esperar h2 = `faqSection.title`, um botão por pergunta na
ordem de `faq`, primeiro botão fechado e segundo aberto, link `mailto:` com `font-sans`, nenhum
`.font-mono`, nenhum "01", nenhum `svg` além do `Plus` do gatilho. `faq-panel.test.tsx` deixa de
esperar numeração e passa a esperar que o item com `link` renderize um `<a href="/privacidade">`
dentro do conteúdo e que os itens sem `link` não tenham `<a>`. E2E: já cobre teclado e ausência
de 192/SAMU/LGPD; acrescentar `#duvidas [data-contact]` 0 e, no último item aberto, link visível
para `/privacidade`.

### 4.7 Contato (`#contato`, plum)

Captura atual: `.shots/limpeza/desktop-contato.png`. Bloco plum, wordmark repetida, trilhas do
circuito fantasmas atrás do título, eyebrow "Comece hoje", h2, CTA "Escolher meu plano", card
branco com o formulário e botão "Quero assinar", foto da médica de headset acenando, marca d'água
do símbolo.

**Fica:** o bloco plum, o h2 "Saúde acessível para quem importa." (tem voz), o parágrafo, o link
"Escolher meu plano" para `#planos` (contrato de `contato.spec.ts`), o WhatsApp opcional, o card
branco com `LeadForm defaultPlan="familiar"`, a marca d'água do símbolo branco sobre plum liso
(permitida pelo manual), o skeleton de cinco campos do `next/dynamic`.

**Sai:** o `TrailCluster` outline e os cometas, o `BrandLockup`, o eyebrow, a foto da médica
(banco em pose e repetida), a coluna de foto inteira, o peso de CTA primário no botão "Escolher
meu plano".

**Muda:** promessa e ação passam a bater de verdade: o card se chama "Fale com a Moorah", o
subtítulo diz o que acontece ("Deixe seu contato e a Moorah retorna por e-mail.") e o botão diz
"Enviar". "Quero assinar" não pode ser título nem botão de um formulário que só captura contato
(pesquisa 6.11); volta só quando o formulário levar à assinatura de fato. A seção passa a ter um
destino principal, o formulário: "Escolher meu plano" vira `outline-light` (secundário), porque
mandar o leitor de volta para cima com o mesmo peso do formulário ao lado eram duas ações de peso
igual em direções opostas (pesquisa 4.9). A marca d'água muda de canto.

Layout desktop:

```
<Section id="contato" surface="plum" aria-labelledby="contato-titulo"
  innerClassName="relative grid gap-12 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
  <div class="relative z-10 lg:col-span-6 lg:pr-8">
    <h2 id class="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[3.5rem]">Saúde acessível para quem importa.</h2>
    <p class="mt-6 max-w-[32rem] text-lg leading-relaxed text-berry-100 lg:text-xl">{finalCta.text}</p>
    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button variant="outline-light" size="lg" asChild><a href="#planos">Escolher meu plano</a></Button>
      {whatsapp ? <Button variant="outline-light" size="lg" asChild>...</Button> : null}
    </div>
  </div>
  <Image data-brand-watermark aria-hidden alt="" src="/brand/moorah-mark-white.png" width={194} height={265}
    class="pointer-events-none absolute -bottom-24 left-0 hidden h-[200px] w-auto select-none opacity-[0.07] xl:block" />
  <Reveal delay={0.1} duration={600} y={24} class="relative z-10 lg:col-span-5 lg:col-start-8">
    <div data-lead-card class="rounded-2xl bg-white p-6 text-gray-900 shadow-deep sm:p-8">
      <h3 class="font-display text-2xl font-semibold text-gray-900">{ui.leadForm.title}</h3>   ("Fale com a Moorah")
      <p class="mt-1 text-sm text-gray-600">{ui.leadForm.subtitle}</p>
      <LeadForm defaultPlan="familiar" class="mt-6" />
    </div>
  </Reveal>
</Section>
```

A marca d'água fica no canto inferior esquerdo, abaixo da coluna de texto (que é `self-start` e
termina antes da base do bloco, porque o formulário é mais alto). `overflow-hidden` do bloco plum
corta a sangria. Ela nunca cruza texto, botão ou card: o e2e mede. Em 1024 a folga é pequena (o
h2 em 3,5 rem numa coluna de cerca de 470 px quebra em três linhas e o WhatsApp, se configurado,
empilha um segundo botão), por isso ela começa em `xl:block` (1280+), não em `lg:block`; o
construtor mede em 1024 com WhatsApp configurado e, se sobrar mais de 60 px entre a base do texto
e o topo da marca, pode baixar para `lg:block`. Os valores `-bottom-24` e `h-[200px]` são ponto de
partida, não contrato: o contrato é a medida do e2e.

Layout mobile: h2, parágrafo, botões, card do formulário. Marca d'água oculta (`hidden lg:block`).

**Copy (site.ts):** `finalCta.eyebrow` deixa de ser lido (sai na integração final); `title` e
`text` ficam. `ui.leadForm.title` vira `"Fale com a Moorah"`, `subtitle` vira `"Deixe seu contato
e a Moorah retorna por e-mail."`, `submit` vira `"Enviar"` (o regex de `landing.spec.ts`,
`/Quero assinar|Enviar/`, continua casando). O `LeadDialogButton` dos planos usa `plan.cta` como
título do dialog e o mesmo `submit`; o título do dialog é ajustado na integração final (4.5).

**Foto:** nenhuma. Se em rodada futura houver foto própria de gente brasileira em casa, a seção
é recomposta (o grid atual, 6/12 de texto e 5/12 de formulário a partir da coluna 8, não tem
espaço para uma terceira coluna); não com Pexels.

**Motion:** um: fade-up do card do formulário (600 ms, delay 100 ms). Texto estático.

**Acessibilidade:** `aria-labelledby`; `LeadForm` já tem labels, `aria-invalid`, `role="status"`
no sucesso; marca d'água `aria-hidden` e `alt=""`; contraste de `berry-100` sobre plum.

**Arquivos:** editar `contato.tsx`, `contato.test.tsx`, `tests/e2e/contato.spec.ts`.

**Testes a ajustar:** unitário deixa de esperar `[data-trail-cluster]`, `[data-brand-lockup]`,
eyebrow e a foto; passa a esperar h2, `finalCta.text`, link `#planos` com as classes de
`outline-light` (`border-berry-300 text-white`) e `h-[52px]`, `data-lead-card` com h3 =
`ui.leadForm.title`, botão "Enviar", marca d'água com `left-0 opacity-[0.07] hidden` e a classe
de breakpoint escolhida (`xl:block` ou `lg:block`), nenhuma `img` além da marca d'água, nenhum
`svg` `data-trail-cluster`, nenhum texto "LGPD" ou "192". E2E: envio válido com rota interceptada
mostra `role="status"` "Recebemos seu pedido."; envio vazio marca Nome inválido (botão agora
"Enviar"); em 1440 `[data-brand-watermark]` fica abaixo da coluna de texto (`mark.y >= text.y +
text.height`) e à esquerda do card (`mark.x + mark.width <= card.x`); em 1024 a mesma medida se o
breakpoint for `lg`, ou a marca oculta se for `xl`; no mobile a marca d'água está oculta e não há
`img` visível na seção.

### 4.8 Footer

Captura atual: `.shots/limpeza/desktop-footer.png`. A pesquisa (6.12) o chama de "footer de um
site de gente". Fica como está: lockup vertical, descrição, três colunas, linha inferior com
crédito das fotos e razão social, marca d'água plum a 4%.

Único ajuste, opcional e de uma linha: o ponto berry antes de "Fotografias ilustrativas (Pexels)"
pode sair (ornamento sem função). Se sair, `footer.test.tsx` não afirma o ponto; nada quebra.
Nenhum outro arquivo do footer muda. Os contratos de `footer.spec.ts` (link `/lgpd`, crédito das
fotos visível, lockup vertical, sem rolagem horizontal, barra mobile some com o footer em vista)
continuam.

### 4.9 Barra de CTA mobile

`mobile-cta-bar.tsx` fica como está: dois preços de `plans[]` em Manrope, botão "Ver planos" para
`#planos`, WhatsApp opcional, oculta enquanto `#inicio`, `#planos`, `#contato` ou `footer` estão
em vista. A fusão de Cartão e Benefícios não afeta os seletores observados. Verificar em 360 que
a barra não cobre o botão "Assinar Familiar" quando `#planos` está parcialmente visível (o
`threshold: 0.05` já desmonta a barra com 5% da seção em vista), que o último item da lista de
Benefícios (fim do bloco plum, logo antes de `#planos`) fica legível acima da barra durante a
rolagem (a barra é branca sobre plum; se cobrir o texto, o bloco ganha `pb-24` só em mobile) e
que o botão "Enviar" do formulário não fica sob a barra enquanto `#contato` tem menos de 5% em
vista.

## 5. Fase 0: `src/content/site.ts` e arquivos compartilhados (uma pessoa, antes dos pacotes)

A fase 0 é um único PR (`refactor(content): copy e dados das seções v4`) que precisa fechar com
`npm run check` verde e a página atual ainda renderizando. Por isso ela só **acrescenta e
renomeia**: nenhum campo que um componente ainda consome sai de `site.ts` aqui. Os componentes
antigos continuam compilando contra os campos antigos até os pacotes A a D deixarem de lê-los, e a
**integração final** faz a limpeza em um commit com lista fechada (seção 7). A primeira versão
deste brief removia os campos na fase 0 e deixava `main` com `tsc` quebrado até o último PR; a
crítica apontou e estava certa.

Depois da fase 0 ninguém mais edita `site.ts` até a integração final; se um pacote precisar de
texto novo, registra pendência no PR em vez de editar.

Regras: nenhum texto com travessão; nada de 192, SAMU, LGPD, ANS ou "plano de saúde" nos objetos
das seções; `hero`, `heroDynamic`, `nav`, `legalLinks`, `plans[].priceCents`, `photos`
existentes e `IconKey` não mudam (território do hero ou contrato).

### 5.1 Mudanças em `site.ts` na fase 0 (aditivas ou de texto)

| Objeto | Mudança | Por que é segura |
| --- | --- | --- |
| `Differentiator`, `differentiators`, `differentiatorsSection` | remover | únicos consumidores são `diferenciais.tsx`, seu teste e `site.test.ts`, todos removidos ou ajustados neste mesmo PR |
| `steps[2].text` | "Médicos de verdade, por videochamada, pelo link seguro da própria plataforma, no celular ou no computador." | texto; `como-funciona.test.tsx` compara com `steps[]`, não com literal |
| `specialtiesSection` | `title: "Qualquer especialidade, quantas vezes precisar"`; acrescentar `lead: "Consultas ilimitadas em qualquer especialidade disponível na plataforma, sem custo adicional por consulta."` | `eyebrow` fica no objeto; `especialidades.tsx` atual lê `title` por referência |
| `cardSection` | acrescentar `lead` (texto atual de `benefits[0].text`) e `benefits: readonly { title: string; text: string }[]` com quatro itens (Descontos em farmácias, Exames com desconto, Lojas e serviços parceiros, Portal do paciente; textos atuais) | campos novos; `uses` e o array antigo `benefits` continuam para `cartao.tsx` e `beneficios.tsx` atuais |
| `plansSection` | `title: "Um plano para você ou para toda a família"`; `lead: "Assinatura mensal, sem taxa de adesão. O mesmo cuidado nos dois planos; muda só quantas pessoas usam."`; `notIncluded` sem "Cobertura de plano de saúde" e com "Atendimento de urgência e emergência" no lugar de "Pronto-socorro e emergências" | textos; `planos.test.tsx` afirma 5 itens não incluídos por literal e passa a afirmar `plansSection.notIncluded.length` neste PR |
| `faqSection.title` | `"O que perguntam antes de assinar"` | texto; `duvidas.test.tsx` compara com `faqSection.title` |
| `FaqItem` | acrescentar `link?: { href: string; label: string }` | opcional |
| `faq` | acrescentar ao fim `{ q: "Meus dados de saúde estão protegidos?", a: "Sim. Os dados de saúde ficam sob sigilo médico, e a Política de privacidade descreve quem acessa o quê e em que situações.", link: { href: "/privacidade", label: "Ler a Política de privacidade" } }` | `duvidas.test.tsx` conta `faq.length`; o `FaqPanel` atual ignora `link` até o pacote C |
| `ui.leadForm` | `title: "Fale com a Moorah"`; `subtitle: "Deixe seu contato e a Moorah retorna por e-mail."`; `submit: "Enviar"` | textos; `landing.spec.ts` usa `/Quero assinar|Enviar/` |
| `PhotoKey` e `photos` | acrescentar `pessoaCasa` (critério na seção 6). Nenhuma chave existente sai: o hero pode estar usando qualquer uma | aditivo |
| `plans`, `Plan.highlight`, `problems`, `problemsSection`, `howItWorks`, `manifesto`, `mocks`, `benefits`, `benefitsSection`, `finalCta`, tipos com `icon` | sem mudança na fase 0 | consumidos pelos componentes atuais; limpeza na integração final |

### 5.2 Arquivos compartilhados que a fase 0 ajusta no mesmo PR

- `src/components/sections/diferenciais.tsx`, `diferenciais.test.tsx`, `tests/e2e/diferenciais.spec.ts`:
  removidos (a seção sai da página aqui, não em um pacote; ninguém mais depende deles).
- `src/app/page.tsx`: remover import e uso de `Diferenciais`. `Cartao` continua até o pacote B
  (o id `cartao` só deixa de existir quando `beneficios.tsx` absorver o bloco). `SectionSkeleton`
  recebe `variant` (abaixo) e alturas responsivas provisórias `min-h-[Xpx] lg:min-h-[Ypx]`.
- `src/app/page.test.tsx`: ordem esperada passa a `["inicio", "por-que", "como-funciona",
  "especialidades"]` seguidos de cinco `"secao-dinamica"` (cartao, beneficios, planos, duvidas,
  contato); o pacote B reduz para quatro quando remover `Cartao` (exceção declarada na seção 7:
  se `cartao.tsx` sai no pacote B, o import em `page.tsx` tem que sair no mesmo PR, senão a
  página renderia o bloco antigo e o fundido ao mesmo tempo e o `tsc` quebraria).
- `src/content/site.test.ts`: tirar `differentiators` e `differentiatorsSection` dos imports e das
  varreduras; acrescentar `cardSection.benefits`, `photos` (só `alt`) e `faq[].link.label` às
  varreduras de travessão e de termos vetados; a regex de termos vetados passa a
  `/\b192\b|SAMU|LGPD|\bANS\b|plano de saúde/i` (os `legalLinks` continuam fora). Casos novos:
  `plans` tem exatamente 2 itens; `cardSection.benefits` tem 4 itens e nenhum `icon`;
  `plansSection.notIncluded` não contém "plano de saúde"; o último item de `faq` tem `link` para
  `/privacidade`; `faq` não repete pergunta.
- `src/components/ui/section-heading.tsx`: h2 em `font-display font-semibold leading-[1.08]
  text-3xl sm:text-4xl lg:text-5xl` (sai `font-bold` e `tracking-tight`; o tracking vem do base
  CSS); `description` com `max-w-[36rem]` quando `align="start"`. `section-heading.test.tsx`
  acompanha se afirmar o peso.
- `src/components/ui/section-skeleton.tsx`: prop `variant: "cards" | "split" | "list" | "form"`
  (padrão `cards`, o desenho atual, para `loading.tsx`). `split` = bloco de texto à esquerda e
  retângulo alto à direita (Benefícios); `list` = título e seis linhas de largura variável
  (Dúvidas); `form` = texto à esquerda e retângulo de cinco linhas à direita (Contato); Planos usa
  `cards` com dois retângulos (`md:grid-cols-2`) via prop `count?: 2 | 3`. Depois desta rodada
  nenhuma seção dinâmica tem três cards; um skeleton que promete grade de três e entrega outra
  coisa é CLS com aviso prévio. `section-skeleton.test.tsx` cobre as quatro formas.
- `src/components/ui/accordion.test.tsx`: o texto de exemplo "A Moorah é um plano de saúde?" vira
  "Como funciona o agendamento?" (é string de teste, não conteúdo, mas não precisa carregar a
  frase vetada).
- `CLAUDE.md`: a linha "Design: `docs/design-brief.md` é a fonte de verdade das seções" passa a
  apontar este documento para as seções fora do hero **já na fase 0**, não na integração final:
  durante as semanas de PRs paralelos, um agente que leia o CLAUDE.md seguiria a v1.
- `docs/conteudo-a-confirmar.md`: registrar a foto nova, a remoção do seletor e do badge, o item
  do painel removido, a pergunta nova do FAQ, a lista de chaves de `photos` órfãs e a nota de que
  a decisão de 04/09 ("não é plano de saúde" continua no rodapé e no FAQ) nunca chegou ao código
  (não há `legalNotes` em `src`, nem a frase no footer ou no FAQ) e foi superada pelo veto de
  05/09 ao corpo da página; a frase vive nos Termos e na Política de privacidade, e a pergunta 3
  da seção 9 pede ao jurídico se precisa voltar em algum lugar.
- Perguntar ao time do hero quais chaves de `photos` o hero v4 usa (para `pessoaCasa` não repetir
  pessoa nem cenário e para `heroMaeFilha` poder servir de reserva) e registrar a resposta em
  `docs/conteudo-a-confirmar.md`.

Se, ao rodar `npm run check`, algum teste de componente antigo afirmar um literal que mudou (por
exemplo `planos.test.tsx` com "Cobertura de plano de saúde"), a fase 0 ajusta esse teste para
comparar com o objeto de `site.ts`; os pacotes reescrevem os testes de qualquer forma.

## 6. Fotografias

Fora do hero a página passa a ter duas fotos, ambas grandes, ambas com uma pessoa em cena real.

| Seção | Chave | Origem | Critério |
| --- | --- | --- | --- |
| Por que | `pessoaCasa` (nova) | Pexels, escolhida pela pessoa da fase 0 | Critérios objetivos, todos obrigatórios: uma pessoa adulta (ou adulto com uma criança), dentro de casa, em cena cotidiana (mesa da cozinha, sofá, janela, varanda); **sem celular, tablet ou notebook no quadro** (o motivo "pessoa olhando aparelho" já está no hero e em Como funciona); luz natural; olhar fora da câmera; roupa neutra; sem jaleco; sem pose para a câmera; sem marcas ou texto visíveis; fundo em neutros quentes (sem azul ou teal saturados); orientação que sobreviva ao corte 4:5 com ar acima da cabeça (origem 2:3 ou 3:4 de preferência); CDN respondendo 200 em `w=1600`. Registrar id, medidas e `alt` em português no manifesto e em `docs/conteudo-a-confirmar.md`. Reserva se nada atender: `heroMaeFilha`, desde que o hero v4 não a use |
| Como funciona | `idosoTablet` (existente) | Pexels 8376171 | Senhor em casa com a médica no tablet: o médico só dentro da tela. Conferir `object-position` em 1024 e 1440 para manter rosto e tablet no quadro 4:5 |

Chaves que ficam sem uso nas seções depois desta rodada: `medicaSorrindo`, `medicaHeadset`,
`exame`, `pacienteCama`, `familiaSofa`, `familiaCasa`, `medicoVideo` (e `heroPaciente`, se o hero
não usar). Não remover agora; listar em `docs/conteudo-a-confirmar.md` para limpeza depois do hero.

Tratamento padrão de foto nesta rodada: `relative overflow-hidden rounded-3xl ring-1
ring-black/5`, `object-cover` com `object-position` fixa em classe, `next/image` com `sizes` do
layout, `loading` padrão (lazy), sem `priority` fora do hero, sem overlay, sem hover scale (o
`group-hover:scale-[1.02]` da v2 sai: é o mesmo tique em toda foto). O crédito "Fotografias
ilustrativas (Pexels)" continua no footer.

## 7. Pacotes de trabalho paralelos

Pré-requisito: a fase 0 (seção 5) mesclada em `main` com `npm run check` verde. Os quatro
pacotes editam conjuntos disjuntos de arquivos; nenhum toca `site.ts`, `site.test.ts`,
`ui/*`, `icons.tsx`, `globals.css`, `scripts/*`, `tests/e2e/landing.spec.ts`, `hero*`,
`header*` ou `trail-cluster.tsx`. `page.tsx` e `page.test.tsx` têm uma única exceção,
declarada: o pacote B remove neles o import, o uso e a expectativa de `Cartao` (duas linhas),
porque deletar `cartao.tsx` sem isso quebra o `tsc` e duplicaria o bloco na página; nenhum
outro pacote toca esses dois arquivos, então os conjuntos continuam disjuntos. Se um pacote precisar de um primitivo novo, cria o
arquivo dentro da própria pasta de seção com prefixo do pacote (ex.: `plan-cards.tsx`) em vez de
mexer em `ui/`. Conferido antes de fechar este brief: `AccordionTrigger`, `AccordionItem` e
`AccordionContent` aceitam `className` (mesclado com `cn`), `LeadDialogButton` herda `fullWidth`
de `ButtonProps`, `Reveal` aceita `as="li"` e `delay`, e `cn` usa `tailwind-merge`; nenhum
pacote precisa de exceção em `ui/`. Cada pacote é uma issue e um PR (`feat/secoes-v4-<pacote>`),
Conventional Commits, `npm run check` verde e os e2e do pacote verdes contra `npm run build &&
npm run start` com no máximo 4 workers.

**Ordem de merge e rollback.** Como os arquivos são disjuntos, a ordem é livre; a recomendada é
A, B, C, D (da abertura ao fechamento, para as capturas intermediárias fazerem sentido). `main`
fica verde depois de cada merge, porque cada pacote deixa de ler campos de `site.ts` sem
removê-los e remove só arquivos que só ele consumia. Rollback de um pacote = `git revert -m 1` do
merge commit (não toca em nada de outro pacote); rollback da fase 0 = revert do PR dela, só
possível antes do primeiro pacote entrar; rollback de deploy = redeploy da tag anterior, como o
CLAUDE.md já define. Se um pacote atrasar, os outros entram sem ele e a integração final espera;
nenhum pacote depende de outro.

Critérios de aceite comuns a todos os pacotes (o revisor confere na captura e no DOM):

1. Nenhum texto "01".."12" como índice na seção (`section.innerText` não casa `/\b0\d\b/`).
2. Nenhum `rounded-full` com um `svg` lucide dentro (ícone em círculo), exceto botões.
3. Nenhum `svg[data-trail-cluster]`, `[data-comet]`, `[data-track]`, `[data-exams-network]` na seção.
4. Nenhum elemento `absolute` dentro do mesmo contêiner de uma `img` cujo `src` venha de
   `photos.*` (nada sobre fotografia). Exceções declaradas e únicas: descendentes de
   `[data-card-stage]` (número, rótulo, titular, brilho e halo do cartão) e o próprio
   `[data-brand-watermark]` em Contato.
5. No máximo um `.eyebrow` por seção, e só onde a tabela da seção 2 marca "sim"; e nenhum outro
   texto na seção com `uppercase` e `tracking-[0.1em]` ou maior, exceto o rótulo "Nº do cartão".
6. Nenhum `.font-mono`, nenhum U+2014. Termos vetados: a varredura vale sobre os objetos de
   `site.ts` (`site.test.ts`, regex `/\b192\b|SAMU|LGPD|\bANS\b|plano de saúde/i`), não sobre
   `innerText`, porque `uppercase` devolve "PLANOS" e casa "ANS" por engano.
7. No máximo um movimento de entrada por seção; `prefers-reduced-motion: reduce` mostra o estado
   final; preço e botões nunca chegam ao HTML com `opacity: 0`.
8. Sem rolagem horizontal em 360 e nenhum elemento com `getBoundingClientRect().right` maior que
   `clientWidth` (`node scripts/check-overflow.cjs` ou medida no e2e).
9. Zero erros de console; Axe sem violações serious ou critical na seção.
10. Testes unitários e e2e do pacote reescritos antes da implementação (TDD) e verdes; o e2e do
    pacote tem pelo menos um caso com `reducedMotion: "reduce"` se a seção tiver qualquer `m.*`.
11. O pacote não edita `site.ts`; campos que deixou de consumir ficam anotados na descrição do PR
    para a lista de limpeza da integração final.

### Pacote A: Abertura (Por que, Como funciona, Especialidades)

Arquivos: `src/components/sections/por-que.tsx`, `por-que.test.tsx`, `como-funciona.tsx`,
`como-funciona.test.tsx`, `especialidades.tsx`, `especialidades.test.tsx`; remover
`convergence-trail.tsx`, `convergence-trail.test.tsx`, `steps-trail.tsx`, `steps-trail.test.tsx`,
`specialties-index.tsx`, `specialties-index.test.tsx`; e2e `tests/e2e/por-que.spec.ts`,
`como-funciona.spec.ts`, `especialidades.spec.ts`.

Aceite específico: `#por-que` mostra a foto `pessoaCasa` (ou a reserva registrada) sem nada por
cima e três h3 em `<ol>`, sem `border` entre itens; `#como-funciona` mostra `idosoTablet` à
esquerda em `lg` e quatro `li` filhos diretos de `ol[aria-label="Passos"]`, cada um com h3, sem
`border` entre itens; `#especialidades` tem 12 `li`, zero `img`, zero `svg`, duas colunas de 640
em diante, nenhum `li` com borda ou fundo; "Otorrinolaringologia" em uma linha em 1024 e 1440.
Campos que o pacote deixa de ler (para a lista da integração final): `manifesto.eyebrow`,
`manifesto.nodes`, `manifesto.hub`, `manifesto.svgAlt`, `howItWorks.eyebrow`, `Step.icon`,
`specialtiesSection.eyebrow`, `Specialty.icon`, `mocks.reminderChips`, `mocks.reminderChip`,
`mocks.slotConfirmed`, `mocks.connected`, `mocks.signed`, `photos.pacienteCama`,
`photos.medicaSorrindo` (se o hero não usar), `photos.medicoVideo`.

### Pacote B: Cartão e rede (Benefícios fundido)

Arquivos: `src/components/sections/beneficios.tsx`, `beneficios.test.tsx`, `card-stage.tsx`,
`card-stage.test.tsx`; remover `cartao.tsx`, `cartao.test.tsx`, `portal-mock.tsx`,
`portal-mock.test.tsx`, `pharmacy-mock.tsx`, `pharmacy-mock.test.tsx`, `exams-network.tsx`,
`exams-network.test.tsx`; em `src/app/page.tsx` e `page.test.tsx`, só as linhas de `Cartao`
(exceção declarada acima); e2e `tests/e2e/beneficios.spec.ts` (reescrito) e remover
`tests/e2e/cartao.spec.ts`.

Aceite específico: `#beneficios` é o bloco plum com `rounded-3xl`; h2 = `cardSection.title`;
quatro h3; `radiogroup` funciona por teclado e troca o número; cartão entra e fica parado; tilt só
com mouse; zero `[data-brand-lockup]` na seção; no mobile a ordem é heading, cartão, lista.

### Pacote C: Planos e Dúvidas

Arquivos: `src/components/sections/planos.tsx`, `planos.test.tsx`, `plan-cards.tsx` (novo),
`plan-cards.test.tsx` (novo), `duvidas.tsx`, `duvidas.test.tsx`, `faq-panel.tsx`,
`faq-panel.test.tsx`; remover `plan-selector.tsx`, `plan-selector.test.tsx`; e2e
`tests/e2e/planos.spec.ts`, `duvidas.spec.ts`.

Aceite específico: `#planos` mostra "49,90", "129,90" e "32,48" sem interação; zero `img`, zero
`radiogroup`, zero "Mais escolhido"; "Assinar Familiar" abre o dialog com o select em `familiar`
(contrato de `landing.spec.ts`); `#duvidas` tem fundo branco, h2 = `faqSection.title` ("O que
perguntam antes de assinar"), primeiro `<button>` fechado, segundo aberto, sem numeração, sem
card em volta, e o último item aberto mostra o link para `/privacidade`.

### Pacote D: Fechamento (Contato, Footer, barra mobile)

Arquivos: `src/components/sections/contato.tsx`, `contato.test.tsx`, `footer.tsx` (opcional, uma
linha), `footer.test.tsx` (se o ponto sair); e2e `tests/e2e/contato.spec.ts`, `footer.spec.ts`,
`mobile-bar.spec.ts` (sem mudança de código, só reexecutar e, se preciso, ajustar seletores).

Aceite específico: `#contato` sem `svg[data-trail-cluster]`, sem lockup, sem foto; card com h3
= `ui.leadForm.title` ("Fale com a Moorah") e botão "Enviar"; envio válido (rota interceptada)
mostra `role="status"`; marca
d'água abaixo do texto e à esquerda do card no desktop, oculta no mobile; footer inalterado nos
contratos; barra mobile aparece ao rolar até `#como-funciona` e some em `#planos`, `#contato` e
footer.

### Integração final (uma pessoa, depois dos quatro PRs)

- Limpeza de `site.ts` em um commit com lista fechada, cruzando as anotações dos quatro PRs
  (critério comum 11): saem o array antigo `benefits` e `benefitsSection`, `cardSection.uses`,
  os campos de `mocks` sem consumidor (ficam `cardSamples` e `cardHolders`), `plans[1].badge` e
  o opcional `Plan.badge`, `plansSection.peopleQuestion`, `photoChip`, `singleHint`,
  `manifesto.eyebrow`, `manifesto.nodes`, `manifesto.hub`, `manifesto.svgAlt`,
  `howItWorks.eyebrow`, `specialtiesSection.eyebrow`, `faqSection.eyebrow`, `finalCta.eyebrow`
  e os campos `icon` de `Step`, `Specialty` e `Benefit`; `site.test.ts` acompanha.
- Medir a altura real de cada seção dinâmica em 1440 e 390 (via `getBoundingClientRect` de cada
  `section` após `networkidle`) e ajustar os `min-h-* lg:min-h-*` dos `SectionSkeleton` em
  `page.tsx` (evitar CLS nas duas larguras, que é onde o PageSpeed mede).
- Instalar `knip` como devDependency com `knip.json` versionado (única dependência nova do
  redesenho, declarada de propósito: `npx knip` sem instalar baixaria o pacote do mesmo jeito,
  só que fora do lockfile). Lista fechada do que pode ficar órfão: as chaves de `photos` da
  seção 6, os keyframes de `globals.css` que o hero ainda pode usar (`comet`, `drift`, `float`,
  `float-slow`, `marquee`) e `src/components/icons.tsx` se só o hero o consumir (a decisão de
  removê-lo é do time do hero). Qualquer outro órfão reprova. Depois, `npm run check`.
- Atualizar a lista de ids de `scripts/screenshots.cjs` (saem `cartao` e `diferenciais`, que hoje
  só imprimem "missing" e pulam) e tirar do comentário de `tests/e2e/landing.spec.ts` a menção ao
  chip sobre a foto de Planos (é comentário, não contrato).
- Trocar o título do dialog de `ui/lead-dialog.tsx` de `data.cta` para `ui.leadForm.title`, com o
  nome do plano na descrição, e ajustar `lead-dialog.test.tsx` (ver 4.5), assim que a pergunta 7
  da seção 9 fechar o texto.
- `node scripts/screenshots.cjs .shots/v4` e `node scripts/check-overflow.cjs` (ignorando
  descendentes de contêiner com `overflow-x-auto`, se ainda existir algum); abrir as capturas
  e conferir a seção 8.
- Conferir que a linha de design do `CLAUDE.md` (já apontada para este documento na fase 0,
  seção 5.2) continua correta e que as pendências novas estão em `docs/conteudo-a-confirmar.md`.

## 8. Checklist de verificação no navegador

Rodar contra `npm run build && npm run start` em 360x780, 1024x768 e 1440x900, com e sem
`prefers-reduced-motion: reduce`, e com JS desligado uma vez (todo texto precisa existir no HTML).
Capturas em `.shots/v4/` via `scripts/screenshots.cjs`.

Página inteira:

- [ ] Zero erros de console no carregamento e depois de rolar até o footer.
- [ ] `document.documentElement.scrollWidth <= clientWidth` em 360 (sem rolagem horizontal).
- [ ] Contagem de `.eyebrow` fora do hero (`main section:not(#inicio) .eyebrow`) = 3; nenhuma seção com dois. O hero conta à parte, com o número que o brief v3 fixar; sem esse recorte o item ficaria impossível de reprovar.
- [ ] `document.body.innerText` não contém U+2014 nem "01 " a "12 " como índice. Os termos vetados (192, SAMU, LGPD, ANS, "plano de saúde") são varridos em `site.test.ts` sobre os objetos, não no `innerText` (critério 6: `uppercase` devolve o texto transformado e rótulos em caixa alta geram falso positivo).
- [ ] `document.querySelectorAll("main section:not(#inicio) .font-mono").length === 0` (o hero atual ainda usa mono em duas linhas; a saída dele é escopo do brief v3, não deste).
- [ ] Fora do hero: `main svg[data-trail-cluster]`, `[data-comet]`, `[data-track]` com contagem 0.
- [ ] Duas `img` de foto fora do hero, e nenhum elemento posicionado por cima delas (inspecionar).
- [ ] Axe (`@axe-core/playwright`, tags wcag2a/aa, 21a/aa): zero serious ou critical.
- [ ] Ordem de tabulação: header, hero, `#beneficios` radiogroup, botões de plano, gatilhos do FAQ, formulário, footer; foco visível em todos.
- [ ] Reduced motion: cartão plano com número final, cards de plano visíveis sem animação, FAQ funciona, nenhum elemento com `opacity: 0` preso.
- [ ] Barra mobile em 360: aparece ao rolar até `#como-funciona`, some em `#planos`, `#contato` e footer, não cobre o botão "Assinar Familiar".
- [ ] PageSpeed (pagespeed.web.dev) da página publicada: LCP abaixo de 2,5 s, CLS abaixo de 0,1 (as seções dinâmicas com skeleton de altura correta).

Por seção (nas três larguras):

- [ ] Por que: foto ocupa metade da largura em 1440 e a largura inteira em 360, pessoa inteira no quadro, nada sobre a foto; três dores legíveis; manifesto em duas colunas em 1024+ e empilhado em 360.
- [ ] Como funciona: foto à esquerda em 1024+ com rosto e tablet visíveis; quatro passos separados só por respiro, sem borda entre itens; em 360 a foto vem depois do lead e antes da lista.
- [ ] Especialidades: 2 colunas de 640 em diante, 1 em 360; "Otorrinolaringologia" em uma linha em 1024 e 1440; nenhum nome quebrado no meio sem hífen; sem ícone, sem número, sem foto.
- [ ] Benefícios: bloco plum com margem; cartão não corta em 360 (`max-w` respeitado); trocar de titular muda o número; lista de quatro benefícios com contraste; nenhum lockup dentro do bloco.
- [ ] Planos: heading centrado; Familiar à direita em 1024+ e primeiro em 360; preços em Plus Jakarta 700; "32,48" visível sem interação; painel sem caixa em duas colunas em 768+.
- [ ] Dúvidas: coluna de no máximo 48rem; primeiro item fechado, segundo aberto; e-mail como link em Manrope.
- [ ] Contato: texto à esquerda e formulário à direita em 1024+; marca d'água no canto inferior esquerdo sem tocar texto ou card; em 360 só texto e formulário.
- [ ] Footer: inalterado; crédito das fotos visível; marca d'água sem rolagem horizontal.

Contratos de `tests/e2e/landing.spec.ts` que continuam valendo, na letra:

1. `<title>` contém "Moorah"; exatamente um `h1`, visível; zero erros de console.
2. `#como-funciona`, `#especialidades`, `#beneficios`, `#planos`, `#duvidas` existem, um de cada.
3. O primeiro link com nome "Planos" leva a URL terminada em `#planos`.
4. Em `#planos` aparecem "49,90", "129,90" e "32,48" (o último pode aparecer mais de uma vez;
   o teste usa `.first()`).
5. Em `#duvidas`, o primeiro `button` do DOM tem `aria-expanded="false"`, Enter abre e Enter fecha.
6. O botão "Assinar Familiar" abre `role="dialog"`; o campo com label contendo "Plano" tem valor
   `familiar`; clicar no botão `/Quero assinar|Enviar/` com o formulário vazio mostra "Informe seu
   nome"; Escape fecha o dialog.
7. Axe sem violações serious ou critical.
8. Nenhum texto visível contém U+2014.
9. Mobile: rolar até `#como-funciona` deixa `data-testid="cta-mobile"` visível; o botão com nome
   contendo "menu" abre um dialog.

Outros contratos que ficam intocados: `tests/e2e/header.spec.ts` (faixa legal, lockup, nav) e
`tests/e2e/hero.spec.ts` (outro time).

## 9. Perguntas abertas para o cliente

1. **Lista de especialidades.** A lista atual (12) é placeholder; o cliente disse que segue a da
   parceira que opera a parte médica e ainda não enviou. Sem a lista, o título novo ("Qualquer
   especialidade, quantas vezes precisar") e a promessa "qualquer especialidade disponível na
   plataforma" seguem provisórios; a lista real também precisa separar especialidades médicas de
   outros profissionais (Psicologia e Nutrição não são especialidades médicas pelo CFM, e o hero
   fala de "um médico por vídeo").
2. **Seletor "Para quantas pessoas?" e badge "Mais escolhido".** Este brief remove os dois: o
   seletor produz valores por pessoa que não são oferta (R$ 64,95, R$ 43,30) e o badge afirma uma
   preferência que ainda não existe. Confirmar que o comercial concorda.
3. **Painel "Não está incluído".** Removemos "Cobertura de plano de saúde" (é o aviso regulatório
   em forma de bullet) e reescrevemos "Pronto-socorro e emergências" como "Atendimento de urgência
   e emergência". O jurídico precisa dizer se o painel, sem essa linha, ainda protege a empresa ou
   se a frase precisa voltar de alguma forma na página de Planos.
4. **Diferenciais removida.** Confirmar. Se o cliente quiser a seção de volta, ela só entra com um
   fato verificável por item (número de médicos com CRM, nome de parceiro com contrato, tempo médio
   até a consulta).
5. **Pergunta nova do FAQ sobre dados.** A resposta remete à Política de privacidade e não afirma
   "infraestrutura no Brasil" nem "criptografia em repouso" porque a engenharia ainda não
   confirmou. Se o cliente quiser afirmar mais, precisa da confirmação técnica primeiro.
6. **"Resolução CFM nº 2.314/2022" na primeira resposta do FAQ.** É citação regulatória; o cliente
   vetou 192, SAMU, LGPD e ANS no corpo, mas não falou de CFM. Manter (é prova de legitimidade da
   telemedicina) ou tirar?
7. **Formulário "Fale com a Moorah" com botão "Enviar".** O lead cai em `POST /api/leads` e, sem
   `LEAD_WEBHOOK_URL`, só no log do servidor. "A Moorah retorna por e-mail" precisa de destino e de
   prazo combinados antes de publicar.
8. **Número do cartão exemplo (1234 5678 9012).** O cliente pediu esse número na v2; a pesquisa
   aponta que lê como placeholder. Manter, ou usar um número no formato real quando o formato
   existir?
9. **Fotos próprias.** As duas fotos desta rodada são Pexels. É a decisão que mais muda o
   resultado: uma sessão com pessoas brasileiras em casa (sem jaleco, sem pose) substitui as duas
   chaves sem mudar layout.
10. **Nomes de farmácias, laboratórios e lojas.** A lista de benefícios diz "rede parceira". Um nome
    real com contrato vale mais que qualquer ilustração; quando houver, entra como texto na lista,
    não como logo sobre foto.
11. **WhatsApp e CNPJ.** Continuam condicionados às variáveis de ambiente. Sem CNPJ não há WhatsApp
    Business; confirmar prazo.
12. **Carência, fidelidade e cancelamento.** O FAQ afirma "sem carência" e "cancela quando quiser";
    Planos afirma "sem taxa de adesão". Confirmar as regras reais antes do lançamento.

## 10. Crítica recebida e resposta

A crítica de 05/09 (três frentes: template residual, promessa e copy, implementação) foi lida
inteira. Quase tudo foi acatado e já está incorporado no corpo do documento; esta seção registra
onde cada bloco foi parar e, ao fim, o que não foi acatado e por quê.

### 10.1 Acatado (onde está no documento)

- **Nome de plano como eyebrow disfarçado**: h3 do plano em `font-display text-2xl font-semibold`
  caixa normal (4.5); o princípio 11 passou a valer pela aparência, não pela classe, e o
  princípio 4 lista as exceções de peso 700 (preço, botões, `SegmentedControl`, `eyebrow`).
- **"Perguntas frequentes"**: título de Dúvidas virou "O que perguntam antes de assinar",
  a primeira alternativa sugerida pela crítica (4.6 e 5.1).
- **Hairlines em três seções**: `border-b` saiu de Como funciona, Benefícios e do painel de
  Planos; separação por respiro (princípio 13); a única hairline fora do hero é a do acordeão.
- **"Quero assinar" sobre formulário de contato**: card virou "Fale com a Moorah" com subtítulo
  que diz o que acontece e botão "Enviar" (4.7 e 5.1); o mesmo descompasso no dialog de Planos
  foi registrado e ganhou dono e momento (integração final, após a pergunta 7).
- **Dois CTAs de peso igual em Contato**: "Escolher meu plano" virou `outline-light`; o destino
  principal da seção é o formulário (4.7).
- **Três fotos seguidas com o mesmo motivo**: o critério de `pessoaCasa` passou a exigir cena sem
  celular, tablet ou notebook, com reserva `heroMaeFilha` e pergunta ao time do hero sobre as
  chaves que o hero v4 usa (4.1, 5.2 e 6).
- **"Do clínico geral à psicologia"**: título trocado por "Qualquer especialidade, quantas vezes
  precisar", sem nomear pontas de lista provisória nem profissões não médicas (4.3); a separação
  médicos/outros profissionais foi para a pergunta 1 da seção 9.
- **FAQ afirmando criptografia**: a resposta nova afirma só sigilo médico e remete à Política de
  privacidade; criptografia e infraestrutura só depois da confirmação da engenharia (4.6 e 5.1).
- **Familiar em `bg-ink` entre dois blocos plum**: destaque por `ring-2 ring-berry-600`, preço
  maior e botão primário, cards brancos (4.5).
- **Fase 0 que quebrava `main`**: a fase 0 passou a ser só aditiva e de renome; a limpeza de
  `site.ts` virou commit com lista fechada na integração final (5 e 7).
- **Arquivos sem dono**: Diferenciais (componente, teste e e2e) saem na fase 0 (5.2);
  `scripts/screenshots.cjs`, o comentário de `landing.spec.ts`, `icons.tsx` e os keyframes
  (incluindo `float-slow`) ganharam dono na integração final (7).
- **Critério 4 reprovando o próprio CardStage**: exceções declaradas `[data-card-stage]` e
  `[data-brand-watermark]` no princípio 2 e no critério 4.
- **`main .font-mono === 0` e "ANS" no `innerText`**: os dois itens do checklist foram
  reescritos; mono com escopo `section:not(#inicio)` e termos vetados varridos em `site.test.ts`
  (8 e critério 6). Nota: o exemplo da crítica ("PLANOS" casa "ANS") não se sustenta letra a
  letra (P-L-A-N-O-S não contém a sequência A-N-S), mas o risco de falso positivo com texto
  transformado por `uppercase` (ex.: "TRANS") é real, então o ponto foi acatado do mesmo jeito.
- **`ol > div > li` inválido**: os passos usam `Reveal as="li"` com `delay` incremental dentro de
  `<ol>` estático (4.2).
- **Preço com `opacity: 0` até hidratar**: cards de Planos são estáticos, sem `m.*`; virou regra
  no princípio 9 e critério 7.
- **`SegmentedControl` estourando 360**: 2x2 no mobile via `className` com `tailwind-merge`, sem
  editar `ui/`, com nota de foco visível sobre plum (4.4).
- **knip sem instalar**: virou devDependency declarada com `knip.json` e lista fechada de órfãos
  permitidos (regras de abertura e 7).
- **Marca d'água apertada em 1024**: começa em `xl:block` e o e2e mede em vez de confiar nos
  valores (4.7).
- **Reduced motion sem e2e**: critério 10 exige um caso `reducedMotion: "reduce"` em todo pacote
  com `m.*`; Benefícios e Planos têm os casos escritos (4.4 e 4.5).
- **CardStage com `uses` removido**: a máquina de ticks é reescrita, com teste de que o intervalo
  não vaza (4.4).
- **Skeleton de três cards para seções que não têm três cards**: `SectionSkeleton` ganhou
  `variant` (5.2) e a integração final mede as alturas em 1440 e 390.
- **Contraste afirmado sem medida, `aria-live` do cartão, alturas de skeleton, coordenação de
  fotos com o hero, testes novos de conteúdo em `site.test.ts` (`plans.length === 2`, benefits
  sem `icon`, `notIncluded` sem "plano de saúde", `faq` com link), CLAUDE.md na fase 0,
  contradição com a decisão de 04/09 em `conteudo-a-confirmar.md`, barra mobile sobre a lista de
  Benefícios, link clicável na resposta do FAQ, hifenização medida em Especialidades, exceções de
  `ui/` conferidas antes de fechar o brief, plano de rollback por pacote**: todos incorporados
  (4.4, 4.6, 4.9, 5.2, 6, 7).
- Nesta revisão, resíduos da própria crítica que tinham ficado para trás foram corrigidos: os
  aceites dos pacotes C e D ainda pediam "Perguntas frequentes" e "Quero assinar", o checklist
  ainda pedia borda nos passos e três colunas em Especialidades, e ninguém podia tirar o import
  de `Cartao` de `page.tsx` quando o pacote B apagasse `cartao.tsx` (agora é exceção declarada).

### 10.2 Não acatado, e por quê

1. **Trocar o par "h3 + parágrafo" entre Por que e Como funciona.** A crítica pediu que nenhuma
   seção repetisse o esqueleto da vizinha e apontou a lista de h3 + p nas duas. Com as hairlines
   removidas, o que sobra é a forma mínima de texto, não um ornamento de template: o que
   diferencia as seções é foto de lados opostos, `<ol>` rotulado com cascata em uma e lista
   estática na outra, e manifesto tipográfico só na primeira. Inventar uma terceira forma de
   escrever "título curto + uma frase" só para variar seria variação pela variação (princípio 10
   registra a distinção). Se nas capturas da integração final as duas seções ainda parecerem
   irmãs, o ajuste é de composição (escala do h3, largura da coluna), não de esqueleto.
2. **Trocar "1234 5678 9012" por doze dígitos não sequenciais agora.** O número atual foi pedido
   do cliente na v2; qualquer outro número também seria inventado, só que sem a bênção dele. A
   troca certa é para o formato real quando existir, e é o que a pergunta 8 da seção 9 pede. O
   comentário em `site.ts` já marca "Confirmar formato real" e garante que os samples ficam fora
   de qualquer faixa de cartão bancário.
3. **Foto de paciente na coluna esquerda de Especialidades.** A crítica ofereceu três
   alternativas; adotamos a segunda (índice tipográfico em duas colunas, nome como h3 e frase
   abaixo). A terceira (manter uma foto grande) não foi adotada de propósito: depois de duas
   fotos grandes em sequência (Por que e Como funciona), a página precisa mudar de densidade
   (padrão Alice e Mira), e o cliente reclamou de página cheia. A recomendação 6.5 da pesquisa
   ("trocar a foto por paciente") valia para a seção com foto ruim, não obriga a haver foto.
4. **Painel Incluído/Não incluído entre Benefícios e os cards de Planos.** Era a alternativa B da
   crítica para o problema do card escuro; adotamos a A (anel berry). Mudar a ordem interna de
   Planos colocaria a objeção ("não está incluído") antes da oferta, e as referências de preço
   citadas mostram preço primeiro, detalhe depois.
5. **Formulário dentro do dialog e Contato só com texto e CTA.** Era a alternativa B da crítica
   para os dois CTAs; adotamos a A (rebaixar "Escolher meu plano" para secundário). O formulário
   visível na última seção é o único caminho de conversão que funciona sem JS e é o padrão das
   referências de fechamento; escondê-lo atrás de um clique custaria lead.
6. **"Manter a citação CFM fora do corpo" não foi decidido aqui.** A crítica não pediu, mas
   registro: a Resolução CFM 2.314/2022 continua na primeira resposta do FAQ até o cliente
   responder a pergunta 6 da seção 9; o veto dele citou 192, SAMU, LGPD e ANS, não CFM, e decidir
   por ele seria adivinhar.
