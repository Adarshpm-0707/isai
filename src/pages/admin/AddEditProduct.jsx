import React from 'react';
import useAddEditProduct from '../../hooks/useAddEditProduct';
import SectionHeading from '../../components/reusable/SectionHeading';
import ProductFormCategory from '../../components/admin/products/ProductFormCategory';
import ProductFormPricing from '../../components/admin/products/ProductFormPricing';
import ProductFormImages from '../../components/admin/products/ProductFormImages';
import { ArrowLeft, Save, Info } from 'lucide-react';

export default function AddEditProduct() {
  const {
    isEdit,
    loading,
    error,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    cost,
    setCost,
    stock,
    setStock,
    categoriesList,
    category,
    isCreatingNewCategory,
    setIsCreatingNewCategory,
    newCategoryName,
    setNewCategoryName,
    images,
    uploadingIndex,
    handleCategorySelectChange,
    handleImageChange,
    handleFileUpload,
    handleSubmit,
    navigate,
  } = useAddEditProduct();

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
          <ProductFormCategory
            category={category}
            categoriesList={categoriesList}
            isCreatingNewCategory={isCreatingNewCategory}
            setIsCreatingNewCategory={setIsCreatingNewCategory}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            onCategorySelectChange={handleCategorySelectChange}
          />

          {/* Pricing & Stock Fields */}
          <ProductFormPricing
            stock={stock}
            setStock={setStock}
            price={price}
            setPrice={setPrice}
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice}
            cost={cost}
            setCost={setCost}
          />

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
          <ProductFormImages
            images={images}
            uploadingIndex={uploadingIndex}
            onImageChange={handleImageChange}
            onFileUpload={handleFileUpload}
          />
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
