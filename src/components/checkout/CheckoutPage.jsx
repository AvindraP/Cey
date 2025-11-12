import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductHeader } from '../products/ProductHeader';
import { Footer } from '../Footer';
import {
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Checkout Steps Component
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Shipping', icon: TruckIcon },
    { number: 2, label: 'Payment', icon: CreditCardIcon },
    { number: 3, label: 'Confirmation', icon: CheckCircleIcon },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep >= step.number
                    ? 'bg-white border-white text-black'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all ${
                  currentStep > step.number ? 'bg-white' : 'bg-zinc-800'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ session, items }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image ? `${API_BASE_URL}/images/${item.image}` : '/images/noimage.webp'}
                alt={item.product_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white line-clamp-1">
                {item.product_name}
              </h3>
              {item.attributes && (
                <div className="flex gap-2 text-xs text-zinc-400 mt-1">
                  {item.attributes.color && <span>{item.attributes.color}</span>}
                  {item.attributes.size && <span>• {item.attributes.size}</span>}
                </div>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-zinc-400">Qty: {item.quantity}</span>
                <span className="text-sm font-semibold text-white">
                  ${item.subtotal}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <div className="flex justify-between text-zinc-300">
          <span>Subtotal</span>
          <span className="font-semibold">${session.subtotal}</span>
        </div>
        <div className="flex justify-between text-zinc-300">
          <span>Shipping</span>
          <span className="font-semibold">
            {session.shipping_cost === 0 ? 'FREE' : `$${session.shipping_cost}`}
          </span>
        </div>
        {session.tax_amount > 0 && (
          <div className="flex justify-between text-zinc-300">
            <span>Tax</span>
            <span className="font-semibold">${session.tax_amount}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-zinc-700">
          <span>Total</span>
          <span>${session.total_amount}</span>
        </div>
      </div>

      {/* Session Expiry */}
      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <ClockIcon className="w-5 h-5" />
          <span>Session expires in 30 minutes</span>
        </div>
      </div>
    </div>
  );
};

// Shipping Form Component
const ShippingForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'USA',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name || !formData.phone || !formData.address_line1 || 
        !formData.city || !formData.state || !formData.postal_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
};

// Payment Form Component
const PaymentForm = ({ onSubmit, onBack, isLoading, customerEmail, onEmailChange }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [customerNotes, setCustomerNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!customerEmail) {
      toast.error('Please enter your email address');
      return;
    }

    onSubmit({ payment_method: paymentMethod, customer_notes: customerNotes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="your.email@example.com"
          />
          <p className="mt-2 text-xs text-zinc-500">Order confirmation will be sent to this email</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>

        <div className="space-y-3">
          <label className="flex items-center p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition-all">
            <input
              type="radio"
              name="payment_method"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-white focus:ring-2 focus:ring-white/50"
            />
            <CreditCardIcon className="w-6 h-6 ml-3 mr-2 text-zinc-400" />
            <span className="text-white font-medium">Credit / Debit Card</span>
          </label>

          <label className="flex items-center p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition-all">
            <input
              type="radio"
              name="payment_method"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-white focus:ring-2 focus:ring-white/50"
            />
            <div className="w-6 h-6 ml-3 mr-2 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-white font-medium">PayPal</span>
          </label>
        </div>

        {/* Mock Payment Notice */}
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-amber-400">
            <strong>Test Mode:</strong> This is a mock payment. No actual charges will be made.
          </p>
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Order Notes (Optional)</h2>
        <textarea
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          rows={4}
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
          placeholder="Add any special instructions for your order..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all"
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing Payment...' : 'Place Order'}
        </button>
      </div>
    </form>
  );
};

// Session Expired Component
const SessionExpired = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="mb-6">
        <XCircleIcon className="w-24 h-24 mx-auto text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Checkout Session Expired</h2>
      <p className="text-zinc-400 mb-8">
        Your checkout session has expired. Please return to your cart and try again.
      </p>
      <a
        href="/cart"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
      >
        Return to Cart
      </a>
    </div>
  );
};

// Main Checkout Page Component
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  // Get session ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('session');
    if (id) {
      setSessionId(id);
    } else {
      navigate('/cart');
    }
  }, [location.search, navigate]);

  // Fetch checkout session
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/checkout/session/${sessionId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.expired) {
            setSessionExpired(true);
          }
          throw new Error(data.error || 'Failed to fetch checkout session');
        }

        setSession(data.session);
        setItems(data.items);
      } catch (error) {
        console.error('Fetch session error:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Handle shipping form submission
  const handleShippingSubmit = async (shippingData) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/update-address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          checkout_session_id: sessionId,
          shipping_address: shippingData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update address');
      }

      toast.success('Shipping address saved');
      setCurrentStep(2);
    } catch (error) {
      console.error('Update address error:', error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async ({ payment_method, customer_notes }) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          checkout_session_id: sessionId,
          payment_method,
          customer_email: customerEmail,
          customer_notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/order-confirmation?order=${data.order_number}`);
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <ProductHeader allProducts={true} />
        <div className="min-h-screen mt-18 flex items-center justify-center"
          style={{
            backgroundColor: 'black',
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
          }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading checkout...</p>
          </div>
        </div>
      </>
    );
  }

  if (sessionExpired) {
    return (
      <>
        <ProductHeader allProducts={true} />
        <Toaster position="top-right" reverseOrder={false} containerStyle={{ marginTop: '80px' }} />
        <div className="min-h-screen mt-18"
          style={{
            backgroundColor: 'black',
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SessionExpired />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ProductHeader allProducts={true} />
      <Toaster position="top-right" reverseOrder={false} containerStyle={{ marginTop: '80px' }} />

      <div className="min-h-screen mt-18"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-slate-400">
            <a href="/" className="hover:text-slate-300 cursor-pointer">Home</a>
            <span className="mx-2">/</span>
            <a href="/cart" className="hover:text-slate-300 cursor-pointer">Cart</a>
            <span className="mx-2">/</span>
            <span className="text-slate-100">Checkout</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-zinc-400">Complete your order securely</p>
          </div>

          {/* Checkout Steps */}
          <CheckoutSteps currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <ShippingForm onSubmit={handleShippingSubmit} isLoading={isProcessing} />
              )}

              {currentStep === 2 && (
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  onBack={() => setCurrentStep(1)}
                  isLoading={isProcessing}
                  customerEmail={customerEmail}
                  onEmailChange={setCustomerEmail}
                />
              )}
            </div>

            {/* Order Summary Sidebar */}
            {session && (
              <div>
                <OrderSummary session={session} items={items} />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;