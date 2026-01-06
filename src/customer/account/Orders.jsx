import React from 'react';

const Orders = ({ orders, EyeIcon, ShoppingBagIcon, StatusBadge, handleViewOrder }) => {
    return (

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
    )
}
export default Orders;