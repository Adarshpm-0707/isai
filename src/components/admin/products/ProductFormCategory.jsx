import React from 'react';
import { Plus } from 'lucide-react';

export default function ProductFormCategory({
  category,
  categoriesList,
  isCreatingNewCategory,
  setIsCreatingNewCategory,
  newCategoryName,
  setNewCategoryName,
  onCategorySelectChange,
}) {
  return (
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
          onChange={onCategorySelectChange}
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
  );
}
