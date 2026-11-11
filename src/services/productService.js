import { supabase } from '../lib/supabaseClient';

const PRODUCTS_STORAGE_KEY = 'isai_tarang_products';

// Comprehensive master catalog of authentic handloom sarees
export const SEED_PRODUCTS = [
  {
    id: 'prod-kanchi-01',
    name: 'Royal Crimson Kanchipuram Pure Zari Silk Saree',
    slug: 'royal-crimson-kanchipuram-pure-zari-silk-saree',
    category: 'Kanchipuram',
    category_id: 'cat-kanchi-01',
    price: 18500,
    discount_price: 15999,
    cost: 11200,
    stock: 12,
    badge: 'Bestseller',
    rating: 4.9,
    review_count: 142,
    reviewsCount: 142,
    description: 'Handwoven with pure mulberry silk and authentic 2G silver gold electroplated zari temple border motifs by master weavers of Kanchipuram.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1610030469668-93510cb67655?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-10T14:00:00Z',
  },
  {
    id: 'prod-banarasi-02',
    name: 'Midnight Emerald Banarasi Katan Silk Saree',
    slug: 'midnight-emerald-banarasi-katan-silk-saree',
    category: 'Banarasi',
    category_id: 'cat-banarasi-02',
    price: 16800,
    discount_price: 14499,
    cost: 9800,
    stock: 8,
    badge: 'Bridal Heritage',
    rating: 4.95,
    review_count: 89,
    reviewsCount: 89,
    description: 'Exquisite handloom Katan silk saree woven in Varanasi featuring intricate floral jaal motifs, kadwa weave, and heavy ceremonial pallu.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-09T16:30:00Z',
  },
  {
    id: 'prod-kasavu-03',
    name: 'Kuthampully Traditional Kasavu Tissue Silk Saree',
    slug: 'kuthampully-traditional-kasavu-tissue-silk-saree',
    category: 'Kasavu',
    category_id: 'cat-kasavu-03',
    price: 7500,
    discount_price: 6299,
    cost: 4100,
    stock: 18,
    badge: 'Authentic Handloom',
    rating: 4.88,
    review_count: 64,
    reviewsCount: 64,
    description: 'Direct from Kuthampully master weavers, woven with shimmering golden tissue weft, peacock motifs, and temple borders for sacred festivities.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-08T11:15:00Z',
  },
  {
    id: 'prod-chanderi-04',
    name: 'Pastel Peach Chanderi Pure Silk Drape',
    slug: 'pastel-peach-chanderi-pure-silk-drape',
    category: 'Chanderi',
    category_id: 'cat-chanderi-04',
    price: 9200,
    discount_price: 7999,
    cost: 5200,
    stock: 10,
    badge: 'New Arrival',
    rating: 4.85,
    review_count: 38,
    reviewsCount: 38,
    description: 'Featherlight silk cotton Chanderi saree adorned with hand-punched golden zari peacock buttis and a sheer gossamer texture.',
    images: [
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-07T18:00:00Z',
  },
  {
    id: 'prod-tussar-05',
    name: 'Raw Honey Handwoven Tussar Silk Saree',
    slug: 'raw-honey-handwoven-tussar-silk-saree',
    category: 'Tussar',
    category_id: 'cat-tussar-05',
    price: 11500,
    discount_price: 9899,
    cost: 6900,
    stock: 7,
    badge: 'Forest Raw Silk',
    rating: 4.92,
    review_count: 51,
    reviewsCount: 51,
    description: 'Organic wild forest Tussar silk offering rich earthen texture and hand-painted Madhubani floral motifs with antique dull gold borders.',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-06T12:20:00Z',
  },
  {
    id: 'prod-organza-06',
    name: 'Lavender Blossom Sheer Organza Silk Saree',
    slug: 'lavender-blossom-sheer-organza-silk-saree',
    category: 'Organza',
    category_id: 'cat-organza-06',
    price: 8800,
    discount_price: 7499,
    cost: 4800,
    stock: 15,
    badge: 'Festive Edition',
    rating: 4.86,
    review_count: 44,
    reviewsCount: 44,
    description: 'Modern royal pastel organza saree featuring delicate scalloped resham borders, subtle cutwork, and hand-embroidered botanical motifs.',
    images: [
      'https://images.unsplash.com/photo-1610030469668-93510cb67655?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-05T15:45:00Z',
  },
  {
    id: 'prod-softsilk-07',
    name: 'Vermillion Maroon Soft Silk Festive Saree',
    slug: 'vermillion-maroon-soft-silk-festive-saree',
    category: 'Soft Silk',
    category_id: 'cat-softsilk-07',
    price: 12900,
    discount_price: 10999,
    cost: 7500,
    stock: 9,
    badge: 'Trending',
    rating: 4.91,
    review_count: 76,
    reviewsCount: 76,
    description: 'Ultra-soft pure silk weave with contrasting antique gold pallu and temple border designed for comfortable, regal all-day drape.',
    images: [
      'https://images.unsplash.com/photo-1610030469884-3c767f70b749?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-04T13:10:00Z',
  },
  {
    id: 'prod-cotton-08',
    name: 'Ivory Gold Kerala Handloom Cotton Saree',
    slug: 'ivory-gold-kerala-handloom-cotton-saree',
    category: 'Pure Cotton',
    category_id: 'cat-cotton-08',
    price: 4500,
    discount_price: 3899,
    cost: 2100,
    stock: 22,
    badge: 'Daily Heritage',
    rating: 4.89,
    review_count: 98,
    reviewsCount: 98,
    description: 'Fine 100-count combed cotton handwoven by heritage weavers with a pure zari border for temple rituals and understated elegance.',
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=900',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900',
    ],
    created_at: '2026-11-03T17:30:00Z',
  },
];

// Helper for fast network timeout (prevents 20 to 30s browser hang when DNS/network is slow)
function withTimeout(promise, ms = 1200) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function getLocalProducts() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PRODUCTS_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge seed products with user additions so no admin products are lost
        const map = new Map();
        SEED_PRODUCTS.forEach((p) => map.set(p.id, p));
        parsed.forEach((p) => {
          if (p && p.id) {
            const existing = map.get(p.id);
            map.set(p.id, { ...existing, ...p });
          }
        });
        return Array.from(map.values());
      }
    }
    // Auto initialize persistent storage with master products
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
    }
    return SEED_PRODUCTS;
  } catch {
    return SEED_PRODUCTS;
  }
}

function saveLocalProducts(prods) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(prods));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:products_updated', { detail: prods }));
    }
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
      if (!error && Array.isArray(data) && data.length > 0) {
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
      console.warn('Fast product sync note (using persistent local store):', err.message);
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
      const { data, error } = await withTimeout(
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        1200
      );
      if (!error && data) return data;
    } catch (err) {
      console.warn('getProductById notice:', err.message);
    }

    return null;
  },

  async createProduct(productData) {
    const slug =
      (productData.name || 'saree')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString(36)}`;

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
