import { supabase } from '../lib/supabaseClient';

export const wishlistService = {
  async getWishlist(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('wishlist')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async toggleWishlist(userId, productId) {
    if (!userId) throw new Error('Authentication required for wishlist');

    const { data: existing } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return { added: false, productId };
    } else {
      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: userId,
          product_id: productId,
        })
        .select('*, product:products(*)')
        .single();
      if (error) throw error;
      return { added: true, item: data };
    }
  },
};
