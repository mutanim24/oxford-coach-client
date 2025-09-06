import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import scheduleService from '../services/scheduleService';
import busService from '../services/busService';
import ScheduleForm from '../components/ScheduleForm/ScheduleForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageSchedules = () => {
  const { busId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [busName, setBusName] = useState('');

  // Fetch all buses when component mounts
  useEffect(() => {
    const fetchAllBuses = async () => {
      try {
        const buses = await busService.getBuses();
        setAllBuses(buses || []);
      } catch (err) {
        console.error('Error fetching buses:', err);
      }
    };

    fetchAllBuses();
  }, []);

  useEffect(() => {
    if (!busId) {
      setLoading(false);
      setSchedules([]);
      setBusName('');
      return;
    }

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await scheduleService.getSchedulesByBusId(busId);
        setSchedules(response.schedules || []);
        
        // Get bus name for display
        if (response.schedules && response.schedules.length > 0) {
          setBusName(response.schedules[0].bus?.name || response.schedules[0].bus?.operator || 'Unknown Bus');
        } else {
          // Try to get bus name from busId
          try {
            const bus = await busService.getBusById(busId);
            if (bus) {
              setBusName(bus.name || bus.operator || 'Unknown Bus');
            }
          } catch (busErr) {
            console.error('Error fetching bus details:', busErr);
          }
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        
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

    fetchSchedules();
  }, [busId]);

  const handleAddSchedule = async (scheduleData) => {
    console.log('handleAddSchedule called with:', scheduleData);
    
    try {
      // Create the new schedule
      console.log('Creating schedule...');
      const response = await scheduleService.createSchedule(scheduleData);
      console.log('Schedule created successfully:', response);
      
      // Close the "Add Schedule" modal
      setIsModalOpen(false);
      
      // Refresh the list of schedules displayed on the page so the new entry appears
      if (busId) {
        console.log('Fetching updated schedules...');
        setLoading(true); // Show loading state while fetching
        try {
          const updatedResponse = await scheduleService.getSchedulesByBusId(busId);
          console.log('Updated schedules:', updatedResponse);
          setSchedules(updatedResponse.schedules || []);
          
          // Update bus name if needed
          if (updatedResponse.schedules && updatedResponse.schedules.length > 0) {
            setBusName(updatedResponse.schedules[0].bus?.name || updatedResponse.schedules[0].bus?.operator || 'Unknown Bus');
          }
        } catch (fetchError) {
          console.error('Error fetching updated schedules:', fetchError);
          // Keep the current schedules list but show error
          toast.error('Schedule created but failed to refresh list. Please refresh the page.');
        } finally {
          setLoading(false);
        }
      }
      
      // Show a success notification
      toast.success('Schedule created successfully!');
    } catch (err) {
      // Log the error to the console
      console.error('Error creating schedule:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        toast.error('Please log in to create schedules.');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      // Handle admin privilege errors
      if (err.response && err.response.status === 403) {
        toast.error('You do not have permission to create schedules. Please contact an administrator.');
        return;
      }
      
      // Show a generic error notification
      toast.error('Failed to create schedule. Please try again.');
    }
  };

  const handleUpdateSchedule = async (scheduleData) => {
    try {
      const response = await scheduleService.updateSchedule(editingSchedule._id, scheduleData);
      setSchedules(prev => 
        prev.map(schedule => 
          schedule._id === editingSchedule._id ? response.schedule : schedule
        )
      );
      toast.success('Schedule updated successfully!');
    } catch (err) {
      console.error('Error updating schedule:', err);
      
      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        toast.error('Please log in to update schedules.');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      // Handle admin privilege errors
      if (err.response && err.response.status === 403) {
        toast.error('You do not have permission to update schedules. Please contact an administrator.');
        return;
      }
      
      // Show a generic error notification
      toast.error('Failed to update schedule. Please try again.');
      throw err;
    }
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

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Schedules</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Schedule List for {busName}
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add New Schedule
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No schedules found for this bus.</p>
            <p className="mt-2">Click "Add New Schedule" to create one.</p>
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
                        onClick={() => openEditModal(schedule)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                      >
                        Edit
                      </button>
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
      
      {isModalOpen && (
        <ScheduleForm
          initialData={editingSchedule}
          onSubmit={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
          onClose={closeModal}
          busId={busId}
          allBuses={allBuses}
        />
      )}
    </div>
  );
};

export default ManageSchedules;
