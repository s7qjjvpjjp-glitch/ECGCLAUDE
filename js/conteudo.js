// Conteúdo educativo por condição e dados da Equipe Aquarela.
// Mantido em arquivo separado para facilitar revisão pela equipe sem mexer em lógica.

export const equipe = {
  nome: "Equipe Aquarela",
  textoAcolhimento:
    "A Equipe Aquarela se importa com você e com a saúde da sua família. Nossa ação é baseada em cuidado integral: ouvir, examinar, orientar e acompanhar. Este material é um resumo do que conversamos na consulta e traz dicas para você cuidar melhor de si no dia a dia. Qualquer dúvida, procure a UBS — estamos aqui para você.",
  membros: [
    { nome: "Dr. Alvaro", funcao: "Médico" },
    { nome: "Dr. Francisco", funcao: "Médico" },
    { nome: "Enf. Blenda", funcao: "Enfermeira" },
    { nome: "Téc. Enf. Andreia", funcao: "Técnica de Enfermagem" },
    { nome: "ACS Janeci", funcao: "Agente Comunitária de Saúde" },
    { nome: "ACS Simoni", funcao: "Agente Comunitária de Saúde" },
    { nome: "ACS Leticia", funcao: "Agente Comunitária de Saúde" },
  ],
};

// Cada bloco é disparado por uma chave do objeto "paciente derivado"
// (ex.: has, dm, risco_cv_alto, mamografia_pendente...)
export const conteudoEducativo = {
  has: {
    titulo: "Hipertensão Arterial",
    icone: "🫀",
    texto:
      "A hipertensão é o aumento sustentado da pressão nas artérias. Muitas vezes é silenciosa, mas com o tempo sobrecarrega o coração, os rins e o cérebro. Controlar a pressão reduz muito o risco de AVC e infarto.",
    dicas: [
      "Meta de pressão: abaixo de 14 por 9 (140x90 mmHg). Se você tem diabetes ou doença renal, abaixo de 13 por 8 (130x80).",
      "Reduza o sal: menos de 5 g por dia (uma colher de chá). Evite temperos prontos, embutidos e conservas.",
      "Movimente-se: 30 minutos de caminhada, 5 dias por semana, já ajuda a baixar a pressão.",
      "Tome o remédio todos os dias no mesmo horário, mesmo quando estiver se sentindo bem.",
      "Afira a pressão periodicamente e anote em uma folha para mostrar ao médico.",
    ],
  },
  dm: {
    titulo: "Diabetes Mellitus",
    icone: "🩸",
    texto:
      "O diabetes é o aumento do açúcar no sangue. Com o tempo, esse açúcar em excesso machuca pequenos vasos e nervos, afetando olhos, rins e pés. A boa notícia: quando bem controlado, a pessoa vive com qualidade e sem complicações.",
    dicas: [
      "Meta de hemoglobina glicada (HbA1c): abaixo de 7% na maioria dos adultos.",
      "Faça todo ano: exame dos pés, exame dos olhos (fundo de olho) e exame da urina para olhar os rins.",
      "Inspecione seus pés diariamente. Unhas bem cortadas, calçado fechado e confortável, nada de andar descalço.",
      "Alimentação: prefira alimentos integrais, legumes e verduras. Evite açúcar, refrigerantes e doces concentrados.",
      "Atividade física ajuda a insulina a funcionar melhor.",
    ],
  },
  dislipidemia: {
    titulo: "Colesterol Alto",
    icone: "🧈",
    texto:
      "Colesterol alto não dói, mas vai formando placas de gordura nas artérias. Com o tempo, essas placas podem entupir o coração ou o cérebro. Controlar o colesterol reduz risco de infarto e AVC.",
    dicas: [
      "Reduza frituras, carnes gordurosas, embutidos, queijos amarelos e manteiga.",
      "Aumente fibras: aveia, frutas com casca, feijão, verduras.",
      "Peixes (sardinha, atum) ajudam a subir o colesterol 'bom' (HDL).",
      "Caminhada regular é uma das formas mais eficazes de baixar colesterol naturalmente.",
      "Se o médico prescreveu estatina, tome todo dia — ela protege suas artérias.",
    ],
  },
  risco_cv_alto: {
    titulo: "Risco Cardiovascular Elevado",
    icone: "❤️‍🔥",
    texto:
      "Calculamos seu risco de ter um evento cardiovascular (infarto, AVC) nos próximos 10 anos usando sua idade, pressão, colesterol e outros dados. Ele veio elevado — isso não é uma sentença, é um sinal de que podemos agir agora para reduzir esse risco.",
    dicas: [
      "Quanto maior o risco, mais baixo precisa estar seu LDL (colesterol ruim). Sua meta individual foi definida na consulta.",
      "Parar de fumar é a ação que mais reduz risco — fale conosco sobre o grupo de cessação do tabagismo.",
      "Controlar a pressão e o diabetes é essencial.",
      "Atividade física regular reduz em até 30% o risco de infarto.",
      "Manter o peso saudável, a alimentação equilibrada e dormir bem fazem parte do tratamento.",
    ],
  },
  risco_cv_intermediario: {
    titulo: "Risco Cardiovascular Intermediário",
    icone: "💛",
    texto:
      "Seu risco está em uma zona de atenção: nem baixo, nem alto. É o momento ideal para agir com mudanças no estilo de vida e evitar que o risco cresça nos próximos anos.",
    dicas: [
      "Ajuste na alimentação e exercícios costumam ser suficientes, sem precisar começar remédios.",
      "Monitore pressão e colesterol pelo menos uma vez por ano.",
      "Se você fuma, este é o melhor momento para parar.",
    ],
  },
  sobrepeso: {
    titulo: "Sobrepeso",
    icone: "⚖️",
    texto:
      "Seu IMC está acima do ideal. Isso aumenta chance de diabetes, hipertensão e doenças do coração. Perder mesmo 5% do peso já traz benefícios mensuráveis.",
    dicas: [
      "Pequenas mudanças consistentes funcionam melhor que dietas radicais.",
      "Beba água antes das refeições, coma devagar e durma bem.",
      "Reduza bebidas açucaradas (sucos de caixinha, refrigerante).",
      "Procure a UBS para conhecer o grupo de atividade física e nutrição.",
    ],
  },
  obesidade: {
    titulo: "Obesidade",
    icone: "⚖️",
    texto:
      "A obesidade é uma doença crônica que aumenta risco para mais de 200 outras condições. Tem tratamento e, com acompanhamento, é possível reduzir peso e ganhar qualidade de vida.",
    dicas: [
      "Perder de 5 a 10% do peso já reduz pressão, colesterol, glicose e dor nas articulações.",
      "Acompanhamento multiprofissional (médico, enfermeiro, nutricionista) tem melhor resultado.",
      "Há medicamentos e, em alguns casos, cirurgia — converse com seu médico sobre as opções.",
      "Evite dietas milagrosas. O sustentável é o que funciona.",
    ],
  },
  tabagismo: {
    titulo: "Tabagismo",
    icone: "🚭",
    texto:
      "O cigarro é o principal fator de risco evitável para câncer, infarto, AVC e doenças pulmonares. A boa notícia: o corpo começa a se recuperar em 20 minutos após o último cigarro.",
    dicas: [
      "Em 1 ano sem cigarro: risco de infarto cai pela metade.",
      "Em 5 anos: risco de AVC volta ao de quem nunca fumou.",
      "O SUS oferece grupo de cessação gratuito com apoio psicológico e medicação.",
      "Marque sua data para parar e avise a família e amigos. Apoio social ajuda muito.",
    ],
  },
  mamografia_pendente: {
    titulo: "Mamografia",
    icone: "🎀",
    texto:
      "A mamografia é o exame que detecta câncer de mama em estágio inicial, antes de aparecer qualquer nódulo palpável. Quando descoberto cedo, o câncer de mama tem mais de 95% de chance de cura.",
    dicas: [
      "Recomendação do SUS: mulheres de 50 a 69 anos fazem mamografia a cada 2 anos.",
      "O exame dura poucos minutos. Pode incomodar, mas não dói.",
      "Além da mamografia, fique atenta a nódulos, alterações no mamilo ou na pele. Qualquer mudança, procure-nos.",
    ],
  },
  citopatologico_pendente: {
    titulo: "Preventivo (Citopatológico)",
    icone: "🌸",
    texto:
      "O exame preventivo (papanicolau) detecta alterações no colo do útero causadas pelo HPV, muito antes de virarem câncer. É rápido, gratuito no SUS e salva vidas.",
    dicas: [
      "Recomendação: mulheres de 25 a 64 anos. Os dois primeiros são anuais; se vierem normais, a cada 3 anos.",
      "Evite relação sexual, duchas e cremes vaginais 48h antes do exame.",
      "Não precisa fazer fora do período menstrual? Idealmente sim — evite o período de sangramento.",
      "Vacina contra HPV, mesmo em adultos, pode ser discutida com seu médico.",
    ],
  },
  pe_diabetico: {
    titulo: "Cuidado com os Pés",
    icone: "🦶",
    texto:
      "As pessoas com diabetes têm mais risco de ferimentos e infecções nos pés, porque o açúcar alto com o tempo pode reduzir a sensibilidade. Examinar os pés todo dia evita complicações graves.",
    dicas: [
      "Olhe seus pés todos os dias. Use um espelho para ver a sola.",
      "Lave com água morna (nunca quente) e seque bem entre os dedos.",
      "Hidrate, mas não entre os dedos.",
      "Use meias sem costura e calçado fechado e confortável. Nunca ande descalço.",
      "Corte as unhas retas. Se tiver dificuldade, procure a UBS.",
      "Qualquer ferida, rachadura ou mudança de cor: avise a equipe imediatamente.",
    ],
  },
  drc: {
    titulo: "Saúde dos Rins",
    icone: "💧",
    texto:
      "Os rins filtram o sangue e eliminam toxinas. Pressão alta e diabetes são as principais causas de doença renal crônica, que pode evoluir sem sintomas até fases avançadas.",
    dicas: [
      "Controlar pressão e glicemia protege seus rins.",
      "Cuidado com anti-inflamatórios (diclofenaco, ibuprofeno): use só quando prescrito.",
      "Beba água ao longo do dia, conforme orientação médica.",
      "Exames simples (creatinina e urina) detectam problemas cedo — estão no plano da consulta.",
    ],
  },
  vacinacao: {
    titulo: "Vacinação em Dia",
    icone: "💉",
    texto:
      "Vacinas não são só para crianças. Adultos também têm um calendário próprio, que protege contra tétano, gripe, hepatite, HPV e outras doenças.",
    dicas: [
      "Vacina da gripe: todo ano, principalmente a partir dos 60 anos.",
      "Tétano (dT): reforço a cada 10 anos.",
      "Hepatite B: 3 doses, se ainda não tomou.",
      "Traga sua caderneta de vacinação na próxima consulta.",
    ],
  },
  saude_mental: {
    titulo: "Saúde Mental",
    icone: "🌿",
    texto:
      "Cuidar da mente é tão importante quanto cuidar do corpo. Ansiedade, tristeza persistente e problemas com álcool são condições tratáveis — e quanto antes, melhor.",
    dicas: [
      "Tristeza ou desânimo por mais de 2 semanas merecem atenção. Procure a equipe.",
      "Álcool em excesso afeta fígado, pressão e sono.",
      "Movimento, sono e vínculos sociais são remédios poderosos.",
      "A UBS oferece acolhimento, grupos e encaminhamento quando necessário.",
    ],
  },
};
