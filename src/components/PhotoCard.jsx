import React, { useState } from 'react';
import { MapPin, Camera, Maximize2, Trash2, Pencil } from 'lucide-react';
import TiltCard from './TiltCard';
import LikeButton from './LikeButton';
import { getFilterClass } from '../utils/filterPresets';

export default function PhotoCard({
  photo,
  onOpenLightbox,
  onDelete,
  onEdit,
  layoutMode,
  isLiked,
  onToggleLike,
  isAdmin = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Support both Firebase (url) and static data (src) for safety
  const imgSrc = photo.url || photo.src;
  const filterClass = getFilterClass(photo.filterPreset);

  return (
    <TiltCard
      maxTilt={5}
      glare={true}
      className="group relative"
      onClick={() => onOpenLightbox(photo)}
    >
      <div className="relative cursor-pointer overflow-hidden rounded-2xl bg-[#faf6ee] dark:bg-[#1a1613] border border-[#ded3c2] dark:border-stone-800 shadow-sm hover:shadow-2xl hover:border-amber-700/50 transition-all duration-300">
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
          {/* Skeleton loader with vintage pulse */}
          {!imageLoaded && (
            <div className="w-full h-full bg-[#f0e9df] dark:bg-stone-800 animate-pulse flex items-center justify-center">
              <Camera className="w-6 h-6 text-stone-400 opacity-60" />
            </div>
          )}

          <img
            src={imgSrc}
            alt={photo.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${filterClass} ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Top bar: Category + Edit/Delete buttons (admin only) + Expand */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-md text-amber-300 shadow-sm border border-amber-600/30">
            {photo.category}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Edit Button (admin only) */}
            {isAdmin && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(photo);
                }}
                className="p-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white backdrop-blur-md transition-colors shadow-sm"
                title="Edit caption, tempat, dan efek foto"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete Button (admin only) */}
            {isAdmin && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo);
                }}
                className="p-1.5 rounded-full bg-red-700 hover:bg-red-800 text-white backdrop-blur-md transition-colors shadow-sm"
                title="Hapus foto ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Expand icon */}
            <button
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-stone-200 border border-white/10 hover:bg-black/80 transition-colors shadow-sm pointer-events-none"
              title="Perbesar foto"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom overlay: Title + Location + Like (Desktop hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate drop-shadow-sm font-sans">{photo.title}</h3>
              {photo.location && (
                <p className="flex items-center gap-1 text-[11px] text-amber-200/90 mt-0.5 truncate font-mono">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{photo.location}</span>
                </p>
              )}
            </div>

            {/* Like Button with Explosion */}
            <LikeButton
              isLiked={isLiked}
              onToggle={() => onToggleLike(photo.id)}
              className="bg-stone-900/70 backdrop-blur-md text-white hover:bg-stone-900"
            />
          </div>

          {/* Camera info */}
          {photo.camera && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-300">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-amber-400" />
                <span>{photo.camera}</span>
              </span>
              <span className="text-amber-400">{(photo.likes || 0) + (isLiked ? 1 : 0)} suka</span>
            </div>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className="sm:hidden px-3.5 py-2.5 flex items-center justify-between bg-[#faf6ee] dark:bg-[#1a1613] border-t border-[#ded3c2] dark:border-stone-800">
          <div className="truncate mr-2">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{photo.title}</div>
            <div className="text-[10px] font-mono font-medium text-amber-700 dark:text-amber-400">{photo.category}</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(photo);
                }}
                className="p-1.5 text-zinc-400 hover:text-amber-500 transition-colors"
                title="Edit foto"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
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
            <LikeButton
              size="sm"
              isLiked={isLiked}
              onToggle={() => onToggleLike(photo.id)}
            />
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
