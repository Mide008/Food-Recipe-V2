// Enhanced Service Worker for What's Cooking PWA
const CACHE_NAME = 'whats-cooking-enhanced-v1';
const OFFLINE_URL = '/offline.html';
const API_CACHE_NAME = 'whats-cooking-api-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style-enhanced.css',
  '/main-enhanced.js',
  '/manifest-enhanced.json',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css'
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://www.themealdb.com/api/json/v1/1/search.php?s=',
  'https://www.themealdb.com/api/json/v1/1/random.php'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('Caching API responses');
        return Promise.all(
          API_ENDPOINTS.map(url => 
            fetch(url)
              .then(response => cache.put(url, response))
              .catch(err => console.log('Failed to cache:', url, err))
          )
        );
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network with cache fallback strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (!url.origin.startsWith(self.location.origin)) {
    // Handle API requests with stale-while-revalidate strategy
    if (url.href.includes('themealdb.com')) {
      event.respondWith(handleApiRequest(event.request));
      return;
    }
    return;
  }
  
  // For same-origin requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        // Update cache in background
        fetchAndCache(event.request);
        return cachedResponse;
      }
      
      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache the response if it's valid
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline and not in cache, show offline page for HTML requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Network error', { status: 408 });
        });
    })
  );
});

// Handle API requests with stale-while-revalidate
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Always make network request for fresh data
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      // Cache the fresh response
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Network request failed
      console.log('Network request failed for:', request.url);
    });
  
  // Return cached response immediately, then update from network
  return cachedResponse || fetchPromise;
}

// Fetch and cache in background
function fetchAndCache(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
    })
    .catch(() => {
      // Ignore fetch errors in background update
    });
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-recipes') {
    event.waitUntil(syncRecipes());
  }
});

// Sync recipes in background
async function syncRecipes() {
  // Get failed requests from IndexedDB
  const failedRequests = await getFailedRequests();
  
  // Retry each failed request
  for (const request of failedRequests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        // Remove from failed requests
        await removeFailedRequest(request);
      }
    } catch (error) {
      console.log('Background sync failed for:', request.url);
    }
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'What\'s Cooking';
  const options = {
    body: data.body || 'New recipe suggestion for you!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="%2358CC9D"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="350" fill="white">🍳</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="%2358CC9D"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="350" fill="white">🍳</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no client found, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper functions for background sync
async function getFailedRequests() {
  // Implementation would use IndexedDB
  return [];
}

async function removeFailedRequest(request) {
  // Implementation would use IndexedDB
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-featured-recipes') {
    event.waitUntil(updateFeaturedRecipes());
  }
});

// Update featured recipes in background
async function updateFeaturedRecipes() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    if (response.ok) {
      const data = await response.json();
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put('https://www.themealdb.com/api/json/v1/1/random.php', new Response(JSON.stringify(data)));
      console.log('Featured recipes updated in background');
    }
  } catch (error) {
    console.log('Background update failed:', error);
  }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_RECIPE') {
    const { id, data } = event.data;
    cacheRecipe(id, data);
  }
});

// Cache recipe data
async function cacheRecipe(id, data) {
  const cache = await caches.open(CACHE_NAME);
  const url = `/recipe/${id}`;
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(url, response);
}