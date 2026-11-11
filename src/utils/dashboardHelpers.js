import { customerService } from '../services/customerService';
import { getItemDetails } from './orderHelpers';

/**
 * Computes live KPIs, inventory valuations, and customer mappings for the Admin Dashboard.
 */
export function calculateDashboardStats(orders = [], products = [], users = []) {
  const combinedOrders = [...orders].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalStockUnits = 0;
  const lowStockItems = [];

  products.forEach((p) => {
    const stock = Number(p.stock ?? 10);
    totalStockUnits += stock;
    if (stock === 0) {
      outOfStockCount++;
      lowStockItems.push(p);
    } else if (stock <= 5) {
      lowStockCount++;
      lowStockItems.push(p);
    }
  });

  const customerMap = new Map();
  users.forEach((u) => {
    if (
      u &&
      (u.email || u.name) &&
      u.role !== 'admin' &&
      !u.email?.toLowerCase().includes('admin')
    ) {
      if (!customerService.isCustomerDeleted(u)) {
        customerMap.set(u.email?.toLowerCase() || u.id, u);
      }
    }
  });

  combinedOrders.forEach((o) => {
    const addr = o.shipping_address || {};
    const email = addr.email || o.customer_email;
    if (email && !customerMap.has(email.toLowerCase())) {
      const custObj = {
        id: o.user_id || o.id,
        name: addr.name || o.customer_name || 'Customer User',
        email: email,
        phone: addr.phone || o.customer_phone || '+91 98401 23456',
        role: 'user',
        created_at: o.created_at || new Date().toISOString(),
      };
      if (!customerService.isCustomerDeleted(custObj)) {
        customerMap.set(email.toLowerCase(), custObj);
      }
    }
  });

  const combinedCustomers = Array.from(customerMap.values());

  const totalRevenue = combinedOrders.reduce(
    (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
    0
  );
  const totalOrders = combinedOrders.length;
  const recentOrders = combinedOrders.slice(0, 8);

  const productCostMap = new Map();
  products.forEach((p) => {
    const selling =
      Number(
        p.discount_price && Number(p.discount_price) > 0
          ? p.discount_price
          : p.price
      ) || 0;
    const cost =
      Number(p.cost) > 0
        ? Number(p.cost)
        : selling > 0
        ? Math.round(selling * 0.52)
        : 0;
    if (p.id) productCostMap.set(String(p.id), { cost, selling });
    if (p.slug) productCostMap.set(String(p.slug), { cost, selling });
    if (p.name) productCostMap.set(p.name.toLowerCase().trim(), { cost, selling });
  });

  let calculatedProfit = 0;
  combinedOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    let orderProfit = 0;
    let hasMatchedItems = false;

    items.forEach((it) => {
      const details = getItemDetails(it);
      const prod =
        productCostMap.get(String(it.product_id || it.id)) ||
        productCostMap.get(details.name?.toLowerCase().trim());
      if (prod) {
        hasMatchedItems = true;
        const unitSelling = details.price > 0 ? details.price : prod.selling;
        const unitCost =
          prod.cost > 0 ? prod.cost : Math.round(unitSelling * 0.52);
        orderProfit += (unitSelling - unitCost) * details.qty;
      }
    });

    if (hasMatchedItems && orderProfit > 0) {
      calculatedProfit += orderProfit;
    } else {
      const orderTotal = parseFloat(o.total || o.total_amount) || 0;
      calculatedProfit += Math.round(orderTotal * 0.48);
    }
  });

  const estimatedProfit =
    calculatedProfit > 0 ? calculatedProfit : Math.round(totalRevenue * 0.48);

  return {
    allOrders: combinedOrders,
    totalOrders,
    totalRevenue,
    estimatedProfit,
    lowStockCount,
    outOfStockCount,
    totalStockUnits: totalStockUnits || 120,
    activeCustomersCount: combinedCustomers.length,
    recentLowStock: lowStockItems.slice(0, 5),
    recentOrders,
    customers: combinedCustomers,
  };
}

/**
 * Calculates 7-day revenue velocity for the bar chart.
 */
export function calculateRevenueChartData(allOrders = []) {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
    });
    days.push({ dateKey, dayLabel, revenue: 0, ordersCount: 0 });
  }

  allOrders.forEach((ord) => {
    if (!ord.created_at) return;
    const orderDate = new Date(ord.created_at).toISOString().split('T')[0];
    const targetDay = days.find((d) => d.dateKey === orderDate);
    if (targetDay) {
      targetDay.revenue += parseFloat(ord.total || ord.total_amount || 0);
      targetDay.ordersCount += 1;
    }
  });

  const maxRev = Math.max(...days.map((d) => d.revenue), 1000);
  return { days, maxRev };
}

/**
 * Calculates order distribution and payment realization breakdown for donut chart.
 */
export function calculateDonutChartData(allOrders = []) {
  let delivered = 0;
  let shipped = 0;
  let paidOrProcessing = 0;
  let pendingOrCod = 0;
  let cancelled = 0;

  allOrders.forEach((ord) => {
    const st = (ord.status || 'pending').toLowerCase();
    if (st === 'delivered') delivered++;
    else if (st === 'shipped') shipped++;
    else if (st === 'paid' || st === 'processing' || st === 'confirmed')
      paidOrProcessing++;
    else if (st === 'cancelled') cancelled++;
    else pendingOrCod++;
  });

  const total = allOrders.length || 1;
  const slices = [
    {
      label: 'Delivered',
      count: delivered,
      color: '#38BDF8',
      pct: Math.round((delivered / total) * 100),
    },
    {
      label: 'Shipped',
      count: shipped,
      color: '#818CF8',
      pct: Math.round((shipped / total) * 100),
    },
    {
      label: 'Paid / In-Process',
      count: paidOrProcessing,
      color: '#D4AF37',
      pct: Math.round((paidOrProcessing / total) * 100),
    },
    {
      label: 'Pending / COD',
      count: pendingOrCod,
      color: '#F59E0B',
      pct: Math.round((pendingOrCod / total) * 100),
    },
    {
      label: 'Cancelled',
      count: cancelled,
      color: '#EF4444',
      pct: Math.round((cancelled / total) * 100),
    },
  ];

  return { slices, totalOrders: allOrders.length };
}

