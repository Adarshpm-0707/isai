import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, UserCheck, Database, Server, Mail } from "lucide-react";
import { GoldLine } from "../components/layout/OnamEffects";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 40%,#0C2317 100%)", color: "#F3E5AB" }}>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#D4AF37] hover:underline">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Quick Legal Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#0A1810] p-1 rounded-lg border border-[#D4AF37]/30">
            <button
              onClick={() => navigate("/privacy-policy")}
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0C2317]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms-conditions")}
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        <div>
          <GoldLine />
        </div>

        <div className="text-center space-y-3">
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase block">PRIVACY &amp; DATA GOVERNANCE</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase tracking-wide text-[#F3E5AB]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#EADFC9]/80 font-light max-w-xl mx-auto leading-relaxed">
            At Isai Tarang Private Limited, we hold your trust with the highest regard. This Privacy Policy details how your personal data is collected, protected, and processed across our digital platforms.
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl" style={{ background: "rgba(10,24,16,0.95)", border: "1.5px solid rgba(212,175,55,0.35)" }}>
          
          {/* Section 1 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">1. Personal Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              When you browse our luxury Kerala handloom store, register an account, or initiate a purchase, we collect necessary identifying information:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-[#EADFC9]/80 font-light space-y-1.5 pl-2">
              <li><strong>Contact Identifiers:</strong> Full name, email address, phone number, and delivery location.</li>
              <li><strong>Authentication Data:</strong> Secure OAuth tokens via Google Sign-In or encrypted account credentials.</li>
              <li><strong>Transactional Logs:</strong> Order histories, customized saree drape preferences, and payment receipt tokens.</li>
              <li><strong>Technical Metadata:</strong> Device IP address, web browser type, and navigation session cookies.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">2. How We Utilize Your Data</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              We process your personal information strictly for legitimate commercial and operational purposes:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-[#EADFC9]/80 font-light space-y-1.5 pl-2">
              <li>Fulfilling and dispatching your handloom saree orders straight from master artisan looms.</li>
              <li>Sending order status updates, tracking info, and customer service communications.</li>
              <li>Safeguarding our platform against fraudulent transactions or unauthorized access.</li>
              <li>Continuously refining store user experience based on browsing telemetry.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">3. Third-Party Disclosures &amp; Partners</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              We do not sell, lease, or monetize your personal details. We share your data exclusively with essential infrastructure providers necessary for completing your purchases:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-[#EADFC9]/80 font-light space-y-1.5 pl-2">
              <li><strong>Payment Gateways:</strong> Encrypted processing via Razorpay &amp; Supabase Auth.</li>
              <li><strong>Logistics Partners:</strong> Express shipping providers for parcel delivery.</li>
              <li><strong>Legal Compliance:</strong> Government authorities only when required under Indian law.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">4. Data Retention &amp; Security</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              We employ SSL (TLS 1.3) encryption across all endpoints and store user profiles in secured PostgreSQL databases behind multi-layer firewall policies. Account data is retained only for as long as your account remains active or as required for accounting compliance.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">5. Your Privacy Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              As a valued customer, you hold full rights regarding your data:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-[#EADFC9]/80 font-light space-y-1.5 pl-2">
              <li>Request a full copy of the personal information stored in our system.</li>
              <li>Request correction or updating of inaccurate profile or address info.</li>
              <li>Request complete deletion of your customer account and stored records.</li>
            </ul>
          </section>

          {/* Contact Section */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Mail className="w-5 h-5" />
              <h2 className="font-serif text-lg font-bold uppercase text-[#F3E5AB]">Data Protection Officer</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              To exercise your privacy rights or submit privacy inquiries, please contact our Data Officer:
            </p>
            <div className="p-4 rounded-xl bg-[#081810] border border-[#D4AF37]/30 text-xs sm:text-sm space-y-1">
              <p className="font-bold text-[#F3E5AB]">Isai Tarang Private Limited</p>
              <p className="text-[#EADFC9]/80">Address: Pallikkunnu, Kannur, Kerala 670004, India</p>
              <p className="text-[#EADFC9]/80">Email: <a href="mailto:isaitarang9@gmail.com" className="text-[#FFD54F] underline font-bold">isaitarang9@gmail.com</a></p>
              <p className="text-[#EADFC9]/80">Phone: <a href="tel:+919048868444" className="text-[#FFD54F] font-bold">+91 9048868444</a></p>
            </div>
          </section>

        </div>

        <div>
          <GoldLine />
        </div>
      </div>

    </div>
  );
}
