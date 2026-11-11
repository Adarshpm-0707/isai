import { supabase } from '../lib/supabaseClient';
import { compressImage } from '../utils/imageCompressor';
import bundledCatalog from '../data/catalog.json';

const CATEGORIES_STORAGE_KEY = 'isai_tarang_categories';
const DELETED_CATEGORIES_KEY = 'isai_deleted_category_ids';

// Identifiers of previous demo categories to purge from storage
const DEMO_CATEGORY_IDS = new Set([
  'cat-kanchi-01',
  'cat-banarasi-02',
  'cat-kasavu-03',
  'cat-chanderi-04',
  'cat-tussar-05',
  'cat-organza-06',
  'cat-softsilk-07',
  'cat-cotton-08',
]);

function getDeletedCategoryIds() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CATEGORIES_KEY) : null;
    return new Set(raw ? JSON.parse(raw).map(id => String(id).toLowerCase().trim()) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedCategoryId(id, name = null, slug = null) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CATEGORIES_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];
    const addIfNew = (val) => {
      if (!val) return;
      const str = String(val).toLowerCase().trim();
      if (!list.includes(str)) list.push(str);
      if (!list.includes(String(val))) list.push(String(val));
    };
    addIfNew(id);
    addIfNew(name);
    addIfNew(slug);
    localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(list));
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

function cleanDemoCategories(list) {
  if (!Array.isArray(list)) return [];
  const deleted = getDeletedCategoryIds();
  return list.filter((c) => {
    if (!c) return false;
    const id = c.id ? String(c.id).toLowerCase().trim() : '';
    const rawId = c.id ? String(c.id) : '';
    const name = c.name ? String(c.name).toLowerCase().trim() : '';
    const slug = c.slug ? String(c.slug).toLowerCase().trim() : '';

    if (DEMO_CATEGORY_IDS.has(rawId) || DEMO_CATEGORY_IDS.has(id)) return false;
    if (id && deleted.has(id)) return false;
    if (rawId && deleted.has(rawId)) return false;
    if (name && deleted.has(name)) return false;
    if (slug && deleted.has(slug)) return false;
    return true;
  });
}

function getLocalCategories() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(CATEGORIES_STORAGE_KEY) : null;
    let list = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }

    // Merge bundled categories from codebase so localhost additions deploy to Vercel and Netlify
    const bundled = Array.isArray(bundledCatalog?.categories) ? bundledCatalog.categories : [];
    if (bundled.length > 0) {
      const map = new Map();
      bundled.forEach((c) => {
        if (c && c.name) map.set(c.name.toLowerCase(), c);
      });
      list.forEach((c) => {
        if (c && c.name) {
          const key = c.name.toLowerCase();
          const existing = map.get(key);
          map.set(key, { ...existing, ...c });
        }
      });
      list = Array.from(map.values());
    }

    const cleaned = cleanDemoCategories(list);
    return cleaned;
  } catch {
    return cleanDemoCategories(bundledCatalog?.categories || []);
  }
}

function saveLocalCategories(cats) {
  const cleaned = cleanDemoCategories(cats);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleaned));
    }
  } catch (err) {
    console.warn('LocalStorage categories quota notice:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('isai:categories_updated', { detail: cleaned }));
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
        1000
      );

      if (!error && Array.isArray(data)) {
        const cleanedCloud = cleanDemoCategories(data);
        const map = new Map();
        local.forEach((c) => {
          if (c && c.name) map.set(c.name.toLowerCase(), c);
        });
        cleanedCloud.forEach((c) => {
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
    } catch {
      // Offline or network timeout, fall through to instant local categories
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

    const id = generateUUID();
    const newCategory = {
      id,
      name: cleanName,
      slug: cleanSlug,
      image_url: cleanImg,
      created_at: new Date().toISOString(),
    };

    // 1. Save locally immediately (0 ms response time)
    const updated = [...local, newCategory].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    saveLocalCategories(updated);

    // 2. Background attempt to sync to Supabase without blocking UI
    (async () => {
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
          const currentLocal = getLocalCategories();
          const synced = currentLocal.map((c) =>
            c.id === newCategory.id ? { ...res.data, image_url: cleanImg } : c
          );
          saveLocalCategories(synced);
        }
      } catch (err) {
        console.warn('Background category cloud sync notice:', err.message);
      }
    })();

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

    (async () => {
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
        console.warn('Background category update cloud notice:', err.message);
      }
    })();

    return { id, name: cleanName, slug: cleanSlug, image_url: cleanImg };
  },

  async deleteCategory(idOrCategory) {
    const id = typeof idOrCategory === 'object' ? idOrCategory?.id : idOrCategory;
    const local = getLocalCategories();
    const target =
      local.find((c) => c.id === id || String(c.id) === String(id)) ||
      (typeof idOrCategory === 'object' ? idOrCategory : null);

    saveDeletedCategoryId(id, target?.name, target?.slug);

    const updated = local.filter((c) => {
      if (c.id === id || String(c.id) === String(id)) return false;
      if (target?.name && c.name && c.name.toLowerCase().trim() === target.name.toLowerCase().trim()) return false;
      if (target?.slug && c.slug && c.slug.toLowerCase().trim() === target.slug.toLowerCase().trim()) return false;
      return true;
    });

    saveLocalCategories(updated);

    try {
      withTimeout(supabase.from('categories').delete().eq('id', id), 800).catch(() => {});
    } catch (err) {
      console.warn('Background category delete cloud notice:', err.message);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('isai:categories_updated', { detail: updated }));
    }

    return true;
  },

  async uploadCategoryImage(file) {
    if (!file) return '';

    // First compress client-side
    const compressedDataUrl = await compressImage(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.75,
    });

    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `cat_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

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
