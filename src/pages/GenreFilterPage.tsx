import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard';

const GENRES = ['Romance', 'Comedy', 'Thriller', 'Revenge', 'Legal', 'Survival', 'Fantasy', 'Action'];

const GenreFilterPage: React.FC = () => {
    const { kdramas, dataLoading } = useContext(DataContext)!;
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    // Filter di sisi klien
    const filteredKdramas = kdramas.filter(d => 
        !selectedGenre || (d.genre && d.genre.includes(selectedGenre))
    );

    return (
        <div className="p-4 pt-16 mb-20">
            <Header title="Filter Genre" showBack={true} />
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
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4 border rounded-lg">Tidak ada K-Drama yang cocok dengan genre ini.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenreFilterPage;