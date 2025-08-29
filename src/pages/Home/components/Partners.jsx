import React from 'react';
// import { motion } from 'framer-motion';

// 1. Data updated with major UK-based bus companies
const partnersData = [
  {
    name: 'National Express',
    logoUrl: 'https://cdn.prgloo.com/media/ea98240831ea46b3bcbb834a1d133e3d.gif?width=640&height=960',
  },
  {
    name: 'Megabus',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5BiA86I5gNJjvJDPcERHJ_HcoBDTjrmyHow&s',
  },
  {
    name: 'Stagecoach',
    logoUrl: 'https://cdn.prgloo.com/web/StagecoachGroup/Stagecoach-Placeholder.png',
  },
  {
    name: 'First Bus',
    logoUrl: 'https://ptfc.co.uk/wp-content/uploads/2022/07/PTFC-v-FirstBus-900x520.jpg',
  },
  {
    name: 'Arriva UK Bus',
    logoUrl: 'https://www.iot-now.com/wp-content/uploads/2014/08/Arriva-logo-new.jpg',
  },
  {
    name: 'Go-Ahead',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBIJxoeThYd-qVz0QLw9LIgy2UGMH5L0o6Kl_QhN_fZ_UD-_wR3xlu5xH_UmJJBpOBvOQ&usqp=CAU',
  },
];

// 2. The reusable PartnerLogo component (no changes needed)
const PartnerLogo = ({ name, logoUrl }) => {
  const logoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="flex items-center justify-center h-24 p-4"
      variants={logoVariants}
    >
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      />
    </motion.div>
  );
};

// 3. The main Partners component (no changes needed)
const Partners = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Proudly Partnered with Industry Leaders
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            Your ticket to a network of trusted bus companies.
          </p>
        </div>
        
        <motion.div
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {partnersData.map((partner, index) => (
              <PartnerLogo
                key={index}
                name={partner.name}
                logoUrl={partner.logoUrl}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;