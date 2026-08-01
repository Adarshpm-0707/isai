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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-transparent text-[#F6D18A] min-h-[70vh]">
      <SectionHeading
        title="Shopping Bag"
        subtitle="Review your selections before completing checkout"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#F6D18A]/30 bg-[#F6D18A]/10 rounded-sm divide-y divide-[#F6D18A]/20 shadow-lg">
            {cart.map((item) => (
              <div key={item.product_id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                
                {/* Product Thumbnail */}
                <div className="relative w-20 sm:w-28 aspect-[3/4] overflow-hidden bg-[#4A0000]/60 border border-[#FFE8A3]/30 flex-shrink-0 rounded-xl p-1 shadow-md">
                  <img
                    src={getProductImage(item.product)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-110 pointer-events-none"
                  />
                  <img
                    src={getProductImage(item.product)}
                    alt={item.name}
                    className="relative z-10 w-full h-full object-contain object-center rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between h-full min-h-[100px] space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product_id}`}
                        className="font-playfair font-bold text-[#F6D18A] hover:text-[#D8A55A] transition-colors text-sm sm:text-base tracking-wide"
                      >
                        {item.name}
                      </Link>
                      {item.product?.category && (
                        <span className="block font-sans text-[10px] text-[#5C2F14] uppercase font-bold tracking-widest mt-0.5">
                          {item.product.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      type="button"
                      className="text-[#5C2F14]/70 hover:text-[#2B1409] transition-colors p-1"
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
                      <span className="block text-[10px] text-[#5C2F14] font-sans font-bold uppercase">Total</span>
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
              className="text-xs font-sans uppercase font-bold text-[#5C2F14] hover:text-[#2B1409] transition-colors"
            >
              Clear Bag
            </button>
            <Link
              to="/products"
              className="text-xs font-sans uppercase font-bold text-[#2B1409] hover:text-[#5C2F14] transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="bg-gradient-to-b from-[#FFEEDD] to-[#FFF7ED] border border-[#D8A55A]/40 p-6 rounded-sm space-y-6 shadow-xl text-[#2B1409]">
          <h3 className="font-playfair text-lg font-bold text-[#2B1409] uppercase tracking-wider pb-3 border-b border-[#D8A55A]/30">
            Order Summary
          </h3>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex justify-between text-[#5C2F14] font-medium">
              <span>Subtotal ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
              <span className="font-bold text-[#2B1409]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#5C2F14] font-medium">
              <span>Estimated Shipping</span>
              <span className="text-[#2B1409] uppercase font-bold">Free</span>
            </div>
            
            <div className="h-[1px] bg-[#D8A55A]/30" />

            <div className="flex justify-between text-sm text-[#2B1409] font-bold uppercase tracking-wider">
              <span>Order Total</span>
              <span className="text-[#2B1409]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-start gap-2.5 pt-4 text-[10px] text-[#5C2F14] font-medium leading-normal border-t border-[#D8A55A]/30 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#E88D37] flex-shrink-0 mt-0.5" />
            <span>Secure Checkout and genuine product guarantee. Authentic silk marks verified.</span>
          </div>
        </aside>

      </div>
    </div>
  );
}
