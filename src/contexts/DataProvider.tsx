import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth/AuthProvider';

// Asumsi Tipe Data Dasar
// [DRAMA TYPE REDACTED FOR BREVITY]

interface Drama {
    id: string;
    title: string;
    poster_url: string;
    year: number;
    genre: string[];
    actors: string[];
    description: string;
    avg_rating: number; // Nilai yang dihitung
}

interface Review {
    id: string;
    user_id: string;
    drama_id: string;
    rating: number;
    review_text: string;
    created_at: string;
}

interface Favorite {
    user_id: string;
    drama_id: string;
}

interface DataContextType {
    kdramas: Drama[];
    reviews: Review[];
    favorites: Favorite[];
    dataLoading: boolean;
    fetchAllData: () => Promise<void>;
    
    // CRUD KDRAMA (Open to Guest)
    addOrUpdateKdrama: (dramaData: Partial<Drama>) => Promise<{ error: string | null }>;
    deleteKdrama: (dramaId: string) => Promise<{ error: string | null }>;

    // CRUD Review (Requires Login)
    addOrUpdateReview: (reviewData: Partial<Review>) => Promise<{ error: string | null }>;
    deleteReview: (reviewId: string) => Promise<{ error: string | null }>;
    
    // CRUD Favorite (Requires Login)
    addOrRemoveFavorite: (dramaId: string) => Promise<{ error: string | null }>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData harus digunakan di dalam DataProvider');
    }
    return context;
};

interface DataProviderProps {
    children: ReactNode; // Import ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const { userId, isGuest } = useAuth();
    
    const [kdramas, setKdramas] = useState<Drama[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [dataLoading, setDataLoading] = useState(false);
    
    // ------------------------------------------------------------------
    // A. FETCHING DATA UTAMA
    // ------------------------------------------------------------------

    const fetchAllData = useCallback(async () => {
        setDataLoading(true);

        const [dramaRes, reviewRes, favoriteRes] = await Promise.all([
            supabase.from('kdramas').select('*'),
            supabase.from('reviews').select('*'),
            // Kita hanya perlu favorites milik user yang sedang login
            supabase.from('favorites').select('*').eq('user_id', userId || 'unknown') 
        ]);
        
        // Error Handling
        if (dramaRes.error) console.error("Error fetching dramas:", dramaRes.error);
        if (reviewRes.error) console.error("Error fetching reviews:", reviewRes.error);
        if (favoriteRes.error && userId) console.error("Error fetching favorites:", favoriteRes.error);

        const allReviews = (reviewRes.data || []) as Review[];
        const userFavorites = (favoriteRes.data || []) as Favorite[];
        
        // Menghitung Rating Rata-Rata untuk setiap Drama
        const allKdramas = (dramaRes.data || []).map(drama => {
            const dramaReviews = allReviews.filter(r => r.drama_id === drama.id);
            const totalRating = dramaReviews.reduce((sum, r) => sum + r.rating, 0);
            const avg_rating = dramaReviews.length > 0 ? totalRating / dramaReviews.length : 0;
            return { ...drama, avg_rating: parseFloat(avg_rating.toFixed(1)) } as Drama;
        });

        setKdramas(allKdramas);
        setReviews(allReviews);
        setFavorites(userFavorites);
        setDataLoading(false);
    }, [userId]);


    useEffect(() => {
        // Fetch data saat Auth state berubah atau pertama kali dimuat
        fetchAllData();
        
        // Implementasi Realtime Listener Supabase (optional, but good practice)
        const kdramaSubscription = supabase
            .channel('kdrama_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'kdramas' },
                () => fetchAllData() 
            )
            .subscribe();

        const reviewSubscription = supabase
            .channel('review_changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'reviews' },
                () => fetchAllData() 
            )
            .subscribe();
            
        // Cleanup subscriptions
        return () => {
            kdramaSubscription?.unsubscribe();
            reviewSubscription?.unsubscribe();
        };
    }, [fetchAllData]);

    // ------------------------------------------------------------------
    // B. CRUD KDRAMA (Open to Guest)
    // ------------------------------------------------------------------

    const addOrUpdateKdrama = useCallback(async (dramaData: Partial<Drama>) => {
        let result;
        if (dramaData.id) {
            // Update
            result = await supabase
                .from('kdramas')
                .update(dramaData)
                .eq('id', dramaData.id);
        } else {
            // Insert
            result = await supabase
                .from('kdramas')
                .insert(dramaData);
        }

        if (result.error) {
            console.error("Error CRUD Drama:", result.error);
            return { error: result.error.message };
        }

        await fetchAllData();
        return { error: null };
    }, [fetchAllData]);

    const deleteKdrama = useCallback(async (dramaId: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus K-Drama ini secara permanen?")) {
            return { error: 'Dibatalkan oleh pengguna.' };
        }
        
        const { error } = await supabase
            .from('kdramas')
            .delete()
            .eq('id', dramaId);

        if (error) {
            console.error("Error menghapus Drama:", error);
            return { error: error.message };
        }

        await fetchAllData();
        return { error: null };
    }, [fetchAllData]);

    // ------------------------------------------------------------------
    // C. CRUD REVIEW & FAVORITE (Requires Login)
    // ------------------------------------------------------------------

    const addOrUpdateReview = useCallback(async (reviewData: Partial<Review>) => {
        if (isGuest || !userId) return { error: 'Anda harus login untuk membuat/mengedit review.' };
        
        let result;
        const dataToSend = { ...reviewData, user_id: userId };

        if (reviewData.id) {
            result = await supabase
                .from('reviews')
                .update(dataToSend)
                .eq('id', reviewData.id);
        } else {
            result = await supabase
                .from('reviews')
                .insert(dataToSend);
        }
        
        if (result.error) {
            console.error("Error CRUD Review:", result.error);
            return { error: result.error.message };
        }
        
        await fetchAllData();
        return { error: null };
    }, [isGuest, userId, fetchAllData]);
    
    
    const deleteReview = useCallback(async (reviewId: string) => {
        if (isGuest || !userId) return { error: 'Anda harus login untuk menghapus review.' };
        
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId) // RLS akan memastikan hanya pemilik yang dapat delete
            .eq('user_id', userId); // Tambahkan pengecekan user_id untuk frontend clarity

        if (error) {
            console.error("Error menghapus Review:", error);
            return { error: error.message };
        }
        
        await fetchAllData();
        return { error: null };
    }, [isGuest, userId, fetchAllData]);
    
    
    const addOrRemoveFavorite = useCallback(async (dramaId: string) => {
        if (isGuest || !userId) return { error: 'Anda harus login untuk menandai favorit.' };
        
        const isFavorite = favorites.some(fav => fav.drama_id === dramaId && fav.user_id === userId);
        let result;

        if (isFavorite) {
            // Hapus favorit
            result = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('drama_id', dramaId);
        } else {
            // Tambah favorit
            result = await supabase
                .from('favorites')
                .insert({ user_id: userId, drama_id: dramaId });
        }
        
        if (result.error) {
            console.error("Error CRUD Favorite:", result.error);
            return { error: result.error.message };
        }
        
        await fetchAllData();
        return { error: null };
    }, [isGuest, userId, favorites, fetchAllData]);
    

    const value: DataContextType = {
        kdramas,
        reviews,
        favorites,
        dataLoading,
        fetchAllData,
        addOrUpdateKdrama,
        deleteKdrama,
        addOrUpdateReview,
        deleteReview,
        addOrRemoveFavorite,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};