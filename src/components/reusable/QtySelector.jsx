import React from 'react';

export default function QtySelector({ qty, onChange, stock = 10 }) {
  const handleDecrement = () => {
    if (qty > 1) {
      onChange(qty - 1);
    }
  };

  const handleIncrement = () => {
    if (qty < stock) {
      onChange(qty + 1);
    }
  };

  return (
    <div className="flex items-center border border-[#f45d04]/30 rounded-sm bg-[#120404] overflow-hidden w-fit text-[#efcf8b]">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={qty <= 1}
        className="w-10 h-10 flex items-center justify-center text-[#efcf8b] font-semibold hover:bg-[#f45d04]/20 hover:text-[#f45d04] transition-colors disabled:opacity-30"
      >
        &minus;
      </button>
      <span className="w-12 text-center text-sm font-sans font-bold text-[#efcf8b]">
        {qty}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={qty >= stock}
        className="w-10 h-10 flex items-center justify-center text-[#efcf8b] font-semibold hover:bg-[#f45d04]/20 hover:text-[#f45d04] transition-colors disabled:opacity-30"
      >
        &#43;
      </button>
    </div>
  );
}
