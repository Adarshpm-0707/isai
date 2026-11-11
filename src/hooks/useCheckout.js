import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from './useCart';
import useAuth from './useAuth';
import { checkoutService } from '../services/checkoutService';
import { validatePhone, validatePincode, validateEmail, validateRequired } from '../utils/validators';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function useCheckout() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }, []);

  const validate = useCallback(() => {
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
  }, [formData]);

  const currentCodFee = useMemo(
    () => (paymentMethod === 'cod' ? codFee : 0),
    [paymentMethod, codFee]
  );

  const finalTotal = useMemo(
    () => Math.max(0, totalAmount + currentCodFee),
    [totalAmount, currentCodFee]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();
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
            userId: user?.id || profile?.id || null,
          });
          clearCart();
          navigate('/order-success', {
            state: {
              order,
              orderId: order.id || order.order_id,
              totalAmount: finalTotal,
              items: cartItems,
              shippingAddress: formData,
              paymentMethod: 'Cash on Delivery (COD)',
              date: new Date().toLocaleDateString('en-IN'),
            },
          });
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
                  userId: user?.id || profile?.id || null,
                });
                clearCart();
                navigate('/order-success', {
                  state: {
                    order: verifiedOrder,
                    orderId: verifiedOrder.id || verifiedOrder.order_id,
                    totalAmount: finalTotal,
                    items: cartItems,
                    shippingAddress: formData,
                    paymentMethod: 'Online Payment (Prepaid)',
                    date: new Date().toLocaleDateString('en-IN'),
                  },
                });
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
    },
    [
      validate,
      paymentMethod,
      cartItems,
      formData,
      appliedCoupon,
      subtotal,
      discount,
      shippingFee,
      codFee,
      finalTotal,
      user,
      profile,
      clearCart,
      navigate,
    ]
  );

  return {
    cartItems,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    formData,
    paymentMethod,
    setPaymentMethod,
    codFee,
    currentCodFee,
    finalTotal,
    etaInfo,
    checkingEta,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  };
}

