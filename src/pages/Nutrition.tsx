import { useState } from 'react';
import { useCatarinaAge } from '../hooks/useCatarinaAge';
import { NutritionPhaseCard } from '../components/nutrition/NutritionPhaseCard';
import { FoodList } from '../components/nutrition/FoodList';
import { NUTRITION } from '../data/nutrition';
import { getContentMonth } from '../lib/ageUtils';

export function Nutrition() {
  const age = useCatarinaAge();
  const currentMonth = getContentMonth(age);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const data = NUTRITION[Math.min(selectedMonth, NUTRITION.length - 1)];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-orange-600">Nutrição 🥗</h1>
        <p className="text-sm text-gray-500">Alimentação saudável para cada fase</p>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-orange-100 p-3 mb-4">
        <button
          onClick={() => setSelectedMonth((m) => Math.max(0, m - 1))}
          disabled={selectedMonth === 0}
          className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 font-bold text-lg disabled:opacity-30"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold text-orange-600 text-lg">Mês {selectedMonth}</p>
          {selectedMonth === currentMonth && (
            <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-semibold">
              Mês atual
            </span>
          )}
        </div>
        <button
          onClick={() => setSelectedMonth((m) => Math.min(23, m + 1))}
          disabled={selectedMonth === 23}
          className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 font-bold text-lg disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <NutritionPhaseCard data={data} />

      {data.portions && (
        <div className="bg-white rounded-2xl border border-orange-100 p-4 mb-4">
          <p className="text-xs font-semibold text-orange-500 mb-1">📏 Porções</p>
          <p className="text-sm text-gray-600">{data.portions}</p>
        </div>
      )}

      <div className="space-y-3">
        {data.introduce.length > 0 && (
          <FoodList
            title="Introduzir este mês"
            emoji="✨"
            items={data.introduce}
            colorClass="bg-amber-50 border-amber-200 text-amber-900"
          />
        )}
        {data.allowed.length > 0 && (
          <FoodList
            title="Pode comer"
            emoji="✅"
            items={data.allowed}
            colorClass="bg-green-50 border-green-200 text-green-900"
          />
        )}
        {data.avoid.length > 0 && (
          <FoodList
            title="Evitar sempre"
            emoji="⛔"
            items={data.avoid}
            colorClass="bg-red-50 border-red-200 text-red-900"
          />
        )}
      </div>
    </div>
  );
}
