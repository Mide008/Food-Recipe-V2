// Service Worker for Recipe Finder PWA
const CACHE_NAME = 'recipe-finder-v1.0.0';
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
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.error('[Service Worker] Cache failed:', err);
            });
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

// Fetch event - Network First with Cache Fallback Strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin && !url.origin.includes('googleapis') && !url.origin.includes('cloudflare')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                // Cache API responses and images
                if (request.method === 'GET' && (
                    url.pathname.endsWith('.jpg') ||
                    url.pathname.endsWith('.png') ||
                    url.pathname.endsWith('.webp') ||
                    url.pathname.includes('/api/')
                )) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request).then((response) => {
                    if (response) {
                        return response;
                    }

                    // If it's an image request and not in cache, return placeholder
                    if (request.destination === 'image') {
                        return new Response(
                            '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#F3F4F6"/><text x="50%" y="50%" text-anchor="middle" fill="#9CA3AF" font-family="Arial" font-size="14">Image Offline</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }

                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/index.html');
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
    if (event.tag === 'sync-saved-recipes') {
        event.waitUntil(syncSavedRecipes());
    }
});

async function syncShoppingList() {
    console.log('[Service Worker] Syncing shopping list');
    // Implement shopping list sync logic here
    // This would sync any offline changes when connection is restored
}

async function syncSavedRecipes() {
    console.log('[Service Worker] Syncing saved recipes');
    // Implement saved recipes sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Recipe Finder';
    const options = {
        body: data.body || 'Check out new recipes!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            {
                action: 'view',
                title: 'View Recipe'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data.url || '/';
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((windowClients) => {
                    // Check if there's already a window open
                    for (let client of windowClients) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Open new window if none exists
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    }
});

// Message handling from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                return self.clients.claim();
            })
        );
    }
});

// Periodic background sync (requires permission)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'daily-recipe-update') {
        event.waitUntil(updateDailyRecipes());
    }
});

async function updateDailyRecipes() {
    console.log('[Service Worker] Updating daily recipes');
    // Fetch and cache new daily recipes
}
