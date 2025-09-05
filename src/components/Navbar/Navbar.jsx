import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Ensure this path is correct
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

// Centralized navigation links data structure
const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'My Bookings', path: (user) => (user ? '/my-bookings' : '/login') },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- Framer Motion Animation Variants for Mobile Menu ---
  const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const linkContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  };

  // --- Reusable Component for Auth Section (Login/Logout) ---
  const AuthSection = ({ isMobile = false }) => {
    // If user is logged in
    if (user) {
      return (
        <div className={isMobile ? "space-y-4 text-left" : "flex items-center space-x-4"}>
          <p className="text-gray-700">Welcome, {user.name}</p>
          <button
            onClick={() => {
              logout();
              if (isMobile) closeMobileMenu();
            }}
            className={`font-medium transition-colors ${
              isMobile
                ? "w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg"
                : "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm shadow-md"
            }`}
          >
            Logout
          </button>
        </div>
      );
    }
    // If user is logged out
    return (
      <Link
        to="/login"
        onClick={isMobile ? closeMobileMenu : undefined}
        className={`font-medium transition-colors ${
          isMobile
            ? "block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg"
            : "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow-md"
        }`}
      >
        Login
      </Link>
    );
  };

  // --- Reusable JSX for Desktop Navigation Links ---
  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => {
        const path = typeof link.path === 'function' ? link.path(user) : link.path;
        return (
          <NavLink
            key={link.label}
            to={path}
            className={({ isActive }) =>
              `font-medium transition-colors duration-300 ${
                isActive ? 'text-green-600' : 'text-gray-800 hover:text-green-600'
              }`
            }
          >
            {link.label}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-green-600">
            BusGo
          </Link>

          <DesktopNav />

          <div className="hidden md:block">
            <AuthSection />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-800"
            >
              <FiMenu size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 p-6 flex flex-col"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-bold text-green-600">Menu</span>
                <button onClick={closeMobileMenu}>
                  <FiX size={26} className="text-gray-800" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <motion.ul
                className="space-y-6"
                variants={linkContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link) => {
                  const path =
                    typeof link.path === 'function' ? link.path(user) : link.path;
                  return (
                    <motion.li key={link.label} variants={linkVariants}>
                      <NavLink
                        to={path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `text-xl block transition-colors ${
                            isActive
                              ? 'text-green-600 font-bold'
                              : 'text-gray-800 hover:text-green-600'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Mobile Auth Section */}
              <motion.div
                className="mt-auto pt-6 border-t border-gray-200"
                variants={linkVariants}
              >
                <AuthSection isMobile={true} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;