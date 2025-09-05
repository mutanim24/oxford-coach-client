import React from 'react';
import { motion } from 'framer-motion';

// 1. Data for the top routes with high-quality image URLs
const topRoutesData = [
  {
    from: 'Los Angeles',
    to: 'New York City',
    image: 'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    from: 'Miami',
    to: 'Orlando',
    image: 'https://images.pexels.com/photos/14197331/pexels-photo-14197331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    from: 'New York City',
    to: 'Washington',
    image: 'https://images.pexels.com/photos/2224741/pexels-photo-2224741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    from: 'New York City',
    to: 'Philadelphia',
    image: 'https://images.pexels.com/photos/2852445/pexels-photo-2852445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    from: 'Orlando',
    to: 'Fort Lauderdale',
    image: 'https://images.pexels.com/photos/2249063/pexels-photo-2249063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    from: 'Los Angeles',
    to: 'Las Vegas',
    image: 'https://images.pexels.com/photos/5638813/pexels-photo-5638813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// 2. The reusable RouteCard component
const RouteCard = ({ from, to, image }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    >
      <img src={image} alt={`Bus route from ${from} to ${to}`} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-white text-lg font-bold">
          Buses from {from} to {to}
        </h3>
      </div>
    </motion.div>
  );
};

// 3. The main TopRoutes section component
const TopRoutes = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Top Traveled <span className="text-green-600">Bus Routes</span>
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            Explore our most popular destinations and book your next adventure.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {topRoutesData.map((route, index) => (
            <RouteCard
              key={index}
              from={route.from}
              to={route.to}
              image={route.image}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopRoutes;