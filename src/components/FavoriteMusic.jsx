import React, { useState } from 'react';
import {
  Music,
  Headphones,
  Disc,
  ExternalLink,
  Flame,
  Radio,
  Sparkles,
} from 'lucide-react';
import TiltCard from './TiltCard';
import { musicProfile, favoriteBands, favoriteTracks, playerPresets } from '../data/favoriteMusic';

export default function FavoriteMusic() {
  const [filter, setFilter] = useState('all'); // 'all' | 'bands' | 'tracks' | 'playlist'
  const [activePreset, setActivePreset] = useState(playerPresets[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16 animate-fade-in">
      {/* Hero Banner Header with Vintage Vinyl / Cassette Vibe */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1815] via-[#241f1a] to-[#14110f] border border-amber-600/30 text-[#f5f0eb] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-52 h-52 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-sm">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Playlist & Band Favorit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f5f0eb]">
              {musicProfile.headline}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              {musicProfile.bio}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Spotify Profile Button */}
            <a
              href={musicProfile.spotifyProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold shadow-lg shadow-[#1DB954]/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.674.464-1.026.248-2.812-1.718-6.352-2.106-10.521-1.153-.404.092-.81-.16-.902-.564-.092-.403.16-.81.564-.902 4.568-1.044 8.487-.604 11.637 1.323.352.216.464.674.248 1.048zm1.47-3.268c-.272.443-.854.582-1.297.31-3.218-1.978-8.125-2.55-11.93-1.394-.497.15-1.027-.133-1.178-.63-.15-.498.133-1.028.63-1.179 4.354-1.321 9.775-.68 13.465 1.587.443.272.582.854.31 1.306zm.126-3.41c-3.858-2.29-10.228-2.502-13.918-1.381-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.219.75-1.399 4.245-1.289 11.278-1.043 15.726 1.597.532.316.707 1.008.39 1.54-.316.533-1.008.708-1.55.393z" />
              </svg>
              <span>Buka Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25'
              : 'bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-900 border border-[#ded3c2] dark:border-stone-800/80'
          }`}
        >
          Semua ({favoriteBands.length + favoriteTracks.length})
        </button>
        <button
          onClick={() => setFilter('bands')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
            filter === 'bands'
              ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25'
              : 'bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-900 border border-[#ded3c2] dark:border-stone-800/80'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Band Favorit ({favoriteBands.length})</span>
        </button>
        <button
          onClick={() => setFilter('tracks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
            filter === 'tracks'
              ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25'
              : 'bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-900 border border-[#ded3c2] dark:border-stone-800/80'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Lagu On Repeat ({favoriteTracks.length})</span>
        </button>
        <button
          onClick={() => setFilter('playlist')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${
            filter === 'playlist'
              ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25'
              : 'bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-900 border border-[#ded3c2] dark:border-stone-800/80'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Playlist Player</span>
        </button>
      </div>

      {/* SECTION 1: BAND & MUSISI FAVORIT */}
      {(filter === 'all' || filter === 'bands') && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎸</span>
              <h3 className="text-base font-bold text-stone-900 dark:text-[#f7f3ec] font-sans">
                Band & Musisi Favorit
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ede6dc] dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-mono font-bold">
              {favoriteBands.length} Musisi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteBands.map((band) => (
              <TiltCard key={band.id} maxTilt={6} glare={true} className="group">
                <div
                  className="h-full rounded-3xl bg-[#faf6ee] dark:bg-[#1c1815] border border-[#ded3c2] dark:border-stone-800 p-5 shadow-sm hover:shadow-xl hover:border-amber-600/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo & Badge */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <img
                        src={band.image}
                        alt={band.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-600/40 group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {band.name}
                        </h4>
                        <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                          {band.origin}
                        </p>
                        <span className="inline-block mt-1 text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300">
                          {band.genre}
                        </span>
                      </div>
                    </div>

                    {/* Personal Quote */}
                    {band.quote && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic bg-[#f5efe6] dark:bg-[#141210] p-2.5 rounded-2xl border border-[#ded3c2]/60 dark:border-stone-800 mb-3">
                        "{band.quote}"
                      </p>
                    )}

                    {/* Top Songs */}
                    <div className="space-y-1 mb-4">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                        Lagu Pilihan:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {band.topSongs.map((song, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-[#ede6dc] dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                          >
                            🎵 {song}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spotify Link */}
                  <a
                    href={band.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-[#ede6dc] dark:bg-stone-800 hover:bg-[#1DB954] hover:text-black dark:hover:bg-[#1DB954] dark:hover:text-black text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.674.464-1.026.248-2.812-1.718-6.352-2.106-10.521-1.153-.404.092-.81-.16-.902-.564-.092-.403.16-.81.564-.902 4.568-1.044 8.487-.604 11.637 1.323.352.216.464.674.248 1.048zm1.47-3.268c-.272.443-.854.582-1.297.31-3.218-1.978-8.125-2.55-11.93-1.394-.497.15-1.027-.133-1.178-.63-.15-.498.133-1.028.63-1.179 4.354-1.321 9.775-.68 13.465 1.587.443.272.582.854.31 1.306zm.126-3.41c-3.858-2.29-10.228-2.502-13.918-1.381-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.219.75-1.399 4.245-1.289 11.278-1.043 15.726 1.597.532.316.707 1.008.39 1.54-.316.533-1.008.708-1.55.393z" />
                    </svg>
                    <span>Dengarkan di Spotify</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: LAGU PILIHAN ON REPEAT */}
      {(filter === 'all' || filter === 'tracks') && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <h3 className="text-base font-bold text-stone-900 dark:text-[#f7f3ec] font-sans">
                Lagu On Repeat (Lagi Sering Diputar)
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ede6dc] dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-mono font-bold">
              {favoriteTracks.length} Lagu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {favoriteTracks.map((track) => (
              <div
                key={track.id}
                className="group flex items-center justify-between p-3.5 rounded-3xl bg-[#faf6ee] dark:bg-[#1c1815] border border-[#ded3c2] dark:border-stone-800 hover:border-amber-600/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-amber-600/30 dark:ring-stone-700 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                      {track.artist} • {track.year}
                    </p>
                    <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold">
                      #{track.tag}
                    </span>
                  </div>
                </div>

                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-stone-400 hover:text-[#1DB954] hover:bg-[#ede6dc] dark:hover:bg-stone-800 transition-colors shrink-0"
                  title="Buka di Spotify"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: SPOTIFY EMBEDDED PLAYLIST PLAYER DARI BAND FAVORIT */}
      {(filter === 'all' || filter === 'playlist') && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎧</span>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-[#f7f3ec] font-sans">
                  Spotify Playlist Player
                </h3>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  Pilih band atau lagu favoritmu di bawah untuk langsung diputar di player
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold self-start sm:self-auto bg-amber-100/70 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-300/60 dark:border-amber-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Memutar: {activePreset?.artist}</span>
            </span>
          </div>

          {/* Preset Pill Selector untuk Semua Band Favorit Ahmad */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none no-scrollbar">
            {playerPresets.map((preset) => {
              const isActive = activePreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-[#fcfaf7] shadow-md shadow-amber-950/25 font-bold border border-amber-600/40'
                      : 'bg-[#faf6ee] dark:bg-[#1a1613] text-stone-700 dark:text-stone-300 hover:bg-[#ede6dc] dark:hover:bg-stone-800 border border-[#ded3c2] dark:border-stone-800'
                  }`}
                >
                  <Disc className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400 animate-spin-slow' : 'text-stone-400'}`} />
                  <span>{preset.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Spotify Player Container */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#ded3c2] dark:border-stone-800 bg-[#12100e] relative group">
            <div className="px-5 py-3 bg-[#1c1815] border-b border-stone-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="truncate">
                  <strong className="text-amber-400">{activePreset?.artist}</strong> — {activePreset?.title}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 shrink-0 ml-2 hidden sm:inline">
                Spotify Player Official
              </span>
            </div>

            <iframe
              key={activePreset?.id}
              style={{ borderRadius: '0px 0px 24px 24px' }}
              src={activePreset?.embedUrl || musicProfile.spotifyEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`Spotify Player - ${activePreset?.title}`}
            />
          </div>
        </section>
      )}
    </div>
  );
}
