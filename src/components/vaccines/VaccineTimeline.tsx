import type { VaccineWithStatus } from '../../types';
import { VaccineCard } from './VaccineCard';

interface VaccineTimelineProps {
  vaccines: VaccineWithStatus[];
  onMarkDone: (id: string) => void;
  onMarkUndone: (id: string) => void;
}

function groupByAge(vaccines: VaccineWithStatus[]) {
  const groups = new Map<string, VaccineWithStatus[]>();
  for (const v of vaccines) {
    const key = v.ageLabel;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  return groups;
}

export function VaccineTimeline({ vaccines, onMarkDone, onMarkUndone }: VaccineTimelineProps) {
  const groups = groupByAge(vaccines);

  return (
    <div>
      {[...groups.entries()].map(([label, group]) => {
        const allDone = group.every((v) => v.status === 'done');
        const hasOverdue = group.some((v) => v.status === 'overdue');

        return (
          <div key={label} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full shrink-0 ${hasOverdue ? 'bg-red-400' : allDone ? 'bg-green-400' : 'bg-amber-400'}`} />
              <h3 className="font-bold text-gray-700 text-sm">{label}</h3>
              {allDone && <span className="text-xs text-green-600">✓ Completo</span>}
            </div>
            {group.map((v) => (
              <VaccineCard key={v.id} vaccine={v} onMarkDone={onMarkDone} onMarkUndone={onMarkUndone} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
