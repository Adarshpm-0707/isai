import React from 'react';
import Modal from '../../reusable/Modal';
import { Upload, X, RefreshCw } from 'lucide-react';

export default function CategoryModal({
  isOpen,
  onClose,
  editingId,
  name,
  slug,
  imageUrl,
  uploadingImage,
  saving,
  onNameChange,
  onSlugChange,
  onImageUrlChange,
  onFileUpload,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Edit Category' : 'New Category'}
    >
      <form onSubmit={onSubmit} className="space-y-5 text-xs font-sans text-[#F3E5AB] p-2">
        {/* Category Name */}
        <div className="space-y-1.5">
          <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">
            Category Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
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
            onChange={(e) => onSlugChange(e.target.value)}
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
                onChange={(e) => onFileUpload(e.target.files?.[0])}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>

            {/* URL Paste Input */}
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
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
                onClick={() => onImageUrlChange('')}
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
            onClick={onClose}
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
  );
}
