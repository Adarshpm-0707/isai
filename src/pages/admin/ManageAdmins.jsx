import React, { useState, useEffect } from 'react';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Button from '../../components/reusable/Button';
import Modal from '../../components/reusable/Modal';
import Badge from '../../components/reusable/Badge';
import { UserPlus, Shield } from 'lucide-react';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminLogService.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
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
      alert('Admin account created successfully');
      setModalOpen(false);
      setForm({ name: '', email: '', phone: '', password: '' });
      fetchAdmins();
    } catch (err) {
      alert(err.message || 'Failed to create admin');
    }
  };

  const handleToggleStatus = async (userId, currentActive) => {
    try {
      await adminLogService.toggleAdminStatus(userId, !currentActive);
      fetchAdmins();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <div className="flex justify-between items-center">
        <SectionHeading title="Manage Admins" subtitle="Single admin role user controls" align="left" />
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-1" /> Add Admin User
        </Button>
      </div>

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded p-6 shadow-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 uppercase font-bold">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8A55A]/10">
            {admins.map((adm) => (
              <tr key={adm.id} className="hover:bg-[#5C2F14]/30">
                <td className="py-3 px-4 font-bold text-[#F6D18A] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#E88D37]" />
                  {adm.name || 'Admin'}
                </td>
                <td className="py-3 px-4 text-[#D8A55A]">{adm.email}</td>
                <td className="py-3 px-4">{adm.phone || 'N/A'}</td>
                <td className="py-3 px-4">
                  <Badge text={adm.is_active ? 'Active' : 'Disabled'} variant={adm.is_active ? 'success' : 'danger'} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(adm.id, adm.is_active)}
                    className="text-xs text-[#F6D18A] hover:underline font-bold"
                  >
                    {adm.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Admin User">
        <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              required
            />
          </div>
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              required
            />
          </div>
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
            />
          </div>
          <div>
            <label className="block uppercase font-bold text-[#F6D18A]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-[#F6D18A] mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
