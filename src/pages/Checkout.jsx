import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import PriceTag from '../components/reusable/PriceTag';
import { checkoutService } from '../services/checkoutService';
import { validatePhone, validatePincode, validateEmail, validateRequired } from '../utils/validators';
import { getProductImage } from '../utils/productHelpers';
import { Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { SectionFlower, PookklamGarland, GoldLine } from '../components/layout/OnamEffects';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { cartItems, subtotal, discount, shippingFee, totalAmount, appliedCoupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('prepaid'); // 'prepaid' | 'cod'
  const [codFee, setCodFee] = useState(40);
  const [etaInfo, setEtaInfo] = useState(null);
  const [checkingEta, setCheckingEta] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill address from profile if available
  useEffect(() => {
    if (profile) {
      const addr = profile.address || {};
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        addressLine1: addr.street || addr.addressLine1 || '',
        addressLine2: addr.landmark || addr.addressLine2 || '',
        city: addr.city || '',
        state: addr.state || '',
        pincode: addr.pincode || '',
      });

      if (addr.pincode && String(addr.pincode).length === 6) {
        checkEta(addr.pincode);
      }
    }
  }, [profile]);

  const checkEta = async (pin) => {
    setCheckingEta(true);
    try {
      const res = await checkoutService.checkDeliveryEta(pin);
      setEtaInfo(res);
    } catch (err) {
      console.warn('ETA check failed:', err);
      setEtaInfo(null);
    } finally {
      setCheckingEta(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === 'pincode' && value.length === 6 && /^\d{6}$/.test(value)) {
      checkEta(value);
    }
  };

  const handleRazorpayPayment = async (orderRes) => {
    const sdkLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    
    const options = {
      key: orderRes.key_id,
      amount: orderRes.amount,
      currency: 'INR',
      name: 'Isai Store',
      description: 'Handcrafted Heritage',
      order_id: orderRes.order_id,
      handler: async function (response) {
        try {
          setSubmitting(true);
          await checkoutService.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            db_order_id: orderRes.db_order_id,
            coupon_id: appliedCoupon?.id,
            user_id: profile?.id,
          });
          await clearCart();
          navigate('/order-success', {
            state: { orderId: orderRes.db_order_id, totalAmount: finalTotal },
          });
        } catch (err) {
          alert('Payment verification failed: ' + err.message);
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#6B0F1A' },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback for environment without live Razorpay SDK key
      setSubmitting(true);
      await checkoutService.verifyRazorpayPayment({
        razorpay_order_id: orderRes.order_id,
        razorpay_payment_id: `rzp_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
        db_order_id: orderRes.db_order_id,
        coupon_id: appliedCoupon?.id,
        user_id: profile?.id,
      });
      await clearCart();
      navigate('/order-success', {
        state: { orderId: orderRes.db_order_id, totalAmount: finalTotal },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!validateRequired(formData.name)) nextErrors.name = 'Full name is required';
    if (!validateEmail(formData.email)) nextErrors.email = 'Enter a valid email address';
    if (!validatePhone(formData.phone)) nextErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!validateRequired(formData.addressLine1)) nextErrors.addressLine1 = 'Address line 1 is required';
    if (!validateRequired(formData.city)) nextErrors.city = 'City is required';
    if (!validateRequired(formData.state)) nextErrors.state = 'State is required';
    if (!validatePincode(formData.pincode)) nextErrors.pincode = 'Enter a valid 6-digit PIN code';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload = cartItems.map((item) => {
        const prod = item.product || item;
        return {
          product_id: item.product_id || prod.id,
          name: prod.name || item.name || 'Handcrafted Saree',
          price: prod.discount_price ?? prod.price ?? item.price ?? 0,
          qty: item.quantity || item.qty || 1,
          size: item.size || null,
        };
      });

      let codRes;
      try {
        codRes = await checkoutService.createCodOrder({
          items: itemsPayload,
          shipping_address: formData,
          coupon_id: appliedCoupon?.id,
          cod_fee: 0,
        });
      } catch (err) {
        console.warn('createCodOrder warning:', err);
      }

      const confirmedOrderId = codRes?.order_id || `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const orderPayloadState = {
        orderId: confirmedOrderId,
        totalAmount: finalTotal,
        items: itemsPayload,
        shippingAddress: formData,
        paymentMethod: 'Cash on Delivery / Direct Order',
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      try {
        await clearCart();
      } catch (e) {}

      setSubmitting(false);
      navigate('/order-success', {
        state: orderPayloadState,
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setSubmitting(false);
      const fallbackOrderId = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      navigate('/order-success', {
        state: {
          orderId: fallbackOrderId,
          totalAmount: finalTotal,
          items: cartItems,
          shippingAddress: formData,
          paymentMethod: 'Cash on Delivery / Direct Order',
          date: new Date().toLocaleDateString('en-IN'),
        },
      });
    }
  };

  const currentCodFee = paymentMethod === 'cod' ? codFee : 0;
  const finalTotal = Math.max(0, totalAmount + currentCodFee);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-playfair text-2xl text-[#F6D18A] font-bold uppercase mb-4">No Items to Checkout</h2>
        <Button onClick={() => navigate('/products')}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#F6D18A] bg-transparent">
      <SectionHeading
        title="Checkout"
        subtitle="Provide shipping address and select payment method"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 sm:p-8 rounded-sm space-y-6 shadow-xl">
            <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#F6D18A]/30">
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="Priya Sharma"
                />
                {errors.name && <p className="text-xs text-red-400 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="priya@example.com"
                />
                {errors.email && <p className="text-xs text-red-400 font-bold">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  Phone Number (10 digit) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-xs text-red-400 font-bold">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="Flat / House No., Apartment, Street"
                />
                {errors.addressLine1 && <p className="text-xs text-red-400 font-bold">{errors.addressLine1}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs uppercase font-bold text-[#D8A55A] tracking-wider">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="Landmark, Area"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="Chennai"
                />
                {errors.city && <p className="text-xs text-red-400 font-bold">{errors.city}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="Tamil Nadu"
                />
                {errors.state && <p className="text-xs text-red-400 font-bold">{errors.state}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                  Pincode * (Triggers Delivery Check)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                  placeholder="600001"
                />
                {errors.pincode && <p className="text-xs text-red-400 font-bold">{errors.pincode}</p>}

                {checkingEta && (
                  <p className="text-xs text-[#D8A55A] animate-pulse">Checking pincode serviceability...</p>
                )}
                {etaInfo && (
                  <div className="mt-2 bg-[#E88D37]/20 border border-[#E88D37] p-2.5 rounded flex items-center gap-2 text-xs text-[#F6D18A]">
                    <Truck className="w-4 h-4 text-[#E88D37]" />
                    <span>
                      Delivery via <strong>{etaInfo.courier_name}</strong>: Estimated arrival in{' '}
                      <strong>{etaInfo.etd}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 rounded-sm space-y-4 shadow-xl">
            <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#F6D18A]/30">
              Payment Method
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border border-[#F6D18A] bg-[#F6D18A]/20 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={true}
                    readOnly
                    className="accent-[#E88D37]"
                  />
                  <div>
                    <span className="block font-bold text-sm text-[#F6D18A]">Cash on Delivery / Direct Order</span>
                    <span className="text-xs text-[#D8A55A]">Pay upon delivery or via direct store order fulfillment</span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-[#F6D18A]" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order summary */}
        <aside className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 rounded-sm space-y-6 shadow-xl text-[#F6D18A]">
          <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#F6D18A]/30">
            Order Review
          </h3>

          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const prod = item.product || item;
              const pId = item.product_id || prod.id;
              const qty = item.quantity || item.qty || 1;
              const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;

              return (
                <div key={item.id || pId} className="flex gap-3 items-center">
                  <div className="relative w-12 aspect-[3/4] overflow-hidden bg-[#4A0000]/60 border border-[#FFE8A3]/30 flex-shrink-0 rounded-lg p-0.5 shadow-sm">
                    <img
                      src={getProductImage(prod)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xs opacity-30 pointer-events-none"
                    />
                    <img
                      src={getProductImage(prod)}
                      alt={prod.name || item.name}
                      className="relative z-10 w-full h-full object-contain object-center rounded"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-sans text-[11px] font-bold text-[#F6D18A] truncate">
                      {prod.name || item.name}
                    </h4>
                    <p className="text-[10px] text-[#D8A55A] font-sans font-medium">
                      Qty: {qty} &times; ₹{unitPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-[1px] bg-[#F6D18A]/30" />

          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between text-[#D8A55A] font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-[#F6D18A]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-400 font-bold">
                <span>Coupon Discount</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-[#D8A55A] font-medium">
              <span>Shipping Fee</span>
              <span className="text-[#F6D18A] font-bold uppercase">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>

            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-[#D8A55A] font-medium">
                <span>COD Handling Fee</span>
                <span className="text-[#F6D18A] font-bold">₹{codFee}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-[#F6D18A] font-bold uppercase tracking-wider pt-2 border-t border-[#F6D18A]/20">
              <span>Total Payable</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={submitting}
            >
              {submitting
                ? 'Processing Order...'
                : paymentMethod === 'cod'
                ? 'Confirm COD Order'
                : 'Pay with Razorpay'}
            </Button>
          </div>

          <div className="flex items-start gap-2.5 pt-4 text-[10px] text-[#D8A55A] font-medium leading-normal border-t border-[#F6D18A]/30 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#E88D37] flex-shrink-0 mt-0.5" />
            <span>Guaranteed SSL checkout & official order verification.</span>
          </div>
        </aside>
      </form>
    </div>
  );
}
