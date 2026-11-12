import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import PriceTag from '../../components/reusable/PriceTag';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  PackageOpen,
} from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [categories, setCategories] = useState(() => categoryService.getLocalCategories());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchCategories = async () => {
    const local = categoryService.getLocalCategories();
    if (Array.isArray(local) && local.length > 0) setCategories(local);
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.warn('Error loading categories:', err);
    }
  };

  const fetchAllProducts = async () => {
    // 1. Instantly show local products (0 ms wait)
    const local = productService.getLocalProducts();
    if (local && local.length > 0) {
      const filtered = productService.filterAndSortProducts(local, {
        search,
        category: categoryFilter === 'All' ? null : categoryFilter,
      });
      setProducts(filtered);
    } else {
      setLoading(true);
    }

    try {
      const res = await productService.getProducts({
        search,
        category: categoryFilter === 'All' ? null : categoryFilter,
        limit: 100,
      });
      if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to query products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAllProducts();

    const handleProductsUpdated = (e) => {
      if (Array.isArray(e.detail)) {
        const filtered = productService.filterAndSortProducts(e.detail, {
          search,
          category: categoryFilter === 'All' ? null : categoryFilter,
        });
        setProducts(filtered);
      } else {
        fetchAllProducts();
      }
    };

    window.addEventListener('isai:products_updated', handleProductsUpdated);
    return () => window.removeEventListener('isai:products_updated', handleProductsUpdated);
  }, [search, categoryFilter]);

  const handleDelete = async (product) => {
    const id = typeof product === 'object' ? product.id : product;
    const name = typeof product === 'object' ? product.name : 'this product';
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await productService.deleteProduct(product);
      adminLogService.logAction('DELETE_PRODUCT', 'products', id, {}).catch(() => {});
      setProducts((prev) => prev.filter((p) => p.id !== id && String(p.id) !== String(id)));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#F5E6BE] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Product Inventory"
          subtitle="Configure, add, edit, or remove catalog items"
          align="left"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Product */}
          <Link
            to="/admin/products/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 px-5 py-2.5 font-sans text-xs uppercase tracking-wider font-bold rounded-lg shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between bg-[#0F131C] border border-[#D4AF37]/30 p-3.5 sm:p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2 bg-[#161B26] border border-[#D4AF37]/30 rounded-lg px-3 py-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[#FFFFFF] placeholder:text-[#A1A1AA]/60 focus:outline-none w-full text-xs"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <span className="text-[#D4AF37] font-bold uppercase shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-[#161B26] border border-[#D4AF37]/30 text-[#FFFFFF] px-3 py-2 rounded-lg focus:outline-none cursor-pointer text-xs"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/30 rounded-xl shadow-xl overflow-hidden text-[#FFFFFF]">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-[#A1A1AA]">Loading Inventory Records...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-3">
            <PackageOpen className="w-10 h-10 text-[#D4AF37] mx-auto opacity-75" />
            <h3 className="font-sans font-bold text-lg text-[#FFFFFF]">No Products Found</h3>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto font-light">
              {search || categoryFilter !== 'All'
                ? 'No products match the chosen filter. Try clearing your search.'
                : 'No products added yet. Click "Add Product" to create your first saree listing in the database.'}
            </p>
            {(!search && categoryFilter === 'All') && (
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#090B10] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg mt-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Preview</th>
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6 min-w-[140px]">Name</th>
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Category</th>
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Price</th>
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6">Stock</th>
                  <th className="py-3.5 sm:py-4 px-3 sm:px-5 lg:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6">
                      <div className="w-10 aspect-[3/4] overflow-hidden bg-[#0A0D14] border border-[#D4AF37]/30 rounded">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 font-semibold text-[#FFFFFF] max-w-[130px] sm:max-w-xs truncate" title={product.name}>
                      {product.name}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 uppercase text-[10px] text-[#A1A1AA] font-bold whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 whitespace-nowrap">
                      <PriceTag price={product.discount_price || product.price} size="sm" />
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 font-medium text-[#A1A1AA] whitespace-nowrap">
                      {product.stock <= 0 ? (
                        <span className="text-[#F5E6BE] bg-[#161B26] px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#D4AF37]/35">
                          Out of Stock
                        </span>
                      ) : product.stock < 5 ? (
                        <span className="text-[#FFD54F] bg-[#161B26] px-2 py-0.5 rounded font-bold uppercase text-[9px] border border-[#D4AF37]/35">
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span>{product.stock} units</span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-5 lg:px-6 text-right space-x-1.5 sm:space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="inline-flex p-1.5 sm:p-2 bg-[#161B26] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 transition-all rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        type="button"
                        className="inline-flex p-1.5 sm:p-2 bg-[#161B26] text-[#A1A1AA] hover:text-white hover:bg-red-900/80 border border-[#D4AF37]/35 transition-all rounded cursor-pointer"
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
        )}
      </div>
    </div>
  );
}
