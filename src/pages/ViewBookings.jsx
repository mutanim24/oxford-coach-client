import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiSearch, FiTrash2, FiAlertTriangle, FiLoader, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all necessary services
import bookingService from '../services/bookingService';
import busService from '../services/busService';
import scheduleService from '../services/scheduleService';
import BookingInsights from './BookingInsights';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        // This function fetches data from multiple sources and combines it on the frontend.
        const fetchAndCombineData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Step 1: Fetch from all three services at once for performance.
                const [bookingResponse, buses, scheduleResponse] = await Promise.all([
                    bookingService.getAllBookings(),
                    busService.getBuses(),
                    scheduleService.getAllSchedules()
                ]);

                const rawBookings = bookingResponse.bookings || bookingResponse || [];
                const allSchedules = scheduleResponse.schedules || [];

                // Step 2: Create Maps for efficient data lookup.
                const busMap = new Map(buses.map(bus => [bus._id, bus]));
                const scheduleMap = new Map(allSchedules.map(sch => [sch._id, sch]));

                // Step 3: Manually "populate" the bookings on the frontend.
                const populatedBookings = rawBookings.map(booking => {
                    const schedule = scheduleMap.get(booking.schedule);
                    const bus = schedule ? busMap.get(schedule.bus) : null;
                    
                    return {
                        ...booking,
                        schedule: schedule || { source: 'N/A', destination: 'N/A' },
                        bus: bus || { name: 'Unknown Bus', operator: 'N/A' }
                    };
                });

                setBookings(populatedBookings);

            } catch (err) {
                setError(err.message || 'Failed to fetch dashboard data. Please check your connection and permissions.');
                console.error("Error fetching and combining data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndCombineData();
    }, []);

    // --- NEW: Calculate insights using useMemo for efficiency ---
    const bookingInsights = useMemo(() => {
        if (!bookings || bookings.length === 0) {
            return { totalRevenue: 0, monthlySales: 0, confirmedBookings: 0, cancelledBookings: 0 };
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const confirmed = bookings.filter(b => b.status === 'confirmed');

        const totalRevenue = confirmed.reduce((acc, b) => acc + b.totalFare, 0);
        
        const monthlySales = bookings.filter(b => {
            const bookingDate = new Date(b.createdAt);
            return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        }).length;
        
        const confirmedBookings = confirmed.length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

        return { totalRevenue, monthlySales, confirmedBookings, cancelledBookings };

    }, [bookings]); // This will only recalculate when bookings data changes

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to permanently delete this booking?')) {
            try {
                await bookingService.deleteBooking(bookingId); 
                setBookings(prev => prev.filter(b => b._id !== bookingId));
                toast.success('Booking deleted successfully!');
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to delete booking.');
            }
        }
    };

    const filteredBookings = useMemo(() => {
        if (!bookings) return [];
        return bookings
            .filter(b => statusFilter === 'all' || b.status === statusFilter)
            .filter(b => {
                const search = searchTerm.toLowerCase();
                return (
                    b.user?.name?.toLowerCase().includes(search) ||
                    b.user?.email?.toLowerCase().includes(search) ||
                    b.pnrNumber?.toLowerCase().includes(search) ||
                    b.schedule?.source?.toLowerCase().includes(search) ||
                    b.schedule?.destination?.toLowerCase().includes(search) ||
                    b.bus?.name?.toLowerCase().includes(search)
                );
            });
    }, [bookings, searchTerm, statusFilter]);
    
    const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusStyles = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const tableContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const tableRowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">View All Bookings</h1>
                    <p className="mt-1 text-lg text-gray-500">Monitor and review all reservations made on the platform.</p>
                </div>
            </motion.div>

            <BookingInsights insights={bookingInsights} loading={loading} />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by user, PNR, route or bus..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="text-center p-12 text-gray-500"><FiLoader className="h-8 w-8 mx-auto animate-spin mb-4" /><p>Loading all bookings...</p></div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md flex items-center gap-4"><FiAlertTriangle className="h-8 w-8" /><p>{error}</p></div>
            ) : (
                <motion.div layout className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User / PNR</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Details</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <motion.tbody variants={tableContainerVariants} initial="hidden" animate="visible" className="bg-white divide-y divide-gray-200">
                                <AnimatePresence>
                                    {filteredBookings.length === 0 ? (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500"><FiCreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" /><h3 className="text-lg font-medium">No Bookings Found</h3><p>No reservations match your current search and filter criteria.</p></td></tr>
                                    ) : (
                                        filteredBookings.map((b) => (
                                            <motion.tr key={b._id} variants={tableRowVariants} layout className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.user?.name}</div><div className="text-sm text-gray-500 font-mono">{b.pnrNumber}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.schedule?.source} to {b.schedule?.destination}</div><div className="text-sm text-gray-500">{b.bus?.name}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(b.createdAt)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[b.status] || 'bg-gray-100 text-gray-800'}`}>{b.status}</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">${b.totalFare.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex items-center justify-end gap-2"><Link to={`/booking/${b._id}`} title="View Details" className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors"><FiEye size={18} /></Link><button onClick={() => handleDeleteBooking(b._id)} title="Delete Booking" className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"><FiTrash2 size={18} /></button></div></td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ViewBookings;