import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Disc, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { playlist } from '../data/music';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 transition-all duration-300">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop={false}
        onEnded={handleNextTrack}
      />

      {/* Mini Collapsed Pill (Tampilan Kompak) */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 px-3 py-2 bg-zinc-900/90 dark:bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-full shadow-xl border border-zinc-700/60 backdrop-blur-md cursor-pointer transition-all hover:scale-105"
          title="Buka Pemutar Musik"
        >
          {/* Rotating Disc */}
          <div className="relative flex items-center justify-center">
            <Disc
              className={`w-5 h-5 text-rose-500 transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            />
            {isPlaying && (
              <span className="absolute w-2 h-2 rounded-full bg-rose-500 animate-ping opacity-75" />
            )}
          </div>

          <div className="flex flex-col text-left max-w-[120px] sm:max-w-[160px]">
            <span className="text-[11px] font-bold truncate text-zinc-100">
              {currentTrack.title}
            </span>
            <span className="text-[9px] text-zinc-400 truncate">
              {isPlaying ? 'Sedang diputar 🎵' : 'Putar Musik'}
            </span>
          </div>

          {/* Quick Play/Pause button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>
        </div>
      ) : (
        /* Expanded Player Card (Tampilan Penuh) */
        <div className="w-72 p-3.5 bg-zinc-900/95 text-white rounded-2xl shadow-2xl border border-zinc-800 backdrop-blur-xl animate-scale-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-400">
              <Music className="w-3.5 h-3.5" />
              <span>Background Music</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              title="Perkecil"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Track Info with rotating disc */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
              <Disc
                className={`w-7 h-7 text-white transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-zinc-100 truncate">{currentTrack.title}</h4>
              <p className="text-[11px] text-zinc-400 truncate">{currentTrack.artist}</p>
              <span className="text-[9px] text-rose-400 font-medium">Lofi Chill • Bebas Hak Cipta</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <button
              onClick={toggleMute}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition-all transform active:scale-95"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                title="Lagu Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[10px] text-zinc-500 font-medium">
              {currentTrackIndex + 1}/{playlist.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
