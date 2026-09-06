/*
  Conteudo unico da landing page. Tudo que e texto, preco ou lista vive aqui.
  Variaveis NEXT_PUBLIC_* sao lidas em build e podem ser usadas no cliente.
  Nada aqui pode conter travessao (U+2014); use hifen.
*/

export const site = {
  name: "Moorah",
  product: "Moorah Telemedicina",
  legalName: "Moorah Ltda",
  description:
    "Consultas médicas online ilimitadas, em qualquer especialidade, para você e sua família. Cartão Moorah com descontos em farmácias, exames e lojas parceiras. Planos Individual e Familiar por assinatura mensal.",
  tagline: "Cuidar da saúde da sua família ficou simples, imediato e acessível.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moorah.com.br",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "comercial@moorah.com.br",
    // Somente digitos com DDI (ex.: 5511999999999). Vazio esconde os botoes de WhatsApp.
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
    // Preenchido quando a empresa tiver CNPJ registrado. Vazio esconde a linha no rodape.
    cnpj: process.env.NEXT_PUBLIC_CNPJ ?? "",
    // Encarregado de dados (LGPD, art. 41). Cai no e-mail comercial enquanto nao houver canal proprio.
    dpoEmail:
      process.env.NEXT_PUBLIC_DPO_EMAIL ??
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
      "comercial@moorah.com.br",
  },
  // URL do portal do paciente (login). Vazio esconde o botao "Entrar".
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN ?? "",
  },
} as const;

export const nav = [
  { id: "como-funciona", label: "Como funciona" },
  { id: "especialidades", label: "Especialidades" },
  { id: "beneficios", label: "Benefícios" },
  { id: "planos", label: "Planos" },
  { id: "duvidas", label: "Dúvidas" },
] as const;

export type PlanId = "individual" | "familiar";

export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  people: number;
  peopleLabel: string;
  headline: string;
  features: readonly string[];
  highlight: boolean;
  cta: string;
}

export const plans: readonly Plan[] = [
  {
    id: "individual",
    name: "Individual",
    priceCents: 4990,
    people: 1,
    peopleLabel: "1 pessoa",
    headline: "Para quem quer resolver a própria saúde sem fila e sem espera.",
    features: [
      "Consultas por vídeo ilimitadas, em qualquer especialidade",
      "Clínico geral e especialistas",
      "Receitas, atestados e pedidos de exame digitais",
      "Cartão Moorah incluso",
      "Descontos em farmácias, exames e lojas parceiras",
      "Portal do paciente completo",
    ],
    highlight: false,
    cta: "Assinar Individual",
  },
  {
    id: "familiar",
    name: "Familiar",
    priceCents: 12990,
    people: 4,
    peopleLabel: "até 4 pessoas: titular + 3 dependentes",
    headline: "Tudo do Individual, para cada pessoa da família.",
    features: [
      "Consultas ilimitadas para todos os membros",
      "Um Cartão Moorah para cada pessoa",
      "Pediatria, geriatria e todas as especialidades",
      "Dependentes gerenciados no portal",
      "Descontos em farmácias, exames e lojas para todos",
      "Histórico e documentos de cada pessoa em um só lugar",
    ],
    highlight: true,
    cta: "Assinar Familiar",
  },
] as const;

export const planNotes = ["Valores mensais por assinatura, sem taxa de adesão."] as const;

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function perPersonCents(plan: Pick<Plan, "priceCents" | "people">): number {
  return Math.round(plan.priceCents / plan.people);
}

export function getPlan(id: PlanId): Plan {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Plano desconhecido: ${id}`);
  return plan;
}

/*
  Preenche os tokens de preco de uma frase a partir de plans[]: {individual} e {familiar} viram
  formatBRL do plano, {people} vira o numero de pessoas do Familiar e {price} o preco de plans[0].
  Nenhum componente escreve numero de preco solto; tudo passa por aqui ou por formatBRL.
*/
export function fillPlanTokens(text: string): string {
  const individual = getPlan("individual");
  const familiar = getPlan("familiar");
  return text
    .replaceAll("{individual}", formatBRL(individual.priceCents))
    .replaceAll("{familiar}", formatBRL(familiar.priceCents))
    .replaceAll("{people}", String(familiar.people))
    .replaceAll("{price}", formatBRL(plans[0].priceCents));
}

// Chaves de icone resolvidas em src/components/icons.tsx (lucide-react).
export type IconKey =
  | "stethoscope"
  | "baby"
  | "heart-pulse"
  | "sparkles"
  | "flower"
  | "bone"
  | "activity"
  | "ear"
  | "eye"
  | "hand-heart"
  | "apple"
  | "brain"
  | "calendar-check"
  | "bell-ring"
  | "video"
  | "file-check"
  | "credit-card"
  | "pill"
  | "flask"
  | "shopping-bag"
  | "layout-dashboard"
  | "shield-check"
  | "cpu"
  | "smile"
  | "trending-up"
  | "clock"
  | "users";

export interface Specialty {
  name: string;
  blurb: string;
}

export const specialties: readonly Specialty[] = [
  { name: "Clínico geral", blurb: "Primeira porta para qualquer sintoma." },
  { name: "Pediatria", blurb: "Para os pequenos, a qualquer hora." },
  { name: "Cardiologia", blurb: "Acompanhamento de pressão e coração." },
  { name: "Dermatologia", blurb: "Pele, cabelo e unhas por vídeo." },
  { name: "Ginecologia", blurb: "Saúde da mulher em todas as fases." },
  { name: "Ortopedia", blurb: "Dores, lesões e orientação." },
  { name: "Endocrinologia", blurb: "Diabetes, tireoide e hormônios." },
  { name: "Otorrinolaringologia", blurb: "Ouvido, nariz e garganta." },
  { name: "Oftalmologia", blurb: "Orientação e acompanhamento visual." },
  { name: "Geriatria", blurb: "Cuidado atento para quem tem mais história." },
  { name: "Nutrição", blurb: "Planos alimentares e acompanhamento." },
  { name: "Psicologia", blurb: "Acolhimento e saúde emocional." },
] as const;

export interface Step {
  n: number;
  title: string;
  text: string;
}

export const steps: readonly Step[] = [
  {
    n: 1,
    title: "Agende online",
    text: "Escolha a especialidade, o médico e o horário pela plataforma. Sem telefone e sem fila.",
  },
  {
    n: 2,
    title: "Receba lembretes",
    text: "Avisos automáticos na véspera, no dia e 30 minutos antes da consulta.",
  },
  {
    n: 3,
    title: "Consulte por vídeo",
    text: "Médicos de verdade, por videochamada, pelo link seguro da própria plataforma, no celular ou no computador.",
  },
  {
    n: 4,
    title: "Documentos digitais",
    text: "Receitas, atestados e pedidos de exame ficam no seu portal, com validade em todo o Brasil.",
  },
] as const;

export const problems = [
  {
    title: "Planos pesam no bolso",
    text: "Mensalidades altas afastam famílias do cuidado contínuo.",
  },
  {
    title: "Espera longa",
    text: "Semanas de fila para uma consulta presencial ou um especialista.",
  },
  {
    title: "Cuidado só na urgência",
    text: "Sem acesso simples, a saúde vira prioridade apenas quando o problema aperta.",
  },
] as const;

export interface FaqItem {
  q: string;
  a: string;
  // Link opcional exibido apos a resposta (brief v4-secoes, 4.6).
  link?: { href: string; label: string };
}

export const faq: readonly FaqItem[] = [
  {
    q: "O que é telemedicina?",
    a: "É a consulta médica realizada por vídeo, com médico habilitado, regulamentada no Brasil pela Resolução CFM nº 2.314/2022. Receitas, atestados e pedidos de exame são emitidos com assinatura digital e valem em todo o país.",
  },
  {
    q: "As consultas são realmente ilimitadas?",
    a: "Sim. Você agenda quantas consultas precisar, em qualquer especialidade disponível na plataforma, sem custo adicional por consulta.",
  },
  {
    q: "Quem pode ser dependente no plano Familiar?",
    a: "O plano Familiar inclui o titular e até 3 dependentes. Cada pessoa recebe o próprio Cartão Moorah e tem histórico e documentos separados, tudo gerenciado pelo titular no portal.",
  },
  {
    q: "Existe carência ou fidelidade?",
    a: "Não há carência: com a assinatura confirmada, o acesso é liberado e você já pode agendar. A assinatura é mensal e pode ser cancelada quando quiser.",
  },
  {
    q: "Como funciona o agendamento?",
    a: "Você escolhe a especialidade, o médico e o horário na plataforma. Recebe lembretes na véspera, no dia e 30 minutos antes, e entra na consulta pelo link seguro da própria Moorah.",
  },
  {
    q: "Posso usar em mais de um aparelho?",
    a: "Sim. A plataforma funciona no navegador do celular, tablet ou computador, sem precisar instalar nada.",
  },
  {
    // Substitui o antigo beneficio "Seguranca de verdade": afirma so o sigilo medico (dever legal)
    // e remete a Politica de privacidade; criptografia e infraestrutura dependem de confirmacao
    // da engenharia (docs/conteudo-a-confirmar.md).
    q: "Meus dados de saúde estão protegidos?",
    a: "Sim. Os dados de saúde ficam sob sigilo médico, e a Política de privacidade descreve quem acessa o quê e em que situações.",
    link: { href: "/privacidade", label: "Ler a Política de privacidade" },
  },
] as const;

/*
  Links dos documentos legais para o header e o menu mobile. Copia leve dos titulos de
  src/content/legal (o header e cliente e nao pode carregar os documentos inteiros no bundle).
  legal.test.ts garante que os titulos continuam iguais aos dos documentos.
*/
export const legalLinks = [
  { slug: "termos", href: "/termos", label: "Termos de uso" },
  { slug: "privacidade", href: "/privacidade", label: "Política de privacidade" },
  { slug: "lgpd", href: "/lgpd", label: "LGPD e seus direitos" },
] as const;

/* ---------- Copy por secao (docs/design-brief-v4-secoes.md e v4-hero.md) ---------- */
/* Chaves com {price} sao substituidas pelo componente com formatBRL(...). */

// Fato curto do pe do hero v4: valor em Plus Jakarta 600, legenda em Manrope. Sem icone, sem numero.
export interface HeroFact {
  value: string;
  label: string;
}

// Bullet da variante de preview: trechos em texto corrido e trechos em negrito (mesma familia).
export type HeroBulletSegment = string | { strong: string };

/*
  Hero v4 (docs/design-brief-v4-hero.md): titulo em duas linhas visiveis (sem rotacao, sem
  sr-only), lead curta, frase de preco com os dois planos e tres fatos no pe do bloco.
  Tokens {individual}, {familiar}, {people} e {price} sao resolvidos por fillPlanTokens.
  Sem "nao e plano de saude" (fica em Planos, rodape e termos), sem LGPD, sem nome do parceiro
  medico; a promessa comercial segue "qualquer especialidade" (decisoes do cliente de 04/09/2026).
*/
export const hero = {
  title: "Um médico por vídeo, quando você precisar.",
  // Linha 1 em Plus Jakarta 600 branco, linha 2 em 700 berry-100. Juntas formam hero.title.
  titleLines: ["Um médico por vídeo,", "quando você precisar."],
  lead: "Consultas ilimitadas em qualquer especialidade, para você ou para toda a família.",
  // Manrope 700 branco na propria frase, nunca em card nem em mono.
  prices: "Individual por {individual} por mês. Familiar por {familiar} para até {people} pessoas.",
  priceNote: "Sem taxa de adesão.",
  primaryCta: "Escolher meu plano",
  secondaryCta: "Como funciona",
  // Pe do bloco: tres fatos verificaveis que nao repetem a lead nem a frase de preco.
  facts: [
    { value: "Médicos habilitados", label: "telemedicina regulamentada" },
    { value: "Receitas e atestados", label: "digitais, válidos em todo o Brasil" },
    { value: "Cartão Moorah incluso", label: "desconto em farmácias, exames e lojas parceiras" },
  ] satisfies readonly HeroFact[],
  // Variante de preview (/previews/hero-alt): bullets no lugar da lead e microcopy sob os CTAs.
  bullets: [
    [
      { strong: "Individual por {individual}" },
      " por mês e ",
      { strong: "Familiar por {familiar}" },
      " para até {people} pessoas",
    ],
    [
      { strong: "Consultas ilimitadas" },
      " em qualquer especialidade, para você ou para toda a família",
    ],
    [{ strong: "Agende e consulte" }, " pelo celular ou computador, sem instalar nada"],
  ] satisfies readonly (readonly HeroBulletSegment[])[],
  micro: "Assinatura mensal, sem taxa de adesão.",
} as const;

export const problemsSection = {
  eyebrow: "Por que a Moorah existe",
  title: "Cuidar da saúde não devia ser tão difícil.",
} as const;

export const manifesto = {
  title: "Chega de mil soluções separadas.",
  text: "Consulta, receita, exame, farmácia e histórico da família em uma única assinatura, com um só cartão e um só portal.",
} as const;

export const howItWorks = {
  title: "Agendou, foi lembrado, consultou.",
  lead: "Quatro passos, do agendamento ao documento digital, tudo dentro da plataforma da Moorah.",
} as const;

export const specialtiesSection = {
  title: "Qualquer especialidade, quantas vezes precisar",
  lead: "Consultas ilimitadas em qualquer especialidade disponível na plataforma, sem custo adicional por consulta.",
} as const;

export const cardSection = {
  eyebrow: "Cartão Moorah",
  title: "Um número. Todos os benefícios.",
  // Paragrafo de abertura do bloco fundido (era benefits[0].text).
  lead: "Cada titular e dependente recebe um cartão com numeração exclusiva de 12 dígitos: a chave para toda a rede de cuidado e vantagens.",
  // Lista tipografica do bloco fundido (brief v4-secoes, 4.4): quatro itens, sem icone.
  benefits: [
    {
      title: "Descontos em farmácias",
      text: "Medicamentos com desconto na rede parceira. Basta informar o número do cartão no balcão.",
    },
    {
      title: "Exames com desconto",
      text: "Laboratórios e clínicas credenciadas com condições exclusivas, do exame de rotina ao diagnóstico por imagem.",
    },
    {
      title: "Lojas e serviços parceiros",
      text: "Condições especiais em estabelecimentos parceiros, do comércio local a grandes marcas.",
    },
    {
      title: "Portal do paciente",
      text: "Histórico de consultas, receitas, documentos e dependentes organizados em um só lugar.",
    },
  ] as readonly { title: string; text: string }[],
  holderLabel: "Escolha o cartão",
  numberLabel: "Nº do cartão",
  sampleAria: "Exemplo de numeração, sem validade",
  imageAlt: "Cartão Moorah em tom ameixa escuro, com a amora em relevo e linhas onduladas.",
} as const;

// Rotulos de ilustracao do Cartao Moorah. Nunca dados reais.
export const mocks = {
  cardHolders: [
    { value: "0", label: "Titular" },
    { value: "1", label: "Dependente 1" },
    { value: "2", label: "Dependente 2" },
    { value: "3", label: "Dependente 3" },
  ],
  // Numeros ilustrativos de 12 digitos, fora de qualquer faixa de cartao bancario. Confirmar formato real.
  cardSamples: ["123456789012", "123456789013", "123456789014", "123456789015"],
} as const;

export const plansSection = {
  eyebrow: "Planos",
  title: "Um plano para você ou para toda a família",
  lead: "Assinatura mensal, sem taxa de adesão. O mesmo cuidado nos dois planos; muda só quantas pessoas usam.",
  perPersonLabel: "equivale a {price} por pessoa",
  familyNote: "O Familiar cobre até 4 pessoas pelo mesmo valor.",
  faqLink: "Entenda a diferença",
  includedTitle: "Incluído na assinatura",
  notIncludedTitle: "Não está incluído",
  included: [
    "Consultas por vídeo ilimitadas, em qualquer especialidade",
    "Receitas, atestados e pedidos de exame digitais",
    "Cartão Moorah para cada pessoa",
    "Descontos em farmácias, exames e lojas parceiras",
    "Portal do paciente com histórico e dependentes",
  ],
  notIncluded: [
    "Internação e cirurgia",
    "Atendimento presencial",
    "Atendimento de urgência e emergência",
    "Custo de exames e medicamentos, que têm desconto na rede e são pagos pelo assinante",
  ],
} as const;

// Microcopy de interface.
export const ui = {
  header: {
    cta: "Ver planos",
    ctaShort: "Planos",
    login: "Entrar",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    menuTitle: "Menu",
    skip: "Pular para o conteúdo",
    // Faixa fina acima do header e grupo no menu mobile com Termos, Privacidade e LGPD.
    legalLabel: "Documentos legais",
  },
  mobileBar: { cta: "Ver planos", label: "Atalho para planos" },
  footer: {
    navLabel: "Rodapé",
    terms: "Termos de uso",
    privacy: "Política de privacidade",
    // As fotos sao placeholders do Pexels: ver docs/conteudo-a-confirmar.md.
    photoCredit: "Fotografias ilustrativas (Pexels)",
  },
  leadForm: {
    title: "Fale com a Moorah",
    subtitle: "Deixe seu contato e a Moorah retorna por e-mail.",
    name: "Nome",
    email: "E-mail",
    whatsapp: "WhatsApp (opcional)",
    whatsappPlaceholder: "(11) 99999-1234",
    plan: "Plano de interesse",
    consent: "Li e aceito a Política de privacidade e autorizo o contato da Moorah.",
    submit: "Enviar",
    sending: "Enviando...",
    successTitle: "Recebemos seu pedido.",
    successText: "Vamos entrar em contato pelo e-mail informado.",
    errorGeneric: "Não foi possível enviar agora. Tente novamente em instantes.",
    errorRateLimited: "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
    whatsappCta: "Falar no WhatsApp",
    whatsappMessage: "Olá, quero saber mais sobre os planos da Moorah.",
  },
  pages: {
    // Titulo, descricao e aviso de minuta de cada documento legal vivem em src/content/legal/.
    backHome: "Voltar ao início",
    notFoundTitle: "Página não encontrada",
    notFoundText: "O endereço pode ter mudado ou não existe.",
  },
} as const;

export const faqSection = {
  title: "O que perguntam antes de assinar",
  contactTitle: "Ainda com dúvida?",
  contactText: "Escreva para a gente e respondemos pelo e-mail.",
} as const;

export const finalCta = {
  title: "Saúde acessível para quem importa.",
  text: "Escolha o plano e agende a primeira consulta por vídeo pela plataforma da Moorah. Sem fila e sem taxa de adesão.",
  primaryCta: "Escolher meu plano",
} as const;

/*
  Fotografias (Pexels, licenca livre para uso comercial, sem atribuicao obrigatoria).
  Sao placeholders ate a Moorah ter fotos proprias ou licenciadas: ver docs/conteudo-a-confirmar.md.
  URLs servidas pelo CDN do Pexels e otimizadas pelo next/image (remotePatterns em next.config.ts).
*/
export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  creditUrl: string;
}

// cdnWidth: largura pedida ao CDN do Pexels (1600 nas secoes; 1920 so nas fotos do hero, que sao o LCP).
function pexels(id: string, width: number, height: number, alt: string, cdnWidth = 1600): Photo {
  return {
    id,
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${cdnWidth}`,
    width,
    height,
    alt,
    credit: "Pexels",
    creditUrl: `https://www.pexels.com/photo/${id}/`,
  };
}

export type PhotoKey =
  | "heroCasa"
  | "heroFamilia"
  | "heroMaeFilha"
  | "heroSenior"
  | "idosoTablet"
  | "pessoaCasa";

export const photos: Record<PhotoKey, Photo> = {
  /*
    Hero v4 (docs/design-brief-v4-hero.md). Pessoas comuns em casa, sem jaleco, olhar fora da
    camera, luz de janela; todas verificadas no CDN em w=1920 (HTTP 200, image/jpeg, 1920x1280).
    heroCasa: hero principal. heroFamilia: variante de preview. heroMaeFilha e heroSenior:
    alternativas para o cliente escolher (site.hero.test.ts confere as quatro).
  */
  heroCasa: pexels(
    "17489833",
    1920,
    1280,
    "Mulher sentada no sofá da sala, de pernas cruzadas, olhando o celular perto de uma janela ampla com luz de fim de tarde.",
    1920,
  ),
  heroFamilia: pexels(
    "27176483",
    1920,
    1280,
    "Mãe sentada no sofá de casa com o bebê no colo, olhando o celular, enquanto o filho maior brinca ao fundo da sala.",
    1920,
  ),
  heroMaeFilha: pexels(
    "8259883",
    1920,
    1280,
    "Mãe e filha abraçadas no sofá de casa, sorrindo enquanto olham juntas a tela do celular.",
    1920,
  ),
  heroSenior: pexels(
    "27086767",
    1920,
    1280,
    "Senhor de cabelo branco e camisa polo clara, sentado no sofá da sala de casa, sorrindo enquanto mexe no celular.",
    1920,
  ),
  idosoTablet: pexels(
    "8376171",
    1600,
    1067,
    "Senhor em casa conversando com a médica pelo tablet, com os medicamentos organizados na mesa.",
  ),
  /*
    Secao "Por que" (brief v4-secoes, 4.1 e 6): mae e filha preparando lanche na mesa da cozinha,
    luz natural, olhar fora da camera, sem celular, tablet ou notebook no quadro, sem marcas.
    Original 3337x5000 (2:3); CDN verificado em w=1600 (HTTP 200, image/jpeg, 1600x2397).
    Fotografo: August de Richelieu (Pexels).
  */
  pessoaCasa: pexels(
    "4259710",
    1600,
    2397,
    "Mãe e filha preparando um lanche juntas na mesa da cozinha, com luz natural da janela.",
  ),
};
