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
    <div className="flex items-center border border-[#F6D18A]/50 rounded-full bg-[rgb(249,108,2)] overflow-hidden w-fit text-[#F6D18A] shadow-sm">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={qty <= 1}
        className="w-10 h-10 flex items-center justify-center text-[#F6D18A] font-bold hover:bg-[#E85E00] transition-colors disabled:opacity-30"
      >
        &minus;
      </button>
      <span className="w-12 text-center text-sm font-sans font-bold text-[#F6D18A]">
        {qty}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={qty >= stock}
        className="w-10 h-10 flex items-center justify-center text-[#F6D18A] font-bold hover:bg-[#E85E00] transition-colors disabled:opacity-30"
      >
        &#43;
      </button>
    </div>
  );
}
