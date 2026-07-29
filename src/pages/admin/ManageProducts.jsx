import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { MOCK_PRODUCTS } from '../../hooks/useProducts';
import SectionHeading from '../../components/reusable/SectionHeading';
import Loader from '../../components/reusable/Loader';
import PriceTag from '../../components/reusable/PriceTag';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase products fetch failed in admin. Using fallback:', error.message);
        setProducts(MOCK_PRODUCTS);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        // If DB has zero rows, fallback to mock products for sandbox simulation
        setProducts(MOCK_PRODUCTS);
      }
    } catch (err) {
      console.error('Failed to query products:', err);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

    try {
      // Check if it's a mock product id (has 'prod-' prefix)
      if (String(id).startsWith('prod-')) {
        setProducts(products.filter((p) => p.id !== id));
        setFeedback('Mock product removed successfully (Local sandbox state).');
        setTimeout(() => setFeedback(null), 3000);
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
      setFeedback('Product deleted successfully from database.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Product Inventory"
          subtitle="Configure, add, edit, or remove sarees in the store database"
          align="left"
        />
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-maroon text-ivory hover:bg-maroon-dark px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Saree
        </Link>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm font-sans text-xs">
          {feedback}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gold/15 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/10 text-gray-400 font-bold uppercase tracking-wider bg-ivory/20">
                <th className="py-4 px-6">Preview</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-ivory/10">
                  {/* Preview Image */}
                  <td className="py-4 px-6">
                    <div className="w-10 aspect-[3/4] overflow-hidden bg-ivory border border-gold/10">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="py-4 px-6 font-semibold text-maroon max-w-xs truncate">
                    {product.name}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 uppercase text-[10px] text-gold-dark font-bold">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6">
                    <PriceTag price={product.price} size="sm" />
                  </td>

                  {/* Stock count */}
                  <td className="py-4 px-6 font-medium text-gray-700">
                    {product.stock <= 0 ? (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wide border border-rose-200">
                        Out of Stock
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wide border border-amber-200">
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span>{product.stock} units</span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="inline-flex p-2 bg-ivory text-maroon hover:bg-gold hover:text-white border border-gold/25 transition-all"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      type="button"
                      className="inline-flex p-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
