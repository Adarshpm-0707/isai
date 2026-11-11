/**
 * Pure calculation utilities for Profit & Loss reports
 */

export function filterOrdersByRange(orders = [], timeRange = 'all') {
  if (timeRange === 'all') return orders;
  const now = new Date();

  return orders.filter((o) => {
    const orderDate = new Date(o.created_at || Date.now());
    if (timeRange === 'week') {
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (timeRange === 'month') {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });
}

export function calculateProfitLossMetrics(filteredOrders = []) {
  const grossRevenue = filteredOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );

  const totalDiscounts = filteredOrders.reduce(
    (acc, o) => acc + Number(o.discount || 0),
    0
  );

  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(grossRevenue / totalOrdersCount) : 0;

  // Estimated Cost of Goods Sold (COGS) ~ 46% of retail price for master handloom silk weaving
  const estimatedCOGS = Math.round(grossRevenue * 0.46);
  // Estimated Operating / Shipping Costs ~ 6%
  const estimatedOperating = Math.round(grossRevenue * 0.06);
  // Net Profit
  const netProfit = Math.max(0, grossRevenue - estimatedCOGS - estimatedOperating);
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // Payment Breakdown
  const codOrders = filteredOrders.filter(
    (o) => (o.payment_method || o.paymentMethod || '').toUpperCase().includes('COD')
  );
  const prepaidOrders = filteredOrders.filter(
    (o) => !(o.payment_method || o.paymentMethod || '').toUpperCase().includes('COD')
  );

  const codRevenue = codOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );
  const prepaidRevenue = prepaidOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );

  // Category Revenue Breakdown
  const categoryRevenueMap = {};
  filteredOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((it) => {
      const cat = it.product?.category || it.category || 'Pure Silk';
      const itemPrice = Number(it.price || it.product?.price || 0);
      const qty = Number(it.quantity || it.qty || 1);
      categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + itemPrice * qty;
    });
  });

  // Top Performing Sarees
  const productPerformanceMap = {};
  filteredOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((it) => {
      const name = it.name || it.product?.name || 'Heritage Saree';
      const qty = Number(it.quantity || it.qty || 1);
      const price = Number(it.price || it.product?.price || 0);
      const total = price * qty;

      if (!productPerformanceMap[name]) {
        productPerformanceMap[name] = {
          name,
          category: it.product?.category || it.category || 'Pure Silk',
          unitsSold: 0,
          revenue: 0,
        };
      }
      productPerformanceMap[name].unitsSold += qty;
      productPerformanceMap[name].revenue += total;
    });
  });

  const topSarees = Object.values(productPerformanceMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return {
    grossRevenue,
    totalDiscounts,
    totalOrdersCount,
    avgOrderValue,
    estimatedCOGS,
    estimatedOperating,
    netProfit,
    profitMargin,
    codOrders,
    prepaidOrders,
    codRevenue,
    prepaidRevenue,
    categoryRevenueMap,
    topSarees,
  };
}

export function exportProfitLossCSV({ timeRange, metrics }) {
  const {
    grossRevenue,
    estimatedCOGS,
    estimatedOperating,
    totalDiscounts,
    netProfit,
    profitMargin,
    totalOrdersCount,
    avgOrderValue,
    prepaidRevenue,
    codRevenue,
    topSarees = [],
  } = metrics;

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [
      'ISAI TARANG HANDLOOM : PROFIT & LOSS STATEMENT',
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      `Period: ${timeRange.toUpperCase()}`,
      '',
      'Financial Metric,Value (INR)',
      `Gross Revenue,${grossRevenue}`,
      `Estimated COGS (46%),${estimatedCOGS}`,
      `Operating & Logistics (6%),${estimatedOperating}`,
      `Total Discounts Provided,${totalDiscounts}`,
      `Net Estimated Profit,${netProfit}`,
      `Net Profit Margin,${profitMargin}%`,
      `Total Orders,${totalOrdersCount}`,
      `Average Order Value (AOV),${avgOrderValue}`,
      `Prepaid Revenue,${prepaidRevenue}`,
      `Cash on Delivery Revenue,${codRevenue}`,
      '',
      'Product Name,Category,Units Sold,Total Revenue (INR),Estimated Profit (INR)',
      ...topSarees.map(
        (s) =>
          `"${s.name}","${s.category}",${s.unitsSold},${s.revenue},${Math.round(s.revenue * 0.48)}`
      ),
    ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `isai_financial_pl_${timeRange}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
