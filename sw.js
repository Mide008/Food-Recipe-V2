// Service Worker for What's Cooking PWA
const CACHE_NAME = 'whats-cooking-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // If it's in cache, return it (Fast UI)
            if (response) {
                return response;
            }
            
            // If not in cache, fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Don't cache non-successful responses
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                    return networkResponse;
                }
                
                // Cache the newly fetched resource
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                
                return networkResponse;
            }).catch(() => {
                /**
                 * DESIGN ENGINEER ADDITION: 
                 * If the network fails (offline) and it's an image request, 
                 * return a placeholder instead of a broken icon.
                 */
                if (event.request.destination === 'image') {
                    // This uses a free, high-quality placeholder API 
                    // until you add your own local 'fallback.jpg'
                    return caches.match('https://via.placeholder.com/500x300?text=Image+Offline');
                }
            });
        })
    );
});
// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-shopping-list') {
        event.waitUntil(syncShoppingList());
    }
});

async function syncShoppingList() {
    // Implement shopping list sync logic here
    console.log('[Service Worker] Syncing shopping list');
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'What\'s Cooking';
    const options = {
        body: data.body || 'New recipe available!',
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        data: data.url
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});