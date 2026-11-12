import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_DIR = path.resolve(__dirname, 'src/data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + disk persistence helpers
function readJsonFile(filePath, defaultVal = []) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return parsed;
    }
  } catch (err) {
    console.warn(`[Server] Error reading ${filePath}:`, err.message);
  }
  return defaultVal;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    // Also sync to public/dist copy if it exists so static bundles stay updated
    const baseName = path.basename(filePath);
    const publicPath = path.resolve(__dirname, 'public/data', baseName);
    const distPath = path.resolve(DIST_DIR, 'data', baseName);

    if (fs.existsSync(path.dirname(publicPath))) {
      try { fs.writeFileSync(publicPath, JSON.stringify(data, null, 2), 'utf-8'); } catch {}
    }
    if (fs.existsSync(path.dirname(distPath))) {
      try { fs.writeFileSync(distPath, JSON.stringify(data, null, 2), 'utf-8'); } catch {}
    }
    return true;
  } catch (err) {
    console.error(`[Server] Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) {
        // 20MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// MIME types lookup
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
};

// Set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

// Send JSON helper
function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Healthcheck endpoint
  if (pathname === '/api/health') {
    const orders = readJsonFile(ORDERS_FILE, []);
    return sendJson(res, 200, {
      status: 'ok',
      service: 'isai-tarang-unified-server',
      timestamp: new Date().toISOString(),
      ordersCount: Array.isArray(orders) ? orders.length : 0,
    });
  }

  // GET /api/orders
  if (pathname === '/api/orders' && req.method === 'GET') {
    const orders = readJsonFile(ORDERS_FILE, []);
    return sendJson(res, 200, {
      success: true,
      orders: Array.isArray(orders) ? orders : [],
      count: Array.isArray(orders) ? orders.length : 0,
    });
  }

  // POST /api/orders (Create or sync an order)
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const newOrder = await parseBody(req);
      if (!newOrder || (!newOrder.id && !newOrder.order_id && !newOrder.orderId)) {
        return sendJson(res, 400, { success: false, error: 'Valid order data is required.' });
      }

      const existingOrders = readJsonFile(ORDERS_FILE, []);
      const orderKey = newOrder.id || newOrder.order_id || newOrder.orderId;

      // Filter out duplicate if already exists
      const filtered = existingOrders.filter((o) => {
        const k = o.id || o.order_id || o.orderId;
        return String(k).toLowerCase() !== String(orderKey).toLowerCase();
      });

      // Prepend newest order to top
      const updatedOrders = [newOrder, ...filtered];
      writeJsonFile(ORDERS_FILE, updatedOrders);

      console.log(`[Server] Order #${orderKey} saved successfully. Total orders: ${updatedOrders.length}`);
      return sendJson(res, 201, {
        success: true,
        message: 'Order saved successfully',
        order: newOrder,
        totalOrders: updatedOrders.length,
      });
    } catch (err) {
      console.error('[Server] Error saving order:', err.message);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // PUT /api/orders/:id (Update order status or tracking)
  if (pathname.startsWith('/api/orders/') && req.method === 'PUT') {
    try {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const updates = await parseBody(req);

      const existingOrders = readJsonFile(ORDERS_FILE, []);
      let updatedOrder = null;

      const updatedOrders = existingOrders.map((o) => {
        const matchId = String(o.id || '').toLowerCase() === String(orderId).toLowerCase();
        const matchOrderId = String(o.order_id || o.orderId || '').toLowerCase() === String(orderId).toLowerCase();
        if (matchId || matchOrderId) {
          updatedOrder = { ...o, ...updates, updated_at: new Date().toISOString() };
          return updatedOrder;
        }
        return o;
      });

      if (!updatedOrder) {
        return sendJson(res, 404, { success: false, error: `Order #${orderId} not found` });
      }

      writeJsonFile(ORDERS_FILE, updatedOrders);
      return sendJson(res, 200, {
        success: true,
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // DELETE /api/orders/:id (Delete order)
  if (pathname.startsWith('/api/orders/') && req.method === 'DELETE') {
    try {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const existingOrders = readJsonFile(ORDERS_FILE, []);

      const filteredOrders = existingOrders.filter((o) => {
        const matchId = String(o.id || '').toLowerCase() === String(orderId).toLowerCase();
        const matchOrderId = String(o.order_id || o.orderId || '').toLowerCase() === String(orderId).toLowerCase();
        return !matchId && !matchOrderId;
      });

      writeJsonFile(ORDERS_FILE, filteredOrders);
      return sendJson(res, 200, {
        success: true,
        message: `Order #${orderId} deleted successfully`,
        totalOrders: filteredOrders.length,
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // GET /api/products
  if (pathname === '/api/products' && req.method === 'GET') {
    const catalog = readJsonFile(CATALOG_FILE, { products: [], categories: [] });
    const products = Array.isArray(catalog?.products) ? catalog.products : [];
    return sendJson(res, 200, {
      success: true,
      products,
      count: products.length,
    });
  }

  // POST /api/products (Save or update product)
  if (pathname === '/api/products' && req.method === 'POST') {
    try {
      const product = await parseBody(req);
      if (!product || !product.name) {
        return sendJson(res, 400, { success: false, error: 'Product name is required.' });
      }

      const catalog = readJsonFile(CATALOG_FILE, { products: [], categories: [] });
      const products = Array.isArray(catalog.products) ? catalog.products : [];
      const prodId = product.id || `prod_${Date.now()}`;
      product.id = prodId;

      const filtered = products.filter((p) => p.id !== prodId);
      const updatedProducts = [product, ...filtered];
      catalog.products = updatedProducts;

      writeJsonFile(CATALOG_FILE, catalog);
      return sendJson(res, 201, { success: true, product, totalProducts: updatedProducts.length });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // POST /api/sync-data (Universal sync for orders & catalog)
  if (pathname === '/api/sync-data' && req.method === 'POST') {
    try {
      const data = await parseBody(req);
      if (data.catalog) {
        writeJsonFile(CATALOG_FILE, data.catalog);
      }
      if (data.orders) {
        let finalOrders = data.orders;
        if (!data.replaceAll) {
          const existing = readJsonFile(ORDERS_FILE, []);
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
        writeJsonFile(ORDERS_FILE, finalOrders);
      }
      return sendJson(res, 200, { success: true, message: 'Data synced successfully' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // -------------------------------------------------------------
  // STATIC ASSETS & SINGLE PAGE APPLICATION (SPA) FALLBACK
  // -------------------------------------------------------------
  let filePath = path.join(DIST_DIR, pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  // Check if requested file exists in dist
  let exists = fs.existsSync(filePath);
  let isDirectory = exists && fs.statSync(filePath).isDirectory();

  if (isDirectory) {
    filePath = path.join(filePath, 'index.html');
    exists = fs.existsSync(filePath);
  }

  // If file doesn't exist, fallback to dist/index.html (React Router SPA)
  if (!exists) {
    filePath = path.join(DIST_DIR, 'index.html');
    exists = fs.existsSync(filePath);
  }

  if (exists) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Aggressive caching for hashed assets, no-cache for index.html
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (pathname.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Dist folder not built yet
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>Isai Tarang Server</title></head>
        <body style="font-family: sans-serif; background: #090B10; color: #F5E6BE; padding: 40px; text-align: center;">
          <h1 style="color: #D4AF37;">Isai Tarang Unified Server is Running</h1>
          <p>API endpoints are active at <code>/api/orders</code>, <code>/api/products</code>, <code>/api/health</code>.</p>
          <p>Please run <code>npm run build</code> to serve the full React application frontend.</p>
        </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ISAI TARANG UNIFIED SERVER RUNNING ON PORT ${PORT}`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  API Orders:  http://localhost:${PORT}/api/orders`);
  console.log(`  API Health:  http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

