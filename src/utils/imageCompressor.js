/**
 * Utility to compress and resize images client-side before saving to localStorage or uploading to Supabase.
 * Shrinks multi-megabyte phone/camera photos down to ~35-65 KB web JPEG data URLs.
 * This prevents localStorage quota overflow and guarantees instant saves.
 */
export async function compressImage(file, { maxWidth = 1000, maxHeight = 1000, quality = 0.75 } = {}) {
  if (!file) return '';
  if (!file.type || !file.type.startsWith('image/')) {
    // If not an image file (e.g. url string), return as is
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target.result);
          return;
        }

        // Fill background with subtle dark tone for transparent PNGs
        ctx.fillStyle = '#160E0B';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

