import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateEmail, validateRequired } from "../utils/validators";
import { AlertCircle, Lock, Mail, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../components/layout/OnamEffects";

const inputClass = "w-full rounded-lg pl-10 pr-4 py-2 text-sm placeholder:text-[#D4AF37]/40 focus:outline-none transition-all";
const inputStyle = { background: "rgba(12,35,23,0.8)", border: "1px solid rgba(212,175,55,0.35)", color: "#F3E5AB" };

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const from = location.state?.from?.pathname || "/";
  useEffect(() => { if (user) navigate(from, { replace: true }); }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    if (!validateRequired(name)) { setError("Name is required."); return; }
    if (!validateEmail(email)) { setError("Please provide a valid email address."); return; }
    if (!validateRequired(password) || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register({ email, password, name, phone, role: "user" });
      setSuccess(true);
      setName(""); setPhone(""); setEmail(""); setPassword(""); setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to authenticate with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-14 relative"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0"><GoldLine /></div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-5 relative z-10">

        <div className="text-center space-y-2">
          <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">CREATE ACCOUNT</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-[#F3E5AB]">
            Join Us
          </h1>
          <p className="text-xs text-[#EADFC9]/80 font-light">Register to start shopping handcrafted silk sarees</p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          style={{ background: "rgba(10,24,16,0.95)", border: "1.5px solid rgba(212,175,55,0.35)" }}>

          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300 border border-red-500/40" style={{ background: "rgba(120,20,20,0.4)" }}>
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /><span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg text-xs font-bold text-emerald-300 border border-emerald-500/40" style={{ background: "rgba(20,100,50,0.4)" }}>
              Account created! You can now <Link to="/login" className="underline font-extrabold">Sign In</Link>.
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-3 border shadow-md disabled:opacity-50"
            style={{ background: "white", color: "#1F2937", borderColor: "#E5E7EB" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#D4AF37]/20" />
            <span className="text-[10px] uppercase font-bold text-[#D4AF37]/60">OR REGISTER WITH EMAIL</span>
            <div className="flex-1 h-px bg-[#D4AF37]/20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name *", icon: <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "text", value: name, onChange: setName, placeholder: "Lakshmi Menon" },
              { label: "Phone Number", icon: <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "tel", value: phone, onChange: setPhone, placeholder: "+91 98765 43210" },
              { label: "Email Address *", icon: <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "email", value: email, onChange: setEmail, placeholder: "name@example.com" },
              { label: "Password *", icon: <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
              { label: "Confirm Password *", icon: <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "password", value: confirmPassword, onChange: setConfirmPassword, placeholder: "••••••••" },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                <label className="block text-xs uppercase font-bold text-[#D4AF37] tracking-widest">{field.label}</label>
                <div className="relative">
                  {field.icon}
                  <input
                    type={field.type} value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={inputClass} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "#D4AF37"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"}
                    placeholder={field.placeholder}
                  />
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button type="submit" disabled={loading || googleLoading}
                className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-center text-[11px] text-[#EADFC9]/70 pt-1">
            By signing up, you agree to our{" "}
            <Link to="/terms-conditions" className="text-[#FFD54F] font-bold hover:underline">Terms &amp; Conditions</Link>
            {" "}and{" "}
            <Link to="/privacy-policy" className="text-[#FFD54F] font-bold hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-xs text-[#D4AF37]/80 pt-1">
            Already have an account?{" "}
            <Link to="/login" state={{ from: location.state?.from }} className="text-[#FFD54F] font-bold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /></div>
    </div>
  );
}
