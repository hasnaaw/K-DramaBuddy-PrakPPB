import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { KramaCard } from '../components/ui/KdramaCard';

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
        <div className="p-4 pt-16 mb-20">
            <Header title={`Filmografi ${decodedActorName}`} showBack={true} />
            <SectionTitle title={`Semua K-Drama oleh ${decodedActorName}`} />
            
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