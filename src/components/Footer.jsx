import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { profileData as fallbackProfile } from '../data/profile';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-pink-200/60 dark:border-zinc-800/80 py-8 px-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex items-center justify-center gap-1.5 font-medium text-pink-600/90 dark:text-pink-400/90">
          <span>Dibuat dengan</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline animate-pulse" />
          <span>untuk {fallbackProfile.name} • Semoga harimu menyenangkan! 🌸🐾</span>
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-pink-200/70 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-pink-50 dark:hover:bg-zinc-800 transition-all text-pink-600 dark:text-pink-300 font-semibold shadow-sm transform hover:scale-105 active:scale-95"
        >
          <span>Meluncur ke atas 🚀🌸</span>
          <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
}
