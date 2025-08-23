import React from 'react';

const SeatLayout = ({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) => {
  // Generate an array of seat numbers from 1 to totalSeats
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  
  // Check if a seat is booked
  const isSeatBooked = (seatNumber) => bookedSeats.includes(seatNumber);
  
  // Check if a seat is selected
  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);
  
  // Handle seat click
  const handleSeatClick = (seatNumber) => {
    if (!isSeatBooked(seatNumber)) {
      onSeatSelect(seatNumber);
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Seat Layout</h2>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        {/* Bus representation */}
        <div className="mb-6 text-center">
          <div className="bg-gray-300 h-4 rounded mx-auto w-3/4 mb-2"></div>
          <p className="text-sm text-gray-600">Bus</p>
        </div>
        
        {/* Seat grid */}
        <div className="grid grid-cols-4 gap-3">
          {seats.map((seatNumber) => (
            <div 
              key={seatNumber}
              className={`flex items-center justify-center h-12 rounded-lg border-2 font-medium cursor-pointer ${
                isSeatBooked(seatNumber) 
                  ? 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed' 
                  : isSeatSelected(seatNumber)
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200'
              }`}
              onClick={() => handleSeatClick(seatNumber)}
            >
              {seatNumber}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
