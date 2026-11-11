import React from 'react';
import useCheckout from '../hooks/useCheckout';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import CheckoutAddressForm from '../components/checkout/CheckoutAddressForm';
import CheckoutPaymentMethod from '../components/checkout/CheckoutPaymentMethod';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';

export default function Checkout() {
  const {
    cartItems,
    subtotal,
    discount,
    shippingFee,
    formData,
    paymentMethod,
    setPaymentMethod,
    codFee,
    finalTotal,
    etaInfo,
    checkingEta,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  } = useCheckout();

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
            Delivery &amp; Payment
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
            <CheckoutAddressForm
              formData={formData}
              errors={errors}
              onChange={handleChange}
              checkingEta={checkingEta}
              etaInfo={etaInfo}
            />

            <CheckoutPaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              codFee={codFee}
            />
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <CheckoutOrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              shippingFee={shippingFee}
              paymentMethod={paymentMethod}
              codFee={codFee}
              finalTotal={finalTotal}
              submitting={submitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
