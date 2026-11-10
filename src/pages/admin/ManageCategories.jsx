import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Modal from '../../components/reusable/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';

const DEFAULT_CATEGORY_FALLBACK =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400';

export default function ManageCategories() {
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

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchCategoriesAndProducts = async () => {
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
  };

  useEffect(() => {
    fetchCategoriesAndProducts();

    const handleUpdate = () => {
      fetchCategoriesAndProducts();
    };

    window.addEventListener('isai:categories_updated', handleUpdate);
    return () => window.removeEventListener('isai:categories_updated', handleUpdate);
  }, []);

  const handleOpenModal = (cat = null) => {
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
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingId || !slug) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleFileUpload = async (file) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        await adminLogService.logAction('UPDATE_CATEGORY', 'categories', editingId, {
          name: cleanName,
          slug: cleanSlug,
          image_url: cleanImage,
        });
        showNotification(`Category "${cleanName}" updated successfully!`);
      } else {
        const created = await categoryService.createCategory({
          name: cleanName,
          slug: cleanSlug,
          image_url: cleanImage,
        });
        await adminLogService.logAction('CREATE_CATEGORY', 'categories', created.id, {
          name: cleanName,
          slug: cleanSlug,
          image_url: cleanImage,
        });
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
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      await adminLogService.logAction('DELETE_CATEGORY', 'categories', id, {});
      showNotification(`Category "${catName}" deleted successfully`);
      fetchCategoriesAndProducts();
    } catch (err) {
      console.error('Delete category error:', err);
      showNotification(err.message || 'Failed to delete category', 'error');
    }
  };

  // Compute product count and first product image per category
  const productCountMap = {};
  const productFirstImageMap = {};
  (products || []).forEach((p) => {
    if (p.category) {
      const key = p.category.toLowerCase();
      productCountMap[key] = (productCountMap[key] || 0) + 1;
      if (!productFirstImageMap[key]) {
        const pImg =
          (Array.isArray(p.images) && p.images[0]) || p.image_url || p.image || null;
        if (pImg) productFirstImageMap[key] = pImg;
      }
    }
  });

  const filteredCategories = categories.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Manage Categories"
          subtitle="Catalog category taxonomies, cover imagery, and classification"
          align="left"
        />
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-sans shadow-lg border transition-all ${
            feedback.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-[#153424] border-[#D4AF37]/50 text-[#F3E5AB]'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#0C2317] border border-[#D4AF37]/35 p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2 bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 text-[#EADFC9] text-xs font-medium">
          <span>Total Categories:</span>
          <span className="text-[#D4AF37] font-bold">{categories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#EADFC9]">Loading Categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-[#D4AF37] mx-auto opacity-75" />
            <h3 className="font-serif text-lg text-[#F3E5AB]">
              {search ? 'No Matching Categories' : 'No Categories Created Yet'}
            </h3>
            <p className="text-xs text-[#EADFC9]/70 max-w-sm mx-auto font-light">
              {search
                ? 'Try a different keyword or clear the search filter.'
                : 'Click "Add Category" above to create your first saree category with a cover image.'}
            </p>
            {!search && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0C2317] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mt-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                  <th className="py-4 px-6 w-24">Cover Image</th>
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">URL Slug</th>
                  <th className="py-4 px-6">Sarees Linked</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {filteredCategories.map((cat) => {
                  const count = productCountMap[cat.name?.toLowerCase()] || 0;
                  const displayImage =
                    cat.image_url ||
                    cat.image ||
                    productFirstImageMap[cat.name?.toLowerCase()] ||
                    DEFAULT_CATEGORY_FALLBACK;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-[#153424]/60 transition-colors"
                    >
                      {/* Cover Image Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D4AF37]/35 bg-[#081A11] shadow-md shrink-0">
                          <img
                            src={displayImage}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Category Name */}
                      <td className="py-4 px-6 font-bold text-[#F3E5AB]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{cat.name}</span>
                        </div>
                      </td>

                      {/* URL Slug */}
                      <td className="py-4 px-6 text-[#EADFC9] font-mono text-xs">
                        <span className="px-2 py-1 bg-[#1A3C2B]/70 rounded border border-[#D4AF37]/20">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Sarees Count */}
                      <td className="py-4 px-6 text-[#EADFC9]">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1A3C2B] border border-[#D4AF37]/35 text-[#D4AF37]">
                          {count} {count === 1 ? 'saree' : 'sarees'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35 transition-all rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
                          title="Edit Category Name, Image, and Slug"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal with Image Upload */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans text-[#F3E5AB] p-2">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. Kanchipuram Silk Saree"
              autoFocus
              required
            />
          </div>

          {/* URL Slug */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37] font-mono"
              placeholder="e.g. kanchipuram-silk-saree"
            />
          </div>

          {/* Cover Image Upload Section */}
          <div className="space-y-2 pt-2 border-t border-[#D4AF37]/20">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Category Cover Image
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* File Upload Button */}
              <label className="relative cursor-pointer bg-[#1A3C2B] border border-[#D4AF37]/45 hover:bg-[#D4AF37] hover:text-[#0C2317] px-4 py-2.5 rounded-lg text-xs font-bold uppercase text-[#F3E5AB] flex items-center gap-2 shrink-0 transition-colors shadow">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              {/* URL Paste Input */}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-xs text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Or paste image URL (e.g. https://...)..."
              />
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="relative mt-2 w-28 h-32 rounded-xl overflow-hidden border border-[#D4AF37]/50 shadow-lg group">
                <img
                  src={imageUrl}
                  alt="Category Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              disabled={saving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#EADFC9] hover:bg-[#1A3C2B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingId ? 'Update Category' : 'Save Category'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
