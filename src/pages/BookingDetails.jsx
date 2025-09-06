import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { FiArrowLeft, FiDownload, FiXCircle, FiAlertTriangle, FiLoader, FiFileText } from 'react-icons/fi';
// Your existing services and components
import bookingService from '../services/bookingService';
import Ticket from '../components/Ticket/Ticket';
import Toast from '../components/Toast/Toast';

// All your original logic, state, and functions are preserved.
const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.booking);
      } catch (err) {
        setError('Failed to fetch booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action is permanent.')) {
      try {
        setLoading(true);
        await bookingService.cancelBooking(bookingId);
        setToast({ show: true, message: 'Booking cancelled successfully.', type: 'success' });
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.booking);
      } catch (error) {
        setToast({ show: true, message: 'Failed to cancel booking.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      setToast({ show: true, message: 'Preparing your ticket...', type: 'info' });
      const dataUrl = await domtoimage.toPng(ticketRef.current, { quality: 1.0, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`BusGo-Ticket-${booking.pnrNumber}.pdf`);
        setToast({ show: true, message: 'Ticket downloaded!', type: 'success' });
      };
    } catch (error) {
      setToast({ show: true, message: 'Failed to download PDF.', type: 'error' });
    }
  };

  const canCancel = () => {
    if (!booking) return false;
    return booking.status === 'confirmed' && new Date(booking.schedule.departureTime) > new Date();
  };

  // --- FANCY UI STATES ---

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <FiLoader className="h-12 w-12 mx-auto text-green-500 animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading Your Itinerary...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center border-t-4 border-red-500">
        <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={() => navigate('/my-bookings')} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Back to My Bookings
        </button>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-12 text-center border-t-4 border-green-500">
        <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Booking Not Found</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">We couldn't find the booking you're looking for. It might have been moved or deleted.</p>
        <button onClick={() => navigate('/my-bookings')} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-base shadow-lg hover:shadow-xl transition-all">
          View All Bookings
        </button>
      </div>
    </div>
  );
  
  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
             <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Booking Itinerary</h1>
             <p className="mt-1 text-gray-500">PNR: <span className="font-semibold text-gray-700">{booking.pnrNumber}</span></p>
          </div>
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft />
            Back to My Bookings
          </button>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: The Ticket */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Digital Ticket</h2>
            <div ref={ticketRef} className="bg-white rounded-lg shadow-2xl">
              {/* This component should be styled to look like a ticket */}
              <Ticket booking={booking} />
            </div>
          </motion.div>
          
          {/* Right Side: Action Panel */}
          <motion.aside 
            className="lg:col-span-1 sticky top-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.4 } }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Actions & Overview</h3>
              
              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={downloadPDF} 
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  <FiDownload />
                  Download as PDF
                </button>
                {canCancel() && (
                  <button
                    onClick={handleCancelBooking}
                    className="w-full flex items-center justify-center gap-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    <FiXCircle />
                    Cancel Booking
                  </button>
                )}
              </div>
              
              {/* Overview Details */}
              <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-500">Booking Status</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ {confirmed: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800'}[booking.status]}`}>
                          {booking.status.toUpperCase()}
                      </span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-500">Payment</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ {succeeded: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800'}[booking.paymentStatus]}`}>
                          {booking.paymentStatus.toUpperCase()}
                      </span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-500">Total Fare</span>
                      <span className="font-bold text-xl text-gray-800">${booking.totalFare}</span>
                  </div>
              </div>

            </div>
          </motion.aside>
        </div>

      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
        </div>
      )}
    </div>
  );
};

export default BookingDetails;