import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import PriceTag from '../components/reusable/PriceTag';
import QtySelector from '../components/reusable/QtySelector';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import EmptyState from '../components/reusable/EmptyState';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { getProductImage } from '../utils/productHelpers';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your Shopping Bag is Empty"
        message="Drape yourself in style. Browse our handcrafted luxury collections."
        actionText="Browse Collection"
        actionPath="/products"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#120404] text-[#efcf8b] min-h-[70vh]">
      <SectionHeading
        title="Shopping Bag"
        subtitle="Review your selections before completing checkout"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#f45d04]/30 bg-[#1a0806] rounded-sm divide-y divide-white/10 shadow-xl">
            {cart.map((item) => (
              <div key={item.product_id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                
                {/* Product Thumbnail */}
                <div className="w-20 sm:w-24 aspect-[3/4] overflow-hidden bg-[#120404] border border-white/10 flex-shrink-0 rounded-sm">
                  <img
                    src={getProductImage(item.product)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between h-full min-h-[100px] space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product_id}`}
                        className="font-playfair font-bold text-[#efcf8b] hover:text-[#f45d04] transition-colors text-sm sm:text-base tracking-wide"
                      >
                        {item.name}
                      </Link>
                      {item.product?.category && (
                        <span className="block font-sans text-[10px] text-[#f45d04] uppercase font-bold tracking-widest mt-0.5">
                          {item.product.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      type="button"
                      className="text-[#efcf8b]/60 hover:text-rose-400 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <QtySelector
                      qty={item.qty}
                      onChange={(newQty) => updateQty(item.product_id, newQty)}
                      stock={item.stock || 10}
                    />
                    <div className="text-right">
                      <span className="block text-[10px] text-[#efcf8b]/70 font-sans uppercase">Total</span>
                      <PriceTag price={item.price * item.qty} size="md" />
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2">
            <button
              onClick={clearCart}
              type="button"
              className="text-xs font-sans uppercase font-bold text-[#efcf8b] hover:text-rose-400 transition-colors"
            >
              Clear Bag
            </button>
            <Link
              to="/products"
              className="text-xs font-sans uppercase font-bold text-[#f45d04] hover:text-[#efcf8b] transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="bg-[#1a0806] border border-[#f45d04]/30 p-6 rounded-sm space-y-6 shadow-xl text-[#efcf8b]">
          <h3 className="font-playfair text-lg font-bold text-[#efcf8b] uppercase tracking-wider pb-3 border-b border-white/10">
            Order Summary
          </h3>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex justify-between text-[#efcf8b]/80">
              <span>Subtotal ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
              <span className="font-bold text-[#efcf8b]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#efcf8b]/80">
              <span>Estimated Shipping</span>
              <span className="text-emerald-400 uppercase font-bold">Free</span>
            </div>
            
            <div className="h-[1px] bg-white/10" />

            <div className="flex justify-between text-sm text-[#efcf8b] font-bold uppercase tracking-wider">
              <span>Order Total</span>
              <span className="text-[#f45d04]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2 bg-[#f45d04] text-[#efcf8b] hover:bg-[#c44900] border-none rounded-full shadow-lg"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-start gap-2.5 pt-4 text-[10px] text-[#efcf8b]/70 leading-normal border-t border-white/10 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#f45d04] flex-shrink-0 mt-0.5" />
            <span>Secure Checkout and genuine product guarantee. Authentic silk marks verified.</span>
          </div>
        </aside>

      </div>
    </div>
  );
}
