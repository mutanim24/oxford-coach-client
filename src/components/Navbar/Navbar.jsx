import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-green-600 hover:text-green-700">BusGo</Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
              {user ? (
                <Link to="/bookings" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Bookings</Link>
              ) : (
                <Link to="/login" className="text-gray-800 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">My Bookings</Link>
              )}
            </div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-white rounded-box w-52">
              <li><Link to="/" className="text-gray-800 hover:text-green-600 transition-colors">Home</Link></li>
              {user ? (
                <>
                  <li><Link to="/bookings" className="text-gray-800 hover:text-green-600 transition-colors">My Bookings</Link></li>
                  <li>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Welcome, {user.name}</span>
                      <button 
                        onClick={logout}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="text-gray-800 hover:text-green-600 transition-colors">My Bookings</Link></li>
                  <li><Link to="/login" className="text-gray-800 hover:text-green-600 transition-colors">Login</Link></li>
                  <li><Link to="/register" className="text-gray-800 hover:text-green-600 transition-colors">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
