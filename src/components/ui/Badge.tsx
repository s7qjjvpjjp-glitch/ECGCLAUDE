import type { VaccineStatus } from '../../types';

interface BadgeProps {
  status: VaccineStatus;
}

const CONFIG: Record<VaccineStatus, { label: string; className: string }> = {
  done: { label: 'Tomada ✓', className: 'bg-green-100 text-green-700 border-green-200' },
  upcoming: { label: 'Agendada', className: 'bg-sky-50 text-sky-600 border-sky-200' },
  due: { label: 'Na hora!', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  overdue: { label: 'Atrasada!', className: 'bg-red-100 text-red-700 border-red-200' },
};

export function Badge({ status }: BadgeProps) {
  const cfg = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
