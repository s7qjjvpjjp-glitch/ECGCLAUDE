import { CUB_REFERENCE, ROOM_SIZES } from '../data/reference'

export function estimateArea(programa) {
  const { quartos, suites, banheiros, sala_tipo, area_servico, vagas, churrasqueira, piscina, edicula, escritorio } = programa
  let area = 0
  area += sala_tipo === 'aberta' ? 22 : 18
  area += quartos * 10
  area += suites * 12
  area += banheiros * 5
  area += 12
  if (area_servico === 'interna') area += 6
  if (vagas > 0) area += vagas * 16
  if (churrasqueira) area += 12
  if (piscina) area += 20
  if (edicula) area += 15
  if (escritorio) area += 9
  area *= 1.20
  return Math.round(area)
}

export function estimateCost(area, padrao) {
  const ref = CUB_REFERENCE[padrao]
  const cub = (ref.min + ref.max) / 2
  return Math.round(area * cub)
}

export function getAvailableArea(terreno, premissas) {
  const { frente, profundidade } = terreno
  const { recuo_frontal, recuo_lateral, recuo_fundos } = premissas
  if (!frente || !profundidade) return 0
  const bw = frente - 2 * recuo_lateral
  const bd = profundidade - recuo_frontal - recuo_fundos
  if (bw <= 0 || bd <= 0) return 0
  return bw * bd
}

export function blondelCheck(espelho, piso) {
  const val = 2 * espelho + piso
  return val >= 0.63 && val <= 0.65
}

export function checkGates(data) {
  const { terreno, financeiro, premissas, programa } = data
  const gates = { g0: false, g1: false, g2: false, g3: false, g4: false }
  const alerts = []

  // Gate 0 — dados mínimos
  if (data.cidade && data.estado && terreno.frente > 0 && terreno.profundidade > 0 && financeiro.orcamento > 0) {
    gates.g0 = true
  } else {
    if (!data.cidade || !data.estado) alerts.push({ type: 'error', gate: 0, msg: 'Informe cidade e estado — sem isso não é possível verificar recuos e código de obras.' })
    if (!terreno.frente || !terreno.profundidade) alerts.push({ type: 'error', gate: 0, msg: 'Dimensões do terreno obrigatórias para calcular se o programa cabe.' })
    if (!financeiro.orcamento) alerts.push({ type: 'error', gate: 0, msg: 'Orçamento obrigatório para verificar viabilidade antes de projetar.' })
  }

  // Gate 1 — programa cabe no terreno?
  if (gates.g0) {
    const areaOcupavel = getAvailableArea(terreno, premissas)
    const areaEstimada = estimateArea(programa)
    const areaEstimadaTerrea = areaEstimada / 1.2
    if (areaOcupavel > 0) {
      if (areaEstimadaTerrea <= areaOcupavel) {
        gates.g1 = true
      } else {
        const pavimentos = Math.ceil(areaEstimadaTerrea / areaOcupavel)
        alerts.push({
          type: 'warning', gate: 1,
          msg: `O programa (≈${areaEstimada}m²) não cabe em um único pavimento (área ocupável: ${areaOcupavel.toFixed(0)}m²). Provavelmente serão necessários ${pavimentos} pavimento(s) — confirmar no projeto.`
        })
        gates.g1 = true
      }
    }
  }

  // Gate 2 — orçamento fecha?
  if (gates.g0) {
    const areaEstimada = estimateArea(programa)
    const custoEstimado = estimateCost(areaEstimada, financeiro.padrao)
    const orcamento = financeiro.orcamento
    const ratio = orcamento / custoEstimado

    if (ratio < 0.60) {
      alerts.push({
        type: 'error', gate: 2,
        msg: `Trava financeira: orçamento informado (R$ ${orcamento.toLocaleString('pt-BR')}) é ${((1-ratio)*100).toFixed(0)}% abaixo do estimado (R$ ${custoEstimado.toLocaleString('pt-BR')} para ${areaEstimada}m² padrão ${CUB_REFERENCE[financeiro.padrao].label}). Precisa realinhar programa ou padrão antes de continuar.`
      })
    } else if (ratio < 0.80) {
      alerts.push({
        type: 'warning', gate: 2,
        msg: `Orçamento apertado: estimativa é R$ ${custoEstimado.toLocaleString('pt-BR')} para ${areaEstimada}m² no padrão ${CUB_REFERENCE[financeiro.padrao].label}. Diferença de ${((1-ratio)*100).toFixed(0)}% — reduzir área ou padrão.`
      })
      gates.g2 = true
    } else if (ratio < 1.0) {
      alerts.push({
        type: 'warning', gate: 2,
        msg: `Custo estimado: R$ ${custoEstimado.toLocaleString('pt-BR')} (${areaEstimada}m² × CUB ${CUB_REFERENCE[financeiro.padrao].label}). Margem de segurança pequena — reservar 10-15% para imprevistos.`
      })
      gates.g2 = true
    } else {
      gates.g2 = true
    }
  }

  // Gate 3 — vãos estruturais verificados
  gates.g3 = true

  // Gate 4 — checklists completos (auto-incluídos nos documentos)
  gates.g4 = gates.g0 && gates.g1

  return { gates, alerts }
}

export function generateConditionalAlerts(data) {
  const alerts = []
  const { terreno, programa, financeiro, orientacao_solar, esgoto, sondagem_feita, finalidade, tipo_projeto } = data

  if (finalidade === 'vender') alerts.push({ type: 'info', msg: 'Para venda: planta flexível vende melhor — quartos padrão, suíte, 2 vagas. Personalização excessiva reduz público comprador.' })
  if (tipo_projeto === 'reforma') alerts.push({ type: 'warning', msg: 'Antes de derrubar qualquer parede, preciso saber se ela sustenta algo em cima — verificação estrutural obrigatória.' })
  if (!data.tem_terreno) alerts.push({ type: 'info', msg: 'Para escolher terreno: verifique frente mínima (≥8m), topografia, orientação solar, escritura registrada e zoneamento municipal.' })

  if (terreno.topografia !== 'plano' && terreno.topografia) {
    alerts.push({ type: 'info', msg: `Terreno em declive não é problema, mas muda fundação e partido arquitetônico. Desnível pode ser aproveitado (garagem embaixo, por exemplo). ${terreno.desnivel > 2 ? 'Com ' + terreno.desnivel + 'm de desnível, fundação especial provável.' : ''}` })
  }
  if (!sondagem_feita) {
    alerts.push({ type: 'warning', msg: 'Sondagem SPT ainda não feita. É o primeiro investimento antes de construir — custa R$ 800–2.000 (2-3 furos) e evita surpresas na fundação que podem custar 10× mais para corrigir.' })
  }
  if (esgoto === 'fossa') {
    alerts.push({ type: 'warning', msg: 'Sem rede de esgoto: precisará de fossa séptica + sumidouro. Ocupa espaço mínimo a 1,5m da divisa, tem custo extra de R$ 3–8 mil e exige limpeza a cada 2-3 anos.' })
  }
  if (orientacao_solar === 'O' || orientacao_solar === 'NO' || orientacao_solar === 'SO') {
    alerts.push({ type: 'warning', msg: 'Frente para o oeste = sol forte da tarde na fachada. Quartos ficam melhor voltados para leste ou norte. Prever proteção solar (beiral, pergolado, vegetação).' })
  }
  if (terreno.frente > 0 && terreno.frente < 8) {
    alerts.push({ type: 'warning', msg: `Frente estreita (${terreno.frente}m) — após recuos laterais, largura útil de ≈${(terreno.frente - 3).toFixed(1)}m. Projeto vertical (sobrado) quase certamente necessário.` })
  }

  if (programa.piscina) {
    alerts.push({ type: 'info', msg: 'Piscina: ocupa mínimo 3×5m + casa de máquinas (~2m²). Custo R$ 30–80 mil dependendo do tipo. Manutenção mensal de R$ 200–500.' })
  }
  if (programa.churrasqueira) {
    alerts.push({ type: 'info', msg: 'Churrasqueira precisa de coifa/chaminé. Se espaço gourmet integrado, prever pia, bancada, água, esgoto e tomadas.' })
  }
  if (programa.sala_tipo === 'aberta') {
    alerts.push({ type: 'info', msg: 'Cozinha americana: exaustor precisa ser eficiente, senão gordura vai para a sala. Prever circuito exclusivo para coifa de no mínimo 300 m³/h.' })
  }
  if (programa.vagas > 0 && programa.garagem_coberta) {
    alerts.push({ type: 'info', msg: `Garagem coberta para ${programa.vagas} carro(s): mínimo ${programa.vagas * 2.8}×5,5m. Vaga de ${2.2}m não abre a porta com conforto — usar 2,80m.` })
  }

  if (financeiro.executor === 'mestre') {
    alerts.push({ type: 'info', msg: 'Mestre de obras direto: 15–20% mais barato que construtora, mas você administra materiais, pagamentos e prazos. Os projetos precisam ser mais detalhados.' })
  }
  if (financeiro.padrao === 'alto' && financeiro.orcamento > 0) {
    const areaEstimada = estimateArea(programa)
    const custoMedio = estimateCost(areaEstimada, 'medio')
    alerts.push({ type: 'info', msg: `Acabamento top custa 30–40% a mais. Com esse padrão, ou a área será menor (≈${Math.round(financeiro.orcamento / CUB_REFERENCE.alto.max)}m²) ou o orçamento precisará de revisão.` })
  }

  const areaEstimada = estimateArea(programa)
  const frente = terreno.frente
  if (frente > 0) {
    const recuos = data.premissas
    const areaOcupavel = getAvailableArea(terreno, recuos)
    if (areaOcupavel > 0 && areaEstimada / 1.2 > areaOcupavel) {
      const pavimentos = Math.ceil((areaEstimada / 1.2) / areaOcupavel)
      alerts.push({ type: 'warning', msg: `O programa levantado (≈${areaEstimada}m²) não cabe em um pavimento (área ocupável ≈${areaOcupavel.toFixed(0)}m²). Solução: sobrado de ${pavimentos} pavimentos.` })
    }
  }

  return alerts
}
