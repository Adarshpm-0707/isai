import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/reusable/Button";
import { validateEmail, validateRequired } from "../utils/validators";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";

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
      {/* Top flower garland */}
      <div className="absolute top-0 left-0 right-0">
        <PookklamGarland count={28} />
        <GoldLine />
      </div>

      {/* Corner flowers */}
      <SectionFlower size={48} className="absolute top-8 left-4 opacity-25 hidden md:block" />
      <SectionFlower size={36} className="absolute top-12 right-6 opacity-20 hidden md:block" />
      <SectionFlower size={48} className="absolute bottom-8 left-4 opacity-20 hidden md:block" />
      <SectionFlower size={36} className="absolute bottom-12 right-6 opacity-25 hidden md:block" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Onam heading */}
        <OnamPageHeading malayalam="ഓണം ലോഗിൻ" english="SIGN IN" />

        {error && (
          <div className="border text-[#F6D18A] p-4 rounded-lg flex items-start gap-2.5"
            style={{ background: "rgba(43,20,9,0.9)", borderColor: "rgba(212,175,55,0.5)" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD54F]" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))", border: "1.5px solid rgba(212,175,55,0.4)" }}
        >
          {/* Top flower accent */}
          <div className="flex items-center justify-center gap-1 mb-2">
            {[0,1,2,3,4].map(i => <MiniFlower key={i} size={14} c1="#FF6B35" c2="#FFD54F" />)}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-[#D4AF37]/40 focus:outline-none transition-all"
                style={{ background: "rgba(12,35,23,0.8)", border: "1px solid rgba(212,175,55,0.35)", color: "#F3E5AB" }}
                onFocus={e => e.currentTarget.style.borderColor = "#D4AF37"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"}
                placeholder="name@example.com" required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-[#D4AF37]/40 focus:outline-none transition-all"
                style={{ background: "rgba(12,35,23,0.8)", border: "1px solid rgba(212,175,55,0.35)", color: "#F3E5AB" }}
                onFocus={e => e.currentTarget.style.borderColor = "#D4AF37"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"}
                placeholder="••••••••" required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; } }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
            >
              <MiniFlower size={16} c1="#0C2317" c2="#1A3C2B" />
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-xs text-[#D4AF37]/80 pt-1">
            Don&apos;t have an account?{" "}
            <Link to="/signup" state={{ from: location.state?.from }}
              className="text-[#FFD54F] font-bold hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </motion.form>
      </motion.div>

      {/* Bottom garland */}
      <div className="absolute bottom-0 left-0 right-0">
        <GoldLine />
        <PookklamGarland count={28} />
      </div>
    </div>
  );
}
