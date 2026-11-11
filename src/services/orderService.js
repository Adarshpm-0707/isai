import { supabase } from '../lib/supabaseClient';

const DEMO_ORDER_IDS = new Set([
  '6f52a1b0-4a89-4e78-98e2-b0113c490a01',
  '7a83b2c1-5b90-4f89-89f3-c1224d501b02',
  '8b94c3d2-6c01-409a-90a4-d2335e612c03',
]);

function cleanDemoOrders(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((o) => o && o.id && !DEMO_ORDER_IDS.has(o.id));
}

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem('isai_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = cleanDemoOrders(parsed);
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('isai_orders', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (e) {}

  return [];
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
    const updates = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (trackingId) {
      updates.shiprocket_order_id = trackingId;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancelOrder(orderId) {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-order', {
        body: { order_id: orderId },
      });
      if (!error && data) return data;
    } catch (err) {
      console.warn('Edge Function cancel-order notice, updating database directly:', err);
    }

    // Direct Database & Local Storage Fallback Update
    try {
      await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem('isai_orders') || '[]');
      const found = existing.find((o) => o.id === orderId || o.order_id === orderId);
      if (found) {
        found.status = 'cancelled';
        localStorage.setItem('isai_orders', JSON.stringify(existing));
      }
    } catch (e) {}

    return { success: true, order_id: orderId, status: 'cancelled' };
  },
};
