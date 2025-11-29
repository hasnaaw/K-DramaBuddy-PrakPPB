import { useState, useEffect } from 'react';

// Hook untuk mengelola tema (light/dark mode) menggunakan localStorage
export const useTheme = () => {
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPref = window.localStorage.getItem('theme');
            if (storedPref) return storedPref;
            // Default ke preferensi sistem jika tidak ada di localStorage
            const systemPref = window.matchMedia('(prefers-color-scheme: dark)');
            if (systemPref.matches) return 'dark';
        }
        return 'light'; // Default fallback
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        // Hapus class tema lama dan tambahkan tema baru
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        // Simpan preferensi ke localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const isDark = theme === 'dark';

    return { theme, isDark, toggleTheme };
};