import React from "react";
import QRCode from "react-qr-code"; // ✅ switched from qrcode.react to react-qr-code

const Ticket = ({ booking }) => {
  if (!booking) {
    return <div>Loading ticket...</div>;
  }

  // Format date and time
  const departureDateTime = booking.schedule?.departureTime
    ? new Date(booking.schedule.departureTime)
    : new Date();

  const formattedDate = departureDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = departureDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generate QR code value
  const qrValue = JSON.stringify({
    pnr: booking.pnrNumber,
    bookingId: booking._id,
    passenger: booking.user?.name,
    route: `${booking.schedule?.source} - ${booking.schedule?.destination}`,
    date: formattedDate,
    time: formattedTime,
    seats: booking.selectedSeats?.join(", "),
    bus: booking.bus?.name,
    operator: booking.bus?.operator,
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">OXFORD COACH</h1>
            <p className="text-sm opacity-90">Your Journey, Our Priority</p>
          </div>
          <div className="text-right">
            <p className="text-sm">PNR NUMBER</p>
            <p className="text-xl font-bold tracking-wider">{booking.pnrNumber}</p>
          </div>
        </div>
      </div>

      {/* Main Ticket Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Journey Details */}
          <div className="md:col-span-2">
            {/* Journey Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Journey Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-lg font-semibold">
                      {booking.schedule?.source || "N/A"}
                    </p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-0.5 bg-gray-300 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-1">{formattedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">To</p>
                    <p className="text-lg font-semibold">
                      {booking.schedule?.destination || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="text-lg font-semibold">{formattedTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Arrival</p>
                    <p className="text-lg font-semibold">--:--</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Passenger Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Passenger Name</p>
                    <p className="font-medium">{booking.user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{booking.user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Bus Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Bus Name</p>
                    <p className="font-medium">{booking.bus?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Operator</p>
                    <p className="font-medium">{booking.bus?.operator || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bus Type</p>
                    <p className="font-medium">{booking.bus?.busType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-medium">
                      {booking.selectedSeats?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code and Payment Info */}
          <div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Ticket QR Code
              </h2>
              <div className="flex justify-center">
                <QRCode
                  value={qrValue}
                  size={150}
                  className="border border-gray-300 rounded p-2 bg-white"
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Show this code at the boarding point
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{booking._id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium text-green-600">
                    ${booking.totalFare || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>Please arrive at the boarding point at least 30 minutes before departure time.</p>
        <p className="mt-1">This ticket is non-transferable and non-refundable.</p>
      </div>
    </div>
  );
};

export default Ticket;
