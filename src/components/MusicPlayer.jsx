import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc,
  Music,
  ChevronDown,
  ListMusic,
  Check,
} from 'lucide-react';
import { playlist } from '../data/music';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Helper format detik ke MM:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Auto-play when track index changes (jika sebelumnya sedang memutar)
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or audio load pending:', err);
        });
      }
    }
  }, [currentTrackIndex]);

  // Sync mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle Play / Pause (synchronous on user gesture)
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback error:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
    }
  };

  const handleAudioError = () => {
    console.warn('Audio stream error, moving to next track...');
    handleNextTrack();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 transition-all duration-300">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNextTrack}
        onError={handleAudioError}
      />

      {/* Mini Collapsed Pill (Tampilan Kompak Mengambang) */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 px-3 py-2 bg-zinc-900/95 dark:bg-zinc-900/95 hover:bg-zinc-800 text-white rounded-full shadow-2xl border border-zinc-700/70 backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Klik untuk membuka pemutar musik"
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

          <div className="flex flex-col text-left max-w-[110px] sm:max-w-[150px]">
            <span className="text-[11px] font-bold truncate text-zinc-100">
              {currentTrack.title}
            </span>
            <div className="flex items-center gap-1.5">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 bg-rose-500 h-full animate-pulse rounded-full" />
                  <span className="w-0.5 bg-rose-400 h-2/3 animate-pulse rounded-full" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-rose-500 h-4/5 animate-pulse rounded-full" style={{ animationDelay: '300ms' }} />
                </div>
              ) : null}
              <span className="text-[9px] text-zinc-400 truncate">
                {isPlaying ? currentTrack.artist : 'Putar Musik'}
              </span>
            </div>
          </div>

          {/* Quick Play/Pause button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow transition-all active:scale-90"
            title={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      ) : (
        /* Expanded Player Card (Tampilan Penuh) */
        <div className="w-80 p-4 bg-zinc-900/95 dark:bg-zinc-900/95 text-white rounded-2xl shadow-2xl border border-zinc-700/80 backdrop-blur-xl animate-scale-in space-y-3.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-400">
              <Music className="w-3.5 h-3.5" />
              <span>Background Music</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showPlaylist
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title="Daftar Putar Lagu"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                title="Perkecil"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Playlist Drawer (Jika diklik) */}
          {showPlaylist ? (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              <p className="text-[10px] font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                Pilih Lagu Santai:
              </p>
              {playlist.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    idx === currentTrackIndex
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate">{track.title}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{track.artist}</span>
                  </div>
                  {idx === currentTrackIndex ? (
                    <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-zinc-500 shrink-0">{track.duration}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            /* Track Info with Vinyl Animation */
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 via-rose-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20 overflow-hidden">
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-medium">
                    Lofi Study & Chill
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
            />
            <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
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

            {/* Playback buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors active:scale-95"
                title="Lagu Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 transition-all transform active:scale-90"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors active:scale-95"
                title="Lagu Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[10px] text-zinc-500 font-mono">
              {currentTrackIndex + 1}/{playlist.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
