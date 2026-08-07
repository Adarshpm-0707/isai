import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Modal from '../../components/reusable/Modal';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data) setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setName(cat.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({ name, slug })
          .eq('id', editingId);
        if (error) throw error;
        await adminLogService.logAction('UPDATE_CATEGORY', 'categories', editingId, { name, slug });
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert({ name, slug })
          .select()
          .single();
        if (error) throw error;
        await adminLogService.logAction('CREATE_CATEGORY', 'categories', data.id, { name, slug });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      await adminLogService.logAction('DELETE_CATEGORY', 'categories', id, {});
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading title="Manage Categories" subtitle="Catalog category taxonomies and classification" align="left" />
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">URL Slug</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#EADFC9]/70 italic">
                    No categories created yet. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#F3E5AB] flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-[#D4AF37]" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 text-[#EADFC9] font-mono">{cat.slug}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-2 bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35 transition-all rounded cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded cursor-pointer"
                        title="Delete Category"
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans text-[#F3E5AB] p-2">
          <div className="space-y-1">
            <label className="block uppercase font-bold text-[#D4AF37] tracking-wider">Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg p-2.5 text-xs text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g. Banarasi Silk"
              required
            />
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
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
