import { useState } from 'react';
import { useCatarinaAge } from '../hooks/useCatarinaAge';
import { CONSULTA_DATA } from '../data/consulta';
import type { MonthConsulta } from '../data/consulta';
import { getContentMonth } from '../lib/ageUtils';

function gerarRelatorio(consulta: MonthConsulta, ageLabel: string): string {
  const lines: string[] = [
    '=== ROTEIRO DE CONSULTA DE PUERICULTURA — CATARINA ===',
    `Idade atual: ${ageLabel}`,
    `Faixa avaliada: ${consulta.label}`,
    `Data: ${new Date().toLocaleDateString('pt-BR')}`,
    `Fontes: SBP 2023 / AAP 2024 / Ministério da Saúde 2023 / OMS 2006`,
    '',
    '─── CRESCIMENTO ESPERADO ─────────────────────────',
    `Ganho de peso: ${consulta.growth.weightGainPerWeek}`,
    `Peso esperado: ${consulta.growth.expectedWeightKg}`,
    `Comprimento: ${consulta.growth.heightGainCm}`,
    `Perímetro cefálico: ${consulta.growth.headCircumferenceCm}`,
    `Obs: ${consulta.growth.note}`,
    '',
  ];

  for (const section of consulta.sections) {
    lines.push(`─── ${section.emoji} ${section.title.toUpperCase()} [${section.reference}]`);
    lines.push(section.content);
    if (section.alert) {
      lines.push(`⚠️ ALERTA: ${section.alert}`);
    }
    lines.push('');
  }

  lines.push('─────────────────────────────────────────────────');
  lines.push('Gerado pelo App da Catarina');
  lines.push('Referências: SBP Manual de Alimentação 5ª ed. 2024 | AAP Safe Sleep 2022 | Caderneta da Criança MS 6ª ed. 2024 | OMS Child Growth Standards 2006');

  return lines.join('\n');
}

export function Consulta() {
  const age = useCatarinaAge();
  const currentMonth = getContentMonth(age);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const consulta = CONSULTA_DATA[selectedMonth];

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function expandAll() {
    setOpenSections(new Set(consulta.sections.map((s) => s.id)));
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  async function handleCopy() {
    const text = gerarRelatorio(consulta, age.label);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-rose-600">Consulta Pediátrica 📋</h1>
        <p className="text-sm text-gray-500">Roteiro baseado em SBP · Ministério da Saúde · AAP</p>
      </div>

      {/* Current age banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4">
        <p className="text-sm text-rose-600 font-medium">
          Catarina tem <span className="font-bold">{age.label}</span>
        </p>
        <p className="text-xs text-rose-400 mt-0.5">Exibindo mês {selectedMonth} • {consulta.label}</p>
      </div>

      {/* Month selector */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Selecionar mês</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMonth((m) => Math.max(0, m - 1))}
            disabled={selectedMonth === 0}
            className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 font-bold text-lg disabled:opacity-30 active:bg-rose-200"
          >
            ‹
          </button>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1.5 min-w-max px-1">
              {CONSULTA_DATA.map((d) => (
                <button
                  key={d.month}
                  onClick={() => setSelectedMonth(d.month)}
                  className={`min-w-[2.5rem] h-9 rounded-xl text-xs font-bold transition-colors ${
                    selectedMonth === d.month
                      ? 'bg-rose-500 text-white'
                      : d.month === currentMonth
                      ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-400'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {d.month}m
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setSelectedMonth((m) => Math.min(23, m + 1))}
            disabled={selectedMonth === 23}
            className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 font-bold text-lg disabled:opacity-30 active:bg-rose-200"
          >
            ›
          </button>
        </div>
      </div>

      {/* Growth card */}
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-4 mb-4">
        <h2 className="text-sm font-bold text-rose-600 mb-2">📏 Crescimento — {consulta.label}</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-rose-50 rounded-xl p-2">
            <p className="text-gray-400 font-medium">Peso esperado</p>
            <p className="text-gray-700 font-semibold mt-0.5">{consulta.growth.expectedWeightKg}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-2">
            <p className="text-gray-400 font-medium">Ganho de peso</p>
            <p className="text-gray-700 font-semibold mt-0.5">{consulta.growth.weightGainPerWeek}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-2">
            <p className="text-gray-400 font-medium">Comprimento</p>
            <p className="text-gray-700 font-semibold mt-0.5">{consulta.growth.heightGainCm}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-2">
            <p className="text-gray-400 font-medium">Perímetro cefálico</p>
            <p className="text-gray-700 font-semibold mt-0.5">{consulta.growth.headCircumferenceCm}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">{consulta.growth.note}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopy}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            copied
              ? 'bg-mint-400 text-white'
              : 'bg-rose-500 text-white active:bg-rose-600'
          }`}
        >
          {copied ? '✓ Copiado!' : '📋 Copiar relatório completo'}
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={expandAll}
          className="flex-1 py-2 rounded-xl text-xs font-medium bg-rose-50 text-rose-500 active:bg-rose-100"
        >
          Expandir tudo
        </button>
        <button
          onClick={collapseAll}
          className="flex-1 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 active:bg-gray-200"
        >
          Recolher tudo
        </button>
      </div>

      {/* Sections accordion */}
      <div className="space-y-2 pb-6">
        {consulta.sections.map((section) => {
          const isOpen = openSections.has(section.id);
          return (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{section.title}</p>
                    <p className="text-xs text-gray-400">{section.reference}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-lg font-light">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-rose-50">
                  {section.alert && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3 mb-3">
                      <p className="text-xs font-bold text-red-600">⚠️ {section.alert}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                  <div className="mt-3 inline-block bg-rose-50 text-rose-500 text-xs font-semibold px-2 py-1 rounded-lg">
                    {section.reference}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
