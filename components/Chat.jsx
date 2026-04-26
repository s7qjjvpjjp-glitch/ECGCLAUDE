'use client'
import { useState, useRef, useEffect } from 'react'

function parseResponse(text) {
  const match = text.match(/\[DADOS\]([\s\S]*?)\[\/DADOS\]/)
  if (!match) return { display: text, data: null }
  try {
    const data = JSON.parse(match[1].trim())
    const display = text.replace(/\[DADOS\][\s\S]*?\[\/DADOS\]/, '').trim()
    return { display, data }
  } catch {
    return { display: text, data: null }
  }
}

// Comprime imagem para max 1024px e retorna base64 + mimeType
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1024
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(img.width  * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onload = e => {
          URL.revokeObjectURL(url)
          resolve({
            base64:   e.target.result.split(',')[1],
            mimeType: 'image/jpeg',
            preview:  e.target.result,
          })
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.82)
    }
    img.onerror = reject
    img.src = url
  })
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display:'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      {!isUser && (
        <div style={{
          width:32, height:32, borderRadius:'50%', background:'#e8a44a', color:'#0d1117',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:13, fontWeight:700, flexShrink:0, marginRight:10, marginTop:2,
        }}>IC</div>
      )}
      <div style={{ maxWidth:'78%', display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap:6 }}>
        {/* Imagem anexada */}
        {msg.image?.preview && (
          <div style={{ position:'relative' }}>
            <img
              src={msg.image.preview}
              alt="Foto enviada"
              style={{ maxWidth:220, maxHeight:160, borderRadius:8, border:'2px solid #e8a44a', objectFit:'cover', display:'block' }}
            />
            <div style={{ position:'absolute', bottom:4, left:4, background:'rgba(0,0,0,0.65)', color:'#e8a44a', fontSize:10, padding:'2px 7px', borderRadius:10, fontWeight:600 }}>
              📷 Foto do terreno
            </div>
          </div>
        )}
        {/* Texto */}
        {(msg.display || msg.content) && (
          <div style={{
            background: isUser ? '#e8a44a' : '#1c2128',
            color: isUser ? '#0d1117' : '#e6edf3',
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            padding:'12px 16px',
            fontSize:14,
            lineHeight:1.7,
            border: isUser ? 'none' : '1px solid #30363d',
            whiteSpace:'pre-wrap',
            wordBreak:'break-word',
          }}>
            {msg.display || msg.content}
            {msg.streaming && (
              <span style={{ display:'inline-block', width:8, height:14, background:'#e8a44a', marginLeft:3, animation:'blink 1s infinite', borderRadius:2 }} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Chat({ onDataUpdate }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    display: 'Olá! Sou o Instituto Chui Calonego — Engenharia Civil e Arquitetura.\n\nTrabalhamos como dois profissionais: Engenheiro Civil e Arquiteta, juntos no projeto.\n\nPode enviar uma **foto do seu terreno** — analiso topografia, orientação solar, vizinhança e vegetação. Depois conduzimos a entrevista completa e geramos planta, modelo 3D e renders realistas com a casa sobre o seu terreno.\n\nPara começar: o que você precisa? É construção nova, reforma, regularização ou laudo?',
    content: '',
  }])
  const [input, setInput]     = useState('')
  const [pendingImg, setPendingImg] = useState(null)  // { base64, mimeType, preview }
  const [loading, setLoading] = useState(false)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)
  const fileRef    = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    try {
      const compressed = await compressImage(file)
      setPendingImg(compressed)
    } catch {
      alert('Não foi possível processar a imagem. Tente outro arquivo.')
    }
  }

  async function sendMessage() {
    const text = input.trim()
    if ((!text && !pendingImg) || loading) return

    const img = pendingImg
    setInput('')
    setPendingImg(null)
    setLoading(true)

    const userMsg = {
      role: 'user',
      content: text || '(foto enviada)',
      display: text || '',
      image: img || null,
    }

    // Histórico para a API: inclui imagens recentes (últimas 4 com imagem)
    const apiMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content || m.display || '', image: m.image || null })),
      { role: 'user', content: text || '(foto enviada)', image: img || null },
    ]

    setMessages(prev => [...prev, userMsg, { role:'assistant', display:'', content:'', streaming:true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream:true })
        const { display } = parseResponse(full)
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { role:'assistant', display, content:full, streaming:true }
          return next
        })
      }

      const { display, data } = parseResponse(full)
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role:'assistant', display, content:full, streaming:false }
        return next
      })
      if (data) onDataUpdate(data)

    } catch (err) {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role:'assistant', display:`Erro de conexão: ${err.message}. Verifique a chave de API e tente novamente.`, content:'', streaming:false }
        return next
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px', scrollbarWidth:'thin' }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Preview da imagem pendente */}
      {pendingImg && (
        <div style={{ padding:'8px 16px', background:'#1c2128', borderTop:'1px solid #30363d', display:'flex', alignItems:'center', gap:10 }}>
          <img src={pendingImg.preview} alt="preview" style={{ width:52, height:52, borderRadius:6, objectFit:'cover', border:'2px solid #e8a44a' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'#e8a44a', fontWeight:600 }}>📷 Foto pronta para enviar</div>
            <div style={{ fontSize:11, color:'#8b949e', marginTop:2 }}>Adicione uma mensagem ou envie direto</div>
          </div>
          <button onClick={() => setPendingImg(null)} style={{ background:'none', border:'none', color:'#8b949e', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
      )}

      {/* Input */}
      <div style={{ padding:'12px 16px', borderTop:'1px solid #30363d', background:'#161b22', display:'flex', gap:8, alignItems:'flex-end' }}>
        {/* Botão foto */}
        <button
          onClick={() => fileRef.current?.click()}
          title="Enviar foto do terreno"
          style={{
            width:40, height:40, borderRadius:8, border:'1px solid #30363d',
            background: pendingImg ? 'rgba(232,164,74,0.15)' : '#1c2128',
            color: pendingImg ? '#e8a44a' : '#8b949e',
            cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0, transition:'all .15s',
          }}
        >📷</button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileChange} />

        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={pendingImg ? 'Descreva a foto ou envie direto...' : 'Responda aqui... (Enter envia, Shift+Enter = nova linha)'}
          rows={1}
          style={{
            flex:1, background:'#0d1117', border:'1px solid #30363d', borderRadius:8,
            color:'#e6edf3', fontSize:14, padding:'10px 14px', resize:'none',
            fontFamily:'inherit', lineHeight:1.5, maxHeight:120, outline:'none', transition:'border-color .15s',
          }}
          onFocus={e  => e.target.style.borderColor = '#e8a44a'}
          onBlur={e   => e.target.style.borderColor = '#30363d'}
          onInput={e  => { e.target.style.height='auto'; e.target.style.height = Math.min(e.target.scrollHeight,120)+'px' }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || (!input.trim() && !pendingImg)}
          style={{
            background: (loading || (!input.trim() && !pendingImg)) ? '#30363d' : '#e8a44a',
            color:       (loading || (!input.trim() && !pendingImg)) ? '#8b949e' : '#0d1117',
            border:'none', borderRadius:8, width:42, height:42, cursor: (loading||(!input.trim()&&!pendingImg)) ? 'not-allowed' : 'pointer',
            fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s',
          }}
        >{loading ? '⋯' : '↑'}</button>
      </div>
    </div>
  )
}
