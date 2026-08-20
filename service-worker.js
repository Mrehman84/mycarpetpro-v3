// service-worker.js untuk MYCARPET PRO v3.3 (UPDATED)
// Menggunakan strategi network-first untuk HTML, cache untuk aset statik

const CACHE_NAME = 'mycarpet-v3.3-' + new Date().toISOString().slice(0, 10); // Auto version setiap hari
const urlsToCache = [
  '/mycarpetpro-v3/icon-512.png',
  // Jangan cache index.html – biar sentiasa muat versi terkini
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Aktifkan service worker baharu serta-merta
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Buang cache lama
          }
        })
      );
    })
  );
  self.clients.claim(); // Ambil alih semua tab
});

self.addEventListener('fetch', event => {
  // 1. Langkau cache untuk panggilan API Google Apps Script
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleusercontent.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Untuk index.html – gunakan network-first (cuba internet, jika gagal cache)
  if (event.request.url.includes('index.html')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Untuk aset lain (icon, dsb.) – cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
