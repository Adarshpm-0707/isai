import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function localCatalogSyncPlugin() {
  return {
    name: 'local-catalog-sync',
    configureServer(server) {
      server.middlewares.use('/api/sync-catalog', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              const { products = [], categories = [] } = payload;
              const catalogData = {
                products,
                categories,
                lastSynced: new Date().toISOString(),
              };

              const srcDataDir = path.resolve(__dirname, 'src/data');
              if (!fs.existsSync(srcDataDir)) {
                fs.mkdirSync(srcDataDir, { recursive: true });
              }
              fs.writeFileSync(
                path.join(srcDataDir, 'catalog.json'),
                JSON.stringify(catalogData, null, 2),
                'utf-8'
              );

              const publicDataDir = path.resolve(__dirname, 'public/data');
              if (!fs.existsSync(publicDataDir)) {
                fs.mkdirSync(publicDataDir, { recursive: true });
              }
              fs.writeFileSync(
                path.join(publicDataDir, 'catalog.json'),
                JSON.stringify(catalogData, null, 2),
                'utf-8'
              );

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  message: 'Catalog saved to repository codebase!',
                  productsCount: products.length,
                  categoriesCount: categories.length,
                  timestamp: catalogData.lastSynced,
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          try {
            const filePath = path.resolve(__dirname, 'src/data/catalog.json');
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(content);
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ products: [], categories: [] }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localCatalogSyncPlugin()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/src/data/catalog.json', '**/public/data/catalog.json'],
    },
  },
});
