import React, { useState } from 'react';
import { MessageSquarePlus, Trash2, Send, Sparkles, MessageCircle, Heart } from 'lucide-react';
import LikeButton from './LikeButton';

export default function Guestbook({
  messages = [],
  loading = false,
  onSendMessage,
  onDeleteMessage,
  onLikeMessage,
  isAdmin = false,
}) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await onSendMessage({
        name: isAnonymous ? 'Anonim' : name.trim() || 'Teman',
        relationship: 'Teman',
        message: message.trim(),
        avatarEmoji: '💬',
      });
      setMessage('');
      if (!isAnonymous) setName('');
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
      alert('Gagal mengirim pesan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (id) => {
    if (likedPosts[id]) return;
    setLikedPosts((prev) => ({ ...prev, [id]: true }));
    onLikeMessage?.(id);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'Baru saja';
    try {
      const d = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-bold shadow-sm">
          <span>💬</span>
          <span>Buku Tamu</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Tinggalkan Pesan & Sapaan
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Tulis pesan, kesan, atau sapaan untuk Ahmad di sini. Pesan kamu akan langsung tampil di bawah.
        </p>
      </div>

      {/* Input Message Card Form */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-7 shadow-xl border border-pink-200/80 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Name Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <span>Nama:</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-pink-600 dark:text-pink-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-500 h-3.5 w-3.5 accent-pink-500"
                />
                <span>Kirim sebagai Anonim</span>
              </label>
            </div>
            <input
              type="text"
              disabled={isAnonymous || submitting}
              value={isAnonymous ? 'Anonim' : name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu..."
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-pink-200 dark:border-zinc-700 bg-pink-50/40 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-pink-400/50 disabled:opacity-60 transition-all shadow-inner"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              <span>Pesan:</span>
            </label>
            <textarea
              required
              disabled={submitting}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan atau sapaan kamu..."
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-pink-200 dark:border-zinc-700 bg-pink-50/40 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-pink-400/50 resize-none transition-all shadow-inner"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-lg shadow-pink-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Messages List Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <span>Daftar Pesan Masuk</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-300 font-bold">
              {messages.length} Pesan
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-pink-50 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center bg-white/70 dark:bg-zinc-900/60 rounded-3xl border border-dashed border-pink-200 dark:border-zinc-800 p-6">
            <span className="text-3xl block mb-2 text-zinc-400">💬</span>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Belum ada pesan masuk.
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Jadilah yang pertama menulis pesan di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-zinc-900/90 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-pink-400/50 border border-pink-200/70 dark:border-zinc-800/80 transition-all duration-300 space-y-3"
              >
                {/* Header: Avatar, Name, Relationship, Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-2xl bg-pink-100 dark:bg-zinc-800 flex items-center justify-center text-base shadow-inner">
                      {item.avatarEmoji || '💬'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {item.name}
                      </h4>
                      <span className="inline-block text-[10px] text-pink-500 font-semibold">
                        {item.relationship || 'Teman'}
                      </span>
                    </div>
                  </div>

                  {/* Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteMessage(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Hapus pesan ini (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Message Content */}
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap bg-pink-50/40 dark:bg-zinc-800/40 p-3 rounded-2xl border border-pink-100/60 dark:border-zinc-800/60">
                  {item.message}
                </p>

                {/* Footer: Date & Like Counter */}
                <div className="pt-2 border-t border-pink-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>{formatDate(item.createdAt)}</span>

                  <LikeButton
                    size="sm"
                    isLiked={!!likedPosts[item.id]}
                    count={item.likes || 0}
                    onToggle={() => handleLike(item.id)}
                    title="Sukai pesan ini"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
