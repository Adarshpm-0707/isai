import { supabase } from '../lib/supabaseClient';
import { syncLocalhostData } from './dataSyncService';
import { productService } from './productService';

const withTimeout = (promise, ms = 5000) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

function cleanOrders(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((o) => {
    if (!o) return false;
    const idKey = String(o.id || '').toLowerCase().trim();
    const orderIdKey = String(o.order_id || o.orderId || '').toLowerCase().trim();
    if (!idKey && !orderIdKey) return false;
    return true;
  });
}

export function getLocalOrders() {
  let list = [];
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('isai_orders') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }
  } catch {}

  const cleaned = cleanOrders(list);
  cleaned.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  return cleaned;
}

export function saveLocalOrders(orders, replaceAll = false) {
  const cleaned = cleanOrders(orders);
  cleaned.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  try {
    if (typeof localStorage !== 'undefined') {
      const prev = localStorage.getItem('isai_orders');
      const next = JSON.stringify(cleaned);
      if (prev === next) {
        return; // Data has not changed; prevent infinite dispatch and re-render loops
      }
      localStorage.setItem('isai_orders', next);
    }
  } catch (err) {
    console.warn('LocalStorage orders quota notice:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('isai:orders_updated', { detail: cleaned }));
  }
}

// Fetch orders from the unified backend server API
async function fetchServerOrders() {
  if (typeof window === 'undefined') return [];
  try {
    const res = await withTimeout(fetch('/api/orders'), 2500);
    if (res && res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.orders)) {
        return json.orders;
      }
    }
  } catch {}
  return [];
}

export const orderService = {
  getLocalOrders() {
    return getLocalOrders();
  },

  async getUserOrders(userId = null, userEmail = null, queryOrderId = null) {
    let allOrders = [];

    // 1. Fetch live orders from Supabase
    try {
      const res = await withTimeout(
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        5000
      );
      if (res?.data && Array.isArray(res.data)) {
        allOrders = cleanOrders(res.data);
        saveLocalOrders(allOrders);
      }
    } catch (e) {
      console.warn('Supabase user orders fetch notice:', e?.message);
    }

    if (allOrders.length === 0) {
      allOrders = getLocalOrders();
    }

    const uEmail = userEmail ? userEmail.toLowerCase().trim() : null;
    const uId = userId ? String(userId).toLowerCase().trim() : null;
    const targetQ = queryOrderId ? String(queryOrderId).toLowerCase().trim() : null;

    // Get guest order IDs saved on this browser device
    let guestIds = new Set();
    try {
      const stored = localStorage.getItem('isai_guest_order_ids');
      if (stored) {
        JSON.parse(stored).forEach((id) => guestIds.add(String(id).toLowerCase().trim()));
      }
    } catch {}

    const matched = allOrders.filter((lo) => {
      const loId = String(lo.id || '').toLowerCase().trim();
      const loOrderId = String(lo.order_id || lo.orderId || '').toLowerCase().trim();
      const loUserId = lo.user_id ? String(lo.user_id).toLowerCase().trim() : null;
      const loEmail = (lo.customer_email || lo.shipping_address?.email || lo.profiles?.email || '').toLowerCase().trim();
      const loName = (lo.customer_name || lo.shipping_address?.name || '').toLowerCase().trim();
      const loPhone = (lo.customer_phone || lo.shipping_address?.phone || '').replace(/\D/g, '');

      // Direct search query match (Order ID, Email, Phone)
      if (targetQ) {
        if (loId.includes(targetQ) || loOrderId.includes(targetQ)) return true;
        if (loEmail && loEmail.includes(targetQ)) return true;
        if (targetQ.replace(/\D/g, '') && loPhone && loPhone.includes(targetQ.replace(/\D/g, ''))) return true;
      }

      // Logged-in user match
      if (uId && loUserId && uId === loUserId) return true;
      if (uEmail && loEmail && uEmail === loEmail) return true;
      if (uEmail && loName && uEmail.split('@')[0] === loName) return true;

      // Guest on this browser device
      if (!uId && !uEmail) {
        if (guestIds.has(loId) || guestIds.has(loOrderId)) return true;
      }

      return false;
    });

    return matched.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async getAllOrders({ status = null, page = 1, limit = 100 } = {}) {
    // 1. Fetch live orders from Supabase
    try {
      let query = supabase.from('orders').select('*', { count: 'exact' });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const res = await withTimeout(query, 5000);
      if (res?.data && Array.isArray(res.data)) {
        const cloudOrders = cleanOrders(res.data);
        saveLocalOrders(cloudOrders);
        return {
          orders: cloudOrders,
          total: res.count !== null && res.count !== undefined ? res.count : cloudOrders.length,
          page,
          totalPages: Math.ceil((res.count || cloudOrders.length) / limit) || 1,
        };
      }
    } catch (e) {
      console.warn('Supabase orders fetch notice:', e?.message);
    }

    // 2. Offline fallback to local orders
    let localOrders = getLocalOrders();
    if (status && status !== 'all') {
      localOrders = localOrders.filter(
        (lo) => (lo.status || 'pending').toLowerCase() === status.toLowerCase()
      );
    }

    const total = localOrders.length;
    const paginated = localOrders.slice((page - 1) * limit, page * limit);

    return {
      orders: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async updateOrderStatus(orderId, status, trackingId = null) {
    if (!orderId) return null;
    const targetKey = String(orderId).toLowerCase().trim();

    const updates = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (trackingId) {
      updates.shiprocket_order_id = trackingId;
    }

    // 1. Update Supabase
    try {
      await withTimeout(
        supabase
          .from('orders')
          .update(updates)
          .or(`id.eq.${orderId},order_id.eq.${orderId}`),
        5000
      );
    } catch (e) {
      console.warn('Supabase update order status error:', e?.message);
    }

    // 2. Update local storage and dispatch event immediately
    const local = getLocalOrders();
    let prevStatus = null;
    let targetOrder = null;

    const updated = local.map((o) => {
      const idMatch = o.id && String(o.id).toLowerCase().trim() === targetKey;
      const orderIdMatch = (o.order_id && String(o.order_id).toLowerCase().trim() === targetKey) ||
                           (o.orderId && String(o.orderId).toLowerCase().trim() === targetKey);
      if (idMatch || orderIdMatch) {
        prevStatus = o.status;
        targetOrder = o;
        return { ...o, ...updates };
      }
      return o;
    });
    saveLocalOrders(updated);

    // If order was cancelled, restore inventory units; if un-cancelled, deduct again
    if (targetOrder && Array.isArray(targetOrder.items)) {
      if (updates.status === 'cancelled' && prevStatus !== 'cancelled') {
        productService.restoreStockForItems(targetOrder.items).catch(() => {});
      } else if (prevStatus === 'cancelled' && updates.status && updates.status !== 'cancelled') {
        productService.deductStockForItems(targetOrder.items).catch(() => {});
      }
    }

    return { id: orderId, ...updates };
  },

  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled');
  },

  async deleteOrder(orderOrId) {
    if (!orderOrId) return false;
    const id = typeof orderOrId === 'object' ? orderOrId.id : orderOrId;
    const order_id = typeof orderOrId === 'object' ? (orderOrId.order_id || orderOrId.orderId) : null;

    // 1. Delete from Supabase
    try {
      const targetQuery = id && order_id
        ? `id.eq.${id},order_id.eq.${order_id}`
        : id
        ? `id.eq.${id}`
        : `order_id.eq.${order_id}`;

      await withTimeout(
        supabase.from('orders').delete().or(targetQuery),
        5000
      );
    } catch (err) {
      console.warn('Supabase order delete error:', err?.message);
    }

    // 2. Remove from local storage
    const local = getLocalOrders();
    const updated = local.filter((o) => {
      if (id && (o.id === id || o.order_id === id || o.orderId === id || String(o.id) === String(id))) return false;
      if (order_id && (o.id === order_id || o.order_id === order_id || o.orderId === order_id || String(o.order_id) === String(order_id))) return false;
      return true;
    });
    saveLocalOrders(updated, true);

    return true;
  },
};
