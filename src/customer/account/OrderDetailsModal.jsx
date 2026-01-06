import React from 'react';

// Order Details Modal
const OrderDetailsModal = ({ order, items, onClose, StatusBadge }) => {
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

export default OrderDetailsModal;