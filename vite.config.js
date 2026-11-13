import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEmailConfig() {
  const envPath = path.resolve(__dirname, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        env[k] = v;
      }
    }
  }
  return {
    gmailUser: process.env.GMAIL_USER || env.GMAIL_USER || 'isaitarang9@gmail.com',
    gmailAppPassword:
      process.env.GMAIL_APP_PASSWORD ||
      env.GMAIL_APP_PASSWORD ||
      env.VITE_GMAIL_APP_PASSWORD ||
      process.env.SMTP_PASS ||
      env.SMTP_PASS ||
      '',
    resendApiKey:
      process.env.RESEND_API_KEY ||
      env.RESEND_API_KEY ||
      process.env.VITE_RESEND_API_KEY ||
      env.VITE_RESEND_API_KEY ||
      '',
  };
}

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

  const writeOrders = (_orders) => {
    // Disabled disk writes to prevent Vite HMR auto-refresh loops in the browser
    return true;
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

        // POST /api/send-order-email
        if (pathname === '/api/send-order-email' && req.method === 'POST') {
          const body = await parseBody(req);
          const { to, subject, html, type, order } = body;
          const { gmailUser, gmailAppPassword, resendApiKey } = getEmailConfig();

          console.log(`[DevServer API] Order Email (${type || 'notification'}) dispatch to ${to}: ${subject}`);

          // 1. Try Gmail SMTP with Nodemailer
          if (gmailAppPassword) {
            try {
              const cleanPass = String(gmailAppPassword).replace(/\s+/g, '');
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: gmailUser,
                  pass: cleanPass,
                },
              });

              const info = await transporter.sendMail({
                from: `"Isai Tarang Sarees" <${gmailUser}>`,
                to: to,
                subject: subject,
                html: html,
              });

              console.log(`[DevServer API] ✅ Gmail SMTP delivered to ${to} (MessageId: ${info.messageId})`);
              return sendJson(res, 200, {
                success: true,
                provider: 'gmail_smtp',
                messageId: info.messageId,
                recipient: to,
              });
            } catch (smtpErr) {
              console.error(`[DevServer API] ❌ Gmail SMTP error:`, smtpErr.message);
              return sendJson(res, 500, {
                success: false,
                provider: 'gmail_smtp',
                error: smtpErr.message,
              });
            }
          }

          // 2. Try Resend API
          if (resendApiKey) {
            try {
              const resendResp = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'Isai Tarang Sarees <onboarding@resend.dev>',
                  to: [to],
                  subject: subject,
                  html: html,
                }),
              });
              const resendData = await resendResp.json();
              if (resendData.error) {
                console.error(`[DevServer API] ❌ Resend error:`, resendData.error);
                return sendJson(res, 400, { success: false, provider: 'resend', error: resendData.error });
              }
              console.log(`[DevServer API] ✅ Resend delivered to ${to} (ID: ${resendData.id})`);
              return sendJson(res, 200, { success: true, provider: 'resend', data: resendData });
            } catch (resendErr) {
              console.error(`[DevServer API] ❌ Resend dispatch error:`, resendErr.message);
              return sendJson(res, 500, { success: false, provider: 'resend', error: resendErr.message });
            }
          }

          // 3. No credentials configured in .env
          console.warn(`[DevServer API] ⚠️ No email credentials in .env (GMAIL_APP_PASSWORD or RESEND_API_KEY). Real email was not delivered.`);
          return sendJson(res, 200, {
            success: false,
            simulated: true,
            warning: 'No email service credentials configured in .env. Please configure GMAIL_APP_PASSWORD or RESEND_API_KEY to send real emails.',
            recipient: to,
            orderId: order?.order_id || order?.id,
          });
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
          return sendJson(res, 201, { success: true, product: prod });
        }

        // POST /api/sync-data (Legacy compatibility)
        if (pathname === '/api/sync-data' && req.method === 'POST') {
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: [
        '**/src/data/**',
        '**/public/data/**',
        '**/*.json',
      ],
    },
  },
});
