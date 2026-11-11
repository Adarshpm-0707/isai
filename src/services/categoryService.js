import { supabase } from '../lib/supabaseClient';

const CATEGORIES_STORAGE_KEY = 'isai_tarang_categories';

// Comprehensive master seed categories for handloom sarees
export const SEED_CATEGORIES = [
  {
    id: 'cat-kanchi-01',
    name: 'Kanchipuram',
    slug: 'kanchipuram',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=900',
    description: 'Pure mulberry silk with royal gold zari temple borders.',
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: 'cat-banarasi-02',
    name: 'Banarasi',
    slug: 'banarasi',
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=900',
    description: 'Heritage Varanasi silk brocades and intricate floral jaal motifs.',
    created_at: '2026-11-02T10:00:00Z',
  },
  {
    id: 'cat-kasavu-03',
    name: 'Kasavu',
    slug: 'kasavu',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900',
    description: 'Traditional Kerala handloom with pure golden zari borders.',
    created_at: '2026-11-03T10:00:00Z',
  },
  {
    id: 'cat-chanderi-04',
    name: 'Chanderi',
    slug: 'chanderi',
    image_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=900',
    description: 'Featherlight sheer silk with delicate golden buttis.',
    created_at: '2026-11-04T10:00:00Z',
  },
  {
    id: 'cat-tussar-05',
    name: 'Tussar',
    slug: 'tussar',
    image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=900',
    description: 'Textured wild forest raw silk with rich earthy undertones.',
    created_at: '2026-11-05T10:00:00Z',
  },
  {
    id: 'cat-organza-06',
    name: 'Organza',
    slug: 'organza',
    image_url: 'https://images.unsplash.com/photo-1610030469668-93510cb67655?auto=format&fit=crop&q=80&w=900',
    description: 'Translucent pastel silk with delicate botanical embroidery.',
    created_at: '2026-11-06T10:00:00Z',
  },
  {
    id: 'cat-softsilk-07',
    name: 'Soft Silk',
    slug: 'soft-silk',
    image_url: 'https://images.unsplash.com/photo-1610030469884-3c767f70b749?auto=format&fit=crop&q=80&w=900',
    description: 'Smooth lightweight drapes with contrasting antique gold pallus.',
    created_at: '2026-11-07T10:00:00Z',
  },
  {
    id: 'cat-cotton-08',
    name: 'Pure Cotton',
    slug: 'pure-cotton',
    image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=900',
    description: 'Heritage handwoven Kerala cotton for comfortable daily elegance.',
    created_at: '2026-11-08T10:00:00Z',
  },
];

// Fast network timeout helper (prevents 20 to 30s browser hang)
function withTimeout(promise, ms = 1200) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function getLocalCategories() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(CATEGORIES_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge seed categories with user additions so no admin categories are lost
        const map = new Map();
        SEED_CATEGORIES.forEach((c) => {
          if (c && c.name) map.set(c.name.toLowerCase(), c);
        });
        parsed.forEach((c) => {
          if (c && c.name) {
            const key = c.name.toLowerCase();
            const existing = map.get(key);
            map.set(key, {
              ...existing,
              ...c,
              image_url: c.image_url || c.image || existing?.image_url || '',
            });
          }
        });
        return Array.from(map.values());
      }
    }
    // Auto initialize persistent storage with master categories
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(SEED_CATEGORIES));
    }
    return SEED_CATEGORIES;
  } catch {
    return SEED_CATEGORIES;
  }
}

function saveLocalCategories(cats) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:categories_updated', { detail: cats }));
    }
  } catch (err) {
    console.warn('LocalStorage categories write notice:', err);
  }
}

export const categoryService = {
  getLocalCategories() {
    return getLocalCategories();
  },

  async getCategories() {
    const local = getLocalCategories();

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true }),
        1200
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        const map = new Map();
        local.forEach((c) => {
          if (c && c.name) map.set(c.name.toLowerCase(), c);
        });
        data.forEach((c) => {
          if (c && c.name) {
            const existing = map.get(c.name.toLowerCase());
            map.set(c.name.toLowerCase(), {
              ...existing,
              ...c,
              image_url: c.image_url || c.image || existing?.image_url || existing?.image || '',
            });
          }
        });
        const merged = Array.from(map.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        saveLocalCategories(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Categories cloud sync note (using persistent local store):', err.message);
    }

    return local;
  },

  async createCategory({ name, slug, image_url, image }) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('Category name is required');

    const cleanSlug =
      (slug || cleanName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

    const cleanImg = image_url || image || '';

    const local = getLocalCategories();
    const existing = local.find(
      (c) =>
        c.name.toLowerCase() === cleanName.toLowerCase() ||
        c.slug.toLowerCase() === cleanSlug.toLowerCase()
    );

    if (existing) {
      if (cleanImg && !existing.image_url) {
        existing.image_url = cleanImg;
        saveLocalCategories(local);
      }
      return existing;
    }

    const newCategory = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      slug: cleanSlug,
      image_url: cleanImg,
      created_at: new Date().toISOString(),
    };

    const updated = [...local, newCategory].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    saveLocalCategories(updated);

    // Sync to Supabase in the background with timeout
    try {
      const payload = {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
      };
      if (cleanImg) {
        payload.image_url = cleanImg;
      }

      let res = await withTimeout(
        supabase.from('categories').insert(payload).select().maybeSingle(),
        1500
      );

      if (res && res.error && res.error.message?.includes('image_url')) {
        delete payload.image_url;
        res = await withTimeout(
          supabase.from('categories').insert(payload).select().maybeSingle(),
          1500
        );
      }

      if (res && !res.error && res.data) {
        const synced = updated.map((c) =>
          c.id === newCategory.id ? { ...res.data, image_url: cleanImg } : c
        );
        saveLocalCategories(synced);
        return { ...res.data, image_url: cleanImg };
      }
    } catch (err) {
      console.warn('Supabase category insert notice (persisted locally):', err.message);
    }

    return newCategory;
  },

  async updateCategory(id, { name, slug, image_url, image }) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('Category name is required');

    const cleanSlug =
      (slug || cleanName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `cat-${Date.now()}`;

    const cleanImg = image_url || image || '';

    const local = getLocalCategories();
    const updated = local.map((c) => {
      if (c.id === id || String(c.id) === String(id)) {
        return {
          ...c,
          name: cleanName,
          slug: cleanSlug,
          image_url: cleanImg || c.image_url || '',
          updated_at: new Date().toISOString(),
        };
      }
      return c;
    });

    saveLocalCategories(updated);

    try {
      const updates = {
        name: cleanName,
        slug: cleanSlug,
      };
      if (cleanImg) {
        updates.image_url = cleanImg;
      }

      let res = await withTimeout(
        supabase.from('categories').update(updates).eq('id', id).select().maybeSingle(),
        1500
      );

      if (res && res.error && res.error.message?.includes('image_url')) {
        delete updates.image_url;
        await withTimeout(
          supabase.from('categories').update(updates).eq('id', id),
          1500
        );
      }
    } catch (err) {
      console.warn('Supabase category update notice (persisted locally):', err.message);
    }

    return { id, name: cleanName, slug: cleanSlug, image_url: cleanImg };
  },

  async deleteCategory(id) {
    const local = getLocalCategories();
    const updated = local.filter(
      (c) => c.id !== id && String(c.id) !== String(id)
    );
    saveLocalCategories(updated);

    try {
      await withTimeout(supabase.from('categories').delete().eq('id', id), 1500);
    } catch (err) {
      console.warn('Supabase category delete notice (persisted locally):', err.message);
    }

    return true;
  },

  async uploadCategoryImage(file) {
    if (!file) return '';

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cat_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await withTimeout(
        supabase.storage.from('products').upload(filePath, file),
        2000
      );

      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage category upload notice (using instant local file reader):', err.message);
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  },
};
