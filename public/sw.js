const CACHE_NAME = 'catarina-v1';
const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'App da Catarina', {
      body: data.body || 'Verifique o app da Catarina.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'catarina',
      data: { url: data.url || '/vacinas' },
    })
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'vaccine-check') {
    event.waitUntil(checkVaccines());
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/vacinas';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

async function checkVaccines() {
  try {
    const db = await openDB();
    const state = await getFromDB(db, 'appState');
    if (!state) return;

    const CATARINA_BIRTH = new Date('2025-07-06T00:00:00');
    const today = new Date();
    const records = state.vaccines || [];

    const overdue = [];
    const due = [];

    for (const vaccine of (state.vaccineSchedule || [])) {
      const isDone = records.find((r) => r.vaccineId === vaccine.id);
      if (isDone) continue;

      const dueDate = new Date(CATARINA_BIRTH);
      dueDate.setMonth(dueDate.getMonth() + vaccine.ageMonths);
      const graceCutoff = new Date(dueDate);
      graceCutoff.setDate(graceCutoff.getDate() + 30);

      if (today > graceCutoff) {
        overdue.push(vaccine.name);
      } else if (today >= dueDate) {
        due.push(vaccine.name);
      }
    }

    if (overdue.length > 0) {
      await self.registration.showNotification('⚠️ Vacinas atrasadas!', {
        body: `Catarina tem ${overdue.length} vacina(s) atrasada(s): ${overdue.slice(0, 2).join(', ')}${overdue.length > 2 ? '...' : ''}. Abra o app para ver detalhes.`,
        icon: '/icon-192.png',
        tag: 'vaccine-overdue',
        data: { url: '/vacinas' },
      });
    } else if (due.length > 0) {
      await self.registration.showNotification('💉 Vacina chegando!', {
        body: `${due[0]} está na hora de tomar. Abra o app para confirmar.`,
        icon: '/icon-192.png',
        tag: 'vaccine-due',
        data: { url: '/vacinas' },
      });
    }
  } catch (e) {
    console.error('SW vaccine check error:', e);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('catarina-db', 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('store');
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

function getFromDB(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('store', 'readonly');
    const req = tx.objectStore('store').get(key);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}
