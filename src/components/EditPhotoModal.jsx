import React, { useState } from 'react';
import { X, Check, Loader2, Sparkles, MapPin, Camera, Tag, FileText, Sliders } from 'lucide-react';
import { FILTER_PRESETS, getFilterClass } from '../utils/filterPresets';

export default function EditPhotoModal({
  photo,
  onClose,
  onSave,
  availableCategories = ['SMP', 'SMK', 'Family', 'Rumah', 'Momen', 'Kampus'],
}) {
  const [title, setTitle] = useState(photo.title || '');
  const [description, setDescription] = useState(photo.description || '');
  const [location, setLocation] = useState(photo.location || '');
  const [camera, setCamera] = useState(photo.camera || '');
  const [category, setCategory] = useState(photo.category || 'Momen');
  const [filterPreset, setFilterPreset] = useState(photo.filterPreset || 'normal');
  const [saving, setSaving] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [customCatName, setCustomCatName] = useState('');

  const imgSrc = photo.url || photo.src;

  // Filter out 'Semua' and legacy tags from availableCategories
  const categoryOptions = Array.from(
    new Set([
      'SMP',
      'SMK',
      'Family',
      'Rumah',
      'Momen',
      'Kampus',
      ...availableCategories.filter((c) => !['Semua', 'Teman SMP', 'Teman SMK', 'Keluarga', 'Teman Rumah', 'Momen Spesial'].includes(c)),
    ])
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul foto wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      const finalCategory = customCategory && customCatName.trim() ? customCatName.trim() : category;
      await onSave(photo.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        camera: camera.trim(),
        category: finalCategory,
        filterPreset,
      });
      onClose();
    } catch (err) {
      console.error('Gagal update foto:', err);
      alert('Gagal menyimpan perubahan foto: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in text-zinc-900 dark:text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Edit Detail & Efek Foto</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Ubah judul, caption, tempat, dan preset filter warna foto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Photo Preview with Filter Effect */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Pratinjau Efek Filter Foto:
            </label>
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-black/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <img
                src={imgSrc}
                alt="Preview"
                className={`max-h-full max-w-full object-contain transition-all duration-300 ${getFilterClass(filterPreset)}`}
              />
              <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                Filter: {FILTER_PRESETS.find((f) => f.id === filterPreset)?.name}
              </span>
            </div>

            {/* Filter Presets Selector Bar */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1.5 pt-0.5">
              {FILTER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setFilterPreset(preset.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    filterPreset === preset.id
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-105'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Judul Foto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={saving}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Liburan ke Pantai"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>Kategori Foto</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomCategory(!customCategory)}
                className="text-[11px] text-rose-500 hover:underline font-medium"
              >
                {customCategory ? 'Pilih dari daftar' : '+ Buat kategori baru'}
              </button>
            </div>

            {customCategory ? (
              <input
                type="text"
                disabled={saving}
                value={customCatName}
                onChange={(e) => setCustomCatName(e.target.value)}
                placeholder="Tulis nama kategori baru..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            ) : (
              <select
                disabled={saving}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Location & Camera Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Tempat / Lokasi</span>
              </label>
              <input
                type="text"
                disabled={saving}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Bandung, Jawa Barat"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                <span>Kamera / HP</span>
              </label>
              <input
                type="text"
                disabled={saving}
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                placeholder="Contoh: iPhone 13 • 26mm"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>
          </div>

          {/* Caption / Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>Caption / Cerita Momen</span>
            </label>
            <textarea
              rows={3}
              disabled={saving}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan momen di balik foto ini..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
