// Reliably gets the primary image from a product object.
// Handles: product.image, real image arrays, JSON-stringified arrays from Supabase, and category-based fallbacks.
export function getProductImage(product) {
  if (!product) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700';

  if (typeof product.image === 'string' && product.image.trim().startsWith('http')) {
    return product.image.trim();
  }

  let images = product?.images;

  // Handle Supabase returning images as a JSON string
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch {
      if (images.startsWith('http')) return images;
      images = null;
    }
  }

  // If it's a valid non-empty array, return the first real URL
  if (Array.isArray(images) && images.length > 0 && images[0]) {
    return images[0];
  }

  // Category-based fallbacks with varied, high-quality saree images
  const category = String(product?.category || '').toLowerCase().trim();

  const FALLBACKS = {
    banarasi:
      'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=700',
    kanchipuram:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=700',
    organza:
      'https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=700',
    chanderi:
      'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=700',
    tussar:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=700',
    patola:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700',
  };

  return (
    FALLBACKS[category] ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700'
  );
}

// Reliably gets an array of images for galleries
export function getProductImageList(product) {
  if (!product) {
    return ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700'];
  }

  let images = product.images;

  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch {
      if (images.startsWith('http')) return [images];
      images = null;
    }
  }

  if (Array.isArray(images) && images.length > 0) {
    const valid = images.filter(img => typeof img === 'string' && img.trim().startsWith('http'));
    if (valid.length > 0) return valid;
  }

  const primary = getProductImage(product);
  return [
    primary,
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=700'
  ];
}
