import React from 'react';

const AppointmentDetailsModal = ({ appointment, onClose, StatusBadge }) => {
    if (!appointment) return null;

    // Helper to format dates consistently
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800">
                
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Appointment Details</h2>
                        <p className="text-sm text-zinc-400 mt-1">ID #{appointment.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center transition-colors"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Top Grid: Status & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Current Status:</span>
                                    <StatusBadge status={appointment.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">Booked On:</span>
                                    <span className="text-white">
                                        {formatDate(appointment.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
                            <div className="bg-zinc-800/50 rounded-lg p-3 text-sm border border-zinc-700/50">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-zinc-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span className="text-white font-medium">{appointment.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 my-4"></div>

                    {/* Middle Grid: Schedule & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Schedule Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Schedule</h3>
                            <div className="bg-zinc-800/30 rounded-lg p-4 text-sm space-y-4 border border-zinc-800">
                                <div>
                                    <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Preferred Time</p>
                                    <p className="text-white font-medium">{formatDate(appointment.preferred_time)}</p>
                                    <p className="text-zinc-300">{formatTime(appointment.preferred_time)}</p>
                                </div>

                                {/* Only show Scheduled/Confirmed time if it exists and status is confirmed/completed */}
                                {appointment.scheduled_time && (
                                    <div className="pt-3 border-t border-zinc-700/50">
                                        <p className="text-emerald-500 text-xs uppercase tracking-wider mb-1">Confirmed Time</p>
                                        <p className="text-emerald-300 font-medium">{formatDate(appointment.scheduled_time)}</p>
                                        <p className="text-emerald-200">{formatTime(appointment.scheduled_time)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Contact Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 mb-1">Name:</span>
                                    <span className="text-white font-medium">{appointment.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 mb-1">Email:</span>
                                    <span className="text-white">{appointment.email || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-400 mb-1">Phone:</span>
                                    <span className="text-white">{appointment.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Close Button */}
                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;