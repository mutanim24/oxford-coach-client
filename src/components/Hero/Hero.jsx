import React from 'react';
import SearchForm from '../SearchForm/SearchForm';
import busImg from '../../assets/img/bus-1.jpg'; // adjust path as needed
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div
      className="hero min-h-screen bg-cover bg-center py-16 opacity-100"
      style={{ backgroundImage: `url(${busImg})` }}
    >
      <div className="hero-overlay bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
      <div className="hero-content text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1
            className="mb-5 text-4xl md:text-6xl font-extrabold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Find Your Perfect Bus Journey
          </motion.h1>
          <motion.p
            className="mb-10 text-lg md:text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            Book affordable and comfortable bus tickets with ease
          </motion.p>
          <motion.div
            className="w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            <div className="bg-white/20 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-xl">
              <SearchForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;