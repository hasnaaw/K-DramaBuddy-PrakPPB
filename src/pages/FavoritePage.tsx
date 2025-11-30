import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard';
import { useAuth } from '../auth/AuthProvider';

const FavoritePage: React.FC = () => {
    const { kdramas, favorites, dataLoading } = useContext(DataContext)!;
    const { userId, isGuest } = useAuth();

    const favoriteDramaIds = favorites.filter(fav => fav.user_id === userId).map(fav => fav.drama_id);
    const favoriteKdramas = kdramas.filter(drama => favoriteDramaIds.includes(drama.id));

    return (
            <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
        <img
            src="https://i.pinimg.com/736x/6c/8b/36/6c8b3663b25d1737b3a818ab64a903d1.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold">K-Drama Favorit</h1>
    </div>
</div>
 {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>

            <SectionTitle title="Daftar K-Drama yang Ditandai" />

            {isGuest && (
                <p className="text-yellow-600 dark:text-yellow-400 mb-6 p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                    Anda masuk sebagai Tamu. Silakan login untuk menyimpan daftar favorit Anda.
                </p>
            )}

            {dataLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : favoriteKdramas.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4 border rounded-lg">
                    Belum ada K-Drama dalam daftar favorit Anda.
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {favoriteKdramas.map(drama => <KramaCard key={drama.id} kdrama={drama} />)}
                </div>
            )}
        </div>
    );
};

export default FavoritePage;