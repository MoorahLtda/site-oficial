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
  badge?: string;
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
    badge: "Mais escolhido",
    cta: "Assinar Familiar",
  },
] as const;

export const planNotes = [
  "Valores mensais por assinatura, sem taxa de adesão.",
  "Em urgências e emergências, procure o serviço presencial mais próximo ou ligue 192 (SAMU).",
] as const;

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
  icon: IconKey;
  blurb: string;
}

export const specialties: readonly Specialty[] = [
  { name: "Clínico geral", icon: "stethoscope", blurb: "Primeira porta para qualquer sintoma." },
  { name: "Pediatria", icon: "baby", blurb: "Para os pequenos, a qualquer hora." },
  { name: "Cardiologia", icon: "heart-pulse", blurb: "Acompanhamento de pressão e coração." },
  { name: "Dermatologia", icon: "sparkles", blurb: "Pele, cabelo e unhas por vídeo." },
  { name: "Ginecologia", icon: "flower", blurb: "Saúde da mulher em todas as fases." },
  { name: "Ortopedia", icon: "bone", blurb: "Dores, lesões e orientação." },
  { name: "Endocrinologia", icon: "activity", blurb: "Diabetes, tireoide e hormônios." },
  { name: "Otorrinolaringologia", icon: "ear", blurb: "Ouvido, nariz e garganta." },
  { name: "Oftalmologia", icon: "eye", blurb: "Orientação e acompanhamento visual." },
  { name: "Geriatria", icon: "hand-heart", blurb: "Cuidado atento para quem tem mais história." },
  { name: "Nutrição", icon: "apple", blurb: "Planos alimentares e acompanhamento." },
  { name: "Psicologia", icon: "brain", blurb: "Acolhimento e saúde emocional." },
] as const;

export interface Step {
  n: number;
  title: string;
  text: string;
  icon: IconKey;
}

export const steps: readonly Step[] = [
  {
    n: 1,
    title: "Agende online",
    text: "Escolha a especialidade, o médico e o horário pela plataforma. Sem telefone e sem fila.",
    icon: "calendar-check",
  },
  {
    n: 2,
    title: "Receba lembretes",
    text: "Avisos automáticos na véspera, no dia e 30 minutos antes da consulta.",
    icon: "bell-ring",
  },
  {
    n: 3,
    title: "Consulte por vídeo",
    text: "Atendimento humano, pelo link seguro da própria plataforma, no celular ou computador.",
    icon: "video",
  },
  {
    n: 4,
    title: "Documentos digitais",
    text: "Receitas, atestados e pedidos de exame ficam no seu portal, com validade em todo o Brasil.",
    icon: "file-check",
  },
] as const;

export interface Benefit {
  title: string;
  text: string;
  icon: IconKey;
}

export const benefits: readonly Benefit[] = [
  {
    title: "Cartão Moorah",
    text: "Cada titular e dependente recebe um cartão com numeração exclusiva de 12 dígitos: a chave para toda a rede de cuidado e vantagens.",
    icon: "credit-card",
  },
  {
    title: "Descontos em farmácias",
    text: "Medicamentos com desconto na rede parceira. Basta informar o número do cartão no balcão.",
    icon: "pill",
  },
  {
    title: "Exames com desconto",
    text: "Laboratórios e clínicas credenciadas com condições exclusivas, do exame de rotina ao diagnóstico por imagem.",
    icon: "flask",
  },
  {
    title: "Lojas e serviços parceiros",
    text: "Condições especiais em estabelecimentos parceiros, do comércio local a grandes marcas.",
    icon: "shopping-bag",
  },
  {
    title: "Portal do paciente",
    text: "Histórico de consultas, receitas, documentos e dependentes organizados em um só lugar.",
    icon: "layout-dashboard",
  },
  {
    title: "Segurança de verdade",
    text: "Dados de saúde criptografados, infraestrutura no Brasil e conformidade com a LGPD.",
    icon: "shield-check",
  },
] as const;

export interface Differentiator {
  title: string;
  text: string;
  icon: IconKey;
}

export const differentiators: readonly Differentiator[] = [
  {
    title: "Tecnologia própria",
    text: "Plataforma desenvolvida pela Moorah, do agendamento à consulta em vídeo, sem depender de aplicativos de terceiros.",
    icon: "cpu",
  },
  {
    title: "Atendimento humano",
    text: "Médicos de verdade, por videochamada. A tecnologia organiza; quem cuida é gente.",
    icon: "smile",
  },
  {
    title: "Experiência simples",
    text: "Agendou, foi lembrado, consultou. Sem telefone, sem papelada e sem fila.",
    icon: "clock",
  },
  {
    title: "Rede em crescimento",
    text: "Novos parceiros de exames, farmácias e lojas entrando na rede continuamente.",
    icon: "trending-up",
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
}

export const faq: readonly FaqItem[] = [
  {
    q: "O que é telemedicina?",
    a: "É a consulta médica realizada por vídeo, com médico habilitado, regulamentada no Brasil pela Resolução CFM nº 2.314/2022. Receitas, atestados e pedidos de exame são emitidos com assinatura digital e valem em todo o país.",
  },
  {
    q: "A Moorah é um plano de saúde?",
    a: "Não. A Moorah é uma assinatura de telemedicina com benefícios. Não é plano de saúde regulado pela ANS e não cobre internações, cirurgias, exames ou atendimento presencial. Exames, medicamentos e compras em parceiros têm desconto na rede credenciada e são pagos pelo assinante.",
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
    q: "E em caso de emergência?",
    a: "A telemedicina não substitui o pronto-socorro. Em situações de emergência, como dor no peito, falta de ar intensa, desmaio ou acidente, ligue 192 (SAMU) ou procure a unidade de urgência mais próxima.",
  },
  {
    q: "Meus dados de saúde estão seguros?",
    a: "Sim. Os dados são criptografados, a infraestrutura fica no Brasil e o tratamento segue a LGPD. Só você e o médico que atende têm acesso ao seu prontuário.",
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

export const legalNotes = [
  "A Moorah não é plano de saúde e não é operadora regulada pela ANS.",
  "Telemedicina regulamentada pela Resolução CFM nº 2.314/2022.",
  "Em emergências, ligue 192 (SAMU).",
] as const;

/* ---------- Copy por secao (docs/design-brief.md, secao 11) ---------- */
/* Chaves com {price} sao substituidas pelo componente com formatBRL(...). */

export interface HeroMoment {
  icon: IconKey;
  label: string;
  text: string;
  tone: "leaf" | "berry";
}

export const hero = {
  eyebrow: "Telemedicina por assinatura",
  title: "Consultas médicas ilimitadas, sem fila, para você e sua família.",
  lead: "Médico por vídeo em qualquer especialidade, receitas e atestados digitais e o Cartão Moorah com descontos em farmácias, exames e lojas parceiras.",
  priceLine: "A partir de {price} por mês, sem taxa de adesão.",
  primaryCta: "Escolher meu plano",
  secondaryCta: "Como funciona",
  // O cliente pediu para nao repetir "nao e plano de saude" na pagina (fica no rodape e nos termos).
  trust:
    "Médicos habilitados e telemedicina regulamentada no Brasil. Dados criptografados e protegidos pela LGPD.",
  proofChips: ["Qualquer especialidade", "Receitas com validade nacional", "Cartão Moorah incluso"],
  clusterAlt:
    "Ilustração de circuito: doze nós, um para cada especialidade, ligados por trilhas a um centro que representa a assinatura Moorah.",
  moments: [
    {
      icon: "calendar-check",
      label: "Consulta confirmada",
      text: "Pediatria por vídeo",
      tone: "leaf",
    },
    {
      icon: "file-check",
      label: "Receita digital emitida",
      text: "Válida em todo o Brasil",
      tone: "leaf",
    },
    {
      icon: "bell-ring",
      label: "Lembrete enviado",
      text: "Sua consulta começa em 30 minutos",
      tone: "berry",
    },
  ] satisfies readonly HeroMoment[],
} as const;

export const problemsSection = {
  eyebrow: "Por que a Moorah existe",
  title: "Cuidar da saúde não devia ser tão difícil.",
} as const;

export const manifesto = {
  eyebrow: "Tudo em um lugar",
  title: "Chega de mil soluções separadas.",
  text: "Consulta, receita, exame, farmácia e histórico da família em uma única assinatura, com um só cartão e um só portal.",
  nodes: [
    "Consulta por vídeo",
    "Receitas e atestados",
    "Exames",
    "Farmácias",
    "Portal do paciente",
  ],
  hub: "Sua assinatura Moorah",
  svgAlt:
    "Cinco trilhas, consulta, receitas, exames, farmácias e portal, convergindo para um único nó: sua assinatura Moorah.",
} as const;

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Agendou, foi lembrado, consultou.",
  lead: "Quatro passos, do agendamento ao documento digital, tudo dentro da plataforma da Moorah.",
} as const;

export const specialtiesSection = {
  eyebrow: "Especialidades",
  title: "Toda especialidade, um só lugar.",
} as const;

export const cardSection = {
  eyebrow: "Cartão Moorah",
  title: "Um número. Todos os benefícios.",
  uses: ["Telemedicina", "Farmácias", "Exames", "Lojas parceiras"],
  holderLabel: "Escolha o cartão",
  numberLabel: "Nº do cartão",
  sampleAria: "Exemplo de numeração, sem validade",
  imageAlt: "Cartão Moorah em tom ameixa escuro, com a amora em relevo e linhas onduladas.",
} as const;

export const benefitsSection = {
  eyebrow: "Vantagens no dia a dia",
  title: "Uma rede que acompanha a sua família.",
  lead: "Exames, farmácias, lojas parceiras e o portal do paciente, tudo ligado ao seu Cartão Moorah.",
} as const;

// Rotulos de ilustracao. Nunca dados reais.
export const mocks = {
  cardHolders: [
    { value: "0", label: "Titular" },
    { value: "1", label: "Dependente 1" },
    { value: "2", label: "Dependente 2" },
    { value: "3", label: "Dependente 3" },
  ],
  // Numeros ilustrativos de 12 digitos, fora de qualquer faixa de cartao bancario. Confirmar formato real.
  cardSamples: ["123456789012", "123456789013", "123456789014", "123456789015"],
  reminderChips: ["Véspera", "Hoje", "30 min antes"],
  reminderChip: "Lembrete: sua consulta começa em 30 minutos",
  slotConfirmed: "Horário confirmado",
  connected: "Conectado",
  signed: "Assinado digitalmente",
  cardNumberField: "Número do cartão",
  cardRecognized: "Cartão reconhecido",
  discountApplied: "Desconto aplicado na rede",
  portalTabsLabel: "Áreas do portal",
  portalTabs: ["Histórico", "Documentos", "Dependentes"],
  statusDone: "Realizada",
  statusScheduled: "Agendada",
  documents: ["Receita digital", "Atestado", "Pedido de exame"],
  securityChips: ["Criptografia", "Infraestrutura no Brasil", "LGPD"],
} as const;

export const plansSection = {
  eyebrow: "Planos",
  title: "Um plano para você ou para toda a família.",
  lead: "Assinatura mensal, sem taxa de adesão. Escolha quantas pessoas vão usar e veja o valor por pessoa.",
  peopleQuestion: "Para quantas pessoas?",
  perPersonLabel: "equivale a {price} por pessoa",
  // Chip flutuante sobre a foto da familia. {price} recebe o valor por pessoa do Familiar.
  photoChip: "{price} por pessoa no Familiar",
  coversOne: "Cobre 1 pessoa.",
  singleHint: "Faz mais sentido a partir de 2 pessoas.",
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
    "Pronto-socorro e emergências",
    "Cobertura de plano de saúde (ANS)",
    "Custo de exames e medicamentos, que têm desconto na rede e são pagos pelo assinante",
  ],
  emergency: "Em emergências, ligue 192 (SAMU). A telemedicina não substitui o pronto-socorro.",
} as const;

export const differentiatorsSection = {
  eyebrow: "Diferenciais",
  title: "Por que a Moorah.",
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
    title: "Quero saber mais",
    subtitle: "Deixe seu contato e retornamos por e-mail.",
    name: "Nome",
    email: "E-mail",
    whatsapp: "WhatsApp (opcional)",
    whatsappPlaceholder: "(11) 99999-1234",
    plan: "Plano de interesse",
    consent: "Li e aceito a Política de privacidade e autorizo o contato da Moorah.",
    submit: "Quero assinar",
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
  eyebrow: "Dúvidas frequentes",
  title: "Perguntas que recebemos com frequência.",
  contactTitle: "Ainda com dúvida?",
  contactText: "Escreva para a gente e respondemos pelo e-mail.",
  emergencyTitle: "Emergência",
  emergencyLabel: "SAMU",
  emergencyText: "A telemedicina não substitui o pronto-socorro.",
} as const;

export const finalCta = {
  eyebrow: "Comece hoje",
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

function pexels(id: string, width: number, height: number, alt: string): Photo {
  return {
    id,
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
    width,
    height,
    alt,
    credit: "Pexels",
    creditUrl: `https://www.pexels.com/photo/${id}/`,
  };
}

export type PhotoKey =
  | "heroPaciente"
  | "medicaSorrindo"
  | "medicoVideo"
  | "medicaHeadset"
  | "idosoTablet"
  | "familiaSofa"
  | "familiaCasa"
  | "exame"
  | "pacienteCama";

export const photos: Record<PhotoKey, Photo> = {
  heroPaciente: pexels(
    "7195087",
    1600,
    1067,
    "Mulher sentada no sofá de casa, com fones, em consulta por vídeo com uma médica pelo notebook.",
  ),
  medicaSorrindo: pexels(
    "19957213",
    1200,
    1800,
    "Médica sorridente, de jaleco e estetoscópio, anotando durante uma consulta por vídeo gravada pelo celular.",
  ),
  medicoVideo: pexels(
    "39192424",
    1600,
    900,
    "Médico de jaleco em seu consultório, atendendo um paciente por videochamada no notebook.",
  ),
  medicaHeadset: pexels(
    "7195090",
    1600,
    1067,
    "Médica de uniforme verde e headset acenando para a paciente durante uma consulta online.",
  ),
  idosoTablet: pexels(
    "8376171",
    1600,
    1067,
    "Senhor em casa conversando com a médica pelo tablet, com os medicamentos organizados na mesa.",
  ),
  familiaSofa: pexels(
    "39191102",
    1600,
    900,
    "Pai, mãe e filho abraçados e sorrindo no sofá da sala.",
  ),
  familiaCasa: pexels(
    "7114188",
    1600,
    1067,
    "Família com três crianças de mãos dadas em uma sala clara e ampla.",
  ),
  exame: pexels(
    "8460346",
    1200,
    1800,
    "Profissional de laboratório com luvas segurando um tubo de amostra de sangue.",
  ),
  pacienteCama: pexels(
    "8376211",
    1200,
    1800,
    "Tablet apoiado na cama mostrando um médico em consulta por vídeo, ao lado de uma caixa de remédios.",
  ),
};

/*
  Dinamica do hero (v2): frase que alterna na segunda linha do titulo e eventos do produto que
  circulam nos cards flutuantes. Ver docs/design-brief-v2.md.
*/
export const heroDynamic = {
  titleStatic: "Consultas médicas ilimitadas,",
  rotating: ["sem fila.", "para toda a família.", "em qualquer especialidade.", "no seu celular."],
  rotateEveryMs: 2800,
  eventEveryMs: 4200,
  events: [
    {
      icon: "calendar-check",
      label: "Consulta confirmada",
      text: "Cardiologia por vídeo",
      tone: "leaf",
      node: 2,
    },
    {
      icon: "bell-ring",
      label: "Lembrete enviado",
      text: "Sua consulta começa em 30 minutos",
      tone: "berry",
      node: null,
    },
    {
      icon: "file-check",
      label: "Receita digital emitida",
      text: "Válida em todo o Brasil",
      tone: "leaf",
      node: 0,
    },
    {
      icon: "pill",
      label: "Cartão reconhecido",
      text: "Desconto aplicado na farmácia",
      tone: "leaf",
      node: null,
    },
    {
      icon: "baby",
      label: "Consulta confirmada",
      text: "Pediatria por vídeo",
      tone: "leaf",
      node: 1,
    },
    {
      icon: "flask",
      label: "Exame com desconto",
      text: "Laboratório da rede parceira",
      tone: "leaf",
      node: null,
    },
  ],
  stripLabel: "Especialidades disponíveis",
} as const;

export type HeroEvent = (typeof heroDynamic.events)[number];
