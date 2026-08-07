const PLACEHOLDER =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700';

/**
 * Returns the primary image URL for a product.
 * Handles multiple possible data shapes from Supabase / Firebase.
 *
 * @param {object} product
 * @returns {string} image URL
 */
export function getProductImage(product) {
  if (!product) return PLACEHOLDER;

  // Array of image URLs (most common shape)
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0] || PLACEHOLDER;
  }

  // Single image_url string
  if (product.image_url && typeof product.image_url === 'string') {
    return product.image_url;
  }

  // Single image string
  if (product.image && typeof product.image === 'string') {
    return product.image;
  }

  // Nested object: { image: { url: '...' } }
  if (product.image && typeof product.image === 'object' && product.image.url) {
    return product.image.url;
  }

  return PLACEHOLDER;
}

/**
 * Returns an array of all image URLs for a product.
 * Used by image galleries / carousels on the product details page.
 *
 * @param {object} product
 * @returns {string[]} array of image URLs
 */
export function getProductImageList(product) {
  if (!product) return [PLACEHOLDER];

  // Already an array
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.filter(Boolean);
  }

  // Single image — wrap in array
  const single = getProductImage(product);
  return [single];
}
