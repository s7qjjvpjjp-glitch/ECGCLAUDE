import { useState } from 'react';
import { useCatarinaAge } from '../hooks/useCatarinaAge';
import { MilestoneSection } from '../components/development/MilestoneSection';
import { StimulationTips } from '../components/development/StimulationTips';
import { MILESTONES } from '../data/milestones';
import { getContentMonth } from '../lib/ageUtils';

export function Development() {
  const age = useCatarinaAge();
  const currentMonth = getContentMonth(age);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const data = MILESTONES[selectedMonth];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-rose-600">Desenvolvimento 🌱</h1>
        <p className="text-sm text-gray-500">O que esperar de cada fase da Catarina</p>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-rose-100 p-3 mb-4">
        <button
          onClick={() => setSelectedMonth((m) => Math.max(0, m - 1))}
          disabled={selectedMonth === 0}
          className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 font-bold text-lg disabled:opacity-30 active:bg-rose-100"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold text-rose-600 text-lg">Mês {data.month}</p>
          {selectedMonth === currentMonth && (
            <span className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full font-semibold">
              Mês atual
            </span>
          )}
        </div>
        <button
          onClick={() => setSelectedMonth((m) => Math.min(23, m + 1))}
          disabled={selectedMonth === 23}
          className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 font-bold text-lg disabled:opacity-30 active:bg-rose-100"
        >
          ›
        </button>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-4 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
      </div>

      <MilestoneSection domain="motor" milestones={data.motor} />
      <MilestoneSection domain="cognitive" milestones={data.cognitive} />
      <MilestoneSection domain="social" milestones={data.social} />
      <MilestoneSection domain="language" milestones={data.language} />
      <StimulationTips tips={data.tips} />
    </div>
  );
}
