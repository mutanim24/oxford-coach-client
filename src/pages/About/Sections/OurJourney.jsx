import React from 'react';
import { motion } from 'framer-motion';
import { FaFlag, FaRocket, FaUsers, FaBullseye } from 'react-icons/fa';

// 1. Data for the timeline milestones
const journeyData = [
  {
    icon: <FaFlag className="h-6 w-6 text-white" />,
    year: '2022',
    title: 'The Idea Was Born',
    description: 'A group of passionate travelers and tech enthusiasts came together with a single idea: to make bus travel simple, accessible, and enjoyable for everyone.',
  },
  {
    icon: <FaRocket className="h-6 w-6 text-white" />,
    year: '2023',
    title: 'BusGo Officially Launched',
    description: 'After months of hard work, we launched our platform, connecting our first 100 routes and welcoming our first wave of adventurous passengers.',
  },
  {
    icon: <FaUsers className="h-6 w-6 text-white" />,
    year: '2024',
    title: 'Serving 10,000+ Happy Travelers',
    description: 'We celebrated a major milestone, having successfully served over 10,000 customers. We expanded our network to cover over 500 destinations nationwide.',
  },
  {
    icon: <FaBullseye className="h-6 w-6 text-white" />,
    year: '2025 & Beyond',
    title: 'Looking to the Horizon',
    description: 'Our journey is just beginning. We are committed to innovating further, expanding our reach globally, and continuing to perfect the travel experience for you.',
  },
];

// 2. The reusable TimelineItem component
const TimelineItem = ({ icon, year, title, description, isLast }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div className="flex" variants={itemVariants}>
      {/* Icon and Vertical Line */}
      <div className="flex flex-col items-center mr-6">
        <div className="bg-green-600 rounded-full h-12 w-12 flex items-center justify-center z-10 flex-shrink-0">
          {icon}
        </div>
        {!isLast && <div className="w-px h-full bg-gray-300"></div>}
      </div>
      
      {/* Content Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-8">
        <p className="text-sm font-semibold text-green-600 mb-1">{year}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

// 3. The main OurJourney component
const OurJourney = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3, // This creates the staggered animation effect
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Our Journey
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            A timeline of our passion, growth, and commitment to you.
          </p>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {journeyData.map((item, index) => (
            <TimelineItem
              key={index}
              icon={item.icon}
              year={item.year}
              title={item.title}
              description={item.description}
              isLast={index === journeyData.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurJourney;