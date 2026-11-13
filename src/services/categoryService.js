import { supabase } from '../lib/supabaseClient';
import { compressImage } from '../utils/imageCompressor';

const CATEGORIES_STORAGE_KEY = 'isai_tarang_categories';
const DELETED_CATEGORIES_KEY = 'isai_deleted_category_ids';

function getDeletedCategoryIds() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CATEGORIES_KEY) : null;
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Only valid UUID IDs should be treated as deleted IDs
    const validIds = (Array.isArray(parsed) ? parsed : []).filter(id => uuidRegex.test(String(id)));
    if (validIds.length !== (Array.isArray(parsed) ? parsed.length : 0) && typeof localStorage !== 'undefined') {
      localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(validIds));
    }
    return new Set(validIds.map(id => String(id).toLowerCase().trim()));
  } catch {
    return new Set();
  }
}

function saveDeletedCategoryId(id) {
  try {
    if (!id) return;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CATEGORIES_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];
    const str = String(id).toLowerCase().trim();
    if (!list.includes(str)) list.push(str);
    localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(list));
  } catch {}
}

function unmarkDeletedCategory(id = null, name = null, slug = null) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_CATEGORIES_KEY) : null;
    if (!raw) return;
    const list = JSON.parse(raw);
    const keysToRemove = new Set([
      id ? String(id).toLowerCase().trim() : '',
      name ? String(name).toLowerCase().trim() : '',
      slug ? String(slug).toLowerCase().trim() : '',
    ].filter(Boolean));
    const updated = list.filter((item) => !keysToRemove.has(String(item).toLowerCase().trim()));
    localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(updated));
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

function cleanCategories(list) {
  if (!Array.isArray(list)) return [];
  const deleted = getDeletedCategoryIds();
  return list.filter((c) => {
    if (!c) return false;
    const id = c.id ? String(c.id).toLowerCase().trim() : '';
    const rawId = c.id ? String(c.id) : '';

    if (id && deleted.has(id)) return false;
    if (rawId && deleted.has(rawId)) return false;
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
    return cleanCategories(list);
  } catch {
    return [];
  }
}

function saveLocalCategories(cats) {
  const cleaned = cleanCategories(cats);
  try {
    if (typeof localStorage !== 'undefined') {
      const prev = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const next = JSON.stringify(cleaned);
      if (prev === next) {
        return; // Data has not changed; prevent infinite dispatch and re-render loops
      }
      localStorage.setItem(CATEGORIES_STORAGE_KEY, next);
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
    // 1. Fetch live categories from Supabase
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true }),
        5000
      );

      if (!error && Array.isArray(data)) {
        saveLocalCategories(data);
        return data;
      }
    } catch (e) {
      console.warn('Supabase categories fetch notice:', e?.message);
    }

    // 2. Offline fallback
    return getLocalCategories();
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

    // Unmark any previous deleted record matching name or slug
    unmarkDeletedCategory(null, cleanName, cleanSlug);

    // 1. Check if category already exists in Supabase (e.g. Traditional Kerala Saree)
    try {
      const { data: existing } = await withTimeout(
        supabase
          .from('categories')
          .select('*')
          .or(`name.ilike."${cleanName}",slug.eq."${cleanSlug}"`)
          .maybeSingle(),
        3000
      ).catch(() => ({ data: null }));

      if (existing) {
        unmarkDeletedCategory(existing.id, existing.name, existing.slug);
        if (cleanImg && cleanImg !== existing.image_url) {
          await withTimeout(
            supabase.from('categories').update({ image_url: cleanImg }).eq('id', existing.id),
            3000
          ).catch(() => {});
          existing.image_url = cleanImg;
        }
        const local = getLocalCategories();
        const updated = [
          ...local.filter((c) => c.id !== existing.id && c.name.toLowerCase() !== cleanName.toLowerCase()),
          existing,
        ].sort((a, b) => a.name.localeCompare(b.name));
        saveLocalCategories(updated);
        return existing;
      }
    } catch (e) {
      console.warn('Check existing category note:', e?.message);
    }

    const id = generateUUID();
    const newCategory = {
      id,
      name: cleanName,
      slug: cleanSlug,
      image_url: cleanImg,
      created_at: new Date().toISOString(),
    };

    // 2. Save directly into Supabase
    try {
      const payload = {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
      };
      if (cleanImg) payload.image_url = cleanImg;

      const { data, error } = await withTimeout(
        supabase.from('categories').insert(payload).select().maybeSingle(),
        5000
      );
      if (!error && data) {
        Object.assign(newCategory, data);
      } else if (error && error.code === '23505') {
        // Unique slug collision: retry with safe suffix
        payload.slug = `${cleanSlug}-${Date.now().toString(36).slice(-4)}`;
        newCategory.slug = payload.slug;
        const retryRes = await withTimeout(
          supabase.from('categories').insert(payload).select().maybeSingle(),
          5000
        ).catch(() => null);
        if (retryRes?.data) {
          Object.assign(newCategory, retryRes.data);
        }
      }
    } catch (err) {
      console.warn('Supabase category insert notice:', err.message);
    }

    // 3. Commit to local storage so UI updates instantly
    const local = getLocalCategories();
    const updated = [
      ...local.filter((c) => c.id !== newCategory.id && c.name.toLowerCase() !== cleanName.toLowerCase()),
      newCategory,
    ].sort((a, b) => a.name.localeCompare(b.name));
    saveLocalCategories(updated);

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
    unmarkDeletedCategory(id, cleanName, cleanSlug);

    // 1. Update Supabase
    try {
      const updates = { name: cleanName, slug: cleanSlug };
      if (cleanImg) updates.image_url = cleanImg;

      await withTimeout(
        supabase.from('categories').update(updates).eq('id', id).select().maybeSingle(),
        5000
      );
    } catch (err) {
      console.warn('Supabase category update notice:', err.message);
    }

    // 2. Update local storage
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
    return { id, name: cleanName, slug: cleanSlug, image_url: cleanImg };
  },

  async deleteCategory(idOrCategory) {
    const id = typeof idOrCategory === 'object' ? idOrCategory?.id : idOrCategory;
    const local = getLocalCategories();
    const target =
      local.find((c) => c.id === id || String(c.id) === String(id)) ||
      (typeof idOrCategory === 'object' ? idOrCategory : null);

    saveDeletedCategoryId(id);

    // 1. Delete from Supabase
    try {
      await withTimeout(supabase.from('categories').delete().eq('id', id), 5000);
    } catch (err) {
      console.warn('Supabase category delete notice:', err.message);
    }

    // 2. Remove from local storage
    const updated = local.filter((c) => {
      if (c.id === id || String(c.id) === String(id)) return false;
      return true;
    });

    saveLocalCategories(updated);

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
