// src/utils/imageCompressor.js
/**
 * Kompresi gambar super stabil dan hemat memori untuk HP.
 * Menggunakan URL.createObjectURL langsung ke elemen Canvas HTML5.
 * Tidak membebani RAM HP dan langsung menghasilkan data JPEG ringan (~150KB).
 */
export const compressImageToDataUrl = (file, maxDimension = 1200, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('File foto tidak ditemukan.'));
    }

    // 1. Coba menggunakan URL.createObjectURL (paling cepat dan hemat RAM di HP)
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl); // Bebaskan memori

          let width = img.width;
          let height = img.height;

          // Resize dimensi foto agar pas untuk layar HP & web
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Perangkat tidak mendukung pemrosesan gambar.'));
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Output JPEG terkompresi (~150KB - 250KB)
          const resultDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(resultDataUrl);
        } catch (canvasErr) {
          reject(new Error('Gagal meresize foto di canvas: ' + canvasErr.message));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        // 2. Fallback jika createObjectURL gagal (misal file sistem tertentu)
        fallbackFileReader(file, maxDimension, quality, resolve, reject);
      };

      img.src = objectUrl;
    } catch (err) {
      // 3. Fallback jika createObjectURL tidak didukung
      fallbackFileReader(file, maxDimension, quality, resolve, reject);
    }
  });
};

function fallbackFileReader(file, maxDimension, quality, resolve, reject) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Format foto tidak dapat diproses oleh browser HP.'));
    img.src = e.target.result;
  };
  reader.onerror = () => reject(new Error('Memori HP tidak dapat membaca file ini. Silakan coba foto lain.'));
  reader.readAsDataURL(file);
}
