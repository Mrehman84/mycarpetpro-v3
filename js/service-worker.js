// service-worker.js untuk MYCARPET PRO v3.0
const CACHE_NAME = 'mycarpet-v3';
const urlsToCache = [
  '/mycarpetpro-v3/',
  '/mycarpetpro-v3/index.html',
  '/mycarpetpro-v3/assets/icon-192.png',
  '/mycarpetpro-v3/assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
