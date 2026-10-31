import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, UserCheck, Database, Server, Mail } from 'lucide-react';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function PrivacyPolicy() {
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
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C86A27] text-white"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-conditions')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#DFC18A]"
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
            Privacy &amp; Data Governance
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Privacy Policy
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#8E7B6F]">Last updated: March 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl text-xs sm:text-sm text-[#C7B5A7] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DFC18A]" /> 1. Commitment to Privacy
            </h2>
            <p>
              At Isaitarang (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your personal privacy and are committed to safeguarding the data you share with us. This Privacy Policy outlines our procedures concerning the collection, storage, and processing of customer information when you browse our boutique or purchase handwoven sarees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#DFC18A]" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#C7B5A7]">
              <li><strong>Contact &amp; Identity:</strong> Name, delivery address, contact telephone, and email address.</li>
              <li><strong>Order History:</strong> Sarees purchased, transaction timestamps, payment method status, and courier tracking details.</li>
              <li><strong>Authentication:</strong> Google OAuth identifiers stored securely via encrypted token authentication.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#DFC18A]" /> 3. Payment Processing &amp; Security
            </h2>
            <p>
              We do not store your complete credit/debit card numbers or UPI PINs. All financial payments are encrypted and processed through certified PCI-DSS compliant gateways like Razorpay.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-base sm:text-lg font-semibold text-[#DFC18A] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#DFC18A]" /> 4. Inquiries &amp; Grievance Redressal
            </h2>
            <p>
              For any questions regarding data protection or to request the deletion of your customer profile, reach us at:
            </p>
            <p className="font-mono text-[#DFC18A] bg-[#160E0B] p-3 rounded-xl border border-[#35221B] w-fit">
              isaitarang9@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
