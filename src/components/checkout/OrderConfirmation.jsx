import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  PrinterIcon,
  ArrowRightIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Footer } from '../Footer';
import { ProductHeader } from '../products/ProductHeader';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Order Not Found Component
const OrderNotFound = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="mb-6">
        <XCircleIcon className="w-24 h-24 mx-auto text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Order Not Found</h2>
      <p className="text-zinc-400 mb-8">
        We couldn't find the order you're looking for. Please check your order number and try again.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
      >
        Return to Home
      </button>
    </div>
  );
};

// Order Confirmation Page Component
const OrderConfirmationPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  // Get order number from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get('order');
    if (order) {
      setOrderNumber(order);
    } else {
      setError(true);
      setLoading(false);
    }
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

      try {
        const response = await fetch(`${API_BASE_URL}/checkout/order/${orderNumber}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order');
        }

        setOrderData(data);
      } catch (err) {
        console.error('Fetch order error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    window.location.href = '/products';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OrderNotFound />
        </div>
      </div>
    );
  }

  const { order, items } = orderData;

  return (
    <>
    <ProductHeader allProducts={false} />
    <div className="min-h-screen mt-18"
      style={{
        backgroundColor: 'black',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
      }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-lg text-zinc-400">Thank you for your purchase</p>
        </div>

        {/* Order Number Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-6 text-center">
          <p className="text-sm text-zinc-400 mb-2">Order Number</p>
          <p className="text-2xl font-bold text-white mb-3">{order.order_number}</p>
          <p className="text-sm text-zinc-400">
            A confirmation email has been sent to <span className="text-white font-medium">{order.customer_email}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Receipt
          </button>
          <button
            onClick={handleContinueShopping}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
          >
            Continue Shopping
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Status */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Estimated Delivery</h3>
                <p className="text-sm text-zinc-400">3-5 business days</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Shipping To</h3>
                <p className="text-sm text-zinc-400">
                  {order.shipping_address?.city || 'Address on file'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Payment Method</h3>
                <p className="text-sm text-zinc-400 capitalize">{order.payment_method}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6" />
            Order Items
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={`${API_BASE_URL}/images/${item.image}`}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <ShoppingBagIcon className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{item.product_name}</h3>
                  {item.attributes && (
                    <div className="flex gap-2 text-sm text-zinc-400 mb-2">
                      {item.attributes.color && <span>{item.attributes.color}</span>}
                      {item.attributes.size && <span>• {item.attributes.size}</span>}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Qty: {item.quantity}</span>
                    <span className="font-semibold text-white">${parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="space-y-3">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Shipping</span>
                <span className="font-semibold">
                  {parseFloat(order.shipping_cost) === 0 ? 'FREE' : `$${parseFloat(order.shipping_cost).toFixed(2)}`}
                </span>
              </div>
              {parseFloat(order.tax_amount) > 0 && (
                <div className="flex justify-between text-zinc-300">
                  <span>Tax</span>
                  <span className="font-semibold">${parseFloat(order.tax_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-zinc-700">
                <span>Total</span>
                <span>${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm text-zinc-300">
                <p className="font-semibold text-white">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{order.shipping_address.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{order.customer_email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Notes or Status */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            {order.customer_notes ? (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Order Notes</h2>
                <p className="text-sm text-zinc-300">{order.customer_notes}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Next Steps</h2>
                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Order Confirmed</p>
                      <p className="text-xs text-zinc-400">We've received your order</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-500"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Processing</p>
                      <p className="text-xs text-zinc-400">Preparing your items</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-500"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Shipped</p>
                      <p className="text-xs text-zinc-400">You'll receive tracking info</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
          <p className="text-sm text-zinc-400 mb-4">
            If you have any questions about your order, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => alert('Contact Support feature coming soon!')}
              className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition-all"
            >
              Contact Support
            </button>
            <button
              onClick={() => alert('Order Tracking feature coming soon!')}
              className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition-all"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default OrderConfirmationPage;