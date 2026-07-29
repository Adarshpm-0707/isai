import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const MOCK_PRODUCTS = [
  {
    id: 'prod-banarasi-1',
    name: 'Varanasi Gold Zari Banarasi Saree',
    description: 'An exquisite Banarasi silk saree woven with finest golden zari border, featuring royal motifs and an ornate pallu. Perfect for brides and grand festive occasions.',
    price: 18500,
    stock: 8,
    category: 'Banarasi',
    images: [
      'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prod-kanchipuram-1',
    name: 'Crimson Royal Kanchipuram Saree',
    description: 'A gorgeous deep red Kanchipuram silk saree handloomed in Tamil Nadu, highlighted by detailed temple borders and high contrast gold embroidery.',
    price: 24000,
    stock: 5,
    category: 'Kanchipuram',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-02T00:00:00Z'
  },
  {
    id: 'prod-chanderi-1',
    name: 'Ivory & Gold Chanderi Saree',
    description: 'Lightweight and sheer, this classic Chanderi saree blends cotton and silk to create a subtle glow, decorated with small bootis and gold stripes.',
    price: 5800,
    stock: 12,
    category: 'Chanderi',
    images: [
      'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-03T00:00:00Z'
  },
  {
    id: 'prod-tussar-1',
    name: 'Sage Green Tussar Silk Saree',
    description: 'Crafted from wild Tussar silk, this natural tone saree showcases delicate hand-painted floral designs on the pallu and contrasting borders.',
    price: 9200,
    stock: 7,
    category: 'Tussar',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-04T00:00:00Z'
  },
  {
    id: 'prod-organza-1',
    name: 'Blush Pink Embroidered Organza Saree',
    description: 'A contemporary organza saree featuring gorgeous floral threadwork and scalloped borders. Crisp, transparent texture for modern elegant styling.',
    price: 7200,
    stock: 15,
    category: 'Organza',
    images: [
      'https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-05T00:00:00Z'
  },
  {
    id: 'prod-patola-1',
    name: 'Royal Blue Silk Patola Saree',
    description: 'Woven by master artisans, this traditional Patola saree exhibits complex geometric double ikat patterns in bold vibrant shades.',
    price: 32000,
    stock: 3,
    category: 'Patola',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600'
    ],
    created_at: '2026-01-06T00:00:00Z'
  }
];

export default function useProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('products').select('*');

      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error: dbErr } = await query.order('created_at', { ascending: false });

      if (dbErr) {
        // If Supabase keys are not set up or there's an error, fallback to mock data
        console.warn('Supabase products fetch error, using mock data:', dbErr.message);
        let filteredMock = [...MOCK_PRODUCTS];
        if (filters.category && filters.category !== 'All') {
          filteredMock = filteredMock.filter(p => p.category === filters.category);
        }
        if (filters.minPrice) {
          filteredMock = filteredMock.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          filteredMock = filteredMock.filter(p => p.price <= filters.maxPrice);
        }
        setProducts(filteredMock);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        // If data is empty in DB, fallback to mock data
        let filteredMock = [...MOCK_PRODUCTS];
        if (filters.category && filters.category !== 'All') {
          filteredMock = filteredMock.filter(p => p.category === filters.category);
        }
        setProducts(filteredMock);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = async (id) => {
    setError(null);
    try {
      const { data, error: dbErr } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (dbErr) {
        console.warn(`Supabase product by id fetch error for ${id}, checking mock data:`, dbErr.message);
        const mockItem = MOCK_PRODUCTS.find(p => p.id === id);
        if (mockItem) return mockItem;
        throw dbErr;
      }
      return data;
    } catch (err) {
      console.error('Failed to fetch product by id:', err);
      const mockItem = MOCK_PRODUCTS.find(p => p.id === id);
      if (mockItem) return mockItem;
      throw err;
    }
  };

  const getCategories = () => {
    // Unique list of categories
    return ['All', 'Banarasi', 'Kanchipuram', 'Chanderi', 'Tussar', 'Organza', 'Patola'];
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    getCategories,
  };
}
