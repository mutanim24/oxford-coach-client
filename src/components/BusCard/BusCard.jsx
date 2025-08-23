import React from 'react';
import { useNavigate } from 'react-router-dom';

const BusCard = ({ schedule }) => {
  const navigate = useNavigate();

  const handleViewSeats = () => {
    navigate(`/bus/${schedule._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {schedule.bus?.name || schedule.bus?.operator || 'Bus Operator'}
            </h3>
            <p className="text-gray-600">{schedule.bus?.busType || 'Bus Type'}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Available
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{schedule.source}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{schedule.destination}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Departure:</span>
            <span className="font-medium">{new Date(schedule.departureTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Fare:</span>
            <span className="font-medium">${schedule.fare}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">
            ${schedule.fare}
          </span>
          <button 
            onClick={handleViewSeats}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Seats
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
