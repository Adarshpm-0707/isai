import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import PriceTag from '../components/reusable/PriceTag';
import BrandLogo from '../components/reusable/BrandLogo';
import { CreditCard, Landmark, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

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
  const { cartItems, totalAmount, clearCart } = useCart();

  const shippingAddress = location.state?.shippingAddress;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shippingAddress && cartItems.length > 0) {
      console.warn('Shipping address missing in location state. Redirecting to checkout.');
      navigate('/checkout');
    }
  }, [shippingAddress, cartItems, navigate]);

  const handleOrderCreation = async (paymentId) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Create order row
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: totalAmount,
          status: 'pending',
          payment_id: paymentId,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Create order items rows
      const itemsToInsert = cartItems.map((item) => {
        const prod = item.product || item;
        return {
          order_id: orderData.id,
          product_id: item.product_id || prod.id,
          qty: item.quantity || item.qty || 1,
          price: prod.discount_price ?? prod.price ?? item.price ?? 0,
        };
      });

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsErr) throw itemsErr;

      // 3. Clear cart
      await clearCart();

      // 4. Success redirect
      setLoading(false);
      navigate('/order-success', { state: { orderId: orderData.id, totalAmount } });
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to complete transaction.');
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isLoaded) {
      setError('Razorpay SDK failed to load. Please check your network connection.');
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Isaitarang Sarees',
      description: 'Handcrafted Heritage Saree Order',
      prefill: {
        name: shippingAddress?.name || user?.email?.split('@')[0],
        email: shippingAddress?.email || user?.email,
        contact: shippingAddress?.phone || '',
      },
      theme: { color: '#C86A27' },
      handler: async function (response) {
        await handleOrderCreation(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError('Payment transaction failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError('Failed to initialize Razorpay checkout. Please try simulation below.');
      setLoading(false);
    }
  };

  const handleSimulatedPayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      const mockPaymentId = `sim-pay-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await handleOrderCreation(mockPaymentId);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#120B09] flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <BrandLogo size="lg" className="mb-2" />
        <div className="w-10 h-10 border-2 border-[#C86A27] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-[#DFC18A] text-sm uppercase tracking-widest">
          Processing transaction... Please wait.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => navigate('/checkout')}
            className="inline-flex items-center text-xs text-[#DFC18A] uppercase tracking-wider font-semibold hover:text-[#FDF8F4] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Checkout
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] font-semibold text-[#DFC18A]">
            Secure Verification
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Payment Gateway
          </h1>
          <FloralOrnament className="mt-1" />
        </div>

        {error && (
          <div className="bg-[#1E130F] border border-red-500/40 text-red-300 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#2C1C16]">
            <div>
              <p className="text-xs text-[#8E7B6F]">Total Payable Amount</p>
              <p className="text-2xl font-bold text-[#FDF8F4] mt-0.5">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#160E0B] border border-[#35221B] text-[#DFC18A]">
              256-bit SSL Secure
            </span>
          </div>

          <div className="space-y-4">
            {/* Razorpay Gateway Card */}
            <div
              onClick={handleRazorpayPayment}
              className="p-5 rounded-xl border border-[#35221B] hover:border-[#DFC18A] bg-[#160E0B] transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#1E130F] border border-[#DFC18A]/30 flex items-center justify-center text-[#DFC18A]">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors">
                    Razorpay Online Checkout
                  </h4>
                  <p className="text-xs text-[#8E7B6F]">
                    UPI, Credit/Debit Cards, Netbanking & Wallets
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-[#C86A27] opacity-60 group-hover:opacity-100" />
            </div>

            {/* Test Simulation Mode */}
            <div
              onClick={handleSimulatedPayment}
              className="p-5 rounded-xl border border-[#35221B] hover:border-[#DFC18A]/60 bg-[#160E0B]/70 transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#1E130F] border border-[#35221B] flex items-center justify-center text-[#8E7B6F]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#C7B5A7] group-hover:text-[#FDF8F4] transition-colors">
                    Simulate Payment (Sandbox Test)
                  </h4>
                  <p className="text-xs text-[#8E7B6F]">
                    Instant test transaction for rapid order verification
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-[#8E7B6F] opacity-50 group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
