import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => { if (!orderId) navigate("/", { replace: true }); }, [orderId, navigate]);
  if (!orderId) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)" }}>

      <div className="absolute top-0 left-0 right-0"><PookklamGarland count={26} /><GoldLine /></div>

      <SectionFlower size={50} className="absolute top-12 left-6 opacity-20 hidden md:block" />
      <SectionFlower size={40} className="absolute top-16 right-8 opacity-15 hidden md:block" />
      <SectionFlower size={44} className="absolute bottom-12 left-10 opacity-15 hidden md:block" />
      <SectionFlower size={36} className="absolute bottom-10 right-6 opacity-20 hidden md:block" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10 text-center">

        {/* Check icon */}
        <div className="flex justify-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{ background: "linear-gradient(135deg,#1A3C2B,#0C2317)", border: "2px solid #D4AF37" }}>
            <SectionFlower size={60} className="absolute opacity-20" />
            <CheckCircle2 className="w-10 h-10 relative z-10" style={{ color: "#D4AF37" }} />
          </motion.div>
        </div>

        <OnamPageHeading malayalam="ഓർഡർ സ്ഥിരീകരണം" english="ORDER CONFIRMED" />

        <p className="text-sm text-[#EADFC9]/75 max-w-sm mx-auto">
          Your order has been submitted. A confirmation email with shipping updates will be dispatched shortly.
        </p>

        {/* Receipt */}
        <div className="rounded-2xl p-6 space-y-4 shadow-2xl text-left"
          style={{ background: "linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))", border: "1.5px solid rgba(212,175,55,0.4)" }}>
          <div className="flex items-center gap-1.5 pb-3 border-b" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <SectionFlower size={18} />
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F3E5AB]">Receipt Details</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between"><span className="text-[#EADFC9]/60">Transaction Code</span><span className="font-mono text-[#D4AF37] font-bold">{orderId}</span></div>
            <div className="flex justify-between"><span className="text-[#EADFC9]/60">Total Paid</span><span className="text-[#D4AF37] font-bold">&#8377;{totalAmount.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-[#EADFC9]/60">Status</span>
              <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] text-[#D4AF37]"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}>
                Pending Fulfillment
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button onClick={() => navigate("/orders")}
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-[#D4AF37]"
            style={{ border: "1.5px solid rgba(212,175,55,0.5)", background: "rgba(12,35,23,0.8)" }}>
            <ClipboardList className="w-4 h-4" /> View Orders
          </button>
          <button onClick={() => navigate("/products")}
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
            style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317" }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}>
            <MiniFlower size={14} c1="#0C2317" c2="#1A3C2B" />
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /><PookklamGarland count={26} /></div>
    </div>
  );
}
