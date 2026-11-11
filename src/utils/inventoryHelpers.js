/**
 * Pure helper functions for inventory valuations, margins, and CSV export.
 */

export function getProductFinancials(p, stockOverride, costOverride) {
  const stock =
    stockOverride !== undefined
      ? Math.max(0, parseInt(stockOverride, 10) || 0)
      : Math.max(0, Number(p.stock) || 0);

  /* Effective customer retail selling price */
  const sellingPrice = Number(
    p.discount_price &&
      Number(p.discount_price) > 0 &&
      Number(p.discount_price) < Number(p.price)
      ? p.discount_price
      : p.price || 0
  );

  /* Original MRP regular price */
  const originalPrice = Number(
    p.original_price ||
      (p.discount_price && Number(p.discount_price) < Number(p.price)
        ? p.price
        : 0) ||
      (sellingPrice > 0 ? Math.round(sellingPrice * 1.25) : 0)
  );

  /* Unit discount amount */
  const unitDiscount = Math.max(0, originalPrice - sellingPrice);
  const discountPercent =
    originalPrice > 0 ? Math.round((unitDiscount / originalPrice) * 100) : 0;

  /* Procurement or weaver cost price */
  const defaultCost = sellingPrice > 0 ? Math.round(sellingPrice * 0.52) : 0;
  const rawCost =
    costOverride !== undefined
      ? costOverride
      : p.cost !== undefined && p.cost !== null && Number(p.cost) > 0
      ? Number(p.cost)
      : defaultCost;
  const costPrice = Math.max(0, Number(rawCost) || 0);

  /* Profit per saree */
  const unitProfit = sellingPrice - costPrice;
  const marginPercent =
    sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(1) : '0.0';

  /* Line totals for current inventory stock */
  const lineCost = costPrice * stock;
  const lineSelling = sellingPrice * stock;
  const lineDiscount = unitDiscount * stock;
  const lineProfit = unitProfit * stock;

  return {
    stock,
    sellingPrice,
    originalPrice,
    unitDiscount,
    discountPercent,
    costPrice,
    unitProfit,
    marginPercent,
    lineCost,
    lineSelling,
    lineDiscount,
    lineProfit,
  };
}

export function exportInventoryToCSV(products = [], stockEdits = {}, costEdits = {}) {
  if (!products || products.length === 0) {
    alert('No products available to export.');
    return;
  }

  const headers = [
    'Product ID',
    'Saree Title',
    'Category',
    'Stock Units',
    'Stock Status',
    'Cost Price (INR)',
    'MRP Price (INR)',
    'Selling Price (INR)',
    'Discount (%)',
    'Unit Profit (INR)',
    'Margin (%)',
    'Inventory Cost Value (INR)',
    'Inventory Retail Value (INR)',
    'Potential Total Profit (INR)',
  ];

  const rows = products.map((p) => {
    const fin = getProductFinancials(p, stockEdits[p.id], costEdits[p.id]);
    let statusText = 'In Stock';
    if (fin.stock <= 0) statusText = 'Out of Stock';
    else if (fin.stock <= 5) statusText = 'Low Stock';

    const cleanStr = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    return [
      cleanStr(p.id),
      cleanStr(p.name || 'Saree'),
      cleanStr(p.category || 'General'),
      fin.stock,
      cleanStr(statusText),
      fin.costPrice,
      fin.originalPrice,
      fin.sellingPrice,
      `${fin.discountPercent}%`,
      fin.unitProfit,
      `${fin.marginPercent}%`,
      fin.lineCost,
      fin.lineSelling,
      fin.lineProfit,
    ].join(',');
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `isai_inventory_valuation_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
