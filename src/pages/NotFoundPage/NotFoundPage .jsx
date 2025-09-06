import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

// Animated Bus SVG Component (No changes needed here)
const AnimatedBus = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 40"
    className="w-48 h-auto"
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 80 }}
  >
    <g fill="#4ADE80"> {/* Green-400 */}
      <path d="M95,30H5c-1.7,0-3-1.3-3-3V10c0-1.7,1.3-3,3-3h75l10,8V30z" />
      <path d="M80,7H15c-1.1,0-2,0.9-2,2v0c0,1.1,0.9,2,2,2h65V7z" opacity=".2" />
    </g>
    <g fill="#F9FAFB"> {/* Gray-50 */}
      <rect x="15" y="13" width="15" height="10" rx="2" />
      <rect x="35" y="13" width="15" height="10" rx="2" />
      <rect x="55" y="13" width="15" height="10" rx="2" />
      <path d="M80,13h5l7,6h-12V13z" />
    </g>
    <g fill="#1F2937"> {/* Gray-800 */}
      <motion.circle cx="20" cy="35" r="5" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      <motion.circle cx="75" cy="35" r="5" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
    </g>
    <circle cx="97" cy="25" r="2" fill="#FBBF24" />
  </motion.svg>
);


const NotFoundPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-gray-900">
      
      {/* 1. Project Vibe: Updated Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-gray-900 animate-gradient-xy"></div>
      </div>

      {/* 2. Reddish Vibe: New pulsing red glow for a subtle warning effect */}
      <div className="absolute z-0 w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-lg m-4 p-8 md:p-12 bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl text-center border border-white/10"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-8">
           <AnimatedBus />
        </div>

        {/* 3. Reddish Vibe: Fiery gradient text for the 404 */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-tighter" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-4" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
          Page Not Found
        </h2>

        <p className="text-gray-300 mt-4 text-lg">
          Oops! Looks like you've missed your stop. The page you are looking for does not exist.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10"
        >
          {/* Project Vibe: On-brand button style */}
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 bg-white text-green-600 font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:bg-gray-100 hover:shadow-xl"
          >
            <FiArrowLeft className="mr-2" />
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;