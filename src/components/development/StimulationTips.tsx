interface StimulationTipsProps {
  tips: string[];
}

export function StimulationTips({ tips }: StimulationTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-4">
      <h3 className="font-bold text-rose-600 mb-3 flex items-center gap-2">
        <span>✨</span> Dicas para esse mês
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-rose-400 shrink-0 font-bold">{i + 1}.</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
