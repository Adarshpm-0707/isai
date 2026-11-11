import React from 'react';
import { Search, RefreshCw, FolderTree, Plus, Edit2, Trash2 } from 'lucide-react';

const DEFAULT_CATEGORY_FALLBACK =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400';

export default function CategoryTable({
  categories,
  filteredCategories,
  loading,
  search,
  setSearch,
  productCountMap,
  productFirstImageMap,
  onOpenModal,
  onDelete,
}) {
  return (
    <div className="space-y-6 font-sans">
      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#0F131C] border border-[#D4AF37]/35 p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2 bg-[#161B26] border border-[#D4AF37]/35 rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#FFFFFF] placeholder:text-[#A1A1AA]/60 focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 text-[#A1A1AA] text-xs font-medium">
          <span>Total Categories:</span>
          <span className="text-[#D4AF37] font-bold">{categories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F5E6BE]">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#A1A1AA]">Loading Categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-[#D4AF37] mx-auto opacity-75" />
            <h3 className="font-sans text-lg font-bold text-[#FFFFFF]">
              {search ? 'No Matching Categories' : 'No Categories Created Yet'}
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto font-light">
              {search
                ? 'Try a different keyword or clear the search filter.'
                : 'Click "Add Category" above to create your first saree category with a cover image.'}
            </p>
            {!search && (
              <button
                onClick={() => onOpenModal()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mt-2 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
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
                      className="hover:bg-[#161B26]/60 transition-colors"
                    >
                      {/* Cover Image Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D4AF37]/35 bg-[#0A0D14] shadow-md shrink-0">
                          <img
                            src={displayImage}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Category Name */}
                      <td className="py-4 px-6 font-bold text-[#FFFFFF]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{cat.name}</span>
                        </div>
                      </td>

                      {/* URL Slug */}
                      <td className="py-4 px-6 text-[#A1A1AA] font-mono text-xs">
                        <span className="px-2 py-1 bg-[#161B26] rounded border border-[#D4AF37]/20 text-[#DFC18A]">
                          {cat.slug}
                        </span>
                      </td>

                      {/* Sarees Count */}
                      <td className="py-4 px-6 text-[#A1A1AA]">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#161B26] border border-[#D4AF37]/35 text-[#D4AF37]">
                          {count} {count === 1 ? 'saree' : 'sarees'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onOpenModal(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161B26] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                          title="Edit Category Name, Image, and Slug"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(cat.id, cat.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
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
    </div>
  );
}
