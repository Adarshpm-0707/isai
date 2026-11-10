import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

export default function useProducts() {
  // Synchronous immediate data availability (0 ms wait on page mount!)
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [categories, setCategories] = useState(() => categoryService.getLocalCategories());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    // 1. Immediately provide local categories
    const local = categoryService.getLocalCategories();
    if (Array.isArray(local) && local.length > 0) {
      setCategories(local);
    }

    // 2. Refresh from cloud in background
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
    }
  }, []);

  const fetchProducts = useCallback(async (filters = {}) => {
    // 1. Immediately provide local filtered products (0 ms wait!)
    const local = productService.getLocalProducts();
    if (local && local.length > 0) {
      const filtered = productService.filterAndSortProducts(local, filters);
      setProducts(filtered);
    } else {
      // Only show spinner if there are literally zero products stored locally
      setLoading(true);
    }
    setError(null);

    // 2. Fetch from service in background (with 1.2s fast timeout)
    try {
      const res = await productService.getProducts({
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: filters.search,
        sortBy: filters.sortBy || 'newest',
        limit: 100,
      });

      if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Notice loading products:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = async (id) => {
    if (!id) return null;
    setError(null);
    try {
      return await productService.getProductById(id);
    } catch (err) {
      console.warn('fetchProductById notice:', err.message);
      return null;
    }
  };

  const getCategories = useCallback(() => {
    const catSet = new Set();
    categories.forEach((c) => {
      if (c && c.name && c.name.trim()) catSet.add(c.name.trim());
    });
    products.forEach((p) => {
      if (p && p.category && p.category.trim()) catSet.add(p.category.trim());
    });
    return ['All', ...Array.from(catSet)];
  }, [categories, products]);

  // Initial fetch and event listeners for real-time synchronization
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleCategoriesUpdated = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        fetchCategories();
      }
    };

    const handleProductsUpdated = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        fetchProducts();
      }
    };

    window.addEventListener('isai:categories_updated', handleCategoriesUpdated);
    window.addEventListener('isai:products_updated', handleProductsUpdated);

    return () => {
      window.removeEventListener('isai:categories_updated', handleCategoriesUpdated);
      window.removeEventListener('isai:products_updated', handleProductsUpdated);
    };
  }, [fetchCategories, fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchProductById,
    getCategories,
  };
}
