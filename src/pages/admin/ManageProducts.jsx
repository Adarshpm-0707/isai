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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Product Inventory"
          subtitle="Configure, add, edit, or remove catalog items"
          align="left"
        />
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#F6D18A] text-[#2B1409] hover:opacity-90 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-[#2B1409] border border-[#D8A55A]/30 p-4 rounded text-xs">
        <div className="flex items-center gap-2 bg-[#4A0000] border border-[#D8A55A]/30 rounded px-3 py-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-[#D8A55A]" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#D8A55A] font-bold uppercase">Category:</span>
          <input
            type="text"
            placeholder="Category filter..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#4A0000] border border-[#D8A55A]/30 text-[#F6D18A] px-3 py-2 rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#2B1409] border border-[#D8A55A]/30 rounded-sm shadow-xl overflow-hidden text-[#D8A55A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 font-bold uppercase tracking-wider bg-[#2B1409]">
                <th className="py-4 px-6">Preview</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8A55A]/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#5C2F14]/30">
                  <td className="py-4 px-6">
                    <div className="w-10 aspect-[3/4] overflow-hidden bg-[#2B1409] border border-[#D8A55A]/20">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#F6D18A] max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 uppercase text-[10px] text-[#D8A55A] font-bold">
                    {product.category}
                  </td>
                  <td className="py-4 px-6">
                    <PriceTag price={product.discount_price || product.price} size="sm" />
                  </td>
                  <td className="py-4 px-6 font-medium text-[#D8A55A]">
                    {product.stock <= 0 ? (
                      <span className="text-[#F6D18A] bg-[#5C2F14] px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#F6D18A]/30">
                        Out of Stock
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="text-[#F6D18A] bg-[#5C2F14]/70 px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#F6D18A]/30">
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span>{product.stock} units</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="inline-flex p-2 bg-[#5C2F14] text-[#F6D18A] hover:bg-[#F6D18A] hover:text-[#2B1409] border border-[#D8A55A]/30 transition-all rounded-sm"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      type="button"
                      className="inline-flex p-2 bg-[#5C2F14]/40 text-[#F6D18A] hover:bg-[#5C2F14] border border-[#D8A55A]/30 transition-all rounded-sm"
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
