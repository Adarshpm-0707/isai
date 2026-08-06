import React, { useState, useEffect } from 'react';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Button from '../../components/reusable/Button';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <SectionHeading title="Payment Gateway Settings" subtitle="Configure Razorpay merchant keys" align="left" />

      <form onSubmit={handleSubmit} className="bg-[#2B1409] border border-[#D8A55A]/30 p-8 rounded-lg space-y-6 shadow-xl text-xs font-sans">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D8A55A]/20">
          <CreditCard className="w-6 h-6 text-[#F6D18A]" />
          <h3 className="font-playfair text-lg font-bold text-[#F6D18A]">Razorpay API Integration</h3>
        </div>

        <div>
          <label className="block uppercase font-bold text-[#F6D18A]">Gateway Provider</label>
          <input
            type="text"
            value={form.gateway}
            disabled
            className="w-full bg-[#4A0000]/50 border border-[#F6D18A]/20 rounded p-2.5 text-[#F6D18A] mt-1 font-mono"
          />
        </div>

        <div>
          <label className="block uppercase font-bold text-[#F6D18A]">Razorpay Key ID (rzp_live_... / rzp_test_...)</label>
          <input
            type="text"
            value={form.api_key}
            onChange={(e) => setForm({ ...form, api_key: e.target.value })}
            placeholder="rzp_test_xxxxxxxxxxxx"
            className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1 font-mono"
            required
          />
        </div>

        <div>
          <label className="block uppercase font-bold text-[#F6D18A]">Razorpay Key Secret</label>
          <input
            type="password"
            value={form.api_secret}
            onChange={(e) => setForm({ ...form, api_secret: e.target.value })}
            placeholder="••••••••••••••••"
            className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1 font-mono"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="accent-[#E88D37]"
          />
          <label htmlFor="is_active" className="text-[#F6D18A] font-bold">
            Enable Razorpay Checkout Gateway
          </label>
        </div>

        {savedMessage && (
          <div className="bg-green-950/60 border border-green-700 text-green-400 p-3 rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Payment settings updated successfully!</span>
          </div>
        )}

        <div className="pt-4 border-t border-[#D8A55A]/20 flex justify-end">
          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-1" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
