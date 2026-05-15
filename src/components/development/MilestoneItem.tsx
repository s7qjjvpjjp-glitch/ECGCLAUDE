import { useState } from 'react';
import type { Milestone } from '../../types';

interface MilestoneItemProps {
  milestone: Milestone;
}

export function MilestoneItem({ milestone }: MilestoneItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-rose-100 p-3 mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-800 text-sm leading-snug">{milestone.title}</p>
          <span className="text-gray-400 shrink-0 text-sm mt-0.5">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
          <div className="bg-rose-50 rounded-lg p-2">
            <p className="text-xs font-semibold text-rose-500 mb-0.5">💡 Como estimular</p>
            <p className="text-xs text-gray-600 leading-relaxed">{milestone.howToStimulate}</p>
          </div>
        </div>
      )}
    </div>
  );
}
