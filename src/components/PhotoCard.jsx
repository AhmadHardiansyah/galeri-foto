import React, { useState } from 'react';
import { Heart, MapPin, Camera, Maximize2, Trash2 } from 'lucide-react';

export default function PhotoCard({
  photo,
  onOpenLightbox,
  onDelete,
  layoutMode,
  isLiked,
  onToggleLike,
  isAdmin = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Support both Firebase (url) and static data (src) for safety
  const imgSrc = photo.url || photo.src;

  return (
    <div
      onClick={() => onOpenLightbox(photo)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Aspect ratio container */}
      <div
        className={`w-full overflow-hidden ${
          layoutMode === 'grid'
            ? 'aspect-square'
            : photo.aspect === 'vertical'
            ? 'aspect-[4/5]'
            : photo.aspect === 'horizontal'
            ? 'aspect-[16/10]'
            : 'aspect-square'
        }`}
      >
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
            <Camera className="w-6 h-6 text-zinc-400 opacity-40 animate-bounce" />
          </div>
        )}

        <img
          src={imgSrc}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Top bar: Category + Delete button (admin only) + Expand */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
          {photo.category}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Delete Button (hanya tampil jika pemilik/admin login) */}
          {isAdmin && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo);
              }}
              className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors shadow-sm"
              title="Hapus foto ini"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Expand icon */}
          <button
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition-colors shadow-sm pointer-events-none"
            title="Perbesar foto"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom overlay: Title + Location + Like */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate drop-shadow-sm">{photo.title}</h3>
            {photo.location && (
              <p className="flex items-center gap-1 text-[11px] text-zinc-300 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span>{photo.location}</span>
              </p>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(photo.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 transform active:scale-125 ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Suka foto ini"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Camera info */}
        {photo.camera && (
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-300">
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3 text-zinc-400" />
              <span>{photo.camera}</span>
            </span>
            <span className="text-zinc-400">{(photo.likes || 0) + (isLiked ? 1 : 0)} suka</span>
          </div>
        )}
      </div>

      {/* Mobile bottom bar */}
      <div className="sm:hidden px-3 py-2 flex items-center justify-between bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="truncate">
          <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{photo.title}</div>
          <div className="text-[10px] text-zinc-500">{photo.category}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {isAdmin && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo);
              }}
              className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(photo.id);
            }}
            className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
