import React, { useState, useEffect, useCallback } from 'react';

// Asumsi tipe dasar
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

interface KdramaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dramaData: Partial<Drama>) => Promise<void>;
    isSubmitting: boolean;
    initialDrama: Drama | null;
}

const GENRES_LIST = ['Romance', 'Comedy', 'Thriller', 'Revenge', 'Legal', 'Survival', 'Fantasy', 'Action'];

export const KdramaFormModal: React.FC<KdramaFormModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, initialDrama }) => {
    
    const [title, setTitle] = useState(initialDrama?.title || '');
    const [year, setYear] = useState(initialDrama?.year || new Date().getFullYear());
    const [description, setDescription] = useState(initialDrama?.description || '');
    const [posterUrl, setPosterUrl] = useState(initialDrama?.poster_url || '');
    const [genres, setGenres] = useState(initialDrama?.genre || []);
    const [actors, setActors] = useState(initialDrama?.actors?.join(', ') || '');
    
    const [previewImage, setPreviewImage] = useState(initialDrama?.poster_url || null);
    const [posterFile, setPosterFile] = useState<File | null>(null);

    // Effect untuk mereset/mengisi state saat modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            setTitle(initialDrama?.title || '');
            setYear(initialDrama?.year || new Date().getFullYear());
            setDescription(initialDrama?.description || '');
            setPosterUrl(initialDrama?.poster_url || '');
            setGenres(initialDrama?.genre || []);
            setActors(initialDrama?.actors?.join(', ') || '');
            setPreviewImage(initialDrama?.poster_url || null);
            setPosterFile(null);
        }
    }, [isOpen, initialDrama]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setPosterFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string); // Base64 for instant preview
            };
            reader.readAsDataURL(file);
        } else {
            setPosterFile(null);
            setPreviewImage(initialDrama?.poster_url || null);
        }
    };


    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let finalPosterUrl = posterUrl;
        
        // ************************************************
        // CATATAN PENTING UNTUK IMPLEMENTASI NYATA:
        // Di sini, Anda harus mengunggah `posterFile` ke Supabase Storage
        // dan mendapatkan URL publiknya. Karena ini simulasi, kita lewati.
        // ************************************************
        
        // Fallback untuk simulasi: Jika ada file baru, gunakan URL placeholder, 
        // jika tidak, gunakan posterUrl yang sudah ada.
        if (posterFile) {
            finalPosterUrl = 'https://placehold.co/300x450/0D9488/FFFFFF?text=USER+UPLOAD';
        }


        onSubmit({
            id: initialDrama?.id, 
            title,
            year: parseInt(year as unknown as string), // Pastikan tahun adalah number
            description,
            poster_url: finalPosterUrl,
            genre: genres,
            actors: actors.split(',').map(a => a.trim()).filter(a => a.length > 0)
        });
    };

    const handleGenreToggle = (genre: string) => {
        setGenres(prev => 
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };
    
    const modalTitle = initialDrama ? `Edit K-Drama: ${initialDrama.title}` : 'Tambah K-Drama Baru';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{modalTitle}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <input type="text" placeholder="Judul K-Drama (Wajib)" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />
                    
                    <input type="number" placeholder="Tahun Rilis (Wajib)" value={year} onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())} required min="1990" max={new Date().getFullYear() + 1} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />

                    {/* FIELD UPLOAD GAMBAR */}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Poster K-Drama (PNG/JPG)</label>
                        {previewImage && (
                            <img src={previewImage} alt="Preview Poster" className="w-32 h-48 object-cover rounded-lg mb-3 shadow-md" />
                        )}
                        
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg" 
                            onChange={handleFileChange} 
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                             Simulasi: File akan diubah menjadi Base64 untuk pratinjau di browser, tetapi hanya URL Placeholder yang akan disimpan ke database.
                         </p>
                    </div>
                    {/* END FIELD UPLOAD GAMBAR */}

                    <textarea placeholder="Sinopsis/Deskripsi (Wajib)" value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />
                    
                    <input type="text" placeholder="Pemeran Utama (Pisahkan dengan koma: Aktor A, Aktor B)" value={actors} onChange={(e) => setActors(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" />

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Genre (Pilih minimal satu)</label>
                        <div className="flex flex-wrap gap-2">
                            {GENRES_LIST.map(genre => (
                                <button
                                    type="button"
                                    key={genre}
                                    onClick={() => handleGenreToggle(genre)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                        genres.includes(genre)
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting || !title || !year || !description || genres.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400">
                            {isSubmitting ? 'Menyimpan...' : (initialDrama ? 'Simpan Perubahan' : 'Simpan K-Drama')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};