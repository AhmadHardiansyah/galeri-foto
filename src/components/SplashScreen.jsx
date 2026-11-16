import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0b14] text-white select-none transition-all duration-700 cursor-pointer overflow-hidden ${
        fadeState === 'leaving'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient cute pastel glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-pink-500/20 via-rose-400/15 to-purple-500/15 blur-[130px] rounded-full animate-aurora-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-bl from-purple-500/20 via-indigo-400/15 to-pink-500/15 blur-[120px] rounded-full animate-aurora-2" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 px-6 max-w-md text-center transform transition-all duration-1000 ease-out flex flex-col items-center ${
          fadeState === 'entering'
            ? 'opacity-0 translate-y-6 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Animated Cute Mascot: Adorable Cat/Bear with Camera & Rosy Cheeks */}
        <div className="relative mb-5 animate-bounce-soft">
          {/* Soft cute glow behind mascot */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-pink-400 via-rose-400 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse-glow" />

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#241a38] to-[#161226] border-2 border-pink-400/40 shadow-2xl flex items-center justify-center p-2.5">
            <svg
              className="w-full h-full text-pink-300 drop-shadow-md"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cute Cat Ears */}
              <polygon points="20,40 32,14 44,36" fill="#f472b6" />
              <polygon points="25,37 32,19 40,35" fill="#fbcfe8" />
              <polygon points="80,40 68,14 56,36" fill="#f472b6" />
              <polygon points="75,37 68,19 60,35" fill="#fbcfe8" />

              {/* Head */}
              <ellipse cx="50" cy="52" rx="36" ry="32" fill="#fdf2f8" />

              {/* Rosy Cheeks */}
              <circle cx="28" cy="58" r="6" fill="#fb7185" opacity="0.6" />
              <circle cx="72" cy="58" r="6" fill="#fb7185" opacity="0.6" />

              {/* Big Cute Happy Eyes (Blinking / Curved) */}
              <path d="M 33 48 Q 38 42 43 48" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 57 48 Q 62 42 67 48" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Tiny Cute Nose & Smile */}
              <path d="M 48 56 Q 50 58 52 56" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 46 60 Q 50 64 54 60" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Cute Mini Polaroid Camera around neck */}
              <g transform="translate(32, 68)">
                <rect x="0" y="0" width="36" height="24" rx="5" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="18" cy="12" r="6" fill="#4c0519" />
                <circle cx="18" cy="12" r="3" fill="#f43f5e" />
                <circle cx="28" cy="6" r="2" fill="#fff" />
              </g>
            </svg>
          </div>
        </div>

        {/* Clean Pill Greeting */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-[11px] font-bold text-pink-300 mb-3 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Selamat Datang</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-purple-200 leading-snug">
          Galeri & Portofolio
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-pink-200/80 font-medium tracking-wide">
          Koleksi foto momen, kenangan, dan musik favorit
        </p>

        {/* Marshmallow Candy Loading Bar */}
        <div className="mt-6 w-48 mx-auto h-2 bg-pink-950/60 border border-pink-500/30 rounded-full p-0.5 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-full transition-all duration-[2200ms] ease-out"
            style={{ width: fadeState === 'entering' ? '0%' : '100%' }}
          />
        </div>

        {/* Skip hint */}
        <span className="block mt-4 text-[10px] text-pink-300/50 hover:text-pink-300 transition-colors">
          Klik di mana saja untuk lanjut
        </span>
      </div>
    </div>
  );
}
