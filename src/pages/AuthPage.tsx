import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/ui/Layouts.tsx';
import { useAuth } from '../auth/AuthProvider.tsx';
import { supabase } from '../supabaseClient.ts';

interface AuthFormProps {
    mode: 'login' | 'signup';
}

const AuthPage: React.FC<AuthFormProps> = ({ mode }) => {
    const { login } = useAuth(); // Ambil fungsi login dari context
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        if (mode === 'login') {
            const { error } = await login(email, password);
            if (error) {
                setErrorMessage(error);
            } else {
                navigate('/profile'); // Redirect ke profile setelah login sukses
            }
        } else {
            // Logika Sign Up
            const { data, error } = await supabase.auth.signUp({ email, password });
            
            if (error) {
                setErrorMessage(error.message);
            } else if (data.user) {
                // User berhasil dibuat, redirect ke login (atau langsung login jika Supabase mengizinkan)
                window.confirm("Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi (Jika metode RLS aktif).");
                navigate('/login');
            } else {
                setErrorMessage("Pendaftaran berhasil, tetapi sesi tidak dibuat. Silakan login manual.");
                navigate('/login');
            }
        }
        setIsLoading(false);
    };

    const title = mode === 'login' ? 'Masuk' : 'Daftar';
    const otherMode = mode === 'login' ? 'Daftar' : 'Masuk';
    const otherLink = mode === 'login' ? '/signup' : '/login';

    return (
        <div className="p-4 pt-16 mb-20 max-w-sm mx-auto">
            <Header title={title} showBack={true} />
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">{title} ke K-Drama Buddy</h2>
                {errorMessage && <p className="text-red-500 text-sm mb-4 bg-red-100 dark:bg-red-900 p-2 rounded">{errorMessage}</p>}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Kata Sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
                >
                    {isLoading ? 'Memproses...' : title}
                </button>
                <Link to={otherLink} className="block text-center mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Beralih ke halaman {otherMode}
                </Link>
            </form>
        </div>
    );
};

export default AuthPage;