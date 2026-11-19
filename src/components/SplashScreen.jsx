import React, { useEffect, useState } from 'react';
import { Camera, Film, Disc } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fadeState, setFadeState] = useState('entering'); // 'entering' | 'visible' | 'leaving'

  useEffect(() => {
    // Fase 1: Muncul perlahan
    const timer1 = setTimeout(() => {
      setFadeState('visible');
    }, 100);

    // Fase 2: Mulai memudar keluar (fade out) setelah 2.4 detik
    const timer2 = setTimeout(() => {
      setFadeState('leaving');
    }, 2400);

    // Fase 3: Selesai (total ~3 detik)
    const timer3 = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#110f0d] text-[#f5f0eb] select-none transition-all duration-700 cursor-pointer overflow-hidden ${
        fadeState === 'leaving'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient: Warm Golden Hour / Film Light Leak */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-transparent blur-[140px] rounded-full animate-aurora-1" />
        <div className="absolute -bottom-24 -right-24 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] bg-gradient-to-bl from-amber-700/15 via-stone-800/15 to-transparent blur-[130px] rounded-full animate-aurora-2" />
        
        {/* Subtle vintage film grain overlay effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 px-6 max-w-md text-center transform transition-all duration-1000 ease-out flex flex-col items-center ${
          fadeState === 'entering'
            ? 'opacity-0 translate-y-6 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Vintage 35mm Rangefinder Camera Graphic */}
        <div className="relative mb-6 group">
          {/* Warm Amber Glow behind camera */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-amber-700/15 rounded-full blur-xl animate-pulse-glow" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-[#231e1a] via-[#1a1613] to-[#120f0d] border border-amber-600/30 shadow-2xl flex items-center justify-center p-3">
            {/* Custom SVG: Minimal Vintage 35mm Camera */}
            <svg
              className="w-full h-full text-amber-500/90 drop-shadow-lg"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Camera Body */}
              <rect x="12" y="28" width="76" height="52" rx="8" fill="#2a241f" stroke="#d97706" strokeWidth="2.5" />
              
              {/* Leatherette Texture Accent */}
              <rect x="16" y="38" width="68" height="38" rx="4" fill="#1c1815" stroke="#78350f" strokeWidth="1" />
              
              {/* Top Viewfinder & Rangefinder Windows */}
              <rect x="22" y="21" width="22" height="7" rx="2" fill="#d97706" />
              <rect x="62" y="22" width="10" height="6" rx="1.5" fill="#f59e0b" />
              
              {/* Red Shutter Button */}
              <circle cx="78" cy="24" r="3" fill="#dc2626" />
              
              {/* Viewfinder Glass */}
              <rect x="22" y="32" width="10" height="6" rx="1" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="70" cy="35" r="3" fill="#f59e0b" opacity="0.8" />
              
              {/* Big Aperture Lens with Circular Rings */}
              <circle cx="50" cy="56" r="22" fill="#171310" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="50" cy="56" r="17" fill="#221b16" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="50" cy="56" r="11" fill="#0d0a08" stroke="#f59e0b" strokeWidth="1.5" />
              
              {/* Lens Glare Reflection */}
              <path d="M 44 48 Q 50 44 56 48" stroke="#fef3c7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <circle cx="53" cy="53" r="2.5" fill="#fef3c7" opacity="0.5" />
              
              {/* Small ISO 400 badge */}
              <text x="50" y="88" textAnchor="middle" fill="#d97706" fontSize="6" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                ISO 400 • 35MM
              </text>
            </svg>
          </div>
        </div>

        {/* Vintage Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono tracking-widest text-amber-400 mb-3 uppercase shadow-sm">
          <Film className="w-3.5 h-3.5 text-amber-500" />
          <span>35mm Visual Archive</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#f5f0eb] leading-snug font-sans">
          Ahmad Hardiansyah
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-stone-400 font-normal tracking-wide max-w-xs leading-relaxed font-sans">
          Arsip foto kenangan, potret perjalanan, dan piringan musik indie.
        </p>

        {/* Retro Exposure Counter Loading Bar */}
        <div className="mt-6 w-56 mx-auto space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-amber-400/80 px-1">
            <span>EXP 01/24</span>
            <span className="animate-pulse">LOADING FILM...</span>
          </div>
          <div className="h-2 bg-[#1e1915] border border-amber-600/30 rounded-full p-0.5 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 rounded-full transition-all duration-[2200ms] ease-out shadow-sm"
              style={{ width: fadeState === 'entering' ? '0%' : '100%' }}
            />
          </div>
        </div>

        {/* Skip hint */}
        <span className="block mt-5 text-[11px] font-mono text-stone-500 hover:text-amber-400 transition-colors">
          [ Klik di mana saja untuk membuka ]
        </span>
      </div>
    </div>
  );
}
