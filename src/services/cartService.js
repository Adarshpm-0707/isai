import { supabase } from '../lib/supabaseClient';

function withTimeout(promise, ms = 5000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export const cartService = {
  async getCart(userId) {
    if (!userId) return [];

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('cart_items')
          .select('*, product:products(*)')
          .eq('user_id', userId),
        1200
      );

      if (error) {
        console.warn('Supabase cart_items fetch warning:', error.message);
        return null;
      }
      return data || [];
    } catch (err) {
      console.warn('Supabase cart_items notice (using local cart):', err.message);
      return null;
    }
  },

  async addToCart({ userId, productId, quantity = 1, size = null }) {
    if (!userId) return null;

    try {
      // Check existing item
      const { data: existing, error: checkError } = await withTimeout(
        supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .maybeSingle(),
        1200
      );

      if (checkError) return null;

      if (existing) {
        const newQty = (existing.quantity || 1) + quantity;
        const { data } = await withTimeout(
          supabase
            .from('cart_items')
            .update({ quantity: newQty, size: size || existing.size })
            .eq('id', existing.id)
            .select('*, product:products(*)')
            .maybeSingle(),
          1200
        );
        return data;
      }

      const { data } = await withTimeout(
        supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity,
            size,
          })
          .select('*, product:products(*)')
          .maybeSingle(),
        1200
      );
      return data;
    } catch (err) {
      console.warn('cartService notice (persisted locally):', err.message);
      return null;
    }
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    try {
      const { data } = await withTimeout(
        supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId)
          .select('*, product:products(*)')
          .maybeSingle(),
        1200
      );
      return data;
    } catch (err) {
      console.warn('cartService updateQuantity notice:', err.message);
      return null;
    }
  },

  async removeFromCart(cartItemId) {
    try {
      await withTimeout(
        supabase.from('cart_items').delete().eq('id', cartItemId),
        1200
      );
      return true;
    } catch (err) {
      console.warn('cartService removeFromCart notice:', err.message);
      return true;
    }
  },

  async clearCart(userId) {
    if (!userId) return true;
    try {
      await withTimeout(
        supabase.from('cart_items').delete().eq('user_id', userId),
        1200
      );
      return true;
    } catch (err) {
      console.warn('cartService clearCart notice:', err.message);
      return true;
    }
  },
};
