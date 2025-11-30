import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { AdminKramaCard } from '../components/ui/KdramaCard';
import { KdramaFormModal } from '../components/modals/KdramaFormModal';
import { useAuth } from '../auth/AuthProvider';
import type { Drama } from '../contexts/DataProvider'; // Import tipe Drama

// ... (Interface Drama dihilangkan karena sudah diimport)

const ListKdramaPage: React.FC = () => {
    const { kdramas, dataLoading, addOrUpdateKdrama, deleteKdrama } = useContext(DataContext)!;
    const { isGuest } = useAuth(); 
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
    const [editingDrama, setEditingDrama] = useState<Drama | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // --- Logika CRUD DUMMY (Sesuai permintaan Anda, tidak ada CRUD untuk pengguna) ---

    const handleFormSubmit = async (dramaData: Partial<Drama>) => {
        setSubmissionError("Akses Ditolak: Hanya kreator yang dapat memodifikasi list.");
    }
    
    const handleEdit = (drama: Drama) => {
        setSubmissionError("Akses Ditolak: Hanya kreator yang dapat memodifikasi list.");
    }
    
    const handleDelete = async (dramaId: string) => {
        setSubmissionError("Akses Ditolak: Hanya kreator yang dapat memodifikasi list.");
    }
    
    const handleOpenAddModal = () => {
        setSubmissionError("Akses Ditolak: Hanya kreator yang dapat memodifikasi list.");
    }

    // --- PENGHAPUSAN TOMBOL DAN KONTROL UI ---

    return (
        // PERBAIKAN: Pastikan container utama halaman tidak memiliki warna latar belakang permanen (biarkan App.tsx mengontrol warna root)
        <div className="p-4 pt-16 mb-20"> 
            <Header title="Semua K-Drama" showBack={true} />
            <div className="flex justify-between items-center mb-6">
                <SectionTitle title="Daftar Lengkap" />
                
                {/* BLOK INI SEKARANG HANYA UNTUK TEKS, BUKAN TOMBOL TAMBAH */}
                <p className="text-sm text-gray-500 dark:text-gray-400">List dikelola oleh kreator.</p> 
            </div>

            {submissionError && (
                <p className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    {submissionError}
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
                            Belum ada K-Drama.
                        </p>
                    ) : (
                        kdramas.map(drama => (
                            <AdminKramaCard 
                                key={drama.id} 
                                kdrama={drama} 
                                // PERBAIKAN: Melewatkan fungsi handler secara langsung
                                onEdit={handleEdit} 
                                onDelete={handleDelete}
                                showAdminButtons={false} 
                            />
                        ))
                    )}
                </div>
            )}
            
            {/* Modal CRUD K-Drama dihapus karena tidak ada tombol untuk membukanya */}
        </div>
    );
};

export default ListKdramaPage;