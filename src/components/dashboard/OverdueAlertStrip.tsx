import { useNavigate } from 'react-router-dom';
import type { VaccineWithStatus } from '../../types';

interface OverdueAlertStripProps {
  vaccines: VaccineWithStatus[];
}

export function OverdueAlertStrip({ vaccines }: OverdueAlertStripProps) {
  const navigate = useNavigate();
  const overdue = vaccines.filter((v) => v.status === 'overdue');
  const due = vaccines.filter((v) => v.status === 'due');

  if (overdue.length === 0 && due.length === 0) return null;

  const isOverdue = overdue.length > 0;
  const list = isOverdue ? overdue : due;
  const names = list.slice(0, 2).map((v) => v.name).join(', ') + (list.length > 2 ? '...' : '');

  return (
    <button
      onClick={() => navigate('/vacinas')}
      className={`w-full text-left rounded-2xl p-4 mb-4 flex items-start gap-3 active:opacity-80 transition-opacity ${
        isOverdue
          ? 'bg-red-500 text-white'
          : 'bg-amber-400 text-amber-900'
      }`}
    >
      <span className="text-2xl">{isOverdue ? '⚠️' : '💉'}</span>
      <div>
        <p className="font-bold text-sm">
          {isOverdue
            ? `${overdue.length} vacina${overdue.length > 1 ? 's' : ''} atrasada${overdue.length > 1 ? 's' : ''}!`
            : `${due.length} vacina${due.length > 1 ? 's' : ''} na hora!`}
        </p>
        <p className="text-xs opacity-90 mt-0.5">{names} — toque para ver detalhes</p>
      </div>
    </button>
  );
}
