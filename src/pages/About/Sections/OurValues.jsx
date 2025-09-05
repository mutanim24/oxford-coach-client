import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaLightbulb, FaLeaf } from 'react-icons/fa';

// 1. Data for the core values
const valuesData = [
  {
    icon: <FaShieldAlt className="h-8 w-8 text-white" />,
    title: 'Safety First',
    description: 'Your safety is our top priority. We partner with trusted operators and adhere to the highest safety standards to ensure your peace of mind on every journey.',
  },
  {
    icon: <FaUsers className="h-8 w-8 text-white" />,
    title: 'Customer-Centric',
    description: 'You are at the heart of everything we do. Our goal is to provide a seamless, supportive, and enjoyable experience from booking to arrival.',
  },
  {
    icon: <FaLightbulb className="h-8 w-8 text-white" />,
    title: 'Innovation',
    description: 'We are constantly improving our technology to make travel simpler and more efficient. We embrace new ideas to enhance your booking and travel experience.',
  },
  {
    icon: <FaLeaf className="h-8 w-8 text-white" />,
    title: 'Sustainability',
    description: 'We are committed to promoting eco-friendly travel. By choosing bus travel, you help us in our mission to create a greener, more sustainable future.',
  },
];

// 2. The reusable ValueCard component
const ValueCard = ({ icon, title, description }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer text-center"
      variants={cardVariants}
    >
      <div className="flex items-center justify-center h-20 w-20 bg-green-500 group-hover:bg-green-600 rounded-full transition-colors duration-300 mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// 3. The main OurValues component
const OurValues = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2, // This creates the staggered animation effect
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            The principles that guide our every decision.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {valuesData.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurValues;