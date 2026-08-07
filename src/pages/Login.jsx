import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { AlertCircle, ShieldCheck, Sparkles, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../components/layout/OnamEffects";
import logoImg from "../assets/ISAI (2).png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user, role } = useAuth();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (user) {
      if (from) navigate(from, { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, role, navigate, from]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to authenticate with Google account.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20 overflow-hidden bg-[#081A11]">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#1A3C2B]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-20">
        <GoldLine />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphic Luxury Container */}
        <div className="rounded-3xl p-8 sm:p-10 space-y-8 bg-[#0C2317]/90 backdrop-blur-2xl border-2 border-[#D4AF37]/40 shadow-[0_0_80px_rgba(212,175,55,0.2)] text-center relative overflow-hidden">
          
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFD54F] to-[#B8860B]" />

          {/* Logo & Brand Title */}
          <div className="space-y-3 pt-2">
            <div className="inline-block relative">
              <img
                src={logoImg}
                alt="Isai Tarang Logo"
                className="h-16 sm:h-20 w-auto mx-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
              />
            </div>
            
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#133323] text-[#FFD54F] text-[10px] font-extrabold uppercase tracking-[0.25em]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Heritage Customer Access
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#F3E5AB] font-serif pt-1">
                ISAI TARANG
              </h1>
              <p className="text-xs text-[#EADFC9]/80 font-light max-w-xs mx-auto leading-relaxed">
                Sign in with your Google Account for seamless checkout, wishlist sync, and order tracking.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-red-300 border border-red-500/40 bg-red-950/60 shadow-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google OAuth Login Action */}
          <div className="space-y-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 12px 35px rgba(212,175,55,0.3)" }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-3.5 border border-[#D4AF37]/50 shadow-2xl disabled:opacity-50 cursor-pointer group bg-white text-gray-900"
            >
              <svg className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-semibold text-gray-900">
                {googleLoading ? "Connecting Google Account..." : "Continue with Google"}
              </span>
            </motion.button>

            {/* Feature Highlights */}
            <div className="pt-4 border-t border-[#D4AF37]/20 grid grid-cols-2 gap-2 text-left text-[11px] text-[#EADFC9]/80 font-sans">
              <div className="flex items-center gap-1.5 bg-[#133323]/60 p-2 rounded-lg border border-[#D4AF37]/20">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>1-Click Sign In</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#133323]/60 p-2 rounded-lg border border-[#D4AF37]/20">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Zero Passwords</span>
              </div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>256-Bit SSL Encrypted &amp; Verified</span>
          </div>

        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <GoldLine />
      </div>
    </div>
  );
}
