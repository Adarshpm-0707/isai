import React, { useState, useEffect } from 'react';
import { couponService } from '../../services/couponService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Modal from '../../components/reusable/Modal';
import Badge from '../../components/reusable/Badge';
import { Plus, Trash2, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    min_order_amount: 0,
    max_uses: 0,
    expires_at: '',
    is_active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.getAllCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...form,
        value: Number(form.value),
        min_order_amount: Number(form.min_order_amount),
        max_uses: Number(form.max_uses),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };

      const res = await couponService.createCoupon(couponData);
      await adminLogService.logAction('CREATE_COUPON', 'coupons', res.id, couponData);

      setModalOpen(false);
      setForm({
        code: '',
        type: 'percentage',
        value: 10,
        min_order_amount: 0,
        max_uses: 0,
        expires_at: '',
        is_active: true,
      });
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      await adminLogService.logAction('DELETE_COUPON', 'coupons', id, {});
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading title="Manage Coupons" subtitle="Discount promotional codes and campaign offers" align="left" />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-6">Discount Type</th>
                <th className="py-4 px-6">Value</th>
                <th className="py-4 px-6">Min Order</th>
                <th className="py-4 px-6">Usage Count</th>
                <th className="py-4 px-6">Expiry</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#EADFC9]/70 italic">
                    No coupons created yet. Click "Create Coupon" to add one.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#F3E5AB] flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{c.code}</span>
                    </td>
                    <td className="py-4 px-6 uppercase text-[10px] font-bold text-[#EADFC9]">{c.type}</td>
                    <td className="py-4 px-6 font-bold text-[#F3E5AB]">
                      {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="py-4 px-6 text-[#EADFC9]">₹{c.min_order_amount || 0}</td>
                    <td className="py-4 px-6 text-[#EADFC9]">
                      {c.used_count || 0} / {c.max_uses || '∞'}
                    </td>
                    <td className="py-4 px-6 text-[#EADFC9]">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge text={c.is_active ? 'Active' : 'Disabled'} variant={c.is_active ? 'success' : 'danger'} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans text-[#F3E5AB] p-2">
          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Coupon Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. WELCOME10"
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37] uppercase"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Discount Value *</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Min Order (₹)</label>
              <input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Max Uses (0 = ∞)</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Expiry Date</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-[#D4AF37]"
            />
            <label htmlFor="is_active" className="text-[#F3E5AB] font-bold">
              Active immediately
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#EADFC9] hover:bg-[#1A3C2B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 shadow-lg"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
