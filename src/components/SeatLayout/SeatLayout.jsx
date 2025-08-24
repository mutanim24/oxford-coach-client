import React from "react";

const SeatLayout = ({ totalSeats, bookedSeats, selectedSeats, onSeatSelect }) => {
  // Generate seats with A and B prefixes (20 left, 20 right for total 40)
  const generateSeats = () => {
    const seats = [];
    const seatsPerRow = 4; // 2 left + walkway + 2 right
    const rows = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 1; row <= rows; row++) {
      // Left side seats (A prefix)
      const leftSeat1 = (row - 1) * 2 + 1;
      const leftSeat2 = (row - 1) * 2 + 2;

      if (leftSeat1 <= totalSeats / 2) {
        seats.push({
          id: `A${leftSeat1}`,
          number: `A${leftSeat1}`,
          row,
          side: "left",
          position: 1
        });
      }

      if (leftSeat2 <= totalSeats / 2) {
        seats.push({
          id: `A${leftSeat2}`,
          number: `A${leftSeat2}`,
          row,
          side: "left",
          position: 2
        });
      }

      // Right side seats (B prefix)
      const rightSeat1 = (row - 1) * 2 + 1;
      const rightSeat2 = (row - 1) * 2 + 2;

      if (rightSeat1 <= totalSeats / 2) {
        seats.push({
          id: `B${rightSeat1}`,
          number: `B${rightSeat1}`,
          row,
          side: "right",
          position: 1
        });
      }

      if (rightSeat2 <= totalSeats / 2) {
        seats.push({
          id: `B${rightSeat2}`,
          number: `B${rightSeat2}`,
          row,
          side: "right",
          position: 2
        });
      }
    }

    return seats;
  };

  const seats = generateSeats();

  // Check if a seat is booked
  const isSeatBooked = (seatNumber) => bookedSeats.includes(seatNumber);

  // Check if a seat is selected
  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);

  // Handle seat click
  const handleSeatClick = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return;
    onSeatSelect(seatNumber);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Select Your Seats
      </h2>

      {/* Seat capacity indicator */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Seat Capacity: <span className="font-bold">{totalSeats}</span>
          </div>
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="text-green-600 font-medium">Available:</span>
              <span className="font-bold ml-1">{totalSeats - bookedSeats.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-red-600 font-medium">Booked:</span>
              <span className="font-bold ml-1">{bookedSeats.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 md:p-8">
        {/* Bus representation */}
        <div className="mb-8 text-center">
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-6 rounded-lg mx-auto w-4/5 mb-3 shadow-inner"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 rounded">
              DRIVER
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Bus</p>
        </div>

        {/* Seat grid */}
        <div className="space-y-4">
          {Array.from({ length: Math.ceil(totalSeats / 4) }).map((_, rowIndex) => {
            const rowSeats = seats.filter((seat) => seat.row === rowIndex + 1);

            return (
              <div
                key={rowIndex}
                className="flex justify-center items-center space-x-4 md:space-x-8"
              >
                {/* Left side seats */}
                {rowSeats
                  .filter((seat) => seat.side === "left")
                  .map((seat) => (
                    <div
                      key={seat.id}
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                        isSeatBooked(seat.number)
                          ? "bg-red-50 border-red-300 text-red-600 cursor-not-allowed"
                          : isSeatSelected(seat.number)
                          ? "bg-blue-500 border-blue-600 text-white shadow-lg"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSeatClick(seat.number)}
                    >
                      <div className="text-lg font-bold">{seat.number}</div>
                    </div>
                  ))}

                {/* Walkway */}
                <div className="w-8 md:w-12 flex items-center justify-center">
                  <div className="w-1 h-full bg-gray-300 rounded-full"></div>
                </div>

                {/* Right side seats */}
                {rowSeats
                  .filter((seat) => seat.side === "right")
                  .map((seat) => (
                    <div
                      key={seat.id}
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                        isSeatBooked(seat.number)
                          ? "bg-red-50 border-red-300 text-red-600 cursor-not-allowed"
                          : isSeatSelected(seat.number)
                          ? "bg-blue-500 border-blue-600 text-white shadow-lg"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSeatClick(seat.number)}
                    >
                      <div className="text-lg font-bold">{seat.number}</div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-lg mr-3 flex items-center justify-center">
              <div className="text-sm font-medium text-gray-700">A1</div>
            </div>
            <span className="text-sm font-medium text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 border-2 border-blue-600 rounded-lg mr-3 flex items-center justify-center">
              <div className="text-sm font-medium text-white">A1</div>
            </div>
            <span className="text-sm font-medium text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 border-2 border-red-300 rounded-lg mr-3 flex items-center justify-center">
              <div className="text-sm font-medium text-red-600">A1</div>
            </div>
            <span className="text-sm font-medium text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
