import React, { useState } from 'react';
import {
    XMarkIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    UserIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AppointmentBookingPopup = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    // Guest booking state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        preferred_time: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateGuestForm = () => {
        const errors = [];

        if (!formData.name.trim()) {
            errors.push('Name is required');
        }

        if (!formData.location.trim()) {
            errors.push('Location is required');
        }

        if (!formData.preferred_time) {
            errors.push('Preferred time is required');
        }

        // Check if at least one contact method is provided
        if (!formData.email.trim() && !formData.phone.trim()) {
            errors.push('Either email or phone number is required');
        }

        // Validate email format if provided
        if (formData.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.push('Invalid email format');
            }
        }

        // Validate phone format if provided (basic validation)
        if (formData.phone.trim()) {
            const phoneRegex = /^[0-9+\-\s()]+$/;
            if (!phoneRegex.test(formData.phone)) {
                errors.push('Invalid phone number format');
            }
        }

        return errors;
    };

    const handleGuestSubmit = async () => {
        // Validate
        const errors = validateGuestForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to book appointment');
            }

            toast.success('Appointment booked successfully!');

            // Reset
            setFormData({
                name: '',
                location: '',
                preferred_time: '',
                email: '',
                phone: '',
            });

            // Close modal after delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset forms
        setFormData({
            name: '',
            location: '',
            preferred_time: '',
            email: '',
            phone: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='mt-21'>
            <Toaster position="top-right"
                containerStyle={{
                    marginTop: '4rem',
                }} />

            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto scrollable shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex border-b border-zinc-800">
                        <button
                            className={`flex-1 px-6 py-4 font-medium transition-colors text-white border-b-2 border-white bg-zinc-800/50`}
                        >
                            Guest Booking
                        </button>
                        <a href="/login"
                            className={`flex-1 px-6 py-4 font-medium transition-colors text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/30`}
                        >
                            Login
                        </a>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Location Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Location <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="123 Main St, New York, NY"
                                    />
                                </div>
                            </div>

                            {/* Preferred Time Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Preferred Time <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="datetime-local"
                                        name="preferred_time"
                                        value={formData.preferred_time}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            {/* Note */}
                            <p className="text-sm text-zinc-400">
                                <span className="text-red-400">*</span> Required fields. At least one contact method (email or phone) is required.
                            </p>

                            {/* Submit Button */}
                            <button
                                onClick={handleGuestSubmit}
                                disabled={loading}
                                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBookingPopup;