// src/pages/ContactUs/ContactUs.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="bg-gray-50">
      {/* --- Hero Section --- */}
      <motion.div
        className="relative bg-cover bg-center py-32 flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c186922?q=80&w=2070&auto=format&fit=crop')" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          <motion.h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4" variants={itemVariants}>
            Get In Touch
          </motion.h1>
          <motion.p className="text-lg md:text-xl max-w-2xl mx-auto" variants={itemVariants}>
            We're here to help you with your journey. Reach out to us with any questions or feedback.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* --- Main Content Area --- */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {/* --- Contact Form --- */}
          <motion.div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl shadow-lg" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input type="text" id="name" className="mt-1 block w-full px-4 py-3 bg-gray-900 text-white border-gray-700 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                  <input type="email" id="email" className="mt-1 block w-full px-4 py-3 bg-gray-900 text-white border-gray-700 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
                <input type="text" id="subject" className="mt-1 block w-full px-4 py-3 bg-gray-900 text-white border-gray-700 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="e.g., Booking Inquiry" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea id="message" rows="5" className="mt-1 block w-full px-4 py-3 bg-gray-900 text-white border-gray-700 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="Your message here..."></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>

          {/* --- Contact Info Side Panel --- */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center space-x-3"><FiMail className="text-green-500 w-5 h-5" /><span>support@busgo.com</span></li>
                <li className="flex items-center space-x-3"><FiPhone className="text-green-500 w-5 h-5" /><span>+1 (555) 123-4567</span></li>
                <li className="flex items-start space-x-3"><FiMapPin className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" /><span>123 Travel Lane, Journey City, USA</span></li>
              </ul>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-4">Office Hours</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Monday - Friday: 9am - 8pm</li>
                <li>Saturday: 10am - 6pm</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* +++ REPLACEMENT SECTION - LINK TO FAQ PAGE +++ */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto text-center bg-gray-800 p-10 rounded-2xl"
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
            <FiHelpCircle className="h-12 w-12 mb-4 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold text-white mb-4">Have More Questions?</h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              We might have already answered your question. Check out our detailed FAQ page for more information on bookings, refunds, and travel policies.
            </p>
            <Link to="/faq" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-300">
                Visit Help Center
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;