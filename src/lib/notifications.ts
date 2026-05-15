import type { VaccineWithStatus, NotificationPreferences } from '../types';
import { updateNotificationPrefs, loadState } from './storage';

export async function requestNotificationPermission(): Promise<NotificationPreferences> {
  const state = loadState();
  if (!('Notification' in window)) {
    return { ...state.notifications, permissionState: 'denied', enabled: false };
  }

  const result = await Notification.requestPermission();
  const prefs: NotificationPreferences = {
    ...state.notifications,
    permissionState: result,
    enabled: result === 'granted',
    subscribedAt: result === 'granted' ? new Date().toISOString() : undefined,
  };
  updateNotificationPrefs(prefs);
  return prefs;
}

export async function registerPeriodicSync(reg: ServiceWorkerRegistration): Promise<void> {
  try {
    // @ts-ignore - periodicSync is not yet in TypeScript lib
    if ('periodicSync' in reg) {
      // @ts-ignore
      await reg.periodicSync.register('vaccine-check', { minInterval: 86400000 });
    }
  } catch {
    // periodicSync not supported — fallback to session scheduling
  }
}

export function scheduleSessionNotifications(vaccines: VaccineWithStatus[]): void {
  if (Notification.permission !== 'granted') return;

  const overdue = vaccines.filter((v) => v.status === 'overdue');
  const due = vaccines.filter((v) => v.status === 'due');

  // Show once per session after 3 seconds
  setTimeout(() => {
    if (overdue.length > 0) {
      new Notification('⚠️ Vacinas atrasadas da Catarina!', {
        body: `${overdue.length} vacina(s) atrasada(s): ${overdue.slice(0, 2).map((v) => v.name).join(', ')}${overdue.length > 2 ? '...' : ''}`,
        icon: '/icon-192.png',
        tag: 'vaccine-overdue',
      });
    } else if (due.length > 0) {
      new Notification('💉 Vacina chegando!', {
        body: `${due[0].name} está na hora. Abra o app para confirmar.`,
        icon: '/icon-192.png',
        tag: 'vaccine-due',
      });
    }
  }, 3000);
}
