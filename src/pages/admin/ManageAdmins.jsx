import React, { useState, useEffect } from "react";
import { adminLogService } from "../../services/adminLogService";
import SectionHeading from "../../components/reusable/SectionHeading";
import Badge from "../../components/reusable/Badge";
import Modal from "../../components/reusable/Modal";
import { UserPlus, Shield, Trash2, Mail, Phone, Lock, User } from "lucide-react";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminLogService.getAllAdmins();
      setAdmins(data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminLogService.createAdminUser(form);
      alert("Admin user account created successfully!");
      setModalOpen(false);
      setForm({ name: "", email: "", phone: "", password: "" });
      fetchAdmins();
    } catch (err) {
      alert(err.message || "Failed to create admin");
    }
  };

  const handleDeleteAdmin = async (adminUser) => {
    const nameStr = adminUser.name || adminUser.email || "this admin";
    if (!window.confirm(`Are you sure you want to permanently delete admin "${nameStr}"?`)) {
      return;
    }
    try {
      await adminLogService.deleteAdminUser(adminUser.id, adminUser.email);
      alert(`Admin account "${nameStr}" deleted successfully.`);
      fetchAdmins();
    } catch (err) {
      alert(err.message || "Failed to delete admin account.");
    }
  };

  const handleToggleStatus = async (userId, currentActive) => {
    try {
      await adminLogService.toggleAdminStatus(userId, !currentActive);
      fetchAdmins();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Admin Team Management"
          subtitle="Manage authorized administrator user roles, active status, and credentials"
          align="left"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add Admin User
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#081A11]">
                <th className="py-4 px-6">Admin Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#EADFC9]/70 italic">
                    No admin users found. Click "Add Admin User" to create one.
                  </td>
                </tr>
              ) : (
                admins.map((adm) => (
                  <tr key={adm.id || adm.email} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#F3E5AB] flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-[#1A3C2B] border border-[#D4AF37]/40 text-[#FFD54F]">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span>{adm.name || "System Admin"}</span>
                    </td>
                    <td className="py-4 px-6 text-[#EADFC9] font-mono">{adm.email}</td>
                    <td className="py-4 px-6 text-[#EADFC9]/80">{adm.phone || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          adm.is_active !== false
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                            : "bg-red-950/80 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {adm.is_active !== false ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(adm.id, adm.is_active !== false)}
                        className="px-2.5 py-1 rounded bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        {adm.is_active !== false ? "Disable" : "Enable"}
                      </button>

                      <button
                        onClick={() => handleDeleteAdmin(adm)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/80 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        title="Delete Admin Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin User Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Admin User">
        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs font-sans text-[#F3E5AB] p-2">
          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Ramesh Kumar"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                placeholder="admin@isaitarang.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                placeholder="+91 90488 68444"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#D4AF37]/60" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs font-medium text-[#F3E5AB] bg-[#1A3C2B] border border-[#D4AF37]/35 focus:outline-none focus:border-[#D4AF37]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#EADFC9] hover:bg-[#1A3C2B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 transition-all shadow-lg"
            >
              Create Admin User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
