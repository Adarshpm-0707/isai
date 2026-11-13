import { supabase } from '../lib/supabaseClient';
import { compressImage } from '../utils/imageCompressor';

const PRODUCTS_STORAGE_KEY = 'isai_tarang_products';
const DELETED_PRODUCTS_KEY = 'isai_deleted_product_ids';

function getDeletedProductIds() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PRODUCTS_KEY) : null;
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validIds = (Array.isArray(parsed) ? parsed : []).filter(id => uuidRegex.test(String(id)));
    if (validIds.length !== (Array.isArray(parsed) ? parsed.length : 0) && typeof localStorage !== 'undefined') {
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(validIds));
    }
    return new Set(validIds.map(id => String(id).toLowerCase().trim()));
  } catch {
    return new Set();
  }
}

function saveDeletedProductId(id) {
  try {
    if (!id) return;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PRODUCTS_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];
    const str = String(id).toLowerCase().trim();
    if (!list.includes(str)) list.push(str);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(list));
  } catch {}
}

function unmarkDeletedProduct(id = null, name = null, slug = null) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PRODUCTS_KEY) : null;
    if (!raw) return;
    const list = JSON.parse(raw);
    const keysToRemove = new Set([
      id ? String(id).toLowerCase().trim() : '',
      name ? String(name).toLowerCase().trim() : '',
      slug ? String(slug).toLowerCase().trim() : '',
    ].filter(Boolean));
    const updated = list.filter((item) => !keysToRemove.has(String(item).toLowerCase().trim()));
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(updated));
  } catch {}
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function withTimeout(promise, ms = 5000) {
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

    if (id && deleted.has(id)) return false;
    if (rawId && deleted.has(rawId)) return false;
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
    return cleanDemoProducts(list);
  } catch {
    return [];
  }
}

function saveLocalProducts(prods) {
  const cleaned = cleanDemoProducts(prods);
  try {
    if (typeof localStorage !== 'undefined') {
      const prev = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      const next = JSON.stringify(cleaned);
      if (prev === next) {
        return; // Data has not changed; prevent infinite dispatch and re-render loops
      }
      localStorage.setItem(PRODUCTS_STORAGE_KEY, next);
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
    // 1. Fetch live products directly from Supabase
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

      const { data, count, error } = await withTimeout(query, 5000);
      if (!error && Array.isArray(data)) {
        // Direct database data from Supabase - authoritative single source of truth
        saveLocalProducts(data);

        const filtered = filterAndSortProducts(data, {
          category,
          search,
          minPrice,
          maxPrice,
          sortBy,
        });

        const paginated = filtered.slice(from, to + 1);
        return {
          products: paginated,
          total: filtered.length,
          page,
          totalPages: Math.ceil(filtered.length / limit) || 1,
        };
      }
    } catch (e) {
      console.warn('Supabase products fetch notice:', e?.message);
    }

    // 2. Offline fallback to local storage
    const local = getLocalProducts();
    const localFiltered = filterAndSortProducts(local, {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
    });

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
    try {
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').eq('slug', slug).maybeSingle(),
        4000
      );
      if (!error && data) return data;
    } catch {}

    const local = getLocalProducts();
    return local.find((p) => p.slug === slug) || null;
  },

  async getProductById(id) {
    if (!id) return null;
    try {
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        4000
      );
      if (!error && data) return data;
    } catch {}

    const local = getLocalProducts();
    return (
      local.find(
        (p) => p.id === id || String(p.id) === String(id) || p.slug === id
      ) || null
    );
  },

  async createProduct(productData) {
    const id = generateUUID();
    const slug =
      (productData.name || 'saree')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString(36)}`;

    unmarkDeletedProduct(id, productData.name, slug);

    const newProd = {
      ...productData,
      id,
      slug,
      created_at: new Date().toISOString(),
    };

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

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (newProd.category_id && uuidRegex.test(newProd.category_id)) {
      payload.category_id = newProd.category_id;
    } else {
      payload.category_id = null;
    }

    // 1. Save directly into Supabase database
    try {
      const { data, error } = await withTimeout(
        supabase.from('products').insert(payload).select().maybeSingle(),
        5000
      );
      if (!error && data) {
        Object.assign(newProd, data);
      } else if (error) {
        console.warn('Supabase product insert notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase product insert timeout:', err.message);
    }

    // 2. Commit to persistent local storage so UI updates instantly
    const local = getLocalProducts();
    const updated = [newProd, ...local.filter((p) => p.id !== newProd.id)];
    saveLocalProducts(updated);

    return newProd;
  },

  async updateProduct(id, updates) {
    const payload = { ...updates };
    delete payload.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (payload.category_id && !uuidRegex.test(payload.category_id)) {
      payload.category_id = null;
    }

    try {
      await withTimeout(
        supabase.from('products').update(payload).eq('id', id).select().maybeSingle(),
        5000
      );
    } catch (err) {
      console.warn('Supabase product update notice:', err.message);
    }

    const local = getLocalProducts();
    const updated = local.map((p) => {
      if (p.id === id || String(p.id) === String(id)) {
        return { ...p, ...updates, updated_at: new Date().toISOString() };
      }
      return p;
    });
    saveLocalProducts(updated);

    return { id, ...updates };
  },

  async deleteProduct(idOrProduct) {
    const id = typeof idOrProduct === 'object' ? idOrProduct?.id : idOrProduct;
    const local = getLocalProducts();
    const target =
      local.find((p) => p.id === id || String(p.id) === String(id)) ||
      (typeof idOrProduct === 'object' ? idOrProduct : null);

    saveDeletedProductId(id);

    try {
      await withTimeout(supabase.from('products').delete().eq('id', id), 5000);
    } catch (err) {
      console.warn('Supabase product delete notice:', err.message);
    }

    const updated = local.filter((p) => {
      if (p.id === id || String(p.id) === String(id)) return false;
      if (target?.slug && p.slug === target.slug) return false;
      if (target?.name && p.name && p.name.toLowerCase().trim() === target.name.toLowerCase().trim()) return false;
      return true;
    });

    saveLocalProducts(updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:products_updated', { detail: updated }));
    }

    return true;
  },

  async deductStockForItems(items) {
    if (!Array.isArray(items) || items.length === 0) return [];
    const products = getLocalProducts();
    const updatedProducts = [...products];
    const affected = [];

    items.forEach((item) => {
      if (!item) return;
      const targetId = item.product_id || item.productId || item.product?.id || item.id;
      const targetSlug = item.slug || item.product?.slug;
      const targetName = (item.name || item.product?.name || '').toLowerCase().trim();
      const deductQty = Math.max(1, Number(item.quantity || item.qty || item.count || 1));

      const product = updatedProducts.find((p) => {
        if (!p) return false;
        if (targetId && (p.id === targetId || String(p.id).toLowerCase() === String(targetId).toLowerCase() || p.slug === targetId)) {
          return true;
        }
        if (targetSlug && p.slug && String(p.slug).toLowerCase() === String(targetSlug).toLowerCase()) {
          return true;
        }
        if (targetName && p.name && p.name.toLowerCase().trim() === targetName) {
          return true;
        }
        return false;
      });

      if (product) {
        const currentStock = Math.max(0, Number(product.stock) || 0);
        const newStock = Math.max(0, currentStock - deductQty);
        product.stock = newStock;
        product.updated_at = new Date().toISOString();
        affected.push({ id: product.id, name: product.name, oldStock: currentStock, newStock, deductQty });
      }
    });

    if (affected.length > 0) {
      saveLocalProducts(updatedProducts);

      // Background cloud update to Supabase
      (async () => {
        for (const aff of affected) {
          try {
            await withTimeout(
              supabase.from('products').update({ stock: aff.newStock }).eq('id', aff.id),
              2000
            );
          } catch (err) {
            console.warn('Cloud stock deduct notice:', err?.message);
          }
        }
      })();
    }

    return affected;
  },

  async restoreStockForItems(items) {
    if (!Array.isArray(items) || items.length === 0) return [];
    const products = getLocalProducts();
    const updatedProducts = [...products];
    const affected = [];

    items.forEach((item) => {
      if (!item) return;
      const targetId = item.product_id || item.productId || item.product?.id || item.id;
      const targetSlug = item.slug || item.product?.slug;
      const targetName = (item.name || item.product?.name || '').toLowerCase().trim();
      const restoreQty = Math.max(1, Number(item.quantity || item.qty || item.count || 1));

      const product = updatedProducts.find((p) => {
        if (!p) return false;
        if (targetId && (p.id === targetId || String(p.id).toLowerCase() === String(targetId).toLowerCase() || p.slug === targetId)) {
          return true;
        }
        if (targetSlug && p.slug && String(p.slug).toLowerCase() === String(targetSlug).toLowerCase()) {
          return true;
        }
        if (targetName && p.name && p.name.toLowerCase().trim() === targetName) {
          return true;
        }
        return false;
      });

      if (product) {
        const currentStock = Math.max(0, Number(product.stock) || 0);
        const newStock = currentStock + restoreQty;
        product.stock = newStock;
        product.updated_at = new Date().toISOString();
        affected.push({ id: product.id, name: product.name, oldStock: currentStock, newStock, restoreQty });
      }
    });

    if (affected.length > 0) {
      saveLocalProducts(updatedProducts);

      (async () => {
        for (const aff of affected) {
          try {
            await withTimeout(
              supabase.from('products').update({ stock: aff.newStock }).eq('id', aff.id),
              2000
            );
          } catch (err) {
            console.warn('Cloud stock restore notice:', err?.message);
          }
        }
      })();
    }

    return affected;
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
        5000
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
