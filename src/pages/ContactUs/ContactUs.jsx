import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { Disclosure } from '@headlessui/react';
import Footer from '../../components/Footer/Footer';

const faqs = [
  {
    question: "How do I cancel my ticket?",
    answer: "You can cancel your ticket through the 'My Bookings' section of your account. Please note that cancellation policies vary by bus operator. Be sure to check the policy before confirming your cancellation."
  },
  {
    question: "Can I reschedule my journey?",
    answer: "Rescheduling options depend on the bus operator's policy. If available, you can find the option in your 'My Bookings' details. Fees may apply."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, net banking, and various popular digital wallets for a smooth and secure payment experience."
  },
  {
    question: "I haven't received my ticket confirmation.",
    answer: "Ticket confirmations are sent via email and SMS immediately after booking. If you haven't received it within 15 minutes, please check your spam folder or contact our support team with your booking details."
  }
];

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
    <div className="bg-gray-50 min-h-screen">
      {/* --- Hero Section --- */}
      <motion.div
        className="relative bg-cover bg-center py-32 flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://www.shutterstock.com/image-photo/using-laptop-show-icon-address-260nw-2521386695.jpg')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          className="relative z-10 text-center px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* --- Contact Form --- */}
          <motion.div className="lg:col-span-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 p-8 rounded-2xl shadow-lg" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" className="mt-1 block w-full px-4 py-3 bg-gray-50 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" className="mt-1 block w-full px-4 py-3 bg-gray-50 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" id="subject" className="mt-1 block w-full px-4 py-3 bg-gray-50 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="e.g., Booking Inquiry" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows="5" className="mt-1 block w-full px-4 py-3 bg-gray-50 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500" placeholder="Your message here..."></textarea>
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
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center space-x-3">
                  <FiMail className="text-green-600 w-5 h-5" />
                  <span>support@busgo.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <FiPhone className="text-green-600 w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FiMapPin className="text-green-600 w-5 h-5 mt-1 flex-shrink-0" />
                  <span>123 Travel Lane, Journey City, Route 66, USA</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Office Hours</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Monday - Friday: 9am - 8pm</li>
                <li>Saturday: 10am - 6pm</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* --- FAQ Section --- */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Disclosure key={index} as="div" className="bg-white/60 backdrop-blur-sm border border-gray-200/50 p-4 rounded-2xl shadow-lg">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800">
                      <span>{faq.question}</span>
                      <FiChevronDown className={`transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </Disclosure.Button>
                    <Disclosure.Panel as="div" className="pt-4 mt-2 border-t border-gray-200 text-gray-600">
                      {faq.answer}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </motion.div>

      </div>
        <Footer />
    </div>
  );
};

export default ContactUs;