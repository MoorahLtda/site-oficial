@AGENTS.md

# Moorah Telemedicina - Landing page

Landing page B2C do Moorah Telemedicina: assinatura de consultas medicas online ilimitadas,
em qualquer especialidade, nos planos Individual e Familiar, com Cartao Moorah de beneficios.
Stack: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4 + motion (framer) +
lucide-react + Radix (accordion/dialog). Testes: Vitest + Testing Library e Playwright (Edge local).

## Regras para qualquer agente, em qualquer modelo

- Nunca usar travessao (U+2014) em codigo, texto, commit ou comentario. Use hifen.
- Texto de marketing, precos e listas vivem em `src/content/site.ts`. Componentes recebem dados
  daquele arquivo; nao duplique copy dentro de componentes.
- Tokens de marca em `src/app/globals.css` (`@theme`): cores `berry-*`, `leaf-*`, `gray-*`
  (cinzas tingidos de ameixa), `ink`, `lilac`; fontes `font-display` (Plus Jakarta Sans) e
  `font-sans` (Manrope), nada mais: nao existe `font-mono` nem JetBrains Mono, e nenhum texto da
  interface (rotulos, numeracoes, precos, numero do cartao) pode usar fonte mono; raios
  `rounded-control|card|xl|2xl|3xl`; sombras `shadow-card|float|deep|glow`; easing `ease-out-expo`;
  utilitarios `container-x`, `eyebrow` (Plus Jakarta 700, 0.75rem, caixa alta, tracking 0.14em,
  berry), `skeleton`, `text-gradient-berry`.
- Logo: `public/brand/` (mark plum/branco, wordmark plum/branco, lockup branco, cartao).
  Nao redesenhe nem recolora o simbolo; so plum (#4B244D) ou branco.
- Nao inventar numeros, depoimentos, logos de parceiros ou selos. Placeholders vao para
  `docs/conteudo-a-confirmar.md`.
- Animacoes: `import { m, ... } from "motion/react"` (LazyMotion em modo strict; `motion.*` quebra).
  Toda animacao deve degradar com `prefers-reduced-motion` (MotionConfig ja cuida do JS; CSS via
  media query em globals.css). Sem loops infinitos chamativos em texto.
- Acessibilidade minima: navegacao por teclado, foco visivel, contraste AA, `label` em inputs,
  `alt` em imagens, `aria-hidden` em icones decorativos, `aria-expanded` em toggles.
- Performance: imagens via `next/image` com `sizes`, `priority` so no hero; componentes pesados
  com `next/dynamic`; skeleton para conteudo que carrega depois.
- Next 16: `params`, `searchParams`, `headers()` e `cookies()` sao Promises. Em duvida, leia
  `node_modules/next/dist/docs/` antes de usar uma API.
- Copy em portugues do Brasil, tom institucional e acolhedor, sem exclamacao em excesso e sem
  emoji. A Moorah nao e plano de saude: nunca prometer cobertura, internacao ou pronto-socorro.

## Fluxo de trabalho

- Conventional Commits (feat, fix, chore, docs, test, refactor) validados por Commitlint no hook
  `.githooks/commit-msg` (ativado por `git config core.hooksPath .githooks`, roda no `npm install`
  via script `prepare`).
- Repositorio: https://github.com/MoorahLtda/site-oficial (branch principal `main`). Uma issue por
  tarefa (correcao, melhoria ou funcao nova); trabalho em branch `tipo/descricao-curta`; PR com
  "Closes #n" no corpo (template em `.github/pull_request_template.md`). A CI
  (`.github/workflows/ci.yml`: Commitlint, Biome, tipos, Vitest, build, npm audit e Playwright) e
  obrigatoria; a protecao da branch `main` deve exigir os dois jobs verdes antes do merge.
- Nesta maquina o `gh` (GitHub CLI) nao esta instalado: issues e PRs saem pela web ou depois de
  `winget install GitHub.cli` e `gh auth login`.
- TDD: escreva o teste antes da implementacao. Unitarios em `src/**/*.test.tsx`; e2e em
  `tests/e2e/*.spec.ts`.
- Antes de commitar: `npm run check` (Biome + typecheck + Vitest). E2E: `npm run test:e2e`.
- Deploy: `npm run build` precisa passar limpo. Rollback = redeploy da tag anterior.
- No PowerShell do Filipe, use `npm.cmd` / `npx.cmd` e um comando por linha (sem `&&`).

## Ambiente (leia antes de estranhar a lentidao)

- A pasta fica dentro do OneDrive, com espaco e acento no caminho. I/O e lento e oscila: o boot do
  worker do Vitest pode passar de 60 s. `scripts/patch-vitest-timeout.mjs` (rodado no `postinstall`)
  eleva o limite fixo do Vitest para 10 min; `vitest.config.mts` roda os arquivos em serie
  (`fileParallelism: false`, `maxWorkers: 1`, `pool: "threads"`). Nao remova isso sem testar.
- `next/font/google` falhou aqui (Turbopack nao resolveu o download dos woff2); as fontes sao
  auto-hospedadas via `@fontsource-variable/*` importadas em `layout.tsx`.
- O preview do Claude Code le o `.claude/launch.json` do diretorio da sessao; a configuracao
  `moorah-site` la apenas anexa em `http://localhost:3000`. Suba o dev server com `npm run dev -- -p 3000`.
- Design: `docs/design-brief.md` e a fonte de verdade das secoes (direcao "Trilha da Amora").

## Armadilhas ja encontradas neste projeto

- **Faixa continua (`w-max`) como item de flex ou grid** estica a coluna inteira: `overflow-hidden`
  no pai nao resolve, porque `min-width: auto` de item usa o min-content do conteudo. Use
  `w-full min-w-0` no elemento que tem o overflow. Ver `src/components/ui/marquee.tsx`.
- **Elemento decorativo que sangra** (`inset-[-14%]`, cards com `right-[-6%]`) cria rolagem
  horizontal no mobile. Recorte na secao com `overflow-x-clip`. Ver `src/components/sections/hero.tsx`.
- **Ancora de entrada** (`/#planos` aberto direto) nao funciona sozinha: as secoes dinamicas mudam
  a altura e o App Router reposiciona a rolagem depois da hidratacao. `HashScroll` cuida disso; nao
  remova.
- **PNG da marca tem 194x265**: nao use altura maior que 265 px sem um export novo, senao o
  navegador amplia.
- **Playwright neste disco**: rode com no maximo 4 workers e contra `npm run build && npm run start`.
  Contra o servidor de desenvolvimento com 12 workers, testes falham por timeout sem defeito real.
- **Teste de e2e de algo que se move sozinho**: nao afirme o quadro inicial. Emule reduced motion
  para o estado deterministico e, para a troca, leia o valor atual e espere qualquer mudanca.
- **Vitest**: o boot do worker passa de 60 s neste disco; `scripts/patch-vitest-timeout.mjs` eleva o
  limite no postinstall. Rode com `--maxWorkers=1`.

- **Painel de navegador do Claude Code oculto**: a aba fica em segundo plano e o `requestAnimationFrame`
  nao roda, entao animacoes `m.*` parecem travadas no `initial` (opacidade 0, escala inicial). Nao e
  defeito do site. Verifique movimento com Playwright (`node scripts/check-hero.cjs .shots/v3`).
- **Grade sem `grid-cols` no mobile**: a coluna implicita (`auto`) cresce ate o max-content do item
  mais largo (a faixa de especialidades, ~3900 px) e o bloco inteiro vaza. Declare
  `grid-cols-[minmax(0,1fr)]` no breakpoint base. Ver `src/components/sections/hero.tsx`.

## Estrutura

- `src/app/` rotas, `layout.tsx` (fontes, metadata), `globals.css`, icones e imagem OG.
- `src/components/sections/` secoes da landing (uma pasta ou arquivo por secao).
- `src/components/ui/` primitivos reutilizaveis (botao, badge, accordion, dialog...).
- `src/components/providers/` provedores de contexto (motion).
- `src/components/icons.tsx` mapa de icones lucide por chave (`IconKey`).
- `src/content/site.ts` conteudo; `src/lib/` utilitarios.
- `tests/e2e/` Playwright; `tests/setup.ts` mocks do jsdom; `docs/` notas do projeto.
