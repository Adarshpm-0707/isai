import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isaiApiPlugin() {
  const DATA_DIR = path.resolve(__dirname, 'src/data');
  const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
  const PUBLIC_ORDERS_FILE = path.resolve(__dirname, 'public/data/orders.json');
  const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');

  const readJson = (file, fallback = []) => {
    try {
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
    } catch {}
    return fallback;
  };

  const writeOrders = (orders) => {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
      try {
        if (!fs.existsSync(path.dirname(PUBLIC_ORDERS_FILE))) {
          fs.mkdirSync(path.dirname(PUBLIC_ORDERS_FILE), { recursive: true });
        }
        fs.writeFileSync(PUBLIC_ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
      } catch {}
      return true;
    } catch (e) {
      console.error('[Vite API] Error writing orders:', e.message);
      return false;
    }
  };

  const parseBody = (req) =>
    new Promise((resolve) => {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
      req.on('error', () => resolve({}));
    });

  const sendJson = (res, status, obj) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(obj));
  };

  return {
    name: 'isai-unified-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0].replace(/\/+$/, '') || '/';

        // CORS OPTIONS
        if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        // GET /api/health
        if (pathname === '/api/health') {
          const orders = readJson(ORDERS_FILE, []);
          return sendJson(res, 200, {
            status: 'ok',
            server: 'vite-dev-api',
            ordersCount: orders.length,
          });
        }

        // GET /api/orders
        if (pathname === '/api/orders' && req.method === 'GET') {
          const orders = readJson(ORDERS_FILE, []);
          return sendJson(res, 200, { success: true, orders, count: orders.length });
        }

        // POST /api/orders
        if (pathname === '/api/orders' && req.method === 'POST') {
          const newOrder = await parseBody(req);
          if (!newOrder || (!newOrder.id && !newOrder.order_id && !newOrder.orderId)) {
            return sendJson(res, 400, { success: false, error: 'Valid order object required' });
          }
          const orders = readJson(ORDERS_FILE, []);
          const orderKey = newOrder.id || newOrder.order_id || newOrder.orderId;
          const filtered = orders.filter((o) => {
            const k = o.id || o.order_id || o.orderId;
            return String(k).toLowerCase() !== String(orderKey).toLowerCase();
          });
          const updated = [newOrder, ...filtered];
          writeOrders(updated);
          return sendJson(res, 201, { success: true, order: newOrder, total: updated.length });
        }

        // PUT /api/orders/:id
        if (pathname.startsWith('/api/orders/') && req.method === 'PUT') {
          const orderId = pathname.replace('/api/orders/', '').trim();
          const updates = await parseBody(req);
          const orders = readJson(ORDERS_FILE, []);
          let found = null;
          const updated = orders.map((o) => {
            const matchId = String(o.id || '').toLowerCase() === String(orderId).toLowerCase();
            const matchOrderId = String(o.order_id || o.orderId || '').toLowerCase() === String(orderId).toLowerCase();
            if (matchId || matchOrderId) {
              found = { ...o, ...updates, updated_at: new Date().toISOString() };
              return found;
            }
            return o;
          });
          if (!found) return sendJson(res, 404, { success: false, error: 'Order not found' });
          writeOrders(updated);
          return sendJson(res, 200, { success: true, order: found });
        }

        // DELETE /api/orders/:id
        if (pathname.startsWith('/api/orders/') && req.method === 'DELETE') {
          const orderId = pathname.replace('/api/orders/', '').trim();
          const orders = readJson(ORDERS_FILE, []);
          const filtered = orders.filter((o) => {
            const matchId = String(o.id || '').toLowerCase() === String(orderId).toLowerCase();
            const matchOrderId = String(o.order_id || o.orderId || '').toLowerCase() === String(orderId).toLowerCase();
            return !matchId && !matchOrderId;
          });
          writeOrders(filtered);
          return sendJson(res, 200, { success: true, total: filtered.length });
        }

        // GET /api/products
        if (pathname === '/api/products' && req.method === 'GET') {
          const cat = readJson(CATALOG_FILE, { products: [] });
          return sendJson(res, 200, { success: true, products: cat.products || [] });
        }

        // POST /api/products
        if (pathname === '/api/products' && req.method === 'POST') {
          const prod = await parseBody(req);
          const cat = readJson(CATALOG_FILE, { products: [], categories: [] });
          const list = cat.products || [];
          const id = prod.id || `prod_${Date.now()}`;
          prod.id = id;
          const filtered = list.filter((p) => p.id !== id);
          cat.products = [prod, ...filtered];
          fs.writeFileSync(CATALOG_FILE, JSON.stringify(cat, null, 2), 'utf-8');
          return sendJson(res, 201, { success: true, product: prod });
        }

        // POST /api/sync-data (Legacy compatibility)
        if (pathname === '/api/sync-data' && req.method === 'POST') {
          const data = await parseBody(req);
          if (data.catalog) {
            fs.writeFileSync(CATALOG_FILE, JSON.stringify(data.catalog, null, 2), 'utf-8');
          }
          if (data.orders) {
            let finalOrders = data.orders;
            if (!data.replaceAll) {
              const existing = readJson(ORDERS_FILE, []);
              const map = new Map();
              existing.forEach((o) => {
                const k = o.id || o.order_id || o.orderId;
                if (k) map.set(String(k), o);
              });
              data.orders.forEach((o) => {
                const k = o.id || o.order_id || o.orderId;
                if (k) {
                  const prev = map.get(String(k));
                  map.set(String(k), { ...prev, ...o });
                }
              });
              finalOrders = Array.from(map.values());
            }
            writeOrders(finalOrders);
          }
          return sendJson(res, 200, { success: true });
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), isaiApiPlugin()],
});
