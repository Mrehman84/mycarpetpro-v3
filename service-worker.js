// service-worker.js untuk MYCARPET PRO v3.3 (SECURE BYPASS VERSION)
const CACHE_NAME = 'mycarpet-v3';
const urlsToCache = [
  '/mycarpetpro-v3/',
  '/mycarpetpro-v3/index.html',
    '/mycarpetpro-v3/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Memaksa versi baharu diaktifkan serta-merta
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Membuang cache versi lama yang rosak
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // === PEMBETULAN UTAMA: JANGAN SEKAT ATAU SIMPAN CACHE UNTUK API GOOGLE SCRIPT ===
  if (event.request.url.includes('://google.com') || event.request.url.includes('://googleusercontent.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Kekalkan logik cache offline asal untuk fail statik biasa (HTML/Ikon)
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
