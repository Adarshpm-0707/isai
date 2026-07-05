import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import SectionHeading from '../../components/reusable/SectionHeading';
import Loader from '../../components/reusable/Loader';
import Button from '../../components/reusable/Button';
import { ArrowLeft, Save, Upload, Info } from 'lucide-react';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Banarasi');
  
  // 3 image slots
  const [images, setImages] = useState(['', '', '']);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // If in edit mode, fetch existing product details
  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        setFetching(true);
        setError(null);
        try {
          const { data, error: dbErr } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

          if (dbErr) throw dbErr;

          if (data) {
            setName(data.name || '');
            setDescription(data.description || '');
            setPrice(data.price || '');
            setStock(data.stock || 0);
            setCategory(data.category || 'Banarasi');
            // Align images to 3 slots
            const dbImages = data.images || [];
            setImages([
              dbImages[0] || '',
              dbImages[1] || '',
              dbImages[2] || '',
            ]);
          }
        } catch (err) {
          console.error('Failed to load product for editing:', err);
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

  // Handles uploading files to Supabase Storage bucket 'products'
  const handleFileUpload = async (index, file) => {
    if (!file) return;

    setUploadingIndex(index);
    setError(null);
    try {
      // Create random path to prevent overwrites
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        // Fallback info: if bucket 'products' is not configured, inform the user
        throw new Error(
          `${uploadError.message}. Make sure you have created a public bucket named "products" in Supabase Storage.`
        );
      }

      // Generate public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      handleImageChange(index, publicUrl);
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'File upload failed. Please paste an image URL instead.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form data packaging
    const cleanedImages = images.map((img) => img.trim()).filter(Boolean);
    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category,
      images: cleanedImages.length > 0 ? cleanedImages : null,
    };

    try {
      if (isEdit) {
        // Update DB
        const { error: updErr } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', id);

        if (updErr) throw updErr;
      } else {
        // Insert DB
        const { error: insErr } = await supabase
          .from('products')
          .insert([productPayload]);

        if (insErr) throw insErr;
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Form submit failed:', err);
      setError('Database save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader fullPage />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header back button */}
      <div>
        <button
          onClick={() => navigate('/admin/products')}
          type="button"
          className="inline-flex items-center text-maroon hover:text-gold font-sans text-xs uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
        </button>
      </div>

      <SectionHeading
        title={isEdit ? 'Modify Saree Details' : 'Add Heritage Saree'}
        subtitle="Specify weaving characteristics, category attributes, and images"
        align="left"
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-sm flex items-start gap-2.5 font-sans text-xs">
          <Info className="w-5 h-5 flex-shrink-0 text-rose-700" />
          <p className="font-medium leading-normal">{error}</p>
        </div>
      )}

      {/* Main product form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gold/15 p-6 sm:p-8 rounded-sm space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider">
              Saree Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              placeholder="e.g. Amber Kanchipuram Brocade Saree"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider">
              Category Weave *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-gold font-semibold uppercase tracking-wider text-[11px]"
            >
              <option value="Banarasi">Banarasi</option>
              <option value="Kanchipuram">Kanchipuram</option>
              <option value="Chanderi">Chanderi</option>
              <option value="Tussar">Tussar</option>
              <option value="Organza">Organza</option>
              <option value="Patola">Patola</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider">
              Price (INR) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              placeholder="e.g. 15400"
              required
            />
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider">
              Stock Units *
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              placeholder="e.g. 5"
              required
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs uppercase font-bold text-gray-500 tracking-wider">
              Description / Weaving Story
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
              placeholder="Provide historical context or materials detail of this handloom masterpiece..."
            />
          </div>

          {/* Image slots */}
          <div className="sm:col-span-2 space-y-4 pt-4 border-t border-gold/15">
            <h4 className="font-playfair text-sm font-bold text-maroon uppercase tracking-wider">
              Product Images (3 slots)
            </h4>

            <div className="space-y-4">
              {images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-1/3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Slot {index + 1}
                  </div>
                  
                  {/* File Upload Selector */}
                  <label className="relative cursor-pointer bg-ivory border border-maroon/20 hover:border-gold px-4 py-2 rounded-sm text-xs font-semibold text-maroon flex items-center gap-1.5 flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingIndex === index ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(index, e.target.files?.[0])}
                      className="hidden"
                      disabled={uploadingIndex !== null}
                    />
                  </label>

                  {/* URL Text pasting field */}
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="w-full bg-ivory/30 border border-maroon/20 rounded-sm px-4 py-2 text-xs focus:outline-none focus:border-gold"
                    placeholder="Or paste image URL here..."
                  />

                  {/* Tiny slot preview image */}
                  {img && (
                    <div className="w-10 h-10 overflow-hidden rounded bg-ivory border border-gold/20 flex-shrink-0">
                      <img src={img} alt="Slot preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gold/15 flex justify-end">
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
