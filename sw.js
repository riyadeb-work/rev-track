const CACHE_NAME = 'rev-track-cache-v1';

// Install event - Cache core files so the app can load even without internet
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json'
            ]);
        })
    );
});

// Fetch event - This is REQUIRED by Chrome to trigger the native WebAPK installation.
// It tries to fetch from the network first, and falls back to the cache if offline.
self.addEventListener('fetch', (event) => {
    // Only cache GET requests (ignore Firebase POST database calls)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// Activate event - Cleans up old caches if you ever update the CACHE_NAME
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});