import { useState, useCallback } from 'react';
import type { VaccineWithStatus, VaccineRecord } from '../types';
import { getVaccinesWithStatus } from '../lib/vaccineAlerts';
import { loadState, updateVaccineRecords } from '../lib/storage';

export function useVaccineStatus() {
  const [records, setRecords] = useState<VaccineRecord[]>(() => loadState().vaccines);

  const vaccines: VaccineWithStatus[] = getVaccinesWithStatus(records);

  const markDone = useCallback((vaccineId: string) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.vaccineId !== vaccineId).concat({
        vaccineId,
        doneAt: new Date().toISOString(),
      });
      updateVaccineRecords(updated);
      return updated;
    });
  }, []);

  const markUndone = useCallback((vaccineId: string) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.vaccineId !== vaccineId);
      updateVaccineRecords(updated);
      return updated;
    });
  }, []);

  return { vaccines, records, markDone, markUndone };
}
