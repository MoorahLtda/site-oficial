/*
  Politica de privacidade do site e da plataforma Moorah.
  Minuta para revisao juridica. Nada aqui pode conter travessao (U+2014); use hifen.
  Nomes, e-mails e CNPJ vem de src/content/site.ts; nunca escreva esses dados aqui.
*/

import { site } from "@/content/site";
import type { LegalDocument } from "./types";

const cnpjLine = site.contact.cnpj ? `, inscrita no CNPJ ${site.contact.cnpj}` : "";

/*
  O rodape do site nao exibe endereco e o CNPJ so aparece quando NEXT_PUBLIC_CNPJ estiver
  preenchida. Sem registro, o texto diz isso em vez de remeter a um endereco que nao existe.
*/
const registroLine = site.contact.cnpj
  ? "Os demais dados de registro constam dos Termos de uso."
  : "A empresa está em constituição: o CNPJ e o endereço da sede serão informados no site e nos Termos de uso assim que o registro for concluído.";

export const privacidade: LegalDocument = {
  slug: "privacidade",
  title: "Política de privacidade",
  description:
    "Como a Moorah coleta, usa, compartilha e protege dados pessoais e de saúde no site e na plataforma de telemedicina, conforme a LGPD.",
  updatedAt: "2026-09-02",
  version: "0.1",
  draftNotice:
    "Minuta para revisão jurídica. Este documento ainda não foi validado por advogado e pode mudar antes do lançamento comercial.",
  intro: [
    `Esta Política de privacidade explica como a ${site.legalName}${cnpjLine} ("Moorah", "nós") trata os dados pessoais de quem visita o site ${site.url}, preenche o formulário de contato, assina um plano ou usa a plataforma ${site.product}, incluindo o portal do paciente e o Cartão Moorah.`,
    "Cuidar da saúde envolve informações íntimas. Por isso escrevemos este texto de forma direta, para que você saiba exatamente o que coletamos, por que coletamos, com quem compartilhamos e quais são os seus direitos.",
    "Esta Política segue a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, LGPD), o Marco Civil da Internet (Lei nº 12.965/2014), o Código de Defesa do Consumidor (Lei nº 8.078/1990) e a Resolução CFM nº 2.314/2022, que regulamenta a telemedicina no Brasil. Ela complementa os Termos de uso, disponíveis em /termos, e a página sobre LGPD, em /lgpd.",
  ],
  sections: [
    {
      id: "quem-somos",
      title: "Quem somos e a quem esta Política se aplica",
      blocks: [
        {
          type: "p",
          text: `A Moorah oferece uma assinatura mensal de telemedicina: consultas médicas por vídeo em diversas especialidades, emissão de receitas, atestados e pedidos de exame com assinatura digital, portal do paciente e o Cartão Moorah, que dá acesso a descontos em farmácias, laboratórios e lojas parceiras. A Moorah não é plano de saúde nem operadora regulada pela ANS.`,
        },
        {
          type: "p",
          text: "Para os fins da LGPD, a Moorah atua como controladora dos dados pessoais tratados no site, no cadastro, na cobrança e na operação da plataforma. Nos dados de saúde registrados durante a consulta, o médico que atende é o profissional responsável pelo ato médico e pelo conteúdo do registro clínico, conforme as normas do Conselho Federal de Medicina. A Moorah mantém a infraestrutura que guarda e protege esses registros.",
        },
        { type: "h3", text: "Esta Política se aplica a" },
        {
          type: "ul",
          items: [
            "Visitantes do site, incluindo quem apenas navega ou preenche o formulário de contato.",
            "Titulares de assinatura, nos planos Individual e Familiar.",
            "Dependentes incluídos no plano Familiar, cujos dados são informados pelo titular.",
            "Pessoas que usam o Cartão Moorah na rede parceira.",
          ],
        },
        {
          type: "p",
          text: "Ela não se aplica a sites, aplicativos ou estabelecimentos de terceiros, como farmácias e laboratórios parceiros, que possuem políticas próprias. Ao usar o Cartão Moorah em um parceiro, recomendamos ler a política de privacidade daquele estabelecimento.",
        },
      ],
    },
    {
      id: "dados-coletados",
      title: "Quais dados coletamos",
      blocks: [
        {
          type: "p",
          text: "Coletamos apenas o necessário para prestar o serviço, cumprir obrigações legais e manter a plataforma segura. Os dados variam conforme a forma como você se relaciona com a Moorah.",
        },
        { type: "h3", text: "Formulário de contato do site" },
        {
          type: "ul",
          items: [
            "Nome e e-mail, informados por você.",
            "Número de WhatsApp, apenas se você optar por informá-lo.",
            "Plano de interesse (Individual ou Familiar).",
            "Registro do consentimento para contato comercial, com data e hora.",
          ],
        },
        { type: "h3", text: "Cadastro e assinatura" },
        {
          type: "ul",
          items: [
            "Dados de identificação do titular: nome completo, data de nascimento, e-mail, telefone e CPF. O CPF é necessário para identificar o paciente de forma inequívoca e para a emissão de receitas, atestados e demais documentos médicos com assinatura digital, além de obrigações fiscais.",
            "Dados dos dependentes do plano Familiar: nome completo, data de nascimento e CPF, quando necessário para a emissão de documentos médicos em nome do dependente, e a relação com o titular, conforme as regras de elegibilidade vigentes no momento da contratação.",
            "Dados de pagamento: os dados completos do meio de pagamento são tratados pelo processador de pagamentos contratado. A Moorah recebe apenas o necessário para confirmar a cobrança e administrar a assinatura, como situação do pagamento, últimos dígitos do cartão e identificador da transação.",
            "Número do Cartão Moorah de cada pessoa, gerado pela própria plataforma.",
            "Credenciais de acesso ao portal do paciente, armazenadas de forma protegida.",
          ],
        },
        { type: "h3", text: "Dados de saúde tratados na consulta" },
        {
          type: "p",
          text: "Durante o agendamento e a consulta são tratados dados pessoais sensíveis, nos termos do art. 5º, inciso II, da LGPD: motivo da consulta, sintomas e queixas relatadas, histórico clínico, alergias, medicamentos em uso, diagnósticos, orientações e prescrições. Também ficam registrados os documentos emitidos pelo médico (receitas, atestados, pedidos de exame e relatórios) e as informações de contexto da consulta, como especialidade, médico, data, horário e duração.",
        },
        {
          type: "p",
          text: "Esses dados compõem o registro clínico do paciente e só são acessíveis ao próprio paciente (ou ao titular responsável, no caso de dependentes), ao médico que realiza o atendimento e, quando indispensável, à equipe técnica da Moorah para suporte e segurança, sempre com registro de acesso.",
        },
        {
          type: "p",
          text: "A consulta acontece por vídeo, pelo link seguro da plataforma. O conteúdo audiovisual não é gravado pela Moorah. Se a plataforma vier a oferecer gravação, isso dependerá de aviso prévio claro, de base legal própria e de atualização desta Política.",
        },
        { type: "h3", text: "Dados de navegação e uso da plataforma" },
        {
          type: "ul",
          items: [
            "Endereço IP, data e hora de acesso, tipo de navegador, sistema operacional e páginas visitadas, coletados de forma automática nos registros do servidor.",
            "Registros de acesso ao portal do paciente e de ações relevantes, como login, agendamento, emissão e download de documentos, mantidos para segurança e auditoria.",
            "Cookies e armazenamento local estritamente necessários, descritos na seção Cookies.",
          ],
        },
        {
          type: "note",
          text: "O site da Moorah não usa cookies de publicidade, pixels de redes sociais nem rastreadores de terceiros. Não fazemos perfilamento comportamental para fins de marketing.",
        },
      ],
    },
    {
      id: "finalidades-bases-legais",
      title: "Para que usamos os dados e com base em quê",
      blocks: [
        {
          type: "p",
          text: "A LGPD exige que todo tratamento de dados tenha uma finalidade específica e uma base legal. Abaixo indicamos, para cada finalidade, a base legal que a sustenta. Para dados comuns, as bases estão no art. 7º; para dados de saúde, no art. 11.",
        },
        { type: "h3", text: "Prestar o serviço contratado" },
        {
          type: "p",
          text: "Criar e administrar a conta, gerir titular e dependentes, emitir o Cartão Moorah, agendar consultas, enviar lembretes por e-mail, mensagem ou notificação, disponibilizar o portal do paciente e os documentos emitidos, processar a cobrança da assinatura e prestar suporte. Base legal: execução de contrato ou de procedimentos preliminares a pedido do titular (art. 7º, inciso V).",
        },
        { type: "h3", text: "Realizar a consulta e o cuidado em saúde" },
        {
          type: "p",
          text: "Registrar a anamnese, o exame clínico por vídeo, o diagnóstico, as orientações e as prescrições, emitir receitas, atestados e pedidos de exame e manter o histórico do paciente para continuidade do cuidado. Base legal para os dados sensíveis: tutela da saúde, exclusivamente em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária (art. 11, inciso II, alínea f). O tratamento observa a Resolução CFM nº 2.314/2022 e o Código de Ética Médica.",
        },
        { type: "h3", text: "Cumprir obrigações legais e regulatórias" },
        {
          type: "p",
          text: "Guardar registros de acesso exigidos pelo Marco Civil da Internet, emitir documentos fiscais, manter os registros clínicos pelos prazos previstos nas normas do CFM e na legislação, atender ordens de autoridades competentes e responder a fiscalizações. Base legal: cumprimento de obrigação legal ou regulatória (art. 7º, inciso II, e art. 11, inciso II, alínea a).",
        },
        { type: "h3", text: "Entrar em contato comercial" },
        {
          type: "p",
          text: "Responder ao formulário de contato, apresentar os planos e enviar comunicações sobre a Moorah para quem ainda não é assinante. Base legal: consentimento (art. 7º, inciso I), registrado no envio do formulário. Você pode revogar o consentimento a qualquer momento, pelo link nas mensagens ou pelo canal do encarregado, sem prejuízo do tratamento realizado antes da revogação.",
        },
        { type: "h3", text: "Proteger a plataforma e prevenir fraudes" },
        {
          type: "p",
          text: "Monitorar acessos, limitar tentativas de login e de envio de formulários, investigar uso indevido do Cartão Moorah, detectar incidentes de segurança e manter registros de auditoria. Base legal: legítimo interesse da Moorah e dos assinantes em um serviço seguro (art. 7º, inciso IX), com avaliação de impacto sobre os direitos dos titulares e uso apenas dos dados estritamente necessários. Nos processos de identificação e autenticação de cadastro, quando envolverem dados sensíveis, aplica-se a garantia da prevenção à fraude e à segurança do titular (art. 11, inciso II, alínea g).",
        },
        { type: "h3", text: "Exercer direitos em processos" },
        {
          type: "p",
          text: "Defender a Moorah, os médicos e os assinantes em processos judiciais, administrativos ou arbitrais. Base legal: exercício regular de direitos (art. 7º, inciso VI, e art. 11, inciso II, alínea d).",
        },
        {
          type: "note",
          text: "A Moorah não usa dados de saúde para fins comerciais, publicitários ou de seleção de risco. Dados de saúde nunca são usados para decidir preço, aceitação ou exclusão de assinantes. A LGPD também veda a comunicação ou o uso compartilhado de dados de saúde entre controladores com o objetivo de obter vantagem econômica, fora das hipóteses ligadas à própria prestação do serviço de saúde (art. 11, § 4º).",
        },
      ],
    },
    {
      id: "compartilhamento",
      title: "Com quem compartilhamos dados",
      blocks: [
        {
          type: "p",
          text: "A Moorah não vende dados pessoais, em nenhuma hipótese. Compartilhamos dados apenas quando necessário para prestar o serviço, cumprir a lei ou proteger direitos, e sempre limitados ao mínimo que a finalidade exige.",
        },
        {
          type: "ul",
          items: [
            "Médicos e profissionais de saúde que realizam o atendimento: acessam a identificação do paciente e o registro clínico necessário à consulta e à continuidade do cuidado, com dever de sigilo profissional.",
            "Processadores de pagamento: recebem os dados necessários para cobrar a assinatura e prevenir fraudes financeiras. Os dados completos do cartão são tratados diretamente por eles, sob suas próprias políticas e certificações.",
            "Provedores de infraestrutura em nuvem, com servidores localizados no Brasil: hospedam a plataforma e os bancos de dados, sob contrato que exige confidencialidade, segurança e uso dos dados apenas conforme nossas instruções.",
            "Provedores de envio de e-mail, mensagens e notificações: recebem o contato do destinatário e o conteúdo do lembrete ou aviso, sem acesso ao registro clínico.",
            "Certificadoras e serviços de assinatura digital: tratam os dados necessários para assinar e validar receitas, atestados e pedidos de exame, conforme a legislação sobre assinatura eletrônica.",
            "Parceiros da rede (farmácias, laboratórios, clínicas e lojas): recebem apenas o número do Cartão Moorah apresentado pela pessoa e a confirmação de que a assinatura está ativa, o suficiente para aplicar o desconto. Não recebem dados de saúde nem o histórico de consultas.",
            "Ferramentas de atendimento e gestão de contatos: recebem os dados do formulário de contato para que possamos responder a você.",
            "Autoridades públicas, órgãos reguladores, conselhos profissionais e Poder Judiciário: quando houver obrigação legal, ordem judicial ou requisição válida de autoridade competente.",
          ],
        },
        {
          type: "p",
          text: "Todos os fornecedores que tratam dados em nome da Moorah atuam como operadores, sob contrato escrito com obrigações de segurança, confidencialidade, limitação de finalidade e cooperação no atendimento aos direitos dos titulares. Avaliamos esses fornecedores antes da contratação e periodicamente.",
        },
        {
          type: "p",
          text: "Em caso de reorganização societária, fusão, aquisição ou venda de ativos, os dados poderão ser transferidos ao sucessor, que ficará obrigado a respeitar esta Política. Você será informado antes que os dados passem a ser tratados sob política diferente.",
        },
      ],
    },
    {
      id: "transferencia-internacional",
      title: "Transferência internacional de dados",
      blocks: [
        {
          type: "p",
          text: "Hoje a Moorah armazena e trata os dados pessoais em infraestrutura de nuvem localizada no Brasil e não realiza transferência internacional de dados pessoais.",
        },
        {
          type: "p",
          text: "Se, no futuro, algum fornecedor precisar tratar dados fora do país, a transferência só ocorrerá nas hipóteses do art. 33 da LGPD e conforme a regulamentação da Autoridade Nacional de Proteção de Dados (ANPD): para países com nível adequado de proteção, mediante cláusulas contratuais específicas ou cláusulas-padrão aprovadas pela ANPD, ou com o seu consentimento específico e em destaque, entre outras hipóteses legais. Nesse caso, esta Política será atualizada para indicar os países envolvidos e o mecanismo adotado.",
        },
      ],
    },
    {
      id: "retencao-descarte",
      title: "Por quanto tempo guardamos os dados",
      blocks: [
        {
          type: "p",
          text: "Mantemos os dados apenas pelo tempo necessário para cumprir a finalidade que justificou a coleta, as obrigações legais e regulatórias e o exercício regular de direitos. Ao fim desses prazos, os dados são eliminados ou anonimizados de forma segura.",
        },
        {
          type: "ul",
          items: [
            "Dados do formulário de contato: até que você revogue o consentimento ou peça a exclusão, ou até que o contato deixe de ter propósito, quando são eliminados.",
            "Dados de cadastro e assinatura: durante a vigência do contrato e, após o encerramento, pelos prazos de prescrição previstos no Código Civil e no Código de Defesa do Consumidor, para fins de defesa em eventuais disputas, além dos prazos exigidos pela legislação fiscal.",
            "Registros clínicos e documentos médicos (receitas, atestados, pedidos de exame, anotações do médico): pelo prazo de guarda exigido para prontuários e documentos médicos, conforme a legislação e as normas do CFM aplicáveis. Esses registros não são eliminados a pedido enquanto durar a obrigação de guarda, pois protegem o próprio paciente e o médico.",
            "Registros de acesso à plataforma (data, hora e IP): pelo prazo mínimo de 6 meses, conforme o art. 15 do Marco Civil da Internet, podendo ser estendido por determinação de autoridade competente.",
            "Registros de auditoria e segurança: pelo tempo necessário para investigar incidentes e cumprir obrigações legais.",
            "Registro de consentimentos e de solicitações de titulares: enquanto for necessário para comprovar o cumprimento da LGPD.",
          ],
        },
        {
          type: "p",
          text: "Quando o titular cancela a assinatura ou pede a exclusão da conta, encerramos o tratamento ativo, bloqueamos o acesso e mantemos apenas o que a lei exige, com acesso restrito. Os documentos médicos continuam disponíveis para o paciente pelos canais indicados na seção de direitos, durante o período de guarda.",
        },
      ],
    },
    {
      id: "seguranca",
      title: "Como protegemos os dados",
      blocks: [
        {
          type: "p",
          text: "Adotamos medidas técnicas e administrativas para proteger os dados pessoais contra acesso não autorizado, perda, alteração, destruição ou qualquer tratamento inadequado, conforme os arts. 46 a 49 da LGPD. Damos atenção especial aos dados de saúde.",
        },
        {
          type: "ul",
          items: [
            "Criptografia dos dados em trânsito (HTTPS/TLS) e em repouso, nos bancos de dados e nos arquivos armazenados.",
            "Controle de acesso por perfil: cada pessoa da equipe e cada médico acessa apenas o necessário para a sua função, com autenticação individual.",
            "Registros de auditoria dos acessos a dados de saúde e das ações relevantes na plataforma.",
            "Infraestrutura em nuvem no Brasil, com segregação de ambientes, cópias de segurança e planos de recuperação.",
            "Proteção contra abuso, como limite de tentativas de login e de envio de formulários.",
            "Contratos de confidencialidade com colaboradores, médicos e fornecedores, e treinamento sobre proteção de dados.",
            "Revisões periódicas de segurança e correção de vulnerabilidades nas dependências da plataforma.",
          ],
        },
        { type: "h3", text: "Incidentes de segurança" },
        {
          type: "p",
          text: "Se ocorrer um incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a Moorah comunicará a ANPD e as pessoas afetadas, nos termos do art. 48 da LGPD e nos prazos definidos pela regulamentação da ANPD. A comunicação descreverá a natureza dos dados afetados, os titulares envolvidos, as medidas adotadas e as recomendações para reduzir os efeitos do incidente.",
        },
        {
          type: "p",
          text: "Você também contribui para a segurança: use uma senha forte e exclusiva no portal, não compartilhe suas credenciais nem o número do seu Cartão Moorah com terceiros e avise a Moorah imediatamente em caso de suspeita de acesso indevido.",
        },
      ],
    },
    {
      id: "direitos-titular",
      title: "Seus direitos e como exercê-los",
      blocks: [
        {
          type: "p",
          text: "O art. 18 da LGPD garante a você, a qualquer momento e mediante requisição, os seguintes direitos em relação aos seus dados pessoais:",
        },
        {
          type: "ul",
          items: [
            "Confirmar se tratamos dados seus e acessar esses dados.",
            "Corrigir dados incompletos, inexatos ou desatualizados.",
            "Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.",
            "Pedir a portabilidade dos seus dados a outro fornecedor de serviço, conforme a regulamentação da ANPD.",
            "Pedir a eliminação dos dados tratados com base no seu consentimento, ressalvadas as hipóteses de guarda obrigatória.",
            "Saber com quais entidades públicas e privadas compartilhamos seus dados.",
            "Ser informado sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.",
            "Revogar o consentimento, a qualquer momento, de forma gratuita e facilitada.",
            "Opor-se a tratamento realizado com base em outra hipótese legal, se entender que há descumprimento da LGPD.",
            "Pedir revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses (art. 20).",
          ],
        },
        { type: "h3", text: "Como fazer o pedido" },
        {
          type: "p",
          text: `Envie sua solicitação ao encarregado de proteção de dados pelo e-mail ${site.contact.dpoEmail}. Para proteger você, poderemos pedir informações que confirmem a sua identidade antes de atender ao pedido, especialmente quando envolver dados de saúde. Pedidos relativos a dependentes devem ser feitos pelo titular responsável ou pelo próprio dependente, quando tiver capacidade legal para tanto.`,
        },
        {
          type: "p",
          text: "Para a confirmação de tratamento e o acesso aos dados, respondemos em formato simplificado de imediato ou, quando for necessária declaração clara e completa, em até 15 dias contados do pedido, como determina o art. 19 da LGPD. Para os demais direitos, cujo prazo a lei remete à regulamentação da ANPD, adotamos os mesmos 15 dias como referência e avisamos por escrito se precisarmos de mais tempo. Se não for possível atender ao pedido, indicamos por escrito as razões de fato ou de direito que impedem o atendimento (art. 18, § 4º), como nos casos em que a lei exige a guarda do dado. Você também pode peticionar à ANPD (art. 18, § 1º) ou aos órgãos de defesa do consumidor (art. 18, § 8º).",
        },
        {
          type: "note",
          text: "Os documentos médicos e o registro clínico pertencem ao paciente quanto ao acesso, e o paciente pode obter cópia a qualquer tempo. A eliminação, porém, fica limitada pelos prazos de guarda exigidos das plataformas e dos médicos pela legislação e pelas normas do CFM.",
        },
      ],
    },
    {
      id: "criancas-adolescentes",
      title: "Crianças e adolescentes",
      blocks: [
        {
          type: "p",
          text: "O plano Familiar permite incluir dependentes menores de idade, conforme as regras de elegibilidade vigentes no momento da contratação. O tratamento dos dados de crianças e adolescentes segue o art. 14 da LGPD e é sempre realizado no melhor interesse do menor.",
        },
        {
          type: "ul",
          items: [
            "Os dados de crianças (até 12 anos incompletos) são informados pelo titular, que declara ser pai, mãe ou responsável legal, ou ter autorização de quem seja. Quando o tratamento se basear no consentimento, ele será específico e em destaque, dado por pelo menos um dos pais ou pelo responsável legal.",
            "Coletamos apenas os dados necessários para a prestação do serviço de saúde e para a emissão de documentos médicos, sem condicionar o atendimento ao fornecimento de dados além do indispensável.",
            "As consultas de dependentes menores são acompanhadas pelo responsável, conforme orientação do médico e as regras da Resolução CFM nº 2.314/2022.",
            "Não direcionamos comunicação comercial a crianças e adolescentes, e o site não coleta dados de menores de forma autônoma.",
            "O titular responsável pode acessar, corrigir e solicitar a exclusão dos dados dos dependentes menores pelo portal ou pelo canal do encarregado, observados os prazos legais de guarda dos registros médicos.",
          ],
        },
        {
          type: "p",
          text: "Se identificarmos que dados de um menor foram coletados sem a autorização devida, tomaremos as medidas para eliminá-los ou regularizar o tratamento.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies e tecnologias semelhantes",
      blocks: [
        {
          type: "p",
          text: "Cookies são pequenos arquivos gravados no seu navegador. O site e a plataforma da Moorah usam apenas cookies e armazenamento local estritamente necessários, que não exigem consentimento porque sem eles o serviço não funciona.",
        },
        {
          type: "ul",
          items: [
            "Sessão e autenticação: mantêm você conectado ao portal do paciente de forma segura, em cookies protegidos que não podem ser lidos por scripts de terceiros.",
            "Segurança: ajudam a limitar tentativas abusivas de login e de envio do formulário de contato.",
            "Preferências de exibição: guardam escolhas como redução de animações ou tema, quando disponíveis.",
          ],
        },
        {
          type: "p",
          text: "Não usamos cookies de publicidade, de redes sociais ou de rastreamento entre sites, nem ferramentas de análise de audiência de terceiros. Se a Moorah decidir adotar alguma ferramenta de medição de audiência, esta Política e o site serão atualizados antes, com a opção de recusa quando a lei exigir.",
        },
        {
          type: "p",
          text: "Você pode apagar ou bloquear cookies nas configurações do seu navegador. Bloquear os cookies estritamente necessários pode impedir o login no portal e o uso de algumas funções.",
        },
      ],
    },
    {
      id: "alteracoes",
      title: "Alterações nesta Política",
      blocks: [
        {
          type: "p",
          text: "Podemos atualizar esta Política para refletir mudanças na plataforma, na legislação ou nas orientações da ANPD. A versão vigente estará sempre disponível em /privacidade, com a data da última atualização e o número da versão no topo.",
        },
        {
          type: "p",
          text: "Quando a mudança for relevante, como novas finalidades, novos compartilhamentos ou transferência internacional, avisaremos os assinantes por e-mail ou pelo portal com antecedência razoável. Se a alteração exigir novo consentimento, ele será solicitado de forma específica antes de o tratamento começar.",
        },
      ],
    },
    {
      id: "contato-encarregado",
      title: "Encarregado de proteção de dados e contato",
      blocks: [
        {
          type: "p",
          text: `A Moorah indica um encarregado pelo tratamento de dados pessoais (DPO), conforme o art. 41 da LGPD, responsável por receber comunicações dos titulares e da ANPD, prestar esclarecimentos e orientar a equipe sobre boas práticas. O canal do encarregado é o e-mail ${site.contact.dpoEmail}. O nome do encarregado será divulgado nesta Política e na página /lgpd antes do lançamento comercial, como exige o art. 41, § 1º.`,
        },
        {
          type: "p",
          text: `Para assuntos comerciais ou de suporte, use ${site.contact.email}. Dúvidas sobre esta Política, pedidos relativos aos seus dados e comunicações de possíveis incidentes devem ser dirigidos ao encarregado.`,
        },
        {
          type: "p",
          text: `Controladora: ${site.legalName}${cnpjLine}. ${registroLine}`,
        },
      ],
    },
  ],
};
