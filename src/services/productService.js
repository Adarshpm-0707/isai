import { supabase } from '../lib/supabaseClient';
import { compressImage } from '../utils/imageCompressor';
import bundledCatalog from '../data/catalog.json';

const PRODUCTS_STORAGE_KEY = 'isai_tarang_products';
const DELETED_PRODUCTS_KEY = 'isai_deleted_product_ids';

// Identifiers of previous demo sarees to purge from existing storage
const DEMO_PRODUCT_IDS = new Set([
  'prod-kanchi-01',
  'prod-banarasi-02',
  'prod-kasavu-03',
  'prod-chanderi-04',
  'prod-tussar-05',
  'prod-organza-06',
  'prod-softsilk-07',
  'prod-cotton-08',
]);

function getDeletedProductIds() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PRODUCTS_KEY) : null;
    return new Set(raw ? JSON.parse(raw).map(id => String(id).toLowerCase().trim()) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedProductId(id, slug = null, name = null) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PRODUCTS_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];
    const addIfNew = (val) => {
      if (!val) return;
      const str = String(val).toLowerCase().trim();
      if (!list.includes(str)) list.push(str);
      if (!list.includes(String(val))) list.push(String(val));
    };
    addIfNew(id);
    addIfNew(slug);
    addIfNew(name);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(list));
  } catch {}
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback below
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function withTimeout(promise, ms = 1000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function cleanDemoProducts(list) {
  if (!Array.isArray(list)) return [];
  const deleted = getDeletedProductIds();
  return list.filter((p) => {
    if (!p) return false;
    const id = p.id ? String(p.id).toLowerCase().trim() : '';
    const rawId = p.id ? String(p.id) : '';
    const slug = p.slug ? String(p.slug).toLowerCase().trim() : '';
    const name = p.name ? String(p.name).toLowerCase().trim() : '';

    if (DEMO_PRODUCT_IDS.has(rawId) || DEMO_PRODUCT_IDS.has(id)) return false;
    if (id && deleted.has(id)) return false;
    if (rawId && deleted.has(rawId)) return false;
    if (slug && deleted.has(slug)) return false;
    if (name && deleted.has(name)) return false;
    return true;
  });
}

function getLocalProducts() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PRODUCTS_STORAGE_KEY) : null;
    let list = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }

    // Merge bundled catalog from codebase so localhost additions deploy to Vercel and Netlify
    const bundled = Array.isArray(bundledCatalog?.products) ? bundledCatalog.products : [];
    if (bundled.length > 0) {
      const map = new Map();
      bundled.forEach((p) => {
        if (p && p.id) map.set(p.id, p);
      });
      list.forEach((p) => {
        if (p && p.id) {
          const existing = map.get(p.id);
          map.set(p.id, { ...existing, ...p });
        }
      });
      list = Array.from(map.values());
    }

    const cleaned = cleanDemoProducts(list);
    return cleaned;
  } catch {
    return cleanDemoProducts(bundledCatalog?.products || []);
  }
}

function saveLocalProducts(prods) {
  const cleaned = cleanDemoProducts(prods);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(cleaned));
    }
  } catch (err) {
    console.warn('LocalStorage products quota notice:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('isai:products_updated', { detail: cleaned }));
  }
}

function filterAndSortProducts(
  allProds = [],
  {
    category = null,
    search = '',
    minPrice = null,
    maxPrice = null,
    sortBy = 'newest',
  } = {}
) {
  let prods = [...(allProds || [])];

  if (category && category !== 'All') {
    prods = prods.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    prods = prods.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (minPrice !== null && minPrice !== '') {
    prods = prods.filter((p) => Number(p.price || 0) >= Number(minPrice));
  }

  if (maxPrice !== null && maxPrice !== '') {
    prods = prods.filter((p) => Number(p.price || 0) <= Number(maxPrice));
  }

  prods.sort((a, b) => {
    if (sortBy === 'price-asc' || sortBy === 'price-low-high') {
      return Number(a.price || 0) - Number(b.price || 0);
    }
    if (sortBy === 'price-desc' || sortBy === 'price-high-low') {
      return Number(b.price || 0) - Number(a.price || 0);
    }
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  return prods;
}

export const productService = {
  getLocalProducts() {
    return getLocalProducts();
  },

  filterAndSortProducts(prods, filters) {
    return filterAndSortProducts(prods, filters);
  },

  async getProducts({
    category = null,
    search = '',
    minPrice = null,
    maxPrice = null,
    sortBy = 'newest',
    page = 1,
    limit = 100,
  } = {}) {
    const local = getLocalProducts();
    const localFiltered = filterAndSortProducts(local, {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
    });

    // Background sync with Supabase (strict 1s timeout to keep app instant)
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      if (search && search.trim() !== '') {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      if (minPrice !== null && minPrice !== '') {
        query = query.gte('price', Number(minPrice));
      }

      if (maxPrice !== null && maxPrice !== '') {
        query = query.lte('price', Number(maxPrice));
      }

      switch (sortBy) {
        case 'price-asc':
        case 'price-low-high':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
        case 'price-high-low':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await withTimeout(query, 1000);
      if (!error && Array.isArray(data)) {
        // Sync cloud items to local
        const cleanedCloud = cleanDemoProducts(data);
        const map = new Map();
        local.forEach((p) => map.set(p.id, p));
        cleanedCloud.forEach((p) => map.set(p.id, p));
        const merged = Array.from(map.values());
        saveLocalProducts(merged);

        const paginatedCloud = cleanedCloud.slice(0, limit);
        return {
          products: paginatedCloud,
          total: typeof count === 'number' ? count : paginatedCloud.length,
          page,
          totalPages: Math.ceil((count || paginatedCloud.length) / limit) || 1,
        };
      }
    } catch {
      // Offline or network timeout, fall through to instant local products
    }

    const paginated = localFiltered.slice((page - 1) * limit, page * limit);
    return {
      products: paginated,
      total: localFiltered.length,
      page,
      totalPages: Math.ceil(localFiltered.length / limit) || 1,
    };
  },

  async getProductBySlug(slug) {
    if (!slug) return null;
    const local = getLocalProducts();
    const found = local.find((p) => p.slug === slug);
    if (found) return found;

    try {
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').eq('slug', slug).maybeSingle(),
        1000
      );
      if (!error && data) return data;
    } catch {
      // ignore
    }

    return null;
  },

  async getProductById(id) {
    if (!id) return null;
    const local = getLocalProducts();
    const found = local.find(
      (p) => p.id === id || String(p.id) === String(id) || p.slug === id
    );
    if (found) return found;

    try {
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        1000
      );
      if (!error && data) return data;
    } catch {
      // ignore
    }

    return null;
  },

  async createProduct(productData) {
    const id = generateUUID();
    const slug =
      (productData.name || 'saree')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString(36)}`;

    const newProd = {
      ...productData,
      id,
      slug,
      created_at: new Date().toISOString(),
    };

    // 1. Immediately commit to local persistent store so UI is 100% responsive
    const local = getLocalProducts();
    const updated = [newProd, ...local];
    saveLocalProducts(updated);

    // 2. Asynchronously attempt cloud sync without blocking
    (async () => {
      try {
        const payload = {
          id: newProd.id,
          name: newProd.name,
          slug: newProd.slug,
          description: newProd.description || null,
          price: Number(newProd.price || 0),
          discount_price: newProd.discount_price ? Number(newProd.discount_price) : null,
          stock: Number(newProd.stock || 0),
          category: newProd.category || null,
          images: Array.isArray(newProd.images) ? newProd.images : null,
          cost: Number(newProd.cost || 0),
          created_at: newProd.created_at,
        };

        // Only pass category_id if it is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (newProd.category_id && uuidRegex.test(newProd.category_id)) {
          payload.category_id = newProd.category_id;
        }

        const { data, error } = await withTimeout(
          supabase.from('products').insert(payload).select().maybeSingle(),
          1500
        );

        if (!error && data) {
          const currentLocal = getLocalProducts();
          const synced = currentLocal.map((p) => (p.id === newProd.id ? { ...p, ...data } : p));
          saveLocalProducts(synced);
        }
      } catch (err) {
        console.warn('Background product cloud sync notice:', err.message);
      }
    })();

    return newProd;
  },

  async updateProduct(id, updates) {
    const local = getLocalProducts();
    const updated = local.map((p) => {
      if (p.id === id || String(p.id) === String(id)) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    });
    saveLocalProducts(updated);

    (async () => {
      try {
        const payload = { ...updates };
        delete payload.id;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (payload.category_id && !uuidRegex.test(payload.category_id)) {
          delete payload.category_id;
        }

        await withTimeout(
          supabase.from('products').update(payload).eq('id', id).select().maybeSingle(),
          1500
        );
      } catch (err) {
        console.warn('Background product update cloud notice:', err.message);
      }
    })();

    return { id, ...updates };
  },

  async deleteProduct(idOrProduct) {
    const id = typeof idOrProduct === 'object' ? idOrProduct?.id : idOrProduct;
    const local = getLocalProducts();
    const target =
      local.find((p) => p.id === id || String(p.id) === String(id)) ||
      (typeof idOrProduct === 'object' ? idOrProduct : null);

    saveDeletedProductId(id, target?.slug, target?.name);

    const updated = local.filter((p) => {
      if (p.id === id || String(p.id) === String(id)) return false;
      if (target?.slug && p.slug === target.slug) return false;
      if (target?.name && p.name && p.name.toLowerCase().trim() === target.name.toLowerCase().trim()) return false;
      return true;
    });

    saveLocalProducts(updated);

    try {
      withTimeout(supabase.from('products').delete().eq('id', id), 800).catch(() => {});
    } catch (err) {
      console.warn('Background product delete cloud notice:', err.message);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:products_updated', { detail: updated }));
    }

    return true;
  },

  async uploadProductImage(file) {
    if (!file) return '';

    // First compress client-side to ensure lightweight web image (< 60 KB)
    const compressedDataUrl = await compressImage(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.75,
    });

    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await withTimeout(
        supabase.storage.from('products').upload(filePath, file),
        1500
      );

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch {
      // Cloud storage offline or timeout, use instant compressed data URL
    }

    return compressedDataUrl;
  },
};
