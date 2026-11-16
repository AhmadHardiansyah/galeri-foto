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
      <div className="relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-pink-200/60 dark:border-zinc-800/80 shadow-sm hover:shadow-2xl hover:border-pink-400/60 transition-all duration-300">
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
          {/* Skeleton loader with cute shimmer */}
          {!imageLoaded && (
            <div className="w-full h-full bg-pink-50 dark:bg-zinc-800/80 animate-pulse flex items-center justify-center">
              <Camera className="w-6 h-6 text-pink-300 opacity-60" />
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
          <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm border border-white/20">
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
                className="p-1.5 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white backdrop-blur-md transition-colors shadow-sm"
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
                className="p-1.5 rounded-full bg-red-600/85 hover:bg-red-600 text-white backdrop-blur-md transition-colors shadow-sm"
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

        {/* Bottom overlay: Title + Location + Like (Desktop hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate drop-shadow-sm">{photo.title}</h3>
              {photo.location && (
                <p className="flex items-center gap-1 text-[11px] text-pink-200 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                  <span>{photo.location}</span>
                </p>
              )}
            </div>

            {/* Like Button with Explosion */}
            <LikeButton
              isLiked={isLiked}
              onToggle={() => onToggleLike(photo.id)}
              className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
            />
          </div>

          {/* Camera info */}
          {photo.camera && (
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-300">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-pink-300" />
                <span>{photo.camera}</span>
              </span>
              <span className="text-pink-300">{(photo.likes || 0) + (isLiked ? 1 : 0)} suka</span>
            </div>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className="sm:hidden px-3.5 py-2.5 flex items-center justify-between bg-white dark:bg-zinc-900 border-t border-pink-100 dark:border-zinc-800/60">
          <div className="truncate mr-2">
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{photo.title}</div>
            <div className="text-[10px] font-semibold text-pink-500">{photo.category}</div>
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
