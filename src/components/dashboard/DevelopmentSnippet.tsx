import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { MonthMilestones } from '../../types';

interface DevelopmentSnippetProps {
  data: MonthMilestones;
}

export function DevelopmentSnippet({ data }: DevelopmentSnippetProps) {
  const navigate = useNavigate();
  const highlight = data.motor[0] ?? data.cognitive[0] ?? data.social[0];

  return (
    <Card onClick={() => navigate('/desenvolvimento')} className="bg-rose-50 border-rose-200">
      <div className="flex items-start gap-3">
        <span className="text-3xl">⭐</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-rose-400 font-medium uppercase tracking-wide">Desenvolvimento — Mês {data.month}</p>
          <p className="font-bold text-rose-700 mt-0.5 text-sm leading-snug">{data.summary}</p>
          {highlight && (
            <p className="text-xs text-gray-500 mt-1">💡 {highlight.title}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
