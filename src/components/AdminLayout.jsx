import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiTruck, FiCalendar, FiUsers, FiCreditCard, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

// --- Data for Navigation Links (Easier to manage) ---
const navItems = [
  { path: '/admin', label: 'Dashboard', icon: FiHome },
  { path: '/admin/buses', label: 'Manage Buses', icon: FiTruck },
  { path: '/admin/all-schedules', label: 'All Schedules', icon: FiCalendar },
  { path: '/admin/users', label: 'Manage Users', icon: FiUsers },
  { path: '/admin/view-bookings', label: 'View Bookings', icon: FiCreditCard },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 text-2xl font-bold text-white border-b border-gray-700">
        <NavLink to="/">BusGo <span className="font-normal text-green-400">Admin</span></NavLink>
      </div>
      <nav className="mt-6 flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} // Ensure exact match for Dashboard link
            className={({ isActive }) =>
              `flex items-center px-5 py-3 transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? '!bg-green-600 !text-white shadow-inner' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* User Profile & Logout */}
      <div className="p-5 border-t border-gray-700">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="font-semibold text-white">{user?.name || 'Admin'}</p>
        <button
          onClick={logout}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- Desktop Sidebar --- */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full hidden md:flex flex-col z-20">
        <SidebarContent />
      </aside>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-64 bg-gray-900 text-white fixed h-full flex-col z-40 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <div className="md:ml-64 flex-1 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">BusGo Admin</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="h-6 w-6 text-gray-600" />
          </button>
        </header>

        <main className="p-4 md:p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;