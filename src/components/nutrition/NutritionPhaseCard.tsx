import type { NutritionGuide } from '../../types';

interface NutritionPhaseCardProps {
  data: NutritionGuide;
}

export function NutritionPhaseCard({ data }: NutritionPhaseCardProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="text-4xl">🍽️</span>
        <div>
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Mês {data.month}</p>
          <h2 className="font-bold text-orange-700 text-base leading-snug mt-0.5">{data.phaseLabel}</h2>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-3 leading-relaxed">{data.summary}</p>
      <div className="mt-3 flex gap-4 text-sm">
        {data.mealsPerDay > 0 && (
          <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-orange-100">
            <span>🍽️</span>
            <span className="font-semibold text-orange-700">{data.mealsPerDay} refeições/dia</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 border border-orange-100 flex-1">
          <span>📏</span>
          <span className="text-xs text-gray-600">{data.texture}</span>
        </div>
      </div>
      <div className="mt-3 bg-white rounded-xl p-3 border border-orange-100">
        <p className="text-xs font-semibold text-rose-500 mb-1">🤱 Amamentação</p>
        <p className="text-xs text-gray-600 leading-relaxed">{data.breastfeedingNote}</p>
      </div>
    </div>
  );
}
