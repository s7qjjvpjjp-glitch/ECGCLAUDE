import type { AppState, VaccineRecord, Material, NotificationPreferences } from '../types';

const STORAGE_KEY = 'catarina-app-v1';

const DEFAULT_STATE: AppState = {
  vaccines: [],
  materials: [],
  notifications: {
    enabled: false,
    permissionState: 'default',
    vaccineReminderDaysBefore: 7,
  },
  lastVisited: new Date().toISOString(),
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      vaccines: parsed.vaccines ?? [],
      materials: parsed.materials ?? [],
      notifications: { ...DEFAULT_STATE.notifications, ...(parsed.notifications ?? {}) },
      lastVisited: parsed.lastVisited ?? DEFAULT_STATE.lastVisited,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    mirrorToIndexedDB(state);
  } catch {
    // localStorage may be full or unavailable
  }
}

export function updateVaccineRecords(records: VaccineRecord[]): void {
  const state = loadState();
  saveState({ ...state, vaccines: records });
}

export function updateMaterials(materials: Material[]): void {
  const state = loadState();
  saveState({ ...state, materials });
}

export function updateNotificationPrefs(prefs: NotificationPreferences): void {
  const state = loadState();
  saveState({ ...state, notifications: prefs });
}

function mirrorToIndexedDB(state: AppState): void {
  if (!('indexedDB' in window)) return;
  const req = indexedDB.open('catarina-db', 1);
  req.onupgradeneeded = (e) => {
    (e.target as IDBOpenDBRequest).result.createObjectStore('store');
  };
  req.onsuccess = (e) => {
    const db = (e.target as IDBOpenDBRequest).result;
    const tx = db.transaction('store', 'readwrite');
    tx.objectStore('store').put(state, 'appState');
  };
}
