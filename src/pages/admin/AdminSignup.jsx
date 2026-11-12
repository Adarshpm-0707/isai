import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { authService } from "../../services/authService";
import { validateEmail, validateRequired } from "../../utils/validators";
import { AlertCircle, Lock, Mail, Shield, User, Phone, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../../components/reusable/BrandLogo";
import { FloralOrnament } from "../../components/reusable/FloralOrnament";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateRequired(name)) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid admin email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.signUp({
        email,
        password,
        name,
        phone,
        role: "admin",
      });

      const newAdmin = {
        id: "adm_" + Date.now(),
        name,
        email,
        phone,
        role: "admin",
        is_active: true,
        created_at: new Date().toISOString(),
      };

      try {
        await supabase.from("profiles").upsert(newAdmin);
        await supabase.from("users").upsert(newAdmin);
      } catch (e) {
        console.warn("PostgreSQL upsert notice:", e);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-16 relative bg-[#090B10] text-[#FFFFFF] font-sans">
      {/* Decorative Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-6 relative z-10 text-center"
      >
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="flex justify-center mb-1">
            <BrandLogo size="lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/35 bg-[#161B26] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> Restricted Admin Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#FFFFFF] font-sans">
            Admin Sign Up
          </h1>
          <FloralOrnament />
          <p className="text-xs text-[#A1A1AA] font-light">Register a new administrator account with store management privileges</p>
        </div>

        {/* Signup Card Form */}
        <div className="rounded-2xl p-5 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden text-left bg-[#0F131C] border border-[#D4AF37]/30">
          {error && (
            <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300 border border-red-500/40 bg-red-950/60 shadow-lg">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 bg-emerald-950/70 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Admin account created successfully! Redirecting to Admin Login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="block text-[11px] uppercase font-medium text-[#D4AF37] tracking-wider">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FFFFFF] placeholder:text-[#A1A1AA]/50 bg-[#161B26] border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Ramesh Kumar"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase font-medium text-[#D4AF37] tracking-wider">Admin Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FFFFFF] placeholder:text-[#A1A1AA]/50 bg-[#161B26] border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="admin@isaitarang.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase font-medium text-[#D4AF37] tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FFFFFF] placeholder:text-[#A1A1AA]/50 bg-[#161B26] border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="+91 90488 68444"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase font-medium text-[#D4AF37] tracking-wider">Admin Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FFFFFF] placeholder:text-[#A1A1AA]/50 bg-[#161B26] border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase font-medium text-[#D4AF37] tracking-wider">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#FFFFFF] placeholder:text-[#A1A1AA]/50 bg-[#161B26] border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 rounded-lg font-bold text-xs tracking-widest uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
              >
                {loading ? "Registering Admin..." : "Register Admin Account"}
              </button>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/20 text-center">
              <Link
                to="/admin/login"
                className="text-xs text-[#D4AF37] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Already have an Admin Account? <span className="font-bold text-[#FFFFFF]">Admin Sign In →</span>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
