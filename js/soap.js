// Gerador de SOAP.
// Recebe o estado do paciente (inputs do formulário + cálculos derivados) e produz texto.

import { CATEGORIAS } from "./rastreios.js";

function dataHoje() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR");
}

function listaAntecedentes(p) {
  const map = {
    has: "hipertensão arterial",
    dm: "diabetes mellitus tipo 2",
    dislipidemia: "dislipidemia",
    tabagismo: "tabagismo ativo",
    ex_tabagismo: "ex-tabagista",
    obesidade: "obesidade prévia",
    hist_fam_cv: "história familiar de doença cardiovascular precoce",
    drc: "doença renal crônica",
    gestante: "gestante",
    sedentario: "sedentarismo",
  };
  const itens = Object.keys(map).filter((k) => p[k]);
  if (!itens.length) return "nega comorbidades";
  return itens.map((k) => map[k]).join(", ");
}

function medicacoes(p) {
  const itens = [];
  if (p.anti_hta) itens.push("anti-hipertensivo");
  if (p.estatina) itens.push("estatina");
  if (!itens.length) return "nega uso regular de medicações";
  return `em uso de ${itens.join(" e ")}`;
}

function construirSubjetivo(p) {
  const partes = [];
  partes.push(
    `Paciente comparece em ação de rastreio da Equipe Aquarela. Data: ${dataHoje()}.`
  );
  partes.push(`Antecedentes: ${listaAntecedentes(p)}.`);
  partes.push(`Medicamentos: ${medicacoes(p)}.`);
  if (p.dm) {
    const pend = [];
    if (!p.exame_fundoscopia_realizado) pend.push("fundoscopia");
    if (!p.exame_microalbuminuria_realizado) pend.push("microalbuminúria");
    if (!p.exame_pe_realizado) pend.push("exame dos pés");
    if (pend.length) partes.push(`Refere não ter realizado recentemente: ${pend.join(", ")}.`);
  }
  if (p.queixa && p.queixa.trim()) partes.push(p.queixa.trim());
  return partes.join(" ");
}

function construirObjetivo(p) {
  const linhas = [];
  // Sinais vitais
  const vitais = [];
  if (p.pas && p.pad) vitais.push(`PA ${p.pas}x${p.pad} mmHg`);
  if (p.fc) vitais.push(`FC ${p.fc} bpm`);
  if (p.peso) vitais.push(`Peso ${p.peso} kg`);
  if (p.altura) vitais.push(`Altura ${p.altura} m`);
  if (p.imc) vitais.push(`IMC ${p.imc} kg/m² (${p.imcClasse})`);
  if (p.ca) vitais.push(`CA ${p.ca} cm`);
  if (vitais.length) linhas.push(vitais.join("; ") + ".");

  // Exame físico
  const ef = [];
  ef.push("BEG, LOTE, corado, hidratado, afebril.");
  if (p.ef_acv === "normal") ef.push("ACV: RCR 2T BNF, sem sopros.");
  else if (p.ef_acv === "sopro") ef.push("ACV: RCR 2T com sopro audível.");
  else if (p.ef_acv === "arritmico") ef.push("ACV: ritmo irregular.");
  if (p.ef_ap === "normal") ef.push("AP: MV+ simétrico, sem ruídos adventícios.");
  else if (p.ef_ap === "alterado") ef.push("AP: com ruídos adventícios.");
  if (p.ef_abd === "normal") ef.push("Abdome: flácido, indolor à palpação, RHA+.");
  else if (p.ef_abd === "alterado") ef.push("Abdome: alterado.");
  linhas.push(ef.join(" "));

  // Pé diabético
  if (p.dm) {
    const pe = [];
    if (p.pe_inspecao === "normal") pe.push("inspeção sem lesões ou deformidades");
    else if (p.pe_inspecao === "alterada") pe.push("inspeção com lesão/deformidade");
    if (p.pe_tatil === "preservada") pe.push("sensibilidade tátil (monofilamento 10g) preservada");
    else if (p.pe_tatil === "alterada") pe.push("sensibilidade tátil alterada");
    if (p.pe_vibratoria === "preservada") pe.push("sensibilidade vibratória (128Hz) preservada");
    else if (p.pe_vibratoria === "alterada") pe.push("sensibilidade vibratória alterada");
    if (p.pe_tibial === "presente") pe.push("pulso tibial posterior presente");
    else if (p.pe_tibial === "ausente") pe.push("pulso tibial posterior ausente");
    if (p.pe_pedioso === "presente") pe.push("pulso pedioso presente");
    else if (p.pe_pedioso === "ausente") pe.push("pulso pedioso ausente");
    if (pe.length) linhas.push(`Exame dos pés: ${pe.join(", ")}.`);
  }

  // Laboratório
  const lab = [];
  if (p.ct) lab.push(`CT ${p.ct}`);
  if (p.hdl) lab.push(`HDL ${p.hdl}`);
  if (p.ldl) lab.push(`LDL ${p.ldl}`);
  if (p.tg) lab.push(`TG ${p.tg}`);
  if (p.glicemia) lab.push(`Glicemia ${p.glicemia}`);
  if (p.hba1c) lab.push(`HbA1c ${p.hba1c}%`);
  if (p.creatinina) lab.push(`Cr ${p.creatinina}`);
  if (p.tfg) lab.push(`TFG ${p.tfg} mL/min/1,73m²`);
  if (p.uacr) lab.push(`RAC ${p.uacr} mg/g`);
  if (lab.length) linhas.push(`Laboratório: ${lab.join("; ")}.`);

  return linhas.join("\n");
}

function construirAvaliacao(p) {
  const diagnosticos = [];
  if (p.has) {
    const ctrl = p.pas && p.pas < 140 && p.pad && p.pad < 90 ? "controlada" : p.pas ? "não controlada" : "";
    diagnosticos.push(`Hipertensão arterial sistêmica${ctrl ? " " + ctrl : ""}`);
  } else if (p.paDiagnostico) {
    diagnosticos.push(p.paDiagnostico);
  }
  if (p.dm) {
    diagnosticos.push(p.controleDmDiagnostico || "Diabetes mellitus tipo 2");
  }
  if (p.dislipidemia || (p.ldl && p.ldl > 160)) diagnosticos.push("Dislipidemia");
  if (p.imcDiagnostico) diagnosticos.push(p.imcDiagnostico);
  if (p.tabagismo) diagnosticos.push("Tabagismo ativo");
  if (p.tfg != null && p.tfg < 60) diagnosticos.push(`Doença renal crônica (${p.tfgClasse})`);
  if (p.riscoGlobal?.categoria) {
    const mapa = {
      baixo: "Risco cardiovascular baixo",
      limitrofe: "Risco cardiovascular limítrofe",
      intermediario: "Risco cardiovascular intermediário",
      alto: "Risco cardiovascular alto",
      muito_alto: "Risco cardiovascular muito alto",
    };
    diagnosticos.push(mapa[p.riscoGlobal.categoria]);
  }
  // Rastreios pendentes sinalizados
  if (p.rastreiosPendentes?.length) {
    diagnosticos.push(`Rastreios pendentes: ${p.rastreiosPendentes.join(", ")}`);
  }
  return diagnosticos.length ? diagnosticos.map((d, i) => `${i + 1}. ${d}`).join("\n") : "Sem diagnósticos ativos identificados.";
}

function construirPlano(p) {
  const plano = [];
  // Exames solicitados com base nos rastreios pendentes
  if (p.rastreiosPendentes?.length) {
    plano.push(`Solicitar: ${p.rastreiosPendentes.join(", ")}.`);
  }
  // Metas específicas
  if (p.metaLdl) plano.push(`Meta LDL < ${p.metaLdl} mg/dL conforme categoria de risco.`);
  if (p.has) plano.push("Reforço de adesão a anti-hipertensivo; meta PA < 140x90 mmHg (< 130x80 se DM/DRC).");
  if (p.dm) plano.push("Reforço de autocuidado em DM; meta HbA1c < 7%; revisão de esquema se fora da meta.");
  if (p.tabagismo) plano.push("Aconselhamento breve para cessação do tabagismo; oferta de grupo na UBS.");
  if (p.imcDiagnostico && p.imcDiagnostico.startsWith("Obesidade")) plano.push("Encaminhamento a nutricionista e grupo de atividade física.");
  if (p.pe_tatil === "alterada" || p.pe_vibratoria === "alterada") plano.push("Pé diabético em risco: orientações de cuidado diário, calçado adequado, retorno em 3 meses.");
  if (p.riscoGlobal?.categoria === "alto" || p.riscoGlobal?.categoria === "muito_alto") plano.push("Considerar início/ajuste de estatina; intensificar mudanças de estilo de vida.");
  // Educativo
  plano.push("Entregue material educativo personalizado da Equipe Aquarela.");
  // Retorno
  plano.push("Retorno com resultados em 30 dias ou antes se intercorrências.");
  return plano.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

export function gerarSOAP(p) {
  const s = construirSubjetivo(p);
  const o = construirObjetivo(p);
  const a = construirAvaliacao(p);
  const pl = construirPlano(p);
  return `# SUBJETIVO
${s}

# OBJETIVO
${o}

# AVALIAÇÃO
${a}

# PLANO
${pl}`;
}
