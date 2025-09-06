import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiSearch, FiShield, FiUserX, FiArrowLeft, FiAlertTriangle, FiLoader } from 'react-icons/fi';
// Your existing Toast component
import Toast from '../components/Toast/Toast';

// All your original logic for fetching and mutations is preserved.
const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                // The API call is the same
                const response = await fetch(`http://localhost:5000/api/users?role=${filter}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [filter]);

    const handleFilterChange = (e) => setFilter(e.target.value);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to delete user');
                setUsers(users.filter(user => user._id !== userId));
                setToast({ message: data.message || 'User deleted successfully', type: 'success' });
            } catch (err) {
                setToast({ message: err.message, type: 'error' });
            }
        }
    };

    const handleMakeAdmin = async (userId) => {
         if (window.confirm('Are you sure you want to make this user an admin?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/users/${userId}/make-admin`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to make user admin');
                setUsers(users.map(user => user._id === userId ? { ...user, role: 'admin' } : user));
                setToast({ message: data.message || 'User role updated to admin', type: 'success' });
            } catch (err) {
                setToast({ message: err.message, type: 'error' });
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    // --- New UI Components ---
    const UserCard = ({ user }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col"
        >
            <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4 truncate">
                    <p className="text-lg font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
            </div>
            <div className="flex-grow"></div>
            <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                </span>
                <div className="flex items-center gap-2">
                    {user.role !== 'admin' && (
                        <button onClick={() => handleMakeAdmin(user._id)} title="Make Admin" className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors"><FiShield /></button>
                    )}
                    <button onClick={() => handleDeleteUser(user._id)} title="Delete User" className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"><FiUserX /></button>
                </div>
            </div>
        </motion.div>
    );

    const SkeletonCard = () => (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center mb-4"><div className="w-12 h-12 rounded-full bg-gray-200"></div><div className="ml-4 flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-200 rounded w-full"></div></div></div>
        <div className="border-t pt-4 mt-4 flex justify-between items-center"><div className="h-6 w-16 bg-gray-200 rounded-full"></div><div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-gray-200"></div><div className="w-8 h-8 rounded-full bg-gray-200"></div></div></div>
      </div>
    );
    
    return (
        <div className="container mx-auto px-4 py-8">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
                  <p className="mt-1 text-lg text-gray-500">Browse, manage, and update user roles.</p>
                </div>
                <Link to="/admin" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                    <FiArrowLeft /> Back to Dashboard
                </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={handleSearchChange} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select value={filter} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Users</option>
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md flex items-center gap-4">
                    <FiAlertTriangle className="h-8 w-8" />
                    <div><h3 className="font-bold">Error</h3><p>{error}</p></div>
                </div>
            ) : (
                <AnimatePresence>
                    {filteredUsers.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white rounded-xl shadow-lg p-12">
                            <FiUsers className="mx-auto h-16 w-16 text-gray-300" />
                            <h3 className="mt-4 text-2xl font-bold text-gray-800">No Users Found</h3>
                            <p className="mt-2 text-gray-500">No users match your current search and filter criteria.</p>
                        </motion.div>
                    ) : (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => <UserCard key={user._id} user={user} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default UsersPage;