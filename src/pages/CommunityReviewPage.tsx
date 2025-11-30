import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataProvider.tsx';
import { SectionTitle } from '../components/ui/Layouts.tsx';
import { useAuth } from '../auth/AuthProvider.tsx';
import { ReviewModal } from '../components/modals/ReviewModal.tsx'; // PERBAIKAN: Memperbaiki import path

// Asumsi tipe dasar
interface Review {
    id: string;
    user_id: string;
    drama_id: string;
    rating: number;
    review_text: string;
    created_at: string;
    user_email?: string;
}

// Komponen Review Item (Diimpor/Diulang untuk kejelasan)
const StarIcon: React.FC<{ fill: boolean, size?: number, color?: string }> = ({ fill, size = 16, color = 'text-yellow-400' }) => (
    <svg className={color} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);
const ReviewItem: React.FC<{ review: Review, isOwnReview: boolean, onDelete: (id: string) => void, onEdit: (review: Review) => void }> = ({ review, isOwnReview, onDelete, onEdit }) => {
    const userDisplay = review.user_email?.split('@')[0] || 'Pengguna Anonim';
    const stars = Array.from({ length: 5 }, (_, i) => (<StarIcon key={i} fill={review.rating > i} size={16} />));

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{userDisplay}</p>
                    <div className="flex mt-1">{stars}</div>
                </div>
                {isOwnReview && (
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(review)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                        <button onClick={() => onDelete(review.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                    </div>
                )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{review.review_text}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Ditulis pada: {new Date(review.created_at).toLocaleDateString('id-ID')}</p>
        </div>
    );
};


const CommunityReviewPage: React.FC = () => {
    const { reviews, dataLoading, deleteReview, addOrUpdateReview } = useContext(DataContext)!;
    const { userId, isGuest } = useAuth();
    
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleEdit = (review: Review) => {
        if (isGuest) {
             window.confirm("Silakan login untuk mengedit review.");
             return;
        }
        setEditingReview(review);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = async (reviewData: Partial<Review>) => {
        setIsSubmitting(true);
        const result = await addOrUpdateReview(reviewData);

        setIsSubmitting(false);
        if (result.error) {
            window.confirm(result.error);
        } else {
            setIsReviewModalOpen(false);
            setEditingReview(null);
        }
    };


    const handleDelete = async (reviewId: string) => {
        if (isGuest) {
             window.confirm("Silakan login untuk menghapus review.");
             return;
        }
        if (window.confirm("Apakah Anda yakin ingin menghapus review ini?")) {
            const result = await deleteReview(reviewId);
            if (result.error) {
                window.confirm(result.error);
            }
        }
    };

    return (
           <div>
            {/* HEADER PUTIH + NAVY + LOGO */}
 <div className="w-full bg-white text-[#0A1A3F] shadow-sm fixed top-0 left-0 z-50">
    {/* Dihapus: max-w-screen-xl dan mx-auto */}
    <div className="px-4 py-3 flex items-center gap-3">
        <img
            src="https://i.pinimg.com/736x/71/26/7e/71267e196665cb6a2e48310bcf87f2c7.jpg"
            alt="Logo"
            className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold">Komunitas Review</h1>
    </div>
</div>
 {/* SPACER BIAR KONTEN GAK KETUTUP HEADER */}
            <div className="pt-20"></div>

            <SectionTitle title="Semua Review Pengguna" />

            {isGuest && (
                <p className="text-yellow-600 dark:text-yellow-400 mb-6 p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                    Anda masuk sebagai Tamu. Silakan login untuk berpartisipasi (membuat/mengedit/menghapus review).
                </p>
            )}

            {dataLoading ? (
                <div className="text-center p-8 text-gray-500">Memuat semua review...</div>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 p-4 border rounded-lg">Belum ada review dari komunitas.</p>
            ) : (
                reviews.map(review => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        isOwnReview={review.user_id === userId}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))
            )}

            {/* Modal Review Edit */}
            {editingReview && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }}
                    onSubmit={handleReviewSubmit}
                    review={editingReview}
                    dramaTitle={`Review ID: ${editingReview.drama_id}`}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default CommunityReviewPage;