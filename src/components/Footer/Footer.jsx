import React from 'react';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-white text-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold text-green-600 mr-2">BusGo</div>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Your trusted partner for comfortable and affordable bus travel. 
              Book your journey with us and experience the difference.
            </p>
            <div className="flex space-x-4">
              <a className="text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a className="text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a className="text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a className="text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Services Section */}
          <div>
            <span className="footer-title text-lg font-semibold mb-4 text-green-600">Services</span>
            <ul className="space-y-2">
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Bus Tickets</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Tour Packages</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Corporate Travel</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Group Bookings</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Bus Charter</a></li>
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <span className="footer-title text-lg font-semibold mb-4 text-green-600">Company</span>
            <ul className="space-y-2">
              <li><a className="link link-hover text-gray-600 hover:text-green-600">About Us</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Careers</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Blog</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">Contact Us</a></li>
              <li><a className="link link-hover text-gray-600 hover:text-green-600">FAQs</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-center mt-8 pt-8 border-t border-gray-300">
          <div className="grid grid-flow-col gap-4">
            <p className="text-gray-500">Copyright © {new Date().getFullYear()} BusGo - All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
