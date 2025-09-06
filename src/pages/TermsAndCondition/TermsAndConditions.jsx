import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFileText, FiShield } from 'react-icons/fi';

// --- Terms and Conditions Data Structure ---
const termsData = [
  { id: "introduction", title: "1. Introduction & Acceptance", content: (<><p>Welcome to BusGo. These Terms and Conditions ("Terms") govern your use of the BusGo website, mobile application, and services (collectively, the "Service"), operated by BusGo Inc. By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy.</p><p>If you do not agree to these Terms, you may not use the Service. We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.</p></>) },
  { id: "accounts", title: "2. User Accounts", content: (<><p>To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p><p>You must provide accurate and complete information and keep your account information updated. You must be at least 18 years of age to create an account and use our Service.</p></>) },
  { id: "bookings", title: "3. Bookings, Payments, and Fees", content: (<><p>BusGo acts as an intermediary, facilitating bookings between you and various bus operators. When you book a ticket, you are entering into a contract directly with the bus operator.</p><p><strong>Payment:</strong> All payments must be made at the time of booking. We accept various payment methods as indicated on the payment page. By providing payment information, you represent and warrant that you are authorized to use the designated payment method.</p><p><strong>Pricing:</strong> All prices are listed in the local currency and are subject to change. The final price will be displayed at the time of checkout.</p></>) },
  { id: "cancellations", title: "4. Cancellations & Refunds", content: (<><p>Cancellation policies are set by the individual bus operators and will be clearly displayed during the booking process and on your ticket confirmation. It is your responsibility to review the cancellation policy before completing your booking.</p><p>To cancel a booking, please visit the "My Bookings" section of your account. Refunds, if applicable, will be processed back to the original method of payment within 5-7 business days, subject to the operator's policy and any applicable service fees.</p></>) },
  { id: "liability", title: "5. Limitation of Liability", content: (<><p>The Service is provided on an "as is" and "as available" basis. BusGo does not warrant that the service will be uninterrupted, error-free, or secure. To the fullest extent permitted by law, BusGo Inc., its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, or other intangible losses, resulting from your use of the Service.</p></>) },
  { id: "governing-law", title: "6. Governing Law", content: (<p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which BusGo Inc. is established, without regard to its conflict of law provisions.</p>) },
  { id: "contact", title: "7. Contact Information", content: (<p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@busgo.com" className="text-green-600 hover:underline">legal@busgo.com</a>.</p>) },
];

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* --- Hero Section --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">Terms and Conditions</h1>
          <p className="mt-4 text-lg text-gray-500">Last Updated: September 07, 2025</p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* --- Left Side: Terms Content --- */}
          <main className="lg:col-span-3">
            <div className="space-y-12">
              {termsData.map((section) => (
                <motion.section 
                  key={section.id} id={section.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
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
                {termsData.map(item => (
                  <li key={`nav-${item.id}`}>
                    <a 
                      href={`#${item.id}`}
                      className="block text-gray-300 hover:text-green-400 transition-colors border-l-2 border-gray-600 hover:border-green-400 pl-4"
                    >
                      {item.title.substring(item.title.indexOf(' ') + 1)} {/* Removes the number */}
                    </a>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-gray-600" />

              <h4 className="font-bold text-white mb-3">More Information</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy-policy" className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                    <FiShield className="mr-3 h-5 w-5" /> Privacy Policy
                  </Link>
                </li>
                <li>
                   <a href="mailto:legal@busgo.com" className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                    <FiFileText className="mr-3 h-5 w-5" /> Contact Legal Team
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

export default TermsAndConditions;