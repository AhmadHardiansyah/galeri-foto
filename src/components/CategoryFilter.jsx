import React from 'react';
import { LayoutGrid, Grid3X3, Search, FolderHeart } from 'lucide-react';
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

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6 space-y-3">
      {/* Search Bar & Layout Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari foto, cerita, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Layout View Toggles */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 self-end sm:self-auto">
          <button
            onClick={() => setLayoutMode('masonry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              layoutMode === 'masonry'
                ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Tampilan Masonry (Sesuai Ukuran Asli)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Masonry</span>
          </button>
          <button
            onClick={() => setLayoutMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              layoutMode === 'grid'
                ? 'bg-white dark:bg-zinc-800 text-rose-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
            title="Tampilan Grid Persegi (Ala Instagram)"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Square Grid</span>
          </button>
        </div>
      </div>

      {/* Category Pills (horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categoryList.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm font-semibold'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
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
