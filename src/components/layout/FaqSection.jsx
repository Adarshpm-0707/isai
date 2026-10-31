import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { FloralOrnament } from '../reusable/FloralOrnament';
import { LotusEmblem } from '../reusable/BrandLogo';

export const FAQ_DATA = [
  {
    id: 1,
    question: 'Can I return or exchange a saree if I don\'t like it?',
    category: 'Returns & Exchange',
    answer: (
      <>
        We kindly request you to review the product details, images, and videos carefully before placing your order. As each saree is selected with care,{' '}
        <strong className="text-[#DFC18A] font-medium">we do not accept returns, exchanges, or refunds</strong> once an order is confirmed.
      </>
    ),
  },
  {
    id: 2,
    question: 'Is an unboxing video mandatory?',
    category: 'Orders & Safety',
    answer: (
      <>
        Yes, we strongly recommend recording a{' '}
        <strong className="text-[#DFC18A] font-medium">continuous unboxing video</strong> from the moment you open the sealed package. This helps us verify any transit damage, missing items, or incorrect products. Claims may not be considered without suitable video evidence.
      </>
    ),
  },
  {
    id: 3,
    question: 'What happens if my package is returned to the sender?',
    category: 'Shipping & Delivery',
    answer: (
      <>
        If a package is returned due to an incorrect address, failed delivery attempts, or non-acceptance, please contact us immediately. Reshipping may involve additional charges. Any refund or resolution will be handled in accordance with our applicable policies and legal obligations.
      </>
    ),
  },
  {
    id: 4,
    question: 'How long does delivery take? Do you offer express shipping?',
    category: 'Shipping & Delivery',
    answer: (
      <>
        Orders are generally delivered within{' '}
        <strong className="text-[#DFC18A] font-medium">4–5 working days after dispatch</strong>, depending on your location and courier service. Express shipping may be available on request, subject to availability and additional charges. Please contact us before placing your order to check.
      </>
    ),
  },
  {
    id: 5,
    question: 'How can I contact Isai Tarang?',
    category: 'Contact & Support',
    answer: (
      <div className="space-y-3">
        <p>
          We would love to hear from you! For product enquiries, price details, availability, and order assistance, contact us through WhatsApp or email.
        </p>
        <ul className="space-y-1.5 pt-1 text-[#EADFC9]">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFC18A]" />
            <span><strong className="text-[#DFC18A] font-medium">WhatsApp / Phone:</strong>{' '}
              <a href="tel:+919048868444" className="text-[#DFC18A] hover:underline underline-offset-2">9048868444</a>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFC18A]" />
            <span><strong className="text-[#DFC18A] font-medium">Email:</strong>{' '}
              <a href="mailto:isaitarang9@gmail.com" className="text-[#DFC18A] hover:underline underline-offset-2">isaitarang9@gmail.com</a>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFC18A]" />
            <span><strong className="text-[#DFC18A] font-medium">Website:</strong>{' '}
              <a href="https://www.isaitarang.com" target="_blank" rel="noreferrer" className="text-[#DFC18A] hover:underline underline-offset-2">www.isaitarang.com</a>
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 6,
    question: 'Do you offer international shipping?',
    category: 'Shipping & Delivery',
    answer: (
      <>
        Currently, we offer shipping across India. For international orders, please contact us to enquire about availability, shipping charges, customs duties, and delivery timelines.
      </>
    ),
  },
  {
    id: 7,
    question: 'What payment methods do you accept?',
    category: 'Payments',
    answer: (
      <>
        We accept payments through <strong className="text-[#DFC18A] font-medium">Google Pay (GPay)</strong> and <strong className="text-[#DFC18A] font-medium">bank transfer</strong>. Payment details will be shared during order confirmation. Orders will be processed after payment verification.
      </>
    ),
  },
  {
    id: 8,
    question: 'Is Cash on Delivery (COD) available?',
    category: 'Payments',
    answer: (
      <>
        Currently, <strong className="text-[#DFC18A] font-medium">we do not offer Cash on Delivery (COD)</strong>. All orders must be prepaid through our accepted payment methods.
      </>
    ),
  },
  {
    id: 9,
    question: 'Will the saree colour look exactly like the pictures?',
    category: 'Product & Craft',
    answer: (
      <>
        We make every effort to display our sarees as accurately as possible. However, slight variations in colour may occur due to lighting, photography, and screen settings. For a clearer view of the colour, design, and zari details, you may request a product video before purchasing.
      </>
    ),
  },
  {
    id: 10,
    question: 'Can I see the saree on a video call before ordering?',
    category: 'Product & Craft',
    answer: (
      <>
        <strong className="text-[#DFC18A] font-medium">Absolutely!</strong> We understand that choosing the perfect saree is special. You can request a video call by scheduling an appointment with us, subject to availability.
      </>
    ),
  },
];

export default function FaqSection({ isFullPage = false }) {
  const [openId, setOpenId] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Returns & Exchange', 'Shipping & Delivery', 'Payments', 'Product & Craft', 'Contact & Support'];

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className={`relative bg-[#120B09] text-[#FDF8F4] overflow-hidden ${isFullPage ? 'py-16 sm:py-24' : 'py-14 sm:py-20 border-t border-[#261711]'}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#C86A27]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DFC18A]/30 bg-[#1A100C]/70 mb-3.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#DFC18A]" />
            <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#DFC18A]">
              Frequently Asked Questions
            </span>
          </div>

          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#FDF8F4] leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Got Questions?{' '}
            <span className="italic font-light text-[#D4855A]">
              We have answers.
            </span>
          </h2>

          <FloralOrnament className="mt-2" />

          <p className="text-xs sm:text-sm text-[#C7B5A7] mt-3 font-light leading-relaxed">
            Everything you need to know about our handcrafted sarees, ordering, shipping timelines, and care policies.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#DFC18A] text-[#120B09] font-semibold shadow-[0_2px_12px_rgba(223,193,138,0.35)]'
                  : 'bg-[#1C120E] text-[#C7B5A7] hover:text-[#FDF8F4] border border-[#2F1C15] hover:border-[#DFC18A]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 sm:space-y-3.5 max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const displayNum = String(faq.id).padStart(2, '0');

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-[#1C120E] border-[#DFC18A]/50 shadow-[0_8px_30px_rgba(0,0,0,0.55)]'
                    : 'bg-[#160E0B]/85 hover:bg-[#1A100C] border-[#2C1B15] hover:border-[#3D251D]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                    <span
                      className={`font-serif text-xs sm:text-sm font-semibold tracking-wider transition-colors pt-0.5 shrink-0 ${
                        isOpen ? 'text-[#DFC18A]' : 'text-[#8E7B6F]'
                      }`}
                    >
                      {displayNum}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium leading-snug transition-colors ${
                        isOpen ? 'text-[#FDF8F4]' : 'text-[#E5D7CA]'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#DFC18A] text-[#120B09] border-[#DFC18A] rotate-180 shadow-[0_0_10px_rgba(223,193,138,0.4)]'
                        : 'bg-[#1F1410] text-[#C7B5A7] border-[#38231C]'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 pl-11 sm:pl-13 text-xs sm:text-[13px] text-[#C7B5A7] leading-relaxed font-light border-t border-[#261711] mt-1 pt-3.5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Support Banner */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] border border-[#3A241B] text-center max-w-2xl mx-auto shadow-xl">
          <LotusEmblem className="w-6 h-6 mx-auto mb-2 opacity-90" />
          <h3 className="font-serif text-base sm:text-lg text-[#FDF8F4] font-normal mb-1">
            Still have a question?
          </h3>
          <p className="text-xs text-[#C7B5A7] font-light mb-4 max-w-md mx-auto">
            Our saree styling team and customer concierges are always happy to assist you before and after your purchase.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/919048868444"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#163326] hover:bg-[#1E4535] text-[#FDF8F4] border border-[#2A563E] text-xs font-medium tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#DFC18A]" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href="tel:+919048868444"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#20140F] hover:bg-[#2A1B14] text-[#DFC18A] border border-[#DFC18A]/30 text-xs font-medium tracking-wider uppercase transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 9048868444</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
