import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { profileData as fallbackProfile } from '../data/profile';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-[#ded3c2] dark:border-stone-800 py-8 px-4 text-center text-xs text-stone-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
        <p className="flex items-center justify-center gap-1.5 font-medium text-stone-600 dark:text-stone-400">
          <span>© {new Date().getFullYear()} {fallbackProfile.name} • 35mm Analog Archive</span>
        </p>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#ded3c2] dark:border-stone-800 bg-[#ede6dc]/80 dark:bg-[#1c1815]/80 hover:bg-[#dfd4c4] dark:hover:bg-stone-800 transition-all text-stone-800 dark:text-stone-200 font-semibold shadow-sm transform hover:scale-105 active:scale-95"
        >
          <span>Ke Atas</span>
          <ArrowUp className="w-3 h-3 text-amber-700 dark:text-amber-400" />
        </button>
      </div>
    </footer>
  );
}
