// src/pages/FAQPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { FiChevronDown, FiPhone, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';

// Adding the FAQs from your contact page here for a single source of truth
const faqSections = [
  {
    category: "Booking & Tickets",
    questions: [
      { q: "How do I book a ticket on BusGo?", a: "Booking is easy! Simply enter your departure and destination cities, select your travel date, and click 'Search'. Choose your preferred bus, select your seats, provide passenger details, and proceed to payment. Your ticket will be confirmed instantly." },
      { q: "Can I choose my seat?", a: "Yes, most of our bus partners allow you to select your seat from an interactive seat map during the booking process. The availability of this feature depends on the bus operator." },
      { q: "What is an m-Ticket and do I need a printout?", a: "An m-Ticket is a digital ticket sent to your email and phone. For most buses, you can show the m-Ticket on your mobile device along with a valid photo ID to board. We recommend checking the operator's policy, as a few may still require a printout." },
      { q: "I haven't received my ticket confirmation.", a: "Ticket confirmations are sent via email and SMS immediately after booking. If you haven't received it within 15 minutes, please check your spam folder or contact our support team with your booking details." } // <-- Added from your old contact page
    ]
  },
  {
    category: "Payments & Refunds",
    questions: [
      { q: "What is the basic refund policy?", a: "Refund policies are determined by the bus operator and vary based on how far in advance you cancel the ticket. The specific cancellation charges are mentioned on the booking page before you pay. No refund is typically issued for cancellations made within a few hours of departure." },
      { q: "How long does it take to process a refund?", a: "Once your cancellation is confirmed, the refund is processed within 24 hours from our end. It may take 5-7 business days for the amount to reflect in your original payment account, depending on your bank." },
      { q: "What payment methods do you accept?", a: "We accept a wide range of payment options, including all major credit cards (Visa, MasterCard), debit cards, Net Banking, and popular digital wallets." },
      { q: "How do I cancel my ticket?", a: "You can cancel your ticket through the 'My Bookings' section of your account. Please note that cancellation policies vary by bus operator. Be sure to check the policy before confirming your cancellation." } // <-- Added
    ]
  },
  {
    category: "User Manual & On-Board",
    questions: [
      { q: "What documents do I need to carry while boarding?", a: "You must carry a valid government-issued photo ID (like a Passport, Driver's License, or Aadhar Card) along with your m-Ticket or a printed copy of your ticket." },
      { q: "What is the luggage allowance?", a: "The luggage allowance varies by bus operator, but generally, one suitcase and one piece of hand luggage per passenger are permitted. Please check the operator's specific policy for details on size and weight limits." },
      { q: "Can I reschedule my journey?", a: "Rescheduling options depend on the bus operator's policy. If available, you can find the option in your 'My Bookings' details. Fees may apply." } // <-- Added
    ]
  }
];

const FAQPage = () => {
  return (
    // Changed main background to dark
    <div className="bg-gray-900 min-h-screen text-white">
      {/* --- Hero Section --- */}
      <div className="relative bg-cover bg-center py-24 md:py-32" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c186922?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            Help Center
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find answers to your questions about booking, refunds, and more.
          </motion.p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- FAQ List --- */}
          <div className="lg:col-span-2">
            {faqSections.map((section, idx) => (
              <motion.div 
                key={section.category} className="mb-12"
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b-2 border-green-500 inline-block">{section.category}</h2>
                <div className="w-full space-y-4">
                  {section.questions.map((item) => (
                    // Changed accordion colors for dark theme
                    <Disclosure key={item.q} as="div" className="bg-gray-800 rounded-lg">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg px-6 py-4 text-left text-lg font-medium text-gray-100 hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75 transition-colors">
                            <span>{item.q}</span>
                            <FiChevronDown className={`${ open ? 'rotate-180' : '' } h-6 w-6 text-green-400 transform transition-transform duration-300`} />
                          </Disclosure.Button>
                          <AnimatePresence>
                            {open && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden"
                              >
                                <Disclosure.Panel className="px-6 pb-4 pt-2 text-base text-gray-300">
                                  {item.a}
                                </Disclosure.Panel>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* --- Side Panel (already styled well for dark theme) --- */}
          <aside>
            <div className="sticky top-24 space-y-8">
              <motion.div 
                className="bg-green-600 text-white p-8 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FiPhone className="h-10 w-10 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Emergency Contact</h3>
                <p className="text-green-100 mb-4">For urgent issues during travel, contact our 24/7 support line.</p>
                <p className="text-2xl font-mono font-bold tracking-wider">+1 (555) 123-4567</p>
              </motion.div>

              <motion.div
                className="bg-gray-800 p-8 rounded-lg" // Changed background
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FiCheckCircle className="h-8 w-8 mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-white mb-3">Pro Travel Tips</h3>
                <ul className="space-y-2 text-gray-300 list-disc list-inside">
                  <li>Arrive at the terminal 30 mins early.</li>
                  <li>Keep your digital ticket and ID handy.</li>
                  <li>Charge your devices before you travel.</li>
                  <li>Pack a small snack and water.</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-gray-800 p-8 rounded-lg" // Changed background
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
              >
                <FiHelpCircle className="h-8 w-8 mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
                <p className="text-gray-300 mb-4">Our contact team is here to help you directly.</p>
                <Link to="/contact-us" className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-300">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;