import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { AdminKramaCard } from '../components/ui/KdramaCard';
import { KdramaFormModal } from '../components/modals/KdramaFormModal';

// Asumsi tipe Drama diimport dari DataProvider
interface Drama {
    id: string;
    title: string;
    poster_url: string;
    year: number;
    genre: string[];
    actors: string[];
    description: string;
    avg_rating: number;
}


const ListKdramaPage: React.FC = () => {
    const { kdramas, dataLoading, addOrUpdateKdrama, deleteKdrama } = useContext(DataContext)!;
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingDrama, setEditingDrama] = useState<Drama | null>(null); // State untuk Edit
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // --- Logika CRUD ---
    
    const handleFormSubmit = async (dramaData: Partial<Drama>) => {
        setSubmissionError(null);
        setIsSubmitting(true);
        const result = await addOrUpdateKdrama(dramaData);

        setIsSubmitting(false);
        if (result.error) {
            setSubmissionError(result.error);
        } else {
            setIsFormModalOpen(false);
            setEditingDrama(null);
        }
    }
    
    const handleEdit = (drama: Drama) => {
        setEditingDrama(drama);
        setIsFormModalOpen(true);
        setSubmissionError(null);
    }
    
    const handleDelete = async (dramaId: string) => {
        setSubmissionError(null);
        // Konfirmasi sudah dihandle di DataProvider, kita hanya menunggu hasilnya
        const result = await deleteKdrama(dramaId);
        
        if (result.error) {
            setSubmissionError(result.error);
        }
    }
    
    const handleOpenAddModal = () => {
        setEditingDrama(null); // Pastikan mode Add
        setIsFormModalOpen(true);
        setSubmissionError(null);
    }


    return (
        <div className="p-4 pt-16 mb-20">
            <Header title="Semua K-Drama" showBack={true} />
            <div className="flex justify-between items-center mb-6">
                <SectionTitle title="Daftar Lengkap" />
                {/* Tombol Tambah K-Drama (Selalu Tersedia untuk Guest/User) */}
                <button
                    onClick={handleOpenAddModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-md text-sm"
                >
                    + Tambah K-Drama
                </button>
            </div>

            {submissionError && (
                <p className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    Error: {submissionError}
                </p>
            )}

            {dataLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {kdramas.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-4 border rounded-lg">
                            Belum ada K-Drama. Silakan tambahkan satu!
                        </p>
                    ) : (
                        kdramas.map(drama => (
                            <AdminKramaCard 
                                key={drama.id} 
                                kdrama={drama} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            )}
            
            <KdramaFormModal
                isOpen={isFormModalOpen}
                onClose={() => { setIsFormModalOpen(false); setEditingDrama(null); setSubmissionError(null); }}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                initialDrama={editingDrama}
            />
        </div>
    );
};

export default ListKdramaPage;