import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 1. Kofigurasi Dasar
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      
      
      
      // 3. Aset yang harus di-cache (termasuk ikon)
      includeAssets: [
        'favicon.ico', 
        'vite.svg', 
        'react.svg',
        'Hsm-icon-192x192.png' // Pastikan nama ini sesuai
      ],
      
      // 4. Konfigurasi Manifest
      manifest: {
        name: 'K-Drama Buddy App', // Nama Lengkap
        short_name: 'KDBuddy',     // Nama Singkat
        description: 'Aplikasi rekomendasi K-Drama dengan fitur komunitas & review.',
        theme_color: '#2563EB',      // Warna tema (sesuai proyek Anda)
        background_color: '#ffffff', // Warna latar belakang
        display: 'standalone',       // Tampil seperti aplikasi native (Wajib)
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        
        // 5. Konfigurasi Ikon
        icons: [
          // Ikon 192x192 (Any Purpose)
          {
            src: '/Hsm-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          // Ikon 192x192 (Maskable)
          {
            src: '/Hsm-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          // Ikon 512x512 (Any Purpose)
          {
            src: '/Hsm-icon-192x192.png', // Menggunakan Hsm-icon-192x192.png sebagai sumber (VitePWA akan me-resize)
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          // Ikon 512x512 (Maskable)
          {
            src: '/Hsm-icon-192x192.png', // Menggunakan Hsm-icon-192x192.png sebagai sumber
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      
      // 6. Opsi Development
      devOptions: {
        enabled: true, // Wajib agar PWA aktif saat npm run dev
      },

      // 7. Workbox (Strategi Caching) - Menggantikan konfigurasi Workbox manual
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,json}'],
        // Strategi API Workbox Anda yang sebelumnya
        runtimeCaching: [
            {
                urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co'),
                handler: 'NetworkOnly',
                options: {
                    cacheName: 'supabase-api',
                },
            },
        ],
      },
    }),
  ],
});