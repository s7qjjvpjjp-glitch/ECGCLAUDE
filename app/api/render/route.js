import OpenAI from 'openai'

export const runtime = 'edge'

const ANGLE_DESCRIPTIONS = {
  perspective: 'Perspective view from front-right at 35 degrees elevation.',
  frontal:     'Front elevation view, straight on, eye level.',
  lateral:     'Right side elevation view, showing roof overhang and depth.',
  interior:    'Interior view looking toward back wall, furniture and finishes visible.',
  noturno:     'Night scene, warm LED interior lights glowing, garden spike lights on lawn.',
  aerea:       "Bird's eye view from 60 degrees, showing roof layout and surroundings.",
}

export async function POST(request) {
  const { projectData, angle = 'perspective' } = await request.json()

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const { cidade, estado, programa, financeiro, terreno } = projectData || {}

  const padrao = {
    economico: 'simple economic finish, ceramic tiles, standard aluminum windows',
    medio:     'standard finish, porcelain or ceramic tiles, aluminum windows, painted walls',
    alto:      'high-end finish, large format porcelain, premium windows, natural stone accents',
  }[financeiro?.padrao || 'medio']

  const floors = (programa?.quartos || 2) > 3 ? 'two-story' : 'single-story'
  const garage = programa?.vagas > 0 ? `${programa.vagas}-car covered garage` : 'no garage'
  const roof   = 'ceramic tile hip roof, terracotta color'
  const walls  = 'painted plaster exterior walls, off-white color'

  const prompt = `Architectural render of a ${floors} Brazilian residential house in ${cidade || 'Brazil'}${estado ? ', ' + estado : ''}. ${walls}. ${roof}. ${padrao}. ${garage}. Lush tropical garden with palm trees and green lawn. ${ANGLE_DESCRIPTIONS[angle] || ANGLE_DESCRIPTIONS.perspective} Photorealistic architectural render, professional photography style, sharp details, natural lighting. No people. No text overlays.`

  try {
    const image = await openai.images.generate({
      model:   'dall-e-3',
      prompt,
      n:       1,
      size:    '1024x1024',
      quality: 'standard',
    })

    return Response.json({ url: image.data[0].url, prompt, angle })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
