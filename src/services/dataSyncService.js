/**
 * Localhost auto-sync service.
 * In localhost development, whenever products, categories, or orders
 * are created, updated, or removed, this pushes the state to Vite dev middleware
 * to persist directly to src/data/catalog.json and src/data/orders.json.
 * This guarantees that when the code is pushed to Git, all items added
 * on localhost are included and visible on Vercel and Netlify at publish time.
 */

export async function syncLocalhostData({ orders = null, catalog = null } = {}) {
  if (typeof window === 'undefined') return;
  const hostname = window.location?.hostname || '';
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocal) return;

  try {
    const payload = {};
    if (orders !== null) payload.orders = orders;
    if (catalog !== null) payload.catalog = catalog;

    await fetch('/api/sync-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // Non-blocking in dev
  }
}

