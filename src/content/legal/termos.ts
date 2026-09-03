/*
  Termos de uso do site e da assinatura Moorah Telemedicina.
  Minuta para revisao juridica. Termos comerciais ainda nao confirmados pelo negocio
  (carencia, cancelamento, taxa de adesao, regras de dependentes, reembolso) estao
  escritos de forma condicional; veja docs/conteudo-a-confirmar.md.
  Nada aqui pode conter travessao (U+2014); use hifen.
*/

import { site } from "@/content/site";
import type { LegalDocument } from "./types";

/*
  Qualificacao da empresa: o rodape do site nao exibe endereco e o CNPJ so aparece quando
  NEXT_PUBLIC_CNPJ estiver preenchida. Sem registro, o texto diz isso em vez de inventar dado.
*/
const qualificacao = site.contact.cnpj
  ? `sociedade empresária brasileira inscrita no CNPJ ${site.contact.cnpj}`
  : "sociedade empresária brasileira em constituição, cujos dados de registro (CNPJ e endereço da sede) serão informados no site e nestes Termos assim que o registro for concluído";

export const termos: LegalDocument = {
  slug: "termos",
  title: "Termos de uso",
  description:
    "Condições de uso do site e da assinatura Moorah Telemedicina: planos, cobrança, cancelamento, consultas por vídeo, Cartão Moorah e responsabilidades.",
  updatedAt: "2026-09-02",
  version: "0.1",
  draftNotice:
    "Minuta para revisão jurídica. Este documento ainda não foi validado por advogado e pode mudar antes do lançamento comercial.",
  intro: [
    `Estes Termos de uso regulam o acesso ao site ${site.url} e a contratação e o uso da assinatura ${site.product}, oferecida por ${site.legalName} ("Moorah", "nós"). Leia com atenção antes de assinar. Ao criar uma conta, contratar um plano ou usar a plataforma, você declara que leu, entendeu e concorda com estes Termos e com a Política de privacidade. A página sobre proteção de dados explica em linguagem simples como a LGPD se aplica ao serviço e não substitui estes Termos.`,
    "Escrevemos este documento para ser lido por pessoas, não apenas por advogados. Sempre que houver dúvida sobre alguma regra, escreva para nós pelo canal indicado na seção de atendimento.",
    "Aviso importante: a Moorah não é plano de saúde, não é operadora regulada pela ANS e não atende emergências. Em situação de emergência, ligue 192 (SAMU) ou procure a unidade de urgência mais próxima.",
  ],
  sections: [
    {
      id: "aceitacao-e-partes",
      title: "1. Aceitação e partes",
      blocks: [
        {
          type: "p",
          text: `Este contrato é celebrado entre ${site.legalName}, ${qualificacao}, e a pessoa física que contrata a assinatura ou usa o site e a plataforma ("você", "Assinante" ou "Usuário").`,
        },
        {
          type: "p",
          text: "A aceitação acontece de forma eletrônica, no momento em que você marca a opção de concordância no cadastro ou conclui a contratação de um plano. Esse registro, com data, hora e identificação da conta, é guardado como prova da contratação eletrônica, na forma do Decreto nº 7.962/2013, que regulamenta o Código de Defesa do Consumidor para o comércio eletrônico. Os registros de acesso à Plataforma seguem o Marco Civil da Internet (Lei nº 12.965/2014), como explicado na seção sobre o portal e as credenciais.",
        },
        {
          type: "p",
          text: "Se você não concordar com alguma condição destes Termos, não conclua o cadastro nem use a plataforma. A simples navegação nas páginas públicas do site também está sujeita às regras sobre propriedade intelectual, uso adequado e privacidade descritas aqui.",
        },
        {
          type: "p",
          text: "Estes Termos, a Política de privacidade e as condições específicas do plano exibidas no momento da contratação (preço, número de pessoas, forma de pagamento) formam o conjunto completo do acordo entre você e a Moorah.",
        },
      ],
    },
    {
      id: "definicoes",
      title: "2. Definições",
      blocks: [
        {
          type: "p",
          text: "Para facilitar a leitura, alguns termos aparecem com letra maiúscula e têm o significado abaixo.",
        },
        {
          type: "ul",
          items: [
            "Plataforma: o conjunto formado pelo site, pelo portal do paciente e pelos sistemas de agendamento, videoconsulta, emissão de documentos e envio de lembretes desenvolvidos e operados pela Moorah.",
            "Assinatura: o contrato de prestação de serviços por prazo indeterminado, com cobrança recorrente mensal, que dá acesso à Plataforma e aos benefícios do plano contratado.",
            "Plano: a modalidade de Assinatura escolhida (Individual ou Familiar), com o número de pessoas, o preço e as condições vigentes no momento da contratação.",
            "Titular ou Assinante: a pessoa física, maior de 18 anos e plenamente capaz, que contrata a Assinatura, responde pelo pagamento e administra a conta e os Dependentes.",
            "Dependente: a pessoa incluída pelo Titular no plano Familiar, que passa a ter acesso às consultas, ao Cartão Moorah e ao próprio histórico na Plataforma, sob responsabilidade do Titular.",
            "Usuário: qualquer pessoa que acesse o site ou a Plataforma, seja Titular, Dependente ou visitante.",
            "Cartão Moorah: a identificação individual, com numeração exclusiva de 12 dígitos, emitida para cada Titular e Dependente, que dá acesso às consultas e às condições oferecidas pela Rede parceira. O Cartão Moorah não é cartão de crédito, débito ou pré-pago e não movimenta valores.",
            "Rede parceira: as farmácias, laboratórios, clínicas, lojas e demais estabelecimentos que, por acordo com a Moorah, oferecem descontos ou condições especiais a quem apresenta o Cartão Moorah.",
            "Profissional de saúde ou Médico: o profissional habilitado, com registro ativo no respectivo conselho profissional, que realiza o atendimento por meio da Plataforma.",
            "Consulta: o atendimento por vídeo realizado entre o paciente e o Profissional de saúde por meio da Plataforma, na forma da Resolução CFM nº 2.314/2022.",
          ],
        },
      ],
    },
    {
      id: "objeto-do-servico",
      title: "3. O que a Moorah oferece e o que ela não é",
      blocks: [
        {
          type: "p",
          text: "A Moorah oferece uma assinatura mensal de telemedicina com benefícios. Com a Assinatura ativa, o Titular e os Dependentes do plano contratado podem:",
        },
        {
          type: "ul",
          items: [
            "agendar e realizar consultas por vídeo com médicos habilitados, nas especialidades disponíveis na Plataforma, sem custo adicional por consulta, observadas as regras de uso destes Termos;",
            "receber receitas, atestados e pedidos de exame em formato digital, assinados eletronicamente pelo Profissional de saúde, nos termos da legislação e das normas do CFM aplicáveis;",
            "acessar o portal do paciente, com histórico de consultas, documentos emitidos e, no plano Familiar, a gestão dos Dependentes;",
            "receber lembretes automáticos de consulta por e-mail ou outros canais informados no cadastro;",
            "usar o Cartão Moorah para obter descontos e condições especiais na Rede parceira.",
          ],
        },
        { type: "h3", text: "O que a Moorah não é" },
        {
          type: "ul",
          items: [
            "Não é plano de saúde nem seguro saúde. A Moorah não é operadora de plano privado de assistência à saúde registrada na Agência Nacional de Saúde Suplementar (ANS) e a Assinatura não oferece cobertura assistencial na forma da Lei nº 9.656/1998.",
            "Não cobre internação, cirurgia, procedimentos, atendimento presencial, remoção, medicamentos nem exames. Exames, medicamentos e compras na Rede parceira são pagos pelo Assinante diretamente ao estabelecimento, com o desconto que o parceiro oferecer.",
            "Não é serviço de urgência ou emergência. A telemedicina não substitui o pronto-socorro. Em caso de dor no peito, falta de ar intensa, desmaio, convulsão, sangramento importante, acidente ou qualquer situação de risco à vida, ligue 192 (SAMU) ou vá à unidade de urgência mais próxima antes de qualquer contato com a Plataforma.",
            "Não garante diagnóstico, cura ou resultado clínico. O atendimento médico segue a autonomia e o julgamento do profissional, que pode indicar avaliação presencial quando julgar necessário.",
          ],
        },
        {
          type: "note",
          text: "Em emergências, ligue 192 (SAMU). A Moorah não é plano de saúde e não atende urgências e emergências.",
        },
      ],
    },
    {
      id: "elegibilidade-e-cadastro",
      title: "4. Quem pode assinar e como funciona o cadastro",
      blocks: [
        {
          type: "p",
          text: "Pode ser Titular a pessoa física maior de 18 anos, com plena capacidade civil, residente no Brasil, que forneça dados verdadeiros no cadastro e disponha de um meio de pagamento aceito pela Plataforma.",
        },
        {
          type: "p",
          text: "Pessoas menores de 18 anos ou sem plena capacidade civil só podem usar a Plataforma como Dependentes, incluídas por um Titular que seja seu pai, mãe, responsável legal ou pessoa por eles autorizada. Ao incluir um Dependente menor, o Titular declara ter poderes para consentir em seu nome, inclusive quanto ao tratamento de dados pessoais, conforme o art. 14 da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), e se compromete a acompanhar as consultas do menor sempre que o Profissional de saúde solicitar.",
        },
        {
          type: "p",
          text: "O plano Familiar admite o Titular e até 3 Dependentes. Regras adicionais sobre quem pode ser incluído como Dependente (por exemplo, grau de parentesco, idade ou residência), se existirem, serão as vigentes no momento da contratação e informadas na Plataforma antes da conclusão do pedido. O Titular pode incluir, substituir ou remover Dependentes pelo portal, observadas essas regras e as condições do plano contratado.",
        },
        { type: "h3", text: "Compromissos no cadastro" },
        {
          type: "ul",
          items: [
            "Informar dados completos, verdadeiros e atualizados sobre si e sobre os Dependentes. Dados incorretos podem impedir o atendimento, a emissão de documentos e o uso do Cartão Moorah.",
            "Manter apenas uma conta por pessoa. Cada Titular e cada Dependente é identificado individualmente na Plataforma e recebe o próprio Cartão Moorah.",
            "Comunicar à Moorah, pelo portal ou pelo canal de atendimento, qualquer alteração relevante, como troca de e-mail, telefone ou meio de pagamento.",
            "Não usar a Assinatura para atender pessoas que não sejam o Titular ou os Dependentes cadastrados.",
          ],
        },
        {
          type: "p",
          text: "A Moorah pode adotar medidas razoáveis para confirmar a identidade do Titular e dos Dependentes, inclusive porque a Resolução CFM nº 2.314/2022 exige a identificação do paciente e do médico em cada Consulta. A Moorah pode recusar ou cancelar cadastros com indícios de fraude, falsidade ou uso indevido, sem prejuízo de outras medidas cabíveis.",
        },
      ],
    },
    {
      id: "planos-precos-e-cobranca",
      title: "5. Planos, preços e cobrança",
      blocks: [
        {
          type: "p",
          text: "A Moorah oferece os planos Individual (1 pessoa) e Familiar (Titular e até 3 Dependentes). O preço de cada plano, os benefícios incluídos e as formas de pagamento aceitas são os exibidos no site e na Plataforma no momento da contratação, e passam a integrar estes Termos.",
        },
        { type: "h3", text: "Cobrança recorrente" },
        {
          type: "ul",
          items: [
            "A Assinatura é mensal e cobrada de forma recorrente, de modo automático, no meio de pagamento informado pelo Titular, na data de contratação e, depois, a cada período mensal, até o cancelamento.",
            "A cobrança é feita por meio de processadores de pagamento contratados pela Moorah. A Moorah não armazena os dados completos do cartão do Titular; esses dados ficam com o processador, em ambiente próprio e sujeito às normas do setor de pagamentos.",
            "Havendo taxa de adesão ou outra cobrança além da mensalidade, ela será informada de forma clara e destacada antes da conclusão do pedido. Hoje não há taxa de adesão nas contratações feitas pelo site; essa condição pode mudar para novas contratações, sempre com informação prévia na página de planos, e não afeta quem já é Assinante.",
            "Os valores incluem os tributos incidentes, salvo indicação diferente e destacada no momento da contratação.",
          ],
        },
        { type: "h3", text: "Reajuste" },
        {
          type: "p",
          text: "O preço da Assinatura pode ser reajustado, no máximo uma vez a cada 12 meses, por índice de inflação de ampla divulgação ou por outro critério informado no momento da contratação, ou ainda para refletir alteração de tributos ou custos do serviço. Qualquer reajuste será comunicado ao Titular por e-mail com antecedência mínima de 30 dias em relação à primeira cobrança com o novo valor. Se você não concordar com o reajuste, pode cancelar a Assinatura antes dessa cobrança, sem qualquer ônus.",
        },
        { type: "h3", text: "Inadimplência e suspensão" },
        {
          type: "ul",
          items: [
            "Se a cobrança recorrente não for aprovada, a Moorah avisará o Titular por e-mail e poderá fazer novas tentativas de cobrança nos dias seguintes, além de permitir a atualização do meio de pagamento pelo portal.",
            "Persistindo a falta de pagamento, o acesso às consultas, ao Cartão Moorah e à Rede parceira pode ser suspenso, para o Titular e para os Dependentes, até a regularização. O acesso ao portal para consulta dos documentos já emitidos é mantido.",
            "Se a regularização não ocorrer no prazo informado no aviso de suspensão, conforme as condições vigentes no momento da contratação, a Assinatura pode ser encerrada pela Moorah, sem prejuízo da cobrança dos valores devidos pelo período em que o serviço ficou disponível.",
            "A Moorah não cobra juros ou multa sobre mensalidades não pagas de assinatura suspensa, salvo previsão expressa e clara informada no momento da contratação e dentro dos limites do Código de Defesa do Consumidor.",
          ],
        },
      ],
    },
    {
      id: "arrependimento-e-cancelamento",
      title: "6. Direito de arrependimento e cancelamento",
      blocks: [
        { type: "h3", text: "Arrependimento em 7 dias" },
        {
          type: "p",
          text: "Como a contratação é feita pela internet, você pode desistir da Assinatura em até 7 dias corridos contados da contratação, sem precisar justificar, conforme o art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990) e o Decreto nº 7.962/2013. Nesse caso, a Moorah devolve integralmente os valores pagos, pelo mesmo meio de pagamento utilizado, e cancela a Assinatura.",
        },
        {
          type: "p",
          text: "O pedido de arrependimento pode ser feito pelo portal do paciente ou pelo e-mail de atendimento indicado nestes Termos. A devolução é solicitada ao processador de pagamento logo após o pedido; o prazo para o valor aparecer no extrato depende do meio de pagamento e da instituição financeira, conforme as condições vigentes no momento da contratação. Se você já tiver realizado consultas no período de arrependimento, a devolução integral permanece garantida, sem cobrança pelas consultas realizadas.",
        },
        { type: "h3", text: "Cancelamento a qualquer momento" },
        {
          type: "p",
          text: "A Assinatura não tem prazo mínimo de permanência nem fidelidade, salvo condição diferente, informada de forma clara e destacada no momento da contratação de uma oferta específica. Você pode cancelar quando quiser, pelo portal do paciente ou pelo e-mail de atendimento, sem multa e sem necessidade de justificativa.",
        },
        {
          type: "ul",
          items: [
            "O cancelamento é registrado na data do pedido e impede novas cobranças recorrentes a partir dali.",
            "Após o pedido de cancelamento, o acesso às consultas e ao Cartão Moorah permanece até o fim do período mensal já pago, ou é encerrado de imediato com devolução proporcional do valor, conforme a regra vigente no momento da contratação e informada na Plataforma. A regra aplicável será sempre a mais clara e favorável ao consumidor entre as informadas.",
            "Documentos já emitidos (receitas, atestados e pedidos de exame) continuam disponíveis a você mesmo após o cancelamento: pelo portal, enquanto o acesso estiver ativo, e depois por pedido ao Encarregado de dados, durante o período de guarda previsto na legislação e nas normas do CFM aplicáveis. O caminho está descrito na Política de privacidade.",
            "O cancelamento pelo Titular encerra também o acesso dos Dependentes.",
          ],
        },
        { type: "h3", text: "Encerramento pela Moorah" },
        {
          type: "p",
          text: "A Moorah pode encerrar a Assinatura, com aviso prévio por e-mail, em caso de inadimplência não regularizada, fraude, uso indevido da Plataforma, comportamento abusivo com profissionais ou com a equipe de atendimento, ou descumprimento relevante destes Termos. A Moorah também pode descontinuar o serviço como um todo, com aviso prévio mínimo de 30 dias e devolução proporcional de valores já pagos e não usufruídos.",
        },
      ],
    },
    {
      id: "consultas-por-telemedicina",
      title: "7. Consultas por telemedicina",
      blocks: [
        {
          type: "p",
          text: "As Consultas são realizadas por vídeo, por meio de link seguro gerado pela própria Plataforma, entre o paciente e um médico com registro ativo no Conselho Regional de Medicina, na forma da Resolução CFM nº 2.314/2022, que regulamenta a telemedicina no Brasil.",
        },
        { type: "h3", text: "Autonomia do médico" },
        {
          type: "ul",
          items: [
            "O Profissional de saúde tem total autonomia técnica para decidir sobre diagnóstico, conduta, prescrição e sobre a adequação da telemedicina ao caso. A Moorah não interfere nessas decisões.",
            "O médico pode concluir que o atendimento por vídeo não é adequado e encaminhar o paciente para avaliação presencial, exame complementar ou serviço de urgência. Esse encaminhamento não é falha do serviço: é parte da conduta médica exigida pelas normas do CFM.",
            "Em doenças crônicas ou que exijam acompanhamento prolongado, a Resolução CFM nº 2.314/2022 prevê a realização de consultas presenciais em intervalos definidos pela norma. O médico orientará o paciente sobre isso quando aplicável.",
            "O médico pode encerrar a Consulta se identificar tentativa de obtenção indevida de receitas, atestados ou outros documentos, ou se o paciente se comportar de forma inadequada.",
          ],
        },
        { type: "h3", text: "Receitas, atestados e pedidos de exame" },
        {
          type: "ul",
          items: [
            "Os documentos emitidos na Consulta são assinados digitalmente pelo médico, com certificado que atende à legislação e às normas do CFM aplicáveis, e podem ser verificados eletronicamente por farmácias, laboratórios e empregadores. A emissão de qualquer documento é decisão exclusiva do médico.",
            "Medicamentos sujeitos a controle especial e outros documentos podem ter regras próprias da Anvisa e do CFM que limitem ou impeçam a emissão por telemedicina. O médico informará quando esse for o caso.",
            "A Moorah não garante a aceitação dos documentos digitais por terceiros que não estejam preparados para a verificação eletrônica, embora eles tenham validade em todo o território nacional conforme a legislação vigente.",
          ],
        },
        { type: "h3", text: "Gravação, prontuário e sigilo" },
        {
          type: "ul",
          items: [
            "As Consultas não são gravadas pela Moorah. Se a Plataforma passar a oferecer gravação, isso dependerá de aviso prévio claro, de base legal própria e do consentimento expresso do paciente e do médico, com atualização da Política de privacidade antes de a gravação começar.",
            "O registro clínico da Consulta é feito pelo médico em prontuário eletrônico mantido na Plataforma, protegido por sigilo profissional e acessível apenas ao paciente (ou ao Titular responsável, no caso de Dependente menor) e aos profissionais que o atendem. A guarda desse prontuário segue a legislação e as normas do CFM aplicáveis.",
            "É vedado ao paciente gravar, fotografar ou divulgar a Consulta ou a imagem do médico sem o consentimento dele.",
          ],
        },
        { type: "h3", text: "Conduta do paciente e uso das consultas" },
        {
          type: "ul",
          items: [
            "Compareça no horário agendado, em local reservado, com conexão de internet, câmera e microfone em funcionamento. Tenha em mãos documento de identificação, exames anteriores e a lista de medicamentos em uso.",
            "Informe ao médico dados verdadeiros e completos sobre sintomas, histórico e medicamentos. Informações incorretas ou omitidas podem comprometer a conduta médica e são de responsabilidade de quem as prestou.",
            "Trate os profissionais e a equipe com respeito. Ofensas, ameaças, assédio ou conduta discriminatória levam ao encerramento da Consulta e podem resultar no encerramento da Assinatura.",
            "As consultas são ilimitadas para o Titular e os Dependentes do plano, conforme as condições vigentes no momento da contratação. Para preservar a agenda dos médicos e o acesso de todos, a Plataforma pode limitar o número de agendamentos simultâneos por pessoa e adotar regras para faltas sem aviso (no-show), sempre informadas na Plataforma antes do agendamento.",
            "A disponibilidade de horários e de especialidades varia conforme a agenda dos profissionais. A Moorah não garante horário específico nem atendimento imediato, e informa os horários disponíveis no momento do agendamento.",
          ],
        },
      ],
    },
    {
      id: "cartao-moorah-e-rede-parceira",
      title: "8. Cartão Moorah e Rede parceira",
      blocks: [
        {
          type: "p",
          text: "Cada Titular e cada Dependente com Assinatura ativa recebe um Cartão Moorah, com numeração exclusiva de 12 dígitos, disponível no portal do paciente em formato digital. O Cartão identifica a pessoa perante a Plataforma e a Rede parceira. Ele é pessoal, intransferível e vinculado à Assinatura; se ela for suspensa ou cancelada, o Cartão deixa de ser aceito.",
        },
        { type: "h3", text: "Como funcionam os descontos" },
        {
          type: "ul",
          items: [
            "Os descontos e condições especiais são definidos por cada estabelecimento da Rede parceira, que é o responsável pelo produto ou serviço vendido, pelo seu preço, pela sua qualidade e pela sua entrega. A Moorah não vende medicamentos, exames ou produtos e não intermedeia o pagamento.",
            "O pagamento pelo produto ou serviço, já com o desconto aplicado, é feito pelo Assinante diretamente ao parceiro, no momento da compra. Nenhum valor de compra é cobrado pela Moorah nem incluído na mensalidade.",
            "Percentuais e condições podem variar por parceiro, produto, cidade e período, e não são cumulativos com outras promoções, salvo indicação do parceiro. Os descontos vigentes são consultados na Plataforma ou diretamente no estabelecimento.",
            "Alguns produtos podem não admitir desconto por regra legal ou do fabricante, como medicamentos com preço controlado em determinadas condições. A informação final é dada pelo parceiro no ato da compra.",
          ],
        },
        { type: "h3", text: "Mudanças na Rede parceira" },
        {
          type: "p",
          text: "A Rede parceira é dinâmica: novos parceiros podem entrar e outros podem sair a qualquer tempo, por decisão deles ou da Moorah. A Moorah não garante a permanência de um parceiro específico, de um desconto específico ou a existência de parceiros em todas as localidades, e mantém na Plataforma a relação atualizada dos estabelecimentos participantes. A saída de um parceiro não dá direito a devolução de valores, uma vez que os descontos são benefício acessório à Assinatura e não são cobrados separadamente.",
        },
        {
          type: "p",
          text: "Problemas com produtos ou serviços adquiridos na Rede parceira devem ser tratados diretamente com o estabelecimento, que responde por eles nos termos do Código de Defesa do Consumidor. A Moorah pode ajudar no contato e registra as reclamações recebidas para acompanhar a qualidade da rede.",
        },
      ],
    },
    {
      id: "portal-e-credenciais",
      title: "9. Uso do portal e das credenciais",
      blocks: [
        {
          type: "p",
          text: "O acesso ao portal do paciente é feito com credenciais pessoais (e-mail e senha ou outro método de autenticação oferecido pela Plataforma). As credenciais são de uso exclusivo do Titular ou do Dependente a que se referem, e você é responsável por mantê-las em sigilo e por todas as ações realizadas com elas.",
        },
        {
          type: "ul",
          items: [
            "Não compartilhe sua senha nem permita que terceiros usem sua conta. Se suspeitar de acesso indevido, troque a senha imediatamente e avise a Moorah pelo canal de atendimento.",
            "Use a Plataforma apenas para as finalidades previstas nestes Termos. É proibido tentar acessar contas, dados ou áreas restritas de terceiros, explorar falhas, contornar controles de segurança, usar robôs ou ferramentas automatizadas para extrair dados, ou sobrecarregar a infraestrutura.",
            "É proibido inserir na Plataforma conteúdo ilegal, ofensivo, falso ou que viole direitos de terceiros, inclusive documentos e imagens enviados para consulta.",
            "O Titular tem acesso ao histórico e aos documentos dos Dependentes menores de idade que administra. Para Dependentes maiores de idade, o acesso do Titular aos dados clínicos depende do consentimento do próprio Dependente, registrado na Plataforma e revogável a qualquer momento.",
          ],
        },
        {
          type: "p",
          text: "A Moorah mantém registros de acesso à Plataforma (data, hora e endereço IP) pelo prazo e nas condições do art. 15 do Marco Civil da Internet, para segurança, prevenção a fraudes e cumprimento de obrigações legais. Detalhes na Política de privacidade.",
        },
        {
          type: "p",
          text: "A Moorah pode suspender ou encerrar o acesso de quem descumprir estas regras, sem prejuízo das demais medidas legais cabíveis, e comunicará o motivo ao Titular por e-mail, salvo quando a comunicação puder prejudicar investigação em curso ou for vedada por lei.",
        },
      ],
    },
    {
      id: "propriedade-intelectual",
      title: "10. Propriedade intelectual e marca Moorah",
      blocks: [
        {
          type: "p",
          text: `A marca Moorah, o símbolo da amora, o nome ${site.product}, o layout do site e da Plataforma, os textos, ilustrações, códigos, bancos de dados e demais elementos criados pela Moorah são de titularidade de ${site.legalName} ou licenciados a ela, e estão protegidos pela Lei nº 9.279/1996 (propriedade industrial), pela Lei nº 9.609/1998 (programas de computador) e pela Lei nº 9.610/1998 (direitos autorais).`,
        },
        {
          type: "ul",
          items: [
            "A Assinatura dá a você uma licença pessoal, limitada, não exclusiva e não transferível para usar a Plataforma enquanto a Assinatura estiver ativa, exclusivamente para as finalidades previstas nestes Termos.",
            "Não é permitido copiar, modificar, distribuir, vender, licenciar, fazer engenharia reversa ou criar obras derivadas da Plataforma, nem usar a marca Moorah, o Cartão Moorah ou qualquer elemento visual da Moorah em materiais próprios, sem autorização prévia e por escrito.",
            "Os documentos clínicos emitidos nas Consultas (receitas, atestados, pedidos de exame e prontuário) pertencem ao paciente quanto ao seu conteúdo e podem ser baixados e usados livremente por ele; a Moorah e o médico mantêm as cópias exigidas pela legislação e pelas normas do CFM.",
            "Sugestões e comentários que você enviar sobre a Plataforma podem ser usados pela Moorah para melhorar o serviço, sem obrigação de remuneração ou de crédito, e sem que isso envolva dados pessoais ou clínicos além do necessário para tratar a sugestão.",
          ],
        },
        {
          type: "p",
          text: "As marcas de terceiros exibidas na Plataforma, como as dos estabelecimentos da Rede parceira, pertencem aos seus respectivos titulares e são exibidas apenas para identificar os parceiros.",
        },
      ],
    },
    {
      id: "responsabilidades-e-limites",
      title: "11. Responsabilidades e limites",
      blocks: [
        { type: "h3", text: "Responsabilidades da Moorah" },
        {
          type: "ul",
          items: [
            "Manter a Plataforma em funcionamento, com infraestrutura de nuvem localizada no Brasil, medidas de segurança da informação compatíveis com dados de saúde e suporte ao Assinante nos canais informados.",
            "Contratar apenas profissionais com registro ativo no conselho profissional competente e exigir deles o cumprimento das normas éticas e da Resolução CFM nº 2.314/2022.",
            "Prestar informações claras sobre preços, condições e limites do serviço, na forma do Código de Defesa do Consumidor e do Decreto nº 7.962/2013.",
            "Responder, nos termos da lei, por defeitos na prestação do serviço de intermediação tecnológica que sejam de sua responsabilidade.",
          ],
        },
        { type: "h3", text: "Atos médicos" },
        {
          type: "p",
          text: "O ato médico (diagnóstico, prescrição, atestado, orientação) é de responsabilidade do Profissional de saúde que o pratica, sujeito ao Código de Ética Médica e à fiscalização do CFM e dos CRMs. A Moorah viabiliza tecnicamente a Consulta e seleciona profissionais habilitados, mas não pratica medicina nem interfere na conduta clínica. Isso não afasta as responsabilidades que a legislação de defesa do consumidor atribua à Moorah como fornecedora do serviço.",
        },
        { type: "h3", text: "Indisponibilidade e força maior" },
        {
          type: "ul",
          items: [
            "A Plataforma pode ficar temporariamente indisponível por manutenção programada (avisada com antecedência sempre que possível), por falhas técnicas, por falhas de terceiros (provedores de internet, nuvem, pagamento, certificação digital) ou por caso fortuito e força maior, nos termos do art. 393 do Código Civil.",
            "Se uma Consulta agendada não puder ocorrer por indisponibilidade causada pela Moorah, ela será reagendada sem custo adicional, com prioridade na agenda, em horário escolhido pelo paciente entre os oferecidos. Indisponibilidades prolongadas atribuíveis à Moorah dão direito a compensação proporcional na mensalidade, conforme as condições vigentes.",
            "A Moorah não responde por falhas de conexão, equipamentos, câmera, microfone ou ambiente do lado do Usuário, nem por consequências de informações incorretas ou incompletas prestadas por ele ao médico ou no cadastro.",
            "A Moorah não responde pelos produtos e serviços vendidos pela Rede parceira, nem pela recusa de terceiros em aceitar documentos digitais válidos.",
          ],
        },
        { type: "h3", text: "Limites" },
        {
          type: "p",
          text: "Nada nestes Termos exclui ou limita direitos que a legislação brasileira garanta ao consumidor e que não possam ser afastados por contrato. As limitações acima se aplicam apenas na medida permitida pelo Código de Defesa do Consumidor e pelo Código Civil.",
        },
      ],
    },
    {
      id: "privacidade",
      title: "12. Privacidade e proteção de dados",
      blocks: [
        {
          type: "p",
          text: "O uso da Plataforma envolve o tratamento de dados pessoais, inclusive dados de saúde, que a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) classifica como dados pessoais sensíveis. Os dados pessoais comuns são tratados com base nas hipóteses do art. 7º da LGPD, em especial a execução do contrato e o cumprimento de obrigações legais e regulatórias. Os dados de saúde são tratados com base nas hipóteses do art. 11, em especial a tutela da saúde, exclusivamente em procedimento realizado por profissionais de saúde, e o cumprimento de obrigação legal ou regulatória.",
        },
        {
          type: "p",
          text: "As regras completas sobre quais dados coletamos, para que, por quanto tempo, com quem compartilhamos e como você exerce seus direitos (art. 18 da LGPD) estão na Política de privacidade. A página sobre proteção de dados explica de forma resumida como a Moorah aplica a LGPD e como contatar o Encarregado de dados (art. 41 da LGPD).",
        },
        {
          type: "ul",
          items: [
            "Dados de saúde e prontuários ficam armazenados em infraestrutura de nuvem no Brasil, com criptografia, e só são acessados pelo paciente, pelo Titular responsável (no caso de Dependente menor) e pelos profissionais que realizam o atendimento.",
            "A Moorah não vende dados pessoais nem compartilha dados de saúde com a Rede parceira. O parceiro recebe apenas o número do Cartão Moorah que você apresenta e a confirmação de que a Assinatura está ativa.",
            "Eventual transferência internacional de dados, se necessária a algum serviço de apoio, seguirá o art. 33 da LGPD e estará descrita na Política de privacidade.",
            "Em caso de incidente de segurança que possa causar risco ou dano relevante, a Moorah comunicará a Autoridade Nacional de Proteção de Dados e os titulares afetados, conforme o art. 48 da LGPD.",
          ],
        },
        {
          type: "p",
          text: `Dúvidas sobre dados pessoais podem ser enviadas ao Encarregado pelo e-mail ${site.contact.dpoEmail}.`,
        },
      ],
    },
    {
      id: "disposicoes-finais",
      title: "13. Alterações, atendimento, legislação e foro",
      blocks: [
        { type: "h3", text: "Alterações destes Termos" },
        {
          type: "p",
          text: "A Moorah pode alterar estes Termos para refletir mudanças no serviço, na legislação ou nas normas do CFM. Alterações que afetem preço, benefícios, forma de cobrança ou direitos do Assinante serão comunicadas por e-mail com antecedência mínima de 30 dias antes de entrarem em vigor; alterações meramente editoriais ou exigidas por lei podem ter vigência imediata. A versão vigente, com data e número de versão, fica sempre publicada em /termos. Se você não concordar com uma alteração, pode cancelar a Assinatura antes de ela entrar em vigor, sem ônus. Continuar usando a Plataforma após a data de vigência significa concordar com a nova versão.",
        },
        { type: "h3", text: "Comunicação e atendimento" },
        {
          type: "ul",
          items: [
            `Canal de atendimento ao Assinante: ${site.contact.email}. Respondemos em dias úteis, na forma do Decreto nº 7.962/2013, que exige serviço de atendimento eletrônico adequado e eficaz para dúvidas, reclamações, suspensão e cancelamento do contrato.`,
            `Canal do Encarregado de dados (LGPD): ${site.contact.dpoEmail}.`,
            "Comunicações da Moorah para você são feitas pelo e-mail cadastrado e por avisos no portal do paciente. Mantenha seu e-mail atualizado; as mensagens enviadas ao endereço cadastrado são consideradas recebidas.",
            "Outros canais, como WhatsApp ou telefone, quando disponíveis, serão informados no site e no portal.",
          ],
        },
        { type: "h3", text: "Disposições gerais" },
        {
          type: "ul",
          items: [
            "Se alguma cláusula destes Termos for considerada inválida, as demais continuam em vigor.",
            "A tolerância da Moorah quanto a algum descumprimento não significa renúncia ao direito de exigir o cumprimento depois.",
            "Você não pode ceder a Assinatura ou os direitos dela decorrentes a terceiros. A Moorah pode ceder este contrato a empresa do mesmo grupo ou a sucessora, mediante comunicação prévia, sem prejuízo dos direitos do Assinante.",
            "Os prazos de prescrição e decadência aplicáveis são os do Código Civil e do Código de Defesa do Consumidor.",
          ],
        },
        { type: "h3", text: "Legislação aplicável e foro" },
        {
          type: "p",
          text: "Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial pelo Código de Defesa do Consumidor (Lei nº 8.078/1990), pelo Código Civil (Lei nº 10.406/2002), pelo Marco Civil da Internet (Lei nº 12.965/2014), pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e pelas normas do Conselho Federal de Medicina aplicáveis à telemedicina. As ações relativas a estes Termos podem ser propostas no foro do domicílio do consumidor, conforme o art. 101, inciso I, do Código de Defesa do Consumidor, e nada aqui afasta essa prerrogativa. Antes de recorrer ao Judiciário, convidamos você a tentar uma solução amigável pelo nosso canal de atendimento ou pela plataforma pública consumidor.gov.br.",
        },
      ],
    },
  ],
};
