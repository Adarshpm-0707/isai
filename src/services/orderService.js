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

function cleanDemoOrders(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((o) => {
    if (!o) return false;
    const idKey = String(o.id || '').toLowerCase().trim();
    const orderIdKey = String(o.order_id || o.orderId || '').toLowerCase().trim();
    if (!idKey && !orderIdKey) return false;

    // Filter out only ancient hardcoded mock IDs
    if (idKey && DEMO_ORDER_IDS.has(idKey)) return false;
    if (orderIdKey && DEMO_ORDER_IDS.has(orderIdKey)) return false;

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

  // Merge bundled orders from codebase with localStorage orders
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

  // Seed back to localStorage if it was empty
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
    // 1. Fetch from all sources (Server API, Supabase, Local Store)
    const [allOrdersData, serverOrders] = await Promise.allSettled([
      this.getAllOrders({ status: 'all', limit: 200 }),
      fetchServerOrders(),
    ]);

    const combined = [];
    const map = new Map();

    const addOrder = (o) => {
      if (!o) return;
      const key = o.id || o.order_id || o.orderId;
      if (key && !map.has(String(key))) {
        map.set(String(key), o);
        combined.push(o);
      }
    };

    if (allOrdersData.status === 'fulfilled' && allOrdersData.value?.orders) {
      allOrdersData.value.orders.forEach(addOrder);
    }
    if (serverOrders.status === 'fulfilled' && Array.isArray(serverOrders.value)) {
      serverOrders.value.forEach(addOrder);
    }
    getLocalOrders().forEach(addOrder);

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

    const matched = combined.filter((lo) => {
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
    let dbOrders = [];
    let count = 0;

    // 1. Fetch from Supabase
    try {
      let query = supabase.from('orders').select('*', { count: 'exact' });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const res = await withTimeout(query, 2500);
      if (res?.data && Array.isArray(res.data)) {
        dbOrders = cleanDemoOrders(res.data);
        count = res.count || dbOrders.length;
      }
    } catch (e) {
      // Supabase timeout or offline
    }

    // 2. Fetch from Unified Server API
    let serverOrders = [];
    try {
      serverOrders = await fetchServerOrders();
      if (status && status !== 'all') {
        serverOrders = serverOrders.filter(
          (o) => (o.status || 'pending').toLowerCase() === status.toLowerCase()
        );
      }
    } catch {}

    // 3. Local orders
    let localOrders = getLocalOrders();
    if (status && status !== 'all') {
      localOrders = localOrders.filter(
        (lo) => (lo.status || 'pending').toLowerCase() === status.toLowerCase()
      );
    }

    // Merge and deduplicate by key
    const map = new Map();
    const findExistingKey = (o) => {
      const oId = String(o.id || '').toLowerCase().trim();
      const oOrdId = String(o.order_id || o.orderId || '').toLowerCase().trim();
      for (const [k, v] of map.entries()) {
        const vId = String(v.id || '').toLowerCase().trim();
        const vOrdId = String(v.order_id || v.orderId || '').toLowerCase().trim();
        if (oId && (vId === oId || vOrdId === oId)) return k;
        if (oOrdId && (vId === oOrdId || vOrdId === oOrdId)) return k;
      }
      return null;
    };

    const addOrder = (o) => {
      if (!o) return;
      const matchKey = findExistingKey(o);
      const key = matchKey || o.id || o.order_id || o.orderId;
      if (key) {
        const existing = map.get(String(key));
        map.set(String(key), { ...existing, ...o });
      }
    };

    localOrders.forEach(addOrder);
    serverOrders.forEach(addOrder);
    dbOrders.forEach(addOrder);

    const combined = Array.from(map.values());
    combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    // Cache merged orders to localStorage
    try {
      if (typeof localStorage !== 'undefined' && combined.length > 0) {
        localStorage.setItem('isai_orders', JSON.stringify(combined));
      }
    } catch {}

    const total = Math.max(count, combined.length);
    const paginated = combined.slice((page - 1) * limit, page * limit);

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

    // 1. Update local storage and dispatch event immediately
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

    // 2. Push update to unified server API
    try {
      fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch {}

    // 3. Update Supabase
    try {
      withTimeout(
        supabase
          .from('orders')
          .update(updates)
          .or(`id.eq.${orderId},order_id.eq.${orderId}`)
          .select()
          .maybeSingle(),
        2000
      ).catch(() => {});
    } catch (e) {}

    return { id: orderId, ...updates };
  },

  async cancelOrder(orderId) {
    return this.updateOrderStatus(orderId, 'cancelled');
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

    // 2. Remove from local storage
    const local = getLocalOrders();
    const updated = local.filter((o) => {
      if (id && (o.id === id || o.order_id === id || o.orderId === id || String(o.id) === String(id))) return false;
      if (order_id && (o.id === order_id || o.order_id === order_id || o.orderId === order_id || String(o.order_id) === String(order_id))) return false;
      return true;
    });
    saveLocalOrders(updated, true);

    // 3. Delete from Unified Server API
    try {
      const deleteKey = id || order_id;
      fetch(`/api/orders/${deleteKey}`, { method: 'DELETE' }).catch(() => {});
    } catch {}

    // 4. Delete from Supabase in background
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
    } catch (err) {}

    return true;
  },
};
