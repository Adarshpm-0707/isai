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
  const { register, user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
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
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-xs text-[#D4AF37]/80 pt-1">
            Already have an account?{" "}
            <Link to="/login" state={{ from: location.state?.from }} className="text-[#FFD54F] font-bold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /></div>
    </div>
  );
}
