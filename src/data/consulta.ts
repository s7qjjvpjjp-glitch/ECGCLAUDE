export interface ConsultaSection {
  id: string;
  emoji: string;
  title: string;
  reference: string;
  content: string;
  alert?: string;
}

export interface GrowthData {
  weightGainPerWeek: string;
  expectedWeightKg: string;
  heightGainCm: string;
  headCircumferenceCm: string;
  note: string;
}

export interface MonthConsulta {
  month: number;
  label: string;
  growth: GrowthData;
  sections: ConsultaSection[];
}

export const CONSULTA_DATA: MonthConsulta[] = [
  {
    month: 0,
    label: 'Recém-nascido (Mês 0)',
    growth: {
      weightGainPerWeek: '~210 g/semana (~30 g/dia)',
      expectedWeightKg: '2,5 a 4,5 kg ao nascer (média 3,3 kg)',
      heightGainCm: '+3 a 4 cm no 1º mês',
      headCircumferenceCm: '+1,5 cm/semana',
      note: 'Perda fisiológica de até 10% do peso nos primeiros dias — recupera até o 10º–15º dia. Referência: Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm0-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 14 a 17 horas/dia. Ciclos de 45–60 min; até 6 despertes noturnos são normais.

AMBIENTE SEGURO (AAP 2022 — Recomendação A):
• Posição SUPINA (de costas) em TODA soneca e sono noturno — reduz SMSL até 50%
• Colchão firme e plano, berço certificado pelo INMETRO
• Sem travesseiro, sem protetor lateral (bumper), sem brinquedos soltos, sem coberta frouxa
• Room sharing SEM bed sharing pelos primeiros 6 meses (reduz SMSL 50%)
• Temperatura do quarto: 20–22°C, sem superaquecimento
• Chupeta na hora de dormir: reduz risco de SMSL (oferecer após amamentação estabelecida)

SMSL: maior risco entre 2–4 meses; amamentação tem efeito protetor comprovado.`,
        alert: 'NUNCA colocar em posição prona (bruços) para dormir — risco de SMSL.',
      },
      {
        id: 'm0-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023 / AAP 2022',
        content: `Aleitamento materno EXCLUSIVO — nenhuma outra água, chá ou alimento.
Livre demanda: todo sinal de fome (boca abrindo, mãos na boca, virar a cabeça).
Colostro (dias 1–5): alto em anticorpos IgA secretória, fatores de crescimento e proteção intestinal.
Frequência normal: 8–12 mamadas/24h no RN.

Sinais de amamentação adequada: 6+ fraldas molhadas/dia após o 4º–5º dia; ganho de peso adequado.

Contraindicações absolutas: HIV materno, HTLV-1/2, uso de drogas ilícitas, galactosemia (bebê).
Fórmula infantil: somente se indicação médica clara.`,
      },
      {
        id: 'm0-diurese',
        emoji: '🚽',
        title: 'Diurese e Fezes',
        reference: 'MS 2023',
        content: `URINA:
• Dia 1: 1–2 fraldas molhadas
• A partir do 4º–5º dia: 6+ fraldas molhadas por dia

FEZES:
• RN amamentado: amarelo-ouro, pastosas, 4–12x/dia
• RN fórmula: bege-amarelado, mais firmes, 1–4x/dia
• Mecônio: primeiras 24–48h (preto-esverdeado); ausência em >24h: investigar

Alertas: fezes brancas/acólicas (investigar colestase), sangue nas fezes, menos de 6 fraldas molhadas.`,
        alert: 'Fezes brancas ou acólicas = investigar colestase neonatal imediatamente.',
      },
      {
        id: 'm0-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023 / AAP 2022',
        content: `VITAMINA D: 400 UI/dia VO a partir do 7º dia de vida.
• Independente do tipo de aleitamento (SBP 2023, AAP 2022)
• NÃO necessário se fórmula infantil ≥ 500 ml/dia (já contém ≥ 400 UI)

VITAMINA K: profilaxia ao nascer (hospitalar — 1 mg IM ou protocolo oral)

FERRO: NÃO iniciar ainda (início aos 6 meses para bebê a termo)
• Exceção: prematuros — 2 mg/kg/dia a partir de 30 dias de vida`,
      },
      {
        id: 'm0-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• BCG: dose única ao nascer
• Hepatite B: 1ª dose ao nascer`,
      },
      {
        id: 'm0-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `Higiene oral mesmo sem dentes: gaze umedecida em água fervida ou filtrada após mamadas.
Limpar gengivas, língua e bochechas.
NÃO oferecer chupeta mergulhada em mel, açúcar ou qualquer adoçante.`,
      },
      {
        id: 'm0-triagens',
        emoji: '🧪',
        title: 'Triagens Neonatais',
        reference: 'MS 2024 / SBP',
        content: `• Teste do Pezinho (PNTN): coleta ideal 3–5 dias de vida (mínimo 48h)
  Detecta: fenilcetonúria, hipotireoidismo congênito, doença falciforme, fibrose cística, hiperplasia adrenal congênita, deficiência de biotinidase, SCID
• Teste da Orelhinha (OAE/PEATE): antes da alta hospitalar (≤ 30 dias se não realizado)
• Reflexo Vermelho: na maternidade e na 1ª consulta
• Teste do Coraçãozinho (oximetria): 24–48h de vida
• Teste da Linguinha: pesquisa de frênulo lingual se dificuldade de amamentação`,
        alert: 'Confirmar realização de TODAS as triagens antes de sair da maternidade.',
      },
      {
        id: 'm0-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'SBP / AAP Bright Futures',
        content: `• Cadeirinha bebê-conforto no carro desde a SAÍDA da maternidade (obrigatório por lei)
• Nunca deixar bebê sozinho em superfície elevada (mesa, sofá, cama)
• NUNCA sacudir o bebê — Síndrome do Bebê Sacudido causa lesão cerebral grave
• Coto umbilical: limpo e seco; álcool 70% conforme orientação da equipe
• Temperatura da água do banho: 36–37°C (testar com cotovelo antes)
• Não expor ao sol direto antes de 6 meses`,
        alert: 'NUNCA sacudir o bebê. Síndrome do Bebê Sacudido pode causar morte ou dano cerebral permanente.',
      },
      {
        id: 'm0-saude-mental',
        emoji: '❤️',
        title: 'Saúde Mental Materna e Vínculo',
        reference: 'SBP 2023 / AAP Bright Futures',
        content: `• Edinburgh (EPDS): aplicar na 1ª consulta pós-natal e 6 semanas pós-parto
• Sinais de depressão puerperal: tristeza persistente, desinteresse, pensamentos intrusivos
• Estimular contato pele a pele (kangaroo care): reduz choro, melhora vínculo, estabiliza temperatura
• Conversar com o bebê: reconhece voz desde a gestação
• Telas: ZERO exposição até 2 anos (SBP/OMS/AAP)`,
      },
    ],
  },

  {
    month: 1,
    label: '1 Mês',
    growth: {
      weightGainPerWeek: '~200 g/semana',
      expectedWeightKg: '3,5 a 5,5 kg (média ~4,5 kg)',
      heightGainCm: '+4 cm neste mês',
      headCircumferenceCm: '+1,5 cm/semana',
      note: 'Peso ao 1 mês ≈ 4,5 kg (média meninas OMS 2006).',
    },
    sections: [
      {
        id: 'm1-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 14–17 h/dia.
Despertes noturnos para mamar: até 6x são normais.
Rotina não estabelecida ainda — sistema circadiano imaturo.
Sonecas irregulares durante o dia: normal.
Manter todas as recomendações de ambiente seguro (supino, berço firme, sem objetos).`,
      },
      {
        id: 'm1-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno exclusivo mantido.
Frequência: 8–12x/dia ainda possível; alguns bebês começam a aumentar intervalos.
Refluxo fisiológico: regurgitação após mamadas — normal; posicionar ereto após mamar 20–30 min.
Cólicas: pico às 6 semanas — massagem abdominal, colo, chupeta podem ajudar.`,
      },
      {
        id: 'm1-diurese',
        emoji: '🚽',
        title: 'Diurese e Fezes',
        reference: 'MS 2023',
        content: `6–8 fraldas molhadas/dia: adequado.
Fezes amamentado: podem ser várias/dia ou a cada 3–7 dias — ambos normais após 6 semanas.
Fezes fórmula: 1–3x/dia, mais amareladas e firmes.`,
      },
      {
        id: 'm1-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: ainda não indicado para bebê a termo.`,
      },
      {
        id: 'm1-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Continuar cadeirinha bebê-conforto em TODAS as viagens
• Nunca deixar sozinho na banheira ou balde de banho
• Não usar almofadas de posicionamento na cama
• Cuidado com animais domésticos próximos ao bebê`,
      },
      {
        id: 'm1-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Tummy time: 2–3x/dia por 2–3 minutos (com supervisão)
• Contato visual: foco a ~25 cm do rosto
• Conversar suavemente, cantar, fazer expressões
• Telas: ZERO exposição até 2 anos (SBP/OMS/AAP)`,
      },
    ],
  },

  {
    month: 2,
    label: '2 Meses',
    growth: {
      weightGainPerWeek: '~180 g/semana',
      expectedWeightKg: '4,5 a 6,5 kg (média ~5,1 kg)',
      heightGainCm: '+3,5 cm neste mês',
      headCircumferenceCm: '+1 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm2-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 14–17 h/dia.
Começa leve consolidação noturna: período mais longo de 3–4h é normal.
ATENÇÃO: risco máximo de SMSL entre 2–4 meses — manter posição supina em todas as ocasiões.
Rotina de sono: banho morno, amamentação, canção suave — estimula ritmo circadiano.`,
        alert: 'Pico de risco de SMSL entre 2–4 meses. Posição supina obrigatória em toda soneca.',
      },
      {
        id: 'm2-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno exclusivo — nenhum outro alimento.
Crise de crescimento (growth spurt): ~6 semanas e ~3 meses — mais mamadas temporariamente, normal.
Chupeta: pode ser oferecida após amamentação bem estabelecida.`,
      },
      {
        id: 'm2-diurese',
        emoji: '🚽',
        title: 'Diurese e Fezes',
        reference: 'MS 2023',
        content: `6+ fraldas molhadas/dia.
Amamentados: podem ficar 1–7 dias sem evacuar (trânsito lento = normal pós-colostro).
Fórmula: 1–3x/dia, consistência pastosa-firme.`,
      },
      {
        id: 'm2-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: não iniciar ainda (bebê a termo).`,
      },
      {
        id: 'm2-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Pentavalente (DTP+Hib+HepB): 1ª dose
• VIP (Polio inativada): 1ª dose
• Pneumocócica 10V: 1ª dose
• Rotavírus Humano: 1ª dose (via oral)

Orientar: febre e irritabilidade pós-vacina são normais — analgesia conforme orientação médica.`,
      },
      {
        id: 'm2-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Sorriso social começa (~6 semanas): resposta ao rosto e voz
• Tummy time: aumentar para 5 minutos, várias vezes/dia
• Móbile em preto e branco acima do berço
• Imitar sons que ela faz — início da "conversa"
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 3,
    label: '3 Meses',
    growth: {
      weightGainPerWeek: '~150 g/semana',
      expectedWeightKg: '5,5 a 7,0 kg (média ~6,0 kg)',
      heightGainCm: '+3 cm neste mês',
      headCircumferenceCm: '+1 cm/semana',
      note: 'Marco clínico: peso ao 3 meses ≈ 2× o peso ao nascer.',
    },
    sections: [
      {
        id: 'm3-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 14–16 h/dia.
Primeiros ciclos de sono noturno mais longos: 4–6h possível.
Continua supino em todas as ocasiões — ainda alto risco de SMSL.
Room sharing ainda recomendado (até 6 meses — AAP 2022).`,
      },
      {
        id: 'm3-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno exclusivo.
Crise de crescimento ~3 meses: aumento temporário da frequência.
Alguns bebês começam a ter padrão mais regular.
Alerta: vômitos em jato — investigar estenose pilórica.`,
      },
      {
        id: 'm3-diurese',
        emoji: '🚽',
        title: 'Diurese e Fezes',
        reference: 'MS 2023',
        content: `6+ fraldas molhadas/dia.
Amamentado: pode ir até 5–7 dias sem evacuar — normal se sem desconforto.
Alerta: vômitos em jato (investigar estenose pilórica — mais comum em meninos, mas pode ocorrer em meninas).`,
      },
      {
        id: 'm3-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: não ainda (bebê a termo).`,
      },
      {
        id: 'm3-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Meningocócica C: 1ª dose`,
      },
      {
        id: 'm3-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Sustenta cabeça a 45° no tummy time
• Acompanha objetos com os olhos horizontalmente
• Gorjeios e sons vocais — imite!
• Tummy time: 10–15 min/dia acumulados
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 4,
    label: '4 Meses',
    growth: {
      weightGainPerWeek: '~130 g/semana',
      expectedWeightKg: '6,0 a 7,5 kg (média ~6,4 kg)',
      heightGainCm: '+2,5 cm neste mês',
      headCircumferenceCm: '+0,8 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm4-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–16 h/dia.
Regressão do sono aos 4 meses: despertes mais frequentes — fase normal de reorganização neurológica.
Posição supina obrigatória — ainda alto risco de SMSL (pico 2–4 meses).
Rotinas de sono ficam mais efetivas agora (banho, amamentação, canção).`,
        alert: 'Regressão do sono aos 4 meses é normal — não é indicação para iniciar sólidos.',
      },
      {
        id: 'm4-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno exclusivo mantido.
NÃO iniciar sólidos antes de 6 meses completos.
Exceção: indicação médica específica em casos raros.`,
      },
      {
        id: 'm4-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: não ainda.`,
      },
      {
        id: 'm4-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Pentavalente: 2ª dose
• VIP (Polio): 2ª dose
• Pneumocócica 10V: 2ª dose
• Rotavírus: 2ª dose (oral) — ÚLTIMA DOSE (máx 7 meses e 6 dias de idade)
• Meningocócica C: 2ª dose`,
        alert: 'Rotavírus 2ª dose: prazo máximo até 7 meses e 6 dias de vida.',
      },
      {
        id: 'm4-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Risco de quedas aumenta: bebê começa a rolar
• Nunca deixar na trocador ou sofá sem supervisão contínua
• Cuidado com objetos pequenos ao alcance (começa a pegar tudo)
• Água morna para banho verificada com cotovelo`,
      },
      {
        id: 'm4-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Levanta peito no tummy time (apoio nos antebraços)
• Início do rolamento: de bruços para de costas
• Começa a rir alto — descubra o que a faz rir!
• Objetos à mão para pegar e explorar
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 5,
    label: '5 Meses',
    growth: {
      weightGainPerWeek: '~100 g/semana',
      expectedWeightKg: '6,5 a 8,0 kg (média ~7,0 kg)',
      heightGainCm: '+2 cm neste mês',
      headCircumferenceCm: '+0,5 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm5-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–16 h/dia.
Duas sonecas mais organizadas + sono noturno.
Posição supina — bebê pode tentar virar; recoloque se necessário até 6 meses.
Se rolar sozinha para bruços ao dormir: ok manter quando ela vira sozinha (AAP).`,
      },
      {
        id: 'm5-amamentacao',
        emoji: '🤱',
        title: 'Amamentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno exclusivo — aguardar 6 meses completos para sólidos.
Sinais de prontidão (verificar em conjunto): sentar com suporte, interesse em alimentos, perda do reflexo de extrusão da língua.
ATENÇÃO: esses sinais NÃO significam que pode iniciar antes dos 6 meses.`,
      },
      {
        id: 'm5-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: verificar — amamentados exclusivos iniciarão em 1 mês.`,
      },
      {
        id: 'm5-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Portão de escada: instalar antes do engatinhamento
• Tomadas: cobrir todas
• Bebê começa a rolar: NUNCA deixar em superfície elevada sem supervisão`,
      },
      {
        id: 'm5-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Rola para ambos os lados
• Transfere objetos de mão em mão
• Reconhece seu nome
• Balbucio variado: "ba", "ma", "da"
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 6,
    label: '6 Meses',
    growth: {
      weightGainPerWeek: '~90 g/semana',
      expectedWeightKg: '7,0 a 8,5 kg (média ~7,3 kg)',
      heightGainCm: '+1,5 cm neste mês',
      headCircumferenceCm: '+0,5 cm/semana',
      note: 'Marco clínico: peso ao 6 meses ≈ 2× o peso ao nascer. Consulta odontopediátrica se já erupcionou 1º dente.',
    },
    sections: [
      {
        id: 'm6-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–15 h/dia.
Duas sonecas diurnas (manhã e tarde).
Sono noturno 8–10h com 1–2 despertes ainda normais.
Posição: se rola sozinha para qualquer posição — não é necessário reposicionar.
Ambiente seguro mantido (sem objetos soltos no berço).`,
      },
      {
        id: 'm6-alimentacao',
        emoji: '🥗',
        title: 'Introdução Alimentar (INÍCIO)',
        reference: 'SBP 2023 / MS 2023',
        content: `Manter aleitamento materno — NÃO suspender.

1ª PAPINHA: 1x/dia, horário do almoço
• Consistência: purê liso (sem grumos)
• Começar com 1–2 colheres; aumentar gradualmente

ALIMENTOS RECOMENDADOS PARA INÍCIO:
• Legumes: abóbora, batata-doce, cenoura, chuchu, abobrinha
• Frutas: banana amassada, maçã cozida, pera cozida (sem açúcar)

NÃO adicionar: sal, açúcar, mel, temperos industrializados
• Oferecer água em copo (não mamadeira) nas refeições

ALERGÊNICOS — introdução PRECOCE recomendada (SBP 2023):
• Glúten, ovo, amendoim (pasta fina diluída), peixe: introduzir normalmente
• Reduz risco de alergia alimentar quando introduzidos precocemente
• Exceção: histórico familiar de alergia grave — consultar médico`,
        alert: 'Mel: proibido até 1 ano (risco de botulismo infantil).',
      },
      {
        id: 'm6-diurese',
        emoji: '🚽',
        title: 'Diurese e Fezes',
        reference: 'MS 2023',
        content: `4–6 fraldas molhadas/dia (podem diminuir com início de sólidos).
Fezes mudam com sólidos: mais firmes, odor mais forte — normal.
Constipação possível: aumentar oferta de água e frutas (pera, ameixa, mamão).`,
      },
      {
        id: 'm6-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023 / MS',
        content: `VITAMINA D: 400 UI/dia — manter.

FERRO: INICIAR 1 mg/kg/dia VO (amamentados a termo) — SBP/MS
• Fórmula: verificar se já enriquecida (geralmente sim)
• Manter até 24 meses
• Ferro pode causar fezes mais escurecidas — normal`,
        alert: 'Iniciar ferro elementar 1 mg/kg/dia este mês se amamentação exclusiva.',
      },
      {
        id: 'm6-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Pentavalente: 3ª dose
• VIP (Polio): 3ª dose
• Influenza: 1ª dose (série inicial; crianças <9 anos tomam 2 doses com intervalo de 30 dias)`,
      },
      {
        id: 'm6-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `1º dente pode erupcionar (~6 meses; variação normal: 4–12 meses).

APÓS erupção do 1º dente:
• Escova infantil macia
• Pasta fluoretada 1000–1500 ppm — quantidade de um GRÃO DE ARROZ
• Escovação 2x/dia

Consulta odontopediatra: ao erupcionar o 1º dente (SBP/AAP).
Não deitar com mamadeira — previne cárie de mamadeira.`,
      },
      {
        id: 'm6-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Protetor solar a partir de 6 meses (FPS ≥30, reaplicar)
• Portão de escada instalado
• Tomadas cobertas
• Objetos pequenos fora do alcance (enfia tudo na boca)
• Nunca deixar sozinha no banho (afogamento em 2–3 cm de água)
• Cadeirinha: verificar se o peso está adequado para o modelo atual`,
        alert: 'Nunca deixar sozinha na banheira — afogamento pode ocorrer em poucos centímetros de água.',
      },
    ],
  },

  {
    month: 7,
    label: '7 Meses',
    growth: {
      weightGainPerWeek: '~80 g/semana',
      expectedWeightKg: '7,5 a 9,0 kg (média ~7,8 kg)',
      heightGainCm: '+1,5 cm neste mês',
      headCircumferenceCm: '+0,5 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm7-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–15 h/dia.
Ansiedade de separação começa: choro ao colocar para dormir — normal.
Rotina de sono consistente é eficaz: banho, mamada, canção, cama.`,
      },
      {
        id: 'm7-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Aleitamento materno + 2 refeições complementares.
Introduzir PROTEÍNAS ANIMAIS: frango desfiado, carne moída (na papinha).
Introduzir FEIJÃO (caldinho) — fonte importante de ferro não-heme.
Textura: purê com pequenos pedaços macios.
NÃO adicionar sal, açúcar ou temperos industrializados.`,
      },
      {
        id: 'm7-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: 1 mg/kg/dia — manter.
Verificar adesão: ferro pode causar fezes escurecidas (normal) e constipação leve.`,
      },
      {
        id: 'm7-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Engatinhamento próximo: verificar ambiente (escadas, tomadas, móveis com quinas)
• Cuidado com plantas tóxicas ao alcance
• Nunca deixar na banheira sem supervisão`,
      },
      {
        id: 'm7-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Senta com apoio
• Engatinhamento começa
• Diz "mama" e "papa" sem significado específico
• Busca objetos escondidos (início da permanência do objeto)
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 8,
    label: '8 Meses',
    growth: {
      weightGainPerWeek: '~70 g/semana',
      expectedWeightKg: '7,8 a 9,5 kg (média ~8,1 kg)',
      heightGainCm: '+1,5 cm neste mês',
      headCircumferenceCm: '+0,3 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm8-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–15 h/dia.
2 sonecas ainda; começa possível fusão para 1 soneca (~15–18 meses).
Ansiedade de separação: choro ao dormir mais intenso — fase normal.`,
      },
      {
        id: 'm8-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `2–3 refeições complementares.
Textura: amassado com garfo — NÃO precisa de liquidificador.
Introduzir GEMA DE OVO (cozida).
Introduzir IOGURTE NATURAL INTEGRAL sem açúcar.
Introduzir PEIXE (tilápia, merluza — sem espinhas).
Finger foods: pedaços macios para pegar com as mãos — desenvolve pinça.`,
      },
      {
        id: 'm8-vacinas',
        emoji: '💉',
        title: 'Vacinas',
        reference: 'MS / PNI 2024',
        content: `• Influenza: 2ª dose da série inicial (se 1ª foi no 6º mês, aguardar 30 dias)`,
      },
      {
        id: 'm8-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Engatinhamento ativo: revisar toda a casa
• Gavetas: travas de segurança
• Produtos de limpeza e medicamentos: armários trancados ou fora do alcance
• Bebidas quentes: nunca com bebê no colo`,
        alert: 'Produtos de limpeza e medicamentos devem estar em armários trancados.',
      },
      {
        id: 'm8-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Engatinha com desenvoltura
• De pé com apoio
• Pinça inferior (pega objetos com todos os dedos)
• Imita gestos e sons
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 9,
    label: '9 Meses',
    growth: {
      weightGainPerWeek: '~60 g/semana',
      expectedWeightKg: '8,0 a 10,0 kg (média ~8,5 kg)',
      heightGainCm: '+1 cm neste mês',
      headCircumferenceCm: '+0,3 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm9-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–15 h/dia.
Ansiedade de separação pico: despertes e choro ao adormecer mais intensos — fase normal.
Rotina consistente é essencial.`,
      },
      {
        id: 'm9-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `3 refeições complementares + aleitamento materno.
Textura: pedaços macios (finger foods).
Variedade alimentar: mínimo 5 grupos alimentares/dia (SBP/OMS).
Bebê pode usar colher — vai derramar, deixar! (autonomia alimentar).`,
      },
      {
        id: 'm9-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Febre Amarela: 1ª dose`,
      },
      {
        id: 'm9-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `Continuar escovação 2x/dia (grão de arroz de pasta 1000–1500 ppm).
Avaliar erupção de novos dentes (incisivos laterais ~8–12 meses).`,
      },
      {
        id: 'm9-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• De pé com apoio: móveis devem ser estáveis (não tombar)
• Corrimão de berço: verificar espaçamento correto (máx 6 cm entre grades)
• Nunca deixar sozinha perto de água`,
      },
      {
        id: 'm9-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Pinça fina (polegar + indicador)
• Acena "tchau"
• Entende "não" e "tchau"
• Permanência do objeto estabelecida
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 10,
    label: '10 Meses',
    growth: {
      weightGainPerWeek: '~60 g/semana',
      expectedWeightKg: '8,2 a 10,2 kg',
      heightGainCm: '+1 cm neste mês',
      headCircumferenceCm: '+0,3 cm/semana',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm10-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–14 h/dia.
2 sonecas; a soneca da manhã pode diminuir gradualmente.`,
      },
      {
        id: 'm10-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Ovo inteiro (clara + gema) bem cozido — liberado a partir de agora.
Variedade de proteínas: frango, carne, peixe, ovo, leguminosas.
3 refeições + 2 lanchinhos + aleitamento materno.
Textura: pedaços para pegar com as mãos.`,
      },
      {
        id: 'm10-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia — manter.
Ferro: 1 mg/kg/dia — manter até 24 meses.`,
      },
      {
        id: 'm10-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Primeiros passinhos próximos: ambiente totalmente seguro
• Nunca deixar acesso a banheira, piscina ou balde com água
• Revisão geral de segurança da casa`,
      },
      {
        id: 'm10-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Fica de pé sem apoio por instantes
• Cruza móveis andando (cruising)
• Primeiras palavras com significado podem aparecer
• Imita ações: bater palmas, apontar
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 11,
    label: '11 Meses',
    growth: {
      weightGainPerWeek: '~55 g/semana',
      expectedWeightKg: '8,5 a 10,5 kg',
      heightGainCm: '+1 cm neste mês',
      headCircumferenceCm: '+0,3 cm/semana',
      note: 'Peso ao 12 meses = ~3× o peso ao nascer (marco clínico).',
    },
    sections: [
      {
        id: 'm11-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 12–14 h/dia.
Começa transição para 1 soneca em alguns bebês.`,
      },
      {
        id: 'm11-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Alimentação semelhante à família (sem sal, sem açúcar).
Textura: pedaços cortados — NÃO triturar.
Oferecer água em copo aberto (não mamadeira).
Mel: ainda proibido até completar 1 ano.`,
        alert: 'Mel ainda proibido até completar 1 ano de vida.',
      },
      {
        id: 'm11-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 400 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm11-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `Primeiros molares de leite podem erupcionar (~12–18 meses).
Escovação 2x/dia com pasta 1000–1500 ppm (grão de arroz).
Consulta odontopediátrica de seguimento.`,
      },
      {
        id: 'm11-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento e Estímulo',
        reference: 'SBP / AAP',
        content: `• Diz 1–3 palavras com significado
• Aponta para objetos desejados
• Entende comandos simples ("vem cá", "pega")
• Brinca de atirar e buscar objetos
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 12,
    label: '12 Meses (1 Aninho! 🎉)',
    growth: {
      weightGainPerWeek: '~50 g/semana',
      expectedWeightKg: '8,7 a 11,0 kg (média ~9,5 kg)',
      heightGainCm: '+1 cm neste mês (74–76 cm total)',
      headCircumferenceCm: '+0,25 cm/semana (~46 cm total)',
      note: 'Marcos: peso ≈ 3× peso ao nascer; comprimento ≈ 75 cm. Crescimento desacelera — ~200–250 g/mês a partir de agora.',
    },
    sections: [
      {
        id: 'm12-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1–2 sonecas/dia.
Sono noturno 10–12h é esperado.
Posição: dorme na posição que conforta — supino não obrigatório após 1 ano.`,
      },
      {
        id: 'm12-alimentacao',
        emoji: '🥗',
        title: 'Alimentação — Transição para Comida da Família',
        reference: 'SBP 2023 / MS 2024',
        content: `NOVIDADES APÓS 1 ANO:
• MEL: liberado (risco de botulismo eliminado após 1 ano)
• LEITE DE VACA INTEGRAL: como bebida (máx 500 ml/dia) — não substituir o aleitamento materno
• FRUTAS CÍTRICAS: laranja, limão — liberadas

Comida da família com pouco sal e sem açúcar.
3 refeições principais + 2 lanchinhos.
Manter aleitamento materno se possível (benefícios até 2 anos e além — OMS).`,
      },
      {
        id: 'm12-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023 / AAP 2022',
        content: `VITAMINA D: aumentar para 600 UI/dia (1–2 anos — SBP 2023/AAP).
FERRO: 1 mg/kg/dia — manter até 24 meses.
VITAMINA A: verificar programa regional (PNVITA/MS — para regiões endêmicas).`,
        alert: 'Aumentar Vitamina D para 600 UI/dia a partir do 1º aniversário.',
      },
      {
        id: 'm12-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Pneumocócica 10V: Reforço
• Meningocócica C: Reforço
• Tríplice Viral (SCR — Sarampo/Caxumba/Rubéola): 1ª dose
• Hepatite A: dose única`,
      },
      {
        id: 'm12-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `6–8 dentes de leite geralmente presentes.
Escovação 2x/dia com pasta 1000–1500 ppm (grão de arroz — evolui para ervilha aos 3 anos).
Consulta odontopediátrica de rotina.`,
      },
      {
        id: 'm12-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures / SBP',
        content: `• Andador: NÃO RECOMENDADO (SBP) — risco de queda e atraso motor
• Cadeirinha: verificar transição para cadeirinha booster (conforme peso)
• Intoxicações: fase de curiosidade — medicamentos e produtos de limpeza trancados
• Queimaduras: água quente, fogão, ferro de passar`,
        alert: 'Andador é CONTRAINDICADO pela SBP — risco de queda de escada e atraso motor.',
      },
      {
        id: 'm12-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP Bright Futures',
        content: `• Primeiros passos (janela normal: 9–15 meses)
• Primeiras palavras com significado (mamã, papá + 1–3 palavras)
• Aponta para comunicar interesse
• Brincadeira simbólica começa
• Birras: início normal — validar emoção + limites gentis
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 13,
    label: '13 Meses',
    growth: {
      weightGainPerWeek: '~55 g/semana (~220 g/mês)',
      expectedWeightKg: '9,0 a 11,5 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,5 cm/mês',
      note: 'Crescimento desacelerado — normal nessa fase. Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm13-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1–2 sonecas; transição para 1 soneca em andamento (~15–18 meses).
Resistência para dormir e despertes por separação: normal.`,
      },
      {
        id: 'm13-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023 / MS 2023',
        content: `Comida da família; variedade de cores e texturas.
Neofobia alimentar (recusar novidades): normal nessa fase — oferecer 8–15 vezes antes de desistir.
Porções: ~1 xícara por refeição; apetite variável.
Manter diversificação.`,
      },
      {
        id: 'm13-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm13-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Corre, cai, sobe: proteção de superfícies (tapete, cantos de mesa com protetor)
• Afogamento: risco máximo em banheiras, baldes, piscinas — NUNCA deixar sozinha
• Intoxicações: segunda maior causa de morte acidental (MS) — medicamentos fora do alcance`,
        alert: 'Afogamento é risco crítico. Nunca deixar sozinha perto de qualquer recipiente com água.',
      },
      {
        id: 'm13-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Anda bem; começa a correr
• Vocabulário: 3–10 palavras com significado
• Segue instruções simples
• Brincadeira imitativa (imita adultos)
• Telas: ZERO até 2 anos (SBP/OMS/AAP)`,
      },
    ],
  },

  {
    month: 14,
    label: '14 Meses',
    growth: {
      weightGainPerWeek: '~55 g/semana (~220 g/mês)',
      expectedWeightKg: '9,2 a 11,7 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,5 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm14-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1–2 sonecas; muitos ainda com 2 sonecas.`,
      },
      {
        id: 'm14-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `3 refeições + 2 lanchinhos.
Continuar variedade alimentar.
Lanches saudáveis: frutas, iogurte, pão integral.
Evitar: ultraprocessados, suco de caixinha, bolacha recheada.`,
      },
      {
        id: 'm14-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm14-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Sobe escadas com apoio
• Usa colher com alguma habilidade
• Vocabulário em expansão
• Brincadeira paralela (ao lado de outras crianças, ainda não junto)
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 15,
    label: '15 Meses',
    growth: {
      weightGainPerWeek: '~55 g/semana (~220 g/mês)',
      expectedWeightKg: '9,5 a 12,0 kg',
      heightGainCm: '+1 cm/mês (~82 cm total)',
      headCircumferenceCm: '+0,5 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm15-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
Transição para 1 soneca (maioria entre 15–18 meses).
Resistência para dormir ainda presente.`,
      },
      {
        id: 'm15-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família completa; moderação em açúcar e sal.
Apetite variável: fase normal de desaceleração do crescimento.
Não forçar — respeitar sinais de saciedade.`,
      },
      {
        id: 'm15-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia — manter.`,
      },
      {
        id: 'm15-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024)',
        reference: 'MS / PNI 2024',
        content: `• Tetraviral (SCR + Varicela): dose única
• DTP: 1º Reforço
• VOP (Polio oral): 1º Reforço`,
      },
      {
        id: 'm15-triagem',
        emoji: '🧪',
        title: 'Rastreamento',
        reference: 'SBP 2023 / AAP 2022',
        content: `M-CHAT-R: rastreamento para TEA (Transtorno do Espectro Autista) — instrumento validado.
Aplicar aos 18 meses; pode antecipar se dúvida.
Rastreamento visual: Hirschberg, cover test.`,
      },
      {
        id: 'm15-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `Todos os incisivos geralmente presentes.
Escovação com supervisão dos pais.
Cárie de mamadeira: risco aumentado se dorme mamando.`,
      },
      {
        id: 'm15-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP Bright Futures',
        content: `• Corre
• Vocabulário: 10–25 palavras
• Aponta para 2–4 partes do corpo
• Brincadeira simbólica: alimenta boneco, fala no telefone de brinquedo
• Telas: ZERO até 2 anos (SBP/OMS/AAP)`,
      },
    ],
  },

  {
    month: 16,
    label: '16 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '9,7 a 12,3 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm16-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia (maioria).
Soneca não deve terminar menos de 4–6h antes do horário de dormir.`,
      },
      {
        id: 'm16-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `3 refeições + 2 lanchinhos.
Oferecer variedade — ela pode recusar; é normal.
Refeições em família quando possível.`,
      },
      {
        id: 'm16-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm16-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Afogamento: principal risco — nunca deixar sozinha perto de água
• Queimaduras: imita e toca tudo — fogão, ferro, panelas
• Trânsito: cadeirinha atualizada conforme peso`,
      },
      {
        id: 'm16-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Sobe e desce escadas com apoio
• Chuta bola
• Vocabulário: 20–50 palavras
• Combina 2 palavras ("mais água", "papai vai")
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 17,
    label: '17 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '9,9 a 12,6 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm17-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia consolidada.`,
      },
      {
        id: 'm17-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família.
Neofobia alimentar: normal — exposição repetida é a estratégia.
Não usar tela durante refeições.`,
      },
      {
        id: 'm17-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm17-triagem',
        emoji: '🧪',
        title: 'Rastreamento — M-CHAT-R',
        reference: 'SBP 2023 / AAP 2022',
        content: `M-CHAT-R: aplicar aos 18 meses (pode antecipar se dúvida).
Rastreamento auditivo: confirmar se triagem neonatal foi realizada.
Se pendente: solicitar audiometria.`,
      },
      {
        id: 'm17-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Anda bem em diferentes superfícies
• Vocabulário crescente
• Brincadeira de "faz de conta"
• Autoafirmação: diz "não" com frequência
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 18,
    label: '18 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '10,0 a 12,8 kg (média ~10,5 kg)',
      heightGainCm: '+1 cm/mês (~82–84 cm total)',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm18-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia (1–2h à tarde).
Rotinas de sono consistentes são essenciais.`,
      },
      {
        id: 'm18-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família completa.
Diversidade gastronômica: diferentes culinárias e temperos naturais.
Engajamento na preparação supervisionada.
3 refeições + 2 lanchinhos.`,
      },
      {
        id: 'm18-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia — até 24 meses (reavaliar após).
Ferro: 1 mg/kg/dia — até 24 meses.`,
      },
      {
        id: 'm18-triagem',
        emoji: '🧪',
        title: 'Rastreamento (18 meses)',
        reference: 'SBP 2023 / AAP Bright Futures',
        content: `M-CHAT-R: rastreamento para TEA — obrigatório aos 18 meses.
ASQ-3 (Ages & Stages Questionnaire): rastreamento de desenvolvimento global.
Rastreamento visual e auditivo: se não realizados, solicitar.`,
        alert: 'M-CHAT-R aos 18 meses — rastreamento obrigatório para TEA (SBP/AAP).',
      },
      {
        id: 'm18-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `Primeiros molares de leite completando erupção.
Escovação supervisionada: pasta 1000–1500 ppm (grão de arroz).
Afastar do hábito de mamadeira noturna.
Fio dental: iniciar quando dentes estão justapostos.`,
      },
      {
        id: 'm18-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Afogamento: principal risco — nunca deixar sozinha perto de água
• Queimaduras: toca tudo — fogão, ferro, panelas quentes
• Trânsito: cadeirinha atualizada`,
      },
      {
        id: 'm18-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP Bright Futures',
        content: `• Vocabulário: 20–50 palavras (marcos SBP/AAP)
• Combina 2 palavras ("mais água", "papai vai")
• Anda bem; começa a correr
• Birras frequentes — normal; validar emoção + limites gentis
• Telas: ZERO até 2 anos (SBP/OMS/AAP)`,
      },
    ],
  },

  {
    month: 19,
    label: '19 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '10,2 a 13,0 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm19-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia.`,
      },
      {
        id: 'm19-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família.
Variedade de proteínas, legumes e frutas.
Evitar ultraprocessados, sucos industrializados, refrigerantes.`,
      },
      {
        id: 'm19-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm19-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Vocabulário: 50–100 palavras
• Frases de 2–3 palavras
• Corre, sobe e desce escadas
• Brincadeira simbólica elaborada
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 20,
    label: '20 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '10,4 a 13,2 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm20-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia.
Rotina consistente.`,
      },
      {
        id: 'm20-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `3 refeições + 2 lanchinhos.
Envolver a criança na escolha e preparação dos alimentos.
Refeição em família sem telas.`,
      },
      {
        id: 'm20-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm20-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Queimaduras, afogamento, intoxicação: continue alerta
• Trânsito: cadeirinha adequada ao peso
• Telas: até 2 anos — zero; após 2 anos: máximo 1h/dia qualidade (SBP 2023)`,
      },
      {
        id: 'm20-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Frases de 2–3 palavras
• Nomeia objetos em imagens
• Sobe e desce escadas sozinha (com apoio)
• Birras: estratégia de regulação em desenvolvimento
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 21,
    label: '21 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '10,6 a 13,5 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm21-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia à tarde.`,
      },
      {
        id: 'm21-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família.
Estimular autonomia: deixar experimentar texturas diferentes.
Variedade de cores no prato.`,
      },
      {
        id: 'm21-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia.`,
      },
      {
        id: 'm21-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Vocabulário: 50–200 palavras
• Usa pronomes "eu" e "meu"
• Brincadeira simbólica com sequência (brinca de cozinhar, de médico)
• Interesse por outras crianças
• Telas: ZERO até 2 anos`,
      },
    ],
  },

  {
    month: 22,
    label: '22 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '10,8 a 13,7 kg',
      heightGainCm: '+1 cm/mês',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006.',
    },
    sections: [
      {
        id: 'm22-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia.`,
      },
      {
        id: 'm22-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família.
3 refeições + 2 lanchinhos.
Limitar suco natural a 120 ml/dia; zero suco industrializado.`,
      },
      {
        id: 'm22-suplementos',
        emoji: '💊',
        title: 'Suplementos',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia.
Ferro: 1 mg/kg/dia — encerrar aos 24 meses.`,
      },
      {
        id: 'm22-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `16–20 dentes de leite (caninos e molares completando erupção).
Escovação: criança tenta, pais sempre finalizam.
Pasta: grão de arroz (aumenta para ervilha aos 3 anos).
Fio dental: iniciar quando dentes estão justapostos.`,
      },
      {
        id: 'm22-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento',
        reference: 'SBP / AAP',
        content: `• Frases de 3–4 palavras
• Entende contrários (grande/pequeno, quente/frio)
• Brinca com outras crianças (início da brincadeira cooperativa)
• Telas: ZERO até completar 2 anos`,
      },
    ],
  },

  {
    month: 23,
    label: '23 Meses',
    growth: {
      weightGainPerWeek: '~50 g/semana (~200 g/mês)',
      expectedWeightKg: '11,0 a 14,0 kg',
      heightGainCm: '+1 cm/mês (~86–88 cm total)',
      headCircumferenceCm: '+0,25 cm/mês',
      note: 'Curvas OMS 2006. Próximo aos 2 anos: peso médio ~12 kg, altura ~87 cm.',
    },
    sections: [
      {
        id: 'm23-sono',
        emoji: '😴',
        title: 'Sono',
        reference: 'SBP 2021 / AAP 2022',
        content: `Total: 11–14 h/dia.
1 soneca/dia (1–2h à tarde).
Rotinas de sono consistentes são essenciais.`,
      },
      {
        id: 'm23-alimentacao',
        emoji: '🥗',
        title: 'Alimentação',
        reference: 'SBP 2023',
        content: `Comida da família.
Diversidade máxima — diferentes culinárias, texturas, sabores.
Engajamento na preparação: ela pode "ajudar" supervisionada.
Sem telas durante as refeições.`,
      },
      {
        id: 'm23-suplementos',
        emoji: '💊',
        title: 'Suplementos (finalização)',
        reference: 'SBP 2023',
        content: `Vitamina D: 600 UI/dia até 24 meses — reavaliar continuidade após 2 anos.
Ferro: 1 mg/kg/dia — encerrar aos 24 meses (avaliar com médico conforme caso).`,
        alert: 'Último mês dos suplementos rotineiros — reavaliar com médico na consulta de 2 anos.',
      },
      {
        id: 'm23-vacinas',
        emoji: '💉',
        title: 'Vacinas (SUS 2024 — 24 meses)',
        reference: 'MS / PNI 2024',
        content: `• Influenza: dose anual — manter todo ano a partir de agora`,
      },
      {
        id: 'm23-bucal',
        emoji: '🦷',
        title: 'Saúde Bucal',
        reference: 'SBP / SBCO',
        content: `16–20 dentes de leite presentes.
Escovação: criança tenta, pais sempre finalizam.
Pasta: grão de arroz → ervilha aos 3 anos.
Fio dental: quando dentes estão justapostos.
Consulta odontopediátrica de rotina.`,
      },
      {
        id: 'm23-triagem',
        emoji: '🧪',
        title: 'Rastreamentos (2 anos)',
        reference: 'SBP 2023 / AAP Bright Futures',
        content: `ASQ-3: rastreamento de desenvolvimento (Ages & Stages Questionnaire).
M-CHAT-R: revisita se pendente ou dúvida anterior.
Rastreamento auditivo: confirmar se realizado.
Triagem visual: cover test, Hirschberg.`,
      },
      {
        id: 'm23-seguranca',
        emoji: '🛡️',
        title: 'Segurança',
        reference: 'AAP Bright Futures',
        content: `• Queimaduras, afogamento, intoxicação: continue alerta
• Trânsito: cadeirinha adequada ao peso
• Telas: a partir dos 2 anos — máximo 1h/dia de conteúdo de qualidade (SBP 2023)`,
      },
      {
        id: 'm23-desenvolvimento',
        emoji: '❤️',
        title: 'Desenvolvimento (2 anos)',
        reference: 'SBP / AAP Bright Futures',
        content: `• Vocabulário: 50–300 palavras
• Frases de 3–4 palavras
• Rastreamento: ASQ-3 (Ages & Stages Questionnaire) — SBP/MS
• Rastreamento auditivo: confirmar se triagem neonatal foi realizada
• M-CHAT-R: revisita se pendente ou dúvida
• Birras: ainda presentes — normal até ~3 anos
• Telas: a partir dos 2 anos → máximo 1h/dia de qualidade (SBP 2023)`,
      },
    ],
  },
];
