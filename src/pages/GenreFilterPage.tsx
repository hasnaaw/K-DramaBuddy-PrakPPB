import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard';

const GENRES = ['Romance', 'Comedy', 'Thriller', 'Revenge', 'Legal', 'Survival', 'Fantasy', 'Action'];

const GenreFilterPage: React.FC = () => {
    const { kdramas, dataLoading } = useContext(DataContext)!;
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const filteredKdramas = kdramas.filter(d => 
        !selectedGenre || (d.genre && d.genre.includes(selectedGenre))
    );

    return (
     <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
        <img
            src="https://i.pinimg.com/736x/9a/aa/9e/9aaa9edbf777abe86ecc747601f26917.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold">Filter Genre</h1>
    </div>
</div>
 {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>
            
            {/* KONTEN */}
            <SectionTitle title="Pilih Genre" />

            <div className="flex flex-wrap gap-2 mb-8">
                {GENRES.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                        className={`px-4 py-2 text-sm rounded-full transition-colors font-medium shadow-sm ${
                            genre === selectedGenre
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <SectionTitle title={selectedGenre ? `K-Drama Genre: ${selectedGenre}` : "Semua K-Drama"} />

            {dataLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredKdramas.length > 0 ? (
                        filteredKdramas.map(drama => <KramaCard key={drama.id} kdrama={drama} />)
                    ) : (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4 border rounded-lg">
                            Tidak ada K-Drama yang cocok dengan genre ini.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenreFilterPage;
