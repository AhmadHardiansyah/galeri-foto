import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MapPin, 
  Calendar, 
  Camera, 
  Download, 
  Share2, 
  Check 
} from 'lucide-react';

export default function LightboxModal({
  photo,
  onClose,
  onNext,
  onPrev,
  isLiked,
  onToggleLike,
}) {
  const [copied, setCopied] = useState(false);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  // Support both Firebase (url) and static data (src)
  const imgSrc = photo.url || photo.src;

  const handleSharePhoto = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `${photo.title} oleh foto galeri`,
          url: imgSrc,
        });
      } catch (err) {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(imgSrc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-2 sm:p-6"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div 
        className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10">
            {photo.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Photo Button */}
          <button
            onClick={handleSharePhoto}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
            title="Bagikan link foto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Download Original Image */}
          <a
            href={imgSrc}
            target="_blank"
            rel="noopener noreferrer"
            download={`${photo.title}.jpg`}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
            title="Buka ukuran penuh / Unduh"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-rose-500 text-white backdrop-blur transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev / Next navigation arrow buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all duration-200 z-10 hover:scale-110"
        title="Foto Sebelumnya (Panah Kiri)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all duration-200 z-10 hover:scale-110"
        title="Foto Selanjutnya (Panah Kanan)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Content Modal Card */}
      <div 
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col lg:flex-row bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Container */}
        <div className="flex-1 bg-black/60 flex items-center justify-center p-2 sm:p-4 min-h-[300px] sm:min-h-[450px] max-h-[60vh] lg:max-h-[85vh] overflow-hidden">
          <img
            src={imgSrc}
            alt={photo.title}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Details Sidebar */}
        <div className="w-full lg:w-80 p-5 sm:p-6 flex flex-col justify-between bg-zinc-900 text-zinc-100 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                {photo.category}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
                {photo.title}
              </h2>
            </div>

            {photo.description && (
              <p className="text-sm text-zinc-300 leading-relaxed">
                {photo.description}
              </p>
            )}

            {/* Metadata list */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
              {photo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{photo.location}</span>
                </div>
              )}
              {photo.camera && (
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{photo.camera}</span>
                </div>
              )}
              {photo.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{photo.date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions inside modal */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => onToggleLike(photo.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 transform active:scale-95 ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{photo.likes + (isLiked ? 1 : 0)} Suka</span>
            </button>

            {/* Mobile Prev / Next */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={onPrev}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

