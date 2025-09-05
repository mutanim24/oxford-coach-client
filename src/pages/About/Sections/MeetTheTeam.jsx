import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

// 1. Data for the team members
const teamData = [
  {
    name: 'Jane Doe',
    role: 'CEO & Co-Founder',
    avatarUrl: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'John Smith',
    role: 'CTO & Co-Founder',
    avatarUrl: 'https://images.pexels.com/photos/842567/pexels-photo-842567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Emily White',
    role: 'Head of Operations',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
  {
    name: 'Michael Brown',
    role: 'Lead Developer',
    avatarUrl: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
  },
];

// 2. The reusable TeamMemberCard component
const TeamMemberCard = ({ name, role, avatarUrl, socials }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="group relative rounded-lg overflow-hidden shadow-lg"
      variants={cardVariants}
    >
      <img src={avatarUrl} alt={name} className="w-full h-80 object-cover" />
      
      {/* Static Info at the bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-white/80">{role}</p>
      </div>

      {/* Hover Overlay with Socials */}
      <div className="absolute inset-0 bg-green-800 bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center p-6">
        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          <p className="text-white/90 mb-4">{role}</p>
          <div className="flex justify-center space-x-4">
            <a href={socials.linkedin} className="text-white hover:text-green-200 transition-colors">
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a href={socials.twitter} className="text-white hover:text-green-200 transition-colors">
              <FaTwitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 3. The main MeetTheTeam component
const MeetTheTeam = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-500 mt-2">
            The passionate individuals dedicated to making your travel better.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {teamData.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              role={member.role}
              avatarUrl={member.avatarUrl}
              socials={member.socials}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MeetTheTeam;