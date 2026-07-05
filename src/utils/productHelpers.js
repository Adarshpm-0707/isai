// Reliably gets the primary image from a product object.
// Handles: real image arrays, JSON-stringified arrays from Supabase, and category-based fallbacks.
export function getProductImage(product) {
  let images = product?.images;

  // Handle Supabase returning images as a JSON string
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch {
      // If it's a plain URL string, use it directly
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
