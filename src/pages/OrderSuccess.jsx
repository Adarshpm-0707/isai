import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ShoppingBag, ClipboardList } from 'lucide-react';
import Button from '../components/reusable/Button';
import SectionHeading from '../components/reusable/SectionHeading';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId;
  const totalAmount = location.state?.totalAmount || 0;

  // Fallback: If accessed directly without order details, redirect to homepage
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      
      {/* Visual Indicator */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-playfair text-3xl font-bold text-maroon uppercase tracking-wider">
          Order Confirmed
        </h2>
        <p className="text-sm text-gray-500 font-sans max-w-sm mx-auto">
          Your order has been submitted successfully. A confirmation email with shipping updates will be dispatched shortly.
        </p>
      </div>

      {/* Invoice details */}
      <div className="bg-white border border-gold/15 p-6 rounded-sm space-y-4 shadow-sm text-left font-sans text-xs">
        <h3 className="font-playfair text-sm font-bold text-maroon uppercase tracking-wide border-b border-gold/10 pb-2">
          Receipt Details
        </h3>
        
        <div className="space-y-2.5">
          <div className="flex justify-between">
            <span className="text-gray-400">Transaction Code</span>
            <span className="font-mono text-gray-800 font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Paid</span>
            <span className="text-maroon font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
              Pending Fulfillment
            </span>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onClick={() => navigate('/orders')}
          variant="outline"
          size="sm"
          className="flex justify-center items-center gap-1.5"
        >
          <ClipboardList className="w-4 h-4" /> View Order History
        </Button>
        <Button
          onClick={() => navigate('/products')}
          variant="primary"
          size="sm"
          className="flex justify-center items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Button>
      </div>

    </div>
  );
}
