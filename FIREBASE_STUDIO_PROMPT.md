# Prompt para Firebase Studio

Cole este texto no Firebase Studio (studio.firebase.google.com) para gerar o projeto.

---

## PROMPT PRINCIPAL (cole na tela inicial do Firebase Studio)

```
Crie um app Next.js 14 chamado "Instituto Chui Calonego" — sistema especialista de engenharia civil e arquitetura com IA.

Layout: duas colunas. Coluna esquerda (42%): chat em tempo real com streaming. Coluna direita (58%): painel com 4 abas — Dados, Planta, 3D, Renders.

CHAT (coluna esquerda):
- Interface de chat com streaming de respostas
- Mensagens do usuário alinhadas à direita (fundo laranja #e8a44a)
- Mensagens do assistente alinhadas à esquerda (fundo escuro #1c2128)
- Input textarea com Enter para enviar
- Cursor piscando durante streaming
- Ao receber resposta, extrair bloco JSON entre [DADOS] e [/DADOS] e atualizar estado do projeto
- Usar Gemini 2.0 Flash via /api/chat com streaming

ABA DADOS:
- Exibe em tempo real os dados extraídos pelo Gemini
- Seções: Local, Programa, Financeiro, Premissas, Gates de viabilidade
- Gates mostrados como badges coloridos (verde=ok, cinza=pendente)

ABA PLANTA:
- Planta baixa SVG gerada algoritmicamente dos dados coletados
- Paredes externas com espessura (20cm), paredes internas (15cm)
- Símbolos de janela (3 linhas paralelas), arcos de porta
- Linhas de cota externas com valores em metros
- Seta norte, barra de escala, bloco de título
- Rooms coloridos por tipo (sala=azul claro, quarto=salmão, cozinha=amarelo, banheiro=azul)
- Rua "VIA PÚBLICA" acima do recuo frontal

ABA 3D:
- Viewer Three.js com OrbitControls (arrastar, zoom)
- Casa residencial com: fundação, paredes com janelas emolduradas e porta, telhado hip cerâmico, vegetação
- Modo dia e modo noite (toggle)
- Todo o setup Three.js em um único useEffect (setup + cleanup)

ABA RENDERS:
- 6 botões de ângulo: Perspectiva, Frontal, Lateral, Interior, Noturno, Aérea
- Botão "Gerar render" chama /api/render
- Exibe imagem gerada pelo Imagen 3 (retornada como data URL base64)
- Estado de loading com animação
- Botão "Gerar todos (6)" gera sequencialmente

API ROUTES:
- /api/chat: Gemini 2.0 Flash com streaming, converte mensagens {role,content} para formato Gemini {role,parts}
- /api/render: Imagen 3 (imagen-3.0-generate-001) via Edge Runtime (30s timeout), retorna data URL base64

VARIÁVEL DE AMBIENTE: GOOGLE_API_KEY (uma chave cobre tudo)

TEMA: dark engineering
- Background: #0d1117
- Surface: #161b22
- Accent: #e8a44a (laranja)
- Texto: #e6edf3
- Secundário: #8b949e
```

---

## SE O FIREBASE STUDIO PEDIR MAIS DETALHES

### Sobre o sistema de chat:

```
O Gemini recebe um system prompt longo (a spec completa do Instituto Chui Calonego com todas as regras técnicas de engenharia civil). Ao final de cada resposta, o Gemini emite um bloco JSON:

[DADOS]
{ "rodada": 1, "cidade": "", "estado": "", "terreno": {"frente": 0, "profundidade": 0}, ... }
[/DADOS]

O frontend extrai esse JSON com regex, remove do texto exibido, e atualiza o estado do projeto que alimenta planta, 3D e renders.
```

### Sobre a planta SVG:

```
Algoritmo de layout:
- Zona frontal (0-38% da profundidade): garagem + sala
- Zona central (38-63%): cozinha + área de serviço  
- Zona funda (63-100%): quartos + banheiros

Escala: 20px por metro. Margem: 72px.
Paredes externas: retângulos preenchidos com #b8b0a8, espessura 20cm.
Janelas: 3 linhas paralelas através da espessura da parede.
Portas: arco de 90° em path SVG tracejado.
```

### Sobre o viewer 3D:

```
Seguir spec seção 13.3: todo Three.js em um único useEffect com cleanup no return.
Telhado hip: 4 faces triangulares com BufferGeometry.
Paredes com openings: função que divide a parede em segmentos (parede/janela/porta/garagem).
Janelas: glass (MeshPhongMaterial transparente) + 4 frames de alumínio.
Modo noite: PointLights internos warm (0xFFBB55) + poste de rua.
```

---

## ESTRUTURA DE ARQUIVOS ESPERADA

```
app/
  layout.jsx
  page.jsx          ← layout split + tabs
  globals.css
  api/
    chat/route.js   ← Gemini streaming
    render/route.js ← Imagen 3 edge runtime
components/
  Chat.jsx          ← streaming chat UI
  FloorPlan.jsx     ← SVG algorítmico
  Viewer3D.jsx      ← Three.js
  Renders.jsx       ← galeria Imagen 3
lib/
  systemPrompt.js   ← spec completa como system prompt
  layout.js         ← algoritmo de planta
package.json        ← @google/genai, next, react, three
.env.local.example  ← GOOGLE_API_KEY=AIza...
```

---

## CHAVE API

Obter em: https://aistudio.google.com/apikey

Uma única chave cobre:
- Gemini 2.0 Flash (chat)
- Imagen 3 (renders)
