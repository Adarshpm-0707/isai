import { supabase } from '../lib/supabaseClient';

export const orderService = {
  async getUserOrders(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllOrders({ status = null, page = 1, limit = 20 } = {}) {
    let query = supabase.from('orders').select('*, profiles(name, email, phone)', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      orders: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
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
    const { data, error } = await supabase.functions.invoke('cancel-order', {
      body: { order_id: orderId },
    });
    if (error) throw error;
    return data;
  },
};
