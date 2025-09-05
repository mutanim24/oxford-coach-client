import React from 'react';
import SearchForm from '../SearchForm/SearchForm'; // Adjust path if needed
import { motion } from 'framer-motion';

// A more dynamic and scenic background image URL
const heroBgUrl = "https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const Hero = () => {
  // Animation variants for the title container
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // This makes each word appear one by one
      },
    },
  };

  // Animation variants for each word in the title
  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div
      className="hero min-h-screen bg-cover bg-center pt-16"
      style={{ backgroundImage: `url(${heroBgUrl})` }}
    >
      {/* Updated overlay for the spotlight effect */}
      <div 
        className="hero-overlay"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)'
        }}
      ></div>
      
      <div className="hero-content text-center text-white">
        <div className="w-full max-w-4xl mx-auto px-4">
          
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
            className="mb-10 text-lg md:text-xl text-white/90 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.0 }} // Delayed to animate after title
          >
            Your next destination is just a click away. Find the best routes, book with confidence, and travel with ease.
          </motion.p>
          
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
          >
            <SearchForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;