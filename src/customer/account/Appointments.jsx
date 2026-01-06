import React from 'react';

const Appointments = ({
    appointments,
    EyeIcon,
    CalendarIcon,
    StatusBadge,
    handleViewAppointment,
}) => {
    return (
        <div>
            {appointments.length === 0 ? (
                <div className="text-center py-20 border border-zinc-800 rounded-lg bg-zinc-900/30">
                    <CalendarIcon className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400 mb-4">No appointments booked yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Preferred Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Scheduled Date & Time</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {appointments.map((appt) => (
                                <tr key={appt.id} className="hover:bg-zinc-900/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">
                                            {new Date(appt.preferred_time).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            {new Date(appt.preferred_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-zinc-300">
                                            {appt.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={appt.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                        <div className="text-sm text-zinc-400">
                                            {appt.scheduled_time ?
                                                (
                                                    <>
                                                        <div
                                                            className={`text-sm font-medium ${appt.status == 'confirmed' ? 'text-green-300' : 'text-zinc-300'}`}>
                                                            {new Date(appt.created_at).toLocaleDateString()}
                                                        </div>
                                                        <div className={`text-xs ${appt.status == 'confirmed' ? 'text-green-500' : 'text-zinc-500'}`}>
                                                            {new Date(appt.preferred_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </>
                                                )
                                                : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleViewAppointment(appt)}
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

export default Appointments;