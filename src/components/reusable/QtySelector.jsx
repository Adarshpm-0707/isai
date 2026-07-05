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
    <div className="flex items-center border border-maroon/20 rounded-sm bg-white overflow-hidden w-fit">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={qty <= 1}
        className="w-10 h-10 flex items-center justify-center text-maroon font-semibold hover:bg-ivory hover:text-gold transition-colors disabled:opacity-30"
      >
        &minus;
      </button>
      <span className="w-12 text-center text-sm font-sans font-bold text-maroon">
        {qty}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={qty >= stock}
        className="w-10 h-10 flex items-center justify-center text-maroon font-semibold hover:bg-ivory hover:text-gold transition-colors disabled:opacity-30"
      >
        &#43;
      </button>
    </div>
  );
}
