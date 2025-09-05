import React from 'react';
import { motion } from 'framer-motion';

const OurMission = () => {
  // Animation variants for the image column
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Animation variants for the text column
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section className="py-20 bg-white">
      {/* Main container that triggers the animation */}
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Animate when 30% of the section is in view
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Column */}
          <motion.div
            className="w-full h-80 lg:h-[450px] rounded-lg overflow-hidden shadow-2xl"
            variants={imageVariants}
          >
            <img 
              src="https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="A person looking out at a scenic road, representing the journey" 
              className="w-full h-full object-cover" 
            />
          </motion.div>

          {/* Text Column */}
          <motion.div 
            className="flex flex-col justify-center"
            variants={textVariants}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              At BusGo, our mission is to simplify travel and connect communities. We believe that booking a bus ticket should be a seamless, transparent, and hassle-free experience for everyone.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We are dedicated to providing a platform that offers the widest choice of routes at the best prices, all while prioritizing your safety, comfort, and peace of mind. Wherever you're headed, we're here to make your journey easy, affordable, and memorable.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default OurMission;