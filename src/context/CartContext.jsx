import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'isai_cart';

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const getLocalCart = () => {
    try {
      const localStr = localStorage.getItem(CART_STORAGE_KEY);
      return localStr ? JSON.parse(localStr) : [];
    } catch {
      return [];
    }
  };

  const saveLocalCart = (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('saveLocalCart error:', e);
    }
  };

  // Synchronous immediate initialization (0 ms wait on page load or refresh!)
  const [cartItems, setCartItems] = useState(() => getLocalCart());
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync with cloud cart when logged in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const syncCart = async () => {
      try {
        const remoteCart = await cartService.getCart(user.id);
        if (remoteCart && Array.isArray(remoteCart) && isMounted) {
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            // Merge local items with remote
            for (const loc of localItems) {
              await cartService.addToCart({
                userId: user.id,
                productId: loc.product_id || loc.product?.id || loc.id,
                quantity: loc.quantity || loc.qty || 1,
                size: loc.size,
              });
            }
            const updated = await cartService.getCart(user.id);
            if (updated && isMounted) {
              setCartItems(updated);
              saveLocalCart(updated);
            }
          } else {
            setCartItems(remoteCart);
            saveLocalCart(remoteCart);
          }
        }
      } catch (err) {
        console.warn('Cart sync notice:', err);
      }
    };

    syncCart();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fast, instant Add to Cart (0 ms wait)
  const addToCart = async (product, quantity = 1, size = null) => {
    if (!product) return;

    const pId = product.id;
    const current = getLocalCart();
    const existingIndex = current.findIndex(
      (i) => (i.product_id || i.product?.id || i.id) === pId
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = [...current];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: (newItems[existingIndex].quantity || 1) + quantity,
        size: size || newItems[existingIndex].size,
      };
    } else {
      newItems = [
        ...current,
        {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          product_id: pId,
          quantity,
          size,
          product,
        },
      ];
    }

    // Update state & localStorage immediately
    saveLocalCart(newItems);
    setCartItems(newItems);

    // Sync to Supabase in background without blocking caller
    if (user) {
      cartService
        .addToCart({
          userId: user.id,
          productId: pId,
          quantity,
          size,
        })
        .catch((e) => console.warn('Background cart sync:', e?.message));
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    let newItems;
    if (quantity <= 0) {
      newItems = cartItems.filter(
        (i) => i.id !== cartItemId && i.product_id !== cartItemId
      );
    } else {
      newItems = cartItems.map((item) =>
        item.id === cartItemId || item.product_id === cartItemId
          ? { ...item, quantity }
          : item
      );
    }

    saveLocalCart(newItems);
    setCartItems(newItems);

    if (user) {
      cartService
        .updateQuantity(cartItemId, quantity)
        .catch((e) => console.warn('Background updateQuantity sync:', e?.message));
    }
  };

  const removeFromCart = async (cartItemId) => {
    const newItems = cartItems.filter(
      (item) => item.id !== cartItemId && item.product_id !== cartItemId
    );
    saveLocalCart(newItems);
    setCartItems(newItems);

    if (user) {
      cartService
        .removeFromCart(cartItemId)
        .catch((e) => console.warn('Background removeFromCart sync:', e?.message));
    }
  };

  const clearCart = async () => {
    saveLocalCart([]);
    setCartItems([]);
    setAppliedCoupon(null);

    if (user) {
      cartService
        .clearCart(user.id)
        .catch((e) => console.warn('Background clearCart sync:', e?.message));
    }
  };

  const applyCoupon = async (code) => {
    const res = await couponService.validateCoupon(code, subtotal, user?.id);
    setAppliedCoupon(res.coupon);
    return res;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Totals calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice =
      item.product?.discount_price ??
      item.product?.price ??
      item.price ??
      0;
    const qty = item.quantity || item.qty || 1;
    return acc + Number(unitPrice) * qty;
  }, 0);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || item.qty || 1),
    0
  );

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * Number(appliedCoupon.value)) / 100;
    } else {
      discount = Number(appliedCoupon.value);
    }
    discount = Math.min(discount, subtotal);
  }

  const shippingFee = 0;
  const totalAmount = Math.max(0, subtotal - discount);

  const value = {
    cartItems,
    cart: cartItems,
    cartCount,
    subtotal,
    cartTotal: subtotal,
    discount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    loading,
    addToCart,
    updateQuantity,
    updateQty: updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
