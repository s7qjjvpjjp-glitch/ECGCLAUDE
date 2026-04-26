# Instituto Chui Calonego — Sistema Especialista IA

Engenharia Civil e Arquitetura com Claude + DALL-E 3.

## Stack
- **Next.js 14** (App Router)
- **Claude claude-sonnet-4-6** — entrevista inteligente, validação técnica, documentos
- **DALL-E 3** (OpenAI) — renders fotorrealistas em 6 ângulos
- **Three.js** — modelo 3D técnico interativo

## Rodar local

```bash
npm install
cp .env.local.example .env.local
# editar .env.local com suas chaves
npm run dev
# acesse http://localhost:3000
```

## Deploy Vercel (gratuito)

1. vercel.com → conectar GitHub → importar ECGCLAUDE
2. Environment Variables:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
3. Deploy → URL funcional imediatamente

## O que funciona

| Recurso | Confiabilidade |
|---|---|
| Chat Claude streaming | ✅ 100% |
| Planta SVG (paredes, janelas, portas, cotas) | ✅ 100% |
| Viewer 3D Three.js (dia/noite) | ✅ 100% |
| Renders DALL-E 3 (6 ângulos) | ✅ ~90% — retry resolve timeout |
| Validação gates e travas (Claude) | ✅ 100% |
