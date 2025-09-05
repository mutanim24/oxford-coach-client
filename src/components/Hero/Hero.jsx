import React from 'react';
import SearchForm from '../SearchForm/SearchForm';
import { motion } from 'framer-motion';

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

  const title = "Where Journeys Begin .";

  return (
    <div
      className="hero min-h-screen bg-cover bg-center pt-24 relative" // 
      style={{ backgroundImage: `url(${heroBgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="hero-content text-center text-white relative z-10">
        <div className="w-full max-w-4xl mx-auto px-4">

          <motion.h1
            className="mb-5 text-4xl md:text-7xl font-black text-white tracking-tight"
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}
          >
            {title.split(" ").map((word, index) => {
              const isSpecialWord = word === "Begin";
              return (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className={`inline-block mr-3 ${isSpecialWord ? 'text-green-400' : ''}`}
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.h1>

          <motion.p
            className="mb-10 text-lg md:text-xl text-white/90 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.0 }}
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