import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function LikeButton({
  isLiked = false,
  count,
  onToggle,
  size = 'md',
  className = '',
  title = 'Sukai',
}) {
  const [exploding, setExploding] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setExploding(true);
      setTimeout(() => setExploding(false), 800);
    }
    onToggle?.(e);
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleClick}
      title={title}
      className={`relative inline-flex items-center gap-1.5 rounded-full transition-all duration-200 active:scale-90 select-none ${
        isLiked
          ? 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20 font-bold'
          : 'text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      } ${isSmall ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} ${className}`}
    >
      {/* Animated Heart Icon */}
      <span className={`inline-block transition-transform duration-300 ${exploding ? 'scale-125' : 'scale-100'}`}>
        <Heart
          className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-all ${
            isLiked ? 'fill-rose-500 text-rose-500 stroke-rose-500' : 'fill-none'
          }`}
        />
      </span>

      {count !== undefined && <span>{count}</span>}

      {/* Bursting Confetti / Sparkle Particles */}
      {exploding && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[
            { angle: 0, color: 'text-rose-500', char: '❤️' },
            { angle: 45, color: 'text-amber-400', char: '✨' },
            { angle: 90, color: 'text-pink-400', char: '💖' },
            { angle: 135, color: 'text-rose-400', char: '✨' },
            { angle: 180, color: 'text-purple-400', char: '💜' },
            { angle: 225, color: 'text-yellow-400', char: '⭐' },
            { angle: 270, color: 'text-rose-500', char: '🌸' },
            { angle: 315, color: 'text-amber-300', char: '✨' },
          ].map((p, idx) => (
            <span
              key={idx}
              className={`absolute text-[10px] animate-fade-in ${p.color}`}
              style={{
                transform: `rotate(${p.angle}deg) translate(22px) rotate(-${p.angle}deg)`,
                opacity: 0,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                animation: 'particleBurst 0.6s ease-out forwards',
              }}
            >
              {p.char}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}
