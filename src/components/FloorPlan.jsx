import React from 'react'
import { generateLayout } from '../engine/layout'

const SCALE = 18      // pixels per meter
const MARGIN = 70     // outer margin
const EW = 0.20       // exterior wall thickness (m)
const IW = 0.15       // interior wall thickness (m)

// Hatch fill for concrete walls
const WALL_FILL = '#c8c0b4'
const WALL_STROKE = '#444'
const ROOM_FILLS = {
  garagem:      '#f0eff0',
  sala:         '#eef6fb',
  sala_jantar:  '#eef6fb',
  cozinha:      '#fdfae8',
  area_servico: '#edfaed',
  quarto_casal: '#fdf0ec',
  quarto:       '#fdf4f1',
  banheiro:     '#e8f4fd',
  escritorio:   '#eef5ee',
  corredor:     '#f8f8f8',
}

function px(v) { return v * SCALE }

function DimLine({ x1, y1, x2, y2, value, outside = 'top', offset = 22 }) {
  const isH = Math.abs(y2 - y1) < 1
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const tx = isH ? mx : x1 - offset + 12
  const ty = isH ? y1 - offset + 12 : my

  return (
    <g>
      <line x1={x1} y1={isH ? y1 - offset : y1} x2={x2} y2={isH ? y2 - offset : y2}
        stroke="#444" strokeWidth="0.8" />
      <line x1={x1} y1={isH ? y1 - offset - 4 : y1} x2={x1} y2={isH ? y1 - offset + 4 : y1}
        stroke="#444" strokeWidth="0.8" />
      <line x1={x2} y1={isH ? y2 - offset - 4 : y2} x2={x2} y2={isH ? y2 - offset + 4 : y2}
        stroke="#444" strokeWidth="0.8" />
      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#222" fontWeight="600">
        {value}
      </text>
    </g>
  )
}

function WallRect({ x, y, w, h, fill = WALL_FILL, stroke = WALL_STROKE }) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth="0.5" />
}

function Room({ room, svgX, svgY, svgW, svgH, fill, showArea = true }) {
  const fontSize = Math.max(8, Math.min(13, svgW / (room.label.length * 0.65)))
  const area = (room.w * room.d).toFixed(1)
  return (
    <g>
      <rect x={svgX} y={svgY} width={svgW} height={svgH} fill={fill} stroke="none" />
      <text x={svgX + svgW / 2} y={svgY + svgH / 2 - (showArea ? 7 : 0)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={fontSize} fontFamily="Inter, sans-serif" fontWeight="700" fill="#333">
        {room.label}
      </text>
      {showArea && (
        <text x={svgX + svgW / 2} y={svgY + svgH / 2 + 9}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontFamily="Inter, sans-serif" fill="#777">
          {area} m²
        </text>
      )}
    </g>
  )
}

// Draw a door arc in a wall opening
function DoorArc({ x, y, size, direction = 'right', wallSide = 'top' }) {
  const s = size * SCALE
  let path, line
  if (wallSide === 'top') {
    if (direction === 'right') {
      path = `M ${x} ${y} L ${x} ${y + s} A ${s} ${s} 0 0 0 ${x + s} ${y} Z`
      line = `M ${x} ${y} L ${x + s} ${y}`
    } else {
      path = `M ${x + s} ${y} L ${x + s} ${y + s} A ${s} ${s} 0 0 1 ${x} ${y} Z`
      line = `M ${x} ${y} L ${x + s} ${y}`
    }
  } else {
    path = `M ${x} ${y} L ${x + s} ${y} A ${s} ${s} 0 0 0 ${x} ${y - s} Z`
    line = `M ${x} ${y} L ${x} ${y - s}`
  }
  return (
    <g>
      <path d={path} fill="rgba(200,220,255,0.25)" stroke="#888" strokeWidth="0.6" strokeDasharray="3 2" />
    </g>
  )
}

// Window symbol: 3 parallel lines across wall thickness
function WindowSymbol({ x, y, width, wallThickness, horizontal = true }) {
  const wt = wallThickness * SCALE
  const ww = width * SCALE
  if (horizontal) {
    return (
      <g>
        <rect x={x} y={y} width={ww} height={wt} fill="white" stroke="none" />
        <line x1={x} y1={y} x2={x + ww} y2={y} stroke="#333" strokeWidth="0.8" />
        <line x1={x} y1={y + wt / 3} x2={x + ww} y2={y + wt / 3} stroke="#333" strokeWidth="0.6" />
        <line x1={x} y1={y + wt * 2 / 3} x2={x + ww} y2={y + wt * 2 / 3} stroke="#333" strokeWidth="0.6" />
        <line x1={x} y1={y + wt} x2={x + ww} y2={y + wt} stroke="#333" strokeWidth="0.8" />
      </g>
    )
  } else {
    return (
      <g>
        <rect x={x} y={y} width={wt} height={ww} fill="white" stroke="none" />
        <line x1={x} y1={y} x2={x} y2={y + ww} stroke="#333" strokeWidth="0.8" />
        <line x1={x + wt / 3} y1={y} x2={x + wt / 3} y2={y + ww} stroke="#333" strokeWidth="0.6" />
        <line x1={x + wt * 2 / 3} y1={y} x2={x + wt * 2 / 3} y2={y + ww} stroke="#333" strokeWidth="0.6" />
        <line x1={x + wt} y1={y} x2={x + wt} y2={y + ww} stroke="#333" strokeWidth="0.8" />
      </g>
    )
  }
}

export default function FloorPlan({ data }) {
  const layout = generateLayout(data)
  const { rooms, bw, bd, totalArea, numFloors } = layout
  const { recuo_frontal, recuo_lateral, recuo_fundos } = layout.recuos || data.premissas

  // SVG canvas size
  const svgW = px(bw) + MARGIN * 2 + 40
  const svgH = px(bd) + MARGIN * 2 + 90

  // Building origin in SVG
  const ox = MARGIN
  const oy = MARGIN

  // Map room to SVG coordinates (with wall offset on each side)
  const toSvg = (v) => v * SCALE

  return (
    <div className="floorplan-container">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: 'block', background: '#fafafa', maxWidth: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="wallHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#999" strokeWidth="0.7" />
          </pattern>
          <pattern id="terrainDash" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M0,0 L8,8" stroke="#ccc" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* ── Terrain outline (dashed) */}
        <rect
          x={ox - toSvg(recuo_lateral)}
          y={oy - toSvg(recuo_frontal)}
          width={toSvg(bw + 2 * recuo_lateral)}
          height={toSvg(bd + recuo_frontal + recuo_fundos)}
          fill="none"
          stroke="#bbb"
          strokeWidth="1.2"
          strokeDasharray="7 4"
        />

        {/* ── Street label */}
        <rect
          x={ox - toSvg(recuo_lateral)}
          y={oy - toSvg(recuo_frontal) - 18}
          width={toSvg(bw + 2 * recuo_lateral)}
          height={15}
          fill="#e8e8e8"
          stroke="#bbb"
          strokeWidth="0.5"
        />
        <text
          x={ox - toSvg(recuo_lateral) + toSvg(bw + 2 * recuo_lateral) / 2}
          y={oy - toSvg(recuo_frontal) - 8}
          textAnchor="middle"
          fontSize="8"
          fontFamily="Inter, sans-serif"
          fill="#888"
          letterSpacing="2"
        >VIA PÚBLICA</text>

        {/* ── Building background */}
        <rect
          x={ox} y={oy}
          width={toSvg(bw)} height={toSvg(bd)}
          fill="#f5f3f0"
          stroke={WALL_STROKE}
          strokeWidth="0.5"
        />

        {/* ── Rooms (fill first, then walls on top) */}
        {rooms.map(room => {
          const rx = ox + toSvg(room.x) + toSvg(IW / 2)
          const ry = oy + toSvg(room.y) + toSvg(IW / 2)
          const rw = toSvg(room.w) - toSvg(IW)
          const rh = toSvg(room.d) - toSvg(IW)
          const fill = ROOM_FILLS[room.id.replace(/_\d+$/, '')] || '#f8f6f2'
          return (
            <Room
              key={room.id}
              room={room}
              svgX={rx} svgY={ry} svgW={rw} svgH={rh}
              fill={fill}
              showArea={rw > 50 && rh > 35}
            />
          )
        })}

        {/* ── EXTERIOR WALLS — drawn as filled bands around building */}
        {/* Top wall */}
        <WallRect x={ox} y={oy} w={toSvg(bw)} h={toSvg(EW)} />
        {/* Bottom wall */}
        <WallRect x={ox} y={oy + toSvg(bd) - toSvg(EW)} w={toSvg(bw)} h={toSvg(EW)} />
        {/* Left wall */}
        <WallRect x={ox} y={oy} w={toSvg(EW)} h={toSvg(bd)} />
        {/* Right wall */}
        <WallRect x={ox + toSvg(bw) - toSvg(EW)} y={oy} w={toSvg(EW)} h={toSvg(bd)} />

        {/* ── INTERIOR WALLS — vertical and horizontal room dividers */}
        {rooms.map((room, i) => {
          if (i === 0) return null
          const lines = []
          // Right edge becomes a wall if there's another room next to it
          const hasRightNeighbor = rooms.some(r2 => Math.abs(r2.x - (room.x + room.w)) < 0.1 && r2.y < room.y + room.d && r2.y + r2.d > room.y)
          const hasBottomNeighbor = rooms.some(r2 => Math.abs(r2.y - (room.y + room.d)) < 0.1 && r2.x < room.x + room.w && r2.x + r2.w > room.x)

          if (hasRightNeighbor) {
            lines.push(
              <WallRect
                key={`${room.id}_r`}
                x={ox + toSvg(room.x + room.w) - toSvg(IW / 2)}
                y={oy + toSvg(room.y)}
                w={toSvg(IW)}
                h={toSvg(room.d)}
              />
            )
          }
          if (hasBottomNeighbor) {
            lines.push(
              <WallRect
                key={`${room.id}_b`}
                x={ox + toSvg(room.x)}
                y={oy + toSvg(room.y + room.d) - toSvg(IW / 2)}
                w={toSvg(room.w)}
                h={toSvg(IW)}
              />
            )
          }
          return lines
        })}

        {/* ── WINDOWS on exterior walls */}
        {/* Front wall windows */}
        <WindowSymbol
          x={ox + toSvg(bw * 0.55)}
          y={oy}
          width={Math.min(bw * 0.25, 1.5)}
          wallThickness={EW}
          horizontal
        />
        {/* Back wall windows — one per bedroom */}
        {Array.from({ length: data.programa.quartos }, (_, i) => {
          const segW = bw / data.programa.quartos
          return (
            <WindowSymbol
              key={i}
              x={ox + toSvg(i * segW + segW * 0.25)}
              y={oy + toSvg(bd) - toSvg(EW)}
              width={Math.min(segW * 0.5, 1.2)}
              wallThickness={EW}
              horizontal
            />
          )
        })}
        {/* Left wall window */}
        <WindowSymbol
          x={ox}
          y={oy + toSvg(bd * 0.25)}
          width={Math.min(bd * 0.15, 1.2)}
          wallThickness={EW}
          horizontal={false}
        />
        {/* Right wall window */}
        <WindowSymbol
          x={ox + toSvg(bw) - toSvg(EW)}
          y={oy + toSvg(bd * 0.5)}
          width={Math.min(bd * 0.15, 1.0)}
          wallThickness={EW}
          horizontal={false}
        />

        {/* ── DOOR arcs */}
        {/* Front entry door */}
        <DoorArc
          x={ox + toSvg(bw * 0.62) + toSvg(EW)}
          y={oy + toSvg(EW)}
          size={0.9}
          direction="right"
          wallSide="top"
        />
        {/* Bedroom doors */}
        {Array.from({ length: Math.min(data.programa.quartos, 3) }, (_, i) => {
          const segW = bw / data.programa.quartos
          return (
            <DoorArc
              key={i}
              x={ox + toSvg(i * segW + segW * 0.1)}
              y={oy + toSvg(bd - IW * 2)}
              size={0.8}
              direction="right"
              wallSide="bottom"
            />
          )
        })}

        {/* ── ROOM DIMENSION LINES (inside rooms) */}
        {rooms.filter(r => toSvg(r.w) > 55 && toSvg(r.d) > 35).map(room => (
          <g key={`dim_${room.id}`}>
            {/* width dim */}
            <line
              x1={ox + toSvg(room.x + IW / 2) + 2}
              y1={oy + toSvg(room.y + room.d - IW / 2) - 8}
              x2={ox + toSvg(room.x + room.w - IW / 2) - 2}
              y2={oy + toSvg(room.y + room.d - IW / 2) - 8}
              stroke="#bbb" strokeWidth="0.7"
            />
            <text
              x={ox + toSvg(room.x + room.w / 2)}
              y={oy + toSvg(room.y + room.d - IW / 2) - 13}
              textAnchor="middle"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              fill="#aaa"
            >
              {room.w.toFixed(2)}m
            </text>
          </g>
        ))}

        {/* ── OUTER DIMENSION LINES */}
        {/* Width */}
        <DimLine
          x1={ox} y1={oy} x2={ox + toSvg(bw)} y2={oy}
          value={`${bw.toFixed(2)} m`}
          offset={28}
        />
        {/* Depth (right side) */}
        <g>
          <line x1={ox + toSvg(bw) + 24} y1={oy} x2={ox + toSvg(bw) + 24} y2={oy + toSvg(bd)}
            stroke="#444" strokeWidth="0.8" />
          <line x1={ox + toSvg(bw) + 19} y1={oy} x2={ox + toSvg(bw) + 29} y2={oy}
            stroke="#444" strokeWidth="0.8" />
          <line x1={ox + toSvg(bw) + 19} y1={oy + toSvg(bd)} x2={ox + toSvg(bw) + 29} y2={oy + toSvg(bd)}
            stroke="#444" strokeWidth="0.8" />
          <text
            x={ox + toSvg(bw) + 38}
            y={oy + toSvg(bd) / 2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#222" fontWeight="600"
            transform={`rotate(90, ${ox + toSvg(bw) + 38}, ${oy + toSvg(bd) / 2})`}
          >
            {bd.toFixed(2)} m
          </text>
        </g>

        {/* ── Recuo labels */}
        <text
          x={ox + toSvg(bw) / 2}
          y={oy - toSvg(recuo_frontal) + toSvg(recuo_frontal) / 2}
          textAnchor="middle" fontSize="8" fontFamily="Inter" fill="#bbb"
        >
          recuo frontal {recuo_frontal}m
        </text>

        {/* ── NORTH ARROW */}
        <g transform={`translate(${svgW - 44}, ${MARGIN - 10})`}>
          <circle cx={0} cy={0} r={15} fill="white" stroke="#555" strokeWidth="1" />
          <polygon points="0,-12 3.5,4 0,1 -3.5,4" fill="#222" />
          <polygon points="0,12 3.5,-4 0,-1 -3.5,-4" fill="#bbb" />
          <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Inter" fontWeight="800" fill="#333">N</text>
        </g>

        {/* ── SCALE BAR */}
        <g transform={`translate(${ox}, ${oy + toSvg(bd) + 18})`}>
          <rect x={0} y={0} width={toSvg(1)} height={5} fill="#333" />
          <rect x={toSvg(1)} y={0} width={toSvg(1)} height={5} fill="white" stroke="#333" strokeWidth="0.5" />
          <rect x={toSvg(2)} y={0} width={toSvg(1)} height={5} fill="#333" />
          <text x={0} y={14} fontSize="8" fontFamily="Inter" fill="#555">0</text>
          <text x={toSvg(1)} y={14} textAnchor="middle" fontSize="8" fontFamily="Inter" fill="#555">1m</text>
          <text x={toSvg(3)} y={14} textAnchor="middle" fontSize="8" fontFamily="Inter" fill="#555">3m</text>
          <text x={toSvg(3) + 8} y={14} fontSize="8" fontFamily="Inter" fill="#aaa">escala aprox.</text>
        </g>

        {/* ── TITLE BLOCK */}
        <rect
          x={ox}
          y={oy + toSvg(bd) + 36}
          width={toSvg(bw)}
          height={48}
          fill="#f0eeeb"
          stroke="#ccc"
          strokeWidth="0.8"
        />
        <line x1={ox} y1={oy + toSvg(bd) + 52} x2={ox + toSvg(bw)} y2={oy + toSvg(bd) + 52} stroke="#ccc" strokeWidth="0.5" />
        <text x={ox + 8} y={oy + toSvg(bd) + 48} fontSize="10" fontFamily="Inter" fontWeight="800" fill="#222">INSTITUTO CHUI CALONEGO — Planta Baixa Esquemática — Pavimento Térreo</text>
        <text x={ox + 8} y={oy + toSvg(bd) + 62} fontSize="8.5" fontFamily="Inter" fill="#555">
          {`${data.cidade || '—'}/${data.estado || '—'} · ${data.tipo_projeto || 'Construção'} · Terreno ${data.terreno.frente}×${data.terreno.profundidade}m · Área projetada ≈${totalArea.toFixed(0)}m² · ${numFloors} pav.`}
        </text>
        <text x={ox + toSvg(bw) - 8} y={oy + toSvg(bd) + 62} textAnchor="end" fontSize="8" fontFamily="JetBrains Mono" fill="#999">
          {`Rev.01 · ${new Date().toLocaleDateString('pt-BR')}`}
        </text>
        <text x={ox + 8} y={oy + toSvg(bd) + 76} fontSize="7.5" fontFamily="Inter" fill="#aaa">
          Planta de referência — não substitui projeto executivo assinado por profissional habilitado CREA/CAU
        </text>

        {/* ── Building outline (top layer — crisp border) */}
        <rect
          x={ox} y={oy}
          width={toSvg(bw)} height={toSvg(bd)}
          fill="none"
          stroke="#222"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  )
}
