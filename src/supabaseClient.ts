import { createClient } from '@supabase/supabase-js';

// Membaca variabel lingkungan dari .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pastikan variabel lingkungan sudah dimuat sebelum inisialisasi
if (!supabaseUrl || !supabaseAnonKey) {
  // Gunakan pesan error yang jelas jika environment belum diset
  throw new Error('Supabase URL atau Anon Key tidak ditemukan. Pastikan file .env sudah diatur dengan benar.');
}

// Inisialisasi Klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);