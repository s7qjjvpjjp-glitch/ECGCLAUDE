import type { FoodItem } from '../../types';

interface FoodListProps {
  title: string;
  emoji: string;
  items: FoodItem[];
  colorClass: string;
}

export function FoodList({ title, emoji, items, colorClass }: FoodListProps) {
  if (items.length === 0) return null;

  return (
    <div className={`rounded-2xl border p-4 ${colorClass}`}>
      <h3 className="font-bold text-sm mb-3">
        {emoji} {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span>{item.emoji}</span>
            <div>
              <span className="font-medium">{item.name}</span>
              {item.notes && <span className="text-xs opacity-70 ml-1">— {item.notes}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
