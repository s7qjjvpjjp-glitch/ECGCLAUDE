// Motor de regras de rastreio.
// Cada rastreio é uma função que recebe o objeto paciente e diz se é aplicável.
// Fonte: Caderneta do Adulto (MS), INCA 2022, SBD 2024, SBC 2020, SBH 2020.

export const RASTREIOS = [
  // ============ CARDIOMETABÓLICO ============
  {
    id: "pa",
    nome: "Aferição de Pressão Arterial",
    fonte: "SBC/SBH 2020",
    periodicidade: "Toda consulta (≥18 anos)",
    aplicavel: (p) => p.idade >= 18,
  },
  {
    id: "imc",
    nome: "IMC e Circunferência Abdominal",
    fonte: "MS / Caderneta do Adulto",
    periodicidade: "Toda consulta",
    aplicavel: (p) => p.idade >= 18,
  },
  {
    id: "glicemia",
    nome: "Rastreio de Diabetes (glicemia de jejum ou HbA1c)",
    fonte: "SBD 2024",
    periodicidade: "A cada 3 anos se ≥35a; antes se IMC≥25 + fator de risco",
    aplicavel: (p) =>
      p.idade >= 35 ||
      (p.imc >= 25 && (p.has || p.dislipidemia || p.hist_fam_cv || p.sedentario || p.gestante)),
  },
  {
    id: "lipidico",
    nome: "Perfil Lipídico (CT, HDL, LDL, TG)",
    fonte: "SBC 2020",
    periodicidade: "A cada 5 anos (adulto); anual se risco intermediário/alto",
    aplicavel: (p) => (p.sexo === "M" && p.idade >= 40) || (p.sexo === "F" && p.idade >= 50) || p.dislipidemia || p.dm || p.has || p.hist_fam_cv,
  },
  {
    id: "tfg",
    nome: "Creatinina + TFG (CKD-EPI)",
    fonte: "SBN / MS",
    periodicidade: "Anual se HAS, DM, DRC ou ≥60a",
    aplicavel: (p) => p.has || p.dm || p.drc || p.idade >= 60,
  },

  // ============ ONCOLÓGICOS (INCA) ============
  {
    id: "citopatologico",
    nome: "Citopatológico de colo uterino (Papanicolau)",
    fonte: "INCA 2022",
    periodicidade: "Mulheres 25–64a: 2 exames anuais; se normais, trienal",
    aplicavel: (p) => p.sexo === "F" && p.idade >= 25 && p.idade <= 64,
  },
  {
    id: "mamografia",
    nome: "Mamografia",
    fonte: "INCA / MS",
    periodicidade: "Mulheres 50–69a, bienal",
    aplicavel: (p) => p.sexo === "F" && p.idade >= 50 && p.idade <= 69,
  },
  {
    id: "psa_decisao",
    nome: "PSA e toque retal — decisão compartilhada",
    fonte: "MS (não rastreia populacional) / SBU",
    periodicidade: "Homens 50–75a; 45a se fator de risco. Registrar discussão.",
    aplicavel: (p) => p.sexo === "M" && ((p.idade >= 50 && p.idade <= 75) || (p.idade >= 45 && p.hist_fam_cv)),
  },
  {
    id: "psof_colon",
    nome: "Rastreio de Câncer Colorretal (PSOF anual ou colonoscopia)",
    fonte: "MS / SBCP",
    periodicidade: "50–75a",
    aplicavel: (p) => p.idade >= 50 && p.idade <= 75,
  },

  // ============ INFECCIOSOS (Caderneta Adulto) ============
  {
    id: "hiv",
    nome: "Sorologia HIV",
    fonte: "MS / Caderneta Adulto",
    periodicidade: "Ao menos 1 vez na vida; anual se exposição; gestante",
    aplicavel: (p) => p.idade >= 15,
  },
  {
    id: "sifilis",
    nome: "Sorologia Sífilis (VDRL/TR)",
    fonte: "MS",
    periodicidade: "Ao menos 1 vez; gestante: 1ª/3º trim; sexualmente ativo com risco",
    aplicavel: (p) => p.idade >= 15,
  },
  {
    id: "hepatite_b",
    nome: "Sorologia Hepatite B (HBsAg, anti-HBc, anti-HBs)",
    fonte: "MS",
    periodicidade: "Ao menos 1 vez na vida",
    aplicavel: (p) => p.idade >= 15,
  },
  {
    id: "hepatite_c",
    nome: "Sorologia Hepatite C (anti-HCV)",
    fonte: "MS",
    periodicidade: "Ao menos 1 vez na vida",
    aplicavel: (p) => p.idade >= 18,
  },

  // ============ SAÚDE MENTAL / HÁBITOS ============
  {
    id: "phq2",
    nome: "Rastreio de depressão (PHQ-2)",
    fonte: "USPSTF / MS",
    periodicidade: "Toda consulta",
    aplicavel: (p) => p.idade >= 18,
  },
  {
    id: "auditc",
    nome: "Rastreio de uso de álcool (AUDIT-C)",
    fonte: "MS",
    periodicidade: "Anual",
    aplicavel: (p) => p.idade >= 18,
  },
  {
    id: "tabagismo_rastreio",
    nome: "Status de tabagismo e aconselhamento",
    fonte: "MS / INCA",
    periodicidade: "Toda consulta",
    aplicavel: (p) => p.idade >= 18,
  },

  // ============ OUTROS ============
  {
    id: "aaa",
    nome: "USG de aorta abdominal (AAA)",
    fonte: "USPSTF",
    periodicidade: "Homens 65–75a já fumantes: 1 exame na vida",
    aplicavel: (p) => p.sexo === "M" && p.idade >= 65 && p.idade <= 75 && (p.tabagismo || p.ex_tabagismo),
  },
  {
    id: "osteoporose",
    nome: "Densitometria óssea (DXA)",
    fonte: "SBEM / MS",
    periodicidade: "Mulheres ≥65a; homens ≥70a; antes se fatores de risco",
    aplicavel: (p) => (p.sexo === "F" && p.idade >= 65) || (p.sexo === "M" && p.idade >= 70),
  },
  {
    id: "vacinacao",
    nome: "Conferir caderneta vacinal adulto",
    fonte: "PNI / MS",
    periodicidade: "Anual (dT, dTpa, Influenza, HepB, HPV≤45, COVID, FA, Pneumo≥60)",
    aplicavel: (p) => p.idade >= 18,
  },

  // ============ COMPLICAÇÕES DO DIABETES ============
  {
    id: "fundoscopia",
    nome: "Fundoscopia (retinopatia diabética)",
    fonte: "SBD 2024",
    periodicidade: "Anual a partir do diagnóstico de DM2",
    aplicavel: (p) => p.dm,
  },
  {
    id: "microalbuminuria",
    nome: "Relação Albumina/Creatinina urinária",
    fonte: "SBD 2024",
    periodicidade: "Anual se DM ou HAS",
    aplicavel: (p) => p.dm || p.has,
  },
  {
    id: "pe_diabetico",
    nome: "Exame do Pé Diabético (inspeção + monofilamento + diapasão + pulsos)",
    fonte: "SBD 2024",
    periodicidade: "Anual se DM",
    aplicavel: (p) => p.dm,
  },
  {
    id: "hba1c",
    nome: "Hemoglobina Glicada (HbA1c)",
    fonte: "SBD 2024",
    periodicidade: "Trimestral se não controlada, semestral se controlada",
    aplicavel: (p) => p.dm,
  },

  // ============ COMPLICAÇÕES DA HAS ============
  {
    id: "ecg",
    nome: "ECG basal",
    fonte: "SBC/SBH 2020",
    periodicidade: "Anual se HAS/DM/DRC ou risco CV intermediário/alto",
    aplicavel: (p) => p.has || p.dm || p.drc,
  },
  {
    id: "eas",
    nome: "EAS (urina tipo 1)",
    fonte: "SBC/SBH 2020",
    periodicidade: "Anual se HAS ou DM",
    aplicavel: (p) => p.has || p.dm,
  },
];

// Ordem de categorias para exibição agrupada.
export const CATEGORIAS = {
  pa: "Cardiometabólico",
  imc: "Cardiometabólico",
  glicemia: "Cardiometabólico",
  lipidico: "Cardiometabólico",
  tfg: "Cardiometabólico",
  citopatologico: "Oncológico",
  mamografia: "Oncológico",
  psa_decisao: "Oncológico",
  psof_colon: "Oncológico",
  hiv: "Infeccioso",
  sifilis: "Infeccioso",
  hepatite_b: "Infeccioso",
  hepatite_c: "Infeccioso",
  phq2: "Saúde mental / Hábitos",
  auditc: "Saúde mental / Hábitos",
  tabagismo_rastreio: "Saúde mental / Hábitos",
  aaa: "Outros",
  osteoporose: "Outros",
  vacinacao: "Outros",
  fundoscopia: "Complicações DM",
  microalbuminuria: "Complicações DM/HAS",
  pe_diabetico: "Complicações DM",
  hba1c: "Complicações DM",
  ecg: "Complicações HAS",
  eas: "Complicações HAS",
};

export function rastreiosAplicaveis(paciente) {
  return RASTREIOS.filter((r) => {
    try {
      return r.aplicavel(paciente);
    } catch {
      return false;
    }
  });
}
