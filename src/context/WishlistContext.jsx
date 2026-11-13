import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { wishlistService, getLocalWishlist } from '../services/wishlistService';

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);

  // Synchronous immediate initialization (0 ms wait on page load or refresh!)
  const [wishlistItems, setWishlistItems] = useState(() => getLocalWishlist());
  const [loading, setLoading] = useState(false);

  // Sync with cloud when user logs in
  useEffect(() => {
    let isMounted = true;
    const syncWishlist = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const remoteItems = await wishlistService.getWishlist(user.id);
        if (isMounted && Array.isArray(remoteItems)) {
          setWishlistItems(remoteItems);
        }
      } catch (err) {
        console.warn('Wishlist cloud sync notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    syncWishlist();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Toggle Wishlist (supports both full product object and ID)
  const toggleWishlist = useCallback(
    async (productOrId) => {
      if (!productOrId) return { added: false };

      try {
        const result = await wishlistService.toggleWishlist(productOrId, user?.id || null);
        if (result?.items && Array.isArray(result.items)) {
          setWishlistItems([...result.items]);
        } else {
          setWishlistItems(getLocalWishlist());
        }
        return result;
      } catch (err) {
        console.error('Error toggling wishlist:', err);
        return { added: false };
      }
    },
    [user]
  );

  // Check if a product is in the wishlist
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      const targetId = String(productId).trim();
      return wishlistItems.some((item) => {
        const itemPid = String(item.product_id || item.product?.id || item.id || '').trim();
        return itemPid === targetId;
      });
    },
    [wishlistItems]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      return toggleWishlist(productId);
    },
    [toggleWishlist]
  );

  // Clear all wishlist
  const clearWishlist = useCallback(() => {
    wishlistService.clearWishlist();
    setWishlistItems([]);
  }, []);

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
