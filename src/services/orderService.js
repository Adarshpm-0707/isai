import { supabase } from '../lib/supabaseClient';

export const orderService = {
  async getUserOrders(userId) {
    if (!userId) return [];

    let dbOrders = [];
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) dbOrders = data;
    } catch (e) {
      console.warn('Supabase getUserOrders fetch notice:', e);
    }

    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('isai_orders') || '[]');
    } catch (e) {}

    const userLocals = localOrders.filter(o => o.user_id === userId || !o.user_id);
    const combined = [...dbOrders];

    userLocals.forEach(lo => {
      if (!combined.some(bo => bo.id === lo.id || bo.order_id === lo.id)) {
        combined.push(lo);
      }
    });

    return combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async getAllOrders({ status = null, page = 1, limit = 20 } = {}) {
    let dbOrders = [];
    let count = 0;
    try {
      let query = supabase.from('orders').select('*, profiles(name, email, phone)', { count: 'exact' });
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.order('created_at', { ascending: false }).range(from, to);

      const res = await query;
      if (res.data) {
        dbOrders = res.data;
        count = res.count || dbOrders.length;
      }
    } catch (e) {
      console.warn('Supabase getAllOrders fetch notice:', e);
    }

    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('isai_orders') || '[]');
      if (status && status !== 'all') {
        localOrders = localOrders.filter(
          (lo) => (lo.status || 'pending').toLowerCase() === status.toLowerCase()
        );
      }
    } catch (e) {}

    const combined = [...dbOrders];
    localOrders.forEach(lo => {
      if (!combined.some(bo => bo.id === lo.id || bo.order_id === lo.id)) {
        combined.push(lo);
      }
    });

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
