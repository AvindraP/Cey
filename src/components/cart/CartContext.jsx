import React, { createContext, useState, useEffect, useContext } from "react";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartApi";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Load cart once on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (product_id, variation_id, quantity = 1) => {
    await addToCart(product_id, variation_id, quantity);
    await loadCart();
  };

  const handleUpdate = async (itemId, quantity) => {
    await updateCartItem(itemId, quantity);
    await loadCart();
  };

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId);
    await loadCart();
  };

  const handleClear = async () => {
    await clearCart();
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        handleAdd,
        handleUpdate,
        handleRemove,
        handleClear,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
