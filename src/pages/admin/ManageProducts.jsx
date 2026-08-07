import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import PriceTag from '../../components/reusable/PriceTag';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        search,
        category: categoryFilter === 'All' ? null : categoryFilter,
        limit: 100,
      });
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to query products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [search, categoryFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      await adminLogService.logAction('DELETE_PRODUCT', 'products', id, {});
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Product Inventory"
          subtitle="Configure, add, edit, or remove catalog items"
          align="left"
        />
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#0C2317] border border-[#D4AF37]/35 p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2 bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-lg px-3 py-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold uppercase">Category:</span>
          <input
            type="text"
            placeholder="Category filter..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1A3C2B] border border-[#D4AF37]/35 text-[#F3E5AB] px-3 py-2 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-xl shadow-xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Preview</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#153424]/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-10 aspect-[3/4] overflow-hidden bg-[#081A11] border border-[#D4AF37]/30 rounded">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#F3E5AB] max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 uppercase text-[10px] text-[#EADFC9] font-bold">
                    {product.category}
                  </td>
                  <td className="py-4 px-6">
                    <PriceTag price={product.discount_price || product.price} size="sm" />
                  </td>
                  <td className="py-4 px-6 font-medium text-[#EADFC9]">
                    {product.stock <= 0 ? (
                      <span className="text-[#F3E5AB] bg-[#1A3C2B] px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#D4AF37]/35">
                        Out of Stock
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="text-[#FFD54F] bg-[#1A3C2B]/80 px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#D4AF37]/35">
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span>{product.stock} units</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="inline-flex p-2 bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35 transition-all rounded"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      type="button"
                      className="inline-flex p-2 bg-[#1A3C2B]/50 text-[#F3E5AB] hover:bg-[#1A3C2B] border border-[#D4AF37]/35 transition-all rounded"
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
