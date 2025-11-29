import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Contexts & Hooks
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { DataProvider } from './contexts/DataProvider';
import { useTheme } from './hooks/useTheme';
import { useNetworkStatus } from './hooks/useNetworkStatus';

// UI Components (dipisah file)
import BottomNavbar from './components/ui/BottomNavbar';
import Header from './components/ui/Header';
import NetworkStatusBanner from './components/ui/NetworkStatusBanner';

// Pages
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

    const currentHash = window.location.hash.substring(1).split('/')[0] || 'home';

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-blue-600 dark:text-blue-400">Memuat Sesi Pengguna...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

            <NetworkStatusBanner isOnline={isOnline} />

            <main className="max-w-xl mx-auto pb-16">

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/list" element={<ListKdramaPage />} />
                    <Route path="/genre" element={<GenreFilterPage />} />
                    <Route path="/favorites" element={<FavoritePage />} />
                    <Route path="/community" element={<CommunityReviewPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/detail/:id" element={<KdramaDetailPage />} />
                    <Route path="/actor/:actorName" element={<ActorDetailPage />} />

                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/signup" element={<AuthPage mode="signup" />} />

                    <Route path="*" element={<h1 className="p-4 pt-16">404 - Halaman Tidak Ditemukan</h1>} />
                </Routes>
            </main>

            <BottomNavbar
                currentPath={currentHash}
                toggleTheme={toggleTheme}
                isDark={isDark}
                isGuest={isGuest}
            />
        </div>
    );
};

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
