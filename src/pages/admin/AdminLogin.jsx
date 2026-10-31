import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { validateEmail, validateRequired } from "../../utils/validators";
import { AlertCircle, Lock, Mail, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../../components/reusable/BrandLogo";
import { FloralOrnament } from "../../components/reusable/FloralOrnament";

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
      const currentProf = res.profile || res.user;
      if (currentProf) {
        currentProf.role = "admin";
        localStorage.setItem("isai_current_user", JSON.stringify(currentProf));
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative bg-[#120B09] text-[#FDF8F4]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C86A27]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        <div className="text-center space-y-3">
          {/* Official Brand Logo */}
          <div className="flex justify-center mb-1">
            <BrandLogo size="lg" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#35221B] bg-[#1E130F] text-[#DFC18A] text-[10px] font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-[#DFC18A]" /> Restricted Admin Portal
          </div>
          <h1
            className="text-3xl font-normal tracking-wide text-[#FDF8F4] font-serif"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Admin Sign In
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#C7B5A7] font-light">Enter admin credentials to manage products, orders & customer logs</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden bg-[#1E130F] border border-[#35221B]"
        >
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-medium text-red-300 border border-red-500/30 bg-red-950/40">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs uppercase font-medium text-[#DFC18A] tracking-widest">Admin Email *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#DFC18A]/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FDF8F4] placeholder:text-[#C7B5A7]/40 bg-[#120B09] border border-[#35221B] focus:outline-none focus:border-[#DFC18A] transition-colors"
                placeholder="admin@isaitarang.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-medium text-[#DFC18A] tracking-widest">Admin Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#DFC18A]/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FDF8F4] placeholder:text-[#C7B5A7]/40 bg-[#120B09] border border-[#35221B] focus:outline-none focus:border-[#DFC18A] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2 bg-[#C86A27] hover:bg-[#DB7B32] text-white shadow-lg shadow-[#C86A27]/25"
            >
              {loading ? "Authenticating Admin..." : "Sign In to Admin Portal"}
            </button>
          </div>

          <div className="pt-3 border-t border-[#35221B] flex items-center justify-between text-xs">
            <Link
              to="/admin/signup"
              className="text-[#DFC18A] font-medium hover:underline"
            >
              Need Admin Account? Register →
            </Link>
            <Link
              to="/login"
              className="text-[#C7B5A7] font-medium hover:text-[#DFC18A] hover:underline flex items-center gap-1"
            >
              Customer Portal <ArrowRight size={12} />
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
