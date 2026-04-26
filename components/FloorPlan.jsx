'use client'
import { generateLayout } from '@/lib/layout'

const SCALE = 20
const MARGIN = 72
const EW = 0.20
const IW = 0.15

const FILLS = {
  garagem:      '#f0eff0',
  sala:         '#eef6fb',
  cozinha:      '#fdfae8',
  area_servico: '#edfaed',
  quarto_casal: '#fdf0ec',
  quarto:       '#fdf4f1',
  banheiro:     '#e8f4fd',
  escritorio:   '#eef5ee',
}
function getFill(id) {
  for (const k of Object.keys(FILLS)) if (id.startsWith(k)) return FILLS[k]
  return '#f8f6f2'
}

function px(v) { return Math.round(v * SCALE) }

function WallRect({ x, y, w, h }) {
  return <rect x={x} y={y} width={w} height={h} fill="#b8b0a8" stroke="#555" strokeWidth="0.4" />
}

function WindowSymbol({ x, y, length, horiz = true }) {
  const t = px(EW)
  const l = px(length)
  if (horiz) return (
    <g>
      <rect x={x} y={y} width={l} height={t} fill="white" />
      <line x1={x} y1={y}       x2={x+l} y2={y}       stroke="#333" strokeWidth="0.9" />
      <line x1={x} y1={y+t/3}   x2={x+l} y2={y+t/3}   stroke="#555" strokeWidth="0.55" />
      <line x1={x} y1={y+t*2/3} x2={x+l} y2={y+t*2/3} stroke="#555" strokeWidth="0.55" />
      <line x1={x} y1={y+t}     x2={x+l} y2={y+t}     stroke="#333" strokeWidth="0.9" />
    </g>
  )
  return (
    <g>
      <rect x={x} y={y} width={t} height={l} fill="white" />
      <line x1={x}       y1={y} x2={x}       y2={y+l} stroke="#333" strokeWidth="0.9" />
      <line x1={x+t/3}   y1={y} x2={x+t/3}   y2={y+l} stroke="#555" strokeWidth="0.55" />
      <line x1={x+t*2/3} y1={y} x2={x+t*2/3} y2={y+l} stroke="#555" strokeWidth="0.55" />
      <line x1={x+t}     y1={y} x2={x+t}     y2={y+l} stroke="#333" strokeWidth="0.9" />
    </g>
  )
}

function DoorArc({ cx, cy, r, sweep }) {
  const R = px(r)
  const d = sweep === 'right'
    ? `M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${cx} ${cy - R} Z`
    : `M ${cx} ${cy} L ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx} ${cy - R} Z`
  return <path d={d} fill="rgba(180,210,255,0.25)" stroke="#888" strokeWidth="0.7" strokeDasharray="3 2" />
}

export default function FloorPlan({ data }) {
  if (!data) return null
  const layout = generateLayout(data)
  const { rooms, bw, bd, totalArea, numFloors, recuos, frente, profundidade } = layout
  const { recuo_frontal, recuo_lateral, recuo_fundos } = recuos

  const svgW = px(bw) + MARGIN * 2 + 48
  const svgH = px(bd) + MARGIN * 2 + 88
  const ox = MARGIN
  const oy = MARGIN

  return (
    <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #ddd' }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: 'block', background: '#fafaf8', maxWidth: '100%' }}>

        {/* terrain dashed */}
        <rect
          x={ox - px(recuo_lateral)} y={oy - px(recuo_frontal)}
          width={px(bw + 2*recuo_lateral)} height={px(bd + recuo_frontal + recuo_fundos)}
          fill="none" stroke="#bbb" strokeWidth="1.2" strokeDasharray="7 4"
        />

        {/* street */}
        <rect x={ox - px(recuo_lateral)} y={oy - px(recuo_frontal) - 17}
          width={px(bw + 2*recuo_lateral)} height={14}
          fill="#e8e8e8" stroke="#ccc" strokeWidth="0.5" />
        <text x={ox - px(recuo_lateral) + px(bw + 2*recuo_lateral)/2} y={oy - px(recuo_frontal) - 7}
          textAnchor="middle" fontSize="8" fontFamily="Inter,sans-serif" fill="#888" letterSpacing="2">
          VIA PÚBLICA
        </text>

        {/* building floor */}
        <rect x={ox} y={oy} width={px(bw)} height={px(bd)} fill="#f5f3f0" />

        {/* rooms */}
        {rooms.map(r => {
          const rx = ox + px(r.x) + px(IW/2)
          const ry = oy + px(r.y) + px(IW/2)
          const rw = px(r.w) - px(IW)
          const rh = px(r.d) - px(IW)
          const fs = Math.max(8, Math.min(12, rw / (r.label.length * 0.68)))
          return (
            <g key={r.id}>
              <rect x={rx} y={ry} width={rw} height={rh} fill={getFill(r.id)} />
              {rw > 40 && rh > 28 && <>
                <text x={rx+rw/2} y={ry+rh/2 - (rw>55?7:0)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={fs} fontFamily="Inter,sans-serif" fontWeight="700" fill="#333">
                  {r.label}
                </text>
                {rw > 55 && rh > 38 && (
                  <text x={rx+rw/2} y={ry+rh/2+9}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="8.5" fontFamily="Inter,sans-serif" fill="#888">
                    {(r.w*r.d).toFixed(1)} m²
                  </text>
                )}
              </>}
            </g>
          )
        })}

        {/* interior walls */}
        {rooms.map((r, i) => {
          if (i === 0) return null
          const hasRight  = rooms.some(r2 => Math.abs(r2.x - (r.x+r.w)) < 0.15 && r2.y < r.y+r.d && r2.y+r2.d > r.y)
          const hasBottom = rooms.some(r2 => Math.abs(r2.y - (r.y+r.d)) < 0.15 && r2.x < r.x+r.w && r2.x+r2.w > r.x)
          return (
            <g key={`iw_${r.id}`}>
              {hasRight  && <WallRect x={ox+px(r.x+r.w)-px(IW/2)} y={oy+px(r.y)} w={px(IW)} h={px(r.d)} />}
              {hasBottom && <WallRect x={ox+px(r.x)} y={oy+px(r.y+r.d)-px(IW/2)} w={px(r.w)} h={px(IW)} />}
            </g>
          )
        })}

        {/* exterior walls */}
        <WallRect x={ox}              y={oy}              w={px(bw)}   h={px(EW)} />
        <WallRect x={ox}              y={oy+px(bd)-px(EW)} w={px(bw)}   h={px(EW)} />
        <WallRect x={ox}              y={oy}              w={px(EW)}   h={px(bd)} />
        <WallRect x={ox+px(bw)-px(EW)} y={oy}              w={px(EW)}   h={px(bd)} />

        {/* windows */}
        <WindowSymbol x={ox + px(bw*0.55)} y={oy} length={Math.min(bw*0.22, 1.4)} horiz />
        {Array.from({ length: (data.programa?.quartos||2) }, (_, i) => {
          const sw = bw / (data.programa?.quartos||2)
          return <WindowSymbol key={i} x={ox+px(i*sw+sw*0.3)} y={oy+px(bd)-px(EW)} length={Math.min(sw*0.4,1.1)} horiz />
        })}
        <WindowSymbol x={ox} y={oy+px(bd*0.3)} length={Math.min(bd*0.12,1.0)} horiz={false} />
        <WindowSymbol x={ox+px(bw)-px(EW)} y={oy+px(bd*0.55)} length={Math.min(bd*0.12,0.9)} horiz={false} />

        {/* door arcs */}
        <DoorArc cx={ox+px(bw*0.72)} cy={oy+px(EW)} r={0.85} sweep="right" />
        {Array.from({ length: Math.min(data.programa?.quartos||2, 3) }, (_, i) => {
          const sw = bw / (data.programa?.quartos||2)
          return <DoorArc key={i} cx={ox+px(i*sw+sw*0.12)+px(IW)} cy={oy+px(bd-IW)} r={0.8} sweep="right" />
        })}

        {/* outer dim — width */}
        <line x1={ox} y1={oy-26} x2={ox+px(bw)} y2={oy-26} stroke="#333" strokeWidth="0.9" />
        <line x1={ox} y1={oy-30} x2={ox} y2={oy-22} stroke="#333" strokeWidth="0.9" />
        <line x1={ox+px(bw)} y1={oy-30} x2={ox+px(bw)} y2={oy-22} stroke="#333" strokeWidth="0.9" />
        <text x={ox+px(bw)/2} y={oy-32} textAnchor="middle" fontSize="10"
          fontFamily="JetBrains Mono,monospace" fill="#111" fontWeight="700">
          {bw.toFixed(2)} m
        </text>

        {/* outer dim — depth */}
        <line x1={ox+px(bw)+26} y1={oy} x2={ox+px(bw)+26} y2={oy+px(bd)} stroke="#333" strokeWidth="0.9" />
        <line x1={ox+px(bw)+22} y1={oy} x2={ox+px(bw)+30} y2={oy} stroke="#333" strokeWidth="0.9" />
        <line x1={ox+px(bw)+22} y1={oy+px(bd)} x2={ox+px(bw)+30} y2={oy+px(bd)} stroke="#333" strokeWidth="0.9" />
        <text x={ox+px(bw)+40} y={oy+px(bd)/2} textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#111" fontWeight="700"
          transform={`rotate(90,${ox+px(bw)+40},${oy+px(bd)/2})`}>
          {bd.toFixed(2)} m
        </text>

        {/* north arrow */}
        <g transform={`translate(${svgW-46},${MARGIN-14})`}>
          <circle cx={0} cy={0} r={16} fill="white" stroke="#555" strokeWidth="1.2" />
          <polygon points="0,-13 4,5 0,1 -4,5" fill="#222" />
          <polygon points="0,13 4,-5 0,-1 -4,-5" fill="#ccc" />
          <text x={0} y={0.5} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fontFamily="Inter" fontWeight="800" fill="#333">N</text>
        </g>

        {/* scale bar */}
        <g transform={`translate(${ox},${oy+px(bd)+16})`}>
          {[0,1,2].map(i => (
            <rect key={i} x={px(i)} y={0} width={px(1)} height={5}
              fill={i%2===0?'#333':'white'} stroke="#333" strokeWidth="0.5" />
          ))}
          <text x={0}      y={14} fontSize="8" fontFamily="Inter" fill="#666">0</text>
          <text x={px(1)}  y={14} textAnchor="middle" fontSize="8" fontFamily="Inter" fill="#666">1m</text>
          <text x={px(3)}  y={14} textAnchor="middle" fontSize="8" fontFamily="Inter" fill="#666">3m</text>
        </g>

        {/* title block */}
        <rect x={ox} y={oy+px(bd)+36} width={px(bw)} height={50}
          fill="#f0eeeb" stroke="#ccc" strokeWidth="0.8" />
        <line x1={ox} y1={oy+px(bd)+52} x2={ox+px(bw)} y2={oy+px(bd)+52} stroke="#ddd" strokeWidth="0.5" />
        <text x={ox+8} y={oy+px(bd)+48} fontSize="10" fontFamily="Inter" fontWeight="800" fill="#222">
          INSTITUTO CHUI CALONEGO — Planta Baixa Esquemática — Pav. Térreo
        </text>
        <text x={ox+8} y={oy+px(bd)+63} fontSize="8.5" fontFamily="Inter" fill="#555">
          {`${data.cidade||'—'}/${data.estado||'—'} · Terreno ${frente}×${profundidade}m · Área proj. ≈${totalArea}m² · ${numFloors} pav.`}
        </text>
        <text x={ox+px(bw)-8} y={oy+px(bd)+63} textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#aaa">
          {`Rev.01 · ${new Date().toLocaleDateString('pt-BR')}`}
        </text>
        <text x={ox+8} y={oy+px(bd)+78} fontSize="7.5" fontFamily="Inter" fill="#bbb">
          Referência esquemática — não substitui projeto executivo assinado por profissional habilitado CREA/CAU
        </text>

        {/* building outline */}
        <rect x={ox} y={oy} width={px(bw)} height={px(bd)}
          fill="none" stroke="#222" strokeWidth="2.5" />
      </svg>
    </div>
  )
}
