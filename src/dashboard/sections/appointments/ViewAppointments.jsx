import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    CalendarIcon,
    MapPinIcon,
    FunnelIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30', label: 'Pending' },
        completed: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', label: 'Completed' },
        confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', label: 'Confirmed' },
        cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', label: 'Cancelled' },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

// --- Appointment Details Modal ---
const AppointmentDetailsModal = ({ appointment, onClose, onUpdateStatus }) => {
    const [newStatus, setNewStatus] = useState(appointment.status);
    // Default the "Confirmed Time" to existing scheduled time, or preferred time
    const [scheduledTime, setScheduledTime] = useState(
        appointment.scheduled_time
            ? new Date(appointment.scheduled_time).toISOString().slice(0, 16)
            : new Date(appointment.preferred_time).toISOString().slice(0, 16)
    );
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            // Only send scheduled_time if status is confirmed or completed
            const timeToSend = (newStatus === 'confirmed' || newStatus === 'completed') ? scheduledTime : null;
            await onUpdateStatus(appointment.id, newStatus, timeToSend);
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollable border border-gray-700">

                {/* Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-200">Appointment Details</h2>
                        <p className="text-sm text-gray-400 mt-1">ID #{appointment.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Main Grid Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Column 1: Status & Contact */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-800 pb-2">Status</h3>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Current Status:</span>
                                    <StatusBadge status={appointment.status} />
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Booked On:</span>
                                    <span className="text-gray-300">{formatDate(appointment.created_at)}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-800 pb-2">Customer Info</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-300 font-medium">{appointment.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-300">{appointment.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-300">{appointment.phone || 'No phone provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Location & Time */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-800 pb-2">Location</h3>
                                <div className="bg-gray-800/50 p-4 rounded-lg flex items-start gap-3">
                                    <MapPinIcon className="w-6 h-6 text-gray-400 shrink-0" />
                                    <span className="text-gray-200">{appointment.location}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-800 pb-2">Timing</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-800/30 p-3 rounded border border-gray-700/50">
                                        <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Requested Preferred Time</span>
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{formatDate(appointment.preferred_time)} at {formatTime(appointment.preferred_time)}</span>
                                        </div>
                                    </div>

                                    {appointment.scheduled_time && (
                                        <div className="bg-emerald-900/10 p-3 rounded border border-emerald-500/20">
                                            <span className="text-xs text-emerald-500 uppercase tracking-wide block mb-1">Confirmed Time</span>
                                            <div className="flex items-center gap-2 text-emerald-400">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{formatDate(appointment.scheduled_time)} at {formatTime(appointment.scheduled_time)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Section */}
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Update Appointment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Change Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Show Date Picker if Confirmed or Completed */}
                            {(newStatus === 'confirmed' || newStatus === 'completed') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">
                                        {newStatus === 'confirmed' ? 'Confirm Date & Time' : 'Time Completed'}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                                {isUpdating ? 'Updating...' : 'Update Appointment'}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main View Appointments Page ---
const ViewAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Fetch Appointments
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin-appointments/all`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setAppointments(data.appointments);
                setFilteredAppointments(data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    useEffect(() => {
        let filtered = [...appointments];

        // Search by Name or Email
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (appt) =>
                    appt.name.toLowerCase().includes(q) ||
                    (appt.email && appt.email.toLowerCase().includes(q)) ||
                    appt.id.toString().includes(q)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((appt) => appt.status === statusFilter);
        }

        setFilteredAppointments(filtered);
    }, [searchQuery, statusFilter, appointments]);

    // Handle Update Logic
    const handleUpdateStatus = async (id, status, scheduledTime) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin-appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    status,
                    scheduled_time: scheduledTime,
                }),
            });

            if (response.ok) {
                fetchAppointments(); // Refresh list
            } else {
                console.error("Failed to update");
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen p-0">
            <div className="mx-auto shadow-md rounded-lg p-0 pt-6 max-w-7xl">
                <h1 className="text-2xl font-semibold mb-4 px-6 text-gray-200">Appointments</h1>

                {/* Filters & Search */}
                <div className="px-6 mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 text-gray-200 pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <FunnelIcon className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <p className="text-sm text-gray-500">
                        Showing {filteredAppointments.length} of {appointments.length} appointments
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-500">Loading appointments...</p>
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                            <p className="text-gray-500">No appointments found</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Preferred Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled On</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                                {filteredAppointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-200">{appt.name}</div>
                                            <div className="text-xs text-gray-500">{appt.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm text-gray-300 ${appt.status == 'pending' ? 'text-orange-300' : 'text-gray-300'}`}>
                                                {new Date(appt.preferred_time).toLocaleDateString()}
                                            </div>
                                            <div className={`text-xs text-gray-500 ${appt.status == 'pending' ? 'text-orange-200' : 'text-gray-500'}`}>
                                                {new Date(appt.preferred_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                                <MapPinIcon className="w-4 h-4 text-gray-500" />
                                                {appt.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={appt.status} />
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-left ${appt.status == 'confirmed' ? 'text-green-300' : 'text-gray-300'}`}>
                                            {appt.scheduled_time ? (
                                                <>
                                                    <div className="text-sm">
                                                        {new Date(appt.preferred_time).toLocaleDateString()}
                                                    </div>
                                                    <div className={`text-xs ${appt.status == 'confirmed' ? 'text-green-500' : 'text-gray-500'}`}>
                                                        {new Date(appt.preferred_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedAppointment(appt)}
                                                className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
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

            {/* Details Modal */}
            {selectedAppointment && (
                <AppointmentDetailsModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default ViewAppointments;