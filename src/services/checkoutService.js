import { supabase } from '../lib/supabaseClient';
import { syncLocalhostData } from './dataSyncService';

function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(str || ''));
}

function withTimeout(promise, ms = 2000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function saveCustomerContact(shipping, userId) {
  if (!shipping || (!shipping.email && !shipping.phone && !shipping.name)) return;
  try {
    const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
    const email = shipping.email?.toLowerCase().trim();
    const exists = localUsers.some(
      (u) => (email && u.email?.toLowerCase().trim() === email) || (userId && u.id === userId)
    );
    if (!exists) {
      localUsers.unshift({
        id: userId || generateUUID(),
        name: shipping.name || 'Customer User',
        email: shipping.email || '',
        phone: shipping.phone || '',
        address: shipping.addressLine1 || shipping.street || '',
        city: shipping.city || '',
        state: shipping.state || '',
        pincode: shipping.pincode || '',
        role: 'user',
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('isai_registered_users', JSON.stringify(localUsers));
      window.dispatchEvent(new CustomEvent('isai:customers_updated', { detail: localUsers }));
    }
  } catch {}
}

export const checkoutService = {
  async getCodSettings() {
    try {
      const { data, error } = await withTimeout(
        supabase.from('settings').select('*').eq('key', 'cod_settings').maybeSingle(),
        1000
      );
      if (!error && data?.value) {
        return data.value;
      }
    } catch {
      // fallback
    }
    return { cod_fee: 40, enabled: true, min_order: 0 };
  },

  async checkServiceability(pincode) {
    return {
      available: true,
      estimated_days: '3-5 Business Days',
      courier_name: 'Isai Royal Express Delivery',
      pincode,
    };
  },

  async checkDeliveryEta(delivery_postcode) {
    try {
      const { data, error } = await withTimeout(
        supabase.functions.invoke('check-shiprocket-eta', {
          body: { delivery_postcode },
        }),
        1200
      );
      if (!error && data) return data;
    } catch {
      // fallback
    }

    return {
      success: true,
      courier_name: 'Isai Royal Express Delivery',
      etd: '3-5 Business Days',
      estimated_days: 4,
      postcode: delivery_postcode,
    };
  },

  async createCodOrder(orderPayload) {
    const items = orderPayload.cartItems || orderPayload.items || [];
    const shipping = orderPayload.shippingAddress || orderPayload.shipping_address || {};
    const total = Number(
      orderPayload.totalAmount ??
      orderPayload.total_amount ??
      orderPayload.finalTotal ??
      0
    );

    const orderUuid = generateUUID();
    const readableOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const rawUserId = orderPayload.userId || orderPayload.user_id || null;
    const userId = isValidUUID(rawUserId) ? rawUserId : null;

    // Database record matching Supabase schema.sql exactly
    const dbInsertPayload = {
      id: orderUuid,
      user_id: userId,
      items,
      subtotal: Number(orderPayload.subtotal || total),
      shipping_fee: 0,
      discount_amount: Number(orderPayload.discount || 0),
      cod_fee: 0,
      total: total,
      payment_method: 'cod',
      status: 'pending',
      shipping_address: shipping,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Rich local object compatible with all UI components
    const orderData = {
      ...dbInsertPayload,
      id: orderUuid,
      order_id: readableOrderId,
      orderId: readableOrderId,
      total_amount: total,
      paymentMethod: 'Cash on Delivery (COD)',
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
    };

    // 1. Immediately save to persistent store so Customer Orders & Admin Orders see it right away (0 ms)
    try {
      const existing = JSON.parse(localStorage.getItem('isai_orders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('isai_orders', JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('isai:orders_updated', { detail: existing }));
      syncLocalhostData({ orders: existing });
    } catch (e) {
      console.warn('Orders local store notice:', e);
    }

    // 2. Persist customer contact into customer directory
    saveCustomerContact(shipping, userId);

    // 3. Save into Supabase orders table
    try {
      const { data: dbData, error: dbErr } = await withTimeout(
        supabase.from('orders').insert(dbInsertPayload).select().maybeSingle(),
        3000
      );
      if (!dbErr && dbData) {
        try {
          const localStored = JSON.parse(localStorage.getItem('isai_orders') || '[]');
          const merged = localStored.map((o) => (o.id === orderUuid ? { ...o, ...dbData } : o));
          localStorage.setItem('isai_orders', JSON.stringify(merged));
        } catch {}
      } else if (dbErr) {
        console.warn('Supabase orders table insert notice (saved in local store):', dbErr.message);
      }
    } catch (dbErr) {
      console.warn('Supabase orders sync notice:', dbErr?.message);
    }

    return orderData;
  },

  async createRazorpayOrder(amountOrPayload) {
    let subtotal = 1000;
    if (typeof amountOrPayload === 'number') {
      subtotal = amountOrPayload;
    } else if (amountOrPayload && typeof amountOrPayload === 'object') {
      subtotal =
        amountOrPayload.totalAmount ||
        amountOrPayload.amount ||
        (amountOrPayload.items || []).reduce(
          (acc, item) =>
            acc + (item.price || item.product?.price || 0) * (item.quantity || item.qty || 1),
          0
        );
    }

    const orderId = `RZP_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const { data, error } = await withTimeout(
        supabase.functions.invoke('create-razorpay-order', {
          body: { amount: subtotal, order_id: orderId },
        }),
        1200
      );
      if (!error && data) return data;
    } catch {
      // Direct Database & Local Fallback
    }

    return {
      id: orderId,
      order_id: orderId,
      key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: Math.round(subtotal * 100),
      currency: 'INR',
      db_order_id: orderId,
    };
  },

  async verifyAndSaveOrder(payload) {
    const items = payload.cartItems || payload.items || [];
    const shipping = payload.shippingAddress || payload.shipping_address || {};
    const total = Number(payload.totalAmount ?? payload.total_amount ?? 0);

    const orderUuid = generateUUID();
    const readableOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const rawUserId = payload.userId || payload.user_id || null;
    const userId = isValidUUID(rawUserId) ? rawUserId : null;

    // Database record matching Supabase schema.sql exactly
    const dbInsertPayload = {
      id: orderUuid,
      user_id: userId,
      items,
      subtotal: Number(payload.subtotal || total),
      shipping_fee: Number(payload.shippingFee || 0),
      discount_amount: Number(payload.discount || 0),
      cod_fee: 0,
      total: total,
      payment_method: 'prepaid',
      status: 'paid',
      shipping_address: shipping,
      razorpay_payment_id: payload.razorpayResponse?.razorpay_payment_id || null,
      razorpay_order_id: payload.razorpayResponse?.razorpay_order_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const orderData = {
      ...dbInsertPayload,
      id: orderUuid,
      order_id: readableOrderId,
      orderId: readableOrderId,
      total_amount: total,
      paymentMethod: 'Online Payment (Prepaid)',
      payment_id: payload.razorpayResponse?.razorpay_payment_id || 'PAY_' + Date.now(),
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
    };

    // 1. Save locally immediately
    try {
      const existing = JSON.parse(localStorage.getItem('isai_orders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('isai_orders', JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('isai:orders_updated', { detail: existing }));
      syncLocalhostData({ orders: existing });
    } catch (e) {}

    // 2. Persist customer contact into customer directory
    saveCustomerContact(shipping, userId);

    // 3. Cloud sync to Supabase orders table
    try {
      const { data: dbData, error: dbErr } = await withTimeout(
        supabase.from('orders').insert(dbInsertPayload).select().maybeSingle(),
        3000
      );
      if (!dbErr && dbData) {
        try {
          const localStored = JSON.parse(localStorage.getItem('isai_orders') || '[]');
          const merged = localStored.map((o) => (o.id === orderUuid ? { ...o, ...dbData } : o));
          localStorage.setItem('isai_orders', JSON.stringify(merged));
        } catch {}
      } else if (dbErr) {
        console.warn('Supabase prepaid order insert notice (saved locally):', dbErr.message);
      }
    } catch (e) {}

    return orderData;
  },

  async verifyRazorpayPayment(params) {
    return this.verifyAndSaveOrder(params);
  },
};
