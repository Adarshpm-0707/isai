import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament, BotanicalBranch } from '../components/reusable/FloralOrnament';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      // In real backend or WhatsApp trigger, here we'd dispatch or send
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Isai Tarang, I would like to enquire about your sarees.\n\nName: ${formData.name || 'Customer'}\nMessage: ${formData.message || 'I have an enquiry'}`
    );
    window.open(`https://wa.me/919048868444?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] selection:bg-[#C86A27] selection:text-white">

      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#261711] overflow-hidden">
        {/* Subtle ambient amber glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-[#C86A27]/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DFC18A]/30 bg-[#1A100C]/70 mb-4"
          >
            <LotusEmblem className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#DFC18A]">
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            We Would Love to{' '}
            <span className="italic font-light text-[#D4855A]">Hear From You</span>
          </motion.h1>

          <FloralOrnament className="mt-3 mb-4" />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-[#C7B5A7] font-light max-w-2xl mx-auto leading-relaxed"
          >
            Whether you are inquiring about authentic Kerala weaves, temple Kanchipurams, bespoke bridal curation, or tracking your order — our team is here to assist you with warmth and devotion.
          </motion.p>
        </div>
      </section>

      {/* ── 2. MAIN CONTENT: CONTACT INFO CARD + MESSAGE FORM ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: THE SIGNATURE CONTACT INFORMATION CARD (Matches image layout & botanical flourish) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-[#1C120E] via-[#170E0B] to-[#140C0A] border border-[#3A241B] p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              
              {/* Botanical flourish top-right */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-40">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#DFC18A" strokeWidth="2">
                  <path d="M10,90 Q50,50 90,10" />
                  <path d="M40,60 Q45,45 60,40 Q55,55 40,60 Z" fill="#DFC18A" fillOpacity="0.15" />
                  <path d="M65,35 Q70,20 85,15 Q80,30 65,35 Z" fill="#DFC18A" fillOpacity="0.15" />
                  <path d="M25,75 Q20,60 10,65 Q15,80 25,75 Z" fill="#DFC18A" fillOpacity="0.15" />
                </svg>
              </div>

              {/* Botanical flourish bottom-left */}
              <div className="absolute bottom-4 left-4 pointer-events-none opacity-40 rotate-180">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#DFC18A" strokeWidth="2">
                  <path d="M10,90 Q50,50 90,10" />
                  <path d="M40,60 Q45,45 60,40 Q55,55 40,60 Z" fill="#DFC18A" fillOpacity="0.15" />
                  <path d="M65,35 Q70,20 85,15 Q80,30 65,35 Z" fill="#DFC18A" fillOpacity="0.15" />
                </svg>
              </div>

              {/* Card Title with Lotus Emblem */}
              <div className="text-center relative z-10 mb-8">
                <h2
                  className="font-serif text-2xl sm:text-3xl font-medium text-[#FDF8F4] leading-tight"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  Contact Information
                </h2>
                
                {/* Gold rule with central lotus flourish */}
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#DFC18A]/60" />
                  <LotusEmblem className="w-5 h-5 text-[#DFC18A]" />
                  <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#DFC18A]/60" />
                </div>
              </div>

              {/* Contact List (Exact matches from the user image) */}
              <div className="space-y-6 relative z-10">

                {/* 1. Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-[#2A1610] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:bg-[#C86A27] group-hover:text-white transition-all shadow-md">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-[#DFC18A]">
                      Phone
                    </h3>
                    <a
                      href="tel:+919048868444"
                      className="block text-xs sm:text-sm text-[#FDF8F4] font-medium tracking-wide hover:text-[#DFC18A] transition-colors mt-0.5"
                    >
                      +91 9048868444
                    </a>
                  </div>
                </div>

                {/* 2. Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-[#2A1610] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:bg-[#C86A27] group-hover:text-white transition-all shadow-md">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-[#DFC18A]">
                      Email
                    </h3>
                    <a
                      href="mailto:isaitarang9@gmail.com"
                      className="block text-xs sm:text-sm text-[#FDF8F4] font-medium hover:text-[#DFC18A] transition-colors break-all mt-0.5"
                    >
                      isaitarang9@gmail.com
                    </a>
                  </div>
                </div>

                {/* 3. Location */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-[#2A1610] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:bg-[#C86A27] group-hover:text-white transition-all shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-[#DFC18A]">
                      Location
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E2D5C8] font-light leading-relaxed mt-0.5">
                      Divyadeepam, P.O. Pallikkunnu,
                      <br />
                      Kannur – 670004
                    </p>
                  </div>
                </div>

                {/* 4. Business Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-[#2A1610] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:bg-[#C86A27] group-hover:text-white transition-all shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-[#DFC18A]">
                      Business Hours
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E2D5C8] font-light leading-relaxed mt-0.5">
                      Monday - Saturday: 10AM - 5PM
                      <br />
                      <span className="text-[#C86A27] font-medium">Sunday: Closed</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Callout Button */}
              <div className="mt-8 pt-6 border-t border-[#301D16] relative z-10">
                <a
                  href="https://wa.me/919048868444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#163326] hover:bg-[#1E4535] text-[#FDF8F4] border border-[#2A563E] text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(22,51,38,0.55)] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#DFC18A]" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>

            </div>
          </motion.div>

          {/* RIGHT: INTERACTIVE INQUIRY FORM */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl bg-[#19100D] border border-[#332019] p-6 sm:p-10 shadow-xl relative overflow-hidden">

              <div className="mb-6">
                <p className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                  Leave a Message
                </p>
                <h3
                  className="font-serif text-2xl sm:text-3xl text-[#FDF8F4] font-normal mt-1"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  Send Us an Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#C7B5A7] font-light mt-1.5 leading-relaxed">
                  Have a question about fabric purity, bridal sets, or express delivery? Write to us and our weavers & styling team will respond promptly.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 px-6 rounded-2xl bg-[#163326]/30 border border-[#2A563E] space-y-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#DFC18A] mx-auto" />
                  <h4 className="font-serif text-xl text-[#FDF8F4]">
                    Thank You for Your Message!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#C7B5A7] max-w-md mx-auto leading-relaxed font-light">
                    We have received your enquiry. One of our saree concierges will reach out to you within business hours.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full border border-[#DFC18A]/40 text-[#DFC18A] hover:bg-[#DFC18A]/10 text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#C7B5A7] font-medium mb-1.5">
                        Your Name <span className="text-[#D4855A]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Menon"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#120B09] border border-[#3A241B] focus:border-[#DFC18A] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#7E6D62] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#C7B5A7] font-medium mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#120B09] border border-[#3A241B] focus:border-[#DFC18A] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#7E6D62] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#C7B5A7] font-medium mb-1.5">
                        Email Address <span className="text-[#D4855A]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ananya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#120B09] border border-[#3A241B] focus:border-[#DFC18A] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#7E6D62] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#C7B5A7] font-medium mb-1.5">
                        Subject / Topic
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bridal Silk Consultation"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#120B09] border border-[#3A241B] focus:border-[#DFC18A] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#7E6D62] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C7B5A7] font-medium mb-1.5">
                      Your Message <span className="text-[#D4855A]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about the saree you are looking for, color preferences, or any questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#120B09] border border-[#3A241B] focus:border-[#DFC18A] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#FDF8F4] placeholder-[#7E6D62] outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(200,106,39,0.4)] cursor-pointer"
                    >
                      <span>Submit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#DFC18A]/40 text-[#DFC18A] hover:bg-[#DFC18A]/10 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. STORE LOCATION BANNER ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#261711]">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#170E0B] via-[#20140F] to-[#170E0B] border border-[#3A241B] text-center max-w-3xl mx-auto">
          <MapPin className="w-8 h-8 text-[#DFC18A] mx-auto mb-3" />
          <h3
            className="font-serif text-2xl sm:text-3xl text-[#FDF8F4] font-normal mb-2"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Visit Our Design Studio
          </h3>
          <p className="text-xs sm:text-sm text-[#C7B5A7] font-light max-w-md mx-auto leading-relaxed mb-6">
            Divyadeepam, P.O. Pallikkunnu, Kannur – 670004, Kerala.
            <br />
            Open Monday through Saturday from 10:00 AM to 5:00 PM.
          </p>
          <a
            href="https://maps.google.com/?q=Pallikkunnu,+Kannur,+Kerala+670004"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#DFC18A] text-[#DFC18A] hover:bg-[#DFC18A] hover:text-[#120B09] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
          >
            <span>Open in Google Maps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
}
