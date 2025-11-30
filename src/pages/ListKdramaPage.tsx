import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataProvider';
import { SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { AdminKramaCard } from '../components/ui/KdramaCard';


// ... (Interface Drama dihilangkan karena sudah diimport)

const ListKdramaPage: React.FC = () => {
    const { kdramas, dataLoading } = useContext(DataContext)!;
  
    //const [submissionError, setSubmissionError] = useState<string | null>(null);

    // --- Logika CRUD DUMMY (Sesuai permintaan Anda, tidak ada CRUD untuk pengguna) ---

   
    
    const handleEdit = () => {
    // belum dipakai
};

const handleDelete = async () => {
    // belum dipakai
};
    


    // --- PENGHAPUSAN TOMBOL DAN KONTROL UI ---

    return (
        // PERBAIKAN: Pastikan container utama halaman tidak memiliki warna latar belakang permanen (biarkan App.tsx mengontrol warna root)
          <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
        <img
            src="https://i.pinimg.com/736x/64/20/24/642024b9d48c4380592c966c355963ae.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold">Semua K-Drama</h1>
    </div>
</div>
 {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>

            <div className="flex justify-between items-center mb-6">
                <SectionTitle title="Daftar Lengkap" />
                
                {/* BLOK INI SEKARANG HANYA UNTUK TEKS, BUKAN TOMBOL TAMBAH */}
                <p className="text-sm text-gray-500 dark:text-gray-400">List dikelola oleh kreator.</p> 
            </div>

            

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