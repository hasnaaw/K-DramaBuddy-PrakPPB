import React, { useState, useEffect } from 'react';

// Asumsi tipe dasar
interface Review {
    id: string;
    user_id: string;
    drama_id: string;
    rating: number;
    review_text: string;
    created_at: string;
}

// Icon Bintang (Utility)
const StarIcon: React.FC<{ fill: boolean, size?: number, color?: string }> = ({ fill, size = 30, color = 'text-yellow-400' }) => (
    <svg className={color} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reviewData: Partial<Review>) => Promise<void>;
    isSubmitting: boolean;
    review: Review | null; // Review yang sedang diedit (jika ada)
    dramaTitle: string; // Judul drama untuk display
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, review, dramaTitle }) => {
    const [rating, setRating] = useState(review?.rating || 5);
    const [reviewText, setReviewText] = useState(review?.review_text || '');

    // Sinkronisasi state lokal dengan prop `review` saat modal dibuka/review di-edit
    useEffect(() => {
        if (isOpen) {
            setRating(review?.rating || 5);
            setReviewText(review?.review_text || '');
        }
    }, [isOpen, review]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Mengirim data review (termasuk ID jika sedang mode edit)
        onSubmit({ 
            id: review?.id, 
            rating, 
            review_text: reviewText 
        });
    };
    
    const modalTitle = review ? `Edit Review` : `Tambah Review untuk ${dramaTitle}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {modalTitle}
                </h3>
                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Rating ({rating} Bintang)</label>
                    <div className="flex space-x-1 mb-4">
                        {Array.from({ length: 5 }, (_, i) => (
                            <button type="button" key={i} onClick={() => setRating(i + 1)} className="text-yellow-400 transition-transform hover:scale-110">
                                <StarIcon fill={rating > i} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tuliskan pendapat Anda tentang K-Drama ini..."
                        required
                        rows={4}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 mb-4"
                    />
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400">
                            {isSubmitting ? 'Mengirim...' : (review ? 'Simpan Perubahan' : 'Kirim Review')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};