import React from 'react';
import { motion } from 'framer-motion';

// A beautiful, aspirational image for the hero section
const heroImageUrl = "https://www.shutterstock.com/image-vector/bus-ticket-online-pay-smart-260nw-2598472987.jpg";

const AboutHero = () => {
  return (
    <section 
      className="relative h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center text-center text-white"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}
        >
          Connecting People & Places
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          Welcome to the story of BusGo. Discover the passion, purpose, and people
          that drive our commitment to making travel better for everyone.
        </motion.p>
      </div>
    </section>
  );
};

export default AboutHero;