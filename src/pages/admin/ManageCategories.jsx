import React from 'react';
import useManageCategories from '../../hooks/useManageCategories';
import SectionHeading from '../../components/reusable/SectionHeading';
import CategoryTable from '../../components/admin/categories/CategoryTable';
import CategoryModal from '../../components/admin/categories/CategoryModal';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ManageCategories() {
  const {
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
    handleOpenModal,
    handleNameChange,
    handleFileUpload,
    handleSubmit,
    handleDelete,
    productCountMap,
    productFirstImageMap,
    filteredCategories,
  } = useManageCategories();

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F5E6BE] font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Manage Categories"
          subtitle="Catalog category taxonomies, cover imagery, and classification"
          align="left"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-sans shadow-lg border transition-all ${
            feedback.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-[#0F131C] border-[#D4AF37]/50 text-[#F5E6BE]'
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

      {/* Categories Table View */}
      <CategoryTable
        categories={categories}
        filteredCategories={filteredCategories}
        loading={loading}
        search={search}
        setSearch={setSearch}
        productCountMap={productCountMap}
        productFirstImageMap={productFirstImageMap}
        onOpenModal={handleOpenModal}
        onDelete={handleDelete}
      />

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        name={name}
        slug={slug}
        imageUrl={imageUrl}
        uploadingImage={uploadingImage}
        saving={saving}
        onNameChange={handleNameChange}
        onSlugChange={setSlug}
        onImageUrlChange={setImageUrl}
        onFileUpload={handleFileUpload}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
