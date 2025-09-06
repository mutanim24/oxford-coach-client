import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi'; // A nice icon for the send button

// --- Data for Links (Easier to manage) ---
const quickLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact Us' },
  { href: '/faq', label: 'FAQs' },
  // { href: '/blog', label: 'Blog' }, // Uncomment if you add a blog
];

const legalLinks = [
  { href: '/terms-and-conditions', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  // +++ THIS IS THE ADJUSTMENT +++
  // Points to the FAQ page and the specific cancellation section
  { href: '/faq#cancellation-policy', label: 'Cancellation Policy' },
];

// --- Reusable Components for Cleaner Code ---

const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link 
            to={link.href} 
            className="text-gray-400 hover:text-white hover:pl-1 transition-all duration-300 block"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const NewsletterForm = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Stay Updated</h3>
    <p className="text-gray-400 mb-4">Get the latest news and offers straight to your inbox.</p>
    <form>
      <div className="flex">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 text-gray-800 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-r-md font-semibold transition-colors flex items-center"
          aria-label="Subscribe to newsletter"
        >
          <FiSend size={20} />
        </button>
      </div>
    </form>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo, Description, and Socials */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-3xl font-bold text-green-500 mb-4 inline-block">BusGo</Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted partner for comfortable and affordable bus travel across the nation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300"><FaYoutube size={24} /></a>
            </div>
          </div>
          
          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
          <NewsletterForm />

        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BusGo. All rights reserved. Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;