import React, { useState, useRef } from 'react';
import { X, Upload, Image, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { compressImageToDataUrl } from '../utils/imageCompressor';

export default function UploadModal({ onClose, onUpload, availableCategories = [] }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState('');
  const [processingFile, setProcessingFile] = useState(false);
  const [fileSizeInfo, setFileSizeInfo] = useState('');

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Gabungkan kategori yang ada (tanpa 'Semua' dan tanpa label lama)
  const legacyLabels = ['Semua', 'Teman SMP', 'Teman SMK', 'Keluarga', 'Teman Rumah', 'Momen Spesial'];
  const categoryOptions = Array.from(
    new Set([
      'SMP',
      'SMK',
      'Family',
      'Rumah',
      'Momen',
      'Kampus',
      ...availableCategories.filter((c) => !legacyLabels.includes(c)),
    ])
  );

  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0] || 'SMP');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const [meta, setMeta] = useState({
    title: '',
    description: '',
    location: '',
    camera: '',
    aspect: 'horizontal',
    likes: 0,
  });
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage('');
    setProcessingFile(true);
    setFileSizeInfo('Sedang mengompresi foto dari HP...');

    // Auto-fill title from filename
    if (!meta.title) {
      setMeta((prev) => ({
        ...prev,
        title: selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    }

    try {
      // Langsung kompresi foto menggunakan Canvas native saat foto dipilih
      const dataUrl = await compressImageToDataUrl(selected, 1200, 0.75);
      setCompressedDataUrl(dataUrl);
      setPreview(dataUrl);
      const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);
      setFileSizeInfo(`Foto siap! Dioptimalkan jadi ${approxKb} KB (Jernih & Hemat)`);
    } catch (err) {
      console.error('File processing error:', err);
      setErrorMessage(err.message || 'Gagal membaca foto dari galeri HP. Coba pilih foto lain.');
      setFileSizeInfo('');
    } finally {
      setProcessingFile(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) {
      handleFileChange({ target: { files: [dropped] } });
    }
  };

  const handleCategorySelect = (val) => {
    if (val === '__custom__') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setSelectedCategory(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!compressedDataUrl) {
      return alert('Harap pilih foto terlebih dahulu.');
    }
    if (!meta.title.trim()) {
      return alert('Judul foto tidak boleh kosong.');
    }

    let finalCategory = selectedCategory;
    if (isCustomCategory) {
      if (!customCategoryName.trim()) {
        return alert('Harap ketik nama kelompok baru Anda.');
      }
      finalCategory = customCategoryName.trim();
    }

    setUploading(true);
    setErrorMessage('');
    setProgress(50);
    setStatusText('Menyimpan ke database galeri...');

    try {
      await onUpload(
        compressedDataUrl,
        {
          ...meta,
          title: meta.title.trim(),
          category: finalCategory,
        },
        (prog) => {
          setProgress(prog);
        }
      );
    } catch (err) {
      console.error('Upload Error:', err);
      let msg = err.message || 'Gagal menyimpan foto.';
      if (err.code === 'permission-denied') {
        msg = 'Izin Firestore ditolak! Pastikan Rules di Cloud Firestore: allow read, write: if true;';
      }
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={!uploading && !processingFile ? onClose : undefined}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Upload Foto Baru</h2>
          </div>
          {!uploading && !processingFile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-500 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Pemberitahuan:</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Drag & Drop / File Picker */}
          <div
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors cursor-pointer overflow-hidden ${preview
              ? 'border-emerald-500 dark:border-emerald-500'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500'
              }`}
            style={{ minHeight: 150 }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !uploading && !processingFile && fileInputRef.current?.click()}
          >
            {processingFile ? (
              <div className="py-8 flex flex-col items-center gap-2 text-rose-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-semibold">Sedang mengompresi foto dari HP...</p>
              </div>
            ) : preview ? (
              <>
                <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
                {!uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Klik untuk ganti foto</span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-7 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <Image className="w-8 h-8" />
                <p className="text-xs font-medium">Pilih foto kenangan bersama teman / keluarga</p>
                <p className="text-[11px]">JPG, PNG, WebP (otomatis dioptimalkan)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading || processingFile}
              onChange={handleFileChange}
            />
          </div>

          {fileSizeInfo && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{fileSizeInfo}</span>
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Judul / Momen Foto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              disabled={uploading || processingFile}
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="Contoh: Bukber bareng anak SMK / Liburan keluarga"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all disabled:opacity-60"
            />
          </div>

          {/* Group / Category Selection */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Kelompok Foto
                </label>
                <select
                  disabled={uploading || processingFile}
                  value={isCustomCategory ? '__custom__' : selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-60"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Tambah Kelompok Baru...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Orientasi Tampilan
                </label>
                <select
                  disabled={uploading || processingFile}
                  value={meta.aspect}
                  onChange={(e) => setMeta({ ...meta, aspect: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-60"
                >
                  <option value="horizontal">Horizontal (Landscape)</option>
                  <option value="vertical">Vertikal (Portrait)</option>
                  <option value="square">Persegi (Square)</option>
                </select>
              </div>
            </div>

            {/* Input Tambah Kelompok Baru jika dipilih */}
            {isCustomCategory && (
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1 animate-fade-in">
                <label className="block text-[11px] font-semibold text-rose-500">
                  Ketik Nama Kelompok Baru:
                </label>
                <input
                  type="text"
                  autoFocus
                  disabled={uploading || processingFile}
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="Contoh: Teman Kuliah, Acara Sekolah, Liburan Bali..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-500/40 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Lokasi / Tempat (Opsional)
            </label>
            <input
              type="text"
              disabled={uploading || processingFile}
              value={meta.location}
              onChange={(e) => setMeta({ ...meta, location: e.target.value })}
              placeholder="Contoh: Puncak, Bogor / Sekolah / Rumah"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all disabled:opacity-60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Cerita / Kenangan (Opsional)
            </label>
            <textarea
              disabled={uploading || processingFile}
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              placeholder="Ceritakan momen seru di foto ini..."
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none transition-all disabled:opacity-60"
            />
          </div>

          {/* Progress Indicator */}
          {uploading && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <span>{statusText || 'Sedang memproses...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(progress, 20)}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || processingFile || !compressedDataUrl}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-rose-500/20 active:scale-[0.99]"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Foto...</span>
              </>
            ) : processingFile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Foto HP...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Simpan ke Galeri</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
