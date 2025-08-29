import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaTags, FaChair, FaShieldAlt } from 'react-icons/fa';

// Data and sub-components remain the same...
const whyChooseUsData = [
  {
    icon: <FaGlobeAmericas className="h-6 w-6" />,
    title: 'Wide Network',
    description: 'We connect thousands of destinations with our extensive route network.',
  },
  {
    icon: <FaTags className="h-6 w-6" />,
    title: 'Best Price Guarantee',
    description: 'Find the most competitive and affordable bus ticket prices on our platform.',
  },
  {
    icon: <FaChair className="h-6 w-6" />,
    title: 'Comfortable Journey',
    description: 'Travel in modern, well-maintained buses with comfortable seating and amenities.',
  },
  {
    icon: <FaShieldAlt className="h-6 w-6" />,
    title: 'Safe and Secure',
    description: 'Your safety is our priority. We partner with trusted operators and ensure secure online payments.',
  },
];

const FeatureItem = ({ icon, title, description }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-green-50 transition-colors duration-300"
      variants={itemVariants}
    >
      <div className="flex-shrink-0 text-gray-400 group-hover:text-green-600 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </motion.div>
  );
};


const WhyChooseUs = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* === FANCY TITLE SECTION === */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Your Journey, <span className="text-green-600">Perfected.</span>
          </h2>
          <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
            Discover the comfort, reliability, and care that sets us apart from the rest.
          </p>
        </div>
        {/* ============================ */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <motion.div
            className="w-full h-80 lg:h-full rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://www.shutterstock.com/image-photo/man-traveling-looking-through-bus-600nw-1956060049.jpg"
              alt="Passenger enjoying a scenic view from a bus window" 
              className="w-full h-full object-cover" 
            />
          </motion.div>

          {/* Features Column */}
          <motion.div
            className="flex flex-col space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {whyChooseUsData.map((item, index) => (
              <FeatureItem
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;