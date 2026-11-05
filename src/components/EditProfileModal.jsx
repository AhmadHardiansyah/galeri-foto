import React, { useState, useRef } from 'react';
import { X, Camera, Check, Loader2, User, MapPin, Sparkles, MessageCircle, Mail, Share2 } from 'lucide-react';
import { compressImageToDataUrl } from '../utils/imageCompressor';

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    username: profile.username || '',
    tagline: profile.tagline || '',
    bio: profile.bio || '',
    location: profile.location || '',
    status: profile.status || '',
    avatarUrl: profile.avatarUrl || '',
    socials: profile.socials || [
      { name: 'WhatsApp', url: '', icon: 'MessageCircle', primary: false, label: 'Hubungi via WA' },
      { name: 'Email', url: '', icon: 'Mail', primary: false, label: 'Kirim Email' },
      { name: 'TikTok / Portofolio', url: '', icon: 'Share2', primary: false, label: 'Lihat TikTok' },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl || '');
  const fileInputRef = useRef();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImageToDataUrl(file, 400, 0.8);
      setAvatarPreview(compressedBase64);
      setFormData((prev) => ({ ...prev, avatarUrl: compressedBase64 }));
    } catch (err) {
      console.error('Gagal kompres avatar:', err);
      alert('Gagal memproses foto profil dari HP: ' + err.message);
    }
  };

  const handleSocialUrlChange = (index, newUrl) => {
    setFormData((prev) => {
      const nextSocials = [...prev.socials];
      nextSocials[index] = { ...nextSocials[index], url: newUrl };
      return { ...prev, socials: nextSocials };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Gagal simpan profil:', err);
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={!saving ? onClose : undefined}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <User className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold">Edit Profil Bio</h2>
          </div>
          {!saving && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar Edit Section */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full border-2 border-white dark:border-zinc-900"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Ganti Foto</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Klik foto di atas untuk memilih foto profil baru dari galeri Anda
            </p>
          </div>

          {/* Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmad Hardiansyah"
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Username (@)
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="@Ahmdhrdynsyah"
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
          </div>

          {/* Tagline & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tagline / Profesi
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Mahasiswa / Fotografer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Status Badge (Hijau)
              </label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="Mahasiswa / Open Photoshoot"
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Lokasi Domisili
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Bogor, Indonesia"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Bio Singkat
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Selamat datang di website galeri pribadi saya..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
            />
          </div>

          {/* Social Links Editor */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
              Tautan Sosial Media & Kontak
            </span>

            {formData.socials?.map((social, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {social.name}
                </label>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => handleSocialUrlChange(idx, e.target.value)}
                  placeholder={`Link ${social.name}`}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition-all shadow-md shadow-rose-500/20 active:scale-[0.99] mt-3"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Cloud...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

