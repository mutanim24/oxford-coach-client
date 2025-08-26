import React, { useState, useEffect } from 'react';
import scheduleService from '../services/scheduleService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all schedules when component mounts
  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await scheduleService.getAllSchedules();
        setSchedules(response.schedules || []);
      } catch (err) {
        console.error('Error fetching all schedules:', err);
        
        // Handle authentication errors
        if (err.response && err.response.status === 401) {
          setError('Please log in to view schedules.');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }
        
        // Handle admin privilege errors
        if (err.response && err.response.status === 403) {
          setError('You do not have permission to view schedules. Please contact an administrator.');
          return;
        }
        
        // Handle other errors
        setError('Failed to fetch schedules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllSchedules();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRoute = (schedule) => {
    return `${schedule.source} → ${schedule.destination}`;
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.deleteSchedule(scheduleId);
        setSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
        toast.success('Schedule deleted successfully!');
      } catch (err) {
        console.error('Error deleting schedule:', err);
        
        // Handle authentication errors
        if (err.response && err.response.status === 401) {
          toast.error('Please log in to delete schedules.');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }
        
        // Handle admin privilege errors
        if (err.response && err.response.status === 403) {
          toast.error('You do not have permission to delete schedules. Please contact an administrator.');
          return;
        }
        
        // Handle other errors
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error('Failed to delete schedule. This schedule may have existing bookings.');
        }
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Schedules</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Complete Schedule List
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No schedules found.</p>
            <p className="mt-2">Please check back later or add new schedules.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.bus?.name || schedule.bus?.operator || 'Unknown Bus'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.bus?.operator || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.bus?.busType || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatRoute(schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(schedule.departureTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${schedule.fare.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteSchedule(schedule._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSchedules;
