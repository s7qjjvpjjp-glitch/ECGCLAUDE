import type { CatarinaAge } from '../../types';

interface AgeDisplayProps {
  age: CatarinaAge;
}

export function AgeDisplay({ age }: AgeDisplayProps) {
  return (
    <div className="text-center py-4">
      <div className="text-4xl mb-1">🌸</div>
      <h1 className="text-2xl font-bold text-rose-600 leading-tight">Catarina</h1>
      <p className="text-rose-400 font-medium mt-1">
        tem <span className="text-rose-600 font-bold">{age.label}</span>
      </p>
      <p className="text-xs text-rose-300 mt-1">nascida em 06/07/2025</p>
    </div>
  );
}
