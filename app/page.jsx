'use client'
import { useState, lazy, Suspense } from 'react'
import Chat from '@/components/Chat'
import Renders from '@/components/Renders'

const FloorPlan = lazy(() => import('@/components/FloorPlan'))
const Viewer3D  = lazy(() => import('@/components/Viewer3D'))

const TABS = [
  { key: 'dados',    label: '📋 Dados'    },
  { key: 'planta',   label: '📐 Planta'   },
  { key: '3d',       label: '🏠 3D'       },
  { key: 'renders',  label: '🎨 Renders'  },
]

function DataPanel({ d }) {
  if (!d) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text2)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
      <div style={{ fontSize: 14, color: 'var(--text)' }}>Dados do projeto</div>
      <div style={{ fontSize: 12, marginTop: 6 }}>Aparecem aqui conforme você conversa com o Instituto</div>
    </div>
  )

  const row = (label, value) => value != null && value !== '' && value !== 0 ? (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
      <span style={{ color:'var(--text2)' }}>{label}</span>
      <span style={{ color:'var(--text)', fontWeight:500, textAlign:'right', maxWidth:'58%' }}>{String(value)}</span>
    </div>
  ) : null

  const section = (title, children) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize:10, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{title}</div>
      {children}
    </div>
  )

  const t = d.terreno || {}
  const p = d.programa || {}
  const f = d.financeiro || {}
  const pr = d.premissas || {}
  const g = d.gates || {}

  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>
      {section('Local', <>
        {row('Cidade/Estado', d.cidade && d.estado ? `${d.cidade} / ${d.estado}` : null)}
        {row('Terreno', t.frente && t.profundidade ? `${t.frente}×${t.profundidade}m = ${(t.frente*t.profundidade).toFixed(0)}m²` : null)}
        {row('Topografia', t.topografia)}
        {row('Orientação solar', d.orientacao_solar)}
        {row('Esgoto', d.esgoto === 'rede_publica' ? 'Rede pública' : d.esgoto === 'fossa' ? 'Fossa séptica' : null)}
        {row('Água', d.agua === 'rede_publica' ? 'Rede pública' : d.agua === 'poco' ? 'Poço' : null)}
        {row('Sondagem SPT', d.sondagem_feita != null ? (d.sondagem_feita ? 'Realizada' : 'Não realizada') : null)}
      </>)}

      {section('Programa', <>
        {row('Tipo', d.tipo_projeto && d.finalidade ? `${d.tipo_projeto} · ${d.finalidade}` : null)}
        {row('Quartos', p.quartos ? `${p.quartos} (${p.suites || 0} suíte(s))` : null)}
        {row('Banheiros', p.banheiros || null)}
        {row('Garagem', p.vagas ? `${p.vagas} vaga(s)${p.garagem_coberta ? ' coberta(s)' : ''}` : null)}
        {row('Cozinha', p.sala_tipo === 'aberta' ? 'Americana' : p.sala_tipo === 'fechada' ? 'Fechada' : null)}
        {row('Área de serviço', p.area_servico)}
        {row('Moradores', p.num_moradores || null)}
        {p.churrasqueira && row('Extras', [p.churrasqueira&&'Churrasqueira', p.piscina&&'Piscina', p.edicula&&'Edícula', p.escritorio&&'Escritório'].filter(Boolean).join(', '))}
      </>)}

      {(f.orcamento > 0) && section('Financeiro', <>
        {row('Orçamento', `R$ ${Number(f.orcamento).toLocaleString('pt-BR')}`)}
        {row('Padrão', { economico:'Econômico', medio:'Médio', alto:'Alto' }[f.padrao] || f.padrao)}
        {row('Executor', f.executor === 'mestre' ? 'Mestre de obras' : f.executor === 'construtora' ? 'Construtora' : null)}
      </>)}

      {(pr.recuo_frontal) && section('Premissas (verificar na prefeitura)', <>
        {row('Recuo frontal', `${pr.recuo_frontal}m`)}
        {row('Recuo lateral', `${pr.recuo_lateral}m`)}
        {row('Recuo fundos', `${pr.recuo_fundos}m`)}
      </>)}

      {section('Gates de viabilidade', (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {[['g0','Dados mínimos'],['g1','Programa no terreno'],['g2','Orçamento'],['g3','Vãos'],['g4','Checklists']].map(([k,l]) => (
            <span key={k} style={{
              padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500,
              border:`1px solid ${g[k] ? 'var(--success)' : 'var(--border)'}`,
              color: g[k] ? 'var(--success)' : 'var(--text2)',
              background: g[k] ? 'rgba(63,185,80,0.08)' : 'transparent',
            }}>
              {g[k] ? '✓' : '○'} {l}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [projectData, setProjectData] = useState(null)
  const [tab, setTab] = useState('dados')

  const hasTerreno = projectData?.terreno?.frente > 0

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>

      {/* Header */}
      <header style={{
        height: 52,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 6, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:'#0d1117', flexShrink:0 }}>IC</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--accent)', letterSpacing:'0.04em', lineHeight:1.2 }}>INSTITUTO CHUI CALONEGO</div>
          <div style={{ fontSize:10, color:'var(--text2)', letterSpacing:'0.03em' }}>Engenharia Civil e Arquitetura · Sistema Especialista IA</div>
        </div>
        {projectData?.pronto_para_render && (
          <div style={{ marginLeft:'auto', padding:'4px 12px', background:'rgba(63,185,80,0.12)', border:'1px solid var(--success)', borderRadius:20, fontSize:11, color:'var(--success)' }}>
            ✓ Dados completos
          </div>
        )}
      </header>

      {/* Main split layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* Left — Chat (fixed) */}
        <div style={{
          width: '42%',
          minWidth: 320,
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <Chat onDataUpdate={setProjectData} />
        </div>

        {/* Right — Panel */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            flexShrink: 0,
            paddingLeft: 8,
          }}>
            {TABS.map(t2 => (
              <button key={t2.key} className={`tab-btn ${tab === t2.key ? 'active' : ''}`} onClick={() => setTab(t2.key)}>
                {t2.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex:1, overflow:'auto', padding: tab === '3d' || tab === 'renders' ? '16px' : '0' }}>

            {tab === 'dados' && <DataPanel d={projectData} />}

            {tab === 'planta' && (
              <div style={{ padding: 16 }}>
                {hasTerreno
                  ? <Suspense fallback={<div style={{padding:32,textAlign:'center',color:'var(--text2)'}}>Carregando planta...</div>}>
                      <FloorPlan data={projectData} />
                    </Suspense>
                  : <div style={{padding:48,textAlign:'center',color:'var(--text2)'}}>
                      <div style={{fontSize:36,marginBottom:12}}>📐</div>
                      <div>Informe as dimensões do terreno na conversa para gerar a planta.</div>
                    </div>
                }
              </div>
            )}

            {tab === '3d' && (
              hasTerreno
                ? <Suspense fallback={<div style={{padding:32,textAlign:'center',color:'var(--text2)'}}>Carregando viewer 3D...</div>}>
                    <Viewer3D data={projectData} />
                  </Suspense>
                : <div style={{padding:48,textAlign:'center',color:'var(--text2)'}}>
                    <div style={{fontSize:36,marginBottom:12}}>🏠</div>
                    <div>Informe as dimensões do terreno na conversa para gerar o modelo 3D.</div>
                  </div>
            )}

            {tab === 'renders' && <Renders projectData={projectData} />}
          </div>
        </div>
      </div>
    </div>
  )
}
