import React, { useState } from 'react';
import { MessageSquarePlus, Heart, Trash2, Send, Sparkles, User, MessageCircle } from 'lucide-react';

const RELATION_TAGS = [
  'Teman SMK',
  'Teman SMP',
  'Keluarga',
  'Teman Rumah',
  'Sahabat',
  'Teman Online / IG',
  'Lainnya',
];

const EMOJI_OPTIONS = ['😎', '✨', '☕', '🎮', '🔥', '🌸', '🚀', '💖', '👋'];

export default function Guestbook({
  messages = [],
  loading = false,
  onSendMessage,
  onDeleteMessage,
  onLikeMessage,
  isAdmin = false,
}) {
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [relationship, setRelationship] = useState('Teman SMK');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert('Tulis pesan Anda terlebih dahulu.');

    setSubmitting(true);
    try {
      await onSendMessage({
        name: isAnonymous ? 'Teman Rahasia (Anonim)' : name.trim() || 'Teman',
        relationship,
        message,
        avatarEmoji: selectedEmoji,
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
    if (likedPosts[id]) return; // Cegah spam like lokal
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
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Buku Tamu & Pesan Teman</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Tinggalkan Jejak & Pesan Anda 💬
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Tulis kenangan bareng Ahmad, salam sapa, atau pesan rahasia di sini. Pesan Anda akan langsung tampil di bawah!
        </p>
      </div>

      {/* Input Message Card Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Name Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nama Anda
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500 h-3.5 w-3.5"
                  />
                  <span>Kirim Anonim (Rahasia)</span>
                </label>
              </div>
              <input
                type="text"
                disabled={isAnonymous || submitting}
                value={isAnonymous ? 'Teman Rahasia (Anonim)' : name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi / Siti"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-60 transition-all"
              />
            </div>

            {/* Relationship Tag Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Sebagai Siapa?
              </label>
              <select
                disabled={submitting}
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                {RELATION_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emoji Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Pilih Emotikon Ikon Anda:
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all ${
                    selectedEmoji === em
                      ? 'bg-rose-500 text-white scale-110 shadow-md shadow-rose-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Pesan / Kesan / Cerita <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              disabled={submitting}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan Anda untuk Ahmad di sini..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
          </button>
        </form>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Pesan Masuk</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-xs">
              {messages.length}
            </span>
          </h3>
          <span className="text-[11px] text-zinc-400">Diperbarui real-time ⚡</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <MessageSquarePlus className="w-8 h-8 mx-auto text-zinc-400 mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Belum ada pesan yang masuk
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Jadilah orang pertama yang meninggalkan pesan manis atau kesan untuk Ahmad! ✨
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {messages.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-zinc-900/80 rounded-2xl p-4 shadow-sm hover:shadow-md border border-zinc-200/80 dark:border-zinc-800/80 transition-all space-y-3"
              >
                {/* Header: Avatar, Name, Relationship, Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-base shadow-inner">
                      {item.avatarEmoji || '✨'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {item.name}
                      </h4>
                      <span className="inline-block text-[10px] text-rose-500 font-semibold">
                        {item.relationship}
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
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  "{item.message}"
                </p>

                {/* Footer: Date & Like Counter */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>{formatDate(item.createdAt)}</span>

                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                      likedPosts[item.id]
                        ? 'text-rose-500 bg-rose-500/10 font-bold'
                        : 'hover:text-rose-500'
                    }`}
                    title="Suka pesan ini"
                  >
                    <Heart className={`w-3 h-3 ${likedPosts[item.id] ? 'fill-current' : ''}`} />
                    <span>{(item.likes || 0) + (likedPosts[item.id] ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

