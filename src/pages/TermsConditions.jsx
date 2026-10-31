import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, RefreshCw, Truck, ShieldAlert } from 'lucide-react';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#120B09] text-[#FDF8F4] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase font-medium text-[#DFC18A] hover:underline"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Quick Legal Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#1E130F] p-1 rounded-full border border-[#35221B]">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#DFC18A]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-conditions')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C86A27] text-white"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo size="md" />
          </div>
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
            Legal Agreement
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Terms of Service
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#8E7B6F]">Last updated: March 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl text-xs sm:text-sm text-[#C7B5A7] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#DFC18A]" /> 1. Handcrafted Nature of Sarees
            </h2>
            <p>
              Each saree at Isaitarang is handcrafted by skilled artisans. Due to the nature of authentic handloom weaving, subtle variations in thread tension, slubs, and color nuances are hallmarks of human artistry rather than manufacturing defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#DFC18A]" /> 2. Shipping &amp; Delivery
            </h2>
            <p>
              We provide insured pan-India delivery. Orders are typically processed within 24 to 48 business hours and delivered within 3 to 7 working days depending on destination location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#DFC18A]" /> 3. Returns &amp; Exchanges
            </h2>
            <p>
              We offer a straightforward 7-day return policy from the date of delivery for unused sarees in their original packaging with tags intact. Hand-stitched custom blouse orders are non-returnable once customized.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#DFC18A]" /> 4. Pricing &amp; Taxes
            </h2>
            <p>
              All prices shown on the website are in Indian Rupees (INR) and are inclusive of applicable GST taxes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
