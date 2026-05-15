import { useCatarinaAge } from '../hooks/useCatarinaAge';
import { useVaccineStatus } from '../hooks/useVaccineStatus';
import { useNotifications } from '../hooks/useNotifications';
import { AgeDisplay } from '../components/dashboard/AgeDisplay';
import { OverdueAlertStrip } from '../components/dashboard/OverdueAlertStrip';
import { NextVaccineCard } from '../components/dashboard/NextVaccineCard';
import { DevelopmentSnippet } from '../components/dashboard/DevelopmentSnippet';
import { NutritionSnippet } from '../components/dashboard/NutritionSnippet';
import { MILESTONES } from '../data/milestones';
import { NUTRITION } from '../data/nutrition';
import { getContentMonth } from '../lib/ageUtils';
import { getNextUpcoming } from '../lib/vaccineAlerts';

export function Home() {
  const age = useCatarinaAge();
  const { vaccines } = useVaccineStatus();
  const { prefs, enable } = useNotifications();

  const contentMonth = getContentMonth(age);
  const milestoneData = MILESTONES[contentMonth];
  const nutritionData = NUTRITION[Math.min(contentMonth, NUTRITION.length - 1)];
  const nextVaccine = getNextUpcoming(vaccines);

  return (
    <div>
      <AgeDisplay age={age} />
      <OverdueAlertStrip vaccines={vaccines} />
      <div className="space-y-3">
        <NextVaccineCard next={nextVaccine} />
        <DevelopmentSnippet data={milestoneData} />
        <NutritionSnippet data={nutritionData} />
      </div>

      {prefs.permissionState === 'default' && (
        <div className="mt-4 bg-rose-100 rounded-2xl p-4 border border-rose-200">
          <p className="text-sm font-semibold text-rose-700 mb-2">
            🔔 Ativar notificações de vacinas
          </p>
          <p className="text-xs text-rose-500 mb-3">
            Receba alertas quando uma vacina estiver chegando ou atrasada.
          </p>
          <button
            onClick={() => enable(vaccines)}
            className="w-full bg-rose-500 text-white font-bold py-2.5 rounded-xl text-sm active:bg-rose-600"
          >
            Ativar notificações
          </button>
        </div>
      )}

      <p className="text-center text-xs text-rose-200 mt-6">
        feito com amor para a Catarina 🌸
      </p>
    </div>
  );
}
