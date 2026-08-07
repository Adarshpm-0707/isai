import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { validateEmail, validateRequired } from "../../utils/validators";
import { AlertCircle, Lock, Mail, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../../components/layout/OnamEffects";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, role } = useAuth();

  const [email, setEmail] = useState("admin@isaitarang.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (user && role === "admin") {
      navigate(from, { replace: true });
    }
  }, [user, role, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) { setError("Please enter a valid admin email address."); return; }
    if (!validateRequired(password)) { setError("Password is required."); return; }
    
    setLoading(true);
    try {
      const res = await login(email, password);
      // Ensure profile role is admin for admin portal
      const currentProf = res.profile || res.user;
      if (currentProf) {
        currentProf.role = "admin";
        localStorage.setItem("isai_current_user", JSON.stringify(currentProf));
        
        // Synchronize admin role to Supabase PostgreSQL profiles table
        try {
          await supabase.from("profiles").upsert({
            id: currentProf.id || "adm_" + Date.now(),
            email: currentProf.email,
            name: currentProf.name || "System Admin",
            role: "admin",
            is_active: true,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {}
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 relative"
      style={{ background: "linear-gradient(180deg,#081A11 0%,#0C2317 50%,#081A11 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0">
        <GoldLine />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#133323]/80 text-[#FFD54F] text-[10px] font-bold uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> Restricted Admin Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#F3E5AB]">
            Admin Sign In
          </h1>
          <p className="text-xs text-[#EADFC9]/80 font-light">Enter admin credentials to manage products, orders &amp; customer logs</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden"
          style={{ background: "rgba(10,24,16,0.98)", border: "1.5px solid rgba(212,175,55,0.4)" }}
        >
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300 border border-red-500/40" style={{ background: "rgba(120,20,20,0.4)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Admin Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] placeholder:text-[#D4AF37]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.35)" }}
                placeholder="admin@isaitarang.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Admin Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] placeholder:text-[#D4AF37]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.35)" }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-bold text-xs sm:text-sm tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
            >
              {loading ? "Authenticating Admin..." : "Sign In to Admin Portal"}
            </button>
          </div>

          <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
            <Link
              to="/admin/signup"
              className="text-[#FFD54F] font-bold hover:underline"
            >
              Need Admin Account? Register →
            </Link>
            <Link
              to="/login"
              className="text-[#D4AF37]/90 font-medium hover:text-[#FFD54F] hover:underline flex items-center gap-1"
            >
              Customer Portal <ArrowRight size={12} />
            </Link>
          </div>
        </form>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /></div>
    </div>
  );
}
