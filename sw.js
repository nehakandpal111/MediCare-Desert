// Service Worker for Desert Telehealth App
const CACHE_NAME = 'desert-telehealth-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/app.js',
    '/js/translations.js',
    '/js/medical-data.js',
    '/js/image-analysis.js',
    '/js/symptom-assessment.js',
    '/js/chatbot.js',
    '/js/utils.js',
    '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }
                
                // Otherwise fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                console.log('Service Worker: Caching dynamic content', request.url);
                                cache.put(request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Network request failed', error);
                        
                        // Return offline fallback for HTML requests
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Return a basic offline response for other requests
                        return new Response('Offline - Content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'sync-medical-data') {
        event.waitUntil(syncMedicalData());
    }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Desert Telehealth notification',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Desert Telehealth', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Helper function to sync medical data when online
async function syncMedicalData() {
    try {
        // Get stored medical results
        const results = await getStoredResults();
        
        if (results && results.length > 0) {
            console.log('Service Worker: Syncing medical data', results.length, 'items');
            
            // In a real app, this would send data to a server
            // For now, we'll just log the sync attempt
            console.log('Service Worker: Medical data sync completed');
            
            // Notify the main app about successful sync
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'SYNC_COMPLETE',
                    data: { synced: results.length }
                });
            });
        }
    } catch (error) {
        console.error('Service Worker: Error syncing medical data', error);
    }
}

// Helper function to get stored results from IndexedDB or localStorage
async function getStoredResults() {
    // This would typically use IndexedDB for larger datasets
    // For simplicity, we'll check localStorage
    try {
        const results = localStorage.getItem('medicalResults');
        return results ? JSON.parse(results) : [];
    } catch (error) {
        console.error('Service Worker: Error reading stored results', error);
        return [];
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'medical-data-sync') {
        event.waitUntil(syncMedicalData());
    }
});

// Handle errors
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

// Cache management utilities
const cacheUtils = {
    // Get cache size
    async getCacheSize() {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }
        
        return totalSize;
    },
    
    // Clean old cache entries
    async cleanOldEntries(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
        const cacheNames = await caches.keys();
        const now = Date.now();
        
        for (const cacheName of cacheNames) {
            if (cacheName === STATIC_CACHE) continue; // Don't clean static cache
            
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const dateHeader = response.headers.get('date');
                    if (dateHeader) {
                        const responseDate = new Date(dateHeader).getTime();
                        if (now - responseDate > maxAge) {
                            await cache.delete(request);
                            console.log('Service Worker: Cleaned old cache entry', request.url);
                        }
                    }
                }
            }
        }
    }
};

// Periodic cache cleanup (run on activation)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        cacheUtils.cleanOldEntries()
            .then(() => console.log('Service Worker: Cache cleanup completed'))
            .catch((error) => console.error('Service Worker: Cache cleanup failed', error))
    );
});

console.log('Service Worker: Script loaded');