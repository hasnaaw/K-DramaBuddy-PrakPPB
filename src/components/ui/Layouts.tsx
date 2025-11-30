import React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useNetworkStatus } from '../../hooks/useNetworkStatus'; 

// ------------------------------------------------------------------
// A. ICON & BUTTONS UTILITY
// ------------------------------------------------------------------

const Icon = ({ path, size = 20, fill = 'none' }: { path: string, size?: number, fill?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
    </svg>
);

const HeartIcon = ({ fill, size = 20 }: { fill: boolean, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
    </svg>
);

// ------------------------------------------------------------------
// B. BOTTOM NAVIGATION BAR
// ------------------------------------------------------------------

interface NavItemProps {
    to: string;
    icon: ReactNode;
    label: string;
    currentPath: string; // Tipe ini tetap diperlukan di sini untuk props internal
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, currentPath }) => {
    
    const location = useLocation(); 
    const rootPath = to.split('/')[1] || 'home';
    const activeRoute = location.pathname.split('/')[1] || 'home';

    const isActive = activeRoute === rootPath;

    const activeClass = isActive
        ? 'text-white bg-blue-600 dark:bg-blue-600 text-white shadow-lg transition-all'
        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors';
    
    return (
        <Link to={to} className="flex-1 text-center py-2">
            <div className={`
                flex flex-col items-center justify-center p-1 mx-2 transition-all duration-300 rounded-xl
                ${isActive ? activeClass : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors'}
            `}>
                <div className={`p-1 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {icon}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {label}
                </span>
            </div>
        </Link>
    );
};

interface BottomNavbarProps {
    // PERBAIKAN: currentPath dihapus dari prop wajib
    toggleTheme: () => void;
    isDark: boolean;
    isGuest: boolean;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ toggleTheme, isDark, isGuest }) => {
    
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1] || 'home'; // Ambil rute dasar ('home', 'genre', dll)

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
            <nav className="max-w-xl mx-auto flex justify-around h-16 py-2 pb-safe-bottom"> 
                {/* Gunakan currentPath yang diambil dari useLocation di NavItem */}
                <NavItem to="/home" label="Home" currentPath={currentPath} icon={<Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-2 2m2-2v10a1 1 0 01-1 1h-3m-6 0h6m-6 0h.01" />} />
                <NavItem to="/genre" label="Genre" currentPath={currentPath} icon={<Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m0 0h18" />} />
                <NavItem to="/favorites" label="Favorit" currentPath={currentPath} icon={<HeartIcon fill={currentPath === 'favorites'} />} />
                <NavItem to="/community" label="Komunitas" currentPath={currentPath} icon={<Icon path="M17 20h-1a4 4 0 01-4-4V7a4 4 0 014-4h1m-1 0a4 4 0 014 4v9a4 4 0 01-4 4" />} />
                <NavItem to="/profile" label="Profil" currentPath={currentPath} icon={<Icon path="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />} />

                {/* Tombol Dark/Light Mode (Desktop/Large Screen Only) */}
                <button 
                    onClick={toggleTheme} 
                    className="hidden md:flex ml-4 p-2 self-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full transition-colors"
                >
                    {isDark ? (
                        <Icon path="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                    ) : (
                        <Icon path="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    )}
                </button>
            </nav>
        </div>
    );
};

// ------------------------------------------------------------------
// C. HEADER & STATUS BANNERS
// ------------------------------------------------------------------

interface HeaderProps {
    title: string;
    showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
    
    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.back();
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-xl mx-auto flex items-center">
                {showBack && (
                    <button onClick={handleBack} className="mr-4 text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                )}
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
            </div>
        </header>
    );
};

interface NetworkStatusBannerProps {
    isOnline: boolean;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({ isOnline }) => {
    
    if (isOnline) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-2 text-center bg-red-600 text-white font-semibold text-sm shadow-xl">
            Anda sedang OFFLINE. Data mungkin tidak terbaru.
        </div>
    );
};

// ------------------------------------------------------------------
// D. UTILITY & SKELETON
// ------------------------------------------------------------------

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-6">{title}</h2>
);

export const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="relative h-60 w-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="p-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
    </div>
);