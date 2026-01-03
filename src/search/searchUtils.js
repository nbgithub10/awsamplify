// Helper utilities for PetSearch filtering and validation

export function filterReports(reports, { country, state, postcode, includeLost, includeFound }) {
  const c = (country || '').toLowerCase();
  const s = (state || '').toLowerCase();
  const pc = (postcode || '').toLowerCase();

  return reports.filter(p => {
    const matchesStatus = (includeLost && p.status === 'lost') || (includeFound && p.status === 'found');
    if (!matchesStatus) return false;

    const matchesCountry = !c || (p.country && p.country.toLowerCase().includes(c));
    const matchesState = !s || (p.state && p.state.toLowerCase().includes(s));
    const matchesPostcode = !pc || (p.postcode && p.postcode.toLowerCase().includes(pc));

    return matchesCountry && matchesState && matchesPostcode;
  });
}

export function validatePostcode(postcode, country) {
  if (!postcode) return true; // optional field
  const p = postcode.trim();
  if (!country) return p.length > 0; // basic presence check

  const c = country.toLowerCase();
  // basic patterns for a few countries
  if (c === 'india') return /^\d{6}$/.test(p);
  if (c === 'australia') return /^\d{4}$/.test(p);
  if (c === 'usa' || c === 'united states' || c === 'united states of america') return /^\d{5}(-\d{4})?$/.test(p);

  // fallback: accept alphanumeric 3-10 chars
  return /^[A-Za-z0-9 -]{3,10}$/.test(p);
}

// Image helpers
// validateImageFile(file, maxSizeBytes) => { ok: boolean, reason?: string }
export function validateImageFile(file, maxSizeBytes = 2 * 1024 * 1024) {
  if (!file) return { ok: false, reason: 'No file' };
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowed.includes(file.type)) return { ok: false, reason: 'Unsupported file type' };
  if (file.size > maxSizeBytes) return { ok: false, reason: 'File too large' };
  return { ok: true };
}

// compressImage(file, maxDim = 1200, quality = 0.8) => Promise<string (dataURL)>
export function compressImage(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        let targetWidth = width;
        let targetHeight = height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            targetWidth = maxDim;
            targetHeight = Math.round((height / width) * maxDim);
          } else {
            targetHeight = maxDim;
            targetWidth = Math.round((width / height) * maxDim);
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        // determine output type
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
