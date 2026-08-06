import { supabase } from '../lib/supabaseClient';

export const checkoutService = {
  async createRazorpayOrder({ items, shipping_address, coupon_id }) {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { items, shipping_address, coupon_id },
    });
    if (error) throw error;
    return data;
  },

  async verifyRazorpayPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    db_order_id,
    coupon_id,
    user_id,
  }) {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        db_order_id,
        coupon_id,
        user_id,
      },
    });
    if (error) throw error;
    return data;
  },

  async createCodOrder({ items, shipping_address, coupon_id, cod_fee = 40 }) {
    const { data, error } = await supabase.functions.invoke('create-cod-order', {
      body: { items, shipping_address, coupon_id, cod_fee },
    });
    if (error) throw error;
    return data;
  },

  async checkDeliveryEta(delivery_postcode) {
    const { data, error } = await supabase.functions.invoke('check-shiprocket-eta', {
      body: { delivery_postcode },
    });
    if (error) throw error;
    return data;
  },
};
