import React, { useState, useEffect, createContext, useCallback, useContext } from 'react';
import type { ReactNode } from 'react'; // Menggunakan type-only import
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js'; // Menggunakan type-only import

// Mendefinisikan Tipe Context
interface AuthContextType {
    user: User | null;
    userId: string | null;
    userEmail: string | null;
    isGuest: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook kustom untuk menggunakan konteks Auth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);


    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        return { error: error?.message || null };
    }, []);
    
    const signUp = useCallback(async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        return { error: error?.message || null };
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    }, []);
    
    const isGuest = !user; 
    const userId = user?.id ?? null;
    const userEmail = user?.email ?? null;

    const value: AuthContextType = {
        user,
        userId,
        userEmail,
        isGuest,
        loading,
        login,
        signUp,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};