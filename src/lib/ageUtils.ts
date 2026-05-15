import type { CatarinaAge } from '../types';

export const CATARINA_BIRTH = new Date('2025-07-06T00:00:00');

export function getCatarinaAge(now: Date = new Date()): CatarinaAge {
  const totalDays = Math.max(
    0,
    Math.floor((now.getTime() - CATARINA_BIRTH.getTime()) / (1000 * 60 * 60 * 24))
  );
  const months = Math.floor(totalDays / 30.4375);
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays - Math.floor(months * 30.4375);

  let label: string;
  if (months === 0) {
    label = `${weeks} semana${weeks !== 1 ? 's' : ''} e ${totalDays % 7} dia${totalDays % 7 !== 1 ? 's' : ''}`;
  } else {
    label = `${months} ${months === 1 ? 'mês' : 'meses'} e ${remainingDays} dia${remainingDays !== 1 ? 's' : ''}`;
  }

  return { totalDays, months, weeks, remainingDays, label };
}

export function getContentMonth(age: CatarinaAge): number {
  return Math.min(Math.max(age.months, 0), 23);
}

export function getVaccineDueDate(ageMonths: number): Date {
  const d = new Date(CATARINA_BIRTH);
  d.setMonth(d.getMonth() + ageMonths);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  return Math.ceil((date.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}
