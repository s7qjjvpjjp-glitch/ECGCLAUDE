// Calculadoras clínicas.
// Fontes:
//  - PREVENT: Khan SS et al., Circulation 2024 (AHA 2023). Equação Total CVD 10 anos.
//  - ERG-SBC: Framingham General CVD (D'Agostino 2008), adotado pela SBC 2020.
//  - CKD-EPI 2021 (sem coef. racial).
//  - Classificação IMC (OMS), PA (SBC 2020), metas LDL/HbA1c (SBC 2020 / SBD 2024).

// ---------- IMC ----------
export function calcularIMC(pesoKg, alturaM) {
  if (!pesoKg || !alturaM || alturaM < 0.8 || alturaM > 2.5) return null;
  const imc = pesoKg / (alturaM * alturaM);
  return Math.round(imc * 10) / 10;
}

export function classificarIMC(imc) {
  if (imc == null) return { rotulo: "—", diagnostico: null };
  if (imc < 18.5) return { rotulo: "Baixo peso", diagnostico: "Baixo peso" };
  if (imc < 25) return { rotulo: "Eutrofia", diagnostico: null };
  if (imc < 30) return { rotulo: "Sobrepeso", diagnostico: "Sobrepeso" };
  if (imc < 35) return { rotulo: "Obesidade grau I", diagnostico: "Obesidade grau I" };
  if (imc < 40) return { rotulo: "Obesidade grau II", diagnostico: "Obesidade grau II" };
  return { rotulo: "Obesidade grau III", diagnostico: "Obesidade grau III" };
}

// ---------- PA ----------
export function classificarPA(pas, pad) {
  if (!pas || !pad) return { rotulo: "—", diagnostico: null };
  if (pas < 120 && pad < 80) return { rotulo: "Ótima", diagnostico: null };
  if (pas < 130 && pad < 85) return { rotulo: "Normal", diagnostico: null };
  if (pas < 140 && pad < 90) return { rotulo: "Pré-hipertensão", diagnostico: "Pré-hipertensão" };
  if (pas < 160 && pad < 100) return { rotulo: "HAS estágio 1", diagnostico: "HAS estágio 1" };
  if (pas < 180 && pad < 110) return { rotulo: "HAS estágio 2", diagnostico: "HAS estágio 2" };
  return { rotulo: "HAS estágio 3", diagnostico: "HAS estágio 3" };
}

// ---------- CKD-EPI 2021 (sem raça) ----------
// Inker LA et al., NEJM 2021.
export function calcularTFG(creatininaMgDl, idade, sexo) {
  if (!creatininaMgDl || !idade || !sexo) return null;
  const k = sexo === "F" ? 0.7 : 0.9;
  const alpha = sexo === "F" ? -0.241 : -0.302;
  const mult = sexo === "F" ? 1.012 : 1.0;
  const scr_k = creatininaMgDl / k;
  const min_term = Math.pow(Math.min(scr_k, 1), alpha);
  const max_term = Math.pow(Math.max(scr_k, 1), -1.200);
  const tfg = 142 * min_term * max_term * Math.pow(0.9938, idade) * mult;
  return Math.round(tfg);
}

export function classificarTFG(tfg) {
  if (tfg == null) return "—";
  if (tfg >= 90) return "G1 (≥90) — normal";
  if (tfg >= 60) return "G2 (60–89) — levemente reduzida";
  if (tfg >= 45) return "G3a (45–59) — leve a moderada";
  if (tfg >= 30) return "G3b (30–44) — moderada a grave";
  if (tfg >= 15) return "G4 (15–29) — grave";
  return "G5 (<15) — falência";
}

// ---------- Controle DM ----------
export function classificarControleDM(hba1c, idosoFragil = false) {
  if (hba1c == null) return { rotulo: "—", diagnostico: null };
  const meta = idosoFragil ? 8.0 : 7.0;
  if (hba1c < meta) return { rotulo: `Controlada (HbA1c ${hba1c}% < ${meta}%)`, diagnostico: "DM2 controlada" };
  return { rotulo: `Não controlada (HbA1c ${hba1c}% ≥ ${meta}%)`, diagnostico: "DM2 não controlada" };
}

// ---------- Meta LDL por risco ----------
export function metaLDL(categoriaRisco) {
  switch (categoriaRisco) {
    case "baixo": return 130;
    case "limitrofe":
    case "intermediario": return 100;
    case "alto": return 70;
    case "muito_alto": return 50;
    default: return null;
  }
}

// ---------- PREVENT (AHA 2023) — Total CVD 10 anos ----------
// Inputs: idade (30-79), sexo, CT mg/dL, HDL mg/dL, PAS, DM (bool), tabagismo (bool),
//         TFG, antiHTA (bool), estatina (bool).
// Converte CT e HDL para mmol/L (÷38.67).
// Retorna {percentual, categoria} ou null se inputs faltando.
export function calcularPrevent({ idade, sexo, ct, hdl, pas, dm, tabagismo, tfg, antiHta, estatina }) {
  if (!idade || !sexo || !ct || !hdl || !pas || tfg == null) return null;
  if (idade < 30 || idade > 79) return null;

  const nonHdl_mmol = (ct - hdl) / 38.67;
  const hdl_mmol = hdl / 38.67;

  const ageC = (idade - 55) / 10;
  const nonHdlC = nonHdl_mmol - 3.5;
  const hdlC = (hdl_mmol - 1.3) / 0.3;
  const sbpLow = (Math.min(pas, 110) - 110) / 20;
  const sbpHigh = Math.max(pas - 110, 0) / 20;
  const egfrLow = (Math.min(tfg, 60) - 60) / -15;
  const egfrHigh = Math.max(tfg - 60, 0) / -15;
  const dmBin = dm ? 1 : 0;
  const smkBin = tabagismo ? 1 : 0;
  const htaBin = antiHta ? 1 : 0;
  const stBin = estatina ? 1 : 0;

  let logOdds;
  if (sexo === "F") {
    logOdds =
      -3.307728 +
      0.7939329 * ageC +
      0.0305239 * nonHdlC -
      0.1337761 * hdlC +
      -0.0616749 * sbpLow +
      0.2388120 * sbpHigh +
      0.5370450 * dmBin +
      0.4864180 * smkBin +
      0.0102299 * egfrLow +
      -0.1275080 * egfrHigh +
      0.2379080 * htaBin +
      -0.0646619 * stBin +
      -0.0620754 * htaBin * sbpHigh +
      -0.1197879 * stBin * nonHdlC +
      -0.0007001 * ageC * nonHdlC +
      -0.0009992 * ageC * hdlC +
      -0.0002887 * ageC * sbpHigh +
      -0.0967585 * ageC * dmBin +
      -0.0474878 * ageC * smkBin +
      0.0073568 * ageC * egfrHigh;
  } else {
    logOdds =
      -3.031168 +
      0.7688528 * ageC +
      0.0736174 * nonHdlC -
      0.0618923 * hdlC +
      -0.0861954 * sbpLow +
      0.3263502 * sbpHigh +
      0.5378978 * dmBin +
      0.4814973 * smkBin +
      0.0119919 * egfrLow +
      -0.1417069 * egfrHigh +
      0.2946147 * htaBin +
      -0.0899312 * stBin +
      -0.0837749 * htaBin * sbpHigh +
      -0.1011574 * stBin * nonHdlC +
      -0.0004549 * ageC * nonHdlC +
      -0.0000320 * ageC * hdlC +
      -0.0000846 * ageC * sbpHigh +
      -0.0895300 * ageC * dmBin +
      -0.0493702 * ageC * smkBin +
      0.0062409 * ageC * egfrHigh;
  }

  const risco = 1 / (1 + Math.exp(-logOdds));
  const pct = Math.round(risco * 1000) / 10;

  let categoria;
  if (pct < 5) categoria = "baixo";
  else if (pct < 7.5) categoria = "limitrofe";
  else if (pct < 20) categoria = "intermediario";
  else categoria = "alto";

  return { percentual: pct, categoria };
}

// ---------- ERG-SBC (Framingham General CVD, D'Agostino 2008) ----------
// Inputs: idade 30-74, sexo, CT mg/dL, HDL mg/dL, PAS, tratamentoHTA, tabagismo, DM.
// Retorna risco 10 anos + categoria SBC.
export function calcularERG({ idade, sexo, ct, hdl, pas, antiHta, tabagismo, dm }) {
  if (!idade || !sexo || !ct || !hdl || !pas) return null;
  if (idade < 30 || idade > 74) return null;

  const lnAge = Math.log(idade);
  const lnTC = Math.log(ct);
  const lnHDL = Math.log(hdl);
  const lnSBP = Math.log(pas);
  const smk = tabagismo ? 1 : 0;
  const dmBin = dm ? 1 : 0;

  let L, S0, mean;
  if (sexo === "M") {
    L =
      3.06117 * lnAge +
      1.12370 * lnTC +
      -0.93263 * lnHDL +
      (antiHta ? 1.99881 : 1.93303) * lnSBP +
      0.65451 * smk +
      0.57367 * dmBin;
    S0 = 0.88936;
    mean = 23.9802;
  } else {
    L =
      2.32888 * lnAge +
      1.20904 * lnTC +
      -0.70833 * lnHDL +
      (antiHta ? 2.82263 : 2.76157) * lnSBP +
      0.52873 * smk +
      0.69154 * dmBin;
    S0 = 0.95012;
    mean = 26.1931;
  }

  const risco = 1 - Math.pow(S0, Math.exp(L - mean));
  const pct = Math.round(risco * 1000) / 10;

  // Categorias SBC 2020 (diretriz dislipidemias)
  let categoria;
  if (sexo === "M") {
    if (pct < 5) categoria = "baixo";
    else if (pct <= 20) categoria = "intermediario";
    else categoria = "alto";
  } else {
    if (pct < 5) categoria = "baixo";
    else if (pct <= 10) categoria = "intermediario";
    else categoria = "alto";
  }

  return { percentual: pct, categoria };
}

// ---------- Categoria de risco dominante ----------
// Se paciente tem DRC estágio ≥3, DM com lesão órgão-alvo, ou doença CV estabelecida,
// considera risco muito alto (estratificação SBC).
export function estratificarRiscoGlobal({ prevent, erg, pacienteAntecedentes = {}, tfg }) {
  if (pacienteAntecedentes.doenca_cv_conhecida) return { categoria: "muito_alto", origem: "doença CV estabelecida" };
  if (tfg != null && tfg < 45) return { categoria: "muito_alto", origem: "DRC G3b+" };
  const candidatos = [prevent?.categoria, erg?.categoria].filter(Boolean);
  if (candidatos.includes("alto")) return { categoria: "alto", origem: "PREVENT ou ERG alto" };
  if (candidatos.includes("intermediario") || candidatos.includes("limitrofe"))
    return { categoria: "intermediario", origem: "risco intermediário" };
  if (candidatos.includes("baixo")) return { categoria: "baixo", origem: "risco baixo" };
  return { categoria: null, origem: "sem dados suficientes" };
}
