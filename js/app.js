// Orquestrador principal: lê inputs, calcula, renderiza rastreios/risco, gera SOAP e PDF.

import { rastreiosAplicaveis, CATEGORIAS } from "./rastreios.js";
import {
  calcularIMC, classificarIMC, classificarPA,
  calcularTFG, classificarTFG,
  classificarControleDM, metaLDL,
  calcularPrevent, calcularERG, estratificarRiscoGlobal,
} from "./calculadoras.js";
import { gerarSOAP } from "./soap.js";
import { gerarPDF } from "./pdf.js";

const $ = (id) => document.getElementById(id);

function calcularIdadeDe(dataNasc) {
  if (!dataNasc) return null;
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

function valNum(id) {
  const v = $(id)?.value;
  if (v === "" || v == null) return null;
  const n = parseFloat(v.toString().replace(",", "."));
  return isNaN(n) ? null : n;
}

function radioSelecionado(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

function coletarPaciente() {
  const sexo = $("sexo").value || null;
  let idade = parseInt($("idade").value, 10);
  if (isNaN(idade)) idade = null;

  const antec = {};
  document.querySelectorAll("input[name='antec']:checked").forEach((el) => {
    antec[el.value] = true;
  });

  // Obesidade derivada do IMC se não marcada manualmente
  const pesoV = valNum("peso");
  const alturaV = valNum("altura");
  const imc = calcularIMC(pesoV, alturaV);
  const imcInfo = classificarIMC(imc);
  if (imc != null && imc >= 30) antec.obesidade = true;

  const pas = valNum("pas");
  const pad = valNum("pad");
  const paInfo = classificarPA(pas, pad);

  const ct = valNum("ct");
  const hdl = valNum("hdl");
  const ldl = valNum("ldl");
  const tg = valNum("tg");
  const glicemia = valNum("glicemia");
  const hba1c = valNum("hba1c");
  const creatinina = valNum("creatinina");
  const uacr = valNum("uacr");
  const tfg = calcularTFG(creatinina, idade, sexo);
  const tfgClasse = classificarTFG(tfg);
  const controleDm = classificarControleDM(hba1c);

  const p = {
    nome: $("nome").value.trim(),
    idade, sexo,
    ...antec,
    queixa: $("queixa").value,
    pas, pad,
    fc: valNum("fc"),
    peso: pesoV, altura: alturaV,
    imc, imcClasse: imcInfo.rotulo, imcDiagnostico: imcInfo.diagnostico,
    ca: valNum("ca"),
    ct, hdl, ldl, tg, glicemia, hba1c, creatinina, uacr,
    tfg, tfgClasse,
    controleDmRotulo: controleDm.rotulo,
    controleDmDiagnostico: controleDm.diagnostico,
    paRotulo: paInfo.rotulo, paDiagnostico: paInfo.diagnostico,
    // Exame físico
    ef_acv: radioSelecionado("ef_acv"),
    ef_ap: radioSelecionado("ef_ap"),
    ef_abd: radioSelecionado("ef_abd"),
    // Pé diabético
    pe_inspecao: radioSelecionado("pe_inspecao"),
    pe_tatil: radioSelecionado("pe_tatil"),
    pe_vibratoria: radioSelecionado("pe_vibratoria"),
    pe_tibial: radioSelecionado("pe_tibial"),
    pe_pedioso: radioSelecionado("pe_pedioso"),
  };

  // Cálculos de risco
  const prevent = calcularPrevent({
    idade: p.idade, sexo: p.sexo, ct: p.ct, hdl: p.hdl, pas: p.pas,
    dm: !!p.dm, tabagismo: !!p.tabagismo, tfg: p.tfg,
    antiHta: !!p.anti_hta, estatina: !!p.estatina,
  });
  const erg = calcularERG({
    idade: p.idade, sexo: p.sexo, ct: p.ct, hdl: p.hdl, pas: p.pas,
    antiHta: !!p.anti_hta, tabagismo: !!p.tabagismo, dm: !!p.dm,
  });
  const riscoGlobal = estratificarRiscoGlobal({
    prevent, erg, pacienteAntecedentes: p, tfg: p.tfg,
  });
  p.prevent = prevent;
  p.erg = erg;
  p.riscoGlobal = riscoGlobal;
  p.metaLdl = metaLDL(riscoGlobal.categoria);

  return p;
}

// ---------- Renderização ----------
function renderRastreios(paciente) {
  const cont = $("listaRastreios");
  if (!paciente.idade || !paciente.sexo) {
    cont.innerHTML = `<p class="vazio">Preencha idade e sexo para ver os rastreios.</p>`;
    return [];
  }
  const lista = rastreiosAplicaveis(paciente);
  // Preserva status previamente marcado
  const statusAtuais = {};
  document.querySelectorAll(".rastreio").forEach((el) => {
    const id = el.dataset.id;
    const chk = el.querySelector("input[type='radio']:checked");
    if (chk) statusAtuais[id] = chk.value;
  });

  // Agrupa por categoria
  const grupos = {};
  lista.forEach((r) => {
    const cat = CATEGORIAS[r.id] || "Outros";
    (grupos[cat] = grupos[cat] || []).push(r);
  });

  cont.innerHTML = "";
  Object.keys(grupos).forEach((cat) => {
    const h = document.createElement("h3");
    h.style.cssText = "margin:0.5rem 0 0.2rem; color:var(--aqua-azul-escuro); font-size:0.95rem;";
    h.textContent = cat;
    cont.appendChild(h);
    grupos[cat].forEach((r) => {
      const div = document.createElement("div");
      div.className = "rastreio";
      div.dataset.id = r.id;
      const atual = statusAtuais[r.id] || "";
      div.innerHTML = `
        <div class="rastreio-info">
          <div class="rastreio-nome">${r.nome}</div>
          <div class="rastreio-fonte">${r.fonte} · ${r.periodicidade}</div>
        </div>
        <div class="rastreio-status">
          <label><input type="radio" name="status_${r.id}" value="realizado" ${atual === "realizado" ? "checked" : ""}/>Realizado</label>
          <label><input type="radio" name="status_${r.id}" value="solicitado" ${atual === "solicitado" ? "checked" : ""}/>Solicitar</label>
          <label><input type="radio" name="status_${r.id}" value="recusado" ${atual === "recusado" ? "checked" : ""}/>Recusou</label>
        </div>
      `;
      cont.appendChild(div);
    });
  });
  return lista;
}

function rastreiosComStatus() {
  const out = { pendentes: [], pendentesIds: [] };
  document.querySelectorAll(".rastreio").forEach((el) => {
    const id = el.dataset.id;
    const nome = el.querySelector(".rastreio-nome").textContent;
    const sel = el.querySelector("input[type='radio']:checked");
    if (!sel || sel.value === "solicitado") {
      out.pendentes.push(nome);
      out.pendentesIds.push(id);
    }
  });
  return out;
}

function renderResultados(p) {
  $("imcPill").textContent = p.imc ? `IMC: ${p.imc} (${p.imcClasse})` : "IMC: —";
  $("imcPill").className = "pill" + (p.imcDiagnostico ? " alerta" : p.imc ? " ok" : "");

  $("paPill").textContent = (p.pas && p.pad) ? `PA: ${p.pas}x${p.pad} (${p.paRotulo})` : "PA: —";
  $("paPill").className = "pill" + (p.paDiagnostico ? " alerta" : p.pas ? " ok" : "");

  $("tfgPill").textContent = p.tfg ? `TFG: ${p.tfg} (${p.tfgClasse})` : "TFG: —";
  $("tfgPill").className = "pill" + (p.tfg && p.tfg < 60 ? " alerta" : p.tfg ? " ok" : "");

  $("metaLdlPill").textContent = p.metaLdl ? `Meta LDL: < ${p.metaLdl}` : "Meta LDL: —";
  $("controleDmPill").textContent = p.hba1c ? `Controle DM: ${p.controleDmRotulo}` : "Controle DM: —";
  $("controleDmPill").className = "pill" + (p.controleDmDiagnostico === "DM2 não controlada" ? " alerta" : "");

  renderRisco("preventValor", "preventCategoria", p.prevent, "10 anos");
  renderRisco("ergValor", "ergCategoria", p.erg, "10 anos");

  // Seção pé diabético (mostra se DM)
  $("secaoPe").classList.toggle("oculto", !p.dm);
}

function renderRisco(idValor, idCat, r, horizonte) {
  const elV = $(idValor);
  const elC = $(idCat);
  if (!r) {
    elV.textContent = "—";
    elC.textContent = "aguardando dados";
    elC.className = "risco-categoria";
    return;
  }
  elV.textContent = `${r.percentual}%`;
  const mapa = {
    baixo: "Baixo",
    limitrofe: "Limítrofe",
    intermediario: "Intermediário",
    alto: "Alto",
    muito_alto: "Muito alto",
  };
  elC.textContent = `${mapa[r.categoria] || "—"} (${horizonte})`;
  elC.className = `risco-categoria ${r.categoria}`;
}

function atualizarTudo() {
  // idade derivada
  const idade = calcularIdadeDe($("dataNascimento").value);
  if (idade != null) $("idade").value = idade;

  const p = coletarPaciente();
  const lista = renderRastreios(p);
  const pend = rastreiosComStatus();
  p.rastreiosPendentes = pend.pendentes;
  p.rastreiosPendentesIds = pend.pendentesIds;

  renderResultados(p);

  // Gera SOAP automaticamente (mas só sobrescreve se usuário não editou muito)
  if (!$("soapTexto").dataset.editado) {
    $("soapTexto").value = gerarSOAP(p);
  }

  // Guarda paciente para PDF
  window.__paciente = p;
}

function registrarEventos() {
  // Todos os inputs/select/textarea/radio/checkbox disparam recálculo
  document.addEventListener("input", (e) => {
    if (e.target.matches("#soapTexto")) {
      $("soapTexto").dataset.editado = "1";
      return;
    }
    atualizarTudo();
  });
  document.addEventListener("change", () => atualizarTudo());

  $("btnRegerarSoap").addEventListener("click", () => {
    delete $("soapTexto").dataset.editado;
    atualizarTudo();
  });

  $("btnCopiarSoap").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("soapTexto").value);
      const aviso = $("avisoCopiado");
      aviso.textContent = "✓ Copiado para a área de transferência";
      setTimeout(() => (aviso.textContent = ""), 3000);
    } catch {
      // fallback: seleciona o texto
      $("soapTexto").select();
      document.execCommand("copy");
    }
  });

  $("btnGerarPdf").addEventListener("click", async () => {
    try {
      await gerarPDF(window.__paciente);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar PDF: " + e.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  registrarEventos();
  atualizarTudo();
});
