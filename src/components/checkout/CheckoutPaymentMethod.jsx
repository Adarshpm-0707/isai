import React from 'react';
import { Truck, CreditCard } from 'lucide-react';

export default function CheckoutPaymentMethod({
  paymentMethod,
  setPaymentMethod,
  codFee,
}) {
  return (
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
  );
}

