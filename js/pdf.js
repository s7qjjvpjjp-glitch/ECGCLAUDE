// Gerador de PDF educativo personalizado da Equipe Aquarela.
// Usa jsPDF (via CDN, global jspdf).

import { equipe, conteudoEducativo } from "./conteudo.js";

const CORES = {
  azul: [90, 143, 168],
  azulClaro: [158, 201, 226],
  verde: [185, 220, 201],
  rosa: [244, 182, 194],
  lavanda: [207, 196, 224],
  creme: [253, 247, 239],
  texto: [46, 58, 71],
  textoSuave: [107, 122, 137],
};

function novaPagina(doc) {
  doc.addPage();
  cabecalhoPagina(doc);
}

function cabecalhoPagina(doc) {
  doc.setFillColor(...CORES.azulClaro);
  doc.rect(0, 0, 210, 12, "F");
  doc.setFillColor(...CORES.verde);
  doc.rect(0, 12, 210, 2, "F");
  doc.setTextColor(...CORES.texto);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Equipe Aquarela · UBS", 14, 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Material educativo personalizado", 196, 8, { align: "right" });
}

function rodapePagina(doc, num, total) {
  doc.setFontSize(8);
  doc.setTextColor(...CORES.textoSuave);
  doc.text(
    `Equipe Aquarela · ${num}/${total} · Este material é um complemento, não substitui consulta`,
    105, 290, { align: "center" }
  );
}

function quebraLinha(doc, texto, x, y, largura, alturaLinha = 5) {
  const linhas = doc.splitTextToSize(texto, largura);
  doc.text(linhas, x, y);
  return y + linhas.length * alturaLinha;
}

function capa(doc, nome) {
  // Fundo
  doc.setFillColor(...CORES.creme);
  doc.rect(0, 0, 210, 297, "F");

  // Faixa colorida topo
  doc.setFillColor(...CORES.azulClaro);
  doc.rect(0, 0, 210, 60, "F");
  doc.setFillColor(...CORES.rosa);
  doc.circle(180, 30, 20, "F");
  doc.setFillColor(...CORES.verde);
  doc.circle(30, 40, 15, "F");
  doc.setFillColor(...CORES.lavanda);
  doc.circle(100, 55, 10, "F");

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("Equipe Aquarela", 105, 35, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("UBS · Cuidando de você com arte e ciência", 105, 48, { align: "center" });

  // Destinatário
  doc.setTextColor(...CORES.texto);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Preparado especialmente para:", 105, 90, { align: "center" });
  doc.setFontSize(22);
  doc.setTextColor(...CORES.azul);
  doc.text(nome || "você", 105, 105, { align: "center" });

  // Texto acolhimento
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...CORES.texto);
  const texto = equipe.textoAcolhimento;
  const linhas = doc.splitTextToSize(texto, 160);
  doc.text(linhas, 105, 135, { align: "center" });

  // Data
  const data = new Date().toLocaleDateString("pt-BR");
  doc.setFontSize(10);
  doc.setTextColor(...CORES.textoSuave);
  doc.text(`Entregue em ${data}`, 105, 275, { align: "center" });

  // Decoração inferior
  doc.setFillColor(...CORES.verde);
  doc.rect(0, 285, 210, 12, "F");
}

function paginaEquipe(doc) {
  novaPagina(doc);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...CORES.azul);
  doc.text("Nossa Equipe", 105, 28, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...CORES.texto);
  const intro = "Somos um time que acredita no cuidado humanizado. Cada um de nós tem um papel, mas o mais importante é a escuta. Conte conosco.";
  const linhas = doc.splitTextToSize(intro, 170);
  doc.text(linhas, 105, 40, { align: "center" });

  // Grade de membros (2 colunas)
  let y = 60;
  const colunas = 2;
  const largCol = 85;
  equipe.membros.forEach((m, i) => {
    const col = i % colunas;
    const lin = Math.floor(i / colunas);
    const x = 14 + col * (largCol + 10);
    const yPos = y + lin * 26;

    // Card
    doc.setFillColor(...CORES.creme);
    doc.roundedRect(x, yPos, largCol, 22, 4, 4, "F");
    doc.setFillColor(...CORES.rosa);
    doc.circle(x + 12, yPos + 11, 7, "F");

    // Inicial
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    const iniciais = m.nome.replace(/^(Dr\.|Enf\.|Téc\.? Enf\.|ACS)\s+/, "").charAt(0);
    doc.text(iniciais, x + 12, yPos + 13, { align: "center" });

    // Texto
    doc.setTextColor(...CORES.texto);
    doc.setFontSize(11);
    doc.text(m.nome, x + 24, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...CORES.textoSuave);
    doc.text(m.funcao, x + 24, yPos + 16);
  });
}

function paginaBloco(doc, bloco) {
  novaPagina(doc);
  // Ícone + título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...CORES.azul);
  doc.text(`${bloco.icone}  ${bloco.titulo}`, 14, 32);

  // Linha decorativa
  doc.setDrawColor(...CORES.rosa);
  doc.setLineWidth(1.5);
  doc.line(14, 36, 60, 36);

  // Texto explicativo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...CORES.texto);
  let y = 50;
  y = quebraLinha(doc, bloco.texto, 14, y, 180, 6) + 6;

  // Dicas
  doc.setFillColor(...CORES.verde);
  doc.roundedRect(14, y, 180, 8, 2, 2, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...CORES.texto);
  doc.text("✦ Dicas para o dia a dia", 18, y + 5.5);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  bloco.dicas.forEach((d) => {
    doc.setTextColor(...CORES.rosa);
    doc.text("•", 18, y);
    doc.setTextColor(...CORES.texto);
    const linhasDica = doc.splitTextToSize(d, 168);
    doc.text(linhasDica, 24, y);
    y += linhasDica.length * 5.5 + 2;
  });
}

function paginaFinal(doc, nome, rastreiosPendentes) {
  novaPagina(doc);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...CORES.azul);
  doc.text("Seu checklist", 105, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...CORES.texto);
  const intro = "Tarefas combinadas na consulta. Marque à medida que for cumprindo.";
  doc.text(intro, 105, 40, { align: "center" });

  let y = 55;
  if (rastreiosPendentes?.length) {
    rastreiosPendentes.forEach((r) => {
      doc.setDrawColor(...CORES.azul);
      doc.setLineWidth(0.5);
      doc.rect(18, y - 3, 4, 4);
      doc.setFontSize(11);
      doc.text(r, 26, y);
      y += 8;
    });
  } else {
    doc.text("Nenhum rastreio pendente — parabéns pela atenção com sua saúde!", 105, y, { align: "center" });
  }

  // Contato UBS
  y = 230;
  doc.setFillColor(...CORES.lavanda);
  doc.roundedRect(14, y, 180, 45, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...CORES.texto);
  doc.text("Estamos aqui para você", 105, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Qualquer dúvida, procure a UBS ou fale com sua ACS de referência.", 105, y + 20, { align: "center" });
  doc.setFont("helvetica", "italic");
  doc.text('"Cuidar de você é nossa arte."  — Equipe Aquarela', 105, y + 32, { align: "center" });
}

// Decide quais blocos serão incluídos com base no paciente
function selecionarBlocos(paciente) {
  const blocos = [];
  if (paciente.has) blocos.push(conteudoEducativo.has);
  if (paciente.dm) {
    blocos.push(conteudoEducativo.dm);
    blocos.push(conteudoEducativo.pe_diabetico);
  }
  if (paciente.dislipidemia || (paciente.ldl && paciente.ldl >= 160)) blocos.push(conteudoEducativo.dislipidemia);
  const cat = paciente.riscoGlobal?.categoria;
  if (cat === "alto" || cat === "muito_alto") blocos.push(conteudoEducativo.risco_cv_alto);
  else if (cat === "intermediario" || cat === "limitrofe") blocos.push(conteudoEducativo.risco_cv_intermediario);
  if (paciente.imcDiagnostico === "Sobrepeso") blocos.push(conteudoEducativo.sobrepeso);
  else if (paciente.imcDiagnostico && paciente.imcDiagnostico.startsWith("Obesidade")) blocos.push(conteudoEducativo.obesidade);
  if (paciente.tabagismo) blocos.push(conteudoEducativo.tabagismo);
  if (paciente.rastreiosPendentesIds?.includes("mamografia")) blocos.push(conteudoEducativo.mamografia_pendente);
  if (paciente.rastreiosPendentesIds?.includes("citopatologico")) blocos.push(conteudoEducativo.citopatologico_pendente);
  if (paciente.drc || (paciente.tfg != null && paciente.tfg < 60)) blocos.push(conteudoEducativo.drc);
  if (paciente.rastreiosPendentesIds?.includes("vacinacao")) blocos.push(conteudoEducativo.vacinacao);
  // Saúde mental sempre incluída como reforço suave
  blocos.push(conteudoEducativo.saude_mental);
  return blocos;
}

export async function gerarPDF(paciente) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  capa(doc, paciente.nome);
  paginaEquipe(doc);
  const blocos = selecionarBlocos(paciente);
  blocos.forEach((b) => paginaBloco(doc, b));
  paginaFinal(doc, paciente.nome, paciente.rastreiosPendentes);

  // Numeração de páginas
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    if (i > 1) rodapePagina(doc, i, total);
  }

  const nomeArquivo = `aquarela_${(paciente.nome || "paciente").replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nomeArquivo);
}
