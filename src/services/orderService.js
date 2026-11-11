import { supabase } from '../lib/supabaseClient';
import bundledOrders from '../data/orders.json';
import { syncLocalhostData } from './dataSyncService';
import { productService } from './productService';

const DEMO_ORDER_IDS = new Set([
  '6f52a1b0-4a89-4e78-98e2-b0113c490a01',
  '7a83b2c1-5b90-4f89-89f3-c1224d501b02',
  '8b94c3d2-6c01-409a-90a4-d2335e612c03',
]);

const withTimeout = (promise, ms = 3000) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

function getDeletedOrderIds() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('isai_deleted_order_ids') : null;
    const list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return new Set();
    return new Set(
      list
        .filter((id) => id && typeof id === 'string' && id.trim().length > 0)
        .map((id) => String(id).toLowerCase().trim())
    );
  } catch {
    return new Set();
  }
}

function cleanDemoOrders(list) {
  if (!Array.isArray(list)) return [];
  const deleted = getDeletedOrderIds();
  return list.filter((o) => {
    if (!o) return false;
    const idKey = String(o.id || '').toLowerCase().trim();
    const orderIdKey = String(o.order_id || o.orderId || '').toLowerCase().trim();
    if (!idKey && !orderIdKey) return false;

    if (idKey && (DEMO_ORDER_IDS.has(idKey) || deleted.has(idKey))) return false;
    if (orderIdKey && (DEMO_ORDER_IDS.has(orderIdKey) || deleted.has(orderIdKey))) return false;

    const custName = String(o.customer_name || o.shipping_address?.name || '').toLowerCase();
    if (
      custName.includes('priya sundaram') ||
      custName.includes('meenakshi ramanathan') ||
      custName.includes('ananya iyer') ||
      custName.includes('deepika natarajan')
    ) {
      return false;
    }
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

  // Merge bundled orders from codebase with localStorage orders so localhost additions deploy to Vercel and Netlify
  const bundled = Array.isArray(bundledOrders) ? bundledOrders : [];
  const map = new Map();

  // 1. Seed with bundled orders
  bundled.forEach((o) => {
    const key = o.id || o.order_id || o.orderId;
    if (key) map.set(String(key), o);
  });

  // 2. Layer on top current localStorage orders (preserving newer status/data)
  list.forEach((o) => {
    const key = o.id || o.order_id || o.orderId;
    if (key) {
      const existing = map.get(String(key));
      map.set(String(key), { ...existing, ...o });
    }
  });

  const merged = Array.from(map.values());
  const cleaned = cleanDemoOrders(merged);
  cleaned.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  // Seed back to localStorage if it was empty so other components read the same data immediately
  try {
    if (typeof localStorage !== 'undefined' && list.length === 0 && cleaned.length > 0) {
      localStorage.setItem('isai_orders', JSON.stringify(cleaned));
    }
  } catch {}

  return cleaned;
}

export function saveLocalOrders(orders, replaceAll = false) {
  const cleaned = cleanDemoOrders(orders);
  cleaned.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('isai_orders', JSON.stringify(cleaned));
    }
  } catch (err) {
    console.warn('LocalStorage orders quota notice:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('isai:orders_updated', { detail: cleaned }));
  }

  // Auto-sync to disk when running on localhost
  syncLocalhostData({ orders: cleaned, replaceAll });
}

export const orderService = {
  getLocalOrders() {
    return getLocalOrders();
  },

  async getUserOrders(userId = null) {
    let dbOrders = [];
    if (userId) {
      try {
        const timer = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1000)
        );
        const { data } = await Promise.race([
          supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
          timer,
        ]);
        if (Array.isArray(data)) dbOrders = cleanDemoOrders(data);
      } catch (e) {
        console.warn('Supabase getUserOrders notice:', e?.message);
      }
    }

    const localOrders = getLocalOrders();
    const combined = [...dbOrders];

    localOrders.forEach((lo) => {
      // Include matching user orders or device guest orders
      if (!userId || !lo.user_id || lo.user_id === userId) {
        if (!combined.some((bo) => (bo.id && bo.id === lo.id) || (bo.order_id && bo.order_id === lo.order_id))) {
          combined.push(lo);
        }
      }
    });

    return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async getAllOrders({ status = null, page = 1, limit = 100 } = {}) {
    let dbOrders = [];
    let count = 0;
    try {
      let query = supabase.from('orders').select('*', { count: 'exact' });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const timer = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 1000)
      );
      const res = await Promise.race([query, timer]);
      if (res?.data && Array.isArray(res.data)) {
        dbOrders = cleanDemoOrders(res.data);
        count = res.count || dbOrders.length;
      }
    } catch (e) {
      console.warn('Supabase getAllOrders notice:', e?.message);
    }

    let localOrders = getLocalOrders();
    if (status && status !== 'all') {
      localOrders = localOrders.filter(
        (lo) => (lo.status || 'pending').toLowerCase() === status.toLowerCase()
      );
    }

    const combined = [...dbOrders];
    localOrders.forEach((lo) => {
      if (!combined.some((bo) => (bo.id && bo.id === lo.id) || (bo.order_id && bo.order_id === lo.order_id))) {
        combined.push(lo);
      }
    });

    combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    const total = count || combined.length;

    return {
      orders: combined,
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

    // 1. Update local and sync to orders.json on localhost
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

    // 2. Background update Supabase with short timeout (800ms)
    try {
      await withTimeout(
        supabase
          .from('orders')
          .update(updates)
          .or(`id.eq.${orderId},order_id.eq.${orderId}`)
          .select()
          .maybeSingle(),
        800
      );
    } catch (e) {
      // Supabase is not reachable; local order state is already updated
    }

    return { id: orderId, ...updates };
  },

  async cancelOrder(orderId) {
    // 1. Update local and sync to orders.json on localhost
    const local = getLocalOrders();
    let orderToCancel = null;
    const updated = local.map((o) => {
      if (o.id === orderId || o.order_id === orderId || o.orderId === orderId) {
        orderToCancel = o;
        return { ...o, status: 'cancelled', updated_at: new Date().toISOString() };
      }
      return o;
    });
    saveLocalOrders(updated);

    // Restore stock if the order had not already been cancelled
    if (orderToCancel && orderToCancel.status !== 'cancelled' && Array.isArray(orderToCancel.items)) {
      try {
        await productService.restoreStockForItems(orderToCancel.items);
      } catch (e) {}
    }

    // 2. Cloud Edge Function / Supabase update
    try {
      await withTimeout(
        supabase.from('orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', orderId),
        3000
      );
    } catch (e) {}

    return { success: true, order_id: orderId, status: 'cancelled' };
  },

  async deleteOrder(orderOrId) {
    if (!orderOrId) return false;
    const id = typeof orderOrId === 'object' ? orderOrId.id : orderOrId;
    const order_id = typeof orderOrId === 'object' ? (orderOrId.order_id || orderOrId.orderId) : null;

    // 1. Mark in deleted order ids
    try {
      const deletedRaw = localStorage.getItem('isai_deleted_order_ids') || '[]';
      const deletedList = JSON.parse(deletedRaw);
      const addId = (val) => {
        if (!val) return;
        const s = String(val).toLowerCase().trim();
        if (s && !deletedList.includes(s)) deletedList.push(s);
      };
      addId(id);
      addId(order_id);
      localStorage.setItem('isai_deleted_order_ids', JSON.stringify(deletedList));
    } catch (e) {}

    // 2. Remove from local & bundled storage and sync to disk on localhost
    const local = getLocalOrders();
    const updated = local.filter((o) => {
      if (id && (o.id === id || o.order_id === id || o.orderId === id || String(o.id) === String(id))) return false;
      if (order_id && (o.id === order_id || o.order_id === order_id || o.orderId === order_id || String(o.order_id) === String(order_id))) return false;
      return true;
    });
    saveLocalOrders(updated, true);

    // 3. Delete from Supabase in background
    try {
      const targetQuery = id && order_id
        ? `id.eq.${id},order_id.eq.${order_id}`
        : id
        ? `id.eq.${id}`
        : `order_id.eq.${order_id}`;

      withTimeout(
        supabase.from('orders').delete().or(targetQuery),
        3000
      ).catch(() => {});
    } catch (err) {
      console.warn('Supabase deleteOrder notice:', err.message);
    }

    return true;
  },
};
