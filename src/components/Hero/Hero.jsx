import React from 'react';
import SearchForm from '../SearchForm/SearchForm';
import { motion } from 'framer-motion';

// A more dynamic and scenic background image URL
const heroBgUrl = "https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const Hero = () => {
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div
      className="hero min-h-screen bg-cover bg-center pt-16"
      style={{ backgroundImage: `url(${heroBgUrl})` }}
    >
      <div className="hero-overlay bg-gradient-to-t from-black/70 via-black/50 to-black/20"></div>
      <div className="hero-content text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Animated Fancy Title */}
          <motion.h1
            className="mb-5 text-4xl md:text-7xl font-black text-white tracking-tight"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}
          >
            {"Where Journeys Begin.".split(" ").map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block mr-3">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mb-10 text-lg md:text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.0 }}
          >
            Your next destination is just a click away.
          </motion.p>
          
          <motion.div
            className="w-full max-w-3xl mx-auto" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20">
              <SearchForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;