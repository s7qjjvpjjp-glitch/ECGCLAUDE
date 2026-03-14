import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeECGImage(
  base64Image: string,
  mimeType: string,
  clinicalContext: string
): Promise<string> {
  try {
    const prompt = "Realize uma análise exaustiva e detalhada deste eletrocardiograma (ECG). 'Dê zoom' mentalmente em cada derivação, meça os intervalos com precisão e avalie a morfologia de cada onda com calma. Siga rigorosamente o protocolo de análise sistemática do Atlas de Sukienik. Identifique e descreva os achados com base estritamente no que é visível, sem assumir diagnósticos prévios. Aplique critérios específicos (como Sgarbossa) SOMENTE se houver achados compatíveis.";

    const contextText = clinicalContext.trim()
      ? `\nContexto clínico fornecido pelo médico: ${clinicalContext}`
      : "";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt + contextText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 8192,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("A IA não retornou nenhuma resposta. A imagem pode ter sido bloqueada pelos filtros de segurança.");
    }

    const candidate = response.candidates[0];
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'BLOCKLIST') {
      throw new Error("A análise foi bloqueada pelos filtros de segurança. Tente enviar uma imagem focada apenas no traçado do ECG, sem dados de identificação do paciente.");
    }

    return response.text || "Não foi possível gerar o laudo. O retorno da IA estava vazio.";
  } catch (error: any) {
    console.error("Error analyzing ECG:", error);

    if (error.message && error.message.includes('SAFETY')) {
      throw new Error("A análise foi bloqueada por políticas de segurança. Certifique-se de que a imagem contém apenas o traçado do ECG e nenhum dado pessoal.");
    }

    throw new Error(`Erro na API: ${error.message || "Verifique a conexão e tente novamente."}`);
  }
}

export function createMedicalChat(): Chat {
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      temperature: 0.2,
      topP: 0.8,
    },
  });
}
