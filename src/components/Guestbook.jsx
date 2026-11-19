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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-mono font-semibold shadow-sm">
          <span>📻</span>
          <span>Buku Tamu & Catatan</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-[#f7f3ec] tracking-tight">
          Tinggalkan Pesan & Sapaan
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
          Tulis pesan, cerita kenangan, atau sapaan untuk Ahmad di sini. Pesan kamu akan langsung diarsipkan di bawah.
        </p>
      </div>

      {/* Input Message Card Form (Vintage Journal Memo Style) */}
      <div className="relative bg-[#faf6ee] dark:bg-[#1a1613] rounded-3xl p-5 sm:p-7 shadow-xl border border-[#ded3c2] dark:border-stone-800">
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Name Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 font-mono">
                <span>Nama Pengirim:</span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800 dark:text-amber-400 cursor-pointer select-none font-mono">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-600 h-3.5 w-3.5 accent-amber-700"
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
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[#ded3c2] dark:border-stone-700 bg-white dark:bg-[#12100e] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/40 disabled:opacity-60 transition-all shadow-inner font-sans"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 font-mono">
              <span>Catatan Pesan:</span>
            </label>
            <textarea
              required
              disabled={submitting}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan atau sapaan kamu..."
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[#ded3c2] dark:border-stone-700 bg-white dark:bg-[#12100e] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-600/40 resize-none transition-all shadow-inner font-sans"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-700 via-orange-700 to-stone-900 hover:from-amber-800 hover:to-black disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-950/25 transition-all transform hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>{submitting ? 'Mengirim...' : 'Kirim Catatan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Messages List Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2 font-mono">
            <span>Daftar Catatan Masuk</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ede6dc] dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-bold">
              {messages.length} Pesan
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-3xl bg-[#ede6dc]/60 dark:bg-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center bg-[#faf6ee]/70 dark:bg-[#1a1613]/70 rounded-3xl border border-dashed border-[#ded3c2] dark:border-stone-800 p-6">
            <span className="text-3xl block mb-2 text-stone-400">📻</span>
            <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Belum ada catatan yang masuk.
            </p>
            <p className="text-[11px] text-stone-500 mt-1 font-mono">
              Jadilah yang pertama mengisi buku tamu di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="group relative bg-[#faf6ee] dark:bg-[#1c1815] rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-amber-600/40 border border-[#ded3c2] dark:border-stone-800/80 transition-all duration-300 space-y-3"
              >
                {/* Header: Avatar, Name, Relationship, Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-2xl bg-[#ede6dc] dark:bg-stone-800 flex items-center justify-center text-base shadow-inner">
                      {item.avatarEmoji || '✉️'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                        {item.name}
                      </h4>
                      <span className="inline-block text-[10px] text-amber-700 dark:text-amber-400 font-mono font-medium">
                        {item.relationship || 'Teman'}
                      </span>
                    </div>
                  </div>

                  {/* Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteMessage(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                      title="Hapus pesan ini (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Message Content */}
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap bg-[#f5efe6] dark:bg-[#141210] p-3 rounded-2xl border border-[#ded3c2]/60 dark:border-stone-800">
                  {item.message}
                </p>

                {/* Footer: Date & Like Counter */}
                <div className="pt-2 border-t border-[#ded3c2] dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-400">
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
