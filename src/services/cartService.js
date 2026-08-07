import { supabase } from '../lib/supabaseClient';

export const cartService = {
  async getCart(userId) {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase cart_items fetch warning:', error.message);
        return null;
      }
      return data || [];
    } catch (err) {
      console.warn('Supabase cart_items notice:', err);
      return null;
    }
  },

  async addToCart({ userId, productId, quantity = 1, size = null }) {
    if (!userId) return null;

    try {
      // Check existing item
      const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (checkError) {
        console.warn('Supabase cart_items check notice:', checkError.message);
        return null;
      }

      if (existing) {
        const newQty = existing.quantity + quantity;
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: newQty, size: size || existing.size })
          .eq('id', existing.id)
          .select('*, product:products(*)')
          .single();

        if (error) {
          console.warn('Supabase cart_items update notice:', error.message);
          return null;
        }
        return data;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          size,
        })
        .select('*, product:products(*)')
        .single();

      if (error) {
        console.warn('Supabase cart_items insert notice:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase cart_items addToCart notice:', err);
      return null;
    }
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select('*, product:products(*)')
        .single();

      if (error) {
        console.warn('Supabase cart_items updateQuantity notice:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Supabase cart_items updateQuantity notice:', err);
      return null;
    }
  },

  async removeFromCart(cartItemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.warn('Supabase cart_items removeFromCart notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase cart_items removeFromCart notice:', err);
      return false;
    }
  },

  async clearCart(userId) {
    if (!userId) return true;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.warn('Supabase cart_items clearCart notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase cart_items clearCart notice:', err);
      return false;
    }
  },
};
