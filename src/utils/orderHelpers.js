/**
 * Centralized Order & Item parsing helpers to eliminate duplicate code across admin & customer pages.
 */

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
      qty: 1,
      image: DEFAULT_ITEM_IMAGE,
      size: 'Free Size',
      lineTotal: 0,
    };
  }

  const name =
    item.name ||
    item.title ||
    item.product?.name ||
    item.product?.title ||
    'Handcrafted Heritage Saree';

  const price = Number(
    item.price ||
    item.unit_price ||
    item.product?.price ||
    item.product?.regular_price ||
    0
  );

  const qty = Number(item.qty || item.quantity || 1);

  const image =
    item.image ||
    item.product?.images?.[0] ||
    item.product?.image ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    DEFAULT_ITEM_IMAGE;

  const size = item.size || item.selected_size || item.variant || 'Free Size';

  return {
    name,
    price,
    qty,
    image,
    size,
    lineTotal: price * qty,
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

