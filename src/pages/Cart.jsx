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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        title="Shopping Bag"
        subtitle="Review your selections before completing checkout"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gold/15 bg-white rounded-sm divide-y divide-gold/10">
            {cart.map((item) => (
              <div key={item.product_id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-start">
                
                {/* Product Thumbnail */}
                <div className="w-20 sm:w-24 aspect-[3/4] overflow-hidden bg-ivory border border-gold/10 flex-shrink-0">
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
                        to={`/products/${item.product_id}`}
                        className="font-playfair font-bold text-maroon hover:text-gold transition-colors text-sm sm:text-base tracking-wide"
                      >
                        {item.name}
                      </Link>
                      {item.product?.category && (
                        <span className="block font-sans text-[10px] text-gold uppercase font-bold tracking-widest mt-0.5">
                          {item.product.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      type="button"
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
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
                      <span className="block text-[10px] text-gray-400 font-sans uppercase">Total</span>
                      <PriceTag price={item.price * item.qty} size="md" />
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={clearCart}
              type="button"
              className="text-xs font-sans uppercase font-bold text-maroon hover:text-rose-600 transition-colors"
            >
              Clear Bag
            </button>
            <Link
              to="/products"
              className="text-xs font-sans uppercase font-bold text-gold hover:text-maroon transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="bg-white border border-gold/15 p-6 rounded-sm space-y-6 shadow-sm">
          <h3 className="font-playfair text-lg font-bold text-maroon uppercase tracking-wider pb-3 border-b border-gold/10">
            Order Summary
          </h3>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Estimated Shipping</span>
              <span className="text-emerald-600 uppercase font-bold">Free</span>
            </div>
            
            <div className="h-[1px] bg-gold/15" />

            <div className="flex justify-between text-sm text-maroon font-bold uppercase tracking-wider">
              <span>Order Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
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

          <div className="flex items-start gap-2.5 pt-4 text-[10px] text-gray-400 leading-normal border-t border-gold/10 font-sans">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <span>Secure Checkout and genuine product guarantee. Authentic silk marks verified.</span>
          </div>
        </aside>

      </div>
    </div>
  );
}
