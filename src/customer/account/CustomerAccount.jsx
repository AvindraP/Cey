import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../middleware/AuthProvider';
import { EyeIcon, UserCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { ProductHeader } from '../../components/products/ProductHeader';
import { Footer } from '../../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_payment: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Pending Payment' },
    payment_received: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Paid' },
    processing: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Processing' },
    shipped: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Shipped' },
    delivered: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Delivered' },
    cancelled: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Cancelled' },
    refunded: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Refunded' },
  };

  const config = statusConfig[status] || statusConfig.pending_payment;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ order, items, onClose }) => {
  const shippingAddress = typeof order.shipping_address === 'string'
    ? JSON.parse(order.shipping_address)
    : order.shipping_address;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollable border border-zinc-800">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <p className="text-sm text-zinc-400 mt-1">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payment Method:</span>
                  <span className="text-white capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Order Date:</span>
                  <span className="text-white">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                {order.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Tracking:</span>
                    <span className="text-white">{order.tracking_number}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Phone:</span>
                    <span className="text-white">{order.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-sm">
                <p className="font-medium text-white">{shippingAddress.full_name}</p>
                <p className="text-zinc-300 mt-1">{shippingAddress.address_line1}</p>
                {shippingAddress.address_line2 && (
                  <p className="text-zinc-300">{shippingAddress.address_line2}</p>
                )}
                <p className="text-zinc-300">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                </p>
                <p className="text-zinc-300">{shippingAddress.country}</p>
                <p className="text-zinc-300 mt-2">Phone: {shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Attributes</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-zinc-900/50 divide-y divide-zinc-800">
                  {items.map((item) => {
                    const attrs = typeof item.attributes === 'string' ? JSON.parse(item.attributes) : item.attributes;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-white">{item.product_name}</td>
                        <td className="px-4 py-3 text-sm text-zinc-400">{item.variation_sku || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          {attrs && (
                            <div className="flex gap-2">
                              {attrs.color && (
                                <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">{attrs.color}</span>
                              )}
                              {attrs.size && (
                                <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">{attrs.size}</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-white">${item.unit_price}</td>
                        <td className="px-4 py-3 text-sm text-right text-white">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-white">${item.subtotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Totals */}
          <div className="border-t border-zinc-800 pt-4">
            <div className="max-w-sm ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal:</span>
                <span className="text-white">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping:</span>
                <span className="text-white">${order.shipping_cost}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Tax:</span>
                  <span className="text-white">${order.tax_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-zinc-800 pt-2">
                <span className="text-white">Total:</span>
                <span className="text-white">${order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Order Notes</h3>
              <p className="text-sm text-zinc-300 bg-zinc-800/50 p-4 rounded-lg">{order.customer_notes}</p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Customer Account Component
const CustomerAccount = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    pref_name: '',
    full_name: '',
    email: '',
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'profile') {
      fetchProfile();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customer/orders`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customer/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData({
          pref_name: data.pref_name || '',
          full_name: data.full_name || '',
          email: data.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/checkout/order/${order.order_number}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedOrder(data.order);
        setOrderItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/customer/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <ProductHeader allProducts={true} />
      <Toaster position="top-right" reverseOrder={false} containerStyle={{ marginTop: '80px' }} />

      <div className='max-h-screen overflow-y-auto scrollable'>

        <div className="min-h-screen pt-18"
          style={{
            backgroundColor: 'black',
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
          }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
              <p className="text-zinc-400">Welcome back, {user?.pref_name}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-zinc-800 mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'orders' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5" />
                    Orders
                  </div>
                  {activeTab === 'orders' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'profile' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="w-5 h-5" />
                    Profile
                  </div>
                  {activeTab === 'profile' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-400">Loading...</p>
              </div>
            ) : (
              <>
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    {orders.length === 0 ? (
                      <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/30">
                        <ShoppingBagIcon className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                        <p className="text-zinc-400 mb-4">No orders yet</p>
                        <a
                          href="/products"
                          className="inline-block px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                        >
                          Start Shopping
                        </a>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                          <thead className="bg-zinc-900/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Order #</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Total</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-zinc-900/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{order.order_number}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-zinc-300">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="text-sm font-semibold text-white">${order.total_amount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => handleViewOrder(order)}
                                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                    <span className="text-sm">View</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="max-w-2xl">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                        {!isEditing && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
                          >
                            Edit Profile
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              Preferred Name
                            </label>
                            <input
                              type="text"
                              value={profileData.pref_name}
                              onChange={(e) => setProfileData({ ...profileData, pref_name: e.target.value })}
                              className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                              maxLength={20}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.full_name}
                              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                              className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                              maxLength={255}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
                              maxLength={100}
                              required
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg transition-colors font-medium"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditing(false);
                                fetchProfile();
                              }}
                              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                              Preferred Name
                            </label>
                            <p className="text-white">{profileData.pref_name}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                              Full Name
                            </label>
                            <p className="text-white">{profileData.full_name}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                              Email
                            </label>
                            <p className="text-white">{profileData.email}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          items={orderItems}
          onClose={() => {
            setSelectedOrder(null);
            setOrderItems([]);
          }}
        />
      )}
    </>
  );
};

export default CustomerAccount;