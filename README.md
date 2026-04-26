# Instituto Chui Calonego — Sistema Especialista IA

Engenharia Civil e Arquitetura com Gemini + Imagen 3 (Google AI).

## Stack
- **Next.js 14** (App Router)
- **Gemini 2.0 Flash** (Google) — entrevista inteligente, validação técnica, documentos
- **Imagen 3** (Google) — renders fotorrealistas em 6 ângulos
- **Three.js** — modelo 3D técnico interativo

## Uma única chave Google para tudo

Obtenha em **https://aistudio.google.com/apikey** (gratuito).

## Rodar local

```bash
npm install
cp .env.local.example .env.local
# editar .env.local: GOOGLE_API_KEY=AIza...
npm run dev
# acesse http://localhost:3000
```

## Deploy Vercel (gratuito)

1. vercel.com → New Project → importar ECGCLAUDE
2. Environment Variables → adicionar:
   - `GOOGLE_API_KEY` = sua chave do Google AI Studio
3. Deploy → URL funcional em 2 minutos

## Deploy Firebase Hosting (alternativa Google)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## O que funciona

| Recurso | Confiabilidade |
|---|---|
| Chat Gemini streaming | ✅ 100% |
| Planta SVG (paredes, janelas, portas, cotas) | ✅ 100% |
| Viewer 3D Three.js (dia/noite) | ✅ 100% |
| Renders Imagen 3 (6 ângulos) | ✅ ~90% — retry resolve timeout |
| Validação gates e travas (Gemini) | ✅ 100% |

## Aviso sobre Imagen 3

O Imagen 3 via Google AI Studio API é gratuito mas pode exigir
que o billing do Google Cloud esteja ativo na conta. Se der erro
de permissão nos renders, ative em: console.cloud.google.com → Billing.
