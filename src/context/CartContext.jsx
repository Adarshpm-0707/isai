import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart initially
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user) {
        // Logged in: fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user.id);

          if (error) throw error;
          
          // Map to standard format
          const formatted = data.map(item => ({
            id: item.id,
            product_id: item.product_id,
            qty: item.qty,
            name: item.product?.name || 'Saree',
            price: item.product?.price || 0,
            image: item.product?.images?.[0] || '',
            stock: item.product?.stock || 0,
            product: item.product,
          }));

          // Merge local cart if exists
          const localCartStr = localStorage.getItem('saree_store_cart');
          if (localCartStr) {
            const localCart = JSON.parse(localCartStr);
            if (localCart.length > 0) {
              const merged = [...formatted];
              for (const locItem of localCart) {
                const existing = merged.find(i => i.product_id === locItem.product_id);
                if (existing) {
                  const newQty = Math.min(existing.qty + locItem.qty, existing.stock || 99);
                  await supabase
                    .from('cart_items')
                    .update({ qty: newQty })
                    .eq('id', existing.id);
                  existing.qty = newQty;
                } else {
                  const { data: inserted, error: insErr } = await supabase
                    .from('cart_items')
                    .insert({
                      user_id: user.id,
                      product_id: locItem.product_id,
                      qty: locItem.qty,
                    })
                    .select('*, product:products(*)')
                    .single();
                  
                  if (!insErr && inserted) {
                    merged.push({
                      id: inserted.id,
                      product_id: inserted.product_id,
                      qty: inserted.qty,
                      name: inserted.product?.name || 'Saree',
                      price: inserted.product?.price || 0,
                      image: inserted.product?.images?.[0] || '',
                      stock: inserted.product?.stock || 0,
                      product: inserted.product,
                    });
                  }
                }
              }
              localStorage.removeItem('saree_store_cart');
              setCart(merged);
            } else {
              setCart(formatted);
            }
          } else {
            setCart(formatted);
          }
        } catch (err) {
          console.error('Error fetching cart from Supabase:', err);
        }
      } else {
        // Guest: fetch from localStorage
        const localCartStr = localStorage.getItem('saree_store_cart');
        if (localCartStr) {
          setCart(JSON.parse(localCartStr));
        } else {
          setCart([]);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  // Save guest cart to localStorage
  const saveLocalCart = (newCart) => {
    localStorage.setItem('saree_store_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product, qty = 1) => {
    if (user) {
      setLoading(true);
      try {
        const existing = cart.find(item => item.product_id === product.id);
        if (existing) {
          const newQty = existing.qty + qty;
          const { error } = await supabase
            .from('cart_items')
            .update({ qty: newQty })
            .eq('id', existing.id);

          if (error) throw error;
          
          setCart(cart.map(item => 
            item.product_id === product.id ? { ...item, qty: newQty } : item
          ));
        } else {
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              qty: qty,
            })
            .select('*, product:products(*)')
            .single();

          if (error) throw error;

          if (data) {
            setCart([
              ...cart,
              {
                id: data.id,
                product_id: data.product_id,
                qty: data.qty,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                stock: product.stock || 0,
                product: product,
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error adding to cart in Supabase:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local storage
      const existing = cart.find(item => item.product_id === product.id);
      let newCart;
      if (existing) {
        newCart = cart.map(item =>
          item.product_id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        newCart = [
          ...cart,
          {
            id: `temp-${Date.now()}`,
            product_id: product.id,
            qty: qty,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            stock: product.stock || 0,
            product: product,
          }
        ];
      }
      setCart(newCart);
      saveLocalCart(newCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      setLoading(true);
      try {
        const item = cart.find(item => item.product_id === productId);
        if (item) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', item.id);

          if (error) throw error;

          setCart(cart.filter(i => i.product_id !== productId));
        }
      } catch (err) {
        console.error('Error removing from cart in Supabase:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const newCart = cart.filter(item => item.product_id !== productId);
      setCart(newCart);
      saveLocalCart(newCart);
    }
  };

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    
    if (user) {
      setLoading(true);
      try {
        const item = cart.find(item => item.product_id === productId);
        if (item) {
          const { error } = await supabase
            .from('cart_items')
            .update({ qty: newQty })
            .eq('id', item.id);

          if (error) throw error;

          setCart(cart.map(i =>
            i.product_id === productId ? { ...i, qty: newQty } : i
          ));
        }
      } catch (err) {
        console.error('Error updating cart qty in Supabase:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const newCart = cart.map(item =>
        item.product_id === productId ? { ...item, qty: newQty } : item
      );
      setCart(newCart);
      saveLocalCart(newCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        setCart([]);
      } catch (err) {
        console.error('Error clearing cart in Supabase:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setCart([]);
      localStorage.removeItem('saree_store_cart');
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
