import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaClock, FaUsers, FaMobileAlt } from 'react-icons/fa';

// 1. Sample Data for the Services
const servicesData = [
  {
    icon: <FaShieldAlt className="h-8 w-8 text-white" />,
    title: 'Safety First',
    description: 'Travel with peace of mind. Our buses are equipped with the latest safety features and undergo regular checks.',
  },
  {
    icon: <FaClock className="h-8 w-8 text-white" />,
    title: 'On-Time Departures',
    description: 'We value your time. Our services are known for their punctuality and reliable schedules.',
  },
  {
    icon: <FaUsers className="h-8 w-8 text-white" />,
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to assist you with any queries or issues.',
  },
  {
    icon: <FaMobileAlt className="h-8 w-8 text-white" />,
    title: 'Easy Mobile Booking',
    description: 'Book your tickets anytime, anywhere with our user-friendly mobile app and website.',
  },
];

// 2. The Reusable InfoCard Component (with animations and hover effects)
const InfoCard = ({ icon, title, description }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 cursor-pointer"
      variants={cardVariants}
    >
      <div className="flex items-center justify-center h-16 w-16 bg-green-500 group-hover:bg-green-600 rounded-full transition-colors duration-300 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-center mb-2 text-gray-800">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </motion.div>
  );
};

// 3. The Main Services Section Component
const Services = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // This creates the staggered effect
      },
    },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-600">
            Why Choose <span className="text-gray-800">Us?</span>
          </h2>
          <p className="text-lg text-gray-500 mt-2">Services designed for your comfort and convenience.</p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Triggers animation when in viewport
          viewport={{ once: true, amount: 0.2 }} // Animates once when 20% of it is visible
        >
          {servicesData.map((item, index) => (
            <InfoCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;