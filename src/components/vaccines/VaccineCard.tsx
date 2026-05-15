import { useState } from 'react';
import type { VaccineWithStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/ageUtils';

interface VaccineCardProps {
  vaccine: VaccineWithStatus;
  onMarkDone: (id: string) => void;
  onMarkUndone: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  done: 'border-green-200 bg-green-50',
  upcoming: 'border-sky-100 bg-white',
  due: 'border-amber-200 bg-amber-50',
  overdue: 'border-red-300 bg-red-50',
};

export function VaccineCard({ vaccine, onMarkDone, onMarkUndone }: VaccineCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border p-4 mb-3 ${STATUS_COLORS[vaccine.status]}`}>
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-800 text-sm">{vaccine.fullName}</span>
                {vaccine.doses && (
                  <span className="text-xs text-gray-400">• {vaccine.doses}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{vaccine.ageLabel} — {formatDate(vaccine.dueDate)}</p>
            </div>
          </div>
        </button>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge status={vaccine.status} />
          {vaccine.status !== 'done' ? (
            <button
              onClick={() => onMarkDone(vaccine.id)}
              className="text-xs bg-rose-500 text-white rounded-full px-3 py-1 font-semibold active:bg-rose-600"
            >
              Marcar feita
            </button>
          ) : (
            <button
              onClick={() => onMarkUndone(vaccine.id)}
              className="text-xs text-gray-400 underline"
            >
              Desfazer
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100 leading-relaxed">
          {vaccine.description}
        </p>
      )}
      {vaccine.doneAt && (
        <p className="text-xs text-green-600 mt-1">
          ✓ Tomada em {new Date(vaccine.doneAt).toLocaleDateString('pt-BR')}
        </p>
      )}
    </div>
  );
}
