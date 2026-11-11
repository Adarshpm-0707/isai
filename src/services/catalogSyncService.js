/**
 * Catalog Sync Service
 * Bridges local development on http://localhost:5173/ with deployment on Vercel and Netlify.
 * 
 * When running on localhost:
 * - Automatically saves products and categories to src/data/catalog.json and public/data/catalog.json.
 * - When committed and pushed to git, Netlify and Vercel will bundle and display the exact same catalog.
 * - Provides manual 1-click "Publish to Codebase", "Export JSON", and "Import JSON" options.
 */

const PRODUCTS_STORAGE_KEY = 'isai_tarang_products';
const CATEGORIES_STORAGE_KEY = 'isai_tarang_categories';

function isLocalhost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
}

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let syncTimeout = null;

export const catalogSyncService = {
  isLocalhost() {
    return isLocalhost();
  },

  async pushLocalhostToCodebase() {
    const products = getStoredProducts();
    const categories = getStoredCategories();

    try {
      const res = await fetch('/api/sync-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products,
          categories,
        }),
      });

      if (!res.ok) {
        throw new Error(`Sync failed with status ${res.status}`);
      }

      const result = await res.json();
      return {
        success: true,
        productsCount: products.length,
        categoriesCount: categories.length,
        message: result.message || 'Catalog synced to codebase!',
      };
    } catch (err) {
      console.warn('Notice syncing catalog to codebase:', err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  },

  scheduleAutoSync() {
    if (!isLocalhost()) return;
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      this.pushLocalhostToCodebase().catch(() => {});
    }, 600);
  },

  exportCatalogAsJsonFile() {
    const products = getStoredProducts();
    const categories = getStoredCategories();
    const exportData = {
      store: 'Isai Tarang Handloom Silks',
      exportedAt: new Date().toISOString(),
      products,
      categories,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isai_tarang_catalog_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async importCatalogFromJsonFile(file) {
    if (!file) throw new Error('No file provided');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const products = Array.isArray(parsed.products) ? parsed.products : [];
          const categories = Array.isArray(parsed.categories) ? parsed.categories : [];

          if (products.length > 0) {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
            window.dispatchEvent(
              new CustomEvent('isai:products_updated', { detail: products })
            );
          }

          if (categories.length > 0) {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
            window.dispatchEvent(
              new CustomEvent('isai:categories_updated', { detail: categories })
            );
          }

          // If on localhost, push imported items to the codebase immediately
          if (isLocalhost()) {
            await this.pushLocalhostToCodebase();
          }

          resolve({
            success: true,
            productsCount: products.length,
            categoriesCount: categories.length,
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  initAutoSync() {
    if (typeof window === 'undefined') return;

    // Listen to updates from anywhere in the application
    window.addEventListener('isai:products_updated', () => {
      this.scheduleAutoSync();
    });

    window.addEventListener('isai:categories_updated', () => {
      this.scheduleAutoSync();
    });

    // On initial app load on localhost, perform a quiet initial sync
    if (isLocalhost()) {
      setTimeout(() => {
        const prods = getStoredProducts();
        const cats = getStoredCategories();
        if (prods.length > 0 || cats.length > 0) {
          this.pushLocalhostToCodebase().catch(() => {});
        }
      }, 1500);
    }
  },
};
