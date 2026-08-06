import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { wishlistService } from '../services/wishlistService';

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const items = await wishlistService.getWishlist(user.id);
          setWishlistItems(items);
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to add items to your wishlist');
    }
    setLoading(true);
    try {
      const res = await wishlistService.toggleWishlist(user.id, productId);
      const updated = await wishlistService.getWishlist(user.id);
      setWishlistItems(updated);
      return res;
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.product_id === productId || item.product?.id === productId
    );
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    return toggleWishlist(productId);
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
