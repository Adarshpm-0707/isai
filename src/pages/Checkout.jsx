import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import PriceTag from '../components/reusable/PriceTag';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { validatePhone, validatePincode, validateEmail, validateRequired } from '../utils/validators';
import { getProductImage } from '../utils/productHelpers';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  // Form Fields
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

  // Errors state
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-playfair text-2xl text-[#F6D18A] font-bold uppercase mb-4">No Items to Checkout</h2>
        <Button onClick={() => navigate('/products')}>Return to Shop</Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
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
      // Scroll to top of form
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // Success: navigate to Payment page carrying shipping data
    navigate('/payment', { state: { shippingAddress: formData } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#F6D18A] bg-transparent">
      <SectionHeading
        title="Shipping Details"
        subtitle="Confirm your shipping coordinates and verify order summary"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Shipping Form */}
        <div className="lg:col-span-2 bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 sm:p-8 rounded-sm space-y-6 shadow-xl">
          <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#F6D18A]/30">
            Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
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
              {errors.name && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.name}</p>}
            </div>

            {/* Email Address */}
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
              {errors.email && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.email}</p>}
            </div>

            {/* Phone Number */}
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
              {errors.phone && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.phone}</p>}
            </div>

            {/* Address Line 1 */}
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
              {errors.addressLine1 && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.addressLine1}</p>}
            </div>

            {/* Address Line 2 */}
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

            {/* City */}
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
                placeholder="Varanasi"
              />
              {errors.city && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.city}</p>}
            </div>

            {/* State */}
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
                placeholder="Uttar Pradesh"
              />
              {errors.state && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs uppercase font-bold text-[#F6D18A] tracking-wider">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full bg-[#F6D18A]/10 border border-[#F6D18A]/30 rounded-sm px-4 py-2.5 text-sm text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
                placeholder="221001"
              />
              {errors.pincode && <p className="text-xs text-[#F6D18A] font-sans font-bold">{errors.pincode}</p>}
            </div>

          </div>
        </div>

        {/* Right Side: Order summary */}
        <aside className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 rounded-sm space-y-6 shadow-xl text-[#F6D18A]">
          <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#F6D18A]/30">
            Order Review
          </h3>

          {/* Cart item summary list */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product_id} className="flex gap-3 items-center">
                <div className="relative w-12 aspect-[3/4] overflow-hidden bg-[#4A0000]/60 border border-[#FFE8A3]/30 flex-shrink-0 rounded-lg p-0.5 shadow-sm">
                  <img src={getProductImage(item.product)} alt="" className="absolute inset-0 w-full h-full object-cover blur-xs opacity-30 pointer-events-none" />
                  <img src={getProductImage(item.product)} alt={item.name} className="relative z-10 w-full h-full object-contain object-center rounded" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-sans text-[11px] font-bold text-[#F6D18A] truncate">{item.name}</h4>
                  <p className="text-[10px] text-[#D8A55A] font-sans font-medium">Qty: {item.qty} &times; ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[1px] bg-[#F6D18A]/30" />

          {/* Pricing calculations */}
          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between text-[#D8A55A] font-medium">
              <span>Items Total</span>
              <span className="font-bold text-[#F6D18A]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#D8A55A] font-medium">
              <span>Delivery Cost</span>
              <span className="text-[#F6D18A] font-bold uppercase">Free</span>
            </div>
            <div className="flex justify-between text-sm text-[#F6D18A] font-bold uppercase tracking-wider pt-2 border-t border-[#F6D18A]/20">
              <span>Total Payable</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              Continue to Payment
            </Button>
          </div>
        </aside>

      </form>
    </div>
  );
}
