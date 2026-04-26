import { GoogleGenAI } from '@google/genai'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'

export const runtime = 'nodejs'
export const maxDuration = 30

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

export async function POST(request) {
  const { messages } = await request.json()

  // Converte formato frontend {role, content} → Gemini {role, parts}
  // Gemini usa 'model' no lugar de 'assistant'
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || m.display || '' }],
  }))

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await ai.models.generateContentStream({
          model: 'gemini-2.0-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            maxOutputTokens: 2048,
            temperature: 0.7,
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
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
