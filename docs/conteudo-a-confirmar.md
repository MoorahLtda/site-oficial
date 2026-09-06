# Conteudo a confirmar antes de publicar

Itens que o site afirma hoje e que precisam de validacao do time Moorah. Cada item aponta o
lugar em `src/content/site.ts` ou a variavel de ambiente que controla o texto.

## Precos e regras comerciais

- **Precos**: R$ 49,90 (Individual) e R$ 129,90 (Familiar, ate 4 pessoas; confirmado pelo cliente em 04/09/2026, antes era R$ 97,90 da apresentacao). Origem original: apresentacao
  comercial de 02/07/2026. Ajuste em `plans[].priceCents`.
- **Carencia / fidelidade / cancelamento**: o FAQ afirma "sem carencia, assinatura mensal,
  cancela quando quiser". Confirmar a regra real (`faq`).
- **Sem taxa de adesao**: afirmado em `planNotes`. Confirmar.
- **Dependentes**: "titular + 3 dependentes". Confirmar se ha regra de parentesco ou idade.
- **Consultas ilimitadas em qualquer especialidade**: premissa dada pelo Filipe em 01/09/2026.
  Confirmar se ha limite de agendamentos simultaneos ou politica de no-show.
- **Disponibilidade 24h**: a apresentacao cita "Telemedicina 24h". Confirmar se o agendamento
  cobre madrugada/fins de semana antes de manter a afirmacao no hero.

## Dados da empresa

- **CNPJ**: ainda nao existe (contexto do vault, jun/2026). Rodape mostra a linha so quando
  `NEXT_PUBLIC_CNPJ` estiver preenchida.
- **Dominio**: o vault fala em `morah.com.br`; a apresentacao usa `moorah.com.br`. O site usa
  `NEXT_PUBLIC_SITE_URL` (padrao `https://moorah.com.br`).
- **E-mail comercial**: `comercial@moorah.com.br` (apresentacao). `NEXT_PUBLIC_CONTACT_EMAIL`.
- **WhatsApp**: bloqueado por falta de CNPJ (Meta). Botoes so aparecem com `NEXT_PUBLIC_WHATSAPP`.
- **Portal do paciente**: botao "Entrar" so aparece com `NEXT_PUBLIC_APP_URL`.

## Fotografias

- As fotos do site (`photos` em `src/content/site.ts`) sao do **Pexels** (licenca livre para uso
  comercial, sem atribuicao obrigatoria) e servem como placeholder ate a Moorah ter fotos proprias ou
  licenciadas com pessoas brasileiras. Substituir trocando as URLs do manifesto; medidas e `alt` estao
  documentados por foto. O rodape traz a linha "Fotografias ilustrativas (Pexels)".
- Nao ha foto de farmacia: as opcoes encontradas tinham marca estrangeira visivel ou mascara. A celula
  Farmacias segue com o mock de interface.

## Assets da marca

- **Export maior do simbolo.** `public/brand/moorah-mark.png` tem 194x265 px, a maior versao
  disponivel (conferi tambem o design system e os extratos do manual). Por isso as marcas d'agua do
  rodape e do CTA final estao limitadas a 265 px de altura: acima disso o navegador amplia o PNG.
  Com um SVG ou um PNG de pelo menos 900 px de altura elas podem ficar bem maiores, como o brief
  previa. Vale pedir ao designer o simbolo em SVG, que resolve qualquer tamanho.
- Wordmark tem 518x82 px e atende todos os usos atuais.

## Rede e provas sociais

- **Farmacias, laboratorios e lojas parceiras**: o site fala em "rede parceira" sem citar nomes.
  Quando houver contratos, incluir logos com autorizacao.
- **Depoimentos e numeros de pacientes**: nao incluidos de proposito (nao inventar). Adicionar
  quando existirem dados reais.
- **Corpo medico**: sem nomes ou CRMs. Quando houver, a Resolucao CFM 2.314/2022 exige
  identificacao do medico na consulta, nao necessariamente no site.

## Juridico

As tres paginas legais existem e estao publicadas em `/termos`, `/privacidade` e `/lgpd`
(conteudo em `src/content/legal/`). **Sao minutas, versao 0.1, e cada pagina exibe um aviso de
"Minuta para revisao juridica".** Nada de CNPJ, endereco, telefone ou nome de encarregado foi
inventado: onde o dado nao existe, o texto e condicional ao campo de `site.ts`.

O que so um advogado pode fechar, por ordem de risco:

1. **Caracterizacao como operadora.** Os Termos afirmam que a assinatura nao oferece cobertura
   assistencial na forma da Lei 9.656/1998 e que a Moorah nao tem registro na ANS. Consultas
   ilimitadas por mensalidade ja foram questionadas como caracterizacao de operadora. Vale parecer
   especifico antes de vender.
2. **Responsabilidade pelo ato medico.** Os Termos separam o ato medico da intermediacao
   tecnologica sem afastar o Codigo de Defesa do Consumidor. A solidariedade do fornecedor na cadeia
   de consumo e tema de advogado.
3. **Arrependimento em 7 dias.** A minuta garante devolucao integral mesmo se o assinante ja
   consultou no periodo. E a leitura mais protetiva do art. 49 do CDC, mas e decisao comercial.
4. **Efeito do cancelamento.** A minuta oferece duas alternativas (acesso ate o fim do periodo pago
   ou encerramento imediato com devolucao proporcional) e manda aplicar a mais favoravel. Precisa de
   uma regra unica.
5. **Encarregado de dados** (LGPD, art. 41, par. 1): nao existe pessoa indicada. Os documentos
   prometem publicar o nome antes do lancamento e usam `NEXT_PUBLIC_DPO_EMAIL`, que hoje cai no
   e-mail comercial. Criar canal proprio de privacidade.

Termos comerciais escritos de forma condicional nas minutas, que devem ser confirmados e depois
afirmados: taxa de adesao; indice e periodicidade de reajuste; prazos de suspensao e encerramento
por inadimplencia; prazo de devolucao no arrependimento e no cancelamento; carencia e fidelidade;
limite de agendamentos simultaneos e politica de falta sem aviso; elegibilidade de dependentes
(parentesco, idade, residencia e o limite de 3); compensacao por indisponibilidade prolongada;
aviso previo de 30 dias para alterar os Termos ou descontinuar o servico; prazo de guarda de
prontuario; prazo de retencao do cadastro apos o cancelamento; prazo de resposta de 15 dias para os
direitos do titular alem de acesso.

Afirmacoes tecnicas que as minutas escrevem como fato e que a engenharia precisa confirmar:
criptografia em repouso; registros de auditoria de acesso a dados de saude; infraestrutura de nuvem
exclusivamente no Brasil; ausencia de transferencia internacional; ausencia de gravacao do
audiovisual da consulta; cookies apenas de sessao, seguranca e preferencias; lista de operadores
(processador de pagamento, provedor de e-mail e mensagens, assinatura digital, gestao de contatos);
dado exato trocado com farmacias, laboratorios e lojas no uso do Cartao Moorah (hoje: numero
apresentado mais confirmacao de assinatura ativa).

Funcionalidades que os documentos passam a prometer e que o produto precisa entregar:

- Consentimento do dependente maior de idade para o titular ver dados clinicos dele, registrado no
  portal e revogavel.
- Canal para exercer os direitos da LGPD com resposta em 15 dias.

Ajuste pendente no site: o FAQ afirma "So voce e o medico que atende tem acesso ao seu prontuario",
mais absoluto que a Politica de privacidade, que divulga excecoes reais (equipe tecnica quando
indispensavel e com registro de acesso, ordem judicial, autoridade sanitaria). Alinhar os dois.

## Leads

- O formulario envia para `POST /api/leads`. Sem `LEAD_WEBHOOK_URL`, o lead so vai para o log do
  servidor. Definir destino (e-mail via SES, CRM, planilha) antes de divulgar.

## Vindos do brief de design (docs/design-brief.md, secao 12.2)

- **Numeracao do Cartao Moorah**: formato real (prefixo, digito verificador). Os exemplos
  `1000 2000 3000` a `3003` em `mocks.cardSamples` sao ilustrativos e ficam fora de qualquer faixa
  de cartao bancario.
- **Aprovacao de marca do motivo "Trilha da Amora"**: hub central + 12 nos ligados por trilhas de
  circuito em 45 graus, sem calice e sem contorno de fruta (o simbolo oficial aparece so em header,
  footer e 404). Aprovar antes de investir em acabamento adicional do hero.
- **Valores por pessoa intermediarios** (2 pessoas = R$ 64,95; 3 pessoas = R$ 43,30) aparecem no
  seletor de pessoas da secao Planos. Para esconder, basta remover as opcoes 2 e 3 do seletor em
  `plan-selector.tsx`.
- **Painel "Incluido na assinatura / Nao esta incluido"** (`plansSection`) e as frases "nao e plano
  de saude": revisar com juridico, em especial o item sobre custo de exames e medicamentos.
- **Mocks do portal, farmacia e rede de exames** sao ilustrativos; alinhar com as telas reais do
  produto antes do lancamento.
- **Contraste**: `gray-500`, `leaf-500` e `critical-500` nunca sao usados como texto pequeno (falham
  AA); se a marca pedir outro uso, e preciso trocar o tom.

## Secoes v4, fase 0 (05/09/2026, brief docs/design-brief-v4-secoes.md)

- **Foto nova `pessoaCasa`** (secao Por que): Pexels 4259710, "Mother and Daughter Preparing
  Avocado Toast", de August de Richelieu. Original 3337x5000 (2:3); CDN verificado em `w=1600`
  (HTTP 200, image/jpeg, 1600x2397). Alt em portugues no manifesto: "Mae e filha preparando um
  lanche juntas na mesa da cozinha, com luz natural da janela." Atende aos criterios da secao 6 do
  brief: cena cotidiana em casa, sem celular/tablet/notebook, luz natural, olhar fora da camera,
  sem marcas, neutros quentes, corte 4:5 com ar acima da cabeca. Placeholder Pexels como as demais.
- **Chaves de `photos` do hero v4: resolvido na integracao final.** O hero usa `heroCasa` e a
  variante de preview usa `heroFamilia`; `pessoaCasa` nao repete pessoa nem cenario. Detalhes na
  secao "Secoes v4, integracao final" no fim deste documento.
- **Seletor "Para quantas pessoas?" e badge "Mais escolhido" saem de Planos** no pacote C (brief,
  4.5): o seletor produz valores por pessoa que nao sao oferta (R$ 64,95 e R$ 43,30) e o badge
  afirma preferencia que ainda nao existe. Confirmar com o comercial (pergunta 2 da secao 9).
- **Painel "Nao esta incluido" perdeu "Cobertura de plano de saude"** (aviso regulatorio em forma
  de bullet) e "Pronto-socorro e emergencias" virou "Atendimento de urgencia e emergencia" (fase 0,
  ja em `plansSection.notIncluded`). O juridico precisa dizer se o painel sem essa linha ainda
  protege a empresa (pergunta 3 da secao 9 do brief).
- **Pergunta nova no FAQ**: "Meus dados de saude estao protegidos?", com link para
  `/privacidade`. Substitui o beneficio "Seguranca de verdade". A resposta afirma so sigilo
  medico e nao cita criptografia nem infraestrutura no Brasil, que a engenharia ainda precisa
  confirmar (lista de afirmacoes tecnicas na secao Juridico acima).
- **Chaves de `photos` que ficam sem uso nas secoes** depois da rodada v4: `medicaSorrindo`,
  `medicaHeadset`, `exame`, `pacienteCama`, `familiaSofa`, `familiaCasa`, `medicoVideo`
  (e `heroPaciente`, se o hero nao usar). Nao remover antes de o hero fechar as chaves dele;
  limpeza depois do hero.
- **Decisao de 04/09 sobre "nao e plano de saude" nunca chegou ao codigo**: nao existe
  `legalNotes` em `src`, nem a frase no rodape ou no FAQ. Foi superada pelo veto de 05/09 a
  qualquer aviso regulatorio no corpo da pagina; a frase vive nos Termos de uso e na Politica de
  privacidade. A pergunta 3 da secao 9 do brief pede ao juridico se ela precisa voltar em algum
  lugar da pagina.

## Hero v3 (Constelacao de cuidado, 03/09/2026)

- **`hero.moments` e o tipo `HeroMoment`** ficam sem uso; `heroDynamic.events[].label/text/icon`
  ficam sem uso no hero (so `node` e lido, como cadencia da rede). Manter por enquanto; remover em
  rodada de conteudo.
- **`src/app/loading.tsx`** desenha um esqueleto de hero claro; em navegacao cliente ha salto de claro
  para plum. Ajustar o esqueleto quando o hero estabilizar.
- **Fotos dos discos** sao placeholders do Pexels; em circulo pequeno a cara de banco de imagens
  aparece mais. Fotos proprias enquadradas para circulo (rosto centrado, fundo limpo) melhoram muito.
- **`medicaHeadset`** repete a foto do CTA final. Alternativa: `medicoVideo` com objectPosition
  ~45% 35%, conferindo o recorte.
- **Header transparente sobre plum** so fica em risco se o `pt` do hero cair abaixo da altura do
  header + 16 px (64 / 96 / 104 px hoje, com a faixa legal em md+). Documentado em `hero.tsx`.

## Decisoes do cliente em 04/09/2026

- **Familiar a R$ 129,90 para ate 4 pessoas** (antes R$ 97,90). Aplicado em `plans[]`; valor por
  pessoa no seletor recalculado (4 pessoas = R$ 32,48; 2 pessoas = R$ 64,95).
- **"Nao e plano de saude" sai do hero e das secoes de venda** (o cliente considera redundante).
  Continua no rodape (`legalNotes`), na resposta do FAQ e nos Termos de uso, por seguranca
  regulatoria (ANS). Se o cliente quiser tirar tambem do rodape, e uma linha em `site.ts`.
- **Especialidades**: o cliente quer a lista baseada na Click Life, parceira que vai operar a parte
  medica. O site publico da Click Life nao publica a lista (so "medicos, psicologos, nutricionistas
  e muito mais" e pronto atendimento 24h); os Termos de uso deles dizem que as especialidades ficam
  "em locais visiveis na Plataforma", ou seja, dentro do app. Pendente: o cliente enviar a lista (ou
  captura do app) para ajustarmos `specialties` em `site.ts`. Nao citar o nome da parceira na pagina
  sem autorizacao.
- **Fotos**: podem ser de pessoas brasileiras (Pexels serve como placeholder). Fundo do hero
  continua o bloco plum. Sem video.

## Hero v4 (Em casa, com medico, 05/09/2026)

- **Fotos do hero** sao placeholders do Pexels, verificadas no CDN em `w=1920` (HTTP 200,
  image/jpeg, 1920x1280): `heroCasa` 17489833 (Sandro Tavares; hero principal), `heroFamilia`
  27176483 (Helena Lopes, Belo Horizonte; variante `/previews/hero-alt`), `heroMaeFilha` 8259883
  (alternativa de familia para o hero principal e candidata a Planos) e `heroSenior` 27086767
  (Helena Lopes; publico 60+, candidata a Planos ou Especialidades). O rodape mantem
  "Fotografias ilustrativas (Pexels)". Foto propria com gente brasileira em casa e a troca que mais
  muda o resultado; o layout aceita a troca mudando so a chave em `photos`.
- **Idade da modelo de `heroCasa`**: 30 e poucos anos, enquanto o publico declarado e 40 a 55 ou
  pai/mae com crianca. Duas buscas adicionais no Pexels nao trouxeram nada melhor. Se o cliente
  preferir familia no principal, `heroMaeFilha` e a troca de uma chave (ver brief v4, secao 4).
- **Trilha da Amora saiu do hero** (continua em Especialidades e Contato). O cliente elogiou o
  elemento na v1: avisar explicitamente.
- **`hero-network.tsx`, `hero-rotating.tsx` e `hero-marquee.tsx` foram removidos**; as chaves v3 de
  `site.ts` (`hero.eyebrow`, `priceLine`, `trust`, `proofChips`, `clusterAlt`, `moments`,
  `heroDynamic`, `HeroEvent`, `HeroMoment`) tambem ja sairam, junto com a limpeza final do brief v4.
- **Fade da foto em CSS** comeca no primeiro paint e nao espera a imagem: em rede lenta a foto
  aparece sem transicao. Aceito em troca de zero JS no hero.

## Secoes v4, integracao final (05/09/2026, brief docs/design-brief-v4-secoes.md, secao 7)

- **Chaves de `photos` do hero v4 (pendencia da fase 0): respondida pelo codigo.** O hero usa
  `heroCasa` (`hero.tsx`) e `heroFamilia` (variante `/previews/hero-alt`); `heroMaeFilha` e
  `heroSenior` ficam como alternativas registradas no manifesto, sem consumidor. Fora do hero a
  pagina tem duas fotos: `pessoaCasa` em Por que e `idosoTablet` em Como funciona. Nenhuma
  repeticao de pessoa ou cenario.
- **Chaves de `photos` orfas ja sairam do manifesto**: `medicaSorrindo`, `medicaHeadset`, `exame`,
  `pacienteCama`, `familiaSofa`, `familiaCasa`, `medicoVideo` e `heroPaciente` nao existem mais em
  `PhotoKey`. Restam seis chaves, todas verificadas no CDN.
- **`plansSection.coversOne` ("Cobre 1 pessoa.") removido.** O card do Individual passou a mostrar
  `plans[0].peopleLabel` ("1 pessoa"), a alternativa que o proprio brief (4.5) previa; o campo
  ficou sem consumidor.
- **`@keyframes pulse-once` removido de `globals.css`** (sem consumidor desde que o card de
  emergencia da v1 saiu). Ficam como orfaos autorizados pelo brief os keyframes `comet`, `drift`,
  `float`, `float-slow` e `marquee`.
- **Orfaos que ficam de pe, por decisao do time do hero**: `src/components/icons.tsx` (com
  `IconKey` em `site.ts`), `src/components/ui/trail-cluster.tsx` e `src/components/ui/marquee.tsx`
  nao tem nenhum consumidor na pagina depois da v4. Nenhum deles entra no bundle. A decisao de
  apagar os tres (e `IconKey` junto) e do time do hero; a lista fechada da secao 7 do brief so
  autoriza `icons.tsx` a ficar orfao.
- **`knip` nao foi instalado.** A secao 7 do brief pede `knip` como devDependency com `knip.json`
  versionado; a integracao final rodou a varredura de orfaos a mao (grep por consumidor de cada
  campo, chave de foto e keyframe). Instalar o knip continua pendente e vale como rede para as
  proximas rodadas.
- **Titulo do dialog de Planos** continua em `plan.cta` ("Assinar Familiar") sobre o formulario de
  contato, como o brief manda ate a pergunta 7 da secao 9 fechar o texto. A troca para
  `ui.leadForm.title` com o nome do plano na descricao e uma linha em `ui/lead-dialog.tsx` mais o
  teste.
- **Barra de CTA mobile sobre o fim do bloco de Beneficios**: medido em 360 e 390. O ultimo item
  ("Portal do paciente") passa por baixo da barra durante a rolagem, como qualquer conteudo passa
  por baixo de uma barra fixa, e fica inteiro acima dela por cerca de 180 px de rolagem antes de a
  barra sumir em `#planos` (medido: item em 587..689 com a barra em 711). O `pb-24` que o brief
  (4.9) sugeria nao foi aplicado: como a barra so some com 5 % de `#planos` em vista, aumentar o
  fundo do bloco adia o desmonte da barra e mantem a sobreposicao transitoria.
- **`scroll-mt-20` (80 px) das secoes e menor que o header fixo em `lg` (104 px)**: ao chegar por
  ancora (`/#planos`), o topo da secao fica cerca de 24 px atras do header. E anterior a esta
  rodada e vive em `ui/section.tsx`; corrigir com `scroll-mt-28 lg:scroll-mt-32` na proxima
  rodada que tocar em `ui/`.
- **Alturas dos `SectionSkeleton` em `page.tsx` remedidas** com a pagina v4 (Beneficios 1353 / 1034
  / 930 px, Planos 2390 / 1431, Duvidas 1076 / 932, Contato 1168 / 891 / 871, nas larguras 390 /
  1024 / 1440). Remedir sempre que a copy ou o layout de uma secao dinamica mudar.
