import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { FaTicketAlt, FaCheckCircle, FaDollarSign, FaTimesCircle } from 'react-icons/fa';

// A dedicated component for the animated number
const AnimatedNumber = ({ to, isInt = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      animate(0, to, {
        duration: 2,
        onUpdate(latest) {
          if (isInt) {
            ref.current.textContent = Math.round(latest).toLocaleString();
          } else {
            ref.current.textContent = latest.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        },
      });
    }
  }, [isInView, to, isInt]);

  return <span ref={ref}>{isInt ? '0' : '0.00'}</span>;
};


// The main insights component with the new layout
const BookingInsights = ({ insights, loading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Show a loading skeleton for a better UX
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-64">
        <div className="bg-white rounded-xl shadow-md animate-pulse lg:col-span-2"></div>
        <div className="bg-white rounded-xl shadow-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main "Hero" Panel for Revenue */}
      <motion.div
        className="lg:col-span-2 bg-gray-800 text-white rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
        variants={itemVariants}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FaDollarSign className="h-7 w-7 text-green-400" />
            <h3 className="text-xl font-semibold text-gray-300">Total Confirmed Revenue</h3>
          </div>
          <p className="text-5xl md:text-6xl font-extrabold tracking-tight">
            $<AnimatedNumber to={insights.totalRevenue} isInt={false} />
          </p>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4 flex gap-8">
            <div>
                <p className="text-gray-400">Sales This Month</p>
                <p className="text-2xl font-bold text-white"><AnimatedNumber to={insights.monthlySales} /></p>
            </div>
        </div>
      </motion.div>

      {/* Stacked Secondary Panels */}
      <motion.div className="flex flex-col gap-6" variants={itemVariants}>
        {/* Confirmed Bookings Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex-1 flex items-center">
            <div className="bg-teal-100 text-teal-600 rounded-full p-3 mr-4">
                <FaCheckCircle className="h-6 w-6" />
            </div>
            <div>
                <p className="text-gray-600">Confirmed Bookings</p>
                <p className="text-3xl font-bold text-gray-800"><AnimatedNumber to={insights.confirmedBookings} /></p>
            </div>
        </div>

        {/* Cancelled Bookings Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex-1 flex items-center">
            <div className="bg-red-100 text-red-600 rounded-full p-3 mr-4">
                <FaTimesCircle className="h-6 w-6" />
            </div>
            <div>
                <p className="text-gray-600">Cancelled Bookings</p>
                <p className="text-3xl font-bold text-gray-800"><AnimatedNumber to={insights.cancelledBookings} /></p>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingInsights;