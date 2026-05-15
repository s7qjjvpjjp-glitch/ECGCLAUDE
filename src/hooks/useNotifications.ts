import { useState, useCallback } from 'react';
import type { NotificationPreferences } from '../types';
import { loadState } from '../lib/storage';
import { requestNotificationPermission, registerPeriodicSync, scheduleSessionNotifications } from '../lib/notifications';
import type { VaccineWithStatus } from '../types';

export function useNotifications() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => loadState().notifications);

  const enable = useCallback(async (vaccines: VaccineWithStatus[]) => {
    const updated = await requestNotificationPermission();
    setPrefs(updated);

    if (updated.enabled && 'serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await registerPeriodicSync(reg);
      scheduleSessionNotifications(vaccines);
    }
    return updated;
  }, []);

  return { prefs, enable };
}
