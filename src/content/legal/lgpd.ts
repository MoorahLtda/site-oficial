/*
  LGPD e seus direitos: pagina explicativa, complementar a Politica de privacidade.
  Minuta para revisao juridica. Nada aqui pode conter travessao (U+2014); use hifen.
  Referencias a outros documentos usam os caminhos /termos, /privacidade e /lgpd.
*/

import { site } from "@/content/site";
import type { LegalDocument } from "./types";

const dpo = site.contact.dpoEmail;
const contato = site.contact.email;

export const lgpd: LegalDocument = {
  slug: "lgpd",
  title: "LGPD e seus direitos",
  description:
    "Como a Lei Geral de Proteção de Dados protege seus dados de saúde na Moorah e como exercer seus direitos de titular, em linguagem simples.",
  updatedAt: "2026-09-02",
  version: "0.1",
  draftNotice:
    "Minuta para revisão jurídica. Este documento ainda não foi validado por advogado e pode mudar antes do lançamento comercial.",
  intro: [
    `Esta página explica, em linguagem simples, como a Lei Geral de Proteção de Dados Pessoais (LGPD) protege as informações que você confia ao ${site.product} e quais direitos você tem sobre elas.`,
    `Ela complementa a Política de privacidade, que detalha quais dados coletamos, por quê, por quanto tempo e com quem compartilhamos, e os Termos de uso, que regulam a assinatura. Se preferir ir direto ao ponto: seus direitos estão na seção "Seus direitos" e o canal para exercê-los é o e-mail ${dpo}.`,
  ],
  sections: [
    {
      id: "o-que-e-a-lgpd",
      title: "O que é a LGPD e por que ela importa na saúde",
      blocks: [
        {
          type: "p",
          text: `A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, LGPD) é a lei brasileira que define como empresas e órgãos públicos podem coletar, guardar, usar e compartilhar dados de pessoas. Ela vale para qualquer atividade que envolva dados pessoais no Brasil, inclusive serviços digitais de saúde como o ${site.product}.`,
        },
        {
          type: "p",
          text: "Na saúde, a LGPD tem peso especial. Uma consulta por vídeo gera informações íntimas: sintomas, diagnósticos, medicamentos em uso, exames, histórico familiar. Esse conteúdo, se exposto ou usado fora de contexto, pode causar constrangimento, discriminação no trabalho ou em seguros e até risco à segurança da pessoa. Por isso a lei trata dado de saúde como categoria protegida, e por isso esta página existe.",
        },
        {
          type: "p",
          text: "Esta página é uma explicação, não substitui os documentos contratuais. Em caso de diferença de redação, prevalecem a Política de privacidade e os Termos de uso.",
        },
        {
          type: "note",
          text: "A LGPD não é a única norma que se aplica à Moorah. Também seguimos o Marco Civil da Internet (Lei nº 12.965/2014), o Código de Defesa do Consumidor (Lei nº 8.078/1990), a Resolução CFM nº 2.314/2022, que regulamenta a telemedicina, e as demais normas do Conselho Federal de Medicina sobre sigilo e prontuário.",
        },
      ],
    },
    {
      id: "dados-sensiveis",
      title: "Dados de saúde são dados sensíveis",
      blocks: [
        {
          type: "p",
          text: "A LGPD separa os dados pessoais em duas categorias. Dado pessoal é qualquer informação que identifique ou possa identificar você: nome, e-mail, número do Cartão Moorah, endereço IP. Dado pessoal sensível é uma lista fechada de informações com potencial maior de dano, prevista no art. 5º, inciso II: origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, dado referente à saúde ou à vida sexual, dado genético ou biométrico.",
        },
        {
          type: "p",
          text: "Quase tudo que a Moorah trata na prestação do serviço médico é dado sensível de saúde: motivo da consulta, anotações do médico, diagnósticos, receitas, atestados, pedidos e resultados de exames, histórico clínico. Para esses dados, o art. 11 da LGPD impõe regras mais rígidas:",
        },
        {
          type: "ul",
          items: [
            "Só podem ser tratados com o seu consentimento específico e destacado, ou em hipóteses expressamente listadas na lei. A que mais se aplica à Moorah é a tutela da saúde, em procedimento realizado por profissionais de saúde ou serviços de saúde (art. 11, inciso II, alínea f).",
            "É proibido comunicar ou compartilhar dados de saúde entre controladores com o objetivo de obter vantagem econômica (art. 11, § 4º). Na prática: a Moorah não vende, aluga nem cede seu prontuário a farmácias, laboratórios, seguradoras, planos de saúde ou anunciantes.",
            "Exigem medidas de segurança proporcionais ao risco, como criptografia, controle de acesso por perfil e registro de quem acessou cada informação.",
            "Em caso de incidente, a comunicação à ANPD e a você é obrigatória quando houver risco ou dano relevante (art. 48).",
          ],
        },
        {
          type: "p",
          text: "O que isso muda para você: dado de saúde nunca é usado para fins comerciais, publicidade ou formação de perfil de consumo. Ele existe para o seu atendimento, para a continuidade do seu cuidado e para cumprir as obrigações legais e regulatórias do serviço médico.",
        },
      ],
    },
    {
      id: "principios",
      title: "Como a Moorah aplica os princípios da LGPD",
      blocks: [
        {
          type: "p",
          text: "O art. 6º da LGPD lista os princípios que orientam qualquer tratamento de dados. Veja como cada um se traduz no dia a dia da Moorah.",
        },
        {
          type: "ul",
          items: [
            "Finalidade: cada dado é coletado para um propósito informado a você. O motivo da consulta serve ao atendimento médico; o e-mail serve ao acesso ao portal, aos lembretes e às comunicações sobre a assinatura. Não usamos dado de saúde para outro fim sem nova base legal e sem avisar você.",
            "Adequação e necessidade: pedimos só o que a finalidade exige. O cadastro pede o mínimo para identificar você, cobrar a assinatura e viabilizar a consulta. Dados clínicos são registrados pelo médico, na medida do que o atendimento pede.",
            "Livre acesso e transparência: você consulta seus dados e documentos no portal do paciente a qualquer momento. Esta página, a Política de privacidade e o canal do encarregado explicam como o tratamento acontece.",
            "Qualidade dos dados: você pode corrigir dados cadastrais desatualizados. Dados clínicos seguem regra própria: o prontuário não é apagado nem reescrito, mas o médico pode registrar uma retificação ou um complemento a seu pedido.",
            "Segurança e prevenção: dados de saúde criptografados, infraestrutura de nuvem localizada no Brasil, acesso por perfil, autenticação dos usuários e registro de acessos. Avaliamos riscos antes de lançar funcionalidades novas que envolvam dados sensíveis.",
            "Não discriminação: dado de saúde nunca é usado para negar assinatura, definir preço diferente, restringir especialidades ou excluir dependentes. O valor da assinatura depende apenas do plano escolhido, conforme as condições vigentes no momento da contratação.",
            "Responsabilização e prestação de contas: mantemos registro das operações de tratamento, políticas internas, contratos com fornecedores que exigem o mesmo nível de proteção e um encarregado nomeado para responder por tudo isso.",
          ],
        },
        {
          type: "p",
          text: "Sobre transferência internacional: a infraestrutura da Moorah fica no Brasil. Se algum fornecedor precisar tratar dados fora do país, isso só ocorre nas hipóteses do art. 33 da LGPD, com salvaguardas contratuais, e a Política de privacidade informa quais fornecedores e países estão envolvidos.",
        },
      ],
    },
    {
      id: "bases-legais",
      title: "Em que a Moorah se apoia para tratar seus dados",
      blocks: [
        {
          type: "p",
          text: "A LGPD exige que todo tratamento tenha uma base legal, uma justificativa prevista nos arts. 7º e 11. As principais que a Moorah utiliza:",
        },
        {
          type: "ul",
          items: [
            "Tutela da saúde (art. 11, II, f): registro e consulta do prontuário, emissão de receitas, atestados e pedidos de exame, continuidade do cuidado entre consultas e especialidades.",
            "Execução de contrato (art. 7º, V): cadastro, cobrança da assinatura, emissão do Cartão Moorah, validação do cartão na rede de parceiros para aplicar o desconto, funcionamento do portal, lembretes de consulta e atendimento ao assinante.",
            "Cumprimento de obrigação legal ou regulatória (art. 7º, II, e art. 11, II, a): guarda de prontuário e documentos médicos pelo prazo exigido pela legislação e pelas normas do CFM aplicáveis, guarda de registros de acesso exigida pelo Marco Civil da Internet, obrigações fiscais e de defesa do consumidor.",
            "Consentimento (art. 7º, I): comunicações comerciais para quem ainda não é assinante e outras situações em que a lei exige sua autorização expressa. Quando o consentimento envolver dado sensível, ele é específico e destacado (art. 11, I). O consentimento pode ser revogado a qualquer momento.",
            "Exercício regular de direitos (art. 7º, VI): defesa da Moorah em processos judiciais, administrativos ou arbitrais, no limite do necessário.",
            "Legítimo interesse (art. 7º, IX): segurança da plataforma, prevenção a fraudes no uso do cartão e melhoria do serviço a partir de dados agregados ou anonimizados. Legítimo interesse nunca é usado para dados de saúde, porque o art. 11 não o admite.",
          ],
        },
        {
          type: "p",
          text: "Ao usar o Cartão Moorah em uma farmácia, laboratório ou loja parceira, a validação usa apenas o número do cartão que você apresenta e a confirmação de que a assinatura está ativa. O parceiro não recebe seu prontuário, seus diagnósticos nem seu histórico de consultas. A receita, quando necessária para a compra, é apresentada por você.",
        },
      ],
    },
    {
      id: "quem-acessa-prontuario",
      title: "Quem acessa o seu prontuário",
      blocks: [
        {
          type: "p",
          text: "Seu prontuário é seu. A regra da Moorah é curta: acessam o seu prontuário você e o médico que atende você. Ninguém mais, sem uma base legal específica.",
        },
        { type: "h3", text: "Você" },
        {
          type: "p",
          text: "Pelo portal do paciente, você vê histórico de consultas, receitas, atestados, pedidos de exame e demais documentos emitidos. No plano Familiar, o titular gerencia os dependentes no portal e, conforme as regras da seção sobre dependentes, pode acessar os documentos deles.",
        },
        { type: "h3", text: "O médico que atende" },
        {
          type: "p",
          text: "O médico vê o prontuário durante o atendimento e para a continuidade do cuidado, com o sigilo exigido pelo Código de Ética Médica e pela Resolução CFM nº 2.314/2022. Cada acesso fica registrado. Um médico que não participa do seu cuidado não tem acesso ao seu prontuário.",
        },
        { type: "h3", text: "Quem não acessa" },
        {
          type: "ul",
          items: [
            "Equipe comercial, financeira e de atendimento ao assinante da Moorah: trabalha com dados cadastrais e de cobrança, não com dados clínicos.",
            "Farmácias, laboratórios e lojas parceiras: recebem apenas o necessário para validar o desconto pelo número do cartão. Não recebem prontuário, diagnóstico ou histórico.",
            "Planos de saúde, seguradoras, empregadores e anunciantes: nenhum acesso.",
          ],
        },
        {
          type: "p",
          text: "Há exceções previstas em lei, sempre limitadas ao estritamente necessário: ordem judicial, requisição de autoridade sanitária ou dos conselhos de medicina, e situações em que o acesso técnico ao sistema é indispensável para manter a plataforma funcionando. Nesses casos, quem acessa está sujeito a sigilo, o acesso é registrado e, quando a lei permitir, você é informado. Fornecedores de infraestrutura tratam dados criptografados sob contrato que exige o mesmo nível de proteção da LGPD.",
        },
        {
          type: "note",
          text: "A Moorah opera a plataforma na qual o médico registra o atendimento. A Moorah e o médico compartilham a responsabilidade pela guarda e pelo sigilo do prontuário, conforme a legislação e as normas do CFM aplicáveis. Os detalhes estão na Política de privacidade.",
        },
      ],
    },
    {
      id: "seus-direitos",
      title: "Seus direitos",
      blocks: [
        {
          type: "p",
          text: "O art. 18 da LGPD garante a você, titular, uma lista de direitos. Eles são gratuitos, podem ser exercidos a qualquer momento e não dependem de justificativa. Em linguagem simples:",
        },
        { type: "h3", text: "Confirmação e acesso (art. 18, I e II)" },
        {
          type: "p",
          text: "Saber se a Moorah trata dados seus e receber uma cópia deles: dados cadastrais, dados da assinatura, registros de uso do cartão e o conteúdo do seu prontuário. Boa parte já está disponível no portal do paciente; o restante você pede pelo canal do encarregado.",
        },
        { type: "h3", text: "Correção (art. 18, III)" },
        {
          type: "p",
          text: "Corrigir dados incompletos, inexatos ou desatualizados. Dados cadastrais podem ser alterados no portal ou pelo canal do encarregado. Dados clínicos não são reescritos, porque o prontuário é um registro histórico protegido pelas normas do CFM, mas você pode pedir que o médico registre uma retificação ou um complemento, que passa a integrar o prontuário.",
        },
        { type: "h3", text: "Anonimização, bloqueio ou eliminação (art. 18, IV e VI)" },
        {
          type: "p",
          text: "Pedir que dados desnecessários, excessivos ou tratados fora da lei sejam anonimizados, bloqueados ou apagados, e pedir a eliminação dos dados tratados com base no seu consentimento. Atenção: dados que a Moorah e o médico são obrigados a guardar por lei ou por norma do CFM, como o prontuário e os documentos médicos assinados, não podem ser apagados antes do prazo legal (art. 16). Eles ficam bloqueados, sem uso ativo, até esse prazo terminar.",
        },
        { type: "h3", text: "Portabilidade (art. 18, V)" },
        {
          type: "p",
          text: "Receber seus dados em formato estruturado e legível para levá-los a outro serviço ou profissional de saúde. Receitas, atestados e pedidos de exame já podem ser baixados no portal. Para o prontuário completo, faça o pedido ao encarregado; a entrega segue a regulamentação da ANPD e as normas do CFM sobre cópia de prontuário.",
        },
        { type: "h3", text: "Informação sobre compartilhamento (art. 18, VII)" },
        {
          type: "p",
          text: "Saber com quais entidades públicas e privadas a Moorah compartilhou seus dados. A Política de privacidade lista as categorias de fornecedores e parceiros; a relação nominal pode ser pedida ao encarregado.",
        },
        { type: "h3", text: "Informação sobre a possibilidade de não consentir (art. 18, VIII)" },
        {
          type: "p",
          text: "Antes de pedir seu consentimento, informamos o que acontece se você recusar. Recusar comunicações de marketing, por exemplo, não afeta o serviço médico nem o valor da assinatura.",
        },
        { type: "h3", text: "Revogação do consentimento (art. 18, IX)" },
        {
          type: "p",
          text: "Retirar, a qualquer momento, um consentimento que você deu, sem custo e sem precisar explicar. A revogação não apaga o que foi feito de forma lícita antes dela e não afeta tratamentos apoiados em outra base legal, como a guarda do prontuário.",
        },
        { type: "h3", text: "Oposição (art. 18, § 2º)" },
        {
          type: "p",
          text: "Opor-se a um tratamento feito sem consentimento quando você entender que ele descumpre a lei. Explicamos a base legal usada e, se a oposição for procedente, encerramos o tratamento.",
        },
        { type: "h3", text: "Revisão de decisões automatizadas (art. 20)" },
        {
          type: "p",
          text: "Pedir revisão de decisões tomadas apenas por sistema, sem participação humana, que afetem seus interesses, como perfil de saúde, elegibilidade ou preço. Hoje a automação da Moorah cuida de tarefas operacionais: lembretes de consulta, agendamento e disponibilização de documentos assinados digitalmente pelo médico. Se alguma decisão automatizada relevante vier a existir, você poderá pedir revisão por uma pessoa e receber informação clara sobre os critérios usados, respeitados os segredos comercial e industrial.",
        },
        {
          type: "h3",
          text: "Reclamação à ANPD e aos órgãos de defesa do consumidor (art. 18, § 1º e § 8º)",
        },
        {
          type: "p",
          text: "Se não ficar satisfeito com a resposta da Moorah, você pode reclamar diretamente à Autoridade Nacional de Proteção de Dados ou a um órgão de defesa do consumidor, como o Procon. Veja a seção sobre a ANPD.",
        },
      ],
    },
    {
      id: "como-exercer",
      title: "Como exercer seus direitos",
      blocks: [
        {
          type: "p",
          text: `Todos os direitos podem ser exercidos pelo canal do encarregado de dados: o e-mail ${dpo}. Para pedidos simples, como corrigir um dado cadastral ou baixar um documento, o portal do paciente também resolve. Passo a passo:`,
        },
        {
          type: "ol",
          items: [
            `Escreva para ${dpo} com o assunto "Direitos do titular - LGPD".`,
            "Informe o nome completo e o e-mail cadastrados na Moorah. Não envie número de documento, senha nem dados de saúde nesse primeiro contato; se for necessário confirmar sua identidade, pediremos por canal seguro.",
            "Diga qual direito quer exercer (acesso, correção, eliminação, portabilidade, revogação, oposição ou revisão) e, se for o caso, quais dados. Não precisa justificar.",
            "Se estiver pedindo em nome de um dependente, informe que é o titular responsável. Se for procurador, anexe a procuração.",
            "Aguarde a confirmação de recebimento com o número do pedido. A resposta segue os prazos da seção seguinte.",
          ],
        },
        {
          type: "p",
          text: "Por segurança, a Moorah só entrega dados clínicos após confirmar que quem pede é o titular ou seu representante legal. A confirmação de identidade usa o mínimo de informação necessário e fica registrada.",
        },
        {
          type: "note",
          text: "Pedidos que envolvem o prontuário, como acesso, cópia e retificação, envolvem também o médico responsável, na forma das normas do CFM. Isso pode exigir prazo maior, e avisaremos se acontecer.",
        },
      ],
    },
    {
      id: "prazo-e-resposta",
      title: "Prazo e forma de resposta",
      blocks: [
        {
          type: "p",
          text: "O art. 19 da LGPD define como a confirmação de tratamento e o acesso aos dados devem ser respondidos:",
        },
        {
          type: "ul",
          items: [
            "Em formato simplificado, de imediato, quando possível. É o caso da consulta ao portal do paciente ou de uma resposta rápida sobre a existência de tratamento.",
            "Por declaração clara e completa, em até 15 dias contados do pedido, indicando a origem dos dados, a inexistência de registro, os critérios usados e a finalidade do tratamento.",
          ],
        },
        {
          type: "p",
          text: "Para os demais direitos (correção, eliminação, portabilidade, revogação, oposição e revisão), a lei remete o prazo à regulamentação da ANPD. A Moorah adota como referência interna os mesmos 15 dias e avisa você por escrito, com o motivo, se precisar de mais tempo.",
        },
        {
          type: "p",
          text: "A resposta é gratuita e enviada ao e-mail cadastrado ou, se você preferir, disponibilizada no portal do paciente. Dados em formato eletrônico são entregues em arquivo legível (PDF ou formato estruturado, no caso da portabilidade). Se a Moorah não puder atender ao pedido, por exemplo porque a lei obriga a guarda, você recebe por escrito as razões de fato ou de direito que impedem o atendimento (art. 18, § 4º) e a informação de que pode peticionar à ANPD (art. 18, § 1º).",
        },
      ],
    },
    {
      id: "encarregado",
      title: "Encarregado de dados",
      blocks: [
        {
          type: "p",
          text: "O art. 41 da LGPD exige que todo controlador indique um encarregado pelo tratamento de dados pessoais, também chamado de DPO. É a pessoa que faz a ponte entre você, a Moorah e a ANPD.",
        },
        {
          type: "p",
          text: `O encarregado da ${site.legalName} atende pelo e-mail ${dpo}. Enquanto a empresa está em constituição, este é o canal do encarregado. O nome do encarregado e eventuais canais adicionais serão publicados nesta página e na Política de privacidade antes do lançamento comercial, como exige o art. 41, § 1º.`,
        },
        {
          type: "p",
          text: "O que o encarregado faz (art. 41, § 2º):",
        },
        {
          type: "ul",
          items: [
            "Recebe reclamações e comunicações de titulares, presta esclarecimentos e adota providências.",
            "Recebe comunicações da ANPD e adota as providências solicitadas.",
            "Orienta funcionários, médicos e fornecedores da Moorah sobre as práticas de proteção de dados.",
            "Executa as demais atribuições definidas pela Moorah ou pela regulamentação.",
          ],
        },
        {
          type: "p",
          text: "O encarregado atua com autonomia para tratar os seus pedidos. Exercer um direito previsto na LGPD nunca gera prejuízo à sua assinatura nem ao seu atendimento.",
        },
      ],
    },
    {
      id: "dependentes-menores",
      title: "Dependentes menores e responsáveis",
      blocks: [
        {
          type: "p",
          text: "No plano Familiar, o titular pode incluir dependentes, conforme as regras de elegibilidade descritas nos Termos de uso e vigentes no momento da contratação. Quando o dependente é criança ou adolescente, a LGPD exige cuidado adicional (art. 14).",
        },
        {
          type: "ul",
          items: [
            "Todo tratamento de dados de criança ou adolescente é feito no melhor interesse dela ou dele (art. 14, caput).",
            "Para crianças, o consentimento, quando for a base legal, é dado de forma específica e em destaque por pelo menos um dos pais ou pelo responsável legal (art. 14, § 1º). Na Moorah, esse papel é do titular do plano, que declara ser responsável legal pelo dependente menor ao cadastrá-lo.",
            "O atendimento médico da criança ou do adolescente segue a base legal da tutela da saúde e as normas do CFM sobre consulta de menores, inclusive quanto à presença do responsável durante a teleconsulta, quando o médico exigir.",
            "A Moorah não usa dados de crianças e adolescentes para marketing, perfilamento ou qualquer finalidade que não seja o atendimento e a operação do plano.",
            "As informações sobre o tratamento são apresentadas de forma simples e acessível, para que responsáveis e, na medida da sua compreensão, os próprios adolescentes entendam o que acontece com seus dados (art. 14, § 6º).",
          ],
        },
        {
          type: "p",
          text: "O titular exerce os direitos do art. 18 em nome dos dependentes menores. Dependentes adultos exercem os próprios direitos diretamente. O acesso do titular aos dados clínicos de um dependente maior de idade depende do consentimento do próprio dependente, registrado na plataforma e revogável a qualquer momento, como preveem os Termos de uso. O acesso do titular aos dados de saúde de dependentes adolescentes segue o melhor interesse do adolescente e a orientação do médico, conforme as normas do CFM e a legislação aplicáveis.",
        },
        {
          type: "p",
          text: "Quando o titular cancela a assinatura ou remove um dependente, os dados cadastrais desse dependente deixam de ser tratados ativamente, conforme as condições vigentes no momento da contratação. O prontuário permanece guardado pelo prazo exigido pela legislação e pelas normas do CFM aplicáveis, acessível ao próprio paciente ou ao responsável legal mediante pedido ao encarregado.",
        },
      ],
    },
    {
      id: "incidentes",
      title: "Incidente ou suspeita de uso indevido",
      blocks: [
        {
          type: "p",
          text: "Incidente de segurança é qualquer acesso não autorizado, perda, alteração ou vazamento de dados pessoais. Suspeita de uso indevido é, por exemplo, alguém usar o seu Cartão Moorah, você receber um e-mail que parece da Moorah pedindo senha, ou notar no portal um documento ou uma consulta que não reconhece.",
        },
        { type: "h3", text: "O que você pode fazer" },
        {
          type: "ol",
          items: [
            "Troque a senha do portal imediatamente e, se usa a mesma senha em outro lugar, troque lá também.",
            `Escreva para ${dpo} com o assunto "Incidente de segurança", descrevendo o que viu, quando e em que canal. Não envie a senha nem dados de saúde no e-mail; guarde capturas de tela, se houver.`,
            `Se houver uso indevido do Cartão Moorah, informe também o atendimento (${contato}) para as providências cabíveis, como o bloqueio do cartão.`,
            "Desconfie de mensagens que pedem senha, código de verificação ou pagamento fora da plataforma. A Moorah nunca pede senha por e-mail, telefone ou WhatsApp.",
          ],
        },
        { type: "h3", text: "O que a Moorah faz" },
        {
          type: "ul",
          items: [
            "Registra o relato, abre uma apuração interna e adota medidas para conter o incidente e evitar que se repita.",
            "Comunica a ANPD e os titulares afetados quando o incidente puder gerar risco ou dano relevante, no prazo e na forma previstos no art. 48 e na regulamentação da ANPD, informando a natureza dos dados afetados, as medidas adotadas e os riscos relacionados.",
            "Se dados clínicos forem afetados, informa também o médico responsável e avalia o dever de comunicação aos conselhos de medicina.",
            "Mantém você informado sobre o andamento pelo e-mail cadastrado.",
          ],
        },
        {
          type: "note",
          text: "Emergência médica não é incidente de dados. Em situações de risco à vida, ligue 192 (SAMU) ou procure a unidade de urgência mais próxima. A telemedicina não substitui o pronto-socorro.",
        },
      ],
    },
    {
      id: "anpd",
      title: "A ANPD como instância externa",
      blocks: [
        {
          type: "p",
          text: "A Autoridade Nacional de Proteção de Dados (ANPD) é o órgão federal que fiscaliza o cumprimento da LGPD, edita regulamentos, recebe reclamações de titulares e pode aplicar sanções a quem descumpre a lei.",
        },
        {
          type: "p",
          text: "A Moorah é a sua primeira instância: pedimos que você fale conosco antes, porque quase tudo se resolve pelo canal do encarregado e com mais rapidez. Mas isso não é condição. O art. 18, § 1º, garante a você o direito de peticionar à ANPD a qualquer tempo, e o § 8º estende esse direito aos órgãos de defesa do consumidor, como o Procon.",
        },
        {
          type: "p",
          text: "As orientações para reclamação, os canais e os formulários estão no site oficial da ANPD, no domínio gov.br. A Moorah coopera com a autoridade, responde às comunicações dela pelo encarregado e cumpre as determinações recebidas.",
        },
        {
          type: "p",
          text: "Também é possível recorrer ao Poder Judiciário para reparar danos decorrentes de tratamento irregular de dados (arts. 42 a 45 da LGPD), sem prejuízo das vias administrativas.",
        },
      ],
    },
    {
      id: "glossario",
      title: "Glossário",
      blocks: [
        {
          type: "ul",
          items: [
            "Titular: a pessoa natural a quem os dados se referem. Você, o paciente, e cada dependente.",
            `Controlador: quem toma as decisões sobre o tratamento. Na assinatura e na operação da plataforma, é a ${site.legalName}. No ato médico, o médico também responde pelo prontuário, na forma das normas do CFM.`,
            "Operador: quem trata dados em nome do controlador e sob suas instruções, como o provedor de nuvem e o serviço de envio de e-mails.",
            "Encarregado (DPO): pessoa indicada pelo controlador para ser o canal entre titulares, empresa e ANPD (art. 41).",
            "Dado pessoal: informação relacionada a pessoa natural identificada ou identificável (art. 5º, I).",
            "Dado pessoal sensível: dado sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico (art. 5º, II). Todo o conteúdo do seu prontuário é dado sensível.",
            "Tratamento: qualquer operação com dados pessoais, como coleta, uso, acesso, armazenamento, compartilhamento e eliminação (art. 5º, X).",
            "Anonimização: processo que faz um dado perder a possibilidade de ser associado a uma pessoa, considerando os meios técnicos razoáveis e disponíveis (art. 5º, XI). Dado anonimizado deixa de ser dado pessoal (art. 12) e é o que a Moorah usa para estatísticas e melhoria do serviço.",
            "Consentimento: manifestação livre, informada e inequívoca pela qual você concorda com um tratamento para uma finalidade determinada (art. 5º, XII).",
            "Base legal: hipótese prevista na LGPD (arts. 7º e 11) que autoriza um tratamento. Todo tratamento precisa de uma.",
            "ANPD: Autoridade Nacional de Proteção de Dados, órgão federal que fiscaliza a LGPD.",
          ],
        },
      ],
    },
  ],
};
