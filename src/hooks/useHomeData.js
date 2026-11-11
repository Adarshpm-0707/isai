import { useState, useEffect, useMemo, useCallback } from 'react';
import useProducts from './useProducts';

const DEFAULT_CATEGORY_BG =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';

export default function useHomeData() {
  const { products, categories, fetchProducts, fetchCategories } = useProducts();
  const [activeFilter, setActiveFilter] = useState('All');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const carouselHeight = isMobile ? '470px' : isTablet ? '530px' : '570px';

  // Derive dynamic categories from categories table and products added by admin
  const dynamicCategories = useMemo(() => {
    const map = new Map();

    (categories || []).forEach((cat) => {
      if (cat && cat.name && cat.name.trim()) {
        const name = cat.name.trim();
        map.set(name.toLowerCase(), {
          id: cat.id,
          name,
          shortName: name,
          category: name,
          img: cat.image_url || cat.image || null,
        });
      }
    });

    (products || []).forEach((p) => {
      if (p && p.category && p.category.trim()) {
        const name = p.category.trim();
        const key = name.toLowerCase();
        const pImg =
          (Array.isArray(p.images) && p.images[0]) || p.image_url || p.image || null;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name,
            shortName: name,
            category: name,
            img: pImg,
          });
        } else if (!map.get(key).img && pImg) {
          map.get(key).img = pImg;
        }
      }
    });

    return Array.from(map.values()).map((col) => ({
      ...col,
      img: col.img || DEFAULT_CATEGORY_BG,
    }));
  }, [categories, products]);

  /* 3D Carousel Saree Items */
  const categoryCarouselItems = useMemo(() => {
    if (!dynamicCategories || dynamicCategories.length === 0) {
      return [];
    }

    return dynamicCategories.map((col) => ({
      src: col.img || DEFAULT_CATEGORY_BG,
      alt: `${col.name} Handloom Saree Collection`,
      title: col.name,
      subtitle: 'Explore Handcrafted Saree Weaves',
      category: col.category,
    }));
  }, [dynamicCategories]);

  // Newly Arrived products (newest additions from admin, exactly 4 products)
  const newlyArrivedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 4)
      .map((p) => ({
        ...p,
        badge: p.badge || 'New Arrival',
      }));
  }, [products]);

  // Derive filter categories for featured section
  const productFilterCategories = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Featured products filtered by category (exactly 4 products)
  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeFilter === 'All') {
      return products.slice(0, 4);
    }
    return products
      .filter(
        (p) =>
          p.category?.toLowerCase() === activeFilter.toLowerCase() ||
          p.name?.toLowerCase().includes(activeFilter.toLowerCase())
      )
      .slice(0, 4);
  }, [products, activeFilter]);

  return {
    products,
    categories,
    activeFilter,
    setActiveFilter,
    carouselHeight,
    categoryCarouselItems,
    newlyArrivedProducts,
    productFilterCategories,
    featuredProducts,
  };
}

