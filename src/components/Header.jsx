import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Share2, 
  Check, 
  Sparkles, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Camera, 
  Pencil,
  MessageCircle,
  Mail,
  Heart,
  Film,
  Bell
} from 'lucide-react';
import { profileData as fallbackProfile } from '../data/profile';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  totalPhotos = 0,
  totalLikes = 0,
  currentUser = null,
  onOpenLogin,
  onLogout,
  profile: propProfile,
  onEditProfile,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const [copied, setCopied] = useState(false);
  const profile = propProfile || fallbackProfile;

  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} — Galeri Lucu & Bio`,
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
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 px-3.5 py-1.5 rounded-full border border-amber-300/70 dark:border-amber-800/60 shadow-sm backdrop-blur">
          <Film className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>35mm Visual Archive</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell Button */}
          {currentUser && onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full border border-stone-300 dark:border-stone-800 bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-900 hover:text-amber-800 dark:hover:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Notifikasi Aktivitas (Likes & Pesan)"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-mono font-bold text-white bg-rose-600 rounded-full shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Indicator / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
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
              className="p-2 rounded-full border border-stone-300 dark:border-stone-800 bg-white/80 dark:bg-[#1c1815]/80 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Login Pemilik Galeri"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-800 bg-white/80 dark:bg-[#1c1815]/80 hover:bg-amber-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 hover:scale-105 active:scale-95 transition-all shadow-sm backdrop-blur"
            title="Bagikan link web ini"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full border border-stone-300 dark:border-stone-800 bg-white/80 dark:bg-[#1c1815]/80 text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-900 hover:scale-105 active:scale-95 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>
        </div>
      </div>

      {/* Avatar with Ring & Clickable Edit if Admin */}
      <div 
        onClick={currentUser ? onEditProfile : undefined}
        className={`relative inline-block mb-4 group ${currentUser ? 'cursor-pointer' : ''}`}
        title={currentUser ? "Klik untuk mengedit foto profil & data diri" : undefined}
      >
        <div className="relative">
          {/* Animated Glowing Ring Aura */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 opacity-50 blur-md group-hover:opacity-90 transition-opacity" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-700 via-amber-600 to-stone-800 shadow-xl shadow-amber-950/20">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full border-2 border-[#faf7f2] dark:border-[#12100e] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        
        {/* Badge Icon */}
        <div className="absolute bottom-1 right-1 bg-amber-800 text-amber-100 p-1.5 rounded-full shadow-lg border-2 border-white dark:border-[#12100e]">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-[#f7f3ec]">
            {profile.name}
          </h1>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-bold shadow-sm" title="Verified">
            ✓
          </span>
        </div>
        <p className="text-xs sm:text-sm font-mono font-medium text-amber-800 dark:text-amber-400">
          {profile.username ? (profile.username.startsWith('@') ? profile.username : `@${profile.username}`) : ''} {profile.tagline ? `• ${profile.tagline}` : ''}
        </p>
      </div>

      {/* Bio text */}
      <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
        {profile.bio}
      </p>

      {/* Location & Status */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-500 dark:text-stone-400">
        {profile.location && (
          <span className="flex items-center gap-1.5 bg-[#ede6dc]/80 dark:bg-[#1a1613] px-3 py-1 rounded-full border border-[#ded3c2] dark:border-stone-800 text-[11px] font-mono">
            <MapPin className="w-3 h-3 text-amber-700 dark:text-amber-400" />
            {profile.location}
          </span>
        )}
        {profile.status && (
          <span className="flex items-center gap-1.5 bg-[#ede6dc]/80 dark:bg-[#1a1613] px-3 py-1 rounded-full border border-[#ded3c2] dark:border-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {profile.status}
          </span>
        )}
      </div>

      {/* Quick Edit Profile Pill (Hanya muncul jika admin login) */}
      {currentUser && (
        <div className="mt-3">
          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-100/90 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-stone-700 transition-all shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Edit Profil</span>
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
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm ${
              social.primary
                ? 'bg-gradient-to-r from-amber-700 via-orange-700 to-stone-900 hover:from-amber-800 hover:to-black text-white shadow-amber-900/25'
                : 'bg-white hover:bg-amber-50/80 dark:bg-[#1a1613] dark:hover:bg-[#231e1a] text-stone-800 dark:text-stone-200 border border-[#dfd4c4] dark:border-stone-800'
            }`}
          >
            {renderIcon(social.icon)}
            <span>{social.label}</span>
          </a>
        ))}
      </div>

      {/* Vintage Stats Counter Bar */}
      <div className="mt-7 pt-5 border-t border-[#dfd4c4] dark:border-stone-800/80 grid grid-cols-3 max-w-xs mx-auto text-center divide-x divide-[#dfd4c4] dark:divide-stone-800 bg-[#ede6dc]/70 dark:bg-[#1c1815]/80 rounded-2xl py-3 border border-[#ded3c2] dark:border-stone-800/80 shadow-sm backdrop-blur">
        <div>
          <div className="text-base font-extrabold font-mono text-amber-800 dark:text-amber-400">{totalPhotos}</div>
          <div className="text-[9px] font-bold font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">Foto</div>
        </div>
        <div>
          <div className="text-base font-extrabold font-mono text-amber-700 dark:text-amber-300">{totalLikes}</div>
          <div className="text-[9px] font-bold font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">Suka</div>
        </div>
        <div>
          <div className="text-base font-extrabold font-mono text-stone-800 dark:text-stone-300">Roll</div>
          <div className="text-[9px] font-bold font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">Kenangan</div>
        </div>
      </div>
    </header>
  );
}
