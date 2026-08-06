import { supabase } from '../lib/supabaseClient';

export const cartService = {
  async getCart(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async addToCart({ userId, productId, quantity = 1, size = null }) {
    if (!userId) return null;

    // Check existing item
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      const newQty = existing.quantity + quantity;
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty, size: size || existing.size })
        .eq('id', existing.id)
        .select('*, product:products(*)')
        .single();
      if (error) throw error;
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

    if (error) throw error;
    return data;
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, product:products(*)')
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
    return true;
  },

  async clearCart(userId) {
    if (!userId) return true;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },
};
