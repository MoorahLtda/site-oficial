export const meta = {
  name: 'moorah-build-landing',
  description:
    'Constroi primitivos de UI, secoes (construir -> revisar/corrigir), composicao da pagina e paginas auxiliares da landing Moorah a partir de docs/design-brief.md',
  phases: [
    { title: 'Primitivos', detail: 'UI compartilhada em src/components/ui, 2 agentes em paralelo' },
    { title: 'Secoes', detail: 'pipeline: construir -> revisar/corrigir, uma secao por agente' },
    { title: 'Composicao', detail: 'page.tsx, loading, not-found, termos, privacidade, next build' },
  ],
}

const ROOT = args.root
const BRIEF = args.brief
const primitives = BRIEF.primitives || []
const sections = (BRIEF.sections || []).filter((s) => !/app[\\/]page\.tsx$/.test(s.file))

const COMMON = [
  'PROJETO: landing page do Moorah Telemedicina. Pasta: ' + ROOT,
  'Antes de escrever qualquer codigo, LEIA (Read, caminho absoluto): CLAUDE.md, docs/design-brief.md (inteiro: sistema de motion, ritmo de cor, tipografia, primitivos e a secao que lhe cabe), src/content/site.ts, src/app/globals.css, src/components/icons.tsx e os arquivos existentes em src/components/ui (a API real dos primitivos e a que esta no codigo, nao a do brief, se divergirem).',
  '',
  'REGRAS OBRIGATORIAS:',
  '- Nunca use travessao (U+2014) em nada. Use hifen.',
  '- Copy de marketing vem de src/content/site.ts. Se o brief pedir um texto que nao existe la, use o texto do brief mas coloque-o como constante no topo do seu componente com o comentario "// TODO mover para site.ts" e liste no resultado (notes). NAO edite site.ts (outros agentes dependem dele).',
  '- Animacoes: import { m, useInView, useScroll, useTransform, AnimatePresence, useReducedMotion } from "motion/react". Sempre m.div, m.span etc. NUNCA motion.div (LazyMotion strict quebra). Sem layout animations, sem drag. Toda animacao deve ter estado final digno sem JS e respeitar reduced-motion (MotionConfig ja cuida do JS; para CSS use as classes animate-* que ja respeitam a media query).',
  '- "use client" apenas em arquivos que usam hooks, motion ou eventos. Server Components por padrao. Nao importe componentes server dentro de client.',
  '- Tailwind v4 com os tokens do projeto (berry-*, leaf-*, gray-*, ink, lilac, font-display, font-sans, font-mono, rounded-control/card/xl/2xl/3xl, shadow-card/float/deep/glow, ease-out-expo, container-x, eyebrow, skeleton, text-gradient-berry). Nada de cores hex soltas fora dos tokens, salvo em SVG decorativo.',
  '- Icones: <Icon name="..." /> de src/components/icons.tsx quando a chave existir em IconKey; senao importe direto de lucide-react. Icones decorativos com aria-hidden.',
  '- Imagens: next/image com width/height ou fill + sizes; alt descritivo ou alt="" se decorativa; priority so no hero.',
  '- Acessibilidade: hierarquia de headings (um h1 na pagina, no hero; secoes usam h2), landmarks (header, nav, main, section com aria-labelledby, footer), foco visivel, aria-expanded em toggles, labels em inputs, contraste AA.',
  '- Sem numeros inventados, depoimentos ou logos de parceiros.',
  '- TypeScript estrito, sem any. Componentes tipados com props explicitas.',
  '',
  'CHECAGENS (Bash, comece com cd para a pasta do projeto entre aspas duplas; use npx.cmd):',
  '1. npx.cmd biome check --write <seus arquivos>',
  '2. npx.cmd tsc --noEmit -p tsconfig.json (projeto inteiro; corrija erros que estejam nos SEUS arquivos; se houver erro em arquivo de outro agente, apenas relate)',
  '3. npx.cmd vitest run <seu arquivo de teste> --maxWorkers=1 (a pasta fica no OneDrive e e lenta; se falhar com "Timeout waiting for worker", tente mais uma vez; se persistir, relate checks.vitest="skipped")',
  'Nao rode next build, next dev, playwright ou npm install. Nao use ferramentas de navegador.',
  'Escreva SOMENTE nos arquivos que lhe foram atribuidos. Nao crie arquivos extras em src/components/ui nem edite arquivos de outros agentes.',
].join('\n')

const CHECKS_SCHEMA = {
  type: 'object',
  required: ['biome', 'tsc', 'vitest'],
  properties: {
    biome: { type: 'string', enum: ['ok', 'fail', 'skipped'] },
    tsc: { type: 'string', enum: ['ok', 'fail', 'skipped'] },
    vitest: { type: 'string', enum: ['ok', 'fail', 'skipped'] },
  },
}

const PRIMITIVES_SCHEMA = {
  type: 'object',
  required: ['files', 'exports', 'checks', 'notes'],
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    exports: { type: 'array', items: { type: 'string' }, description: 'nome e assinatura resumida de cada export' },
    checks: CHECKS_SCHEMA,
    notes: { type: 'string' },
  },
}

const SECTION_SCHEMA = {
  type: 'object',
  required: ['file', 'testFile', 'kind', 'exportName', 'usedPrimitives', 'localFallbacks', 'checks', 'notes'],
  properties: {
    file: { type: 'string' },
    testFile: { type: 'string' },
    kind: { type: 'string', enum: ['server', 'client', 'mixed'] },
    exportName: { type: 'string', description: 'nome do export principal (ex.: HeroSection) e se e default ou nomeado' },
    usedPrimitives: { type: 'array', items: { type: 'string' } },
    localFallbacks: { type: 'array', items: { type: 'string' }, description: 'coisas que o brief pedia como primitivo e foram implementadas localmente' },
    checks: CHECKS_SCHEMA,
    notes: { type: 'string', description: 'textos TODO para site.ts, desvios do brief e por que' },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['status', 'issues', 'fixesApplied', 'checks', 'summary'],
  properties: {
    status: { type: 'string', enum: ['ok', 'fixed', 'blocked'] },
    issues: { type: 'array', items: { type: 'string' } },
    fixesApplied: { type: 'array', items: { type: 'string' } },
    checks: CHECKS_SCHEMA,
    summary: { type: 'string' },
  },
}

const COMPOSE_SCHEMA = {
  type: 'object',
  required: ['files', 'build', 'buildErrors', 'notes'],
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    build: { type: 'string', enum: ['ok', 'fail', 'skipped'] },
    buildErrors: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
}

function isInteractive(file) {
  return /(accordion|dialog|lead-form|leadform|form|sheet|drawer|menu|segmented)/i.test(file)
}

// Grupos: "base" roda antes (os outros importam Button etc.); os demais em paralelo.
const groupKeyOf = (p) => p.group || (isInteractive(p.file) ? 'interativos' : 'base')
const groupMap = new Map()
for (const p of primitives) {
  const k = groupKeyOf(p)
  if (!groupMap.has(k)) groupMap.set(k, { key: k, files: [] })
  groupMap.get(k).files.push(p)
}
const baseGroup = groupMap.get('base')
const otherGroups = [...groupMap.values()].filter((g) => g.key !== 'base')

function primitivesPrompt(group) {
  return [
    'Voce e um engenheiro frontend senior. Sua tarefa: implementar os PRIMITIVOS de UI compartilhados abaixo, exatamente com a API descrita na secao 4 (e 9.2 para o TrailCluster) de docs/design-brief.md, com testes unitarios (Vitest + Testing Library) em arquivo irmao *.test.tsx. Escreva o teste antes do componente. Outros agentes implementam o restante dos primitivos; nao toque nos arquivos deles. Os primitivos do grupo "base" (button, badge, container, section, section-heading, reveal, marquee, section-skeleton) ja existem quando voce roda, se o seu grupo nao for o base: importe-os em vez de recriar.',
    '',
    'SEUS ARQUIVOS:',
    ...group.files.map((p) => '- ' + p.file + ': ' + p.purpose),
    '',
    COMMON,
    '',
    'Detalhes: Button com variantes e tamanhos via class-variance-authority e asChild via @radix-ui/react-slot; Accordion e Dialog com @radix-ui/react-accordion e @radix-ui/react-dialog (acessiveis por padrao, com animacoes de entrada/saida curtas); LeadForm com estados (idle, enviando, sucesso, erro), validacao no cliente reutilizando leadSchema de src/lib/leads.ts (z.safeParse) com mensagens em portugues, honeypot (campo "website" invisivel, tabIndex -1, autoComplete off), plano pre-selecionado por prop, POST JSON para /api/leads e mensagens de erro amigaveis (400 -> "Revise os campos", 429 -> "Muitas tentativas, aguarde", outros -> "Nao foi possivel enviar, tente novamente ou escreva para <e-mail de site.contact.email>"). Reveal deve usar useInView({ once: true, amount: 0.25 }) e m.div com variants configuraveis (direcao, delay, distancia) e degradar para visivel quando reduced-motion. Marquee em CSS (animate-marquee) com duplicacao de conteudo e pausa no hover, aria-hidden na copia.',
    'Ao final, retorne a lista de arquivos, os exports com assinatura resumida, o resultado das checagens e notas.',
  ].join('\n')
}

function sectionPrompt(section) {
  return [
    'Voce e um engenheiro frontend senior com olho de designer de motion. Sua tarefa: implementar UMA secao da landing page do Moorah Telemedicina, seguindo a especificacao dessa secao em docs/design-brief.md (layout, visual, motion, estados, acessibilidade e testes sugeridos). Outros agentes implementam as demais secoes em paralelo.',
    '',
    'SECAO: ' + section.id + ' (spec em docs/design-brief.md, item ' + (section.briefRef || '5.x') + ')',
    'ARQUIVOS QUE VOCE PODE CRIAR/EDITAR: ' + (section.files || [section.file]).join(', ') + ' e os testes irmaos *.test.tsx desses arquivos, mais ' + (section.e2e || 'tests/e2e/' + section.id + '.spec.ts') + ' (Playwright, 1 a 2 assercoes; nao rode o Playwright, so escreva).',
    'ARQUIVO PRINCIPAL: ' + section.file + ' com export nomeado exatamente: export function ' + section.exportName + '()',
    'TIPO PREVISTO: ' + section.kind,
    'PRIMITIVOS PREVISTOS: ' + (section.dependsOn || []).join(', '),
    'RESUMO: ' + section.summary,
    '',
    COMMON,
    '',
    'Processo: (1) leia o brief (secoes 2, 3, 4, 5.0 e a sua) e os primitivos existentes em src/components/ui; (2) escreva o teste primeiro (2 a 4 assercoes conforme o brief); (3) implemente; (4) rode as checagens; (5) retorne o resultado. O export principal nao tem props obrigatorias, para a composicao importa-lo direto. A secao (exceto header, footer e barra mobile) e um <Section id="..."> do primitivo, com o h2 recebendo id e a section aria-labelledby apontando para ele. Capriche: esta pagina precisa parecer feita a mao, com hierarquia forte, espacamento generoso e a interacao assinatura do brief implementada de verdade, nao simplificada.',
  ].join('\n')
}

function reviewPrompt(section, built) {
  return [
    'Voce e revisor senior (frontend, acessibilidade, marca). Revise a secao implementada por outro agente contra docs/design-brief.md e CLAUDE.md, e CORRIJA voce mesmo o que for pequeno ou medio (edite o arquivo). So marque "blocked" se a secao precisar ser refeita.',
    '',
    'SECAO: ' + section.id + ' (spec em docs/design-brief.md, item ' + (section.briefRef || '5.x') + ')',
    'ARQUIVOS DA SECAO: ' + (section.files || [section.file]).join(', ') + ' (+ testes irmaos e ' + (section.e2e || 'tests/e2e/' + section.id + '.spec.ts') + ')',
    'EXPORT ESPERADO: ' + section.exportName + ' em ' + section.file,
    'RESULTADO DO CONSTRUTOR (JSON): ' + JSON.stringify(built),
    '',
    COMMON,
    '',
    'CHECKLIST (verifique cada item lendo o codigo):',
    '1. Nenhum travessao (U+2014) no arquivo nem no teste (busque pelo caractere).',
    '2. Nenhum motion.* (deve ser m.*); "use client" apenas se necessario; nenhum hook em server component.',
    '3. Textos: vem de site.ts ou estao marcados com TODO; sem jargao (alavancar, transformador, fluido, destravar, otimizar, robusto, sinergia); sem emoji; sem numeros inventados; sem promessa de cobertura de plano de saude.',
    '4. Acessibilidade: section com id e aria-labelledby apontando para o h2; um unico h1 so no hero; icones decorativos aria-hidden; botoes com texto ou aria-label; foco visivel nao removido; aria-expanded em toggles; imagens com alt.',
    '5. Fidelidade ao brief: layout desktop/mobile, superficie (light/soft/plum), interacao assinatura presente, motion com duracao/easing do sistema, sem loops infinitos em texto, reduced-motion respeitado.',
    '6. Tokens: classes do tema (berry, leaf, gray, ink, lilac, font-display...) em vez de hex ou cores Tailwind padrao (zinc, slate, purple...).',
    '7. Responsividade: nada quebra em 360px de largura (sem larguras fixas grandes, grids com breakpoints, textos com tamanhos por breakpoint).',
    '8. Testes: existem, cobrem o essencial e passam.',
    'Depois de corrigir, rode as checagens (biome, tsc, vitest do arquivo) e retorne status, issues encontradas, correcoes aplicadas e resultado das checagens.',
  ].join('\n')
}

function composePrompt(sectionResults) {
  return [
    'Voce e o engenheiro responsavel por compor a pagina final da landing do Moorah Telemedicina e criar as paginas auxiliares. Todas as secoes ja existem em src/components/sections (lista abaixo, com os exports reais). Leia docs/design-brief.md (secao "Composicao da pagina" e "Paginas auxiliares"), CLAUDE.md e cada arquivo de secao para conferir o nome do export.',
    '',
    'SECOES CONSTRUIDAS (JSON): ' + JSON.stringify(sectionResults),
    '',
    COMMON,
    '',
    'TAREFAS:',
    '1. Reescreva src/app/page.tsx: importe e renderize as secoes na ordem do brief dentro de <main id="conteudo">; header antes do main e footer depois; barra de CTA fixa no mobile se o brief previr (data-testid="cta-mobile"); secoes pesadas abaixo da dobra via next/dynamic (sem ssr:false em server components; se precisar de ssr:false, faca em um client wrapper). Inclua um link "Pular para o conteudo" (skip link) visivel no foco. Adicione JSON-LD (schema.org Organization + Product/Offer com os dois planos a partir de site.ts) via <script type="application/ld+json"> com JSON.stringify.',
    '2. Crie src/app/loading.tsx com skeleton da marca (classes skeleton) para hero e cards.',
    '3. Crie src/app/not-found.tsx no estilo da marca com link para a home.',
    '4. Crie src/app/termos/page.tsx e src/app/privacidade/page.tsx como paginas simples com metadata propria, titulo, aviso "Documento em elaboracao" e resumo honesto dos pontos que serao cobertos (sem inventar clausulas), reutilizando header e footer se forem componentes independentes.',
    '5. Rode: npx.cmd biome check --write . ; npx.cmd tsc --noEmit -p tsconfig.json ; npx.cmd vitest run --maxWorkers=1 (todos os testes; se der timeout de worker, rode por arquivo) ; e por fim npm.cmd run build (pode levar alguns minutos). Corrija erros de build que estejam em qualquer arquivo do projeto, mantendo a intencao do autor. Relate os erros que nao conseguiu resolver.',
    'Retorne a lista de arquivos criados/alterados, o status do build, erros restantes e notas.',
  ].join('\n')
}

phase('Primitivos')
log('base: ' + (baseGroup ? baseGroup.files.length : 0) + ' arquivos | ' + otherGroups.map((g) => g.key + ': ' + g.files.length).join(' | '))
const primResults = []
if (baseGroup) {
  const base = await agent(primitivesPrompt(baseGroup), { label: 'ui:base', phase: 'Primitivos', schema: PRIMITIVES_SCHEMA, effort: 'high' })
  if (base) primResults.push(base)
}
const others = (
  await parallel(
    otherGroups.map((g) => () =>
      agent(primitivesPrompt(g), { label: 'ui:' + g.key, phase: 'Primitivos', schema: PRIMITIVES_SCHEMA, effort: 'high' }),
    ),
  )
).filter(Boolean)
primResults.push(...others)
log('primitivos prontos: ' + primResults.flatMap((r) => r.files).length + ' arquivos')

phase('Secoes')
log(sections.length + ' secoes: ' + sections.map((s) => s.id).join(', '))
const sectionResults = await pipeline(
  sections,
  (s) => agent(sectionPrompt(s), { label: 'secao:' + s.id, phase: 'Secoes', schema: SECTION_SCHEMA, effort: 'high' }),
  (built, s) => {
    if (!built) throw new Error('construtor falhou: ' + s.id)
    return agent(reviewPrompt(s, built), { label: 'revisao:' + s.id, phase: 'Secoes', schema: REVIEW_SCHEMA, effort: 'medium' }).then(
      (review) => ({ section: s.id, file: s.file, built, review }),
    )
  },
)
const okSections = sectionResults.filter(Boolean)
const failed = sections.filter((s) => !okSections.find((r) => r.section === s.id)).map((s) => s.id)
if (failed.length) log('SECOES SEM RESULTADO: ' + failed.join(', '))
const blocked = okSections.filter((r) => r.review && r.review.status === 'blocked').map((r) => r.section)
if (blocked.length) log('SECOES BLOQUEADAS NA REVISAO: ' + blocked.join(', '))

phase('Composicao')
const compose = await agent(
  composePrompt(okSections.map((r) => ({ id: r.section, file: r.file, exportName: r.built.exportName, kind: r.built.kind, reviewStatus: r.review ? r.review.status : 'sem revisao' }))),
  { label: 'composicao:page', phase: 'Composicao', schema: COMPOSE_SCHEMA, effort: 'high' },
)

return {
  primitives: primResults,
  sections: okSections.map((r) => ({
    id: r.section,
    file: r.file,
    kind: r.built.kind,
    checks: r.built.checks,
    review: r.review ? { status: r.review.status, issues: r.review.issues, fixes: r.review.fixesApplied } : null,
    notes: r.built.notes,
    localFallbacks: r.built.localFallbacks,
  })),
  failed,
  blocked,
  compose,
}
