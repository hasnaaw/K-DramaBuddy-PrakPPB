// Nama cache
const CACHE_NAME = 'kdbuddy-cache-v1';

// Daftar aset statis yang akan di-cache
// Perhatikan: /index.html adalah halaman utama, /offline.html adalah fallback
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    // Tambahkan jalur ke aset build Vite yang stabil (misalnya CSS/JS hasil build)
    // Dalam fase pengembangan, daftarkan aset statis dasar:
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png'
];

// Event: Install (Mencache aset statis)
self.addEventListener('install', (event) => {
    console.log('Service Worker: Menginstal dan Mencache aset statis...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache).catch(err => {
                    console.error('Service Worker: Gagal mencache sebagian aset:', err);
                });
            })
            .then(() => self.skipWaiting()) // Memaksa service worker baru untuk mengambil kontrol
    );
});

// Event: Activate (Membersihkan cache lama)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim()); // Mengambil kendali dari semua klien
});

// Event: Fetch (Strategi Cache-First dengan Network Fallback)
self.addEventListener('fetch', (event) => {
    // Hanya tangani permintaan HTTP/S
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - kembalikan respons dari cache
                if (response) {
                    return response;
                }

                // Tidak ada di cache - coba dari jaringan
                return fetch(event.request).then(
                    (response) => {
                        // Cek jika kita menerima respons yang valid (status 200)
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Klon respons agar dapat digunakan oleh browser dan cache
                        const responseToCache = response.clone();
                        
                        // Opsional: Hanya cache aset/API yang relevan di sini jika perlu
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(() => {
                    // Jaringan gagal. Kembalikan fallback offline untuk navigasi.
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});