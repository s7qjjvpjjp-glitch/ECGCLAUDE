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

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#e8a44a', color: '#0d1117',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0, marginRight: 10, marginTop: 2,
        }}>IC</div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? '#e8a44a' : '#1c2128',
        color: isUser ? '#0d1117' : '#e6edf3',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '12px 16px',
        fontSize: 14,
        lineHeight: 1.7,
        border: isUser ? 'none' : '1px solid #30363d',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.display || msg.content}
        {msg.streaming && (
          <span style={{ display: 'inline-block', width: 8, height: 14, background: '#e8a44a', marginLeft: 3, animation: 'blink 1s infinite', borderRadius: 2 }} />
        )}
      </div>
    </div>
  )
}

export default function Chat({ onDataUpdate }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      display: 'Olá! Sou o Instituto Chui Calonego — Engenharia Civil e Arquitetura.\n\nTrabalhamos como dois profissionais: eu (Eng. Civil) e a arquiteta, juntos no mesmo projeto. Analisamos o terreno, conduzimos uma entrevista técnica e entregamos projeto completo — planta esquemática, modelo 3D, renders e documentação técnica.\n\nPara começar: o que você precisa? É uma construção nova, reforma, regularização ou laudo?',
      content: '',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setLoading(true)

    const userMsg = { role: 'user', content: text, display: text }
    const apiMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content || m.display })),
      { role: 'user', content: text },
    ]

    setMessages(prev => [...prev, userMsg, { role: 'assistant', display: '', content: '', streaming: true }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        const { display } = parseResponse(full)
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', display, content: full, streaming: true }
          return next
        })
      }

      const { display, data } = parseResponse(full)
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', display, content: full, streaming: false }
        return next
      })

      if (data) onDataUpdate(data)
    } catch (err) {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = {
          role: 'assistant',
          display: 'Erro de conexão. Verifique a chave da API e tente novamente.',
          content: '',
          streaming: false,
        }
        return next
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #30363d',
        background: '#161b22',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Responda aqui... (Enter para enviar, Shift+Enter para nova linha)"
          rows={1}
          style={{
            flex: 1,
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: 8,
            color: '#e6edf3',
            fontSize: 14,
            padding: '10px 14px',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            maxHeight: 120,
            outline: 'none',
            transition: 'border-color .15s',
          }}
          onFocus={e => e.target.style.borderColor = '#e8a44a'}
          onBlur={e => e.target.style.borderColor = '#30363d'}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? '#30363d' : '#e8a44a',
            color: loading || !input.trim() ? '#8b949e' : '#0d1117',
            border: 'none',
            borderRadius: 8,
            width: 42,
            height: 42,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all .15s',
          }}
        >
          {loading ? '⋯' : '↑'}
        </button>
      </div>
    </div>
  )
}
