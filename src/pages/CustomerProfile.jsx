import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import SectionHeading from "../components/reusable/SectionHeading";
import { User, Mail, Phone, MapPin, ShoppingBag, LogOut, CheckCircle2, ShieldCheck, Save, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GoldLine } from "../components/layout/OnamEffects";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, profile, logout, refreshProfile } = useAuth();

  const [name, setName] = useState(profile?.name || user?.name || user?.user_metadata?.name || "");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [city, setCity] = useState(profile?.city || "");
  const [pincode, setPincode] = useState(profile?.pincode || "");

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (profile) {
      setName(profile.name || user?.user_metadata?.name || user.email?.split("@")[0] || "");
      setEmail(profile.email || user.email || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setPincode(profile.pincode || "");
    }
    fetchCustomerOrders();
  }, [user, profile]);

  const fetchCustomerOrders = async () => {
    if (!user?.email && !user?.id) return;
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`customer_email.eq.${user.email},user_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) setRecentOrders(data);
    } catch (err) {
      console.warn("Failed to fetch customer orders:", err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const userId = user?.id || `usr_${Date.now()}`;
      const profileData = {
        id: userId,
        name,
        email,
        phone,
        address,
        city,
        pincode,
        updated_at: new Date().toISOString(),
      };

      // 1. Save to Supabase PostgreSQL profiles & customers table
      await Promise.allSettled([
        supabase.from("profiles").upsert(profileData),
        supabase.from("customers").upsert(profileData),
      ]);

      // 2. Save into local storage user cache
      try {
        const storedUser = JSON.parse(localStorage.getItem("isai_current_user") || "{}");
        const updated = { ...storedUser, ...profileData };
        localStorage.setItem("isai_current_user", JSON.stringify(updated));
      } catch (e) {}

      if (refreshProfile) await refreshProfile();

      setSuccess("Your account details and shipping address have been updated!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#081A11] text-[#F3E5AB] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-0 right-0 z-20">
        <GoldLine />
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D4AF37]/25 pb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              Customer Account Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase font-serif text-[#F3E5AB] pt-1">
              My Profile Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#133323] border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#1A3C2B] transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> View All Orders
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card & Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Customer Badge Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1A3C2B] border-2 border-[#D4AF37] flex items-center justify-center text-[#F3E5AB] font-serif text-3xl font-extrabold shadow-xl">
                {(name || email || "C")[0].toUpperCase()}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#F3E5AB]">{name || "Valued Customer"}</h3>
                <p className="text-xs text-[#D4AF37] font-mono">{email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#133323] text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Customer
                </span>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/20 text-left text-xs space-y-2.5 text-[#EADFC9]/80 font-sans">
                <div className="flex justify-between">
                  <span className="font-bold text-[#D4AF37]">Account Type:</span>
                  <span>Store Customer</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#D4AF37]">Authentication:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Google SSO / Auth
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#D4AF37]">Phone:</span>
                  <span>{phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-3 text-xs">
              <h4 className="font-serif text-xs font-bold uppercase text-[#D4AF37] tracking-wider border-b border-[#D4AF37]/20 pb-2">
                Quick Shortcuts
              </h4>
              <Link
                to="/cart"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A3C2B]/60 hover:bg-[#1A3C2B] text-[#F3E5AB] font-medium transition-colors"
              >
                <span>View Shopping Cart</span>
                <ArrowRight size={14} className="text-[#D4AF37]" />
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1A3C2B]/60 hover:bg-[#1A3C2B] text-[#F3E5AB] font-medium transition-colors"
              >
                <span>Browse Drapery Catalog</span>
                <ArrowRight size={14} className="text-[#D4AF37]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Customer Details Form & Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form: Account Details & Shipping Address */}
            <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[#D4AF37]/25 pb-4">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
                    Personal Information &amp; Address
                  </h3>
                  <p className="text-xs text-[#EADFC9]/70">Update your name, contact phone, and primary shipping address</p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-red-300 border border-red-500/40 bg-red-950/60">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 bg-emerald-950/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#EADFC9]/60 bg-[#081A11] border border-[#D4AF37]/20 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="+91 90488 68444"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Door No. 12, Main Street, MG Road"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Kochi"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="682001"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? "Saving Details..." : "Save Account Details"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section: Recent Orders Overview */}
            <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3">
                <h3 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
                  Recent Orders ({recentOrders.length})
                </h3>
                <Link to="/orders" className="text-xs text-[#D4AF37] hover:underline font-bold">
                  View Full Order History →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-xs text-[#EADFC9]/70 italic py-2">No orders placed yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#133323]/70 border border-[#D4AF37]/25 gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono text-[#F3E5AB] font-bold block">
                          Order #{ord.id.slice(0, 8)}
                        </span>
                        <span className="text-[#EADFC9]/70 text-[10px]">
                          {new Date(ord.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#F3E5AB]">
                          ₹{Number(ord.total || ord.total_amount || 0).toLocaleString("en-IN")}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A3C2B] text-[#FFD54F] border border-[#D4AF37]/40">
                          {ord.status || "Processing"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
