import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataProvider';
import { SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard'; 

const HomePage: React.FC = () => {
    const { kdramas, dataLoading } = useData();
    
    // Sort by year descending for "terbaru" feel
    const sortedKdramas = [...kdramas].sort((a, b) => b.year - a.year);
    const newestKdramas = sortedKdramas.slice(0, 4); 

    return (
        <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
        <img
            src="https://i.pinimg.com/736x/bd/75/d7/bd75d7086dc3a986c8c21e462e621e63.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold">K-Drama Buddy</h1>
    </div>
</div>

            {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>

            {/* AREA INTRO CANTIK */}
            <div className="text-center px-4">
                <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
                    Selamat Datang! 👋
                </h1>

                <p className="text-md text-gray-600 max-w-2xl mx-auto mb-8">
                    Teman sejati Anda untuk rekomendasi K-Drama dan komunitas review yang jujur.
                </p>
   </div>

            <SectionTitle title="Rekomendasi Terbaru" />
            {dataLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                // PERBAIKAN: Kontainer grid yang benar
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newestKdramas.map(drama => <KramaCard key={drama.id} kdrama={drama} />)}
                </div>
            )}

            <div className="flex justify-center mt-8">
    <Link to="/list" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg">
        Lihat Semua Drama
    </Link>
</div>
        </div>
    );
};

export default HomePage;