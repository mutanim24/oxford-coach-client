import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTicketAlt, FaBus } from 'react-icons/fa';

// 1. Data for the steps
const howItWorksData = [
  {
    icon: <FaSearch className="h-10 w-10 text-green-500" />,
    title: 'Search Your Route',
    description: 'Enter your departure and destination, select your journey date, and find the perfect bus for your trip.',
  },
  {
    icon: <FaTicketAlt className="h-10 w-10 text-green-500" />,
    title: 'Book Your Ticket',
    description: 'Choose your desired seats, provide passenger details, and complete your payment securely.',
  },
  {
    icon: <FaBus className="h-10 w-10 text-green-500" />,
    title: 'Enjoy Your Journey',
    description: 'Receive your e-ticket, arrive at the boarding point on time, and enjoy a comfortable and safe ride.',
  },
];

// 2. The StepCard component (reusable for each step)
const StepCard = ({ icon, title, description, stepNumber }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="relative text-center p-6 bg-white rounded-lg shadow-lg"
      variants={cardVariants}
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-4 border-green-500 rounded-full h-12 w-12 flex items-center justify-center font-extrabold text-green-500 text-xl">
        {stepNumber}
      </div>
      <div className="mt-8 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// 3. The main HowItWorks section component
const HowItWorks = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">How It Works</h2>
          <p className="text-lg text-gray-500 mt-2">Booking your bus ticket is as easy as 1-2-3.</p>
        </div>
        
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-3 gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Dashed connecting line for desktop view */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 -mt-4">
              <svg width="100%" height="100%">
                  <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="10, 10" stroke="#d1d5db" strokeWidth="2"/>
              </svg>
          </div>

          {howItWorksData.map((item, index) => (
            <StepCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              stepNumber={index + 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;