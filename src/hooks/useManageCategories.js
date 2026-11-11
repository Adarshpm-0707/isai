import { useState, useEffect, useMemo, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { adminLogService } from '../services/adminLogService';

export default function useManageCategories() {
  const [categories, setCategories] = useState(() => categoryService.getLocalCategories());
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  }, []);

  const fetchCategoriesAndProducts = useCallback(async () => {
    const localCats = categoryService.getLocalCategories();
    const localProds = productService.getLocalProducts();
    if (localCats.length > 0) setCategories(localCats);
    if (localProds.length > 0) setProducts(localProds);
    if (localCats.length === 0 && localProds.length === 0) {
      setLoading(true);
    }
    try {
      const [cats, prodsRes] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts({ limit: 500 }),
      ]);
      if (Array.isArray(cats)) setCategories(cats);
      if (prodsRes?.products) setProducts(prodsRes.products);
    } catch (err) {
      console.warn('Notice loading category dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndProducts();

    const handleUpdate = () => {
      fetchCategoriesAndProducts();
    };

    window.addEventListener('isai:categories_updated', handleUpdate);
    return () => window.removeEventListener('isai:categories_updated', handleUpdate);
  }, [fetchCategoriesAndProducts]);

  const handleOpenModal = useCallback((cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setName(cat.name || '');
      setSlug(cat.slug || '');
      setImageUrl(cat.image_url || cat.image || '');
    } else {
      setEditingId(null);
      setName('');
      setSlug('');
      setImageUrl('');
    }
    setModalOpen(true);
  }, []);

  const handleNameChange = useCallback(
    (val) => {
      setName(val);
      if (!editingId || !slug) {
        const autoSlug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        setSlug(autoSlug);
      }
    },
    [editingId, slug]
  );

  const handleFileUpload = useCallback(
    async (file) => {
      if (!file) return;
      setUploadingImage(true);
      try {
        const url = await categoryService.uploadCategoryImage(file);
        if (url) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error('Category image upload error:', err);
        showNotification('Image upload failed: ' + err.message, 'error');
      } finally {
        setUploadingImage(false);
      }
    },
    [showNotification]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();
      if (!name.trim()) return;

      setSaving(true);
      const cleanName = name.trim();
      const cleanSlug =
        slug.trim() ||
        cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      const cleanImage = imageUrl.trim();

      try {
        if (editingId) {
          await categoryService.updateCategory(editingId, {
            name: cleanName,
            slug: cleanSlug,
            image_url: cleanImage,
          });
          adminLogService.logAction('UPDATE_CATEGORY', 'categories', editingId, {
            name: cleanName,
            slug: cleanSlug,
            image_url: cleanImage,
          }).catch(() => {});
          showNotification(`Category "${cleanName}" updated successfully!`);
        } else {
          const created = await categoryService.createCategory({
            name: cleanName,
            slug: cleanSlug,
            image_url: cleanImage,
          });
          adminLogService.logAction('CREATE_CATEGORY', 'categories', created.id, {
            name: cleanName,
            slug: cleanSlug,
            image_url: cleanImage,
          }).catch(() => {});
          showNotification(`Category "${cleanName}" created successfully!`);
        }
        setModalOpen(false);
        fetchCategoriesAndProducts();
      } catch (err) {
        console.error('Category save error:', err);
        showNotification(err.message || 'Failed to save category', 'error');
      } finally {
        setSaving(false);
      }
    },
    [name, slug, imageUrl, editingId, showNotification, fetchCategoriesAndProducts]
  );

  const handleDelete = useCallback(
    async (id, catName) => {
      if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
        return;
      }

      try {
        await categoryService.deleteCategory({ id, name: catName });
        adminLogService.logAction('DELETE_CATEGORY', 'categories', id, {}).catch(() => {});
        showNotification(`Category "${catName}" deleted successfully`);
        setCategories((prev) => prev.filter((c) => c.id !== id && c.name !== catName));
        fetchCategoriesAndProducts();
      } catch (err) {
        console.error('Delete category error:', err);
        showNotification(err.message || 'Failed to delete category', 'error');
      }
    },
    [showNotification, fetchCategoriesAndProducts]
  );

  // Compute product count and first product image per category
  const { productCountMap, productFirstImageMap } = useMemo(() => {
    const countMap = {};
    const imgMap = {};
    (products || []).forEach((p) => {
      if (p.category) {
        const key = p.category.toLowerCase();
        countMap[key] = (countMap[key] || 0) + 1;
        if (!imgMap[key]) {
          const pImg =
            (Array.isArray(p.images) && p.images[0]) || p.image_url || p.image || null;
          if (pImg) imgMap[key] = pImg;
        }
      }
    });
    return { productCountMap: countMap, productFirstImageMap: imgMap };
  }, [products]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(q) ||
        cat.slug?.toLowerCase().includes(q)
    );
  }, [categories, search]);

  return {
    categories,
    loading,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
    editingId,
    name,
    slug,
    setSlug,
    imageUrl,
    setImageUrl,
    uploadingImage,
    saving,
    feedback,
    showNotification,
    handleOpenModal,
    handleNameChange,
    handleFileUpload,
    handleSubmit,
    handleDelete,
    productCountMap,
    productFirstImageMap,
    filteredCategories,
  };
}
