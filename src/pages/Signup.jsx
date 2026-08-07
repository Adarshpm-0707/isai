import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateEmail, validateRequired } from "../utils/validators";
import { AlertCircle, Lock, Mail, ShieldCheck, User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";

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
      <div className="absolute top-0 left-0 right-0"><PookklamGarland count={28} /><GoldLine /></div>

      <SectionFlower size={48} className="absolute top-8 left-4 opacity-25 hidden md:block" />
      <SectionFlower size={36} className="absolute top-12 right-6 opacity-20 hidden md:block" />
      <SectionFlower size={40} className="absolute bottom-10 left-8 opacity-20 hidden md:block" />
      <SectionFlower size={34} className="absolute bottom-8 right-4 opacity-25 hidden md:block" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-5 relative z-10">

        <OnamPageHeading malayalam="ഓണം സൈൻ അപ്പ്" english="CREATE ACCOUNT" />

        {error && (
          <div className="border text-[#F6D18A] p-3.5 rounded-lg flex items-start gap-2.5"
            style={{ background: "rgba(43,20,9,0.9)", borderColor: "rgba(212,175,55,0.5)" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FFD54F]" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="border text-[#F6D18A] p-3.5 rounded-lg flex items-start gap-2.5"
            style={{ background: "rgba(12,60,43,0.9)", borderColor: "rgba(212,175,55,0.6)" }}>
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#FFD54F] mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Registration Successful!</h4>
              <p className="text-[11px] mt-0.5 leading-normal text-[#D4AF37]">Account created. Please sign in.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}
          className="rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          style={{ background: "linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))", border: "1.5px solid rgba(212,175,55,0.4)" }}>

          <div className="flex items-center justify-center gap-1 mb-2">
            {[0,1,2,3,4].map(i => <MiniFlower key={i} size={14} c1="#FF6B35" c2="#FFD54F" />)}
          </div>

          {[
            { label: "Full Name *", icon: <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "text", value: name, onChange: setName, placeholder: "Priya Sharma" },
            { label: "Phone Number", icon: <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "tel", value: phone, onChange: setPhone, placeholder: "9876543210" },
            { label: "Email Address *", icon: <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "email", value: email, onChange: setEmail, placeholder: "name@example.com" },
            { label: "Password (min 6) *", icon: <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />, type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
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
              <MiniFlower size={16} c1="#0C2317" c2="#1A3C2B" />
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

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /><PookklamGarland count={28} /></div>
    </div>
  );
}
