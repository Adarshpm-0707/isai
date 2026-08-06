import { supabase } from '../lib/supabaseClient';

export const couponService = {
  async getAllCoupons() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('expires_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createCoupon(couponData) {
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        ...couponData,
        code: couponData.code.toUpperCase().trim(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async validateCoupon(code, cartTotal, userId) {
    if (!code || !code.trim()) {
      throw new Error('Please enter a coupon code');
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (error || !coupon) {
      throw new Error('Invalid coupon code');
    }

    if (!coupon.is_active) {
      throw new Error('This coupon is currently inactive');
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      throw new Error('This coupon has expired');
    }

    if (coupon.min_order_amount && cartTotal < Number(coupon.min_order_amount)) {
      throw new Error(`Minimum order amount for this coupon is ₹${coupon.min_order_amount}`);
    }

    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
      throw new Error('This coupon usage limit has been reached');
    }

    if (userId) {
      const { data: usage } = await supabase
        .from('coupon_usage')
        .select('*')
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (usage) {
        throw new Error('You have already used this coupon once');
      }
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * Number(coupon.value)) / 100;
    } else {
      discount = Number(coupon.value);
    }

    discount = Math.min(discount, cartTotal);

    return {
      coupon,
      discount,
      message: `Coupon '${coupon.code}' applied successfully!`,
    };
  },
};
