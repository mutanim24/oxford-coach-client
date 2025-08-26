import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  
  // Determine which nav item is active
  const getActiveClass = (path) => {
    // Special handling for dashboard (exact match only)
    if (path === '/admin') {
      return location.pathname === '/admin' 
        ? 'bg-gray-900 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white';
    }
    
    // For other routes, check if the path starts with the route path
    return location.pathname.startsWith(path + '/') || location.pathname === path
      ? 'bg-gray-900 text-white' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="mt-4">
          <Link 
            to="/admin" 
            className={`block px-4 py-2 transition-colors ${getActiveClass('/admin')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/buses" 
            className={`block px-4 py-2 transition-colors ${getActiveClass('/admin/buses')}`}
          >
            Manage Buses
          </Link>
          <Link 
            to="/admin/schedules" 
            className={`block px-4 py-2 transition-colors ${getActiveClass('/admin/schedules')}`}
          >
            Manage Schedules
          </Link>
          <Link 
            to="/admin/all-schedules" 
            className={`block px-4 py-2 transition-colors ${getActiveClass('/admin/all-schedules')}`}
          >
            All Schedules
          </Link>
          <Link 
            to="/admin/users" 
            className={`block px-4 py-2 transition-colors ${getActiveClass('/admin/users')}`}
          >
            Manage Users
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
