const CACHE_NAME = 'dnd-chronicles-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/data.js',
  './js/utils.js',
  './js/characters.js',
  './js/transport.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});