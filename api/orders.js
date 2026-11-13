import { createClient } from '@supabase/supabase-js';
import bundledOrders from '../src/data/orders.json' with { type: 'json' };

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kxbjohyokjqxzeoysgsd.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_7xUtsSORFtgISicn3VDNIQ_jhEyivcW";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let inMemoryOrders = Array.isArray(bundledOrders) ? [...bundledOrders] : [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET /api/orders
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        // Merge Supabase orders with in-memory orders
        const map = new Map();
        inMemoryOrders.forEach((o) => {
          const k = o.id || o.order_id || o.orderId;
          if (k) map.set(String(k), o);
        });
        data.forEach((o) => {
          const k = o.id || o.order_id || o.orderId;
          if (k) map.set(String(k), { ...map.get(String(k)), ...o });
        });
        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        return res.status(200).json({ success: true, orders: combined, source: 'supabase' });
      }
    } catch {}

    // Fallback to bundled / in-memory orders
    return res.status(200).json({
      success: true,
      orders: inMemoryOrders,
      count: inMemoryOrders.length,
      source: 'memory',
    });
  }

  // POST /api/orders
  if (req.method === 'POST') {
    const order = req.body;
    if (!order || (!order.id && !order.order_id)) {
      return res.status(400).json({ success: false, error: 'Order data required' });
    }

    const orderKey = order.id || order.order_id || order.orderId;
    inMemoryOrders = [order, ...inMemoryOrders.filter((o) => {
      const k = o.id || o.order_id || o.orderId;
      return String(k).toLowerCase() !== String(orderKey).toLowerCase();
    })];

    try {
      const dbPayload = {
        id: order.id,
        order_id: order.order_id || order.id,
        user_id: order.user_id || null,
        customer_name: order.customer_name || order.shipping_address?.name || null,
        customer_email: order.customer_email || order.shipping_address?.email || null,
        customer_phone: order.customer_phone || order.shipping_address?.phone || null,
        items: order.items || [],
        subtotal: order.subtotal || 0,
        shipping_fee: order.shipping_fee || 0,
        discount_amount: order.discount_amount || order.discount || 0,
        discount: order.discount || order.discount_amount || 0,
        coupon_code: order.coupon_code || null,
        cod_fee: order.cod_fee || 0,
        total: order.total || order.total_amount || 0,
        payment_method: order.payment_method || 'cod',
        status: order.status || 'pending',
        shipping_address: order.shipping_address || {},
        created_at: order.created_at || new Date().toISOString(),
        updated_at: order.updated_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(dbPayload)
        .select()
        .maybeSingle();

      return res.status(201).json({ success: true, order: data || order, error: error?.message });
    } catch (e) {
      return res.status(201).json({ success: true, order, notice: e.message });
    }
  }

  // PUT /api/orders
  if (req.method === 'PUT') {
    const { id, status, trackingId } = req.body;
    inMemoryOrders = inMemoryOrders.map((o) => {
      if (o.id === id || o.order_id === id || o.orderId === id) {
        return { ...o, status, shiprocket_order_id: trackingId, updated_at: new Date().toISOString() };
      }
      return o;
    });

    try {
      const updates = { status, updated_at: new Date().toISOString() };
      if (trackingId) updates.shiprocket_order_id = trackingId;

      await supabase
        .from('orders')
        .update(updates)
        .or(`id.eq.${id},order_id.eq.${id}`);

      return res.status(200).json({ success: true, updates });
    } catch (e) {
      return res.status(200).json({ success: true, localOnly: true });
    }
  }

  // DELETE /api/orders
  if (req.method === 'DELETE') {
    const { id } = req.query || req.body || {};
    inMemoryOrders = inMemoryOrders.filter((o) => o.id !== id && o.order_id !== id && o.orderId !== id);

    try {
      if (id) {
        await supabase.from('orders').delete().or(`id.eq.${id},order_id.eq.${id}`);
      }
      return res.status(200).json({ success: true, deleted: id });
    } catch (e) {
      return res.status(200).json({ success: true, deleted: id });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
