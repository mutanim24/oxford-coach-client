import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get booking data from navigation state
    const state = location.state;
    if (!state || !state.bookingData) {
      navigate('/booking-summary');
      return;
    }

    setBookingData(state.bookingData);
    setIsLoading(false);
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">Booking data not found. Please try again.</p>
          <button 
            onClick={() => navigate('/booking-summary')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-600">Your bus ticket has been successfully booked.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Booking Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{bookingData._id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PNR Number</p>
                    <p className="font-medium">{bookingData.pnrNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passenger Name</p>
                    <p className="font-medium">{bookingData.userName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-green-600">${bookingData.totalAmount || bookingData.totalFare || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Trip Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bus Operator</p>
                      <p className="font-medium">{bookingData.operator || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bus Name</p>
                      <p className="font-medium">{bookingData.busName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{bookingData.source || 'N/A'} → {bookingData.destination || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure Time</p>
                      <p className="font-medium">{bookingData.departureTime ? new Date(bookingData.departureTime).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {bookingData.seats && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Selected Seats</h3>
                    <p className="font-medium">{bookingData.seats.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Back to Home
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Print Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
