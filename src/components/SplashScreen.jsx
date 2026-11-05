import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fadeState, setFadeState] = useState('entering'); // 'entering' | 'visible' | 'leaving'

  useEffect(() => {
    // Fase 1: Muncul perlahan
    const timer1 = setTimeout(() => {
      setFadeState('visible');
    }, 100);

    // Fase 2: Mulai memudar keluar (fade out) setelah 2.2 detik
    const timer2 = setTimeout(() => {
      setFadeState('leaving');
    }, 2200);

    // Fase 3: Selesai dan copot dari layar setelah animasi fade out tuntas (total ~2.8 detik)
    const timer3 = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 text-white select-none transition-all duration-700 cursor-pointer ${
        fadeState === 'leaving'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-tr from-rose-500/20 via-purple-500/20 to-amber-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 px-6 max-w-lg text-center transform transition-all duration-1000 ease-out ${
          fadeState === 'entering'
            ? 'opacity-0 translate-y-6 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Subtle mini pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest text-rose-400 font-semibold mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Personal Gallery</span>
        </div>

        {/* Main Welcome Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 leading-tight">
          Welcome to my personal website
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-normal tracking-wide">
          Ruang kenangan, cerita, dan momen bersama teman & keluarga ✨
        </p>

        {/* Sleek App-style Loading Line */}
        <div className="mt-8 w-44 mx-auto h-[3px] bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 rounded-full transition-all duration-[2000ms] ease-out"
            style={{ width: fadeState === 'entering' ? '0%' : '100%' }}
          />
        </div>

        {/* Skip hint */}
        <span className="block mt-4 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
          Ketuk layar untuk melewati
        </span>
      </div>
    </div>
  );
}

