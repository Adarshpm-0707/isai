import { supabase } from '../lib/supabaseClient';

const CATEGORIES_STORAGE_KEY = 'isai_tarang_categories';

// Fast network timeout helper (prevents 20-30s browser hang)
function withTimeout(promise, ms = 1200) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function getLocalCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCategories(cats) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    window.dispatchEvent(new CustomEvent('isai:categories_updated', { detail: cats }));
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

      if (!error && Array.isArray(data)) {
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
      console.warn('Categories fast sync note (using instant local store):', err.message);
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
