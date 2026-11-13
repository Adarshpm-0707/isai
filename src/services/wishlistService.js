import { supabase } from '../lib/supabaseClient';
import { productService } from './productService';

const WISHLIST_STORAGE_KEY = 'isai_wishlist';

const withTimeout = (promise, ms = 2500) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

export const getLocalWishlist = () => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(WISHLIST_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalWishlist = (items) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  } catch (err) {
    console.warn('saveLocalWishlist notice:', err);
  }
};

export const wishlistService = {
  /**
   * Retrieves wishlist items. Works for guests and logged-in users.
   */
  async getWishlist(userId = null) {
    const localItems = getLocalWishlist();

    if (!userId) {
      return localItems;
    }

    // Attempt cloud sync if user is logged in
    try {
      const res = await withTimeout(
        supabase
          .from('wishlist')
          .select('*, product:products(*)')
          .eq('user_id', userId),
        1500
      );

      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        // Merge cloud items with local items
        const mergedMap = new Map();
        localItems.forEach((item) => {
          const pid = item.product_id || item.product?.id || item.id;
          if (pid) mergedMap.set(String(pid), item);
        });

        res.data.forEach((row) => {
          const pid = row.product_id || row.product?.id;
          if (pid) {
            mergedMap.set(String(pid), {
              id: row.id || `wish_${pid}`,
              user_id: userId,
              product_id: pid,
              product: row.product || mergedMap.get(String(pid))?.product || null,
              created_at: row.created_at || new Date().toISOString(),
            });
          }
        });

        const mergedList = Array.from(mergedMap.values());
        saveLocalWishlist(mergedList);
        return mergedList;
      }
    } catch {
      // Offline or network error - gracefully use local items
    }

    return localItems;
  },

  /**
   * Toggles a product in the wishlist. Works for both guests and authenticated users.
   * Accepts full product object or product ID.
   */
  async toggleWishlist(productOrId, userId = null) {
    if (!productOrId) return { added: false };

    // Extract product and product ID
    let product = typeof productOrId === 'object' ? productOrId : null;
    const productId = product?.id || product?.product_id || productOrId;

    if (!productId) return { added: false };

    // If we only have an ID, try finding product in local catalog
    if (!product) {
      try {
        product = await productService.getProductById(productId);
      } catch {
        product = null;
      }
    }

    const currentList = getLocalWishlist();
    const existingIndex = currentList.findIndex(
      (item) => String(item.product_id) === String(productId) || String(item.product?.id) === String(productId) || String(item.id) === String(productId)
    );

    let isAdded = false;
    let savedItem = null;

    if (existingIndex >= 0) {
      // Remove from wishlist
      currentList.splice(existingIndex, 1);
      isAdded = false;
    } else {
      // Add to wishlist
      savedItem = {
        id: `wish_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        user_id: userId || 'guest',
        product_id: productId,
        product: product || { id: productId },
        created_at: new Date().toISOString(),
      };
      currentList.unshift(savedItem);
      isAdded = true;
    }

    saveLocalWishlist(currentList);

    // If authenticated, sync with Supabase in background
    if (userId) {
      try {
        if (isAdded) {
          withTimeout(
            supabase.from('wishlist').insert({
              user_id: userId,
              product_id: productId,
            }),
            1200
          ).catch(() => {});
        } else {
          withTimeout(
            supabase
              .from('wishlist')
              .delete()
              .eq('user_id', userId)
              .eq('product_id', productId),
            1200
          ).catch(() => {});
        }
      } catch {}
    }

    return { added: isAdded, productId, item: savedItem, items: currentList };
  },

  /**
   * Removes an item from the wishlist
   */
  async removeFromWishlist(productId, userId = null) {
    return this.toggleWishlist(productId, userId);
  },

  /**
   * Clears all items in the wishlist
   */
  clearWishlist() {
    saveLocalWishlist([]);
    return [];
  },
};
