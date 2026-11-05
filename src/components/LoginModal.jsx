import React, { useState } from 'react';
import { X, Lock, Mail, Key, Loader2, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../firebase/init';

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginAdmin(email, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Email atau password salah.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password belum diaktifkan di Firebase Console (Authentication > Sign-in method).');
      } else {
        setError(err.message || 'Gagal login, periksa koneksi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={!loading ? onClose : undefined}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold">Login Pemilik Galeri</h2>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Masuk dengan akun admin Anda untuk mengunggah atau mengelola foto. Pengunjung biasa tidak akan melihat tombol kelola foto.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2 text-xs text-rose-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition-all shadow-md shadow-rose-500/20 active:scale-[0.99] mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memeriksa Akun...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

