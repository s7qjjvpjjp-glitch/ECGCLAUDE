export function generateLayout(data) {
  const terreno = data.terreno || {}
  const programa = data.programa || {}
  const premissas = data.premissas || {}

  const frente = terreno.frente || 10
  const profundidade = terreno.profundidade || 20
  const recuo_frontal = premissas.recuo_frontal || 5
  const recuo_lateral = premissas.recuo_lateral || 1.5
  const recuo_fundos  = premissas.recuo_fundos  || 3

  const bw = Math.max(4, frente - 2 * recuo_lateral)
  const bd = Math.max(8, profundidade - recuo_frontal - recuo_fundos)

  const frontH = bd * 0.38
  const midH   = bd * 0.25
  const backH  = bd - frontH - midH

  const rooms = []
  let frontX = 0

  if ((programa.vagas || 0) > 0) {
    const gw = Math.min(programa.vagas * 3.0, bw * 0.45)
    rooms.push({ id: 'garagem', label: 'Garagem', w: gw, d: Math.min(5.5, frontH), x: 0, y: 0 })
    frontX = gw
  }

  const salaW = bw - frontX
  rooms.push({ id: 'sala', label: programa.sala_tipo === 'aberta' ? 'Sala / Jantar' : 'Sala de Estar', w: salaW, d: frontH, x: frontX, y: 0 })

  const cozW = bw * 0.5
  rooms.push({ id: 'cozinha', label: 'Cozinha', w: cozW, d: midH, x: 0, y: frontH })
  rooms.push({ id: 'area_servico', label: 'Área de Serviço', w: bw - cozW, d: midH, x: cozW, y: frontH })

  const backY    = frontH + midH
  const quartos  = programa.quartos || 2
  const suites   = programa.suites  || 0
  const banheiros= programa.banheiros || 2
  const segW     = bw / Math.max(quartos + banheiros, 1)

  let bx = 0
  for (let i = 0; i < quartos; i++) {
    const isSuite = i < suites
    const rw = Math.min(Math.max(2.8, segW * (isSuite ? 1.2 : 1.0)), bw - bx - 0.1)
    if (rw < 2.5) break
    rooms.push({ id: `quarto_${i}`, label: isSuite ? 'Suíte' : 'Quarto', w: rw, d: backH, x: bx, y: backY })
    bx += rw
  }

  const bathW = Math.min(2.2, Math.max(1.8, (bw - bx) / Math.max(banheiros, 1)))
  for (let i = 0; i < banheiros && bx < bw - 1; i++) {
    rooms.push({ id: `banheiro_${i}`, label: 'Banho', w: bathW, d: backH * 0.55, x: bx, y: backY + backH * 0.45 })
    bx += bathW
  }

  if (programa.escritorio && bx < bw - 1) {
    rooms.push({ id: 'escritorio', label: 'Escritório', w: Math.min(3.0, bw - bx), d: backH, x: bx, y: backY })
  }

  const totalArea = rooms.reduce((s, r) => s + r.w * r.d, 0)
  const numFloors = totalArea / (bw * bd) > 1.05 ? 2 : 1

  return {
    rooms,
    bw: Math.round(bw * 100) / 100,
    bd: Math.round(bd * 100) / 100,
    totalArea: Math.round(totalArea),
    numFloors,
    recuos: { recuo_frontal, recuo_lateral, recuo_fundos },
    frente,
    profundidade,
  }
}

export function generateRenderPrompt(data, angle = 'perspective') {
  const angles = {
    perspective: 'Perspective view from front-right at 35 degrees elevation.',
    frontal:     'Front elevation view, straight on, eye level.',
    lateral:     'Right side elevation view, showing roof overhang.',
    interior:    'Interior living room view, furniture and finishes visible.',
    noturno:     'Night scene, warm LED interior lights glowing, garden spike lights on.',
    aerea:       "Bird's eye view from 60 degrees, showing roof and surroundings.",
  }
  const padrao = { economico: 'simple economic', medio: 'standard mid-range', alto: 'high-end luxury' }
  const financeiro = data.financeiro || {}
  const programa   = data.programa   || {}
  const floors = (programa.quartos || 2) > 3 ? 'two-story' : 'single-story'

  return `Photorealistic architectural render of a ${floors} Brazilian residential house in ${data.cidade || 'Brazil'}. Ceramic tile hip roof terracotta color. Painted plaster exterior off-white walls. ${padrao[financeiro.padrao || 'medio']} finish. ${programa.vagas > 0 ? programa.vagas + '-car garage.' : ''} Tropical garden with palm trees, green lawn. ${angles[angle]} Professional architecture photography, sharp details, natural lighting, no people, no text.`
}
