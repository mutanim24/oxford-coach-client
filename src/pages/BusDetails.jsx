import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import scheduleService from '../services/scheduleService';
import SeatLayout from '../components/SeatLayout/SeatLayout';

const BusDetails = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  
  const [schedule, setSchedule] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await scheduleService.getScheduleById(scheduleId);
        setSchedule(response.schedule);
        setBookedSeats(response.bookedSeats);
      } catch (err) {
        console.error('Error fetching schedule details:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load schedule details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [scheduleId]);

  const handleBackToSearch = () => {
    navigate('/search-results');
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        // Remove seat if already selected
        return prev.filter(seat => seat !== seatNumber);
      } else {
        // Add seat if not selected
        return [...prev, seatNumber];
      }
    });
  };

  const { user } = useAuth();
  const location = useLocation();

  const handleProceedToBook = () => {
    if (selectedSeats.length === 0) {
      return; // Do nothing if no seats are selected
    }

    if (user) {
      // User is logged in, proceed to booking summary
      navigate('/booking-summary', { 
        state: { 
          scheduleId, 
          selectedSeats,
          fare: schedule.fare 
        } 
      });
    } else {
      // User is not logged in, redirect to login page
      navigate('/login', { 
        state: { from: location } 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedule details...</p>
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
            onClick={handleBackToSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-gray-400 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Schedule Not Found</h2>
          <p className="text-gray-600 mb-4">The requested schedule could not be found.</p>
          <button 
            onClick={handleBackToSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // Calculate total fare
  const totalFare = selectedSeats.length * schedule.fare;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={handleBackToSearch}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Search Results
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {schedule.source} → {schedule.destination}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-lg font-medium">Date & Time: {new Date(schedule.departureTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span className="text-lg font-medium">Price per Seat: ${schedule.fare}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Bus Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Bus Information</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Bus Name</p>
                  <p className="text-lg font-semibold text-gray-800">{schedule.bus.name || schedule.bus.operator}</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Operator</p>
                  <p className="text-lg font-semibold text-gray-800">{schedule.bus.operator}</p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Bus Type</p>
                  <p className="text-lg font-semibold text-gray-800">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      schedule.bus.busType === 'AC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.bus.busType}
                    </span>
                  </p>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Total Seats</p>
                  <p className="text-lg font-semibold text-gray-800">{schedule.bus.totalSeats}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-3">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {schedule.bus.amenities && schedule.bus.amenities.length > 0 ? (
                      schedule.bus.amenities.map((amenity, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No amenities listed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Seat Layout */}
          <div className="lg:col-span-2">
            <SeatLayout 
              totalSeats={schedule.bus.totalSeats} 
              bookedSeats={bookedSeats} 
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
            
            {/* Booking Summary */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>
              
              {selectedSeats.length > 0 ? (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Selected Seats:</span>
                    <span className="font-bold text-lg text-gray-800 bg-white px-3 py-1 rounded-lg">
                      {selectedSeats.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600 font-medium">Total Fare:</span>
                    <span className="text-3xl font-bold text-green-600">
                      ${totalFare}
                    </span>
                  </div>
                  <button 
                    onClick={handleProceedToBook}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Proceed to Book
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No seats selected</p>
                  <p className="text-gray-400">Please select at least one seat to proceed with booking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
