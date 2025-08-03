// Tower of Hanoi PWA Service Worker
// Enables offline functionality and fast loading

const CACHE_NAME = 'hanoi-puzzle-v1.0.0';
const BASE_PATH = '/toh/';

// Assets to cache immediately
const STATIC_ASSETS = [
  `${BASE_PATH}`,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icons/icon.svg`,
  `${BASE_PATH}icons/icon-192x192.png`,
  `${BASE_PATH}icons/icon-512x512.png`,
];

// Dynamic assets that will be cached as they're accessed
const DYNAMIC_CACHE = 'hanoi-dynamic-v1.0.0';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle requests for our app
  if (!url.pathname.startsWith(BASE_PATH)) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // For HTML pages, try network first, then cache
    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirstStrategy(request);
    }
    
    // For static assets, try cache first, then network
    return await cacheFirstStrategy(request);
    
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    
    // Return offline fallback for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(`${BASE_PATH}index.html`) || new Response('Offline');
    }
    
    return new Response('Network error', { status: 408 });
  }
}

// Network first strategy (for HTML)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful network responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  // Try cache first
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Found in cache, return it
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for future use
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Handle background sync (for future features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-game-state') {
    console.log('🔄 Background sync: save-game-state');
    // Future: sync game state when online
  }
});

// Handle push notifications (for future features) 
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('📱 Push notification received:', data);
    
    // Future: show notifications for challenges, tips, etc.
  }
});

// Send messages to clients
function sendMessageToClients(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(message);
    });
  });
}

console.log('🎮 Tower of Hanoi Service Worker loaded');
