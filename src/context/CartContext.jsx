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

  const saveLocalCart = (items) => {
    localStorage.setItem('isai_cart', JSON.stringify(items));
  };

  const getLocalCart = () => {
    try {
      const localStr = localStorage.getItem('isai_cart');
      return localStr ? JSON.parse(localStr) : [];
    } catch (e) {
      return [];
    }
  };

  // Load cart initially & when user changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user) {
          const remoteCart = await cartService.getCart(user.id);
          if (remoteCart && Array.isArray(remoteCart)) {
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
              if (updatedRemote) {
                setCartItems(updatedRemote);
              } else {
                setCartItems(getLocalCart());
              }
            } else {
              setCartItems(remoteCart);
            }
          } else {
            // Database table missing fallback
            setCartItems(getLocalCart());
          }
        } else {
          setCartItems(getLocalCart());
        }
      } catch (err) {
        console.warn('Error loading cart, using local fallback:', err);
        setCartItems(getLocalCart());
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 1, size = null) => {
    setLoading(true);
    let successRemote = false;

    try {
      if (user) {
        const res = await cartService.addToCart({
          userId: user.id,
          productId: product.id,
          quantity,
          size,
        });

        if (res !== null) {
          const updated = await cartService.getCart(user.id);
          if (updated) {
            setCartItems(updated);
            successRemote = true;
          }
        }
      }
    } catch (err) {
      console.warn('Remote addToCart warning, falling back to local:', err);
    }

    if (!successRemote) {
      // Local storage cart fallback
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (i) => (i.product_id || i.product?.id || i.id) === product.id
        );
        let newItems;
        if (existingIndex > -1) {
          newItems = [...prevItems];
          newItems[existingIndex].quantity = (newItems[existingIndex].quantity || 1) + quantity;
          newItems[existingIndex].size = size || newItems[existingIndex].size;
        } else {
          newItems = [
            ...prevItems,
            {
              id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              product_id: product.id,
              quantity,
              size,
              product,
            },
          ];
        }
        saveLocalCart(newItems);
        return newItems;
      });
    }

    setLoading(false);
  };

  const updateQuantity = async (cartItemId, quantity) => {
    setLoading(true);
    let successRemote = false;

    try {
      if (user) {
        const res = await cartService.updateQuantity(cartItemId, quantity);
        if (res !== null) {
          const updated = await cartService.getCart(user.id);
          if (updated) {
            setCartItems(updated);
            successRemote = true;
          }
        }
      }
    } catch (err) {
      console.warn('Remote updateQuantity warning:', err);
    }

    if (!successRemote) {
      setCartItems((prevItems) => {
        let newItems;
        if (quantity <= 0) {
          newItems = prevItems.filter((i) => i.id !== cartItemId && i.product_id !== cartItemId);
        } else {
          newItems = prevItems.map((item) =>
            item.id === cartItemId || item.product_id === cartItemId ? { ...item, quantity } : item
          );
        }
        saveLocalCart(newItems);
        return newItems;
      });
    }

    setLoading(false);
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    let successRemote = false;

    try {
      if (user) {
        const res = await cartService.removeFromCart(cartItemId);
        if (res) {
          const updated = await cartService.getCart(user.id);
          if (updated) {
            setCartItems(updated);
            successRemote = true;
          }
        }
      }
    } catch (err) {
      console.warn('Remote removeFromCart warning:', err);
    }

    if (!successRemote) {
      setCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== cartItemId && item.product_id !== cartItemId);
        saveLocalCart(newItems);
        return newItems;
      });
    }

    setLoading(false);
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (user) {
        await cartService.clearCart(user.id);
      }
    } catch (err) {
      console.warn('Remote clearCart warning:', err);
    }
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('isai_cart');
    setLoading(false);
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
