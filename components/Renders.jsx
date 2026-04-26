'use client'
import { useState } from 'react'

const ANGLES = [
  { key: 'perspective', label: 'Perspectiva', icon: '🏠' },
  { key: 'frontal',     label: 'Frontal',     icon: '🏛' },
  { key: 'lateral',     label: 'Lateral',     icon: '📐' },
  { key: 'interior',    label: 'Interior',    icon: '🛋' },
  { key: 'noturno',     label: 'Noturno',     icon: '🌙' },
  { key: 'aerea',       label: 'Aérea',       icon: '🛸' },
]

export default function Renders({ projectData }) {
  const [renders, setRenders] = useState({})
  const [loading, setLoading] = useState({})
  const [errors, setErrors]   = useState({})
  const [selected, setSelected] = useState('perspective')

  const ready = projectData?.pronto_para_render || (
    projectData?.cidade &&
    (projectData?.terreno?.frente > 0) &&
    (projectData?.financeiro?.orcamento > 0)
  )

  async function generate(angle) {
    if (loading[angle]) return
    setLoading(p => ({ ...p, [angle]: true }))
    setErrors(p => ({ ...p, [angle]: null }))

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData, angle }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setRenders(p => ({ ...p, [angle]: json.url }))
    } catch (e) {
      setErrors(p => ({ ...p, [angle]: e.message }))
    } finally {
      setLoading(p => ({ ...p, [angle]: false }))
    }
  }

  async function generateAll() {
    for (const a of ANGLES) {
      if (!renders[a.key]) await generate(a.key)
    }
  }

  if (!ready) return (
    <div style={{ textAlign: 'center', padding: 48, color: '#8b949e' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', marginBottom: 8 }}>Renders DALL-E 3</div>
      <div style={{ fontSize: 13, maxWidth: 340, margin: '0 auto' }}>
        Conclua a entrevista com o Instituto — após coletar localização, terreno e orçamento, os renders serão liberados.
      </div>
    </div>
  )

  const current = renders[selected]
  const currentLoading = loading[selected]
  const currentError = errors[selected]

  return (
    <div>
      {/* Angle selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {ANGLES.map(a => (
          <button
            key={a.key}
            onClick={() => setSelected(a.key)}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              border: `1px solid ${selected === a.key ? '#e8a44a' : '#30363d'}`,
              background: selected === a.key ? 'rgba(232,164,74,0.12)' : '#1c2128',
              color: selected === a.key ? '#e8a44a' : '#8b949e',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all .15s',
            }}
          >
            {a.icon} {a.label}
            {renders[a.key] && <span style={{ color: '#3fb950', fontSize: 10 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Main render area */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        background: '#0d1117',
        borderRadius: 10,
        border: '1px solid #30363d',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
      }}>
        {current && (
          <img src={current} alt={`Render ${selected}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {currentLoading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,17,23,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ fontSize: 32, animation: 'spin 2s linear infinite' }}>⚙</div>
            <div style={{ color: '#e8a44a', fontSize: 14, fontWeight: 600 }}>Gerando render...</div>
            <div style={{ color: '#8b949e', fontSize: 12 }}>DALL-E 3 · pode levar até 30s</div>
          </div>
        )}
        {!current && !currentLoading && (
          <div style={{ textAlign: 'center', color: '#8b949e' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {ANGLES.find(a => a.key === selected)?.icon}
            </div>
            <div style={{ fontSize: 13 }}>
              {currentError
                ? <span style={{ color: '#f85149' }}>Erro: {currentError}<br />Tente novamente.</span>
                : 'Clique em Gerar para criar este render'}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => generate(selected)}
          disabled={currentLoading}
          style={{
            flex: 1,
            padding: '10px 0',
            background: currentLoading ? '#30363d' : '#e8a44a',
            color: currentLoading ? '#8b949e' : '#0d1117',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: currentLoading ? 'not-allowed' : 'pointer',
            transition: 'all .15s',
          }}
        >
          {currentLoading ? '⚙ Gerando...' : renders[selected] ? '↺ Regerar' : '✦ Gerar render'}
        </button>

        <button
          onClick={generateAll}
          disabled={Object.values(loading).some(Boolean)}
          style={{
            padding: '10px 16px',
            background: '#1c2128',
            color: '#8b949e',
            border: '1px solid #30363d',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all .15s',
            whiteSpace: 'nowrap',
          }}
        >
          Gerar todos (6)
        </button>
      </div>

      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 8, textAlign: 'center' }}>
        Imagens geradas por DALL-E 3 · URLs expiram em 1h · Salve as que quiser
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
