import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../middleware/AuthProvider';
import { EyeIcon, UserCircleIcon, ShoppingBagIcon, CalendarDaysIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { ProductHeader } from '../../components/products/ProductHeader';
import { Footer } from '../../components/Footer';
import AppointmentBookingPopup from '../../components/booking/AppointmentBookingPopup';
import OrderDetailsModal from './OrderDetailsModal';
import Orders from './Orders';
import Appointments from './Appointments';
import AppointmentDetailsModal from './AppointmentDetailsModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Pending' },
    confirmed: { bg: 'bg-green-300', text: 'text-zinc-900', label: 'Confirmed' },
    completed: { bg: 'bg-zinc-700', text: 'text-zinc-300', label: 'Completed' },
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

// Main Customer Account Component
const CustomerAccount = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // 1. Call the backend route
      const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 2. Parse the JSON
      const data = await response.json();

      // 3. Update state (Accessing data.appointments based on your backend response)
      setAppointments(data.appointments || []);

    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      toast.error("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  };

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


  const handleViewAppointment = (appt) => {
    setSelectedAppointment(appt);
  };


  const handleCloseModal = () => {
    setSelectedAppointment(null);
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

  const closeBooking = () => {
    setShowBooking(false);
    fetchAppointments();
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

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'appointments' ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5" />
                    Appointments
                  </div>
                  {activeTab === 'appointments' && (
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
                  <Orders orders={orders} EyeIcon={EyeIcon} ShoppingBagIcon={ShoppingBagIcon} StatusBadge={StatusBadge} handleViewOrder={handleViewOrder} />
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

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                  <div>
                    <button onClick={() => setShowBooking(true)} className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-zinc-200 transition-colors">
                      Book Your Slot
                    </button>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-5">
                      <Appointments appointments={appointments} EyeIcon={EyeIcon} CalendarIcon={CalendarIcon} StatusBadge={StatusBadge} handleViewAppointment={handleViewAppointment} />
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
          StatusBadge={StatusBadge}
        />
      )}

      {/* 3. Render Modal Conditionally */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          StatusBadge={StatusBadge}
        />
      )}

      <AppointmentBookingPopup
        isOpen={showBooking}
        isLoggedIn={true}
        onClose={() => closeBooking()}
      />
    </>
  );
};

export default CustomerAccount;