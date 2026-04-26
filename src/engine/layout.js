import { ROOM_SIZES } from '../data/reference'

export function generateLayout(data) {
  const { terreno, programa, premissas } = data
  const { frente, profundidade } = terreno
  const { recuo_frontal, recuo_lateral, recuo_fundos } = premissas

  const bw = Math.max(4, frente - 2 * recuo_lateral)
  const bd = Math.max(6, profundidade - recuo_frontal - recuo_fundos)

  const rooms = []
  let x = 0, y = 0

  const frontH = bd * 0.38
  const midH   = bd * 0.25
  const backH  = bd - frontH - midH

  let frontX = 0
  if (programa.vagas > 0) {
    const gw = Math.min(programa.vagas * 3.0, bw * 0.45)
    const gd = Math.min(5.5, frontH)
    rooms.push({ id: 'garagem', label: 'Garagem', w: gw, d: gd, x: 0, y: 0, color: ROOM_SIZES.garagem.color })
    frontX = gw
  }
  const salaW = bw - frontX
  const salaD = frontH
  rooms.push({ id: 'sala', label: programa.sala_tipo === 'aberta' ? 'Sala/Jantar' : 'Sala de Estar', w: salaW, d: salaD, x: frontX, y: 0, color: ROOM_SIZES.sala_jantar.color })

  const cozW = bw * 0.5
  rooms.push({ id: 'cozinha', label: 'Cozinha', w: cozW, d: midH, x: 0, y: frontH, color: ROOM_SIZES.cozinha.color })
  rooms.push({ id: 'area_servico', label: 'Área de Serviço', w: bw - cozW, d: midH, x: cozW, y: frontH, color: ROOM_SIZES.area_servico.color })

  const backY = frontH + midH
  const totalQuartos = programa.quartos + (programa.suites > programa.quartos ? 0 : 0)
  const qtdAmbientes = programa.quartos + programa.banheiros + (programa.escritorio ? 1 : 0)
  const roomW = bw / Math.max(qtdAmbientes, 1)

  let bx = 0
  for (let i = 0; i < programa.quartos; i++) {
    const isSuite = i < programa.suites
    const rw = Math.max(3.0, roomW * (isSuite ? 1.3 : 1.0))
    const capped = Math.min(rw, bw - bx - 0.2)
    if (capped < 2.5) break
    rooms.push({ id: `quarto_${i}`, label: isSuite ? 'Suíte' : 'Quarto', w: capped, d: backH, x: bx, y: backY, color: isSuite ? ROOM_SIZES.quarto_casal.color : ROOM_SIZES.quarto.color })
    bx += capped
  }

  const bathW = Math.min(2.2, (bw - bx) / Math.max(programa.banheiros, 1))
  for (let i = 0; i < programa.banheiros && bx < bw - 0.5; i++) {
    rooms.push({ id: `banheiro_${i}`, label: 'Banho', w: bathW, d: backH * 0.6, x: bx, y: backY + backH * 0.4, color: ROOM_SIZES.banheiro.color })
    bx += bathW
  }

  if (programa.escritorio) {
    rooms.push({ id: 'escritorio', label: 'Escritório', w: Math.min(3.0, bw - bx), d: backH, x: bx, y: backY, color: ROOM_SIZES.escritorio.color })
  }

  const totalArea = rooms.reduce((a, r) => a + r.w * r.d, 0)
  const numFloors = (totalArea / (bw * bd)) > 1.1 ? 2 : 1

  return { rooms, bw, bd, totalArea: Math.round(totalArea * 10) / 10, numFloors, recuos: { recuo_frontal, recuo_lateral, recuo_fundos }, frente, profundidade }
}

export function generateRenderPrompt(data, angle = 'perspective') {
  const { cidade, estado, programa, financeiro, terreno } = data
  const padrao = { economico: 'simple', medio: 'standard', alto: 'premium' }[financeiro.padrao]
  const floors = programa.quartos > 2 ? 'two-story' : 'single-story'
  const tipo = `${floors} Brazilian residential house`
  const acabamento = financeiro.padrao === 'alto'
    ? 'high-end finish, large windows, porcelain exterior cladding'
    : financeiro.padrao === 'medio'
    ? 'standard finish, ceramic tiles, aluminum windows'
    : 'simple finish, painted concrete walls, basic aluminum windows'

  const angleMap = {
    perspective: 'Perspective view from front-right at 35 degrees elevation.',
    frontal:     'Front elevation view, straight on, eye level.',
    lateral:     'Right side elevation view, showing roof overhang.',
    interior:    'Interior view looking toward back wall, furniture visible.',
    noturno:     'Night scene, LED lights glowing warm, garden lights on.',
    aerea:       "Bird's eye view from 60 degrees, showing roof and layout.",
  }

  return `Architectural render of a ${tipo}, located in ${cidade || 'Brazil'}${estado ? ', ' + estado : ''}. ${floors === 'two-story' ? 'Two-story building with balcony.' : 'Single-story with generous ceiling height.'} ${acabamento}. Ceramic roof tiles, tropical garden with palm trees. ${financeiro.piso_tipo === 'porcelanato' ? 'Porcelain tile interior floors.' : 'Ceramic tile floors.'} Photorealistic architectural render, daylight, warm lighting, high quality, professional architecture photography style. ${angleMap[angle]} No people. Sharp details.`
}
