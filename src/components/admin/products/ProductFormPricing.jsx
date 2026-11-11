import React from 'react';

export default function ProductFormPricing({
  stock,
  setStock,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  cost,
  setCost,
}) {
  return (
    <>
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
    </>
  );
}
