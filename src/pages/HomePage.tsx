import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard'; 

const HomePage: React.FC = () => {
    const { kdramas, dataLoading } = useData();
    
    // Sort by year descending for "terbaru" feel
    const sortedKdramas = [...kdramas].sort((a, b) => b.year - a.year);
    const newestKdramas = sortedKdramas.slice(0, 4); 

    return (
        <div className="p-4 pt-16 mb-20">
            <Header title="K-Drama Buddy" showBack={false} />
            
            <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">Selamat Datang!</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-8">Teman sejati Anda untuk rekomendasi K-Drama dan komunitas review yang jujur.</p>

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

            <div className="flex justify-center space-x-4 mt-8">
                <Link to="/list" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg">
                    Lihat Semua Drama
                </Link>
                <Link to="/community" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    Ke Komunitas Review
                </Link>
            </div>
        </div>
    );
};

export default HomePage;