import React from 'react';
import { Truck } from 'lucide-react';

export default function CheckoutAddressForm({
  formData,
  errors,
  onChange,
  checkingEta,
  etaInfo,
}) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
  );
}
