import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart initially & when user changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const remoteCart = await cartService.getCart(user.id);
          const localStr = localStorage.getItem('isai_cart');
          if (localStr) {
            const localItems = JSON.parse(localStr);
            if (localItems.length > 0) {
              for (const loc of localItems) {
                await cartService.addToCart({
                  userId: user.id,
                  productId: loc.product_id || loc.id,
                  quantity: loc.quantity || loc.qty || 1,
                  size: loc.size,
                });
              }
              localStorage.removeItem('isai_cart');
            }
            const updatedRemote = await cartService.getCart(user.id);
            setCartItems(updatedRemote);
          } else {
            setCartItems(remoteCart);
          }
        } else {
          const localStr = localStorage.getItem('isai_cart');
          if (localStr) {
            setCartItems(JSON.parse(localStr));
          } else {
            setCartItems([]);
          }
        }
      } catch (err) {
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const saveLocalCart = (items) => {
    localStorage.setItem('isai_cart', JSON.stringify(items));
  };

  const addToCart = async (product, quantity = 1, size = null) => {
    setLoading(true);
    try {
      if (user) {
        await cartService.addToCart({
          userId: user.id,
          productId: product.id,
          quantity,
          size,
        });
        const updated = await cartService.getCart(user.id);
        setCartItems(updated);
      } else {
        const existingIndex = cartItems.findIndex(
          (i) => (i.product_id || i.product?.id || i.id) === product.id
        );
        let newItems;
        if (existingIndex > -1) {
          newItems = [...cartItems];
          newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 1) + quantity;
          newItems[existingIndex].size = size || newItems[existingIndex].size;
        } else {
          newItems = [
            ...cartItems,
            {
              id: `guest_${Date.now()}`,
              product_id: product.id,
              quantity,
              size,
              product,
            },
          ];
        }
        setCartItems(newItems);
        saveLocalCart(newItems);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    setLoading(true);
    try {
      if (user) {
        await cartService.updateQuantity(cartItemId, quantity);
        const updated = await cartService.getCart(user.id);
        setCartItems(updated);
      } else {
        if (quantity <= 0) {
          await removeFromCart(cartItemId);
          return;
        }
        const newItems = cartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setCartItems(newItems);
        saveLocalCart(newItems);
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      if (user) {
        await cartService.removeFromCart(cartItemId);
        const updated = await cartService.getCart(user.id);
        setCartItems(updated);
      } else {
        const newItems = cartItems.filter((item) => item.id !== cartItemId);
        setCartItems(newItems);
        saveLocalCart(newItems);
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (user) {
        await cartService.clearCart(user.id);
      }
      setCartItems([]);
      setAppliedCoupon(null);
      localStorage.removeItem('isai_cart');
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
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

  // Recalculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.product?.discount_price ?? item.product?.price ?? item.price ?? 0;
    const qty = item.quantity || item.qty || 1;
    return acc + Number(unitPrice) * qty;
  }, 0);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * Number(appliedCoupon.value)) / 100;
    } else {
      discount = Number(appliedCoupon.value);
    }
    discount = Math.min(discount, subtotal);
  }

  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const value = {
    cartItems,
    cart: cartItems, // Alias for backward compatibility
    cartCount,
    subtotal,
    cartTotal: subtotal, // Alias for backward compatibility
    discount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    loading,
    addToCart,
    updateQuantity,
    updateQty: updateQuantity, // Alias for backward compatibility
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
