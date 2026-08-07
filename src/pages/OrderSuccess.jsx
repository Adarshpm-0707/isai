import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../components/layout/OnamEffects";

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

      <div className="absolute top-0 left-0 right-0"><GoldLine /></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10 text-center">

        {/* Check icon */}
        <div className="flex justify-center">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative"
            style={{ background: "linear-gradient(135deg,#1A3C2B,#0C2317)", border: "2px solid #D4AF37" }}>
            <CheckCircle2 className="w-10 h-10 relative z-10" style={{ color: "#D4AF37" }} />
          </motion.div>
        </div>

        <div className="space-y-1">
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase block">SUCCESSFUL TRANSACTION</span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-[#F3E5AB]">ORDER CONFIRMED</h1>
        </div>

        <p className="text-sm text-[#EADFC9]/75 max-w-sm mx-auto">
          Your order has been submitted. A confirmation email with shipping updates will be dispatched shortly.
        </p>

        {/* Receipt */}
        <div className="rounded-2xl p-6 space-y-4 shadow-2xl text-left"
          style={{ background: "linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))", border: "1.5px solid rgba(212,175,55,0.4)" }}>
          <div className="pb-3 border-b" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
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

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button onClick={() => navigate("/orders")}
            className="flex-1 py-3 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-[#F3E5AB] flex items-center justify-center gap-2"
            style={{ borderColor: "rgba(212,175,55,0.4)", background: "rgba(12,35,23,0.8)" }}>
            <ClipboardList size={14} /> My Orders
          </button>
          <button onClick={() => navigate("/products")}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317" }}>
            <ShoppingBag size={14} /> Continue Shopping
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /></div>
    </div>
  );
}
