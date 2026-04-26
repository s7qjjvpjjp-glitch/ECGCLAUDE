import React, { useState, useEffect } from 'react'
import { checkGates, generateConditionalAlerts, estimateArea, estimateCost } from '../engine/project'
import { CUB_REFERENCE } from '../data/reference'

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt.value} className={`radio-option ${value === opt.value ? 'selected' : ''}`}>
          <input type="radio" value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

function NumberInput({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="number-input-row">
      <button className="num-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span className="num-val">{value}</span>
      <button className="num-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  )
}

function AlertBox({ alerts }) {
  if (!alerts.length) return null
  return (
    <div style={{ marginTop: 16 }}>
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.type}`}>
          <span className="alert-icon">{a.type === 'error' ? '🚫' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>{a.msg}</span>
        </div>
      ))}
    </div>
  )
}

export default function Interview({ data, onChange, onComplete }) {
  const [step, setStep] = useState(1)
  const [localAlerts, setLocalAlerts] = useState([])

  useEffect(() => {
    const cond = generateConditionalAlerts(data)
    const { alerts: gateAlerts } = checkGates(data)
    setLocalAlerts([...cond, ...gateAlerts])
  }, [data])

  const set = (path, value) => {
    const parts = path.split('.')
    const next = JSON.parse(JSON.stringify(data))
    let obj = next
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]]
    obj[parts[parts.length - 1]] = value
    onChange(next)
  }

  const visibleAlerts = localAlerts.filter(a => {
    if (step === 1) return ['finalidade', 'tipo_projeto', 'terreno'].some(k => a.msg.toLowerCase().includes(k) || a.gate === undefined)
    return true
  }).slice(0, 5)

  const steps = [
    { n: 1, label: 'O que você precisa' },
    { n: 2, label: 'Terreno' },
    { n: 3, label: 'Programa' },
    { n: 4, label: 'Orçamento' },
    { n: 5, label: 'Confirmação' },
  ]

  const canAdvance = () => {
    if (step === 1) return data.tipo_projeto && data.finalidade && data.cidade && data.estado
    if (step === 2) return data.terreno.frente > 0 && data.terreno.profundidade > 0
    if (step === 3) return data.programa.quartos >= 0
    if (step === 4) {
      const { alerts: gAlerts } = checkGates(data)
      const hardBlock = gAlerts.find(a => a.type === 'error' && a.gate === 2)
      return data.financeiro.orcamento > 0 && !hardBlock
    }
    return true
  }

  const areaEst = estimateArea(data.programa)
  const custoEst = data.financeiro.padrao ? estimateCost(areaEst, data.financeiro.padrao) : 0

  return (
    <div>
      {/* Progress */}
      <div className="progress-bar">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={`step-item ${step === s.n ? 'active' : step > s.n ? 'done' : ''}`}>
              <div className="step-num">{step > s.n ? '✓' : s.n}</div>
              <span style={{ display: window.innerWidth < 600 ? 'none' : 'block' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="step-connector" />}
          </React.Fragment>
        ))}
      </div>

      {/* Round 1 */}
      {step === 1 && (
        <div className="card">
          <div className="card-title">Rodada 1 — O que você precisa?</div>
          <div className="card-persona">Arquiteta · Entrevista inicial</div>

          <div className="form-group">
            <label className="form-label">Tipo de serviço <span className="req">*</span></label>
            <RadioGroup
              value={data.tipo_projeto}
              onChange={v => set('tipo_projeto', v)}
              options={[
                { value: 'construcao', label: 'Construção nova' },
                { value: 'reforma', label: 'Reforma' },
                { value: 'regularizacao', label: 'Regularização' },
                { value: 'laudo', label: 'Laudo técnico' },
              ]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Finalidade <span className="req">*</span></label>
            <RadioGroup
              value={data.finalidade}
              onChange={v => set('finalidade', v)}
              options={[
                { value: 'morar', label: 'Morar' },
                { value: 'alugar', label: 'Alugar' },
                { value: 'vender', label: 'Vender' },
                { value: 'comercial', label: 'Uso comercial' },
                { value: 'misto', label: 'Misto' },
              ]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Já tem terreno?</label>
            <RadioGroup
              value={data.tem_terreno ? 'sim' : 'nao'}
              onChange={v => set('tem_terreno', v === 'sim')}
              options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Ainda não' }]}
            />
          </div>

          {data.tem_terreno && (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Cidade <span className="req">*</span></label>
                <input className="form-input" value={data.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Ex: São Paulo" />
              </div>
              <div className="form-group">
                <label className="form-label">Estado <span className="req">*</span></label>
                <select className="form-select" value={data.estado} onChange={e => set('estado', e.target.value)}>
                  <option value="">Selecione</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          <AlertBox alerts={[
            data.finalidade === 'vender' && { type: 'info', msg: 'Para venda: planta flexível vende melhor — quartos padrão, suíte, 2 vagas. Personalização excessiva reduz público comprador.' },
            data.tipo_projeto === 'reforma' && { type: 'warning', msg: 'Antes de derrubar qualquer parede, preciso confirmar se ela sustenta estrutura acima. Verificação obrigatória antes de qualquer projeto.' },
          ].filter(Boolean)} />
        </div>
      )}

      {/* Round 2 */}
      {step === 2 && (
        <div className="card">
          <div className="card-title">Rodada 2 — Dados do Terreno</div>
          <div className="card-persona">Engenheiro Civil · Verificação técnica do lote</div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Frente do terreno (m) <span className="req">*</span></label>
              <input className="form-input" type="number" min="0" step="0.5" value={data.terreno.frente || ''} onChange={e => set('terreno.frente', parseFloat(e.target.value) || 0)} placeholder="Ex: 12" />
            </div>
            <div className="form-group">
              <label className="form-label">Profundidade (m) <span className="req">*</span></label>
              <input className="form-input" type="number" min="0" step="0.5" value={data.terreno.profundidade || ''} onChange={e => set('terreno.profundidade', parseFloat(e.target.value) || 0)} placeholder="Ex: 30" />
            </div>
          </div>

          {data.terreno.frente > 0 && data.terreno.profundidade > 0 && (
            <div className="alert alert-info" style={{ marginBottom: 12 }}>
              <span className="alert-icon">📐</span>
              <span>Área total: {(data.terreno.frente * data.terreno.profundidade).toFixed(0)}m² · Área ocupável estimada (com recuos padrão): {Math.max(0, (data.terreno.frente - 3) * (data.terreno.profundidade - 8)).toFixed(0)}m²</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Topografia</label>
            <RadioGroup
              value={data.terreno.topografia}
              onChange={v => set('terreno.topografia', v)}
              options={[
                { value: 'plano', label: 'Plano' },
                { value: 'aclive', label: 'Aclive (sobe da rua)' },
                { value: 'declive', label: 'Declive (desce da rua)' },
              ]}
            />
          </div>

          {data.terreno.topografia !== 'plano' && (
            <div className="form-group">
              <label className="form-label">Desnível estimado (m)</label>
              <input className="form-input" type="number" min="0" step="0.5" value={data.terreno.desnivel || ''} onChange={e => set('terreno.desnivel', parseFloat(e.target.value) || 0)} placeholder="Ex: 1.5" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Orientação solar — o sol da manhã bate onde?</label>
            <RadioGroup
              value={data.orientacao_solar}
              onChange={v => set('orientacao_solar', v)}
              options={[
                { value: 'N', label: 'Frente' }, { value: 'S', label: 'Fundos' },
                { value: 'L', label: 'Lateral esq.' }, { value: 'O', label: 'Lateral dir.' },
                { value: 'NL', label: 'Diagonal N/L' }, { value: 'NE', label: 'Diagonal N/O' },
              ]}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Rede de esgoto</label>
              <RadioGroup value={data.esgoto} onChange={v => set('esgoto', v)} options={[{ value: 'rede_publica', label: 'Rede pública' }, { value: 'fossa', label: 'Fossa séptica' }]} />
            </div>
            <div className="form-group">
              <label className="form-label">Abastecimento de água</label>
              <RadioGroup value={data.agua} onChange={v => set('agua', v)} options={[{ value: 'rede_publica', label: 'Rede pública' }, { value: 'poco', label: 'Poço' }]} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sondagem SPT já realizada?</label>
            <RadioGroup
              value={data.sondagem_feita ? 'sim' : 'nao'}
              onChange={v => set('sondagem_feita', v === 'sim')}
              options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Ainda não' }]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Árvores grandes, construções existentes ou elementos relevantes</label>
            <input className="form-input" value={data.arvores_existentes} onChange={e => set('arvores_existentes', e.target.value)} placeholder="Ex: 1 mangueira grande nos fundos, muro de pedra na lateral direita" />
          </div>

          <AlertBox alerts={localAlerts.filter(a => a.msg.includes('ipo') || a.msg.includes('SPT') || a.msg.includes('fossa') || a.msg.includes('oeste') || a.msg.includes('frente') || a.msg.includes('estreita') || a.msg.includes('declive') || a.msg.includes('sondagem') || a.msg.includes('Sondagem'))} />
        </div>
      )}

      {/* Round 3 */}
      {step === 3 && (
        <div className="card">
          <div className="card-title">Rodada 3 — Programa de Necessidades</div>
          <div className="card-persona">Arquiteta · O que vai dentro da casa</div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Quartos</label>
              <NumberInput value={data.programa.quartos} onChange={v => set('programa.quartos', v)} min={0} max={8} />
            </div>
            <div className="form-group">
              <label className="form-label">Desses, quantos são suítes</label>
              <NumberInput value={data.programa.suites} onChange={v => set('programa.suites', Math.min(v, data.programa.quartos))} min={0} max={data.programa.quartos} />
            </div>
            <div className="form-group">
              <label className="form-label">Banheiros (total)</label>
              <NumberInput value={data.programa.banheiros} onChange={v => set('programa.banheiros', v)} min={1} max={8} />
            </div>
            <div className="form-group">
              <label className="form-label">Vagas de garagem</label>
              <NumberInput value={data.programa.vagas} onChange={v => set('programa.vagas', v)} min={0} max={4} />
            </div>
            <div className="form-group">
              <label className="form-label">Moradores</label>
              <NumberInput value={data.programa.num_moradores} onChange={v => set('programa.num_moradores', v)} min={1} max={12} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cozinha</label>
            <RadioGroup value={data.programa.sala_tipo} onChange={v => set('programa.sala_tipo', v)} options={[{ value: 'aberta', label: 'Americana (aberta)' }, { value: 'fechada', label: 'Fechada' }]} />
          </div>

          <div className="form-group">
            <label className="form-label">Área de serviço</label>
            <RadioGroup value={data.programa.area_servico} onChange={v => set('programa.area_servico', v)} options={[{ value: 'interna', label: 'Interna' }, { value: 'externa', label: 'Externa / coberta' }]} />
          </div>

          <div className="divider" />
          <div className="section-title">Itens adicionais</div>

          <div className="checkbox-group">
            {[
              { key: 'garagem_coberta', label: 'Garagem coberta' },
              { key: 'churrasqueira', label: 'Churrasqueira' },
              { key: 'piscina', label: 'Piscina' },
              { key: 'edicula', label: 'Edícula' },
              { key: 'escritorio', label: 'Escritório/Home Office' },
            ].map(item => (
              <label key={item.key} className={`checkbox-option ${data.programa[item.key] ? 'checked' : ''}`}>
                <input type="checkbox" checked={!!data.programa[item.key]} onChange={e => set(`programa.${item.key}`, e.target.checked)} style={{ display: 'none' }} />
                {data.programa[item.key] ? '✓' : '+'} {item.label}
              </label>
            ))}
          </div>

          {areaEst > 0 && (
            <div className="alert alert-info" style={{ marginTop: 16 }}>
              <span className="alert-icon">📊</span>
              <span>Área estimada do programa: <strong>≈{areaEst}m²</strong>. Isso é uma estimativa generosa — o projeto pode otimizar.</span>
            </div>
          )}

          <AlertBox alerts={localAlerts.filter(a => a.msg.includes('piscina') || a.msg.includes('churras') || a.msg.includes('americana') || a.msg.includes('pavimento') || a.msg.includes('Garagem'))} />
        </div>
      )}

      {/* Round 4 */}
      {step === 4 && (
        <div className="card">
          <div className="card-title">Rodada 4 — Orçamento e Padrão</div>
          <div className="card-persona">Engenheiro Civil · Viabilidade financeira</div>

          <div className="form-group">
            <label className="form-label">Orçamento disponível para construção (R$) <span className="req">*</span></label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="10000"
              value={data.financeiro.orcamento || ''}
              onChange={e => set('financeiro.orcamento', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 350000"
            />
            <div className="input-hint">Sem o valor do terreno</div>
          </div>

          <div className="form-group">
            <label className="form-label">Este orçamento inclui projetos e taxas?</label>
            <RadioGroup
              value={data.financeiro.inclui_projetos ? 'sim' : 'nao'}
              onChange={v => set('financeiro.inclui_projetos', v === 'sim')}
              options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não — é só construção' }]}
            />
            {!data.financeiro.inclui_projetos && <div className="input-hint">Projetos + taxas = normalmente 3-8% do custo total</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Padrão de acabamento</label>
            <RadioGroup
              value={data.financeiro.padrao}
              onChange={v => set('financeiro.padrao', v)}
              options={[
                { value: 'economico', label: 'Econômico (R$ 1.800–2.200/m²)' },
                { value: 'medio', label: 'Médio (R$ 2.200–2.800/m²)' },
                { value: 'alto', label: 'Alto (R$ 2.800–4.200/m²)' },
              ]}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Piso</label>
              <RadioGroup value={data.financeiro.piso_tipo} onChange={v => set('financeiro.piso_tipo', v)} options={[{ value: 'ceramico', label: 'Cerâmico' }, { value: 'porcelanato', label: 'Porcelanato' }]} />
            </div>
            <div className="form-group">
              <label className="form-label">Janelas</label>
              <RadioGroup value={data.financeiro.janela_tipo} onChange={v => set('financeiro.janela_tipo', v)} options={[{ value: 'aluminio_popular', label: 'Alumínio popular' }, { value: 'aluminio_premium', label: 'Alumínio premium' }, { value: 'madeira', label: 'Madeira' }]} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vai contratar</label>
            <RadioGroup value={data.financeiro.executor} onChange={v => set('financeiro.executor', v)} options={[{ value: 'mestre', label: 'Mestre de obras direto' }, { value: 'construtora', label: 'Construtora' }]} />
          </div>

          {data.financeiro.orcamento > 0 && custoEst > 0 && (
            <div className={`alert alert-${data.financeiro.orcamento >= custoEst ? 'success' : data.financeiro.orcamento >= custoEst * 0.8 ? 'warning' : 'error'}`} style={{ marginTop: 4 }}>
              <span className="alert-icon">{data.financeiro.orcamento >= custoEst ? '✅' : data.financeiro.orcamento >= custoEst * 0.8 ? '⚠️' : '🚫'}</span>
              <span>
                Custo estimado: <strong>R$ {custoEst.toLocaleString('pt-BR')}</strong> ({areaEst}m² × CUB {CUB_REFERENCE[data.financeiro.padrao].label}).
                {' '}Referência CUB — verificar valor atualizado no SINDUSCON/{data.estado || 'seu estado'}.
                {data.financeiro.orcamento < custoEst * 0.6 && <strong> Diferença crítica: realinhar programa ou padrão antes de continuar.</strong>}
                {data.financeiro.orcamento >= custoEst * 0.8 && data.financeiro.orcamento < custoEst && ' Margem pequena — reservar 10–15% para imprevistos.'}
                {data.financeiro.orcamento >= custoEst && ' Orçamento compatível com o programa.'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Round 5 */}
      {step === 5 && (
        <div className="card">
          <div className="card-title">Rodada 5 — Confirmação</div>
          <div className="card-persona">Instituto Chui Calonego · Revisão completa antes de gerar o projeto</div>

          <div className="summary-grid">
            <div className="summary-block">
              <h4>Local</h4>
              <div className="doc-item"><span className="doc-item-label">Cidade/Estado</span><span className="doc-item-value">{data.cidade}, {data.estado}</span></div>
              <div className="doc-item"><span className="doc-item-label">Terreno</span><span className="doc-item-value">{data.terreno.frente}×{data.terreno.profundidade}m ({(data.terreno.frente * data.terreno.profundidade).toFixed(0)}m²)</span></div>
              <div className="doc-item"><span className="doc-item-label">Topografia</span><span className="doc-item-value">{data.terreno.topografia}</span></div>
              <div className="doc-item"><span className="doc-item-label">Orientação</span><span className="doc-item-value">{data.orientacao_solar || 'Não informada'}</span></div>
              <div className="doc-item"><span className="doc-item-label">Esgoto</span><span className="doc-item-value">{data.esgoto === 'rede_publica' ? 'Rede pública' : 'Fossa séptica'}</span></div>
              <div className="doc-item"><span className="doc-item-label">Sondagem SPT</span><span className="doc-item-value">{data.sondagem_feita ? 'Realizada' : 'Não realizada'}</span></div>
            </div>

            <div className="summary-block">
              <h4>Programa</h4>
              <div className="doc-item"><span className="doc-item-label">Tipo</span><span className="doc-item-value">{data.tipo_projeto} · {data.finalidade}</span></div>
              <div className="doc-item"><span className="doc-item-label">Quartos</span><span className="doc-item-value">{data.programa.quartos} ({data.programa.suites} suíte(s))</span></div>
              <div className="doc-item"><span className="doc-item-label">Banheiros</span><span className="doc-item-value">{data.programa.banheiros}</span></div>
              <div className="doc-item"><span className="doc-item-label">Garagem</span><span className="doc-item-value">{data.programa.vagas} vaga(s){data.programa.garagem_coberta ? ' coberta(s)' : ''}</span></div>
              <div className="doc-item"><span className="doc-item-label">Cozinha</span><span className="doc-item-value">{data.programa.sala_tipo === 'aberta' ? 'Americana' : 'Fechada'}</span></div>
              <div className="doc-item"><span className="doc-item-label">Área estimada</span><span className="doc-item-value">≈{areaEst}m²</span></div>
            </div>

            <div className="summary-block">
              <h4>Financeiro</h4>
              <div className="doc-item"><span className="doc-item-label">Orçamento</span><span className="doc-item-value">R$ {data.financeiro.orcamento.toLocaleString('pt-BR')}</span></div>
              <div className="doc-item"><span className="doc-item-label">Padrão</span><span className="doc-item-value">{CUB_REFERENCE[data.financeiro.padrao]?.label || data.financeiro.padrao}</span></div>
              <div className="doc-item"><span className="doc-item-label">Custo estimado</span><span className="doc-item-value">R$ {custoEst.toLocaleString('pt-BR')}</span></div>
              <div className="doc-item"><span className="doc-item-label">Executor</span><span className="doc-item-value">{data.financeiro.executor === 'mestre' ? 'Mestre de obras' : 'Construtora'}</span></div>
            </div>

            <div className="summary-block">
              <h4>Premissas adotadas</h4>
              <div className="doc-item"><span className="doc-item-label">Recuo frontal</span><span className="doc-item-value">{data.premissas.recuo_frontal}m (verificar código de obras municipal)</span></div>
              <div className="doc-item"><span className="doc-item-label">Recuo lateral</span><span className="doc-item-value">{data.premissas.recuo_lateral}m</span></div>
              <div className="doc-item"><span className="doc-item-label">Recuo fundos</span><span className="doc-item-value">{data.premissas.recuo_fundos}m</span></div>
              <div className="doc-item"><span className="doc-item-label">CUB ref.</span><span className="doc-item-value">R$ {CUB_REFERENCE[data.financeiro.padrao] ? ((CUB_REFERENCE[data.financeiro.padrao].min + CUB_REFERENCE[data.financeiro.padrao].max) / 2).toFixed(0) : 2500}/m² (SINDUSCON — verificar vigente)</span></div>
            </div>
          </div>

          {/* Gate status */}
          <div style={{ marginTop: 20 }}>
            <div className="section-title">Gates de Viabilidade</div>
            <div className="gates-row">
              {[
                { key: 'g0', label: 'Dados mínimos' },
                { key: 'g1', label: 'Programa no terreno' },
                { key: 'g2', label: 'Orçamento viável' },
                { key: 'g3', label: 'Vãos estruturais' },
                { key: 'g4', label: 'Checklists' },
              ].map(g => {
                const { gates } = checkGates(data)
                return (
                  <div key={g.key} className={`gate-badge ${gates[g.key] ? 'pass' : 'fail'}`}>
                    {gates[g.key] ? '✓' : '○'} {g.label}
                  </div>
                )
              })}
            </div>
          </div>

          {localAlerts.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="section-title">Alertas emitidos neste projeto</div>
              <AlertBox alerts={localAlerts.slice(0, 8)} />
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="nav-footer">
        <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
          ← Voltar
        </button>
        <span style={{ color: 'var(--text2)', fontSize: 13 }}>Etapa {step} de 5</span>
        {step < 5 ? (
          <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>
            Próximo →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onComplete} disabled={!checkGates(data).gates.g0}>
            Gerar Projeto ✓
          </button>
        )}
      </div>
    </div>
  )
}
