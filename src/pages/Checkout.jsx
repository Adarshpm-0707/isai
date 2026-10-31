import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { checkoutService } from '../services/checkoutService';
import { validatePhone, validatePincode, validateEmail, validateRequired } from '../utils/validators';
import { getProductImage } from '../utils/productHelpers';
import { Truck, CreditCard, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
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

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'prepaid' | 'cod'
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
    }
  }, [profile]);

  // Fetch COD Settings
  useEffect(() => {
    checkoutService
      .getCodSettings()
      .then((settings) => {
        if (settings && settings.cod_fee !== undefined) {
          setCodFee(Number(settings.cod_fee));
        }
      })
      .catch(() => {});
  }, []);

  // Check Courier ETA on pincode entry
  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      setCheckingEta(true);
      checkoutService
        .checkServiceability(formData.pincode)
        .then((res) => {
          if (res && res.available) setEtaInfo(res);
          else setEtaInfo(null);
        })
        .catch(() => setEtaInfo(null))
        .finally(() => setCheckingEta(false));
    } else {
      setEtaInfo(null);
    }
  }, [formData.pincode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!validateRequired(formData.name)) errs.name = 'Full name is required';
    if (!validateEmail(formData.email)) errs.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) errs.phone = 'Valid 10-digit phone number is required';
    if (!validateRequired(formData.addressLine1)) errs.addressLine1 = 'Address line 1 is required';
    if (!validateRequired(formData.city)) errs.city = 'City is required';
    if (!validateRequired(formData.state)) errs.state = 'State is required';
    if (!validatePincode(formData.pincode)) errs.pincode = 'Valid 6-digit pincode is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const currentCodFee = paymentMethod === 'cod' ? codFee : 0;
  const finalTotal = Math.max(0, totalAmount + currentCodFee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      if (paymentMethod === 'cod') {
        const order = await checkoutService.createCodOrder({
          cartItems,
          shippingAddress: formData,
          coupon: appliedCoupon,
          subtotal,
          discount,
          shippingFee,
          codFee,
          totalAmount: finalTotal,
        });
        clearCart();
        navigate('/order-success', { state: { order, orderId: order.id } });
      } else {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          alert('Razorpay SDK failed to load. Please check your internet connection.');
          setSubmitting(false);
          return;
        }

        const rzpOrder = await checkoutService.createRazorpayOrder(finalTotal);
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'Isaitarang Sarees',
          description: 'Payment for your handcrafted saree order',
          order_id: rzpOrder.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#C86A27' },
          handler: async (response) => {
            try {
              const verifiedOrder = await checkoutService.verifyAndSaveOrder({
                razorpayResponse: response,
                cartItems,
                shippingAddress: formData,
                coupon: appliedCoupon,
                subtotal,
                discount,
                shippingFee,
                totalAmount: finalTotal,
              });
              clearCart();
              navigate('/order-success', { state: { order: verifiedOrder, orderId: verifiedOrder.id } });
            } catch (vErr) {
              alert('Payment verification failed: ' + vErr.message);
            }
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setSubmitting(false);
      }
    } catch (err) {
      alert(err.message || 'Something went wrong while placing order.');
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#120B09] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-serif text-2xl text-[#FDF8F4] mb-3">No Items to Checkout</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-full bg-[#C86A27] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
            Delivery & Payment
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Checkout
          </h1>
          <FloralOrnament className="mt-1" />
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping Address & Payment Selection */}
          <div className="lg:col-span-8 space-y-6">
            {/* Address Form Card */}
            <div className="bg-[#1E130F] border border-[#35221B] p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <h3 className="font-serif text-lg font-semibold text-[#FDF8F4] pb-3 border-b border-[#2C1C16]">
                Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="e.g. Radhika Menon"
                  />
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="radhika@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    Phone (10 digits) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="House / Flat No., Apartment, Street"
                  />
                  {errors.addressLine1 && <p className="text-xs text-red-400">{errors.addressLine1}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#8E7B6F] tracking-wider">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="Landmark, Area"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="Chennai"
                  />
                  {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="Tamil Nadu"
                  />
                  {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none"
                    placeholder="600001"
                  />
                  {errors.pincode && <p className="text-xs text-red-400">{errors.pincode}</p>}
                  {checkingEta && (
                    <p className="text-xs text-[#DFC18A] animate-pulse">Checking pincode serviceability...</p>
                  )}
                  {etaInfo && (
                    <div className="mt-2 bg-[#160E0B] border border-[#DFC18A]/40 p-2.5 rounded-lg flex items-center gap-2 text-xs text-[#DFC18A]">
                      <Truck className="w-4 h-4 text-[#C86A27]" />
                      <span>
                        Delivery via <strong>{etaInfo.courier_name}</strong>: Estimated arrival in{' '}
                        <strong>{etaInfo.etd}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-[#1E130F] border border-[#35221B] p-6 sm:p-8 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-serif text-lg font-semibold text-[#FDF8F4] pb-3 border-b border-[#2C1C16]">
                Payment Option
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#DFC18A] bg-[#160E0B]'
                      : 'border-[#35221B] bg-[#160E0B]/50 hover:border-[#35221B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#C86A27]"
                    />
                    <div>
                      <span className="block font-semibold text-sm text-[#FDF8F4]">
                        Cash on Delivery
                      </span>
                      <span className="text-xs text-[#8E7B6F]">
                        Pay securely with cash upon doorstep delivery (+₹{codFee} fee)
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-[#DFC18A]" />
                </label>

                <label
                  onClick={() => setPaymentMethod('prepaid')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'prepaid'
                      ? 'border-[#DFC18A] bg-[#160E0B]'
                      : 'border-[#35221B] bg-[#160E0B]/50 hover:border-[#35221B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="prepaid"
                      checked={paymentMethod === 'prepaid'}
                      onChange={() => setPaymentMethod('prepaid')}
                      className="accent-[#C86A27]"
                    />
                    <div>
                      <span className="block font-semibold text-sm text-[#FDF8F4]">
                        Online Payment (UPI, Cards, Netbanking)
                      </span>
                      <span className="text-xs text-[#8E7B6F]">
                        Zero transaction fees with instant Razorpay checkout
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#DFC18A]" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#1E130F] border border-[#35221B] p-6 rounded-2xl space-y-5 shadow-xl text-[#FDF8F4]">
              <h3 className="font-serif text-lg font-semibold text-[#FDF8F4] pb-3 border-b border-[#2C1C16]">
                Order Review
              </h3>

              {/* Items List */}
              <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const prod = item.product || item;
                  const pId = item.product_id || prod.id;
                  const qty = item.quantity || item.qty || 1;
                  const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;

                  return (
                    <div key={item.id || pId} className="flex gap-3 items-center">
                      <div className="w-12 aspect-[3/4] rounded-lg overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0">
                        <img
                          src={getProductImage(prod)}
                          alt={prod.name || item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#FDF8F4] truncate">
                          {prod.name || item.name}
                        </h4>
                        <p className="text-[11px] text-[#8E7B6F]">
                          Qty: {qty} × ₹{unitPrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-[#C7B5A7] border-t border-[#2C1C16] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FDF8F4]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#DFC18A]">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <span className="text-[#4ADE80]">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between">
                    <span>COD Handling Fee</span>
                    <span>₹{codFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#FDF8F4] border-t border-[#2C1C16] pt-3">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                {submitting
                  ? 'Processing Order...'
                  : paymentMethod === 'cod'
                  ? 'Confirm COD Order'
                  : 'Pay with Razorpay'}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[#8E7B6F] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />
                <span>SSL Encrypted Checkout • Verified Weaver Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
