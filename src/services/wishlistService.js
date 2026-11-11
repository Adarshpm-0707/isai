import { supabase } from '../lib/supabaseClient';

const WISHLIST_STORAGE_KEY = 'isai_local_wishlist';

const withTimeout = (promise, ms = 800) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const getLocalWishlist = (userId) => {
  try {
    const raw = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalWishlist = (userId, items) => {
  try {
    localStorage.setItem(`${WISHLIST_STORAGE_KEY}_${userId}`, JSON.stringify(items));
  } catch {}
};

export const wishlistService = {
  async getWishlist(userId) {
    if (!userId) return [];

    let dbItems = [];
    try {
      const res = await withTimeout(
        supabase
          .from('wishlist')
          .select('*, product:products(*)')
          .eq('user_id', userId),
        800
      );
      if (res?.data) dbItems = res.data;
    } catch (e) {}

    const local = getLocalWishlist(userId);
    if (dbItems.length > 0) {
      saveLocalWishlist(userId, dbItems);
      return dbItems;
    }
    return local;
  },

  async toggleWishlist(userId, productId) {
    if (!userId) throw new Error('Authentication required for wishlist');

    const current = getLocalWishlist(userId);
    const existingIdx = current.findIndex(item => item.product_id === productId || item.id === productId);

    let isAdded = false;
    let itemResult = null;

    if (existingIdx >= 0) {
      current.splice(existingIdx, 1);
      isAdded = false;
    } else {
      itemResult = {
        id: `wish_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        user_id: userId,
        product_id: productId,
        created_at: new Date().toISOString(),
      };
      current.push(itemResult);
      isAdded = true;
    }

    saveLocalWishlist(userId, current);

    // Sync cloud asynchronously
    try {
      if (isAdded) {
        withTimeout(
          supabase.from('wishlist').insert({
            user_id: userId,
            product_id: productId,
          }),
          800
        ).catch(() => {});
      } else {
        withTimeout(
          supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId),
          800
        ).catch(() => {});
      }
    } catch {}

    return { added: isAdded, productId, item: itemResult };
  },
};
