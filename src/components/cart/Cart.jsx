import React from "react";
import { CartProvider } from "./CartContext";
import CartPage from "./CartPage";

export default function Cart() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
};