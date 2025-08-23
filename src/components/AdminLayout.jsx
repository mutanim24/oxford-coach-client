import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="mt-4">
          <Link to="/admin" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link>
          <Link to="/admin/buses" className="block px-4 py-2 hover:bg-gray-700">Manage Buses</Link>
          <Link to="/admin/schedules" className="block px-4 py-2 hover:bg-gray-700">Manage Schedules</Link>
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
