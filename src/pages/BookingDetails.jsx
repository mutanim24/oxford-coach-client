import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Navbar from '../components/Navbar/Navbar';
import Button from '../components/Button/Button';
import Toast from '../components/Toast/Toast';
import Ticket from '../components/Ticket/Ticket';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.booking);
      } catch (err) {
        setError('Failed to fetch booking details. Please try again later.');
        console.error('Error fetching booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        setLoading(true);
        await bookingService.cancelBooking(bookingId);
        setToast({ show: true, message: 'Booking cancelled successfully', type: 'success' });
        // Refresh the booking details
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.booking);
      } catch (error) {
        setToast({ show: true, message: 'Failed to cancel booking. Please try again.', type: 'error' });
        console.error('Error cancelling booking:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (departureTime) => {
    return new Date(departureTime) > new Date();
  };

  const canCancel = () => {
    if (!booking) return false;
    // Allow cancellation only for confirmed bookings that haven't departed yet
    return booking.status === 'confirmed' && isUpcoming(booking.schedule.departureTime);
  };

  const ticketRef = useRef(null);

  // Function to download ticket as PDF
  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    try {
      // Convert the ticket div to a PNG image using dom-to-image
      const dataUrl = await domtoimage.toPng(ticketRef.current, { 
        quality: 0.95,
        backgroundColor: '#ffffff'
      });
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Create an image to get dimensions
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // Calculate dimensions to fit the PDF page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        // Add the image to the PDF
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Save the PDF
        pdf.save(`ticket-${booking.pnrNumber}.pdf`);
        
        // Show success toast
        setToast({ show: true, message: 'Ticket downloaded successfully', type: 'success' });
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        setToast({ show: true, message: 'Failed to generate PDF. Please try again.', type: 'error' });
      };
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToast({ show: true, message: 'Failed to download PDF. Please try again.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">Booking not found</h3>
            <p className="mt-2 text-gray-500">The booking you're looking for doesn't exist.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/my-bookings')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Back to My Booking
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-bookings')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to My Booking
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <p className="mt-1 text-sm text-gray-600">PNR: {booking.pnrNumber}</p>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trip Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Route</p>
                    <p className="text-gray-900">
                      {booking.schedule.source} to {booking.schedule.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Departure</p>
                    <p className="text-gray-900">{formatDate(booking.schedule.departureTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bus Operator</p>
                    <p className="text-gray-900">{booking.bus.operator}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Bus Type</p>
                    <p className="text-gray-900">{booking.bus.busType}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  {booking.paymentStatus && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Status</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.paymentStatus === 'succeeded'
                        ? 'bg-green-100 text-green-800'
                        : booking.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  )}
                  {booking.paymentDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Date</p>
                      <p className="text-gray-900">{formatDate(booking.paymentDate)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Fare</p>
                    <p className="text-gray-900 font-medium">${booking.totalFare}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats Information */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seats Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Selected Seats</p>
                  <p className="text-gray-900">{booking.selectedSeats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Seats</p>
                  <p className="text-gray-900">{booking.selectedSeats.length} seat{booking.selectedSeats.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Passenger Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{booking.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{booking.user.email}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              {canCancel() && (
                <Button
                  onClick={handleCancelBooking}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Booking
                </Button>
              )}
             
              <button
                onClick={downloadPDF} 
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Hidden ticket component for PDF generation */}
        <div className="hidden">
          <div ref={ticketRef}>
            <Ticket booking={booking} />
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: '' })}
          />
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
