import React from 'react';
import { Link } from 'react-router-dom';
import type { Drama } from '../../contexts/DataProvider'; 

// Icon Bintang (Utility)
const StarIcon: React.FC<{ fill: boolean, size?: number, color?: string }> = ({ fill, size = 16, color = 'text-yellow-400' }) => (
    <svg className={color} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


interface KramaCardProps {
    kdrama: Drama;
}

// Komponen Utama Card (Digunakan di Home, List, Favorite)
export const KramaCard: React.FC<KramaCardProps> = ({ kdrama }) => {
    const { id, title, poster_url, year, avg_rating } = kdrama;
    const rating = avg_rating || 0;

    // Perbaikan: Tambahkan min-w-0 dan pastikan Link adalah block
    return (
        <Link to={`/detail/${id}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1 block min-w-0">
            {/* Kontainer Gambar: Tentukan tinggi H-60 secara eksplisit */}
            <div className="relative h-60 w-full">
                <img
                    src={poster_url}
                    alt={`Poster ${title}`}
                    // PERBAIKAN: object-cover memastikan gambar tidak memuai kontainer
                    className="w-full h-full object-cover" 
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x450/374151/FFFFFF?text=No+Poster"; }}
                />
            </div>
            <div className="p-3">
                <h3 className="text-lg font-bold truncate text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tahun: {year}</p>
                <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (<StarIcon key={i} fill={rating > i} />))}
                    <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{rating.toFixed(1)}</span>
                </div>
            </div>
        </Link>
    );
};


interface AdminKramaCardProps {
    kdrama: Drama;
    onEdit: (drama: Drama) => void;
    onDelete: (id: string) => void;
}

// Komponen Card Khusus untuk Halaman List (dengan tombol CRUD)
export const AdminKramaCard: React.FC<AdminKramaCardProps> = ({ kdrama, onEdit, onDelete }) => {
    
    return (
        <div className="flex flex-col">
            <KramaCard kdrama={kdrama} />
            <div className="flex justify-between mt-2 space-x-2 text-xs">
                <button
                    onClick={() => onEdit(kdrama)}
                    className="flex-1 bg-yellow-500 text-white py-1.5 rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(kdrama.id)}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded-lg font-medium hover:bg-red-700 transition"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}