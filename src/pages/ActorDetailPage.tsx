import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../contexts/DataProvider.tsx';
import { SkeletonCard } from '../components/ui/Layouts.tsx';
import { KramaCard } from '../components/ui/KdramaCard.tsx';

const ActorDetailPage: React.FC = () => {
    const { actorName } = useParams<{ actorName: string }>();
    const decodedActorName = actorName ? decodeURIComponent(actorName) : '';
    
    // Kita menggunakan useData() di sini, yang sudah punya semua data kdramas
    const { kdramas, dataLoading } = useContext(DataContext)!;
    
    // Filter manual di sisi client
    const filteredKdramas = kdramas.filter(d => 
        d.actors && d.actors.includes(decodedActorName)
    );
    
    return (
        <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
         <h1 className="text-xl font-bold">K-Drama {decodedActorName}</h1>
    </div>
</div>

            {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>
            
            {dataLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredKdramas.length === 0 ? (
                 <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4 border rounded-lg">Tidak ada K-Drama yang ditemukan untuk aktor ini.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredKdramas.map(drama => <KramaCard key={drama.id} kdrama={drama} />)}
                </div>
            )}
        </div>
    );
};

export default ActorDetailPage;