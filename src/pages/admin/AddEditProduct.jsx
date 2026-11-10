import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import { ArrowLeft, Save, Upload, Info, Plus } from 'lucide-react';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');

  // Category state
  const [categoriesList, setCategoriesList] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [images, setImages] = useState(['', '', '']);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // Load existing categories from DB/persistent store
  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data)) {
        setCategoriesList(data);
        if (!isEdit && data.length > 0 && !category) {
          setCategory(data[0].name);
          setCategoryId(data[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        setFetching(true);
        setError(null);
        try {
          const data = await productService.getProductById(id);
          if (data) {
            setName(data.name || '');
            setDescription(data.description || '');
            setPrice(data.price || '');
            setDiscountPrice(data.discount_price || '');
            setCost(data.cost || '');
            setStock(data.stock || 0);
            setCategory(data.category || '');
            setCategoryId(data.category_id || null);
            const dbImages = data.images || [];
            setImages([dbImages[0] || '', dbImages[1] || '', dbImages[2] || '']);
          }
        } catch (err) {
          console.error('Failed to load product:', err);
          setError('Failed to fetch product details: ' + err.message);
        } finally {
          setFetching(false);
        }
      };

      loadProduct();
    }
  }, [id, isEdit]);

  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__NEW_CATEGORY__') {
      setIsCreatingNewCategory(true);
      setCategory('');
      setCategoryId(null);
    } else {
      setIsCreatingNewCategory(false);
      setCategory(val);
      const matched = categoriesList.find((c) => c.name.toLowerCase() === val.toLowerCase());
      setCategoryId(matched ? matched.id : null);
    }
  };

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    setError(null);
    try {
      const publicUrl = await productService.uploadProductImage(file);
      handleImageChange(index, publicUrl);
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Determine target category name and id
    let targetCategory = category.trim();
    let targetCategoryId = categoryId;

    if (isCreatingNewCategory) {
      targetCategory = newCategoryName.trim();
      if (!targetCategory) {
        setError('Please enter a name for the new category');
        setLoading(false);
        return;
      }

      // Check if already in list
      const existing = categoriesList.find(
        (c) => c.name.toLowerCase() === targetCategory.toLowerCase()
      );

      if (existing) {
        targetCategoryId = existing.id;
        targetCategory = existing.name;
      } else {
        try {
          const newCat = await categoryService.createCategory({
            name: targetCategory,
          });
          if (newCat) {
            targetCategoryId = newCat.id;
            targetCategory = newCat.name;
          }
        } catch (catErr) {
          console.warn('Notice saving new category record:', catErr);
        }
      }
    }

    if (!targetCategory) {
      setError('Please select or specify a category');
      setLoading(false);
      return;
    }

    const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      cost: cost ? parseFloat(cost) : 0,
      stock: parseInt(stock) || 0,
      category: targetCategory,
      category_id: targetCategoryId || null,
      images: cleanedImages.length > 0 ? cleanedImages : null,
    };

    try {
      if (isEdit) {
        await productService.updateProduct(id, productPayload);
        await adminLogService.logAction('UPDATE_PRODUCT', 'products', id, productPayload);
      } else {
        const res = await productService.createProduct(productPayload);
        await adminLogService.logAction('CREATE_PRODUCT', 'products', res.id, productPayload);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Form submit failed:', err);
      setError('Database save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#F3E5AB]">
      <div>
        <button
          onClick={() => navigate('/admin/products')}
          type="button"
          className="inline-flex items-center text-[#D4AF37] hover:text-[#FFD54F] font-sans text-xs uppercase tracking-widest font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
        </button>
      </div>

      <SectionHeading
        title={isEdit ? 'Modify Product Details' : 'Add New Product'}
        subtitle="Configure pricing, stock index, category attributes, and media"
        align="left"
      />

      {error && (
        <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-4 rounded-xl flex items-start gap-2.5 font-sans text-xs shadow-lg">
          <Info className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p className="font-medium leading-normal">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl text-[#F3E5AB]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
          {/* Product Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. Royal Varanasi Katan Silk Saree"
              required
            />
          </div>

          {/* Category Selector + Add New Option */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
                Category *
              </label>
              {!isCreatingNewCategory && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCategory(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:text-[#FFD54F] font-bold uppercase cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Category
                </button>
              )}
            </div>

            {!isCreatingNewCategory ? (
              <select
                value={category}
                onChange={handleCategorySelectChange}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                required
              >
                {category && !categoriesList.some((c) => c.name === category) && (
                  <option value={category}>{category}</option>
                )}
                <option value="" disabled>Select a category</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="__NEW_CATEGORY__">+ Add New Category...</option>
              </select>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Enter new category name (e.g. Kanchipuram, Banarasi, Linen)"
                    autoFocus
                    required
                  />
                  {categoriesList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCategory(false)}
                      className="px-3 py-2 bg-[#1A3C2B] border border-[#D4AF37]/35 text-[#D4AF37] hover:text-[#FFD54F] rounded-lg text-xs font-bold uppercase"
                    >
                      Choose Existing
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#EADFC9]/70 italic">
                  This new category will be saved to the database and made available across the store.
                </p>
              </div>
            )}
          </div>

          {/* Stock Units */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Stock Units *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. 10"
              min="0"
              required
            />
          </div>

          {/* Regular Price */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Regular Price (₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. 15400"
              min="0"
              required
            />
          </div>

          {/* Discount / Offer Price */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Discount / Offer Price (₹) [Optional]
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. 12900"
              min="0"
            />
          </div>

          {/* Cost Price */}
          <div className="space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Cost Price (₹) [Internal]
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. 8000"
              min="0"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2.5 text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Product overview, fabric specifications, weave details, and blouse piece information..."
            />
          </div>

          {/* Product Images */}
          <div className="sm:col-span-2 space-y-4 pt-4 border-t border-[#D4AF37]/25">
            <h4 className="font-serif text-sm font-bold text-[#F3E5AB] uppercase tracking-wider">
              Product Images (3 slots)
            </h4>

            <div className="space-y-4">
              {images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-1/4 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                    Slot {index + 1}
                  </div>
                  <label className="relative cursor-pointer bg-[#1A3C2B] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] px-4 py-2 rounded-lg text-xs font-bold uppercase text-[#F3E5AB] flex items-center gap-1.5 flex-shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingIndex === index ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(index, e.target.files?.[0])}
                      className="hidden"
                      disabled={uploadingIndex !== null}
                    />
                  </label>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-4 py-2 text-xs text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="Or paste image URL (e.g. https://...)..."
                  />
                  {img && (
                    <div className="w-10 h-10 overflow-hidden rounded bg-[#081A11] border border-[#D4AF37]/35 flex-shrink-0">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#D4AF37]/25 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 flex items-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
