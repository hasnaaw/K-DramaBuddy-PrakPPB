/// <reference lib="webworker"/>
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' 

// HAPUS: Deklarasi 'self' yang menyebabkan error ServiceWorkerGlobalScope

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Daftarkan service worker secara otomatis
      injectRegister: 'auto',     // Memasukkan skrip pendaftaran ke index.html
      devOptions: {
        enabled: true // Aktifkan di lingkungan dev untuk pengujian
      },
      manifest: { // Konfigurasi Manifes Dasar (menggantikan manifest.json di public/)
        name: 'K-Drama Buddy',
        short_name: 'KDBuddy',
        description: 'Aplikasi rekomendasi K-Drama dengan fitur komunitas & review.',
        theme_color: '#2563EB',
        icons: [
          // Catatan: Pastikan file ikon ini ada di public/ atau di folder yang benar
          {
            src: '/assets/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Daftar aset yang akan di cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,json}'],
        
        // Aturan khusus: Cache first untuk aset dan fallback offline.
        runtimeCaching: [
          {
            // PERBAIKAN: Type checking sekarang diatasi oleh triple-slash directive di atas.
            urlPattern: ({ url }) => url.origin === self.location.origin, 
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
            },
          },
          // Strategi NetworkOnly untuk Supabase API (agar selalu mendapatkan data terbaru)
          {
            urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co'),
            handler: 'NetworkOnly',
            options: {
                cacheName: 'supabase-api',
            },
          },
        ],
      }
    }),
  ],
})