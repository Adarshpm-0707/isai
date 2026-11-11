import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ShoppingBag, ClipboardList, Printer, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import { printOrderInvoice } from '../utils/orderReportUtils';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderState = location.state || {};
  const orderId = orderState.orderId;
  const totalAmount = orderState.totalAmount || 0;
  const items = orderState.items || [];
  const shippingAddress = orderState.shippingAddress || {};
  const paymentMethod = orderState.paymentMethod || 'Cash on Delivery / Direct Order';
  const orderDate = orderState.date || new Date().toLocaleDateString('en-IN');

  const [isPrinting, setIsPrinting] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
      return;
    }

    // Printing machine sound/motion duration simulation (2.6 seconds)
    const printTimer = setTimeout(() => {
      setIsPrinting(false);
    }, 2600);

    return () => clearTimeout(printTimer);
  }, [orderId, navigate]);

  const handleDownloadInvoice = () => {
    printOrderInvoice({
      id: orderId,
      order_id: orderId,
      items,
      shipping_address: shippingAddress,
      total: totalAmount,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      created_at: orderDate,
      status: 'confirmed',
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0705] flex flex-col items-center justify-center px-4 py-12 text-[#FDF8F4] selection:bg-[#C86A27]/30">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6 text-center"
      >
        {/* Brand Logo */}
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>

        {/* Checkmark icon with subtle pulse */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.15 }}
            className="w-16 h-16 rounded-full bg-[#1A0E0A] border-2 border-[#DFC18A] flex items-center justify-center shadow-2xl relative"
          >
            <CheckCircle2 className="w-8 h-8 text-[#C86A27]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </motion.div>
        </div>

        <div className="space-y-1">
          <p className="text-[#DFC18A] text-xs font-semibold tracking-[0.28em] uppercase">
            Order Confirmed & Verified
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Thank You for Your Order
          </h1>
          <FloralOrnament className="mt-1" />
        </div>

        <p className="text-xs sm:text-sm text-[#C7B5A7] font-light max-w-sm mx-auto">
          Your handcrafted saree is queued for weaving. Your verified proof-of-purchase receipt is being printed below.
        </p>

        {/* ========================================================================= */}
        {/* PRINTING MACHINE & THERMAL RECEIPT DISPENSING ANIMATION CONTAINER       */}
        {/* ========================================================================= */}
        <div className="relative pt-2">
          
          {/* PRINTER HARDWARE TOP CASING */}
          <div className="relative z-20 bg-gradient-to-b from-[#241510] to-[#170D09] border-t-2 border-x-2 border-[#3D251C] rounded-t-2xl px-5 pt-3.5 pb-2 shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Printer Hardware Badge */}
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#DFC18A]" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#DFC18A]">
                  ISAITARANG POS-90
                </span>
              </div>

              {/* Status Indicator LED lights */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-[9px] font-mono uppercase text-[#A8988B]">PWR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPrinting
                        ? 'bg-amber-400 animate-ping shadow-[0_0_8px_rgba(251,191,36,1)]'
                        : 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]'
                    }`}
                  />
                  <span className="text-[9px] font-mono uppercase text-[#A8988B]">
                    {isPrinting ? 'FEED' : 'READY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Printer Output Slot (The slit through which the receipt slides out) */}
            <div className="relative mt-2.5 w-full h-2.5 bg-[#080403] rounded-full border border-[#3A2219] overflow-hidden shadow-inner flex items-center justify-center">
              <div className="w-11/12 h-[2px] bg-black/90" />
            </div>
          </div>

          {/* RECEIPT PAPER CONTAINER WITH STEPPED PRINTING ANIMATION */}
          <div className="relative overflow-hidden pt-0 px-2 -mt-1">
            <motion.div
              // Simulated dot-matrix / thermal stepper motor dispensing
              initial={{ y: -420, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 2.3,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: [0.25, 1, 0.5, 1],
                delay: 0.25,
              }}
              className="relative text-[#1D1714] bg-[#FAF7F0] shadow-2xl rounded-b-lg font-mono text-left pt-5 pb-6 px-6 sm:px-7 select-none border-x border-b border-[#D8CEBC]"
              style={{
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.65))',
              }}
            >
              {/* Thermal Laser Scanning Bar (Fades out when done) */}
              {isPrinting && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2.1, ease: 'linear', repeat: 1 }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C86A27] to-transparent pointer-events-none z-30 opacity-70"
                />
              )}

              {/* Jagged Sawtooth Perforated Edge Top */}
              <div className="absolute top-0 left-0 right-0 -translate-y-[90%] overflow-hidden h-2 pointer-events-none">
                <svg viewBox="0 0 100 8" className="w-full text-[#FAF7F0] fill-current" preserveAspectRatio="none">
                  <polygon points="0,0 2.5,8 5,0 7.5,8 10,0 12.5,8 15,0 17.5,8 20,0 22.5,8 25,0 27.5,8 30,0 32.5,8 35,0 37.5,8 40,0 42.5,8 45,0 47.5,8 50,0 52.5,8 55,0 57.5,8 60,0 62.5,8 65,0 67.5,8 70,0 72.5,8 75,0 77.5,8 80,0 82.5,8 85,0 87.5,8 90,0 92.5,8 95,0 97.5,8 100,0 100,8 0,8" />
                </svg>
              </div>

              {/* RECEIPT HEADER */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-[#B8AA98]">
                <h3 className="font-serif font-black tracking-wider text-lg text-[#140E0C]">
                  ISAITARANG
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-[#5A4B42]">
                  Handcrafted Heritage Sarees
                </p>
                <p className="text-[9px] text-[#786960]">
                  Kannur, Kerala &bull; Ph: +91 9048868444
                </p>
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#EDE5D5] text-[#3A2D25] border border-[#C5B7A5]">
                    Official Sales Receipt
                  </span>
                </div>
              </div>

              {/* RECEIPT META */}
              <div className="py-3 text-[11px] space-y-1 border-b border-dashed border-[#B8AA98] text-[#3C3028]">
                <div className="flex justify-between">
                  <span className="text-[#6D5D53]">Receipt ID:</span>
                  <span className="font-bold text-[#140E0C]">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D5D53]">Date & Time:</span>
                  <span>{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D5D53]">Billed To:</span>
                  <span className="font-semibold text-[#140E0C]">
                    {shippingAddress.name || 'Valued Patron'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D5D53]">Payment:</span>
                  <span className="font-medium text-[#140E0C]">{paymentMethod}</span>
                </div>
              </div>

              {/* PURCHASED ITEMS TABLE */}
              <div className="py-3 space-y-2 border-b-2 border-dashed border-[#B8AA98] text-[11px]">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#7A6B61] pb-1">
                  <span>Item</span>
                  <span>Total</span>
                </div>

                {(items.length > 0 ? items : [{ name: 'Handcrafted Heritage Saree', qty: 1, price: totalAmount }]).map(
                  (it, index) => (
                    <div key={index} className="flex justify-between items-start gap-2">
                      <div className="leading-tight">
                        <p className="font-bold text-[#140E0C]">{it.name || it.product?.name || 'Heritage Saree'}</p>
                        <p className="text-[10px] text-[#6E5F55]">
                          Qty: {it.qty || it.quantity || 1} &times; ₹{Number(it.price || it.product?.price || totalAmount).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="font-bold text-[#140E0C] whitespace-nowrap">
                        ₹{Number((it.price || it.product?.price || totalAmount) * (it.qty || it.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* RECEIPT TOTALS */}
              <div className="pt-3 pb-2 space-y-1 text-xs">
                <div className="flex justify-between text-[#6D5D53]">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6D5D53]">
                  <span>Shipping & Handling</span>
                  <span className="font-bold text-emerald-800 uppercase text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#C7BBAA] font-bold text-sm text-[#140E0C]">
                  <span>Amount Paid</span>
                  <span className="text-[#8F4412] font-black text-base">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* BARCODE GRAPHIC */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#B8AA98] flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-[2px] h-9 w-full justify-center px-4">
                  {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                    <div
                      key={i}
                      className="bg-[#2D211B] h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] tracking-widest text-[#786960] uppercase">
                  * {orderId} *
                </p>
              </div>

              {/* Sawtooth Jagged Tear Edge Bottom */}
              <div className="absolute -bottom-2 left-0 right-0 overflow-hidden h-2.5 pointer-events-none">
                <svg viewBox="0 0 100 8" className="w-full text-[#FAF7F0] fill-current" preserveAspectRatio="none">
                  <polygon points="0,0 2.5,8 5,0 7.5,8 10,0 12.5,8 15,0 17.5,8 20,0 22.5,8 25,0 27.5,8 30,0 32.5,8 35,0 37.5,8 40,0 42.5,8 45,0 47.5,8 50,0 52.5,8 55,0 57.5,8 60,0 62.5,8 65,0 67.5,8 70,0 72.5,8 75,0 77.5,8 80,0 82.5,8 85,0 87.5,8 90,0 92.5,8 95,0 97.5,8 100,0 100,0 0,0" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Controls & Download Invoice Trigger */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownloadInvoice}
            className="w-full py-3.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-[#C86A27]/20"
          >
            <Download size={15} /> Download Official Tax Invoice (PDF)
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 py-3 rounded-full border border-[#35221B] bg-[#1A0E0A] text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#FDF8F4] hover:border-[#DFC18A] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClipboardList size={14} /> View My Orders
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex-1 py-3 rounded-full bg-[#120704] border border-[#DFC18A]/40 text-xs font-semibold uppercase tracking-wider text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={14} /> Continue Shopping
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}