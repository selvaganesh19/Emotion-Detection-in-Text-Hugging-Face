const CACHE_NAME = 'emotion-detection-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/android-icon-192x192.png',
  './icons/android-icon-144x144.png',
  './icons/android-icon-96x96.png',
  './icons/android-icon-72x72.png',
  './icons/android-icon-48x48.png',
  './icons/android-icon-36x36.png',
  './icons/apple-icon-57x57.png',
  './icons/apple-icon-60x60.png',
  './icons/apple-icon-72x72.png',
  './icons/apple-icon-76x76.png',
  './icons/apple-icon-114x114.png',
  './icons/apple-icon-120x120.png',
  './icons/apple-icon-144x144.png',
  './icons/apple-icon-152x152.png',
  './icons/apple-icon-180x180.png',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/favicon-96x96.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});