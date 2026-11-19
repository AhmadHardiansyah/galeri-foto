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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700 dark:text-amber-400" />
          <input
            type="text"
            placeholder="Cari foto, lokasi, kamera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/90 dark:bg-[#1a1613]/90 border border-[#ded3c2] dark:border-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all shadow-sm backdrop-blur"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Layout View Toggles */}
        <div className="flex items-center gap-1 bg-[#ede6dc]/80 dark:bg-[#1c1815]/90 p-1 rounded-full border border-[#ded3c2] dark:border-stone-800 self-end sm:self-auto shadow-sm">
          <button
            onClick={() => setLayoutMode('masonry')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all transform active:scale-95 ${
              layoutMode === 'masonry'
                ? 'bg-white dark:bg-stone-800 text-amber-800 dark:text-amber-300 shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
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
                ? 'bg-white dark:bg-stone-800 text-amber-800 dark:text-amber-300 shadow-sm'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            title="Tampilan Grid Persegi (Ala Instagram)"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kotak Grid</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
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
                  ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25'
                  : 'bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-900 border border-[#ded3c2] dark:border-stone-800/80 shadow-sm'
              }`}
            >
              <span>{getCategoryEmoji(cat)}</span>
              <span>{cat}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100/90 dark:bg-stone-800 text-amber-900 dark:text-amber-300'
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
