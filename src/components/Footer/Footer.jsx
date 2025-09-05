import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

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
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaYoutube size={24} /></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation" className="text-gray-400 hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Get the latest news and offers straight to your inbox.</p>
            <form>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 text-black bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} BusGo. All rights reserved. Built with passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;