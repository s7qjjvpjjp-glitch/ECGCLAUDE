import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { NutritionGuide } from '../../types';

interface NutritionSnippetProps {
  data: NutritionGuide;
}

export function NutritionSnippet({ data }: NutritionSnippetProps) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate('/nutricao')} className="bg-peach-50 border-orange-200">
      <div className="flex items-start gap-3">
        <span className="text-3xl">🥗</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-orange-400 font-medium uppercase tracking-wide">Nutrição</p>
          <p className="font-bold text-orange-700 mt-0.5 text-sm">{data.phaseLabel}</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.breastfeedingNote}</p>
        </div>
      </div>
    </Card>
  );
}
