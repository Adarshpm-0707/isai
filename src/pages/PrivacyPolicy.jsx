import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  ArrowLeft,
  UserCheck,
  Database,
  Server,
  Mail,
  CheckCircle2,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function PrivacyPolicy() {
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
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C86A27] text-white shadow-sm"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-conditions')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#DFC18A] transition-colors"
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
            Privacy &amp; Data Governance
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Privacy Policy
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#8E7B6F]">Last updated: November 2026</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl text-xs sm:text-sm text-[#C7B5A7] leading-relaxed">
          {/* 1. About Isai Tarang */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#DFC18A]" /> About Isai Tarang
            </h2>
            <p className="text-[#FDF8F4] font-medium">
              Welcome to Isai Tarang – Your Destination for Beautiful Sarees.
            </p>
            <p>
              Isai Tarang is an online saree shopping platform offering a collection of traditional, contemporary and premium sarees. Our platform allows customers to explore saree collections, view product details, create accounts, and conveniently place orders online.
            </p>
          </section>

          {/* 2. Our Services */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#DFC18A]" /> Our Services
            </h2>
            <p>
              Through our website, customers can access the following core services:
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

          {/* 3. Privacy and Customer Security */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#DFC18A]" /> Privacy and Customer Security
            </h2>
            <p>
              We respect our customers&apos; privacy and are committed to protecting their personal information. Information collected through our website is used to provide account services, process orders, communicate with customers and improve the shopping experience.
            </p>
            <p>
              For details about how we collect, use and protect your information, please read this complete Privacy Policy document.
            </p>
            <div className="p-3.5 bg-[#160E0B] rounded-xl border border-[#DFC18A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-[#DFC18A] font-semibold uppercase tracking-wider">
                Official Policy Link:
              </span>
              <a
                href="https://isaitarang.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#DFC18A] hover:underline font-mono"
              >
                https://isaitarang.com/privacy-policy
              </a>
            </div>
          </section>

          {/* 4. Information We Collect */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#DFC18A]" /> Information We Collect
            </h2>
            <p>We collect information you provide directly to us when using our platform:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#C7B5A7]">
              <li>
                <strong className="text-[#FDF8F4]">Customer Contact &amp; Shipping Details:</strong> Full name, delivery address, city, state, pincode, contact phone number, and email address for order fulfillment.
              </li>
              <li>
                <strong className="text-[#FDF8F4]">Google Sign-In &amp; Authentication:</strong> When you choose to sign in securely using Google OAuth, we receive your name, verified email address, and profile photo provided by Google. We never receive or store your Google account password.
              </li>
              <li>
                <strong className="text-[#FDF8F4]">Order &amp; Purchase History:</strong> Products ordered, order identification numbers, quantities, prices, delivery tracking notes, and transaction timestamps.
              </li>
            </ul>
          </section>

          {/* 5. How We Use Information */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[#DFC18A]" /> How We Use Your Information
            </h2>
            <p>The information we collect is strictly used to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#C7B5A7]">
              <li>Process, package, and deliver your handloom saree orders.</li>
              <li>Send real-time order confirmation, invoice, and courier delivery updates.</li>
              <li>Provide customer support and resolve order-related inquiries.</li>
              <li>Authenticate your account login sessions securely.</li>
              <li>Maintain and enhance our online shopping platform experience.</li>
            </ul>
            <p className="pt-1 text-[#FDF8F4] font-medium">
              We do not sell, rent, trade, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          {/* 6. Payment Processing & Security */}
          <section className="space-y-3 pb-6 border-b border-[#2C1C16]">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#DFC18A]" /> Payment Processing &amp; Security
            </h2>
            <p>
              Your payment security is our top priority. All online transactions are processed through certified, PCI-DSS compliant payment gateways (such as Razorpay). We do not collect, process, or store complete credit card numbers, debit card numbers, or UPI PINs on our servers.
            </p>
          </section>

          {/* 7. Contact Support & Inquiries */}
          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#DFC18A]" /> Contact Support &amp; Grievance
            </h2>
            <p>
              If you have any questions about this Privacy Policy, your customer account, or wish to review or update your personal information, please contact our support desk:
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
