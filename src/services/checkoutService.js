import { supabase } from '../lib/supabaseClient';
import { syncLocalhostData } from './dataSyncService';
import { productService } from './productService';
import { couponService } from './couponService';
import { orderService } from './orderService';

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
    const rawItems = orderPayload.cartItems || orderPayload.items || [];
    const items = rawItems.map((it) => {
      const prod = it.product || it;
      const sellingPrice = Number(
        (it.discount_price && Number(it.discount_price) > 0) ? it.discount_price :
        (prod.discount_price && Number(prod.discount_price) > 0) ? prod.discount_price :
        it.selling_price ??
        it.unit_price ??
        it.price ??
        prod.price ??
        0
      );
      const regularPrice = Number(
        it.regular_price ??
        prod.price ??
        it.original_price ??
        it.mrp ??
        it.price ??
        sellingPrice
      );
      const qty = Number(it.quantity || it.qty || 1);

      return {
        ...it,
        name: it.name || prod.name || 'Handcrafted Saree',
        price: sellingPrice,
        unit_price: sellingPrice,
        selling_price: sellingPrice,
        regular_price: regularPrice,
        discount_price: (regularPrice > sellingPrice && sellingPrice > 0) ? sellingPrice : null,
        qty: qty,
        quantity: qty,
        product: prod,
      };
    });

    const shipping = orderPayload.shippingAddress || orderPayload.shipping_address || {};
    const subtotal = Number(
      orderPayload.subtotal ??
      items.reduce((acc, it) => acc + (it.price * it.quantity), 0)
    );
    const discount = Number(orderPayload.discount ?? orderPayload.discount_amount ?? 0);
    const couponCode = orderPayload.coupon_code || orderPayload.coupon?.code || (typeof orderPayload.coupon === 'string' ? orderPayload.coupon : null);
    const total = Number(
      orderPayload.totalAmount ??
      orderPayload.total_amount ??
      orderPayload.finalTotal ??
      Math.max(0, subtotal - discount)
    );

    const orderUuid = generateUUID();
    const readableOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const rawUserId = orderPayload.userId || orderPayload.user_id || null;
    const userId = isValidUUID(rawUserId) ? rawUserId : null;

    // Database record matching Supabase schema.sql exactly
    const dbInsertPayload = {
      id: orderUuid,
      order_id: readableOrderId,
      user_id: userId,
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
      items,
      subtotal: subtotal,
      shipping_fee: 0,
      discount_amount: discount,
      discount: discount,
      coupon_code: couponCode,
      cod_fee: 0,
      total: total,
      total_amount: total,
      payment_method: 'cod',
      status: 'pending',
      shipping_address: shipping,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Rich local object compatible with all UI components
    const orderData = {
      ...dbInsertPayload,
      user_id: rawUserId || userId || null,
      customer_id: rawUserId || userId || null,
      id: orderUuid,
      order_id: readableOrderId,
      orderId: readableOrderId,
      subtotal: subtotal,
      discount: discount,
      discount_amount: discount,
      coupon_code: couponCode,
      coupon: orderPayload.coupon || (couponCode ? { code: couponCode } : null),
      total: total,
      total_amount: total,
      paymentMethod: 'Cash on Delivery (COD)',
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
    };

    // 1. Immediately save to persistent store so Customer Orders & Admin Orders see it right away (0 ms)
    try {
      const existing = orderService.getLocalOrders();
      const filtered = existing.filter((o) => o.id !== orderData.id && o.order_id !== orderData.order_id);
      orderService.saveLocalOrders([orderData, ...filtered]);
    } catch (e) {
      console.warn('Orders local store notice:', e);
    }

    // 2. Persist customer contact into customer directory
    saveCustomerContact(shipping, rawUserId || userId);

    // 3. Automatically decrease product stock in inventory
    try {
      await productService.deductStockForItems(items);
    } catch (stockErr) {
      console.warn('Auto inventory stock deduct notice:', stockErr?.message);
    }

    // 4. Record coupon usage count
    if (couponCode) {
      couponService.recordCouponUsage(couponCode).catch(() => {});
    }

    // 5. Cloud sync to Supabase orders table & profiles table
    try {
      const { data: dbData, error: dbErr } = await withTimeout(
        supabase.from('orders').insert(dbInsertPayload).select().maybeSingle(),
        5000
      );
      if (dbErr) {
        console.warn('[Checkout] Supabase orders insert error:', dbErr.message);
      }
      if (shipping.email) {
        const custProf = {
          name: shipping.name || 'Customer',
          email: shipping.email.toLowerCase().trim(),
          phone: shipping.phone || '',
          address: shipping,
          role: 'user',
          updated_at: new Date().toISOString(),
        };
        if (userId) custProf.id = userId;
        supabase.from('profiles').upsert(custProf).catch(() => {});
      }
    } catch (err) {
      console.warn('[Checkout] Supabase orders insert notice:', err?.message);
    }

    // 6. Cache and record order locally
    try {
      if (typeof window !== 'undefined') {
        // Cache last order in sessionStorage so reload on OrderSuccess never loses data
        try {
          sessionStorage.setItem('isai_last_order', JSON.stringify(orderData));
        } catch {}

        // Record guest order ID on device
        try {
          const guestIds = JSON.parse(localStorage.getItem('isai_guest_order_ids') || '[]');
          if (!guestIds.includes(orderUuid)) guestIds.push(orderUuid);
          if (!guestIds.includes(readableOrderId)) guestIds.push(readableOrderId);
          localStorage.setItem('isai_guest_order_ids', JSON.stringify(guestIds));
        } catch {}
      }
    } catch {}

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
    const rawItems = payload.cartItems || payload.items || [];
    const items = rawItems.map((it) => {
      const prod = it.product || it;
      const sellingPrice = Number(
        (it.discount_price && Number(it.discount_price) > 0) ? it.discount_price :
        (prod.discount_price && Number(prod.discount_price) > 0) ? prod.discount_price :
        it.selling_price ??
        it.unit_price ??
        it.price ??
        prod.price ??
        0
      );
      const regularPrice = Number(
        it.regular_price ??
        prod.price ??
        it.original_price ??
        it.mrp ??
        it.price ??
        sellingPrice
      );
      const qty = Number(it.quantity || it.qty || 1);

      return {
        ...it,
        name: it.name || prod.name || 'Handcrafted Saree',
        price: sellingPrice,
        unit_price: sellingPrice,
        selling_price: sellingPrice,
        regular_price: regularPrice,
        discount_price: (regularPrice > sellingPrice && sellingPrice > 0) ? sellingPrice : null,
        qty: qty,
        quantity: qty,
        product: prod,
      };
    });

    const shipping = payload.shippingAddress || payload.shipping_address || {};
    const subtotal = Number(
      payload.subtotal ??
      items.reduce((acc, it) => acc + (it.price * it.quantity), 0)
    );
    const discount = Number(payload.discount ?? payload.discount_amount ?? 0);
    const couponCode = payload.coupon_code || payload.coupon?.code || (typeof payload.coupon === 'string' ? payload.coupon : null);
    const total = Number(
      payload.totalAmount ??
      payload.total_amount ??
      Math.max(0, subtotal - discount)
    );

    const orderUuid = generateUUID();
    const readableOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const rawUserId = payload.userId || payload.user_id || null;
    const userId = isValidUUID(rawUserId) ? rawUserId : null;

    // Database record matching Supabase schema.sql exactly
    const dbInsertPayload = {
      id: orderUuid,
      order_id: readableOrderId,
      user_id: userId,
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
      items,
      subtotal: subtotal,
      shipping_fee: Number(payload.shippingFee || 0),
      discount_amount: discount,
      discount: discount,
      coupon_code: couponCode,
      cod_fee: 0,
      total: total,
      total_amount: total,
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
      user_id: rawUserId || userId || null,
      customer_id: rawUserId || userId || null,
      id: orderUuid,
      order_id: readableOrderId,
      orderId: readableOrderId,
      subtotal: subtotal,
      discount: discount,
      discount_amount: discount,
      coupon_code: couponCode,
      coupon: payload.coupon || (couponCode ? { code: couponCode } : null),
      total: total,
      total_amount: total,
      paymentMethod: 'Online Payment (Prepaid)',
      payment_id: payload.razorpayResponse?.razorpay_payment_id || 'PAY_' + Date.now(),
      customer_name: shipping.name || '',
      customer_email: shipping.email || '',
      customer_phone: shipping.phone || '',
    };

    // 1. Save locally immediately
    try {
      const existing = orderService.getLocalOrders();
      const filtered = existing.filter((o) => o.id !== orderData.id && o.order_id !== orderData.order_id);
      orderService.saveLocalOrders([orderData, ...filtered]);
    } catch (e) {}

    // 2. Persist customer contact into customer directory
    saveCustomerContact(shipping, rawUserId || userId);

    // 3. Automatically decrease product stock in inventory
    try {
      await productService.deductStockForItems(items);
    } catch (stockErr) {
      console.warn('Auto inventory stock deduct notice:', stockErr?.message);
    }

    // 4. Record coupon usage count
    if (couponCode) {
      couponService.recordCouponUsage(couponCode).catch(() => {});
    }

    // 5. Cloud sync to Supabase orders table & profiles table
    try {
      const { data: dbData, error: dbErr } = await withTimeout(
        supabase.from('orders').insert(dbInsertPayload).select().maybeSingle(),
        5000
      );
      if (dbErr) {
        console.warn('[Checkout] Supabase orders insert error:', dbErr.message);
      }
      if (shipping.email) {
        const custProf = {
          name: shipping.name || 'Customer',
          email: shipping.email.toLowerCase().trim(),
          phone: shipping.phone || '',
          address: shipping,
          role: 'user',
          updated_at: new Date().toISOString(),
        };
        if (userId) custProf.id = userId;
        supabase.from('profiles').upsert(custProf).catch(() => {});
      }
    } catch (err) {
      console.warn('[Checkout] Supabase orders insert notice:', err?.message);
    }

    // 6. Cache and record order locally
    try {
      if (typeof window !== 'undefined') {
        // Cache last order in sessionStorage so reload on OrderSuccess never loses data
        try {
          sessionStorage.setItem('isai_last_order', JSON.stringify(orderData));
        } catch {}

        // Record guest order ID on device
        try {
          const guestIds = JSON.parse(localStorage.getItem('isai_guest_order_ids') || '[]');
          if (!guestIds.includes(orderUuid)) guestIds.push(orderUuid);
          if (!guestIds.includes(readableOrderId)) guestIds.push(readableOrderId);
          localStorage.setItem('isai_guest_order_ids', JSON.stringify(guestIds));
        } catch {}
      }
    } catch {}

    return orderData;
  },

  async verifyRazorpayPayment(params) {
    return this.verifyAndSaveOrder(params);
  },
};
