import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import PriceTag from '../components/reusable/PriceTag';
import Loader from '../components/reusable/Loader';
import { CreditCard, Landmark, QrCode, AlertCircle, CheckCircle } from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  
  const shippingAddress = location.state?.shippingAddress;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback: If address is missing, redirect back to checkout
  useEffect(() => {
    if (!shippingAddress && cart.length > 0) {
      console.warn('Shipping address missing in location state. Redirecting to checkout.');
      navigate('/checkout');
    }
  }, [shippingAddress, cart, navigate]);

  const handleOrderCreation = async (paymentId) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Create order row
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          status: 'pending',
          payment_id: paymentId,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Create order items rows
      const itemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        qty: item.qty,
        price: item.price,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsErr) throw itemsErr;

      // 3. Clear cart in Supabase & Local state
      await clearCart();

      // 4. Success redirect
      setLoading(false);
      navigate('/order-success', { state: { orderId: orderData.id, totalAmount: cartTotal } });
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Database transaction failed: ' + err.message);
      setLoading(false);
    }
  };

  // Real Razorpay dynamic handler
  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    const sdkLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!sdkLoaded) {
      setError('Razorpay SDK failed to load. Please verify your connection or use simulation.');
      setLoading(false);
      return;
    }

    const options = {
      key: 'rzp_test_placeholder_key', // Mock/test key placeholder
      amount: cartTotal * 100, // in paise
      currency: 'INR',
      name: 'Isai Sarees',
      description: 'Handcrafted Heirlooms',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100',
      handler: async function (response) {
        // Success callback
        const paymentId = response.razorpay_payment_id || `rzp-mock-${Date.now()}`;
        await handleOrderCreation(paymentId);
      },
      prefill: {
        name: shippingAddress?.name || '',
        email: shippingAddress?.email || '',
        contact: shippingAddress?.phone || '',
      },
      theme: {
        color: '#6B0F1A',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError('Payment transaction failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setError('Failed to initialize Razorpay checkout. Please use simulation below.');
      setLoading(false);
    }
  };

  // Simulated Bypass Gateway
  const handleSimulatedPayment = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(async () => {
      const mockPaymentId = `sim-pay-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await handleOrderCreation(mockPaymentId);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader />
        <p className="font-sans text-xs uppercase tracking-widest text-maroon animate-pulse">
          Processing transaction... do not reload.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SectionHeading
        title="Secured Payment Gateway"
        subtitle="Finalize order and verify transaction method"
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-sans font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Payment selections */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white border border-gold/15 p-6 rounded-sm space-y-4 shadow-sm">
            <h3 className="font-playfair text-base font-bold text-maroon uppercase tracking-wider pb-3 border-b border-gold/10">
              Gateway Selections
            </h3>

            {/* Razorpay Gateway */}
            <div className="border border-gold/20 p-5 hover:border-maroon transition-all cursor-pointer rounded-sm flex justify-between items-center group bg-[#6B0F1A]/5"
                 onClick={handleRazorpayPayment}>
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-gold/20 rounded-full">
                  <Landmark className="w-6 h-6 text-maroon" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-maroon">
                    Razorpay Checkout
                  </h4>
                  <p className="text-[10px] text-gray-500 font-sans">
                    Pay securely using UPI, Cards, Netbanking, or Wallet
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Test Simulation Bypass */}
            <div className="border border-gold/20 p-5 hover:border-maroon transition-all cursor-pointer rounded-sm flex justify-between items-center group bg-[#C9A227]/5 animate-pulse"
                 onClick={handleSimulatedPayment}>
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-white border border-gold/20 rounded-full">
                  <CreditCard className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-maroon">
                    Simulate Payment (Bypass Sandbox)
                  </h4>
                  <p className="text-[10px] text-gray-500 font-sans">
                    Fast payment bypass testing mode. Generates mock transaction codes.
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

          </div>
        </div>

        {/* Invoice Summary */}
        <aside className="bg-white border border-gold/15 p-6 rounded-sm space-y-6 shadow-sm">
          <h3 className="font-playfair text-base font-bold text-maroon uppercase tracking-wider pb-3 border-b border-gold/10">
            Invoice Summary
          </h3>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex justify-between text-gray-400">
              <span>Items Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 font-bold uppercase">Free</span>
            </div>
            <div className="h-[1px] bg-gold/15 mt-2" />
            <div className="flex justify-between text-sm text-maroon font-bold uppercase tracking-wider pt-2">
              <span>Payable Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {shippingAddress && (
            <div className="pt-4 border-t border-gold/10 space-y-2">
              <h4 className="font-sans text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Shipping Address
              </h4>
              <p className="text-[10px] font-sans text-gray-600 leading-relaxed font-light">
                <strong className="text-gray-800">{shippingAddress.name}</strong><br />
                {shippingAddress.addressLine1}, {shippingAddress.addressLine2 && `${shippingAddress.addressLine2}, `}
                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}<br />
                Phone: {shippingAddress.phone}
              </p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
