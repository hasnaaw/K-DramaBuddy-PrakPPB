import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
// Import Hooks & Contexts
import { AuthProvider, useAuth } from './auth/AuthProvider'; 
import { DataProvider } from './contexts/DataProvider';
import { useTheme } from './hooks/useTheme';
import { useNetworkStatus } from './hooks/useNetworkStatus';
// Import Komponen UI Dasar
import { BottomNavbar, NetworkStatusBanner } from './components/ui/Layouts'; 
// Import Halaman
import HomePage from './pages/HomePage'; 
import ListKdramaPage from './pages/ListKdramaPage';
import KdramaDetailPage from './pages/KdramaDetailPage';
import GenreFilterPage from './pages/GenreFilterPage';
import CommunityReviewPage from './pages/CommunityReviewPage';
import ProfilePage from './pages/ProfilePage';
import FavoritePage from './pages/FavoritePage';
import ActorDetailPage from './pages/ActorDetailPage';
import AuthPage from './pages/AuthPage'; 


const Layout = () => {
    const { isDark, toggleTheme } = useTheme();
    const isOnline = useNetworkStatus();
    const { isGuest, loading: authLoading } = useAuth();
    
    // Mendapatkan hash saat ini untuk BottomNavbar
    const currentHash = window.location.hash.substring(1).split('/')[0] || 'home';

    // Tampilkan loading screen jika Auth belum siap
    if (authLoading) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-blue-600 dark:text-blue-400">Memuat Sesi Pengguna...</div>
            </div>
        );
    }
    
    return (
        // PERBAIKAN: Background utama (root) harus merespons class 'dark'
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
            {/* Network Status Banner (Hanya muncul jika offline) */}
            <NetworkStatusBanner isOnline={isOnline} />

            {/* PERBAIKAN: Menambah pb-16 pada main agar konten tidak terpotong Navbar */}
            <main className="mx-auto pb-16">
                
                {/* Definisikan semua rute di sini */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/list" element={<ListKdramaPage />} />
                    <Route path="/genre" element={<GenreFilterPage />} />
                    <Route path="/favorites" element={<FavoritePage />} />
                    <Route path="/community" element={<CommunityReviewPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Rute Detail */}
                    <Route path="/detail/:id" element={<KdramaDetailPage />} />
                    <Route path="/actor/:actorName" element={<ActorDetailPage />} />
                    
                    {/* Rute Otentikasi */}
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/signup" element={<AuthPage mode="signup" />} />

                    <Route path="*" element={<h1 className="p-4 pt-16">404 - Halaman Tidak Ditemukan</h1>} />
                </Routes>
            </main>
            
            {/* Bottom Navbar */}
            <BottomNavbar 
                toggleTheme={toggleTheme} 
                isDark={isDark} 
                isGuest={isGuest} 
            />
        </div>
    );
}

// Komponen Pembungkus Utama (Root)
const App = () => (
    <Router> 
        <AuthProvider>
            <DataProvider>
                <Layout />
            </DataProvider>
        </AuthProvider>
    </Router>
);

export default App;