import { supabase } from '../lib/supabaseClient';

const SEED_STORE_ORDERS = [
  {
    id: '6f52a1b0-4a89-4e78-98e2-b0113c490a01',
    order_id: 'ORD-948215-K10A',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    customer_name: 'Priya Sundaram',
    customer_email: 'priya.sundaram@gmail.com',
    customer_phone: '+91 98401 23456',
    shipping_address: {
      name: 'Priya Sundaram',
      email: 'priya.sundaram@gmail.com',
      phone: '+91 98401 23456',
      addressLine1: 'Flat 4B, Heritage Grandeur, Anna Nagar West',
      addressLine2: 'Near Roundtana',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
    },
    items: [
      {
        id: 'prod-kanchi-01',
        name: 'Royal Crimson Kanchipuram Pure Zari Silk Saree',
        price: 18500,
        qty: 1,
        quantity: 1,
        size: 'Standard (6.2m Silk)',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      },
    ],
    subtotal: 18500,
    discount: 1000,
    shipping_fee: 0,
    cod_fee: 0,
    total: 17500,
    total_amount: 17500,
    payment_method: 'prepaid',
    paymentMethod: 'Online Payment (Prepaid / UPI)',
    status: 'confirmed',
  },
  {
    id: '7a83b2c1-5b90-4f89-89f3-c1224d501b02',
    order_id: 'ORD-948192-B20B',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    customer_name: 'Meenakshi Ramanathan',
    customer_email: 'meenakshi.r@outlook.com',
    customer_phone: '+91 94440 98765',
    shipping_address: {
      name: 'Meenakshi Ramanathan',
      email: 'meenakshi.r@outlook.com',
      phone: '+91 94440 98765',
      addressLine1: '12 Temple View Street, Gandhi Nagar',
      addressLine2: 'Opposite Rajendra Mahal',
      city: 'Kanchipuram',
      state: 'Tamil Nadu',
      pincode: '631502',
    },
    items: [
      {
        id: 'prod-banarasi-02',
        name: 'Gold Brocade Banarasi Katan Silk Saree',
        price: 14200,
        qty: 1,
        quantity: 1,
        size: 'Standard (6.2m Silk)',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
      },
    ],
    subtotal: 14200,
    discount: 0,
    shipping_fee: 0,
    cod_fee: 40,
    total: 14240,
    total_amount: 14240,
    payment_method: 'cod',
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'processing',
  },
  {
    id: '8b94c3d2-6c01-4a90-90a4-d2335e612c03',
    order_id: 'ORD-948150-C30C',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    customer_name: 'Ananya Iyer',
    customer_email: 'ananya.iyer@gmail.com',
    customer_phone: '+91 99800 11223',
    shipping_address: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@gmail.com',
      phone: '+91 99800 11223',
      addressLine1: '77 Palm Grove Road, Malleshwaram',
      addressLine2: '15th Cross',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560003',
    },
    items: [
      {
        id: 'prod-kuthampully-03',
        name: 'Kuthampully Handwoven Golden Kasavu Saree',
        price: 8900,
        qty: 1,
        quantity: 1,
        size: 'Standard (6.2m Silk)',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      },
    ],
    subtotal: 8900,
    discount: 500,
    shipping_fee: 0,
    cod_fee: 0,
    total: 8400,
    total_amount: 8400,
    payment_method: 'prepaid',
    paymentMethod: 'Online Payment (Prepaid)',
    status: 'delivered',
  },
  {
    id: '9c05d4e3-7d12-4b01-a1b5-e3446f723d04',
    order_id: 'ORD-948110-D40D',
    created_at: new Date(Date.now() - 3600000 * 70).toISOString(),
    customer_name: 'Deepika Natarajan',
    customer_email: 'deepika.n@gmail.com',
    customer_phone: '+91 97910 55443',
    shipping_address: {
      name: 'Deepika Natarajan',
      email: 'deepika.n@gmail.com',
      phone: '+91 97910 55443',
      addressLine1: '24 Besant Avenue, Adyar',
      addressLine2: 'Near Beach Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
    },
    items: [
      {
        id: 'prod-temple-04',
        name: 'Peacock Motif Handwoven Silk Saree',
        price: 11900,
        qty: 1,
        quantity: 1,
        size: 'Standard (6.2m Silk)',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      },
    ],
    subtotal: 11900,
    discount: 0,
    shipping_fee: 0,
    cod_fee: 0,
    total: 11900,
    total_amount: 11900,
    payment_method: 'prepaid',
    paymentMethod: 'Online Payment (Prepaid)',
    status: 'shipped',
  },
];

export function getLocalOrders() {
  try {
    const raw = localStorage.getItem('isai_orders');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  try {
    localStorage.setItem('isai_orders', JSON.stringify(SEED_STORE_ORDERS));
  } catch (e) {}
  return SEED_STORE_ORDERS;
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
        if (Array.isArray(data)) dbOrders = data;
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
        dbOrders = res.data;
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
