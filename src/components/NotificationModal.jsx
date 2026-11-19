import React from 'react';
import {
  X,
  Bell,
  Heart,
  MessageSquare,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onOpenPhotoById,
  onOpenGuestbook,
}) {
  if (!isOpen) return null;

  // Format relative time (misal "5 mnt lalu", "2 jam lalu")
  const formatTimeAgo = (dateInput) => {
    if (!dateInput) return 'Baru saja';
    try {
      const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);

      if (diffSec < 60) return 'Baru saja';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
      const diffDays = Math.floor(diffSec / 86400);
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#faf7f2] dark:bg-[#1a1613] border border-[#ded3c2] dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#ded3c2] dark:border-stone-800 bg-[#ede6dc]/60 dark:bg-[#15120f]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-700 text-amber-100 shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-[#f7f3ec] font-sans">
                  Notifikasi Aktivitas
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-700 text-white animate-pulse">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Riwayat like foto dan pesan buku tamu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 rounded-xl hover:bg-[#ded3c2] dark:hover:bg-stone-800 transition-colors"
                title="Tandai semua sudah dibaca"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-[#ded3c2] dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-[#ded3c2]/40 dark:divide-stone-800/40">
          {notifications.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ede6dc] dark:bg-stone-800/60 flex items-center justify-center text-stone-400">
                <Bell className="w-5 h-5 opacity-60" />
              </div>
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Belum ada notifikasi
              </h4>
              <p className="text-[11px] font-mono text-stone-500 max-w-xs mx-auto">
                Setiap kali ada pengunjung yang menyukai fotomu atau menulis pesan, notifikasi akan langsung muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.read) onMarkAsRead(item.id);
                  if (item.type === 'photo_like' && item.photoId) {
                    onOpenPhotoById(item.photoId);
                    onClose();
                  } else if (item.type === 'guestbook_message') {
                    onOpenGuestbook && onOpenGuestbook();
                    onClose();
                  }
                }}
                className={`group pt-2.5 first:pt-0 flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                  !item.read
                    ? 'bg-amber-100/60 dark:bg-amber-950/20 border border-amber-300/50 dark:border-amber-800/40 shadow-xs'
                    : 'hover:bg-[#ede6dc]/50 dark:hover:bg-[#201b17]'
                }`}
              >
                {/* Thumbnail / Icon */}
                {item.type === 'photo_like' ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-amber-600/30">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.photoTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-500 text-xs">
                        📷
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 p-0.5 bg-rose-600 text-white rounded-tl-md">
                      <Heart className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-700/15 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-600/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                )}

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      {item.type === 'photo_like' ? '❤️ Like Foto' : '💬 Pesan Buku Tamu'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-stone-400">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  {item.type === 'photo_like' ? (
                    <div className="mt-0.5">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        Seseorang menyukai foto: <span className="font-bold underline decoration-amber-500/40">"{item.photoTitle}"</span>
                      </p>
                      {item.photoCategory && (
                        <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.2 rounded-md bg-[#ded3c2] dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {item.photoCategory}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-0.5">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {item.senderName} menulis pesan:
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 truncate italic">
                        "{item.messagePreview}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Action: Delete notification */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNotification(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded-lg hover:bg-[#ded3c2] dark:hover:bg-stone-800 transition-all self-center shrink-0"
                  title="Hapus notifikasi ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer toolbar */}
        {notifications.length > 0 && (
          <div className="p-3.5 border-t border-[#ded3c2] dark:border-stone-800 bg-[#ede6dc]/60 dark:bg-[#15120f]/80 flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-stone-500">
              Total {notifications.length} notifikasi
            </span>
            <button
              onClick={() => {
                if (window.confirm('Bersihkan semua riwayat notifikasi?')) {
                  onClearAll();
                }
              }}
              className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan Semua</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
