import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { profileData } from '../data/profile';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800/80 py-8 px-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex items-center justify-center gap-1">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> untuk {profileData.name} • {new Date().getFullYear()}
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
        >
          <span>Kembali ke atas</span>
          <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
}

