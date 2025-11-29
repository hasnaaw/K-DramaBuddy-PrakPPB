import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataContext } from '../contexts/DataProvider';
import { Header, SectionTitle, SkeletonCard } from '../components/ui/Layouts';
import { ReviewModal } from '../components/modals/ReviewModal';
import { useAuth } from '../auth/AuthProvider';

// Asumsi tipe dasar
interface Review {
    id: string;
    user_id: string;
    drama_id: string;
    rating: number;
    review_text: string;
    created_at: string;
    user_email?: string; // Ditambahkan untuk display
}

// Icon Bintang (Utility)
const StarIcon: React.FC<{ fill: boolean, size?: number, color?: string }> = ({ fill, size = 18, color = 'text-yellow-400' }) => (
    <svg className={color} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

// Komponen Review Item
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

const KdramaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userId, isGuest } = useAuth();
    const { kdramas, reviews, favorites, dataLoading, addOrUpdateReview, deleteReview, addOrRemoveFavorite } = useContext(DataContext)!;

    const drama = kdramas.find(d => d.id === id);
    const dramaReviews = reviews.filter(r => r.drama_id === id);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const isFavorite = favorites.some(fav => fav.drama_id === id && fav.user_id === userId);
    const avgRating = drama?.avg_rating || 0;
    const totalEpisodes = 16; 
    const duration = '60-70 menit';

    if (dataLoading) return (
        <div className="p-4 pt-16 mb-20 text-center"><Header title="Memuat Detail" showBack={true} />Memuat data drama...</div>
    );
    if (!drama || !id) return (
        <div className="p-4 pt-16 mb-20 text-center text-red-500">
            <Header title="Drama Tidak Ditemukan" showBack={true} />
            K-Drama tidak ditemukan.
        </div>
    );

    // --- LOGIKA REVIEW ---
    const handleReviewSubmit = async (reviewData: Partial<Review>) => {
        setSubmissionError(null);
        setIsSubmitting(true);
        const result = await addOrUpdateReview({ 
            ...reviewData, 
            drama_id: id,
            // user_id dan user_email otomatis ditambahkan di DataProvider
        });

        setIsSubmitting(false);
        if (result.error) {
            setSubmissionError(result.error);
        } else {
            setIsReviewModalOpen(false);
            setEditingReview(null);
        }
    };
    
    const handleDeleteReview = async (reviewId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus review ini?")) {
            const result = await deleteReview(reviewId);
            if (result.error) {
                window.confirm(result.error);
            }
        }
    };
    
    const handleEditReview = (review: Review) => {
        setEditingReview(review);
        setIsReviewModalOpen(true);
    };

    // --- LOGIKA FAVORIT ---
    const handleFavoriteToggle = async () => {
        if (isGuest) {
            window.confirm("Silakan login untuk menandai favorit.");
            return;
        }
        setIsTogglingFavorite(true);
        const result = await addOrRemoveFavorite(id);
        setIsTogglingFavorite(false);
        
        if (result.error) {
            window.confirm(result.error);
        }
    }

    const renderActors = (actors: string[]) => {
        if (!actors || actors.length === 0) return <span>Tidak ada data aktor.</span>;
        
        return actors.map((actor, index) => (
            <React.Fragment key={actor}>
                <Link 
                    to={`/actor/${encodeURIComponent(actor)}`}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition hover:underline font-semibold"
                >
                    {actor}
                </Link>
                {index < actors.length - 1 && ', '}
            </React.Fragment>
        ));
    };


    return (
        <div className="p-4 pt-16 mb-20">
            <Header title={drama.title} showBack={true} />
            <div className="max-w-4xl mx-auto md:flex md:space-x-8">
                <div className="md:w-1/3 relative">
                    <img
                        src={drama.poster_url}
                        alt={`Poster ${drama.title}`}
                        className="w-full rounded-xl shadow-2xl mb-6"
                        onError={(e: any) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x450/374151/FFFFFF?text=No+Poster"; }}
                    />
                    
                    {/* Tombol Favorit */}
                    <button
                        onClick={handleFavoriteToggle}
                        disabled={isTogglingFavorite || isGuest}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-colors disabled:opacity-50
                            ${isFavorite 
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                            fill={isFavorite ? 'currentColor' : 'none'} 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                        </svg>
                    </button>
                </div>
                
                <div className="md:w-2/3">
                    {/* Metadata Drama */}
                    <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">{drama.title}</h2>
                    <div className="flex items-center space-x-4 mb-4 text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-xl text-blue-600 dark:text-blue-400">{avgRating.toFixed(1)}</span>
                        <div className="flex">
                             {Array.from({ length: 5 }, (_, i) => (<StarIcon key={i} fill={avgRating > i} size={20} />))}
                        </div>
                        <span className="text-sm">({dramaReviews.length} review)</span>
                    </div>

                    <p className="text-md mb-4 text-gray-700 dark:text-gray-300 font-medium">
                        <span className="font-bold">Pemeran Utama:</span> {renderActors(drama.actors)}
                    </p>
                    <p className="text-md mb-6 text-gray-700 dark:text-gray-300 font-medium">
                        <span className="font-bold">Durasi/Episode:</span> {duration} ({totalEpisodes} Eps)
                    </p>

                    <SectionTitle title="Sinopsis" />
                    <p className="text-gray-700 dark:text-gray-300 mb-8">{drama.description}</p>
                </div>
            </div>

            {/* Bagian Review */}
            <div className="max-w-4xl mx-auto">
                <SectionTitle title="Daftar Review" />
                {/* ... (Pesan Login dan Tombol Tambah Review) ... */}
                {!isGuest && (
                    <button
                        onClick={() => { setEditingReview(null); setIsReviewModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 shadow-md"
                    >
                        + Tambah Review Anda
                    </button>
                )}
                {isGuest && (
                    <p className="text-yellow-600 dark:text-yellow-400 mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                        Anda masuk sebagai Tamu. Silakan login untuk membuat review.
                    </p>
                )}

                {submissionError && (
                    <p className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                        Error: {submissionError}
                    </p>
                )}

                {dramaReviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 p-4 border rounded-lg">Belum ada review untuk K-Drama ini.</p>
                ) : (
                    dramaReviews.map(review => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            isOwnReview={review.user_id === userId}
                            onDelete={handleDeleteReview}
                            onEdit={handleEditReview}
                        />
                    ))
                )}
            </div>

            {/* Modal Review */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); setSubmissionError(null); }}
                onSubmit={handleReviewSubmit}
                review={editingReview}
                dramaTitle={drama.title}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default KdramaDetailPage;