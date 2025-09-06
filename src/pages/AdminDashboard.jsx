import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTruck, FiCalendar, FiCreditCard, FiUsers, FiArrowRight, FiActivity } from 'react-icons/fi';

// Services that you have confirmed exist
import busService from '../services/busService';
import scheduleService from '../services/scheduleService';
import bookingService from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';

// --- Reusable UI Components for the Dashboard ---

const StatCard = ({ icon, title, value, color, loading }) => {
    const IconComponent = icon;
    if (loading) {
        return (
            <div className="bg-gray-200 p-6 rounded-xl animate-pulse">
                <div className="h-8 w-8 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 w-1/4 bg-gray-300 rounded"></div>
            </div>
        );
    }
    return (
        <div className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-white bg-gradient-to-br ${color}`}>
            <IconComponent className="h-8 w-8 mb-4 opacity-75" />
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-4xl font-extrabold">{value}</p>
        </div>
    );
};

const ActionCard = ({ icon, title, description, to, color }) => {
    const IconComponent = icon;
    return (
        <Link to={to} className={`block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-l-4 ${color}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-gray-600" />
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    </div>
                    <p className="mt-2 text-gray-500">{description}</p>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-800" />
            </div>
        </Link>
    );
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ buses: 0, schedules: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                
                // === THIS IS THE FIX ===
                // We'll fetch stats individually to prevent one failing call from breaking the entire dashboard.
                
                let busCount = 0;
                let scheduleCount = 0;
                let bookingCount = 0;

                // Fetch Buses
                try {
                    const busesData = await busService.getBuses();
                    busCount = busesData?.length || 0;
                } catch (e) {
                    console.error("Failed to fetch bus stats:", e);
                }

                // Fetch Schedules
                try {
                    const schedulesData = await scheduleService.getAllSchedules();
                    scheduleCount = schedulesData?.schedules?.length || 0;
                } catch (e) {
                    console.error("Failed to fetch schedule stats:", e);
                }

                // Fetch Bookings
                try {
                    // Make sure 'getAllBookings' exists in your bookingService for admins
                    const bookingsData = await bookingService.getAllBookings(); 
                    bookingCount = bookingsData?.length || 0;
                } catch (e) {
                    console.error("Failed to fetch booking stats:", e);
                    // This is the most likely point of failure. Check your console for this message.
                }
                
                setStats({
                    buses: busCount,
                    schedules: scheduleCount,
                    bookings: bookingCount,
                });

            } catch (err) {
                // This will now only catch general errors, not specific fetch failures
                setError('An unexpected error occurred while loading the dashboard.');
                console.error("Dashboard general error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.name || 'Admin'}!</h1>
                <p className="mt-1 text-lg text-gray-500">Here's a snapshot of your platform's activity.</p>
            </motion.div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <motion.div variants={itemVariants}><StatCard icon={FiTruck} title="Total Buses" value={stats.buses} color="from-green-500 to-green-600" loading={loading} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={FiCalendar} title="Total Schedules" value={stats.schedules} color="from-blue-500 to-blue-600" loading={loading} /></motion.div>
                <motion.div variants={itemVariants}><StatCard icon={FiCreditCard} title="Total Bookings" value={stats.bookings} color="from-purple-500 to-purple-600" loading={loading} /></motion.div>
            </motion.div>
            
            <motion.div variants={containerVariants}>
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-6">Quick Actions</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}><ActionCard icon={FiTruck} title="Manage Buses" description="Add, edit, or remove buses from your fleet." to="/admin/buses" color="border-green-500" /></motion.div>
                    <motion.div variants={itemVariants}><ActionCard icon={FiCalendar} title="All Schedules" description="View and manage all scheduled trips." to="/admin/all-schedules" color="border-blue-500" /></motion.div>
                    <motion.div variants={itemVariants}><ActionCard icon={FiUsers} title="Manage Users" description="View user details and manage roles." to="/admin/users" color="border-orange-500" /></motion.div>
                    <motion.div variants={itemVariants}><ActionCard icon={FiActivity} title="View Bookings" description="Monitor and review all platform bookings." to="/admin/view-bookings" color="border-purple-500" /></motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;