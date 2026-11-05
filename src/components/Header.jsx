import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  Share2, 
  Check, 
  MapPin, 
  Moon, 
  Sun, 
  Camera, 
  Sparkles,
  Lock,
  LogOut,
  ShieldCheck,
  Pencil
} from 'lucide-react';
import { profileData as fallbackProfile } from '../data/profile';

export default function Header({ 
  isDarkMode, 
  setIsDarkMode, 
  totalPhotos, 
  totalLikes,
  currentUser,
  onOpenLogin,
  onLogout,
  profile: propProfile,
  onEditProfile
}) {
  const [copied, setCopied] = useState(false);
  const profile = propProfile || fallbackProfile;

  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} — Galeri Foto`,
      text: profile.bio,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignored
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case 'MessageCircle':
        return <MessageCircle className="w-4 h-4" />;
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  return (
    <header className="relative pt-8 pb-6 px-4 max-w-4xl mx-auto text-center">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          <Camera className="w-3.5 h-3.5" />
          <span>Visual Portfolio</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Indicator / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Mode</span>
              <button
                onClick={onLogout}
                className="ml-1 p-0.5 hover:text-red-500 transition-colors"
                title="Keluar dari akun admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
              title="Login Pemilik Galeri"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all shadow-sm backdrop-blur"
            title="Bagikan link web ini"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Bio</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>
        </div>
      </div>

      {/* Avatar with clickable edit if admin */}
      <div 
        onClick={currentUser ? onEditProfile : undefined}
        className={`relative inline-block mb-4 group ${currentUser ? 'cursor-pointer' : ''}`}
        title={currentUser ? "Klik untuk mengedit foto profil & data diri" : undefined}
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xl shadow-rose-500/20">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover rounded-full border-2 border-white dark:border-zinc-950 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Badge Icon */}
        <div className="absolute bottom-1 right-1 bg-rose-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-zinc-950">
          {currentUser ? <Pencil className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
        </div>

        {/* Hover overlay for admin */}
        {currentUser && (
          <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold">
            <Camera className="w-5 h-5 mb-0.5" />
            <span>Ubah Profil</span>
          </div>
        )}
      </div>

      {/* Name & Tagline */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {profile.name}
          </h1>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-bold" title="Verified Creator">
            ✓
          </span>
        </div>
        <p className="text-sm font-medium text-rose-500 dark:text-rose-400">
          {profile.username ? (profile.username.startsWith('@') ? profile.username : `@${profile.username}`) : ''} {profile.tagline ? `• ${profile.tagline}` : ''}
        </p>
      </div>

      {/* Bio text */}
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
        {profile.bio}
      </p>

      {/* Location & Status */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {profile.location}
          </span>
        )}
        {profile.location && profile.status && (
          <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
        )}
        {profile.status && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {profile.status}
          </span>
        )}
      </div>

      {/* Quick Edit Profile Pill (Hanya muncul jika admin login) */}
      {currentUser && (
        <div className="mt-3">
          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5 text-rose-500" />
            <span>Edit Profil Saya</span>
          </button>
        </div>
      )}

      {/* Quick Links / Bio Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 max-w-lg mx-auto">
        {profile.socials?.filter(s => s.url).map((social, idx) => (
          <a
            key={idx}
            href={social.url.startsWith('http') || social.url.startsWith('mailto:') ? social.url : `https://${social.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 transform active:scale-95 shadow-sm ${
              social.primary
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-rose-500/25'
                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50'
            }`}
          >
            {renderIcon(social.icon)}
            <span>{social.label}</span>
          </a>
        ))}
      </div>

      {/* Stats pill counter */}
      <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800/70 grid grid-cols-3 max-w-xs mx-auto text-center divide-x divide-zinc-200 dark:divide-zinc-800">
        <div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{totalPhotos}</div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Koleksi</div>
        </div>
        <div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{totalLikes}</div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Apresiasi</div>
        </div>
        <div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">4K</div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Kualitas</div>
        </div>
      </div>
    </header>
  );
}
