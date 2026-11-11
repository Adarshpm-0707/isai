import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function dataSyncPlugin() {
  return {
    name: 'isai-data-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/sync-data', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.catalog) {
                const catalogPath = path.resolve(__dirname, 'src/data/catalog.json');
                fs.writeFileSync(catalogPath, JSON.stringify(data.catalog, null, 2), 'utf-8');
              }
              if (data.orders) {
                const ordersPath = path.resolve(__dirname, 'src/data/orders.json');
                const publicOrdersPath = path.resolve(__dirname, 'public/data/orders.json');
                let finalOrders = data.orders;

                if (!data.replaceAll) {
                  let existingOrders = [];
                  try {
                    existingOrders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
                  } catch {}
                  const map = new Map();
                  if (Array.isArray(existingOrders)) {
                    existingOrders.forEach((o) => {
                      const key = o.id || o.order_id || o.orderId;
                      if (key) map.set(String(key), o);
                    });
                  }
                  if (Array.isArray(data.orders)) {
                    data.orders.forEach((o) => {
                      const key = o.id || o.order_id || o.orderId;
                      if (key) {
                        const existing = map.get(String(key));
                        map.set(String(key), { ...existing, ...o });
                      }
                    });
                  }
                  finalOrders = Array.from(map.values());
                }

                fs.writeFileSync(ordersPath, JSON.stringify(finalOrders, null, 2), 'utf-8');
                try {
                  fs.writeFileSync(publicOrdersPath, JSON.stringify(finalOrders, null, 2), 'utf-8');
                } catch {}
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dataSyncPlugin()],
});
