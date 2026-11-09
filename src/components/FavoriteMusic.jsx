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
import { musicProfile, favoriteBands, favoriteTracks } from '../data/favoriteMusic';

export default function FavoriteMusic() {
  const [filter, setFilter] = useState('all'); // 'all' | 'bands' | 'tracks' | 'playlist'

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16 animate-fade-in">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 text-white p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Heavy Rotation & Soundtracks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              {musicProfile.headline}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              {musicProfile.bio}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Spotify Profile Button */}
            <a
              href={musicProfile.spotifyProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold shadow-lg shadow-[#1DB954]/25 transition-transform active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.674.464-1.026.248-2.812-1.718-6.352-2.106-10.521-1.153-.404.092-.81-.16-.902-.564-.092-.403.16-.81.564-.902 4.568-1.044 8.487-.604 11.637 1.323.352.216.464.674.248 1.048zm1.47-3.268c-.272.443-.854.582-1.297.31-3.218-1.978-8.125-2.55-11.93-1.394-.497.15-1.027-.133-1.178-.63-.15-.498.133-1.028.63-1.179 4.354-1.321 9.775-.68 13.465 1.587.443.272.582.854.31 1.306zm.126-3.41c-3.858-2.29-10.228-2.502-13.918-1.381-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.219.75-1.399 4.245-1.289 11.278-1.043 15.726 1.597.532.316.707 1.008.39 1.54-.316.533-1.008.708-1.55.393z" />
              </svg>
              <span>Buka di Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Semua ({favoriteBands.length + favoriteTracks.length})
        </button>
        <button
          onClick={() => setFilter('bands')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filter === 'bands'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Band & Musisi Favorit ({favoriteBands.length})</span>
        </button>
        <button
          onClick={() => setFilter('tracks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filter === 'tracks'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Lagu On Repeat ({favoriteTracks.length})</span>
        </button>
        <button
          onClick={() => setFilter('playlist')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filter === 'playlist'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Playlist Player</span>
        </button>
      </div>

      {/* SECTION 1: BAND & MUSISI FAVORIT */}
      {(filter === 'all' || filter === 'bands') && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-rose-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Band & Musisi Favorit
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">
              {favoriteBands.length} Artis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteBands.map((band) => (
              <div
                key={band.id}
                className="group relative rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-xl hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={band.image}
                      alt={band.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/30 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-500 transition-colors">
                        {band.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {band.origin}
                      </p>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-medium bg-rose-500/10 text-rose-500 dark:text-rose-400">
                        {band.genre}
                      </span>
                    </div>
                  </div>

                  {/* Personal Quote */}
                  {band.quote && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 italic bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800 mb-3">
                      "{band.quote}"
                    </p>
                  )}

                  {/* Top Songs */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      Lagu Pilihan:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {band.topSongs.map((song, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
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
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-[#1DB954] hover:text-black dark:hover:bg-[#1DB954] dark:hover:text-black text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.674.464-1.026.248-2.812-1.718-6.352-2.106-10.521-1.153-.404.092-.81-.16-.902-.564-.092-.403.16-.81.564-.902 4.568-1.044 8.487-.604 11.637 1.323.352.216.464.674.248 1.048zm1.47-3.268c-.272.443-.854.582-1.297.31-3.218-1.978-8.125-2.55-11.93-1.394-.497.15-1.027-.133-1.178-.63-.15-.498.133-1.028.63-1.179 4.354-1.321 9.775-.68 13.465 1.587.443.272.582.854.31 1.306zm.126-3.41c-3.858-2.29-10.228-2.502-13.918-1.381-.59.18-1.218-.16-1.398-.75-.18-.59.16-1.219.75-1.399 4.245-1.289 11.278-1.043 15.726 1.597.532.316.707 1.008.39 1.54-.316.533-1.008.708-1.55.393z" />
                  </svg>
                  <span>Dengarkan di Spotify</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: LAGU PILIHAN ON REPEAT */}
      {(filter === 'all' || filter === 'tracks') && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Lagu On Repeat (Heavy Rotation)
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">
              {favoriteTracks.length} Lagu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteTracks.map((track) => (
              <div
                key={track.id}
                className="group flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-rose-500 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {track.artist} • {track.year}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                      #{track.tag}
                    </span>
                  </div>
                </div>

                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full text-zinc-400 hover:text-[#1DB954] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                  title="Buka di Spotify"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: SPOTIFY EMBEDDED PLAYLIST */}
      {(filter === 'all' || filter === 'playlist') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-rose-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Spotify Playlist Player
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">Official Player</span>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 bg-black/40">
            <iframe
              style={{ borderRadius: '12px' }}
              src={musicProfile.spotifyEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist"
            />
          </div>
        </section>
      )}
    </div>
  );
}
