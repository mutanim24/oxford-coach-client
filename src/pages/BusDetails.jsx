import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const handleProceedToBook = () => {
    if (selectedSeats.length > 0) {
      // Navigate to booking page with selected seats
      navigate('/booking', { 
        state: { 
          scheduleId, 
          selectedSeats,
          fare: schedule.fare 
        } 
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {schedule.source} to {schedule.destination}
                </h1>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{new Date(schedule.departureTime).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-3xl font-bold text-green-600">
                  ${schedule.fare}
                </span>
                <span className="text-gray-600 ml-2">per seat</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bus Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Bus Name</p>
                  <p className="font-medium">{schedule.bus.name || schedule.bus.operator}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Operator</p>
                  <p className="font-medium">{schedule.bus.operator}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Bus Type</p>
                  <p className="font-medium">{schedule.bus.busType}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Total Seats</p>
                  <p className="font-medium">{schedule.bus.totalSeats}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {schedule.bus.amenities && schedule.bus.amenities.length > 0 ? (
                      schedule.bus.amenities.map((amenity, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
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

            <SeatLayout 
              totalSeats={schedule.bus.totalSeats} 
              bookedSeats={bookedSeats} 
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />

            {/* Booking Summary */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
              
              {selectedSeats.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Selected Seats:</span>
                    <span className="font-medium">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total Fare:</span>
                    <span className="text-xl font-bold text-green-600">${totalFare}</span>
                  </div>
                  <button 
                    onClick={handleProceedToBook}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Proceed to Book
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Please select at least one seat to proceed with booking.</p>
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
