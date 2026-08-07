import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateEmail, validateRequired } from "../utils/validators";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../components/layout/OnamEffects";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, role } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (user) {
      if (from) navigate(from, { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, role, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) { setError("Please provide a valid email address."); return; }
    if (!validateRequired(password)) { setError("Password is required."); return; }
    setLoading(true);
    try {
      const res = await login(email, password);
      const userRole = res.profile?.role || role;
      if (from) navigate(from, { replace: true });
      else if (userRole === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 relative"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)" }}
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
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">WELCOME BACK</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#F3E5AB]">
            Sign In
          </h1>
          <p className="text-xs text-[#EADFC9]/80 font-light">Access your exclusive Kerala saree collection</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl"
          style={{ background: "rgba(10,24,16,0.95)", border: "1.5px solid rgba(212,175,55,0.35)" }}
        >
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300 border border-red-500/40" style={{ background: "rgba(120,20,20,0.4)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] placeholder:text-[#D4AF37]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.35)" }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Password *</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] placeholder:text-[#D4AF37]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.35)" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-xs text-[#D4AF37]/80 pt-1">
            Don&apos;t have an account?{" "}
            <Link to="/signup" state={{ from: location.state?.from }} className="text-[#FFD54F] font-bold hover:underline ml-1">
              Create Account
            </Link>
          </p>
        </form>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /></div>
    </div>
  );
}
