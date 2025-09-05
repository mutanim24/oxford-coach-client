import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { FaUsers, FaCity, FaTicketAlt, FaSmile } from 'react-icons/fa';

// 1. Data for the statistics
const statsData = [
  {
    icon: <FaUsers className="h-10 w-10 text-green-400" />,
    number: 50000,
    suffix: '+',
    label: 'Happy Customers',
  },
  {
    icon: <FaCity className="h-10 w-10 text-green-400" />,
    number: 800,
    suffix: '+',
    label: 'Cities Connected',
  },
  {
    icon: <FaTicketAlt className="h-10 w-10 text-green-400" />,
    number: 100000,
    suffix: '+',
    label: 'Tickets Booked',
  },
  {
    icon: <FaSmile className="h-10 w-10 text-green-400" />,
    number: 98,
    suffix: '%',
    label: 'Positive Reviews',
  },
];

// 2. A dedicated component for the animated number
const AnimatedNumber = ({ to }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
    }
  }, [isInView, to]);

  return <span ref={ref}>0</span>;
};


// 3. The reusable StatItem component
const StatItem = ({ icon, number, suffix, label }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div className="text-center" variants={itemVariants}>
      <div className="flex justify-center mb-4">{icon}</div>
      <p className="text-4xl md:text-5xl font-extrabold text-white">
        <AnimatedNumber to={number} />
        {suffix}
      </p>
      <p className="text-lg text-gray-300 mt-2">{label}</p>
    </motion.div>
  );
};


// 4. The main ImpactNumbers component
const ImpactNumbers = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Our Impact By <span className="text-green-600">The Numbers</span>
          </h2>
          <p className="text-lg text-gray-400 mt-2">
            We're proud of the community we've built and the journeys we've enabled.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {statsData.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactNumbers;