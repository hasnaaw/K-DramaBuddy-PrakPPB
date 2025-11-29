import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle } from '../components/ui/Layouts';
import { ReviewModal } from '../components/modals/ReviewModal';

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

// Komponen Review Item (Diimpor dari KdramaDetailPage, didefinisikan ulang di sini untuk kemandirian)
const ReviewItem: React.FC<{ review: Review, isOwnReview: boolean, onDelete: (id: string) => void, onEdit: (review: Review) => void }> = ({ review, isOwnReview, onDelete, onEdit }) => {
    const userDisplay = review.user_email?.split('@')[0] || 'Pengguna Anonim';
    
    const StarIcon: React.FC<{ fill: boolean, size?: number, color?: string }> = ({ fill, size = 16, color = 'text-yellow-400' }) => (
        <svg className={color} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
    );
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


const ProfilePage: React.FC = () => {
    const { user, userEmail, isGuest, logout, loading, userId } = useAuth();
    const { reviews, dataLoading, deleteReview, addOrUpdateReview } = useContext(DataContext)!;
    
    // Filter review milik pengguna saat ini
    const userReviews = reviews.filter(r => r.user_id === userId);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (review: Review) => {
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
        if (window.confirm("Apakah Anda yakin ingin menghapus review ini?")) {
            const result = await deleteReview(reviewId);
            if (result.error) {
                window.confirm(result.error);
            }
        }
    };


    if (loading) return <div className="p-4 pt-16 mb-20 text-center">Memuat profil...</div>;

    return (
        <div className="p-4 pt-16 mb-20">
            <Header title="Profil Saya" showBack={false} />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <SectionTitle title="Informasi Akun" />
                {isGuest ? (
                    <>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">Anda masuk sebagai: <span className="text-blue-600 dark:text-blue-400">Tamu</span></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Masuk untuk menyimpan review Anda.</p>
                        <p className="text-xs mt-4 text-gray-400">ID Pengguna Sementara: {userId}</p>
                        <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Masuk / Daftar
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">Email: <span className="text-blue-600 dark:text-blue-400">{userEmail}</span></p>
                        <p className="text-md text-gray-700 dark:text-gray-300 mt-2">Status: Akun Terautentikasi</p>
                        <p className="text-xs mt-4 text-gray-400">ID Pengguna: {userId}</p>
                        <button
                            onClick={async () => { if (window.confirm("Apakah Anda yakin ingin keluar?")) await logout(); }}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>

            <SectionTitle title="Daftar Review Milik Saya" />
            {dataLoading ? (
                <div className="text-center p-8 text-gray-500">Memuat review Anda...</div>
            ) : userReviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 p-4 border rounded-lg">Anda belum menulis review apapun.</p>
            ) : (
                userReviews.map(review => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        isOwnReview={true} 
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
                    dramaTitle={`ID: ${editingReview.drama_id}`}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

export default ProfilePage;