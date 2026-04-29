const CACHE_NAME = 'habit-tracker-v1';
const ASSETS_TO_CACHE = ['/', '/login', '/signup', '/dashboard'];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // FIX 1: Force immediate activation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // FIX 2: Take control of the current page instantly
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        // Return the cached asset, or fallback to the login shell if navigation fails
        return cachedResponse || caches.match('/login');
      });
    })
  );
});