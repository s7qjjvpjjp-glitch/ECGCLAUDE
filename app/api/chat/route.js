import { GoogleGenAI } from '@google/genai'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'

export const runtime = 'nodejs'
export const maxDuration = 30

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

export async function POST(request) {
  const { messages } = await request.json()

  // Converte {role, content, image?} → formato Gemini multimodal {role, parts[]}
  // Gemini usa 'model' no lugar de 'assistant'
  // Imagens incluídas como inlineData — permite Gemini Vision analisar fotos do terreno
  const contents = messages.map(m => {
    const parts = []

    // Texto da mensagem
    const text = (m.content || m.display || '').trim()
    if (text && text !== '(foto enviada)') parts.push({ text })

    // Imagem (foto do terreno enviada pelo usuário)
    if (m.image?.base64 && m.image?.mimeType) {
      parts.push({ inlineData: { mimeType: m.image.mimeType, data: m.image.base64 } })
      // Se não tiver texto, adiciona prompt de análise
      if (!text || text === '(foto enviada)') {
        parts.unshift({ text: 'Analise esta foto do terreno conforme as instruções do sistema.' })
      }
    }

    // Garante ao menos uma part
    if (parts.length === 0) parts.push({ text: '...' })

    return {
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts,
    }
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: 'gemini-2.0-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens:   2048,
            temperature:       0.7,
          },
        })

        for await (const chunk of stream) {
          const text = chunk.text()
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\nErro: ${err.message}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
