import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  RefreshCw,
  Truck,
  ShieldCheck,
  Globe,
  ShoppingBag,
  CheckCircle2,
  Mail,
  UserCheck,
  CreditCard,
} from 'lucide-react';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#120B09] text-[#FDF8F4] font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation & Legal Switcher */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#DFC18A] hover:underline"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Quick Legal Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#1E130F] p-1 rounded-full border border-[#35221B]">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#DFC18A] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-conditions')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C86A27] text-white shadow-sm"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BrandLogo size="md" />
          </div>
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
            Terms of Service &amp; Agreement
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Terms &amp; Conditions
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#8E7B6F]">Last updated: November 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl text-xs sm:text-sm text-[#C7B5A7] leading-relaxed">
          {/* 1. About Isai Tarang */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#DFC18A]" /> 1. About Isai Tarang
            </h2>
            <p className="text-[#FDF8F4] font-medium">
              Welcome to Isai Tarang – Your Destination for Beautiful Sarees.
            </p>
            <p>
              Isai Tarang is an online saree shopping platform offering a collection of traditional, contemporary and premium sarees. Our platform allows customers to explore saree collections, view product details, create accounts, and conveniently place orders online.
            </p>
            <p>
              By accessing or using our website (<a href="https://isaitarang.com" className="text-[#DFC18A] hover:underline">https://isaitarang.com</a>), you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          {/* 2. Our Services */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#DFC18A]" /> 2. Our Services
            </h2>
            <p>
              Isai Tarang provides customers with an interactive digital boutique to:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                'Browse and explore saree collections.',
                'View product descriptions, images and prices.',
                'Create and manage customer accounts.',
                'Sign in securely using Google.',
                'Place and manage online orders.',
                'Access customer support and order-related assistance.',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-[#160E0B] p-2.5 rounded-xl border border-[#2D1B15] text-xs text-[#FDF8F4]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#DFC18A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Account Registration & Google Sign-In */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[#DFC18A]" /> 3. Customer Accounts &amp; Authentication
            </h2>
            <p>
              Customers may browse collections as guests or register for a personalized account. You may register directly or sign in securely using your Google account via one-click OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          {/* 4. Handcrafted Saree Nature & Product Descriptions */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#DFC18A]" /> 4. Handcrafted Nature &amp; Product Accuracy
            </h2>
            <p>
              We strive to display our saree fabrics, colors, and zari motifs as accurately as possible. Because our sarees are authentic handloom creations crafted by generational weavers from Kuthampully, Kanchipuram, and Banaras, slight natural variations in weave texture, thread tension, and color shades are the true hallmark of genuine handcrafted artistry.
            </p>
          </section>

          {/* 5. Pricing, Orders & Payments */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#DFC18A]" /> 5. Orders, Pricing &amp; Payments
            </h2>
            <p>
              All prices listed on the website are in Indian Rupees (INR) and are inclusive of all applicable taxes. We accept payments through secure online channels (Credit/Debit Cards, UPI, Netbanking via Razorpay) as well as Cash on Delivery (COD) for eligible pin codes across India. Order confirmations are dispatched immediately upon checkout.
            </p>
          </section>

          {/* 6. Shipping & Returns */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#DFC18A]" /> 6. Pan-India Shipping &amp; 7-Day Returns
            </h2>
            <p>
              We provide insured delivery across all serviceable pin codes in India. Orders are typically dispatched within 24–48 business hours. We offer a 7-day return policy for unused sarees in their original condition and packaging.
            </p>
          </section>

          {/* 7. Privacy and Customer Security */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#DFC18A]" /> 7. Privacy and Customer Security
            </h2>
            <p>
              We respect our customers&apos; privacy and are committed to protecting their personal information. Information collected through our website is used to provide account services, process orders, communicate with customers and improve the shopping experience.
            </p>
            <p>
              For details about how we collect, use and protect your information, please read our{' '}
              <Link
                to="/privacy-policy"
                className="text-[#DFC18A] font-semibold underline underline-offset-4 hover:text-[#FDF8F4]"
              >
                Privacy Policy
              </Link>{' '}
              at{' '}
              <a
                href="https://isaitarang.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#DFC18A] font-mono text-xs hover:underline"
              >
                https://isaitarang.com/privacy-policy
              </a>
              .
            </p>
          </section>

          {/* 8. Contact Support */}
          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#DFC18A]" /> 8. Customer Support &amp; Assistance
            </h2>
            <p>
              For any questions, order assistance, or inquiries regarding these Terms and Conditions, our customer support team is available at:
            </p>
            <div className="bg-[#160E0B] p-4 rounded-xl border border-[#35221B] space-y-1.5">
              <p className="text-xs text-[#FDF8F4]">
                <strong>Store Name:</strong> Isai Tarang Sarees
              </p>
              <p className="text-xs text-[#DFC18A] font-mono">
                <strong>Email:</strong> <a href="mailto:isaitarang9@gmail.com" className="hover:underline">isaitarang9@gmail.com</a>
              </p>
              <p className="text-xs text-[#C7B5A7]">
                <strong>Website:</strong> <a href="https://isaitarang.com" target="_blank" rel="noopener noreferrer" className="hover:underline">https://isaitarang.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
