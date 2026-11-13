import { supabase } from '../lib/supabaseClient';

const COUPONS_STORAGE_KEY = 'isai_store_coupons';

const withTimeout = (promise, ms = 5000) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const getLocalCoupons = () => {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
};

const saveLocalCoupons = (coupons) => {
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons || []));
  } catch {}
};

export const couponService = {
  async getAllCoupons() {
    try {
      const res = await withTimeout(
        supabase
          .from('coupons')
          .select('*')
          .order('expires_at', { ascending: true }),
        1200
      );
      if (res?.data && Array.isArray(res.data)) {
        saveLocalCoupons(res.data);
        return res.data;
      }
    } catch (e) {}

    return getLocalCoupons();
  },

  async createCoupon(couponData) {
    const cleanCode = couponData.code.toUpperCase().trim();
    const newCoupon = {
      id: `coup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...couponData,
      code: cleanCode,
      used_count: 0,
      created_at: new Date().toISOString(),
    };

    // Save locally
    const current = getLocalCoupons();
    const existingIdx = current.findIndex(c => c.code === cleanCode);
    if (existingIdx >= 0) {
      current[existingIdx] = { ...current[existingIdx], ...newCoupon };
    } else {
      current.unshift(newCoupon);
    }
    saveLocalCoupons(current);

    // Save to cloud asynchronously
    try {
      withTimeout(
        supabase.from('coupons').upsert(newCoupon),
        800
      ).catch(() => {});
    } catch {}

    return newCoupon;
  },

  async deleteCoupon(id) {
    const current = getLocalCoupons();
    const updated = current.filter(c => c.id !== id);
    saveLocalCoupons(updated);

    try {
      withTimeout(
        supabase.from('coupons').delete().eq('id', id),
        800
      ).catch(() => {});
    } catch {}

    return true;
  },

  async validateCoupon(code, cartTotal, userId) {
    if (!code || !code.trim()) {
      throw new Error('Please enter a coupon code');
    }

    const cleanCode = code.toUpperCase().trim();
    const coupons = await this.getAllCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
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

    if (coupon.max_uses > 0 && (coupon.used_count || 0) >= coupon.max_uses) {
      throw new Error('This coupon usage limit has been reached');
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

  async recordCouponUsage(code) {
    if (!code) return;
    try {
      const cleanCode = String(code).toUpperCase().trim();
      const current = getLocalCoupons();
      const idx = current.findIndex(c => c.code.toUpperCase() === cleanCode);
      if (idx >= 0) {
        current[idx].used_count = (current[idx].used_count || 0) + 1;
        saveLocalCoupons(current);

        withTimeout(
          supabase.from('coupons').update({ used_count: current[idx].used_count }).eq('id', current[idx].id),
          1000
        ).catch(() => {});
      }
    } catch {}
  },
};
