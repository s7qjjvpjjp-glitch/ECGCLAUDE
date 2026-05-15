import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import type { VaccineWithStatus } from '../../types';
import { daysUntil, formatDate } from '../../lib/ageUtils';

interface NextVaccineCardProps {
  next: VaccineWithStatus | null;
}

export function NextVaccineCard({ next }: NextVaccineCardProps) {
  const navigate = useNavigate();

  if (!next) {
    return (
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-green-700">Todas as vacinas em dia!</p>
            <p className="text-sm text-green-600">Parabéns pelo cuidado com a Catarina!</p>
          </div>
        </div>
      </Card>
    );
  }

  const days = daysUntil(next.dueDate);

  return (
    <Card onClick={() => navigate('/vacinas')} className="bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💉</span>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Próxima Vacina</p>
            <p className="font-bold text-gray-800 mt-0.5">{next.name}</p>
            <p className="text-sm text-gray-500">{next.ageLabel}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">{formatDate(next.dueDate)}</p>
          <p className={`text-sm font-bold mt-0.5 ${days <= 7 ? 'text-amber-600' : 'text-sky-500'}`}>
            {days <= 0 ? 'Hoje!' : `em ${days} dias`}
          </p>
        </div>
      </div>
    </Card>
  );
}
