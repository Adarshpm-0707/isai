import { supabase } from '../lib/supabaseClient';

const PRODUCTS_STORAGE_KEY = 'isai_tarang_products';

// Helper for fast network timeout (prevents 20-30s browser hang when DNS/network is slow)
function withTimeout(promise, ms = 1200) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function getLocalProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProducts(prods) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(prods));
    window.dispatchEvent(new CustomEvent('isai:products_updated', { detail: prods }));
  } catch (err) {
    console.warn('LocalStorage products write notice:', err);
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

    // Try cloud sync with a strict 1.2s timeout so the UI never waits
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

      const { data, count, error } = await withTimeout(query, 1200);
      if (!error && Array.isArray(data)) {
        // Merge fresh cloud data into local persistent store
        const map = new Map();
        local.forEach((p) => map.set(p.id, p));
        data.forEach((p) => map.set(p.id, p));
        saveLocalProducts(Array.from(map.values()));

        return {
          products: data,
          total: typeof count === 'number' ? count : data.length,
          page,
          totalPages: Math.ceil((count || data.length) / limit) || 1,
        };
      }
    } catch (err) {
      // Gracefully falls back to local products immediately
      console.warn('Fast product sync note (using instant local store):', err.message);
    }

    // Return instant local filtered products
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
        1200
      );
      if (!error && data) return data;
    } catch (err) {
      console.warn('getProductBySlug notice:', err.message);
    }

    return null;
  },

  async getProductById(id) {
    if (!id) return null;

    // Fast instant check from local store (0 ms)
    const local = getLocalProducts();
    const found = local.find(
      (p) => p.id === id || String(p.id) === String(id) || p.slug === id
    );
    if (found) return found;

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      let query = supabase.from('products').select('*');
      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }
      const { data, error } = await withTimeout(query.maybeSingle(), 1200);
      if (!error && data) return data;
    } catch (err) {
      console.warn('getProductById notice:', err.message);
    }

    return null;
  },

  async createProduct(productData) {
    const baseSlug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug =
      productData.slug || `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const newProd = {
      ...productData,
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug,
      created_at: new Date().toISOString(),
    };

    const local = getLocalProducts();
    const updated = [newProd, ...local];
    saveLocalProducts(updated);

    try {
      const { data, error } = await withTimeout(
        supabase.from('products').insert(newProd).select().maybeSingle(),
        1500
      );

      if (!error && data) {
        const synced = updated.map((p) => (p.id === newProd.id ? data : p));
        saveLocalProducts(synced);
        return data;
      }
    } catch (err) {
      console.warn('Supabase product create notice (persisted locally):', err.message);
    }

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

    try {
      const { data, error } = await withTimeout(
        supabase.from('products').update(updates).eq('id', id).select().maybeSingle(),
        1500
      );

      if (!error && data) {
        const synced = updated.map((p) => (p.id === id ? data : p));
        saveLocalProducts(synced);
        return data;
      }
    } catch (err) {
      console.warn('Supabase product update notice (persisted locally):', err.message);
    }

    return { id, ...updates };
  },

  async deleteProduct(id) {
    const local = getLocalProducts();
    const updated = local.filter((p) => p.id !== id && String(p.id) !== String(id));
    saveLocalProducts(updated);

    try {
      await withTimeout(supabase.from('products').delete().eq('id', id), 1500);
    } catch (err) {
      console.warn('Supabase product delete notice (persisted locally):', err.message);
    }

    return true;
  },

  async uploadProductImage(file) {
    if (!file) return '';

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await withTimeout(
        supabase.storage.from('products').upload(filePath, file),
        2000
      );

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload notice (using instant local file reader):', err.message);
    }

    // High quality instant local data URL fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  },
};
