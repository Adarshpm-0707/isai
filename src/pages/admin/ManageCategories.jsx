import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Button from '../../components/reusable/Button';
import Modal from '../../components/reusable/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <div className="flex justify-between items-center">
        <SectionHeading title="Manage Categories" subtitle="Catalog category taxonomies" align="left" />
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded p-6 shadow-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 uppercase font-bold">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8A55A]/10">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#5C2F14]/30">
                <td className="py-3 px-4 font-bold text-[#F6D18A]">{cat.name}</td>
                <td className="py-3 px-4 text-[#D8A55A] font-mono">{cat.slug}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(cat)} className="text-[#F6D18A] hover:underline">
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:underline">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-[#F6D18A]">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#4A0000] border border-[#F6D18A]/30 rounded p-2.5 text-xs text-[#F6D18A] mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
