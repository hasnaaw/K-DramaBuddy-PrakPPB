import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Logika pendaftaran Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker berhasil didaftarkan:', registration);
      })
      .catch(error => {
        console.error('Pendaftaran Service Worker gagal:', error);
      });
  });
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* APP ROOT YANG MENGANDUNG PROVIDER */}
    <App />
  </React.StrictMode>
);