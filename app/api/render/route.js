import { GoogleGenAI } from '@google/genai'

// Edge runtime garante 30s de timeout — Imagen 3 leva 10-20s normalmente
export const runtime = 'edge'

const ANGLE_DESCRIPTIONS = {
  perspective: 'Perspective view from front-right at 35 degrees elevation.',
  frontal:     'Front elevation view, straight on, eye level.',
  lateral:     'Right side elevation view, showing roof overhang and depth.',
  interior:    'Interior living room view, furniture and finishes visible, natural light.',
  noturno:     'Night scene, warm LED interior lights glowing, garden spike lights on lawn.',
  aerea:       "Bird's eye view from 60 degrees, showing roof layout and surroundings.",
}

export async function POST(request) {
  const { projectData, angle = 'perspective' } = await request.json()

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

  const { cidade, estado, programa, financeiro } = projectData || {}

  const padrao = {
    economico: 'simple economic finish, ceramic floor tiles, standard aluminum windows',
    medio:     'standard mid-range finish, porcelain tiles, aluminum windows, painted walls',
    alto:      'high-end luxury finish, large format porcelain, premium windows, stone accents',
  }[financeiro?.padrao || 'medio']

  const floors   = (programa?.quartos || 2) > 3 ? 'two-story' : 'single-story'
  const garage   = (programa?.vagas || 0) > 0 ? `${programa.vagas}-car covered garage` : 'no garage'
  const angleDesc = ANGLE_DESCRIPTIONS[angle] || ANGLE_DESCRIPTIONS.perspective

  const prompt = `Photorealistic architectural render of a ${floors} Brazilian residential house in ${cidade || 'Brazil'}${estado ? ', ' + estado : ''}. Ceramic tile hip roof, terracotta red color. Painted plaster exterior walls, off-white. ${padrao}. ${garage}. Lush tropical garden with palm trees, green lawn. ${angleDesc} Professional architecture photography style, sharp details, natural lighting. No people. No text overlays. No watermarks.`

  try {
    const response = await ai.models.generateImages({
      model:  'imagen-3.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio:    '1:1',
      },
    })

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes
    if (!imageBytes) throw new Error('Imagen 3 não retornou imagem')

    // Retorna como data URL — funciona direto no <img src>
    const dataUrl = `data:image/png;base64,${imageBytes}`
    return Response.json({ url: dataUrl, angle, prompt })

  } catch (err) {
    return Response.json(
      { error: err.message || 'Falha ao gerar imagem' },
      { status: 500 }
    )
  }
}
