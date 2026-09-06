# Moorah Telemedicina - Landing page

Site institucional e de captacao do Moorah Telemedicina: assinatura mensal com consultas
medicas online ilimitadas, em qualquer especialidade, nos planos Individual e Familiar, com
Cartao Moorah de beneficios (farmacias, exames e lojas parceiras).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 com tokens da marca em `src/app/globals.css`
- motion (framer) para animacoes, lucide-react para icones, Radix para accordion e dialog
- Fontes auto-hospedadas (Fontsource): Plus Jakarta Sans e Manrope (sem fonte mono na interface)
- Qualidade: Biome, Commitlint, Vitest + Testing Library, Playwright + axe-core

## Como rodar

Pre-requisito: Node.js 20.9 ou superior.

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:3000. No PowerShell, use `npm.cmd` no lugar de `npm`.


## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm run start` | build e servidor de producao |
| `npm run lint` / `npm run lint:fix` | Biome (lint + formatacao) |
| `npm run typecheck` | gera tipos do Next e roda `tsc` |
| `npm run test` | testes unitarios (Vitest) |
| `npm run test:e2e` | testes end-to-end (Playwright, usa o Edge instalado) |
| `npm run check` | lint + typecheck + testes unitarios |
| `npm run audit:deps` | `npm audit` com nivel high |
| `npm run shots` | captura a home por secao, no desktop e no mobile, em `.shots/` |
| `npm run shots:legal` | captura /termos, /privacidade e /lgpd em `.shots/` |
| `npm run check:overflow` | aponta o que causa rolagem horizontal em 390 e 360 px |

Os tres ultimos precisam de um servidor em http://localhost:3000 e usam o Edge instalado na
maquina, sem baixar navegador.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha. Nenhuma variavel e obrigatoria para rodar
localmente; contatos, WhatsApp, CNPJ e link do portal so aparecem quando definidos.

## Estrutura

```
src/app/                 rotas, layout, metadata, icones, imagem OG, API de leads
src/components/sections  secoes da landing
src/components/ui        primitivos reutilizaveis
src/components/providers provedores (motion)
src/content/site.ts      todo o conteudo (textos, precos, listas)
src/lib                  utilitarios e regras de negocio (leads)
tests/e2e                Playwright
docs/                    brief de design e conteudo a confirmar
public/brand             logos e arte do cartao
```

## Convencoes

Leia `CLAUDE.md`: regras de marca, escrita (sem travessao), acessibilidade, performance e fluxo
de trabalho (Conventional Commits, TDD, issues e PRs quando houver repositorio remoto).

## Publicacao

O site e um app Next.js com rota de API (`/api/leads`), otimizacao de imagens e cabecalhos de
seguranca. Essas tres coisas precisam de servidor, entao ha dois destinos com papeis diferentes.

### Producao: host com servidor Node

Recomendado: Vercel, que e de quem faz o Next e le o repositorio do GitHub direto.

1. Entre em vercel.com com a conta do GitHub e escolha "Add New > Project".
2. Importe `MoorahLtda/site-oficial`. O Next e detectado sozinho; nao mude build nem output.
3. Em Environment Variables, preencha o que estiver em `.env.example` que ja existir
   (contato, WhatsApp, CNPJ, `LEAD_WEBHOOK_URL` e `LEAD_WEBHOOK_SECRET`).
4. Deploy. Cada push na `main` publica de novo e cada pull request ganha uma URL propria.
5. Dominio: em Settings > Domains, aponte `moorah.com.br` (a Vercel mostra os registros de DNS).

Nada no codigo muda para isso.

### Previa: GitHub Pages

`.github/workflows/pages.yml` gera uma versao estatica e publica em
https://moorahltda.github.io/site-oficial/. Serve para mostrar o site, nao para receber cliente.

Para ligar: em Settings > Pages, mude "Source" de "Deploy from a branch" para **GitHub Actions**.
Servir a branch direto nao funciona, porque o repositorio guarda codigo-fonte e nao um site
pronto (nao existe `index.html` na raiz).

O que a previa perde, por ser so arquivo estatico: o formulario nao envia (a rota de API sai do
build), as fotos vao sem otimizacao e nao ha cabecalhos de seguranca. Por isso ela sobe com
`robots.txt` bloqueando buscadores.

## Antes de publicar

Revise `docs/conteudo-a-confirmar.md`: precos, regras comerciais, dados da empresa, destino dos
leads e textos juridicos.
