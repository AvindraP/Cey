import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_payment: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30', label: 'Pending Payment' },
    payment_received: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', label: 'Paid' },
    processing: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', label: 'Processing' },
    shipped: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30', label: 'Shipped' },
    delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', label: 'Delivered' },
    cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', label: 'Cancelled' },
    refunded: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/30', label: 'Refunded' },
  };

  const config = statusConfig[status] || statusConfig.pending_payment;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// Payment Status Badge Component
const PaymentBadge = ({ status }) => {
  const config = {
    pending: { icon: ClockIcon, bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    paid: { icon: CheckCircleIcon, bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
    failed: { icon: XCircleIcon, bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
    refunded: { icon: XCircleIcon, bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/30' },
  };

  const { icon: Icon, bg, text, border } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${bg} ${text} ${border}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, items, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address) 
    : order.shipping_address;

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus, trackingNumber);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollable">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-300">Order Details</h2>
            <p className="text-sm text-gray-400 mt-1">Order #{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <PaymentBadge status={order.payment_status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium text-gray-300 capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Date:</span>
                  <span className="font-medium text-gray-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-200">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-200">{order.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Shipping Address</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 text-sm">
                <p className="font-medium text-gray-200">{shippingAddress.full_name}</p>
                <p className="text-gray-300 mt-1">{shippingAddress.address_line1}</p>
                {shippingAddress.address_line2 && (
                  <p className="text-gray-300">{shippingAddress.address_line2}</p>
                )}
                <p className="text-gray-300">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                </p>
                <p className="text-gray-300">{shippingAddress.country}</p>
                <p className="text-gray-300 mt-2">Phone: {shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Order Items</h3>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attributes</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {items.map((item) => {
                    const attrs = typeof item.attributes === 'string' ? JSON.parse(item.attributes) : item.attributes;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-200">{item.product_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{item.variation_sku || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          {attrs && (
                            <div className="flex gap-2">
                              {attrs.color && (
                                <span className="px-2 py-1 bg-gray-900 text-gray-300 rounded text-xs">{attrs.color}</span>
                              )}
                              {attrs.size && (
                                <span className="px-2 py-1 bg-gray-900 text-gray-300 rounded text-xs">{attrs.size}</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-300">${item.unit_price}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-300">${item.subtotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Totals */}
          <div className="border-t border-gray-700 pt-4">
            <div className="max-w-sm ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium text-gray-200">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping:</span>
                <span className="font-medium text-gray-200">${order.shipping_cost}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax:</span>
                  <span className="font-medium text-gray-200">${order.tax_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2">
                <span className="text-gray-200">Total:</span>
                <span className="text-gray-200">${order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Update Status Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Update Order Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="payment_received">Payment Received</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-100"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isUpdating ? 'Updating...' : 'Update Order'}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{order.customer_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main View Orders Component
const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((order) => order.payment_status === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, paymentFilter, orders]);

  // View order details
  const handleViewOrder = async (order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/${order.id}`, {
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
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus, trackingNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          tracking_number: trackingNumber,
        }),
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-0">
      <div className="mx-auto shadow-md rounded-lg p-0 pt-6 max-w-7xl">
        <h1 className="text-2xl font-semibold mb-4 px-6">View Orders</h1>

        {/* Filters & Search */}
        <div className="px-6 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-800"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Order Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="payment_received">Payment Received</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Payment Status</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-300">{order.order_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{order.customer_email}</div>
                      {order.customer_phone && (
                        <div className="text-xs text-gray-500">{order.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-300">${order.total_amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-300"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default ViewOrders;