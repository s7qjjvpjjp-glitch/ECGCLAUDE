import { useState } from 'react';
import type { Milestone, DevelopmentDomain } from '../../types';
import { MilestoneItem } from './MilestoneItem';

interface MilestoneSectionProps {
  domain: DevelopmentDomain;
  milestones: Milestone[];
}

const DOMAIN_CONFIG: Record<DevelopmentDomain, { label: string; emoji: string; color: string }> = {
  motor: { label: 'Motor', emoji: '🏃', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  cognitive: { label: 'Cognitivo', emoji: '🧠', color: 'bg-lavender-100 text-purple-700 border-purple-200' },
  social: { label: 'Social', emoji: '💛', color: 'bg-peach-100 text-orange-700 border-orange-200' },
  language: { label: 'Linguagem', emoji: '💬', color: 'bg-mint-100 text-green-700 border-green-200' },
};

export function MilestoneSection({ domain, milestones }: MilestoneSectionProps) {
  const [open, setOpen] = useState(true);
  const cfg = DOMAIN_CONFIG[domain];

  if (milestones.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border font-semibold text-sm mb-2 ${cfg.color}`}
      >
        <span>{cfg.emoji} {cfg.label}</span>
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>
      {open && milestones.map((m) => <MilestoneItem key={m.id} milestone={m} />)}
    </div>
  );
}
