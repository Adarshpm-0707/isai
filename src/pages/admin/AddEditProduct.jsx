import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Button from '../../components/reusable/Button';
import { ArrowLeft, Save, Upload, Info } from 'lucide-react';

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
  const [category, setCategory] = useState('Banarasi');

  const [images, setImages] = useState(['', '', '']);
  const [uploadingIndex, setUploadingIndex] = useState(null);

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
            setCategory(data.category || 'Banarasi');
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

    const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      cost: cost ? parseFloat(cost) : 0,
      stock: parseInt(stock) || 0,
      category,
      images: cleanedImages.length > 0 ? cleanedImages : null,
    };

    try {
      if (isEdit) {
        const res = await productService.updateProduct(id, productPayload);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-[#D8A55A]">
      <div>
        <button
          onClick={() => navigate('/admin/products')}
          type="button"
          className="inline-flex items-center text-[#F6D18A] hover:text-[#D8A55A] font-sans text-xs uppercase tracking-widest font-bold"
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
        <div className="bg-[#2B1409] border border-[#B67A2F] text-[#F6D18A] p-4 rounded-sm flex items-start gap-2.5 font-sans text-xs">
          <Info className="w-5 h-5 flex-shrink-0 text-[#F6D18A]" />
          <p className="font-medium leading-normal">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 sm:p-8 rounded-sm space-y-6 shadow-xl text-[#D8A55A]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="Product Title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] focus:outline-none focus:border-[#F6D18A]"
              placeholder="e.g. Banarasi"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Stock Units *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="e.g. 10"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Regular Price (₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="e.g. 15400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Discount / Offer Price (₹)
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="e.g. 12900"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Cost Price (₹) [Internal]
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="e.g. 8000"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              placeholder="Product overview and material details..."
            />
          </div>

          <div className="sm:col-span-2 space-y-4 pt-4 border-t border-[#D8A55A]/20">
            <h4 className="font-playfair text-sm font-bold text-[#F6D18A] uppercase tracking-wider">
              Product Images (3 slots)
            </h4>

            <div className="space-y-4">
              {images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-1/3 text-xs text-[#D8A55A]/80 font-bold uppercase tracking-wider">
                    Slot {index + 1}
                  </div>
                  <label className="relative cursor-pointer bg-[#5C2F14] border border-[#D8A55A]/40 hover:border-[#F6D18A] px-4 py-2 rounded-sm text-xs font-semibold text-[#F6D18A] flex items-center gap-1.5 flex-shrink-0">
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
                    className="w-full bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm px-4 py-2 text-xs text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                    placeholder="Or paste URL..."
                  />
                  {img && (
                    <div className="w-10 h-10 overflow-hidden rounded bg-[#2B1409] border border-[#D8A55A]/30 flex-shrink-0">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#D8A55A]/20 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
