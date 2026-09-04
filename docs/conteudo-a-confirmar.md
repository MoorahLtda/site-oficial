# Conteudo a confirmar antes de publicar

Itens que o site afirma hoje e que precisam de validacao do time Moorah. Cada item aponta o
lugar em `src/content/site.ts` ou a variavel de ambiente que controla o texto.

## Precos e regras comerciais

- **Precos**: R$ 49,90 (Individual) e R$ 97,90 (Familiar, ate 4 pessoas). Origem: apresentacao
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
- **Valores por pessoa intermediarios** (2 pessoas = R$ 48,95; 3 pessoas = R$ 32,63) aparecem no
  seletor de pessoas da secao Planos. Para esconder, basta remover as opcoes 2 e 3 do seletor em
  `plan-selector.tsx`.
- **Painel "Incluido na assinatura / Nao esta incluido"** (`plansSection`) e as frases "nao e plano
  de saude": revisar com juridico, em especial o item sobre custo de exames e medicamentos.
- **Mocks do portal, farmacia e rede de exames** sao ilustrativos; alinhar com as telas reais do
  produto antes do lancamento.
- **Contraste**: `gray-500`, `leaf-500` e `critical-500` nunca sao usados como texto pequeno (falham
  AA); se a marca pedir outro uso, e preciso trocar o tom.

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
