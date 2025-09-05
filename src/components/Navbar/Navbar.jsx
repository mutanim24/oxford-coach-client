import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Make sure this path is correct
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="navbar bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600 hover:text-green-700">BusGo</Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-800 hover:text-green-600 font-medium transition-colors">Home</Link>
            <Link to={user ? "/my-bookings" : "/login"} className="text-gray-800 hover:text-green-600 font-medium transition-colors">My Bookings</Link>
            <Link to={"/about-us"} className="text-gray-800 hover:text-green-600 font-medium transition-colors">About US</Link>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md">Login</Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="btn btn-ghost btn-circle">
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Menu Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 p-6"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-bold text-green-600">Menu</span>
                <button onClick={closeMobileMenu} className="btn btn-ghost btn-circle">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <ul className="space-y-6">
                <li><Link to="/" onClick={closeMobileMenu} className="text-lg text-gray-800 hover:text-green-600 transition-colors">Home</Link></li>
                <li><Link to={user ? "/my-bookings" : "/login"} onClick={closeMobileMenu} className="text-lg text-gray-800 hover:text-green-600 transition-colors">My Bookings</Link></li>
                <li><Link to={"/about-us"} onClick={closeMobileMenu} className="text-lg text-gray-800 hover:text-green-600 transition-colors">About Us</Link></li>
                
                <li className="pt-6 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-gray-700">Welcome, {user.name}</div>
                      <button 
                        onClick={() => { logout(); closeMobileMenu(); }}
                        className="w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Link to="/login" onClick={closeMobileMenu} className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Login</Link>
                    </div>
                  )}
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;