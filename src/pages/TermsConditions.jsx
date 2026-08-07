import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scroll, Award, RefreshCw, Scale, ArrowLeft, Truck, ShieldAlert, CreditCard, Mail } from "lucide-react";
import { GoldLine } from "../components/layout/OnamEffects";

export default function TermsConditions() {
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
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms-conditions")}
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0C2317]"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>

        <div>
          <GoldLine />
        </div>

        <div className="text-center space-y-3">
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase block">SERVICE AGREEMENT</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase tracking-wide text-[#F3E5AB]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#EADFC9]/80 font-light max-w-xl mx-auto leading-relaxed">
            Welcome to Isai Tarang. By accessing our platform or placing an order for our heritage Kerala handlooms, you agree to be bound by the terms outlined below.
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl" style={{ background: "rgba(10,24,16,0.95)", border: "1.5px solid rgba(212,175,55,0.35)" }}>
          
          {/* Section 1 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Scroll className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">1. Store Ownership &amp; Intellectual Property</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              All materials on this website, including photographs, saree designs, brand graphics, and written copy, are the exclusive intellectual property of Isai Tarang Private Limited. Unauthorized reproduction or commercial distribution without written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">2. Handloom Authenticity &amp; Product Characteristics</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              Our Kasavu sarees, Set Mundus, and handloom silks are individually woven by master artisans in Balaramapuram and Chendamangalam. Due to the handcrafted nature of genuine weaving:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-[#EADFC9]/80 font-light space-y-1.5 pl-2">
              <li>Minor variations in gold zari sheen, thread thickness, or motif alignment are natural markers of handloom art rather than defects.</li>
              <li>Product display colors may vary slightly depending on monitor color calibration.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">3. Pricing &amp; Payments</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              All prices are listed in Indian Rupees (INR) inclusive of applicable taxes. We accept payments via Google Pay, UPI, Net Banking, Credit/Debit cards, and Cash on Delivery (COD). We reserve the right to modify product prices without prior notice.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">4. Shipping &amp; Delivery Terms</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              Orders are dispatched within 1-3 business days. Estimated delivery timelines range from 3-7 business days across India depending on delivery pincodes. Isai Tarang is not liable for minor courier delays caused by weather conditions or regional holidays.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">5. Returns, Exchanges &amp; Cancellations</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              Cancellations are accepted within 24 hours of placing the order before dispatch. Returns or exchange requests for damaged or incorrect items must be reported within 7 days of receiving the parcel along with unboxing proof.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-b pb-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold uppercase text-[#F3E5AB]">6. Limitation of Liability &amp; Governing Law</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              These terms shall be governed by and construed under the laws of India. Any legal proceedings or claims arising from store transactions shall be subject to the exclusive jurisdiction of the courts located in Kannur, Kerala.
            </p>
          </section>

          {/* Contact Section */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Mail className="w-5 h-5" />
              <h2 className="font-serif text-lg font-bold uppercase text-[#F3E5AB]">Customer Relations &amp; Legal Notices</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed">
              For any questions regarding these terms, please contact our support desk:
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
