import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";
import SectionHeading from "../../components/reusable/SectionHeading";
import { Shield, Key, User, Mail, Phone, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react";

export default function AdminProfile() {
  const { user, profile, refreshProfile } = useAuth();

  // Admin Profile Details State
  const [name, setName] = useState(profile?.name || user?.user_metadata?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  
  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [infoLoading, setInfoLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(null);
  const [passSuccess, setPassSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || user?.user_metadata?.name || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || user?.email || "");
    }
  }, [profile, user]);

  // Update Profile Info (Name, Email & Phone)
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setError(null);
    setInfoSuccess(null);
    setInfoLoading(true);

    try {
      // 1. Update in Supabase profiles table
      const userId = user?.id || profile?.id;
      if (userId) {
        await supabase
          .from("profiles")
          .upsert({ id: userId, name, phone, email, updated_at: new Date().toISOString() });
      }

      // 2. Update Auth email in Supabase if changed
      if (email && email !== user?.email) {
        try {
          const { error: emailErr } = await supabase.auth.updateUser({ email });
          if (emailErr) console.warn("Supabase auth email sync note:", emailErr.message);
        } catch (authE) {
          console.warn(authE);
        }
      }

      // 3. Update local storage profile cache
      try {
        const storedUser = JSON.parse(localStorage.getItem("isai_current_user") || "{}");
        storedUser.name = name;
        storedUser.phone = phone;
        storedUser.email = email;
        localStorage.setItem("isai_current_user", JSON.stringify(storedUser));
      } catch (err) {}

      if (refreshProfile) await refreshProfile();

      setInfoSuccess("Admin profile details & email address updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update admin profile.");
    } finally {
      setInfoLoading(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setPassSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setPassLoading(true);

    try {
      // 1. Update Password in Supabase Auth
      const { error: passErr } = await supabase.auth.updateUser({ password: newPassword });
      if (passErr) throw passErr;

      // 2. Update in local storage admin cache
      try {
        const storedUser = JSON.parse(localStorage.getItem("isai_current_user") || "{}");
        storedUser.password = newPassword;
        localStorage.setItem("isai_current_user", JSON.stringify(storedUser));
      } catch (err) {}

      setPassSuccess("Admin password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update admin password in Supabase.");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#F5E6BE] font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionHeading
          title="Admin Account &amp; Security Profile"
          subtitle="Manage administrator login credentials, contact info, and password policies"
          align="left"
        />
        <div className="inline-flex self-start sm:self-auto items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#161B26] text-[#FFD54F] text-xs font-bold uppercase tracking-widest shrink-0">
          <Shield className="w-4 h-4 text-[#D4AF37]" /> Active Superadmin
        </div>
      </div>

      {/* Main Alert Message */}
      {error && (
        <div className="p-4 rounded-xl flex items-center gap-3 text-xs font-bold text-red-300 border border-red-500/40 bg-red-950/60 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Admin Identity Badge & Quick Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0F131C] border border-[#D4AF37]/30 p-4 sm:p-6 rounded-2xl shadow-xl text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#161B26] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFFFFF] font-sans text-2xl sm:text-3xl font-bold shadow-xl">
              {(name || "A")[0]}
            </div>
            <div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#FFFFFF] truncate">{name}</h3>
              <p className="text-xs text-[#D4AF37] font-mono truncate">{email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#161B26] text-[#FFD54F] border border-[#D4AF37]/40">
                System Administrator
              </span>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/20 text-left text-xs space-y-2.5 text-[#A1A1AA]">
              <div className="flex justify-between">
                <span className="font-bold text-[#D4AF37]">Role Level:</span>
                <span>Super Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#D4AF37]">Database Sync:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Supabase Auth
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#D4AF37]">Access Privileges:</span>
                <span>Full Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms for Admin Profile Info & Password Update */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Card 1: Update Admin Information */}
          <div className="bg-[#0F131C] border border-[#D4AF37]/30 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 border-b border-[#D4AF37]/25 pb-4">
              <User className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="font-sans text-sm sm:text-base font-bold text-[#FFFFFF] uppercase tracking-wider">
                  Admin Contact Details
                </h3>
                <p className="text-xs text-[#A1A1AA]">Update display name and administrator contact number</p>
              </div>
            </div>

            {infoSuccess && (
              <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 bg-emerald-950/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{infoSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateInfo} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Admin Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#FFFFFF] bg-[#161B26] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Admin Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#FFFFFF] bg-[#161B26] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <span className="text-[10px] text-[#D4AF37]/80 italic">Updating this will update your primary admin login email across Supabase.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#FFFFFF] bg-[#161B26] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="+91 90488 68444"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={infoLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{infoLoading ? "Saving Details..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Password Change & Security Options */}
          <div className="bg-[#0F131C] border border-[#D4AF37]/30 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 border-b border-[#D4AF37]/25 pb-4">
              <Key className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="font-sans text-sm sm:text-base font-bold text-[#FFFFFF] uppercase tracking-wider">
                  Change Admin Password
                </h3>
                <p className="text-xs text-[#A1A1AA]">Set a new secure password for your administrator account</p>
              </div>
            </div>

            {passSuccess && (
              <div className="p-3 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-300 border border-emerald-500/40 bg-emerald-950/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#FFFFFF] bg-[#161B26] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg font-medium text-[#FFFFFF] bg-[#161B26] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{passLoading ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
