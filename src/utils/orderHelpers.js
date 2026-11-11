/**
 * Centralized Order & Item parsing helpers to eliminate duplicate code across admin & customer pages.
 */

import bundledCatalog from '../data/catalog.json';

const DEFAULT_ITEM_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';

/**
 * Normalizes item details across all legacy and current order formats.
 */
export function getItemDetails(item) {
  if (!item) {
    return {
      name: 'Handcrafted Heritage Saree',
      price: 0,
      regularPrice: 0,
      sellingPrice: 0,
      hasDiscount: false,
      qty: 1,
      image: DEFAULT_ITEM_IMAGE,
      size: 'Free Size',
      category: '',
      lineTotal: 0,
      regularLineTotal: 0,
    };
  }

  let prod = item.product || {};
  const rawName = item.name || item.title || prod.name || prod.title || 'Handcrafted Heritage Saree';

  // If prod is incomplete or missing discount_price, look up product in bundled catalog
  if (!prod.discount_price) {
    const catalogProducts = Array.isArray(bundledCatalog?.products) ? bundledCatalog.products : [];
    const matched = catalogProducts.find(
      (p) =>
        (p.id && (p.id === item.product_id || p.id === item.id)) ||
        (p.name && p.name.toLowerCase() === rawName.toLowerCase())
    );
    if (matched) {
      prod = { ...matched, ...prod };
    }
  }

  const name = prod.name || rawName;

  const sellingPrice = Number(
    (item.discount_price && Number(item.discount_price) > 0) ? item.discount_price :
    (prod.discount_price && Number(prod.discount_price) > 0) ? prod.discount_price :
    item.selling_price ??
    item.unit_price ??
    item.price ??
    prod.price ??
    0
  );

  const regularPrice = Number(
    item.regular_price ??
    prod.price ??
    item.original_price ??
    item.mrp ??
    item.price ??
    sellingPrice
  );

  const hasDiscount = regularPrice > sellingPrice && sellingPrice > 0;
  const qty = Number(item.qty || item.quantity || 1);

  const image =
    item.image ||
    prod.images?.[0] ||
    prod.image ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    DEFAULT_ITEM_IMAGE;

  const size = item.size || item.selected_size || item.variant || 'Free Size';
  const category = item.category || prod.category || '';

  return {
    name,
    price: sellingPrice,
    sellingPrice,
    regularPrice,
    hasDiscount,
    qty,
    image,
    size,
    category,
    lineTotal: sellingPrice * qty,
    regularLineTotal: regularPrice * qty,
  };
}

/**
 * Extracts customer name, phone, and email safely from an order object.
 */
export function getOrderCustomerInfo(order) {
  if (!order) return { name: 'Customer', phone: '', email: '' };

  const addr = order.shipping_address || {};
  const prof = order.profiles || {};

  const name = addr.name || order.customer_name || prof.name || 'Customer';
  const phone = addr.phone || order.customer_phone || prof.phone || '';
  const email = addr.email || order.customer_email || prof.email || '';

  return { name, phone, email };
}

