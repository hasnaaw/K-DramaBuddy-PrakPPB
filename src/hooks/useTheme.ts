// Hook useTheme yang dimodifikasi menjadi mode terang (light) permanen
export const useTheme = () => {
    // Karena dark mode dihapus, kita set nilai statis:
    const theme = 'light';
    const isDark = false;
    
    // Fungsi toggleTheme diubah menjadi fungsi kosong
    const toggleTheme = () => {
        // Tidak melakukan apa-apa karena toggle mode sudah dimatikan
        console.log("Toggle theme function is disabled.");
    };

    // Opsional: Untuk memastikan <html> tidak memiliki class 'dark'
    if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
    }
    
    return { theme, isDark, toggleTheme };
};