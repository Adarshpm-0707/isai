import React, { useState, useEffect } from 'react';
import { couponService } from '../../services/couponService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Button from '../../components/reusable/Button';
import Modal from '../../components/reusable/Modal';
import Badge from '../../components/reusable/Badge';
import { Plus, Trash2 } from 'lucide-react';
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
      setCoupons(data);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <div className="flex justify-between items-center">
        <SectionHeading title="Manage Coupons" subtitle="Discount promo campaigns" align="left" />
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Coupon
        </Button>
      </div>

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded p-6 shadow-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 uppercase font-bold">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Min Order</th>
              <th className="py-3 px-4">Uses</th>
              <th className="py-3 px-4">Expiry</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8A55A]/10">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-[#5C2F14]/30">
                <td className="py-3 px-4 font-mono font-bold text-[#F6D18A]">{c.code}</td>
                <td className="py-3 px-4 uppercase text-[10px] font-bold">{c.type}</td>
                <td className="py-3 px-4 font-bold text-[#F6D18A]">
                  {c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}
                </td>
                <td className="py-3 px-4">₹{c.min_order_amount || 0}</td>
                <td className="py-3 px-4">
                  {c.used_count || 0} / {c.max_uses || '∞'}
                </td>
                <td className="py-3 px-4">
                  {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                </td>
                <td className="py-3 px-4">
                  <Badge text={c.is_active ? 'Active' : 'Disabled'} variant={c.is_active ? 'success' : 'danger'} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:underline">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Coupon Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. WELCOME10"
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1 uppercase"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-[#F6D18A]">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block uppercase font-bold text-[#F6D18A]">Discount Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-bold text-[#F6D18A]">Min Order Amount (₹)</label>
              <input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              />
            </div>
            <div>
              <label className="block uppercase font-bold text-[#F6D18A]">Max Uses (0 = unlimited)</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              />
            </div>
          </div>
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Expiry Date</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-[#E88D37]"
            />
            <label htmlFor="is_active" className="text-[#F6D18A]">
              Active immediately
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
