import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import scheduleService from '../services/scheduleService';
import CheckoutForm from '../components/PaymentForm/CheckoutForm';

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [bookingData, setBookingData] = useState(null);
  const [scheduleDetails, setScheduleDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Get booking data from navigation state
    const state = location.state;
    if (!state || !state.scheduleId || !state.selectedSeats) {
      setError('Booking data is missing. Please go back and select seats again.');
      setIsLoading(false);
      return;
    }

    const { scheduleId, selectedSeats, fare } = state;
    setBookingData({ scheduleId, selectedSeats, fare });
    
    // Fetch schedule details
    const fetchScheduleDetails = async () => {
      try {
        const response = await scheduleService.getScheduleById(scheduleId);
        setScheduleDetails(response.schedule);
      } catch (err) {
        console.error('Error fetching schedule details:', err);
        setError('Failed to load schedule details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [user, navigate, location.state]);

  const handleCreateBooking = async () => {
    if (!bookingData || !scheduleDetails) return;

    try {
      setIsLoading(true);
      
      // Prepare booking data
      const bookingPayload = {
        scheduleId: bookingData.scheduleId,
        selectedSeats: bookingData.selectedSeats,
        totalAmount: bookingData.selectedSeats.length * bookingData.fare,
        userId: user._id
      };

      // Make API call to create the booking
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      setBookingId(booking.booking._id);
      setShowPaymentForm(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (booking) => {
    setPaymentSuccess(true);
    navigate('/booking-confirmation', { 
      state: { 
        bookingData: {
          ...booking,
          busName: scheduleDetails.bus.name,
          source: scheduleDetails.source,
          destination: scheduleDetails.destination,
          departureTime: scheduleDetails.departureTime,
          operator: scheduleDetails.bus.operator,
          seats: bookingData.selectedSeats
        }
      } 
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError('Payment failed. Please try again.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return null; // This case should be handled by the error case above
  }

  const totalFare = bookingData.selectedSeats.length * bookingData.fare;

  // Show payment form if booking is created and payment is needed
  if (showPaymentForm && bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Payment</h1>
            <CheckoutForm 
              bookingId={bookingId} 
              amount={totalFare}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Passenger Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600"><span className="font-medium">Name:</span> {user.name}</p>
                <p className="text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Trip Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {scheduleDetails ? (
                  <>
                    <p className="text-gray-600"><span className="font-medium">Bus Operator:</span> {scheduleDetails.bus.operator}</p>
                    <p className="text-gray-600"><span className="font-medium">Route:</span> {scheduleDetails.source} → {scheduleDetails.destination}</p>
                    <p className="text-gray-600"><span className="font-medium">Departure Time:</span> {new Date(scheduleDetails.departureTime).toLocaleString()}</p>
                    <p className="text-gray-600"><span className="font-medium">Bus Type:</span> {scheduleDetails.bus.busType}</p>
                  </>
                ) : (
                  <p className="text-gray-600">Loading trip details...</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Selected Seats</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{bookingData.selectedSeats.join(', ')}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Fare per seat:</span>
                  <span className="font-medium">${bookingData.fare}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Number of seats:</span>
                  <span className="font-medium">{bookingData.selectedSeats.length}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">${totalFare}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleCreateBooking}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
