import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiMail, FiFileText } from 'react-icons/fi';

// --- Privacy Policy Data Structure ---
// All content is managed here for easy updates.
const policyData = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>Welcome to BusGo ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").</p>
        <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.</p>
      </>
    )
  },
  {
    id: "collection",
    title: "2. Information We Collect",
    content: (
      <>
        <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
        <ul>
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service, such as online chat and message boards.</li>
          <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
          <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor.</li>
        </ul>
      </>
    )
  },
  {
    id: "usage",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
        <ul>
            <li>Create and manage your account.</li>
            <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
            <li>Email you regarding your account or order.</li>
            <li>Improve our website and services.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Notify you of updates to the Service.</li>
        </ul>
      </>
    )
  },
  {
    id: "security",
    title: "4. Data Security",
    content: (
      <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
    )
  },
  {
    id: "children",
    title: "5. Policy for Children",
    content: (
      <p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.</p>
    )
  },
  {
    id: "contact",
    title: "6. Contact Us",
    content: (
      <p>If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at: <a href="mailto:privacy@busgo.com" className="text-green-600 hover:underline">privacy@busgo.com</a>.</p>
    )
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
            <FiShield className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-500">Your trust and privacy are important to us.</p>
          <p className="mt-1 text-sm text-gray-400">Last Updated: September 07, 2025</p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* --- Left Side: Policy Content --- */}
          <main className="lg:col-span-3">
            <div className="space-y-12">
              {policyData.map((section) => (
                <motion.section 
                  key={section.id} id={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">{section.title}</h2>
                  <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
                    {section.content}
                  </div>
                </motion.section>
              ))}
            </div>
          </main>
          
          {/* --- Right Side: Sticky Navigation --- */}
          <aside className="hidden lg:block">
            <motion.div 
              className="sticky top-24 bg-gray-800 text-white p-8 rounded-lg shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {policyData.map(item => (
                  <li key={`nav-${item.id}`}>
                    <a 
                      href={`#${item.id}`}
                      className="block text-gray-300 hover:text-green-400 transition-colors border-l-2 border-gray-600 hover:border-green-400 pl-4"
                    >
                      {item.title.substring(item.title.indexOf(' ') + 1)}
                    </a>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-gray-600" />

              <h4 className="font-bold text-white mb-3">Related Documents</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms-and-conditions" className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                    <FiFileText className="mr-3 h-5 w-5" /> Terms and Conditions
                  </Link>
                </li>
                <li>
                   <a href="mailto:privacy@busgo.com" className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                    <FiMail className="mr-3 h-5 w-5" /> Contact DPO
                  </a>
                </li>
              </ul>
            </motion.div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;