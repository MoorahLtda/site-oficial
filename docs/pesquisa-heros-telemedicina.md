# Heros de telemedicina e saúde por assinatura: padrões de mercado e crítica da página atual

Documento de direção de criação para o redesenho do hero da Moorah. Consolida quatro rodadas de
pesquisa (telemedicina BR, health-techs BR, exterior, saúde por assinatura premium) mais uma rodada
complementar (farmácias, operadoras, marketplaces, LatAm, telepediatria, Europa e as duas referências
de gosto do cliente), e termina com três direções de hero ancoradas em sites reais.

Data da pesquisa: 03/09/2026. Captura da página atual da Moorah: madrugada de 04/09/2026, contra o
servidor de desenvolvimento em `http://localhost:3000` (`.shots/current/`, zero erros de console).

## 1. Método

- 96 URLs tentadas em cinco segmentos; 70 heros de saúde efetivamente vistos, mais 2 referências de
  gosto fora de saúde (curated.design e getlayers.ai). 22 URLs mortas, bloqueadas ou sem hero
  renderizado (lista no fim da seção 2).
- Captura com Playwright (Edge headless) em 1440x900 (clip do hero) e 390 de largura (página inteira
  até 4000 px), sem aceitar cookies, sem preencher formulário, sem login. Quando o site bloqueou,
  ficou registrado como não visto; nada foi descrito de memória.
- Cada captura foi aberta e descrita por um pesquisador; um revisor conferiu 34 fichas contra as
  imagens (33 batiam; a única falha, Vale Saúde desktop, foi recapturada e confirmada). Eu, como
  diretor de criação, abri pessoalmente 32 capturas de referência para formar opinião própria antes
  de escrever: Conexa, dr.consulta, Facilitta, Click Life, Pronto Socorro Online, Einstein, Alice,
  Hilab, Beep, Telavita, Mira, One Medical, Kry (desktop e mobile), Maple, Teladoc, Function
  (desktop e mobile), Superpower, Parsley, Oscar, getlayers, curated.design, Hapvida, Estação
  Unimed, Blueberry, VidaClass, Vale Saúde (desktop e mobile) e Conexa mobile. As demais fichas
  entram nas contagens com o peso da revisão cruzada.
- Página atual da Moorah: `node scripts/screenshots.cjs .shots/current` (1366x900 por seção, mais
  390 de largura em topo, rolado e página inteira), mais as capturas do hero em `.shots/v3/`
  (360 a 1920 de largura, com medidas em `report.json`).
- Os escores "Humano" (1 a 10: quanto parece feito por gente para gente) e "Template" (1 a 10: quanto
  parece tema de agência ou gerado por IA) são juízo de crítica, não medida. Sites não vistos não
  recebem escore.

Caminho base das capturas: `C:\Users\FilipeOliveiraAPSISC\OneDrive - APSIS CONSULTORIA E AVALIACOES LTDA\Área de Trabalho\Filipe\Moorah\.shots\`.
Na tabela, `refs/<segmento>/<slug>-1440.png` é relativo a essa base; cada slug tem também
`<slug>-mobile.png`, salvo indicação.

## 2. Tabela dos sites

Segmentos: TB = telemedicina BR, HB = health-tech BR, EX = exterior, PR = saúde por assinatura
premium (referência de acabamento), CO = complementar (farmácia, operadora, marketplace, LatAm,
pediatria, Europa), GO = referência de gosto do cliente.

| # | Site | Seg. | URL | Captura (1440) | Layout do hero | Imagem | Preço no hero | Humano | Template |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Click Life | TB | clicklifesaude.com | refs/telemedicina-br/clicklife-1440.png | Branco; coluna esquerda vazia (H1 depende de JS e não renderizou), foto recortada à direita, 4 cards de ícone laranja abaixo | Banco recortado: médico jovem de jaleco olhando o celular, cara de IA | Não | 4 | 8 |
| 2 | ClickSaúde | TB | clicksaude.com.br | refs/telemedicina-br/clicksaude-1440.png | Coluna única centralizada sobre foto lavada; timer, preço riscado, checklist, 3 números | Banco lavada a ~85%, vira mancha | Sim (R$ 39,90 no botão, R$ 49,90 riscado) | 3 | 7 |
| 3 | dr.consulta | TB | drconsulta.com | refs/telemedicina-br/drconsulta-1440.png | Cartão arredondado salmão com card de busca de especialidade à esquerda e foto de consulta à direita; carrossel abaixo | Foto própria: médico grisalho e paciente de meia-idade em consultório real | Não (R$ 9,90/mês só em post de blog) | 8 | 3 |
| 4 | Conexa Saúde | TB | conexasaude.com.br | refs/telemedicina-br/conexa-1440.png | Foto full-bleed escura; nav em pill de vidro; prova (4,8 App Store) + H1 light com última linha bold no terço inferior; 2 pills | Ambientada: mulher no sofá com celular, colorimetria de cinema | Não (B2B2C) | 8 | 2 |
| 5 | Docway | TB | docway.com.br | refs/telemedicina-br/docway-1440.png | Slider com setas; gota verde gigante sobre a foto; título de três substantivos | Banco esverdeada, tablet com médica | Não (B2B) | 4 | 6 |
| 6 | Vale Saúde Sempre | TB | valesaudesempre.com.br | refs/complementar/valesaudesempre-1440.png | Faixa azul-escura de ~480 px; H1 + 3 bullets com número em bold + botão retangular magenta; casal à direita com neon em coração | Banco: casal 45-55 com celular; neon desenhado por cima | Não (preços "a partir de" nos cards abaixo) | 6 | 6 |
| 7 | Cartão de TODOS | TB | cartaodetodos.com.br | refs/telemedicina-br/cartaodetodos-1440.png | Slider verde com ondas; garota-propaganda recortada; blocos de preço em 90 px | Estúdio recortada, roupa na cor da marca | Sim (R$ 30 / a partir de R$ 40) | 5 | 4 |
| 8 | TEM Saúde | TB | temsaude.com | refs/telemedicina-br/temsaude-1440.png | Gradiente laranja; dois iPhones inclinados; "Nós somos a TEM"; sem CTA; modal de entrada | Mockup de UI | Não | 4 | 6 |
| 9 | Medprev | TB | saude.medprev.online | refs/telemedicina-br/medprev-1440.png | Coluna única; caixa alta condensada; preço em pill com borda; grade clicável de especialidades | Nenhuma | Sim (R$ 35,00) | 3 | 3 |
| 10 | Saúde iD | TB | saudeid.com.br | refs/telemedicina-br/saudeid-1440.png | Card roxo com foto recortada e formas geométricas vazando | Banco recortada | Não | 4 | 6 |
| 11 | Kompa | TB | kompa.com.br | refs/telemedicina-br/kompa-1440.png | Gradiente verde-preto "aurora"; H1 leve em duas cores; 1 pill | Nenhuma | Não (B2B) | 3 | 5 |
| 12 | Einstein Conecta | TB | telemedicina.einstein.br | refs/telemedicina-br/einstein-1440.png | Branco; H1 regular 72 px; à direita bloco azul + foto recortada + iPhone + mini card de documentos; 3 cards de ícone abaixo | Banco recortada + mockup + card | Não | 6 | 6 |
| 13 | Facilitta Saúde | TB | facilittasaude.com.br | refs/telemedicina-br/facilitta-1440.png | Foto escura full-bleed; eyebrow ciano; H1 Montserrat 800 com o preço dentro; selo Reclame Aqui; 5 cards outline abaixo | Banco ambientada: idoso de costas e médica no notebook | Sim (R$ 39,90/mês no H1) | 6 | 5 |
| 14 | Televida | TB | televida.med.br | refs/telemedicina-br/televida-1440.png | Banner verde; apresentador apontando; "+16" gigante; H2 de preço em fundo azul | Banco recortada | Sim (R$ 39,90/mês como H2) | 4 | 3 |
| 15 | Pronto Socorro Online | TB | prontosocorroonline.com.br | refs/telemedicina-br/prontosocorroonline-1440.png | Copy à esquerda; à direita colagem de fotos com retângulo azul e mini card placeholder; anéis decorativos | Banco recortada (mãe e filha; idosa no notebook) | Sim (R$ 29,99/mês por pessoa) | 5 | 8 |
| 16 | Cliam | TB | cliamtelemedicina.com.br | refs/telemedicina-br/cliam-1440.png | Foto lavada de fundo; H1 caixa alta ciano; casal 50+ recortado; pill rosa WhatsApp; 4 cards | Casal com cara de gente real sobre banco lavada | Não | 5 | 4 |
| 17 | Alice | HB | alice.com.br | refs/healthtech-br/alice-1440.png | Cartão full-bleed com 8 px de margem; nav transparente; título não renderiza no desktop; 2 pills de vidro no canto inferior | Editorial: mulher de perfil, fundo bege liso | Não (B2B) | 9 | 1 |
| 18 | Sami | HB | samisaude.com.br | refs/healthtech-br/sami-1440.png | Três colunas: título coral, médica em moldura coral, formulário de cotação de 6 campos | Banco: médica de jaleco frontal | Não (formulário "Ver preços") | 6 | 6 |
| 19 | Amparo | HB | amparosaude.com.br | refs/healthtech-br/amparo-1440.png | Foto full-bleed com degradê branco e 4 cards de ícone flat por cima | Banco ambientada | Não | 5 | 8 |
| 20 | Zenklub | HB | zenklub.com.br | refs/healthtech-br/zenklub-1440.png | Copy à esquerda; foto quadrada com mini-cards de app grudados e selo circular | Banco + UI de app | Não | 6 | 8 |
| 21 | Vittude | HB | vittude.com | refs/healthtech-br/vittude-1440.png | Bloco laranja total; foto em blob orgânico | Banco em máscara | Não | 5 | 7 |
| 22 | Telavita | HB | telavita.com.br | refs/healthtech-br/telavita-1440.png | Três colunas; PNG recortado; card com ilustração; nome próprio rotativo no H1 ("pro Pedro / pra Ana") | Banco recortada | Não | 7 | 6 |
| 23 | Beep Saúde | HB | beepsaude.com.br | refs/healthtech-br/beep-1440.png | Bloco teal; foto em card que vaza para cima do bloco; 3 CTAs amarelos; chip de cupom | Própria: enfermeira coletando sangue de criança que sorri para a mãe | Não (cupom 12%) | 7 | 5 |
| 24 | Hilab | HB | hilab.com.br | refs/healthtech-br/hilab-1440.png | Centralizado; H1 serifa regular com uma palavra bold; 1 pill; foto panorâmica cortada pela dobra | Ambiente sem pessoa | Não (B2B) | 5 | 3 |
| 25 | Clude | HB | clude.com.br | refs/healthtech-br/clude-1440.png | Duas colunas; tríptico de painéis coloridos com uma pessoa recortada em cada | Banco recortada x3 | Não | 5 | 6 |
| 26 | Mira | EX | talktomira.com | refs/exterior/mira-1440-v2.png | Coluna única, fundo bege; eyebrow; serifa com primeira linha rotativa e colorida; preço no parágrafo; 2 botões; foto só abaixo da dobra | Nenhuma no hero | Sim ($50/mês, $35 por consulta) | 8 | 2 |
| 27 | Amazon One Medical | EX | onemedical.com | refs/exterior/onemedical-1440.png | Duas colunas; serifa azul; foto recortada sem o rosto inteiro sangrando à direita; um arco fino | Recorte ousado (queixo, sorriso, mão com celular) | Sim ($99/ano em bold no parágrafo) | 7 | 3 |
| 28 | K Health | EX | khealth.com | refs/exterior/khealth-1440.png | Gradiente azul; título institucional B2B; 1 botão | Nenhuma | Não | 3 | 6 |
| 29 | Sesame | EX | sesamecare.com | refs/exterior/sesame-1440.png | Painel lilás centralizado; widget de chat como hero; prova em texto puro | Nenhuma (o widget é a imagem) | Sim ("Visits start at $34") | 6 | 4 |
| 30 | Maple | EX | getmaple.ca | refs/exterior/maple-1440-v2.png | Vídeo full-bleed; título de duas palavras; 1 pill; notas de app abaixo | Vídeo: homem gritando de alegria numa livraria | Não | 9 | 1 |
| 31 | Teladoc | EX | teladochealth.com | refs/exterior/teladoc-1440-v2.png | Foto full-bleed; nav em pill branca; texto centralizado na metade inferior; 2 pills | Ambientada: mãe e filho no sofá, médico pequeno no celular | Não | 7 | 4 |
| 32 | PlushCare | EX | plushcare.com | refs/exterior/plushcare-1440.png | Split 50/50; foto sangra na borda com canto grande; 3 bullets com check | Ambientada por cima do ombro, UI só dentro do celular | Não | 6 | 6 |
| 33 | Felix | EX | felixforyou.ca | refs/exterior/felix-1440.png | Cartão com margem; campanha de liquidação; marquee de selos; contador | Paisagem de praia sem gente | Sim ("$0 consultations", promo) | 5 | 3 |
| 34 | Livi | EX | livi.co.uk | refs/exterior/livi-1440.png | Duas colunas; foto em arco; barra branca de 3 números cruzando a base | Ambientada escura: pai beijando bebê | Não | 8 | 4 |
| 35 | Kry | EX | kry.se | refs/exterior/kry-1440-v2.png | Igual Livi + 3 bullets com check + 2 botões | Idem | Não | 8 | 4 |
| 36 | Doctor On Demand | EX | doctorondemand.com | refs/exterior/doctorondemand-1440.png | Foto escurecida + card de formulário com selects | Banco: médico grisalho de jaleco na tela do celular | Sim ("$0 depending on insurance") | 4 | 8 |
| 37 | MDLIVE | EX | mdlive.com | refs/exterior/mdlive-1440.png | Bege-caramelo; colagem de celulares inclinados com rostos | Mockups | Não | 4 | 7 |
| 38 | Qare | EX | qare.fr | refs/exterior/qare-1440.png | Três colunas; celular com médica + 4 badges coloridos flutuantes + selo de louros + barra de números | Mockup + badges | Não | 4 | 8 |
| 39 | Oscar Health | PR | hioscar.com | refs/saude-assinatura/oscar-1440.png | Bloco azul-violeta; serifa 72 px; colagem assimétrica de 3 fotos com cantos suaves | Snapshots de família com flash (mãe com filhos, mulher com pé engessado) | Não | 9 | 2 |
| 40 | Parsley Health | PR | parsleyhealth.com | refs/saude-assinatura/parsley-1440.png | Foto bege full-bleed; texto no espaço negativo da própria foto; serifa light | Editorial: retrato de estúdio, vestido vermelho | Não | 9 | 2 |
| 41 | Cerebral | PR | cerebral.com | refs/saude-assinatura/cerebral-1440.png | Roxo escuro; foto em arco; 2 cards-botão; popup lateral | Ambientada em máscara de arco | Não | 7 | 4 |
| 42 | Headspace | PR | headspace.com | refs/saude-assinatura/headspace-1440.png | Centralizado; 3 checks; dois cards-produto com UI e mascote | UI + ilustração + foto | Sim ("Try for $0") | 6 | 6 |
| 43 | Function Health | PR | functionhealth.com | refs/saude-assinatura/function-1440.png | Vídeo full-bleed; nav de vidro flutuante; chip + título serifa itálica + sub + 1 pill no canto inferior esquerdo; 3 stats no canto inferior direito | Vídeo: mulher em perfil, luz dourada, deserto | Sim ("$365 per year, $1 per day") | 9 | 1 |
| 44 | Superpower | PR | superpower.com | refs/saude-assinatura/superpower-1440.png | Cartão escuro arredondado com margem; vídeo; check + H1 400 + sub com preço + 2 pills; 3 stats no rodapé do cartão | Vídeo: perfil contra círculo de luz laranja | Sim ("$349 per year") | 7 | 3 |
| 45 | Levels | PR | levels.com | refs/saude-assinatura/levels-1440.png | Vídeo escurecido a 60%; título 102 px; 1 botão retangular | Vídeo virando silhueta | Não | 5 | 4 |
| 46 | Curative | PR | curative.com | refs/saude-assinatura/curative-1440.png | Centralizado bold em duas cores; foto stock com quadrados e grade de pontos | Stock de escritório | Não | 4 | 8 |
| 47 | Nurx | PR | nurx.com | refs/saude-assinatura/nurx-1440.png | Faixa de foto baixa; título centralizado; sem botão; faixa de prova em papel pautado abaixo | Retrato ambientado com folhagem | Não ("$0 with insurance" na barra) | 8 | 3 |
| 48 | Everlywell | PR | everlywell.com | refs/saude-assinatura/everlywell-1440.png | Busca de sintomas; chips de desconto; barra com contador | Nenhuma | Chips "Save 30%" | 3 | 7 |
| 49 | Significo | PR | significo.com | refs/saude-assinatura/significo-1440.png | Vídeo full-bleed; texto de 14 px no canto; nada mais | Vídeo documental (trilha) | Não (B2B) | 9 | 1 |
| 50 | Good Life Meds | PR | goodlifemeds.com | refs/saude-assinatura/goodlifemeds-1440.png | Vídeo; ticker de garantias em mono; nav de vidro; card de produto no canto | Vídeo: ciclista ao pôr do sol | Não | 7 | 3 |
| 51 | Heureka Health | PR | heureka.health | refs/saude-assinatura/heureka-mobile.png (só mobile) | Título com palavras coloridas + card com diagrama de produto | Diagrama | Não (B2B) | 3 | 8 |
| 52 | Vitat / Programa Mais Saúde (RD) | CO | vitat.com.br | refs/complementar/vitat-1440.png | Faixa verde; foto em card; dois blocos de cor; é portal de conteúdo | Banco em card | Não (assinatura só no app) | 5 | 6 |
| 53 | Pague Menos Cliente Ouro | CO | institucional.paguemenos.com.br | refs/complementar/paguemenos-institucional-1440.png | Banner azul de encarte; ilustração; 3 blocos com ícone amarelo | Ilustração flat | Não (só percentuais) | 3 | 5 |
| 54 | Drogaria São Paulo Consultas | CO | drogariasaopaulo.com.br/consultas-medicas | refs/complementar/drogariasp-consultas-1440.png (só desktop) | Header de e-commerce; colagem de banco com balões de chat; botão em caps para parceiro externo | Colagem de banco | Não | 3 | 8 |
| 55 | Amil | CO | amil.com.br | refs/complementar/amil-1440.png | Carrossel 2/11; foto em círculo com anel; selo Reclame Aqui; fala de prêmio | Banco em círculo | Não | 3 | 7 |
| 56 | Meu Doutor Novamed | CO | novamedsaude.com.br | refs/complementar/novamed-1440.png (só desktop) | Carrossel 3/9; foto em blob com contorno; parágrafo longo | Foto de clínica real em blob | Não | 4 | 6 |
| 57 | Estação Unimed | CO | estacaounimed.com.br | refs/complementar/estacaounimed-1440.png | Faixa verde-clara única; H1 leve e literal; input de carteirinha; foto dissolvida no fundo | Banco ambientada: pai e filha no notebook | Não | 6 | 5 |
| 58 | Hapvida (home) | CO | www2.hapvida.com.br | refs/complementar/hapvida-1440.png | Branco; H1 grande com trecho azul; 2 botões; barra de 4 números com divisores; foto retangular | Banco ambientada: pai e filho rindo no sofá | Não | 7 | 5 |
| 59 | Hapvida teleconsulta | CO | gndi.com.br | refs/complementar/hapvida-teleconsulta-1440.png | Faixa azul; médico de jaleco recortado; 5 cards de ícone | Banco: médico com celular | Não | 3 | 8 |
| 60 | Porto Saúde | CO | portoseguro.com.br/saude | refs/complementar/portosaude-1440.png (só desktop) | Carrossel; bloco roxo + foto de yoga; conteúdo editorial | Banco | Não | 4 | 6 |
| 61 | Prevent Senior | CO | preventsenior.com.br | refs/complementar/preventsenior-1440.png | Marquee de slogan; carrossel de 15 slides; "+83" gigante | Paisagem (Rio) | Não | 3 | 5 |
| 62 | Doctoralia | CO | doctoralia.com.br | refs/complementar/doctoralia-1440.png | Faixa verde-escura; busca com toggle "No local / Teleconsulta"; ilustração à direita | Ilustração corporativa | Não | 5 | 4 |
| 63 | BoaConsulta | CO | boaconsulta.com | refs/complementar/boaconsulta-1440.png | Centralizado sobre gradiente; toggle + busca; popups | Nenhuma | Não | 4 | 6 |
| 64 | VidaClass | CO | vidaclass.com.br | refs/complementar/vidaclass-1440.png | Banner-carrossel de encarte; 2 cards de plano com faixa de preço; fileiras de cards de ícone | Banco recortada com faixas diagonais | Sim (R$ 29,90 e R$ 56,90/mês) | 2 | 8 |
| 65 | Sofía | CO | sofiasalud.com | refs/complementar/sofia-1440.png | Off-white; H1 bold; 2 cards (empresas / indivíduos); mão com iPhone e bolhas flutuantes | Mockup + bolhas | Não | 6 | 5 |
| 66 | 1DOC3 | CO | 1doc3.com | refs/complementar/1doc3-1440.png | Duas colunas; serifa de fallback (webfont falhou); recorte + blocos coloridos | Banco recortada | Não (B2B) | 3 | 7 |
| 67 | Chamando o Doutor | CO | llamandoaldoctor.com | refs/complementar/llamandoaldoctor-1440.png | Carrossel azul-marinho; neon limão; confete; recorte | Banco recortada | Não (B2B) | 3 | 6 |
| 68 | Doctronic (ex Summer Health) | CO | summerhealth.com redireciona para doctronic.com | refs/complementar/summerhealth-1440.png | Centralizado off-white; serifa; caixa de chat; preço em frase | Nenhuma | Sim ("$39 pay per visit, no subscription") | 5 | 4 |
| 69 | Blueberry Pediatrics | CO | blueberrypediatrics.com | refs/complementar/blueberry-1440.png | Duas colunas; H1 Poppins 800; estrelas + "100,000 Parents"; foto em blob com card de depoimento | Banco: mãe e bebê, em blob | Não (promo) | 6 | 6 |
| 70 | TeleClinic | CO | teleclinic.com | refs/complementar/teleclinic-1440.png | Cinza claro; 3 pílulas de intenção; dois iPhones inclinados | Mockups com médica | Não | 5 | 7 |
| 71 | getlayers.ai | GO | getlayers.ai | refs/saude-assinatura/layers-1440.png | Preto; cartão com margem de 16 px e borda de 1 px; chip de prova; título light com segunda metade em cinza; 1 pill; nav em pill | Nenhuma (gradiente radial) | Não | 4 | 3 |
| 72 | curated.design | GO | curated.design | refs/complementar/curated-1440.png | Off-white; nav mínima; H1 serifa regular centralizado com ponto final; sub cinza; nada mais | Nenhuma | Não | 7 | 2 |

Não vistos (registrados, fora das contagens): Doutor Já (página de estacionamento Hostinger), Vidia
(DNS), QSaúde (placeholder GoDaddy), Cuida Saúde (DNS), Yalo (DNS; oferta absorvida pelo
dr.consulta), Pipo (404), Nilo Saúde (hero em branco no headless), Carbon Health (Cloudflare), Zocdoc
(CAPTCHA), Doctolib (verificação humana), Amwell (conexão recusada), eMed (não renderizou; pivotou
para B2B), Ro, Hims e Hers (Cloudflare), Calm (PerimeterX), Forward (empresa fechou em nov/2024),
Possible Health (DNS), Zava UK/DE (Cloudflare), Examedi (geobloqueio), SulAmérica Especial Mais (CSS
não carregou), Summer Health (virou Doctronic; entrou como #68).

## 3. Contagens (sobre os 70 heros de saúde vistos)

Números aproximados: alguns sites cabem em duas categorias e a classificação é de leitura, não de
medida. A tendência é o que importa.

Imagem principal do hero:

| Tratamento | Quantos | % | Exemplos |
| --- | --- | --- | --- |
| Foto de banco recortada ou colada sobre cor, blob, card ou faixa | 23 | 33% | Click Life, Cliam, VidaClass, Cartão de TODOS, Televida, Telavita, Pronto Socorro Online, Einstein, Amil, Blueberry, Sami, Zenklub, Vittude, Clude, Curative |
| Foto ambientada de pessoa inteira, sem recorte (banco ou própria) | 21 | 30% | Conexa, Alice, Facilitta, Vale Saúde, Estação Unimed, Hapvida, Teladoc, Kry, Livi, PlushCare, One Medical, Parsley, Nurx, Oscar, Beep, dr.consulta |
| Vídeo de pessoa | 6 | 9% | Maple, Function, Superpower, Levels, Significo, Good Life (todos exterior; zero no Brasil) |
| Mockup de UI ou celular como objeto principal | 6 | 9% | TEM, Sofía, TeleClinic, MDLIVE, Qare, Headspace |
| Ilustração ou diagrama | 3 | 4% | Doctoralia, Pague Menos, Heureka |
| Sem pessoa (tipográfico, ferramenta, gradiente, paisagem) | 11 | 16% | Mira, Medprev, Kompa, Sesame, Hilab, BoaConsulta, Doctronic, K Health, Everlywell, Felix, Prevent Senior |

Leitura: o recorte de banco é o tratamento mais comum e o que mais denuncia template. Entre os dez
heros de melhor acabamento (Alice, Function, Maple, Significo, Oscar, Parsley, Conexa, dr.consulta,
Kry/Livi, Nurx), dez usam foto ou vídeo de pessoa inteira em cena real e nenhum usa recorte.

Outras contagens:

- Preço na primeira dobra (1440x900): 16 de 70 (23%). Brasil B2C direto: 7 de 15 mostram (Facilitta,
  Pronto Socorro Online, Cartão de TODOS, Medprev, ClickSaúde, Televida, VidaClass), 8 não (Cliam,
  Click Life, Vale Saúde, Conexa, Sami, TEM, dr.consulta, Saúde iD). Quem mostra no Brasil faz em
  card, pill ou número gigante; quem mostra no exterior premium (Function, Superpower, Mira, One
  Medical, Sesame, Doctronic) faz em texto corrido no subtítulo. Nenhuma operadora, farmácia ou
  marketplace mostra.
- Fundo escuro no hero (bloco ou foto escura dominando): 16 de 70 (23%). Brasil: Facilitta, Conexa,
  Vale Saúde, Doctoralia, Televida, Kompa, Hapvida teleconsulta, Chamando o Doutor. Exterior:
  Function, Superpower, Levels, Maple, Good Life, Cerebral, Doctor On Demand, Medprev (faixa). Bloco
  de cor saturada, não escuro: 9 (Oscar, Beep, Vittude, TEM, Vitat, Pague Menos, Cartão de TODOS,
  Saúde iD, K Health). Claro ou off-white: 45 (64%). Escuro não é barreira para o público 40+ (Vale
  Saúde e Facilitta miram exatamente ele); o que separa é o tratamento: foto ambientada com texto no
  espaço negativo parece caro, faixa chapada com recorte e neon parece encarte.
- Cards, chips, badges ou mockups sobre a foto: 13 de 70 (19%): Einstein, Pronto Socorro Online,
  Zenklub, Amparo, Qare, Blueberry, Good Life, Cerebral (popup), Drogaria SP, Sofía, MDLIVE, Saúde
  iD, Vale Saúde (neon). Entre os dez melhores em acabamento: zero.
- Médico de jaleco como protagonista fora da tela: 8 (11%): Click Life, Sami, ClickSaúde, Hapvida
  teleconsulta, Chamando o Doutor, Novamed, dr.consulta (com paciente, em consulta real) e Beep
  (enfermeira em procedimento real). Só dentro da tela de um dispositivo: 12 (17%). Sem médico: 50
  (71%), incluindo todos os premium.
- Serifa no título: 9 de 70 (13%): Hilab, Mira, One Medical, Teladoc, Oscar, Parsley, Function
  (itálica), Sesame (segunda linha), Doctronic. Mais curated.design. No Brasil, só a Hilab.
- Peso do H1 em 300 a 500 (light, regular ou medium): cerca de 15 (21%): Conexa, Einstein, Hilab,
  dr.consulta, Kompa, Parsley, Function, Mira, Superpower, PlushCare, Estação Unimed, Oscar,
  Doctronic, Levels, Nurx. Os demais usam 700 ou 800. Os heros que parecem caros estão quase todos no
  primeiro grupo; Kry e Livi são a exceção bold que funciona (porque a foto e a barra de números
  carregam o acabamento).
- Nav flutuante em pill, vidro ou transparente: 7 de 70 (10%): Conexa, Alice, Function, Teladoc,
  Felix, Good Life, Heureka; mais getlayers. No Brasil, só Conexa e Alice.
- Carrossel no hero: 11 (16%): Docway, Cartão de TODOS, dr.consulta, Televida, Amil, Prevent Senior,
  Novamed, Porto, VidaClass, Chamando o Doutor, 1DOC3. Zero entre os premium.
- Fileira de 3 a 6 cards de ícone logo abaixo (ou por cima) do hero: 11 (16%): Click Life, Einstein,
  Facilitta, Cartão de TODOS, Cliam, Vale Saúde, TeleClinic, Hapvida teleconsulta, VidaClass, Amparo,
  Pague Menos.
- WhatsApp flutuante: 9 sites brasileiros (Facilitta, Cliam, Cartão de TODOS, ClickSaúde,
  dr.consulta, Vale Saúde, Hapvida, Drogaria SP, Sami); nenhum premium, nenhum exterior.
- Movimento no hero: vídeo ambiente em 6 (todos exterior); palavra ou nome rotativo em 2 (Mira,
  Telavita); título dependente de JS que falhou em 2 (Click Life, Alice); carrossel em 11; o resto é
  estático ou só fade de entrada.

Padrões de título (70 heros, classificação de leitura):

| Fórmula | Quantos | Exemplos |
| --- | --- | --- |
| Institucional ou fala de si ("Nós somos", "Saúde digital com tecnologia, cuidado e proximidade", "A Amil é finalista") | 13 | TEM, Click Life, Docway, Amil, Clude, Amparo, Prevent, Novamed, Porto, K Health, Teladoc, Livi, Hilab |
| Oferta literal (o que + quando, às vezes quanto) | 10 | Facilitta, Pronto Socorro Online, Estação Unimed, Doctor On Demand, Qare, Kry (com bullets), Beep, Blueberry, Vittude, Doctronic |
| Slogan curto em 2 ou 3 linhas com contraste de peso ou cor dentro do H1 | 8 | Conexa, Kompa, Saúde iD, Cerebral, Hilab, Sesame, getlayers, Hapvida |
| Frase curta com ponto final (2 a 6 palavras) | 7 | Function, Levels, Everlywell, Alice, curated, Nilo, Mira |
| Dor ou humor | 5 | One Medical, Curative, Maple, Cliam, Conexa (segunda dobra) |
| Nome da categoria ou do produto | 4 | Vale Saúde ("A sua assinatura de saúde"), Einstein, Superpower ("Your new health membership"), Sesame |
| Promoção de varejo | 4 | Cartão de TODOS, Felix, VidaClass, Prevent Senior |
| Imperativo de marketplace | 3 | Doctoralia, BoaConsulta, Cartão de TODOS |
| Palavra ou nome rotativo | 2 | Mira (especialidade), Telavita (nome próprio) |
| Sem título legível na captura | 3 | Alice (desktop), Click Life, Nilo |

O que separa os títulos bons: dizem o que a pessoa recebe, em 4 a 9 palavras, com ponto final e sem
adjetivo de marketing. "Tenha atendimento médico imediato, 100% online e disponível 24 horas por
dia." (Estação Unimed) e "Check your health." (Function) estão nos dois extremos de comprimento e
funcionam pelo mesmo motivo.

## 4. Padrões que funcionam no mercado real

Dez padrões, cada um confirmado em pelo menos dois sites vistos. Estão em ordem de impacto para a
Moorah.

### 4.1 Uma pessoa comum, grande, em cena real, com o texto no espaço negativo

A foto é o hero; o texto entra onde a imagem tem ar (fundo liso, parede, escuro), nunca sobre o
rosto. Ninguém usa jaleco. Conexa (`refs/telemedicina-br/conexa-1440.png`): mulher no sofá com
celular, cena doméstica escura, texto à esquerda sobre a parede azul. Function
(`refs/saude-assinatura/function-1440.png`): mulher em perfil no deserto, texto no canto inferior
esquerdo. Parsley (`refs/saude-assinatura/parsley-1440.png`): a cor do fundo da foto é a cor do
hero, então não há borda entre imagem e layout. Superpower
(`refs/saude-assinatura/superpower-1440.png`), Alice (`refs/healthtech-br/alice-1440.png`), Estação
Unimed (`refs/complementar/estacaounimed-1440.png`, pai e filha dissolvidos no verde) e Hapvida
(`refs/complementar/hapvida-1440.png`, pai e filho rindo) mostram que o padrão funciona também com
banco de imagens, desde que a foto seja ambientada e não recortada.

### 4.2 Hero como cartão arredondado com margem, não faixa infinita

Alice (8 px de margem, raio ~24), Superpower (16 px, cartão escuro sobre nav branca), getlayers
(16 px, borda de 1 px translúcida), dr.consulta (`refs/telemedicina-br/drconsulta-1440.png`), Felix
(`refs/exterior/felix-1440.png`). Dá acabamento sem adicionar nenhum ornamento. A Moorah já faz
isso; é o único gesto do hero atual que está alinhado com as referências de gosto.

### 4.3 Nav flutuante translúcida, em pill ou transparente sobre a imagem

Conexa (pill branca com blur e botão rosa), Function (pill escura com blur sobre o vídeo), Teladoc
(`refs/exterior/teladoc-1440-v2.png`, pill branca com sombra), Alice (transparente), getlayers (pill
escura central). Nenhum B2C popular brasileiro faz. É o gesto mais barato para sair do template.

### 4.4 Título grande em peso leve ou regular, com hierarquia por peso ou opacidade dentro do H1

Conexa ("Saúde que conecta" em light, "suas consultas" em bold), Einstein
(`refs/telemedicina-br/einstein-1440.png`, regular a 72 px), Hilab (`refs/healthtech-br/hilab-1440.png`,
serifa regular com "diagnóstica" em bold), getlayers ("Cinematic AI sites," branco, "made easy" em
cinza 60%), Kompa (segunda linha em cor de acento), Function (serifa itálica 300), Parsley (serifa
300). Nenhum dos bons usa palavra colorida em tom de destaque diferente nem gradiente no texto.

### 4.5 Preço em texto corrido no subtítulo, reescrito em unidade menor

Function: "Just $365 per year, $1 per day." Superpower: "Members get 150+ lab tests across 2 blood
draws. $349 per year." Mira (`refs/exterior/mira-1440-v2.png`): "$50/month. $35 copay per visit."
One Medical (`refs/exterior/onemedical-1440.png`): "$99/year" em bold dentro do parágrafo. Doctronic:
"$39 pay per visit with no subscription required." No Brasil, Facilitta
(`refs/telemedicina-br/facilitta-1440.png`) põe o preço no próprio H1 e Pronto Socorro Online
(`refs/telemedicina-br/prontosocorroonline-1440.png`) ao lado do botão. A regra do mercado B2C por
assinatura é mostrar o preço na primeira dobra; a regra do acabamento é mostrar em frase, não em
card.

### 4.6 Prova em um único elemento, nunca dois

Ou uma linha pequena acima do título: Conexa (cinco estrelas + "Nota 4,8 na App Store"), Function
(chip "HSA/FSA Eligible"), Superpower (check "HSA/FSA eligible"), getlayers ("Trusted by 1,000+
creators"), Sesame ("4.5 on Trustpilot"). Ou uma barra de 3 ou 4 números abaixo do CTA, com número
em bold e legenda em regular: Kry e Livi (`refs/exterior/kry-1440-v2.png`: "34 vårdcentraler · 14
miljoner vårdmöten · 4,9 betyg i App Store"), Hapvida ("15,8 milhões · 86 hospitais · 365 clínicas ·
+80 anos"), Function ("160+ lab tests · Whole body · $1 per day"), Superpower, Nurx. Quem empilha
selo + badges + barra + estrelas (Qare, Cartão de TODOS, ClickSaúde) parece desesperado.

### 4.7 Três bullets curtos com check no lugar de parágrafo

Kry: "Chatt, videosamtal och vårdcentraler / Läkare, psykologer, sjuksköterskor, fysioterapeuter /
Öppet dygnet runt, alla dagar i appen". Vale Saúde (`refs/complementar/valesaudesempre-1440.png`):
"Consultas com especialistas / Mais de 3 mil clínicas e laboratórios / Medicamentos com até 60% de
desconto", com o número em bold dentro da frase. PlushCare (`refs/exterior/plushcare-1440.png`),
Qare. O bullet diz o que a pessoa ganha; o parágrafo explica a empresa. O primeiro vende mais.

### 4.8 Título-frase com benefício literal, 4 a 9 palavras, ponto final

"Check your health." (Function), "Tenha atendimento médico imediato, 100% online e disponível 24
horas por dia." (Estação Unimed), "Handpicked websites worth studying." (curated), "Health insurance
made for real life" (Oscar), "Faster Pediatric care, for less" (Blueberry,
`refs/complementar/blueberry-1440.png`), "Consultas por telemedicina ilimitadas 24h por dia."
(Facilitta). O ponto final é assinatura de confiança; a ausência de adjetivo ("inovador", "humanizado",
"de qualidade") é o que separa de institucional.

### 4.9 Dois CTAs em pill, um cheio e um translúcido ou outline, e nada mais

Conexa ("Agendar consulta" rosa + "Saiba como ativar" vidro), Alice ("Explore a Rede" + "Fazer
cotação", ambos vidro), Superpower (branco cheio + cinza translúcido), Oscar
(`refs/saude-assinatura/oscar-1440.png`, branco cheio + outline branco), Parsley, Kry. Três CTAs
(Beep), formulário (Sami, Doctor On Demand) ou "Saiba mais" solto (Click Life, Saúde iD) enfraquecem.

### 4.10 Um único movimento com sentido; nunca carrossel

Mira: primeira linha do título troca de palavra e de cor (Primary care / Refills / Weight care...
"you can afford."). Telavita (`refs/healthtech-br/telavita-1440.png`): nome próprio troca e a foto
troca junto ("pro Pedro / pra Ana"). Function e Superpower: vídeo ambiente lento com botão de pausa.
Conexa: header vira vidro. Alice: fade do título. Todo o resto do mercado que se move usa carrossel
com setas (11 sites) e nenhum deles está entre os bons. Lição do Click Life e da Alice: o texto do
hero precisa existir no HTML antes da animação; nas duas capturas o H1 sumiu porque dependia de JS.

Dois padrões de apoio, menores mas úteis: neutro quente em vez de branco ou cinza frio (Mira bege,
Parsley areia, Function creme, Oscar off-white, curated off-white, Nurx bege, Kompa bege na segunda
seção); e foto que sangra na borda com um único recorte intencional (One Medical corta o rosto;
Kry e Livi usam arco; PlushCare um canto grande; Beep o card que vaza para cima do bloco).

## 5. Anti-padrões: o que dá cara de template ou de IA

Cada item vem com exemplos do mercado e, quando se aplica, da própria Moorah.

1. Colagem "foto recortada + bloco de cor + mockup + mini card flutuante" ao lado do texto. Einstein
   (bloco azul + mulher + iPhone + card de documentos), Pronto Socorro Online (retângulo azul + mãe e
   filha + card com barras placeholder, o pior caso porque literalmente parece wireframe), Zenklub,
   Qare, Sofía (bolhas), Drogaria SP, Blueberry (depoimento sobre blob). Moorah: Especialidades tem um
   card branco com o mini circuito "SUA ASSINATURA MOORAH" sobreposto à foto da médica
   (`.shots/current/desktop-especialidades.png`); Benefícios tem um diagrama de pontos e o chip
   "Desconto aplicado na rede" sobre a foto de laboratório (`.shots/current/desktop-beneficios.png`);
   Planos tem o chip "R$ 24,48 por pessoa no Familiar" sobre a foto da família
   (`.shots/current/desktop-planos.png`). O cliente vetou isso no hero e ele continua em três seções.
2. Fileira de 3 a 6 cards idênticos com ícone em círculo e numeração. Click Life (4 cards laranja),
   Einstein (3 cinzas), Facilitta (5 outline), Cartão de TODOS (6), Cliam (4), Vale Saúde (4),
   TeleClinic (4), Hapvida teleconsulta (5). Aparece em 11 dos 70 e é o sinal mais forte de tema
   pronto. Moorah: Como funciona (4 cards com 01 a 04, ícone em círculo e mini UI dentro,
   `.shots/current/desktop-como-funciona.png`), Diferenciais (4 colunas com 01 a 04 e ícone em
   círculo, `.shots/current/desktop-diferenciais.png`), Benefícios (bento de 5 cards numerados).
3. Formas decorativas soltas: blob (Docway, Vittude, Novamed, Blueberry, Amil), neon (Vale Saúde),
   anéis (Pronto Socorro Online), pontos e quadrados (Curative, Televida), ondas (Cartão de TODOS),
   confete (Chamando o Doutor). Moorah: traço horizontal de 1 px sobre cada coluna em Diferenciais
   (exatamente o "traço decorativo" vetado), a linha com três pontos em "Lojas e serviços parceiros"
   (Benefícios), a linha pontilhada com quatro nós acima dos cards de Como funciona, as trilhas
   fantasmas do circuito atrás do título em Contato (`.shots/current/desktop-contato.png`).
4. Diagrama, rede ou circuito como imagem principal. Heureka (card de fluxo), Kompa (linhas
   aurora), MDLIVE (grade de telas). Moorah: o hero inteiro (`.shots/v3/hero-1440.png`) é uma rede de
   nós com o símbolo no centro; o Manifesto "Chega de mil soluções separadas" é um diagrama de
   convergência com rótulos em mono (`.shots/current/desktop-por-que.png`). Rede com logo no centro
   e nós em volta é o hero de "integrações" de SaaS (Zapier, Segment, Make); em saúde lê como
   fintech ou operadora de dados, não como cuidado.
5. Médico de jaleco de banco de imagens. Click Life (`refs/telemedicina-br/clicklife-1440.png`) é o
   caso extremo: pele lisa, luz uniforme, dente perfeito. Sami, ClickSaúde, Hapvida teleconsulta.
   Moorah: o disco "médicos" do hero traz uma médica de jaleco com prancheta em pose de banco; a foto
   de Especialidades é outra médica de jaleco sorrindo com caneta; Como funciona, Por que e
   Benefícios mostram médico dentro de tablet ou notebook (aceitável, mas são três fotos com o mesmo
   motivo em sequência).
6. Foto de banco em recorte pequeno (avatar). Em círculo de 51 px (mobile) a 115 px (1440), a cara
   de banco aparece mais e o rosto perde identidade. Moorah: os três discos do hero. Zenklub e
   Pronto Socorro Online fazem o equivalente com mini fotos. Alice, Oscar e Conexa fazem o oposto:
   a pessoa ocupa metade da tela.
7. O mesmo esqueleto repetido em toda seção: eyebrow em mono caixa alta + título bold com ponto
   final + grade de cards com numeração 01 a 0n e ícone em círculo. Na Moorah esse ritmo se repete
   em nove seções (Por que, Manifesto, Como funciona, Especialidades, Cartão, Benefícios, Planos,
   Diferenciais, Dúvidas). Cada seção sozinha é limpa; a soma é o que dá cara de IA, porque nenhuma
   página feita por uma pessoa mantém o mesmo compasso por 11.000 px. Os sites bons alternam
   densidade: Alice (hero vazio, depois grade de 3 cards de foto), Conexa (hero foto, depois cards
   escuros com imagem), Mira (hero tipográfico, depois foto grande).
8. Mini interfaces falsas dentro de cards ("Horário confirmado", "Conectado", "Assinado
   digitalmente", abas Histórico / Documentos, campo de número de cartão). Headspace, Zenklub, TEM,
   TeleClinic. Moorah: Como funciona (4 mini UIs) e Benefícios (portal com abas e chips, campo de
   cartão com "Cartão reconhecido"). São telas que o produto ainda não tem; prometem sem provar e
   parecem componentes de kit de Figma.
9. Preço em card gigante, riscado, com timer ou cupom. Cartão de TODOS (R$ 30 em 90 px), Medprev
   (pill), ClickSaúde (riscado + contador), Everlywell (cupom + contador), Felix (liquidação), Beep
   (cupom no hero). Moorah não faz isso; a linha de preço em texto está no formato certo. O que
   destoa é o valor em JetBrains Mono ("R$ 49,90" em fonte de código dentro de uma frase em Plus
   Jakarta), que lê como variável de programa, não como preço de gente.
10. Título que fala da empresa, não do usuário. "Nós somos a TEM Saúde", "nosso propósito é
    democratizar", "Saúde digital com tecnologia, cuidado e proximidade", "A Amil é finalista".
    Moorah: "Por que a Moorah." com quatro diferenciais que qualquer telemedicina escreveria
    ("Tecnologia própria", "Atendimento humano", "Experiência simples", "Rede em crescimento").
11. Carrossel no hero (Amil 2/11, Prevent Senior 15 slides, Novamed 9, dr.consulta, Docway,
    Televida, VidaClass). A marca não decide o que dizer e diz tudo. Moorah não usa carrossel; usa
    marquee de chips de especialidade no rodapé do hero, que é o primo do carrossel: texto que passa
    e ninguém lê (padrão de "logos de clientes" de SaaS).
12. Texto do hero dependente de JS sem fallback (Click Life vazio, Alice sem H1) e webfont sem
    fallback coerente (1DOC3 caiu em Times). Moorah acerta aqui: H1 no servidor, frase completa em
    sr-only. Mas a captura em 1366 (`.shots/current/desktop-inicio.png`) pegou a frase rotativa "sem
    fila." no meio da transição, em rosa apagado; quem tira print ou lê rápido vê texto desabilitado.
13. Caixa alta com tracking largo em títulos e botões (VidaClass, Prevent Senior, Drogaria SP
    "TELEATENDIMENTO - NXT", Facilitta eyebrow, Cliam H1). Moorah usa caixa alta mono só em
    rótulos de 11 px, o que o manual autoriza; o excesso está na quantidade (eyebrow em toda seção,
    faixa legal no topo do site, legendas de foto, colofão), não no tamanho.
14. Overlay cobrindo o hero: cookie bar (TeleClinic, Maple, Kry, Hilab), modal (TEM), faixa de
    aviso (dr.consulta, Telavita, Blueberry, One Medical). Moorah tem uma faixa legal no topo
    ("TERMOS DE USO · POLÍTICA DE PRIVACIDADE · LGPD E SEUS DIREITOS") antes do header. É honesta,
    mas ocupa a primeira linha da tela com o que ninguém procura na chegada e empurra o hero.
15. Dois ou três acentos saturados (Cliam ciano + rosa, Televida limão + azul + amarelo, Amparo
    quatro cores). Moorah está bem aqui: plum + branco + um verde de confirmação. O único ruído é o
    nó verde aceso na rede, que lê como luz de status de dashboard.

## 6. Crítica da página atual, seção por seção

Capturas em `.shots/current/` (1366x900 por seção, 390 no mobile) e `.shots/v3/` (hero por largura).
O que está bom fica registrado também, para não ser jogado fora na pressa.

### 6.1 Faixa legal e header (`desktop-inicio.png`, topo)

O que há: faixa de 32 px em JetBrains Mono caixa alta com três links legais; header branco de
altura fixa com wordmark, cinco links, botão pill "Ver planos".

Por que parece mecânico: a primeira linha da tela é um rodapé. Nenhum dos 70 sites abre com links
de LGPD; os que abrem com faixa usam para aviso ou promoção. O header em barra branca cheia é o
padrão dos populares (Hapvida, Vale Saúde, VidaClass); os que o cliente admira usam nav em pill
translúcida (Conexa, Function, getlayers). O header também repete a wordmark dentro das seções
Cartão e Contato, o que soa a "template com slot de logo".

Manter: o botão pill e a wordmark com o símbolo. Mover a faixa legal para o footer (onde já existe
uma cópia).

### 6.2 Hero "Constelação de cuidado" (`.shots/v3/hero-1440.png`, `desktop-inicio.png`, `mobile-top.png`)

O que há (medido): bloco plum arredondado com margem, coluna de texto de 6/12 à esquerda (eyebrow
mono, H1 Plus Jakarta 700 em 56 px com segunda linha rotativa, lead, preço com valor em mono, dois
CTAs, trust line com escudo), rede de 12 nós à direita (620 px, hub branco de 104 px com o símbolo,
três discos de foto de 106 a 115 px, 12 cometas, nó verde "confirmado"), colofão mono + marquee de
chips de especialidade a 64 s por ciclo fechando o bloco. No mobile: texto primeiro, rede de 296 px
com discos de 51 a 55 px, colofão e marquee abaixo.

O que está certo: bloco com margem e cantos grandes (padrão 4.2), fundo escuro (a casa da marca),
uma cor de acento, dois CTAs pill, preço em texto na primeira dobra, trust line com "não é plano de
saúde", H1 no servidor com sr-only, zero rolagem horizontal, reduced motion respeitado. A engenharia
está acima da média do mercado.

Por que ainda parece mecânico:

1. É "copy à esquerda + visual à direita" com outro figurino. A grade é 6/6, o texto fica na esquerda
   e um objeto decorativo na direita. O que o cliente rejeitou não foi o card em si, foi a
   arquitetura, e ela continua. Nenhum dos heros bem avaliados divide a tela assim; os que dividem
   (Kry, Hapvida, One Medical) têm uma foto grande sangrando na borda, não um objeto centrado.
2. A rede é o hero de "integrações" do SaaS. Símbolo no centro, nós em volta, trilhas acesas,
   cometas correndo: é a imagem que Zapier, Segment e dezenas de fintechs usam para dizer "conectamos
   tudo". Em saúde, o que precisa aparecer é uma pessoa cuidada, não um grafo. Kompa e Heureka, os
   dois heros de diagrama da amostra, são os mais frios.
3. As pessoas viraram avatares. Três rostos em círculos de 106 a 115 px (51 px no mobile) são
   fotos de perfil, não cenas. O disco "médicos" traz uma médica de jaleco com prancheta em pose de
   banco, o que é o clichê número um do segmento (anti-padrão 5). A família de três posando para a
   câmera e a mulher no notebook completam o trio "banco de imagens em miniatura". A cara de banco
   aparece mais no pequeno, como a própria pendência 7.14 do brief admite.
4. Muitos ritmos ao mesmo tempo: frase rotativa a cada 2,8 s, cometas em loop de 4,5 s, compasso da
   rede a cada 4,2 s com crossfade de fotos, marquee a 64 s. O manual pede "nada gira, nada pisca";
   o mercado bom usa um movimento (padrão 4.10). Quatro movimentos simultâneos em um bloco escuro
   com nós acesos é o que dá sensação de painel de controle.
5. O nó verde aceso e os cometas rosa sobre plum leem como status de sistema (online, processando).
   O verde "confirmado" não tem significado para quem chega; é um LED.
6. O marquee de chips de especialidade no rodapé do bloco é o "logo cloud" de SaaS. O cliente já
   chamou a página de repetitiva; o marquee é o elemento que mais repete (12 chips, infinito). A
   informação boa que ele carrega (quais especialidades) merece uma frase ou a própria seção.
7. Preço em fonte de código. "R$ 49,90" em JetBrains Mono no meio de uma frase em Plus Jakarta faz o
   valor parecer variável de programa, e o espaçamento tabular abre buracos ("R$  49,90"). Todos os
   sites que mostram preço bem (Function, Superpower, Mira, One Medical, Facilitta) usam a mesma
   família do texto, em bold.
8. Eyebrow mono + H1 700 apertado + lead + preço + 2 CTAs + trust com ícone de escudo + colofão mono:
   são sete blocos de texto na coluna esquerda. Conexa tem quatro (prova, H1, sub, CTAs). Function
   tem cinco e um deles são os stats. A coluna está densa demais para ler em três segundos.
9. O H1 rotativo em gradiente (light) ou berry-200 (plum) muda de cor em relação à primeira linha.
   Contraste dentro do H1 funciona por peso (Conexa, Hilab) ou por opacidade neutra (getlayers);
   por matiz diferente fica "palavra colorida", que os melhores evitam (anti-padrão 4.4).
10. "Consultas médicas ilimitadas, em qualquer especialidade." promete mais do que a página prova: a
    seção Especialidades lista 12. Conexa escreve "Mais de 35 especialidades", Pronto Socorro Online
    "até 30". O número real, dito com honestidade, vale mais que "qualquer".

No mobile (`mobile-top.png`): a primeira tela é só texto sobre plum (título de 5 linhas, lead de 4,
preço de 2, dois botões, trust de 4 linhas). A pessoa só aparece rolando, e aparece com 51 px de
diâmetro. Function, Vale Saúde e Kry mantêm um rosto grande no primeiro scroll.

### 6.3 Por que a Moorah existe + Manifesto (`desktop-por-que.png`)

O que há: título à esquerda, lista numerada 01 a 03 com hairlines, foto em card com legenda mono
"CONSULTA EM CASA"; abaixo, título centralizado "Chega de mil soluções separadas." e um diagrama de
cinco linhas convergindo para um nó plum com rótulos em mono.

Por que parece mecânico: o diagrama é um esquema de engenharia (linhas a 45 graus, nós, rótulos em
fonte de código) para dizer algo humano ("tudo em um lugar"). O manual de marca pede "acolhedor,
sereno"; a imagem diz "fluxograma". A foto do tablet na cama com médico idoso na tela é a terceira
variação do motivo "médico na tela" da página. As numerações 01, 02, 03 e as hairlines entre itens
são a gramática de landing de Vercel e Linear, correta em software, fria em saúde.

Manter: a lista de três dores é boa copy ("Planos pesam no bolso", "Semanas de fila", "Cuidado só na
urgência"); merece uma foto de pessoa em vez de diagrama.

### 6.4 Como funciona (`desktop-como-funciona.png`)

O que há: título centralizado, linha pontilhada com quatro nós, quatro cards iguais (01 a 04, ícone
em círculo, título, texto, mini UI dentro).

Por que parece mecânico: é o anti-padrão 2 na forma mais pura (fileira de cards idênticos com ícone
em círculo) somado ao anti-padrão 8 (mini UIs falsas: "Horário confirmado", chips "Véspera / Hoje /
30 min antes", tela de vídeo com "Conectado", carimbo "ASSINADO DIGITALMENTE"). A linha pontilhada é
decoração horizontal. Nenhum dos heros bem avaliados tem um "como funciona" em quatro cards; Kry
resolve com uma lista vertical com ícone e seta ("Få hjälp idag", `refs/exterior/kry-mobile-v2.png`),
dr.consulta com o próprio produto (busca de especialidade).

### 6.5 Especialidades (`desktop-especialidades.png`)

O que há: título à esquerda com parágrafo, foto de médica de jaleco em card com um card branco
sobreposto (mini circuito + "SUA ASSINATURA MOORAH"), lista de 12 especialidades em duas colunas com
ícone, número e frase.

Por que parece mecânico: card branco sobre foto é o veto número um do cliente, e está aqui. A médica
de jaleco sorrindo com caneta é banco de imagens clássico (anti-padrão 5). A lista em si é boa (a
frase por especialidade tem voz: "Para os pequenos, a qualquer hora", "Cuidado atento para quem tem
mais história"), mas a numeração 01 a 12 em mono repete a gramática das outras seções.

Manter: a lista com frases. Tirar o card sobre a foto e trocar a foto por paciente ou família.

### 6.6 Cartão Moorah (`desktop-cartao.png`)

O que há: bloco plum, wordmark repetida, título, parágrafo, quatro checks, segmented control
"Titular / Dependente 1 / 2 / 3" e o cartão em ameixa com a amora em relevo.

Por que funciona: é a seção mais "de marca" da página. O cartão é um objeto real da Moorah, não um
mockup de app; o relevo da amora e as ondas são da identidade; o seletor de titular e dependentes é
uma ferramenta, não decoração (padrão dr.consulta). O símbolo está sobre superfície lisa, como o
manual pede.

O que destoa: a wordmark repetida dentro da seção (o header já a mostra), o número de exemplo em
mono ("1234 5678 9012") lê como placeholder de formulário, e o bloco vem colado ao branco da seção
anterior sem transição de ritmo.

### 6.7 Benefícios (`desktop-beneficios.png`)

O que há: bento de cinco cards numerados 01 a 05: foto do tablet + mini portal com abas e chips;
foto de laboratório com diagrama de pontos e chip "Desconto aplicado na rede"; campo de número de
cartão com "Cartão reconhecido"; card com linha e três pontos; card com três chips de segurança.

Por que parece mecânico: é a seção com mais sinais de template acumulados: bento grid (moda
2023-2025 de landing de SaaS), mini UIs falsas (anti-padrão 8), diagrama de pontos e chip sobre foto
(anti-padrão 1 e veto do cliente), linha decorativa com pontos (anti-padrão 3 e veto), ícones em
círculo, numeração. Os títulos são bons ("Segurança de verdade", "Descontos em farmácias"); as
provas visuais são inventadas. O mercado bom prova com foto de serviço real (Beep, dr.consulta) ou
com nome de parceiro (Cartão de TODOS cita Droga Raia e Drogasil; Vale Saúde mostra a+ e Bronstein).
Sem contrato assinado não há logo para mostrar, e nesse caso o certo é uma frase honesta, não uma
tela falsa.

### 6.8 Planos (`desktop-planos.png`)

O que há: título e parágrafo à esquerda, foto de família em card com chip "R$ 24,48 por pessoa no
Familiar" sobreposto; seletor "Para quantas pessoas? 1 2 3 4"; dois cards de plano (Individual
claro, Familiar plum com badge "Mais escolhido"); painel "Incluído / Não está incluído"; aviso SAMU.

Por que funciona: preço grande e claro, "equivale a R$ 24,48 por pessoa" (padrão 4.5, reescrever em
unidade menor), o painel de incluído e não incluído é a coisa mais honesta da página, o aviso "não é
plano de saúde" está no lugar certo.

O que destoa: chip sobre a foto da família (veto), a família de banco posando para a câmera com
sorriso de catálogo (anti-padrão 1), o badge "Mais escolhido" sem dado (a regra do projeto é não
inventar prova; antes do lançamento ninguém escolheu nada), o seletor 1 a 4 em pill que gera preços
intermediários que a pendência do projeto já aponta como duvidosos, e o valor por pessoa em mono.

### 6.9 Diferenciais (`desktop-diferenciais.png`)

O que há: "Por que a Moorah." e quatro colunas com traço horizontal no topo, número 01 a 04, ícone
em círculo, título e texto.

Por que parece mecânico: é a seção mais template da página. Quatro colunas com traço, número e ícone
é o "features grid" que 11 dos 70 sites usam e que nenhum dos bons usa. Os títulos ("Tecnologia
própria", "Atendimento humano", "Experiência simples", "Rede em crescimento") valem para qualquer
telemedicina do país; "Rede em crescimento" confessa que a rede ainda não existe. O traço horizontal
de 1 px sobre cada coluna é exatamente o traço que o cliente pediu para não existir em lugar nenhum.
Se a seção ficar, precisa de uma prova por item (número, nome, fato), não de ícone.

### 6.10 Dúvidas (`desktop-duvidas.png`)

O que há: título à esquerda, card SAMU com borda vermelha, card de e-mail, acordeão de nove perguntas
numeradas com ícone de mais.

Por que funciona: as perguntas são as certas ("A Moorah é um plano de saúde?", "Existe carência ou
fidelidade?", "Quem pode ser dependente?") e as respostas são diretas. O SAMU em destaque é
responsável.

O que destoa: numeração 01 a 09 em mono (a sexta seção com esse recurso), e o e-mail em mono
sublinhado que lê como código.

### 6.11 Contato (`desktop-contato.png`)

O que há: bloco plum, wordmark repetida, trilhas do circuito fantasmas atrás do título, título
"Saúde acessível para quem importa.", CTA "Escolher meu plano", card branco com formulário de lead
(nome, e-mail, WhatsApp, plano, aceite) e botão "Quero assinar", foto de mulher acenando para o
notebook em card, marca d'água do símbolo.

Por que parece mecânico: as trilhas do circuito atrás do título são decoração linear (veto). O botão
diz "Quero assinar" mas o formulário só captura contato ("Deixe seu contato e retornamos por
e-mail"): promessa e ação não batem, e isso é o tipo de coisa que um leitor atento percebe como
"copiado de outro site". A foto da mulher de headset acenando é banco de imagens em pose (a mesma que
o brief v3 já apontou como repetida). A wordmark repetida pela terceira vez.

O que funciona: o título tem voz, a marca d'água do símbolo sobre plum liso respeita o manual, o
aviso "não é plano de saúde" sob o botão está no formato certo (microcopy sob o CTA, como One Medical
e Doctronic).

### 6.12 Footer (`desktop-footer.png`)

Limpo: símbolo grande em plum, descrição, três colunas de links, linha legal com quatro frases
separadas por ponto plum, marca d'água. É o footer de um site de gente. A única redundância é a
faixa legal do topo do site, que repete o que está aqui.

### 6.13 Diagnóstico transversal

O que dá "cara de IA" não é uma seção; é a soma de seis hábitos aplicados sem variação em toda a
página:

1. Eyebrow em JetBrains Mono caixa alta em todas as dez seções.
2. Numeração 01 a 0n em seis seções.
3. Ícone lucide em círculo rosa-claro em cinco seções.
4. Todo título termina com ponto final e tem tracking negativo forte (tique de landing de software).
5. Mini interfaces falsas como prova (três seções).
6. Diagrama de circuito como metáfora visual (hero, Manifesto, Especialidades, Benefícios,
   Contato).

Cada um desses gestos é defensável isolado; o manual até autoriza mono em rótulos de sistema. O
problema é que a página tem um único compasso do início ao fim e nenhuma cena de gente que ocupe a
tela. Os sites que o cliente admira variam a densidade e apostam em uma foto grande por página. A
correção do hero é o começo; se o resto da página mantiver os seis hábitos, o novo hero vai parecer
"a parte boa de um template".

## 7. Três direções de hero para a Moorah

Regras que valem para as três (vetos do cliente e restrições do brief v3):

- Nenhum card, chip, texto ou símbolo sobre foto. Texto só sobre área de cor lisa.
- Nada que lembre "copy à esquerda + imagem com cartões à direita".
- Nenhum traço decorativo horizontal; separadores só "·". Nenhum travessão.
- Símbolo da marca só em plum (#4B244D) ou branco, sobre superfície lisa; nunca sobre foto.
- Plus Jakarta Sans no título (o manual mostra 700; as referências pedem 500 ou 600, então a
  recomendação é 600 com tracking -0.02em e a última linha em 700 quando houver contraste), Manrope
  no corpo, JetBrains Mono em uma única linha de rótulo por hero.
- H1 no servidor, frase completa acessível; preço a partir de `plans[0]`; CTAs para `#planos` e
  `#como-funciona`; trust com "não é plano de saúde".
- Um único movimento. Sem vídeo nesta rodada (restrição 9 do brief); a foto estática tem que
  funcionar sozinha, e o vídeo fica como evolução quando houver material próprio.
- Fotos atuais são placeholders do Pexels; as três direções pedem uma foto ambientada de pessoa
  comum, 40 a 55 anos ou pai/mãe com criança, em casa, sem jaleco, olhar fora da câmera, com espaço
  negativo para o texto. Se o médico aparecer, só como miniatura na tela do celular que a pessoa
  olha (Teladoc).

### Direção A: Retrato editorial em plum

Ancoragem: Conexa (`refs/telemedicina-br/conexa-1440.png`), Function
(`refs/saude-assinatura/function-1440.png` e `function-mobile.png`), Parsley
(`refs/saude-assinatura/parsley-1440.png`), Superpower (`refs/saude-assinatura/superpower-1440.png`).

O que emprestar: uma foto grande de pessoa em casa ocupando o bloco inteiro, com o texto no espaço
negativo (Conexa, Parsley); nav que vira vidro sobre a imagem (Conexa, Function); linha de prova
pequena acima do título e três stats no canto inferior direito, sem caixa (Function); cartão
arredondado com margem e stats no rodapé do cartão (Superpower); título com contraste por peso, não
por cor (Conexa).

Como virar Moorah: o bloco arredondado com margem continua. Dentro dele, a foto sangra à direita e é
tratada em plum (sombras tingidas de berry-950, luz quente de janela ou abajur, nada de teal), e um
gradiente plum sólido cobre os 45% da esquerda onde o texto vive; nenhum texto toca a pessoa. Na
coluna de texto, de cima para baixo: uma linha de prova em JetBrains Mono 11 px (fato verificável:
"TELEMEDICINA REGULAMENTADA · CFM 2.314/2022 · MÉDICOS COM CRM ATIVO", ou a nota do app quando
existir), H1 em Plus Jakarta 600 em duas linhas ("Um médico por vídeo" em 600 branco, "quando você
precisar." em 700 berry-100), uma frase em Manrope com o preço em bold da mesma família ("Consultas
ilimitadas em 12 especialidades. Individual a partir de R$ 49,90 por mês, Familiar para até 4
pessoas. Sem taxa de adesão."), dois CTAs pill (branco cheio e vidro), microcopy "Assinatura mensal.
Não é plano de saúde." em 13 px. No canto inferior direito, sobre a parte lisa do gradiente (nunca
sobre a pessoa), três stats em Plus Jakarta 600 + Manrope: "Ilimitadas / consultas por vídeo", "12
especialidades / na plataforma hoje", "R$ 1,66 por dia / R$ 49,90 por mês" (aritmética sobre o preço
atual, a confirmar). Símbolo só no header. Movimento: um fade da foto em 600 ms e o header ganhando
blur ao rolar; nada mais. Mobile (regra Function): foto no topo ocupando 55% da tela com a pessoa
inteira, gradiente para plum na base, texto sobre plum liso abaixo, stats em uma faixa própria.

O que evitar: rede, nós, cometas, discos de foto, marquee, colofão mono adicional, eyebrow mono e
linha de prova ao mesmo tempo (é uma ou outra), palavra em gradiente, qualquer objeto sobre a foto,
médico de jaleco na foto, escurecer a foto até virar silhueta (erro Levels), depender da foto no
mobile virando gradiente sem pessoa (erro Conexa mobile).

Risco: a direção depende de uma foto boa. Com Pexels, escolher cena com luz de janela, pessoa de
perfil ou olhando o celular, roupa neutra, fundo que aceite tingimento plum. Se a foto for fraca, a
direção B é o plano seguro.

### Direção B: Tipográfico quente com preço na frase e foto cortada pela dobra

Ancoragem: Mira (`refs/exterior/mira-1440-v2.png`), Hilab (`refs/healthtech-br/hilab-1440.png`),
curated.design (`refs/complementar/curated-1440.png`), Sesame (`refs/exterior/sesame-1440.png`) para a
prova em texto puro.

O que emprestar: coluna única centralizada com muito respiro, uma linha de prova pequena, título
grande com primeira linha rotativa (Mira), preço escrito no parágrafo (Mira, Sesame), dois botões
lado a lado, e a foto entrando pela base da dobra em um card largo de cantos grandes, sem nada por
cima (Hilab, Mira). Superfície quente em vez de branco (Mira bege, curated off-white).

Como virar Moorah: aqui o bloco pode ser claro, na aplicação alternativa da marca: um off-white
tingido de ameixa (o `gray-50` do projeto já é cinza tingido de plum) ou o próprio plum se o cliente
preferir manter o escuro. Linha de prova em mono 11 px berry-600 sobre claro. H1 centralizado em
Plus Jakarta 600, 64 a 72 px em 1440, em duas linhas: a primeira alterna a especialidade em plum
("Cardiologia", "Pediatria", "Dermatologia", "Psicologia"...), a segunda é fixa em ink ("por vídeo,
quantas vezes precisar."). Frase completa em sr-only e a primeira especialidade renderizada no
servidor (lição Click Life). Parágrafo Manrope 18 px com largura de 34rem: "Consultas ilimitadas nos
planos Individual (R$ 49,90 por mês) e Familiar (R$ 97,90 para até 4 pessoas). Receitas e atestados
digitais. Cartão Moorah com desconto em farmácias e exames." Dois CTAs pill centralizados (plum
cheio + outline plum). Microcopy "Sem taxa de adesão. Não é plano de saúde." Abaixo, ainda dentro da
primeira dobra, um card de foto de 1100 x 520 px com cantos de 24 px, mostrando uma família ou um
casal em casa em plano aberto, cortado pela borda inferior da tela para convidar a rolar; nada por
cima. O símbolo pode aparecer pequeno em plum ao lado da linha de prova, sobre a superfície lisa.
Movimento: só a palavra rotativa (450 ms, a cada 3,5 s, pausa com `document.hidden`). Mobile: título
em 40 px com a mesma rotação, parágrafo, CTAs empilhados, foto logo abaixo dos botões no primeiro
scroll.

O que evitar: qualquer ícone, chip ou card entre o título e a foto; eyebrow mono e linha de prova
juntos; grade de especialidades clicável (a Medprev faz e parece tabela de preços); a foto virar
faixa fina no mobile; usar a serifa (o manual não tem serifa, e a Plus Jakarta em 600 com respiro já
faz o trabalho editorial que Hilab faz com serifa).

Risco: em coluna única, a primeira tela pode parecer fria se a foto ficar abaixo da dobra em telas
baixas (1366x768). Garantir que pelo menos 160 px da foto apareçam em 768 de altura.

### Direção C: Duas colunas honestas: bullets com número e foto que sangra em arco

Ancoragem: Kry e Livi (`refs/exterior/kry-1440-v2.png`, `refs/exterior/livi-1440.png`), Vale Saúde
(`refs/complementar/valesaudesempre-1440.png`, pela lista de três provas com número em bold), Hapvida
home (`refs/complementar/hapvida-1440.png`, pela barra de números e pela foto ambientada de pai e
filho), One Medical (`refs/exterior/onemedical-1440.png`, pelo recorte ousado).

O que emprestar: título curto de duas linhas; três bullets com check fino dizendo o que a pessoa
ganha, com o número em bold; dois botões; uma única barra de três números na base; a foto como um só
retângulo sangrando na borda direita, com um único recorte intencional (arco de Kry, canto grande de
PlushCare ou o corte ousado de One Medical), e absolutamente nada por cima dela.

Como virar Moorah: o bloco plum arredondado permanece. À esquerda (5/12): H1 Plus Jakarta 600 em
duas linhas fixas ("Consultas médicas ilimitadas / para você e sua família."), três bullets em
Manrope 17 px com check em leaf-300 e número em 700 ("Individual R$ 49,90 por mês · Familiar R$ 97,90
para até 4 pessoas", "12 especialidades por vídeo, sem custo por consulta", "Cartão Moorah com
desconto em farmácias e exames"), dois CTAs pill, microcopy "Sem taxa de adesão. Não é plano de
saúde." À direita (7/12): uma foto de casal 45-55 ou pai/mãe com criança em casa, ocupando toda a
altura do bloco e sangrando na borda direita, com a borda esquerda em arco largo (raio igual à
altura, como Kry) ou em gradiente plum de 120 px; o médico só se aparecer pequeno na tela do celular
(Teladoc). Na base do bloco, uma linha de três fatos em Plus Jakarta 600 + Manrope separados por
espaço e "·" ("Telemedicina regulamentada · CFM 2.314/2022", "Dados criptografados · LGPD",
"Cancele quando quiser"), sem card, sem divisor vertical, sem hairline. Símbolo só no header.
Movimento: fade da foto em 600 ms; opcionalmente o header vira vidro. Mobile (regra Kry e Vale
Saúde): título, bullets e CTAs primeiro sobre plum, a foto logo abaixo com o arco na base, os fatos
em lista.

O que evitar: o bloco de cor atrás da foto (Einstein), qualquer objeto sobre a foto, neon ou contorno
(Vale Saúde), botão retangular (Vale Saúde, Pronto Socorro Online), a barra de números em card com
sombra cruzando a foto (Kry faz e é bonito, mas cruza a foto; aqui a barra fica abaixo), família
posando para a câmera com sorriso de catálogo, mais de três bullets, ícones lucide em círculo ao lado
dos bullets.

Risco: é a direção mais próxima da estrutura que o cliente chamou de repetitiva. O que a salva é a
foto ser um só retângulo sangrando (não um objeto centrado) e a coluna visual não ter nada além da
pessoa. Se em qualquer momento alguém quiser "enriquecer" a foto com um chip, a direção morre.

### Recomendação

A (Retrato editorial em plum) é a que mais se aproxima do que o cliente aponta como referência e da
aplicação principal da marca; é a aposta. B é o plano seguro se a foto disponível for fraca, e é a
única das três que funciona bem em fundo claro. C é a evolução conservadora do que existe e só faz
sentido se o cliente quiser manter a leitura em duas colunas.

Nas três, a rede "Trilha da Amora" sai do hero. Ela pode viver na seção Especialidades ou no
Manifesto, em tamanho menor e sem fotos dentro, como assinatura gráfica, não como imagem principal.

## 8. Regra de mobile (das capturas)

- Conexa perde a pessoa e vira gradiente cinza (`refs/telemedicina-br/conexa-mobile.png`); Estação
  Unimed vira fundo verde chapado; Hapvida empurra a foto para fora da primeira tela. Erro.
- Function mantém a pessoa no topo e o texto na metade inferior sobre a parte escura da foto, stats
  em faixa creme abaixo (`refs/saude-assinatura/function-mobile.png`). Vale Saúde põe texto em cima e
  casal embaixo, inteiro (`refs/complementar/valesaudesempre-mobile.png`). Kry põe a foto em arco no
  topo e o texto abaixo (`refs/exterior/kry-mobile-v2.png`). Acerto.
- Regra para a Moorah: título, frase de preço e CTA na primeira tela; a foto da pessoa inteira
  visível no primeiro scroll (acima ou logo abaixo dos CTAs), nunca como fundo atrás do texto e nunca
  em círculo pequeno. Stats e provas em lista abaixo. Hoje o mobile da Moorah abre com cinco blocos
  de texto e a primeira pessoa aparece com 51 px de diâmetro.

## 9. Decisões que só o cliente fecha

A pesquisa mostra o formato; o conteúdo depende de fatos que ainda não existem no projeto
(`docs/conteudo-a-confirmar.md`):

1. Prova social real: nota de app, número de médicos com CRM, consultas realizadas, selo Reclame
   Aqui, tempo médio até a consulta. Sem dado, a linha de prova usa fatos regulatórios (CFM
   2.314/2022, LGPD, "cancele quando quiser") e nada mais. Nenhum "Mais escolhido", nenhum "+ de X
   pacientes".
2. Farmácias e laboratórios que podem ser nomeados. Cartão de TODOS escreve "Droga Raia e Drogasil";
   Vale Saúde mostra a+ e Bronstein; VidaClass empresta o Einstein. Nome real vale dez vezes mais que
   "rede parceira", e só entra com contrato.
3. Número de especialidades a afirmar: "qualquer especialidade" (hero atual) ou "12 especialidades"
   (seção atual). Recomendo o número.
4. Fórmula do Familiar: "por pessoa" (Pronto Socorro Online) ou "para até 4 pessoas" (Vale Saúde,
   dr.consulta). A segunda vende melhor o Familiar; a primeira é mais clara para 40+. As três direções
   usam "para até 4 pessoas" com o valor total, e a página de planos faz a conta por pessoa.
5. Foto própria ou licenciada com pessoas brasileiras em casa. É a decisão que mais muda o resultado;
   nenhuma das três direções fica boa com recorte de banco.
6. Aviso regulatório: microcopy de 13 px sob o CTA ("Assinatura mensal. Não é plano de saúde.")
   em vez de frase longa com ícone de escudo. Confirmar com o jurídico se essa forma curta basta na
   primeira dobra, com a frase completa em Planos e no footer.
7. Fundo escuro (aplicação principal do manual, direções A e C) ou claro (direção B). O mercado B2C
   popular aceita os dois; o que decide é a foto.
8. Vídeo: nenhum concorrente brasileiro usa; seis premium do exterior usam. Fica para quando houver
   material próprio, com botão de pausa (Function) e a foto como fallback.

## 10. Checklist do construtor do hero (derivado da pesquisa)

1. Uma pessoa inteira, em cena real, ocupando pelo menos 40% do bloco em desktop e visível no
   primeiro scroll do mobile. Sem jaleco fora de tela. Sem círculo pequeno.
2. Nenhum objeto sobre a foto: nem chip, nem card, nem símbolo, nem texto, nem diagrama.
3. Um só elemento de prova (linha acima do título ou barra de fatos abaixo), com fato verificável.
4. Preço em texto corrido, na mesma família do texto, em bold, com "por mês" e o Familiar na mesma
   frase.
5. H1 em Plus Jakarta 600 (700 só na linha de contraste), sem gradiente, sem cor de matiz diferente,
   4 a 9 palavras por frase, ponto final. Renderizado no servidor.
6. Dois CTAs pill. Zero ícones lucide em círculo. Zero numeração. Um único rótulo mono, se houver.
7. Um movimento (fade da foto, palavra rotativa ou header em vidro). Sem marquee, sem cometas, sem
   nó aceso, sem carrossel.
8. Nenhum traço horizontal, nenhum travessão, separadores só "·".
9. Símbolo da marca só no header ou sobre superfície lisa.
10. Conferir em 360, 768, 1024, 1366x768, 1440x900 e 1920 que a pessoa aparece e que nada cobre o
    rosto; conferir que o H1 existe com JS desligado.
