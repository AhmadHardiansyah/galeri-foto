import React from 'react';
import { LayoutGrid, Grid3X3, Search } from 'lucide-react';
import { categories as defaultCategories } from '../data/photos';

export default function CategoryFilter({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  layoutMode,
  setLayoutMode,
  categories: propCategories,
  categoryCounts = {},
}) {
  const categoryList = propCategories || defaultCategories;

  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'Semua': return '✨';
      case 'SMP': return '🎒';
      case 'SMK': return '🎓';
      case 'Family': return '🏡';
      case 'Rumah': return '🏠';
      case 'Momen': return '📷';
      case 'Kampus': return '🏛️';
      default: return '📷';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6 space-y-3.5">
      {/* Search Bar & Layout Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input with clean icon */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
          <input
            type="text"
            placeholder="Cari foto, lokasi, kamera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/80 dark:bg-zinc-900/80 border border-pink-200/70 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all shadow-sm backdrop-blur"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Layout View Toggles */}
        <div className="flex items-center gap-1 bg-pink-100/70 dark:bg-zinc-900/80 p-1 rounded-full border border-pink-200/60 dark:border-zinc-800 self-end sm:self-auto shadow-sm">
          <button
            onClick={() => setLayoutMode('masonry')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all transform active:scale-95 ${
              layoutMode === 'masonry'
                ? 'bg-white dark:bg-zinc-800 text-pink-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Tampilan Masonry (Sesuai Ukuran Asli)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Masonry</span>
          </button>
          <button
            onClick={() => setLayoutMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all transform active:scale-95 ${
              layoutMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-pink-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Tampilan Grid Persegi (Ala Instagram)"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kotak Grid</span>
          </button>
        </div>
      </div>

      {/* Category Pills with Cute Emojis */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categoryList.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white shadow-md shadow-pink-500/25'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-zinc-800 border border-pink-200/60 dark:border-zinc-800/80 shadow-sm'
              }`}
            >
              <span>{getCategoryEmoji(cat)}</span>
              <span>{cat}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
