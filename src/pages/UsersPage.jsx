import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiSearch, FiShield, FiUserX, FiArrowLeft, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import Toast from '../components/Toast/Toast';

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
                const response = await fetch(`https://oxford-coach-server.vercel.app/api/users?role=${filter}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch users');
                }
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

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://oxford-coach-server.vercel.app/api/users/${userId}`, {
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
                const response = await fetch(`https://oxford-coach-server.vercel.app/api/users/${userId}/make-admin`, {
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
        if (!users) return [];
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const tableContainerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const UserTableRow = ({ user }) => (
        <motion.tr variants={tableRowVariants} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(user.createdAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    {user.role !== 'admin' && (
                        <button onClick={() => handleMakeAdmin(user._id)} title="Make Admin" className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors"><FiShield size={18} /></button>
                    )}
                    <button onClick={() => handleDeleteUser(user._id)} title="Delete User" className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"><FiUserX size={18} /></button>
                </div>
            </td>
        </motion.tr>
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
                        <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Users</option>
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="text-center p-12 text-gray-500">
                    <FiLoader className="h-8 w-8 mx-auto animate-spin mb-4" />
                    <p>Loading users...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md flex items-center gap-4">
                    <FiAlertTriangle className="h-8 w-8" />
                    <div>
                        <h3 className="font-bold">Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            ) : (
                <motion.div layout className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <motion.tbody variants={tableContainerVariants} initial="hidden" animate="visible" className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                            <h3 className="text-lg font-medium">No Users Found</h3>
                                            <p>No users match your current search and filter criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => <UserTableRow key={user._id} user={user} />)
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default UsersPage;