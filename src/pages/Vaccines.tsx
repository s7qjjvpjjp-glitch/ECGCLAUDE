import { useVaccineStatus } from '../hooks/useVaccineStatus';
import { useNotifications } from '../hooks/useNotifications';
import { VaccineTimeline } from '../components/vaccines/VaccineTimeline';
import { AlertBanner } from '../components/ui/AlertBanner';
import { getOverdueVaccines, getDueVaccines } from '../lib/vaccineAlerts';

export function Vaccines() {
  const { vaccines, markDone, markUndone } = useVaccineStatus();
  const { prefs, enable } = useNotifications();

  const overdue = getOverdueVaccines(vaccines);
  const due = getDueVaccines(vaccines);
  const done = vaccines.filter((v) => v.status === 'done').length;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-rose-600">Vacinas 💉</h1>
        <p className="text-sm text-gray-500">Calendário Nacional de Vacinação — SUS 2024</p>
      </div>

      {overdue.length > 0 && (
        <div className="mb-3">
          <AlertBanner
            type="error"
            message={`⚠️ ${overdue.length} vacina${overdue.length > 1 ? 's' : ''} atrasada${overdue.length > 1 ? 's' : ''}: ${overdue.map((v) => v.name).join(', ')}`}
          />
        </div>
      )}

      {due.length > 0 && overdue.length === 0 && (
        <div className="mb-3">
          <AlertBanner
            type="warning"
            message={`💉 ${due.length} vacina${due.length > 1 ? 's' : ''} na hora: ${due.map((v) => v.name).join(', ')}`}
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-rose-100 p-4 mb-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{done}</p>
            <p className="text-xs text-gray-500">Tomadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-500">{due.length}</p>
            <p className="text-xs text-gray-500">Na hora</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{overdue.length}</p>
            <p className="text-xs text-gray-500">Atrasadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-sky-500">{vaccines.length - done - due.length - overdue.length}</p>
            <p className="text-xs text-gray-500">Futuras</p>
          </div>
        </div>
      </div>

      {prefs.permissionState !== 'granted' && (
        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-3 mb-4 flex items-center gap-3">
          <span className="text-xl">🔔</span>
          <div className="flex-1">
            <p className="text-xs text-rose-700 font-semibold">Ativar alertas de vacina</p>
          </div>
          <button
            onClick={() => enable(vaccines)}
            className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-full font-semibold"
          >
            Ativar
          </button>
        </div>
      )}

      <VaccineTimeline vaccines={vaccines} onMarkDone={markDone} onMarkUndone={markUndone} />
    </div>
  );
}
