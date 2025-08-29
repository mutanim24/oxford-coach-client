import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaCheckCircle, FaSearch } from 'react-icons/fa';

// 1. Data structure (no changes here)
const featuresData = [
  {
    icon: <FaGlobe className="h-8 w-8 text-green-600" />,
    title: 'Unmatched Global Reach',
    description: 'Effortlessly search, compare, and book tickets from over 2.3 million routes across 80+ countries. We connect you to a world of affordable and flexible travel possibilities.',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    icon: <FaSearch className="h-8 w-8 text-green-600" />,
    title: 'All-in-One Search',
    description: 'Easily compare options and find affordable tickets for your next trip. Check schedules, prices, and onboard services like WiFi and extra legroom—all in one place.',
    image: 'https://images.pexels.com/photos/7533347/pexels-photo-7533347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    icon: <FaCheckCircle className="h-8 w-8 text-green-600" />,
    title: 'Book with Total Confidence',
    description: 'We partner with hundreds of trusted operators worldwide, offering secure payments and instant e-tickets. Plus, our flexible refund options let you book worry-free.',
    image: 'https://images.pexels.com/photos/7533321/pexels-photo-7533321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// 2. The FeatureRow component (with the responsive icon update)
const FeatureRow = ({ icon, title, description, image, reverse }) => {
  const imageVariants = {
    hidden: { opacity: 0, x: reverse ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: reverse ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      {/* Image Column */}
      <motion.div
        className={`w-full h-80 rounded-lg overflow-hidden shadow-2xl ${reverse ? 'lg:col-start-2' : ''}`}
        variants={imageVariants}
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>
      
      {/* Text Column */}
      <motion.div className="flex flex-col justify-center" variants={textVariants}>
        {/* === UPDATED ICON CONTAINER === */}
        <div className="hidden lg:block mb-4">{icon}</div>
        {/* ============================= */}
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
};

// 3. The main PlatformFeatures component (no changes here)
const PlatformFeatures = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Your Ultimate Travel Companion
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            Simplifying bus travel, from booking to boarding.
          </p>
        </div>
        
        <div className="space-y-20">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <FeatureRow
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                reverse={index % 2 !== 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;