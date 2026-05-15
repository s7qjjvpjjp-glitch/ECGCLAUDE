import type { VaccineEvent, VaccineRecord, VaccineWithStatus, VaccineStatus } from '../types';
import { getVaccineDueDate, addDays } from './ageUtils';
import { VACCINE_SCHEDULE } from '../data/vaccines';

export function computeVaccineStatus(
  vaccine: VaccineEvent,
  records: VaccineRecord[],
  today: Date = new Date()
): VaccineStatus {
  const record = records.find((r) => r.vaccineId === vaccine.id);
  if (record) return 'done';

  const dueDate = getVaccineDueDate(vaccine.ageMonths);
  const graceCutoff = addDays(dueDate, vaccine.gracePeriodDays);
  const dueSoonCutoff = addDays(today, 7);

  if (today > graceCutoff) return 'overdue';
  if (today >= dueDate) return 'due';
  if (dueDate <= dueSoonCutoff) return 'due';
  return 'upcoming';
}

export function getVaccinesWithStatus(
  records: VaccineRecord[],
  today: Date = new Date()
): VaccineWithStatus[] {
  return VACCINE_SCHEDULE.map((v) => ({
    ...v,
    status: computeVaccineStatus(v, records, today),
    dueDate: getVaccineDueDate(v.ageMonths),
    doneAt: records.find((r) => r.vaccineId === v.id)?.doneAt,
  })).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getOverdueVaccines(vaccines: VaccineWithStatus[]): VaccineWithStatus[] {
  return vaccines.filter((v) => v.status === 'overdue');
}

export function getDueVaccines(vaccines: VaccineWithStatus[]): VaccineWithStatus[] {
  return vaccines.filter((v) => v.status === 'due');
}

export function getNextUpcoming(vaccines: VaccineWithStatus[]): VaccineWithStatus | null {
  return vaccines.find((v) => v.status === 'upcoming') ?? null;
}
