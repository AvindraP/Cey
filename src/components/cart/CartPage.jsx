import React, { useState } from "react";
import { useCart } from "./CartContext";
import { ProductHeader } from '../products/ProductHeader';
import { Footer } from '../Footer';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-2 flex items-center gap-3 animate-slide-in ${type === 'success'
      ? 'bg-green-500/20 border-green-500/50 text-green-400'
      : 'bg-red-500/20 border-red-500/50 text-red-400'
      }`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="text-xl hover:opacity-70">×</button>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    setIsUpdating(true);
    await onUpdate(item.id, newQuantity);
    setIsUpdating(false);
  };

  const subtotal = (item.price * quantity);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 sm:p-6 hover:border-zinc-700 transition-all">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-32 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image ? `${API_BASE_URL}/images/${item.image}` : '/images/noimage.webp'}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                {item.product_name}
              </h3>
              {item.variation_sku && (
                <p className="text-sm text-zinc-400">
                  SKU: {item.variation_sku}
                </p>
              )}
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
              title="Remove item"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">Qty:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                  className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon className="w-4 h-4 text-white" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    handleQuantityChange(val);
                  }}
                  disabled={isUpdating}
                  className="w-16 h-8 text-center bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-zinc-400">${item.price} each</div>
                <div className="text-xl font-bold text-white">${subtotal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ cart, onCheckout, onClearCart }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-zinc-300">
          <span>Subtotal ({cart.items?.length || 0} items)</span>
          <span className="font-semibold">${cart.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-zinc-300">
          <span>Shipping</span>
          <span className="font-semibold">
            {cart.shipping === 0 ? 'FREE' : `$${cart.shipping?.toFixed(2) || '0.00'}`}
          </span>
        </div>
        <div className="border-t border-zinc-700 pt-4 flex justify-between text-lg font-bold text-white">
          <span>Total</span>
          <span>${cart.total?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onCheckout}
          className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Proceed to Checkout
        </button>

        <button
          onClick={onClearCart}
          className="w-full py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all"
        >
          Clear Cart
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="space-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xs">✓</span>
            </div>
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xs">✓</span>
            </div>
            <span>Free shipping on orders over $100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xs">✓</span>
            </div>
            <span>30-day return policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  return (
    <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/30">
      <div className="mb-6">
        <ShoppingBagIcon className="w-24 h-24 mx-auto text-zinc-600" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
      <p className="text-zinc-400 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>
      <a
        href="/products"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
      >
        Continue Shopping
      </a>
    </div>
  );
};

// Main Cart Page Component
const CartPage = () => {
  const { cart, loading, handleUpdate, handleRemove, handleClear } = useCart();

  const handleUpdateWithToast = async (itemId, quantity) => {
    try {
      await handleUpdate(itemId, quantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveWithToast = async (itemId) => {
    try {
      await handleRemove(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearWithConfirm = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await handleClear();
        toast.success('Cart cleared successfully');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout...');
    toast.success('Checkout coming soon!');
  };

  return (
    <>
      <ProductHeader allProducts={true} />

      {/* Toaster */}
      <Toaster position="top-right" reverseOrder={false} containerStyle={{ marginTop: '80px', }} />

      <div className="min-h-screen mt-20 w-full overflow-x-hidden"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-slate-400">
            <a href="/" className="hover:text-slate-300 cursor-pointer">Home</a>
            <span className="mx-2">/</span>
            <span className="text-slate-100">Shopping Cart</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Shopping Cart</h1>
            {!loading && cart.items && cart.items.length > 0 && (
              <p className="text-zinc-400">
                You have {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg h-48 animate-pulse"
                  />
                ))}
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg h-96 animate-pulse" />
            </div>
          ) : !cart.items || cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateWithToast}
                    onRemove={handleRemoveWithToast}
                  />
                ))}

                {/* Continue Shopping Link */}
                <div className="pt-4">
                  <a
                    href="/products"
                    className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    ← Continue Shopping
                  </a>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <OrderSummary
                  cart={cart}
                  onCheckout={handleCheckout}
                  onClearCart={handleClearWithConfirm}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CartPage;