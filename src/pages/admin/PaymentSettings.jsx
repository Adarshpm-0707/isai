import React, { useState, useEffect } from 'react';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import { CreditCard, Save, CheckCircle } from 'lucide-react';

export default function PaymentSettings() {
  const [form, setForm] = useState({
    gateway: 'razorpay',
    api_key: '',
    api_secret: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await adminLogService.getPaymentSettings();
        setForm({
          gateway: settings.gateway || 'razorpay',
          api_key: settings.api_key || '',
          api_secret: settings.api_secret || '',
          is_active: settings.is_active ?? true,
        });
      } catch (err) {
        console.error('Error loading payment settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogService.updatePaymentSettings(form);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update payment settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#F3E5AB]">
      <SectionHeading title="Payment Gateway Settings" subtitle="Configure Razorpay merchant keys and checkout status" align="left" />

      <form onSubmit={handleSubmit} className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl text-xs font-sans">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D4AF37]/25">
          <CreditCard className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-serif text-lg font-bold text-[#F3E5AB] uppercase tracking-wider">Razorpay API Integration</h3>
        </div>

        <div className="space-y-1.5">
          <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Gateway Provider</label>
          <input
            type="text"
            value={form.gateway}
            disabled
            className="w-full bg-[#081A11] border border-[#D4AF37]/20 rounded-lg p-2.5 text-[#EADFC9]/60 font-mono cursor-not-allowed uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Razorpay Key ID (rzp_live_... / rzp_test_...)</label>
          <input
            type="text"
            value={form.api_key}
            onChange={(e) => setForm({ ...form, api_key: e.target.value })}
            placeholder="rzp_test_xxxxxxxxxxxx"
            className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] font-mono focus:outline-none focus:border-[#D4AF37]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Razorpay Key Secret</label>
          <input
            type="password"
            value={form.api_secret}
            onChange={(e) => setForm({ ...form, api_secret: e.target.value })}
            placeholder="••••••••••••••••"
            className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] font-mono focus:outline-none focus:border-[#D4AF37]"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-[#D4AF37]"
          />
          <label htmlFor="is_active" className="text-[#F3E5AB] font-bold">
            Enable Razorpay Checkout Gateway
          </label>
        </div>

        {savedMessage && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg flex items-center gap-2 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Payment settings updated successfully!</span>
          </div>
        )}

        <div className="pt-4 border-t border-[#D4AF37]/25 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
