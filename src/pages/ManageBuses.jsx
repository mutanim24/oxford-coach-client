import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import busService from '../services/busService';
import BusForm from '../components/BusForm/BusForm';
import Toast from '../components/Toast/Toast';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBusForm, setShowBusForm] = useState(false);
  const [editingBusId, setEditingBusId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch buses from the API
  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await busService.getBuses();
      setBuses(data || []);
    } catch (err) {
      setError('Failed to fetch buses. Please try again later.');
      console.error('Error fetching buses:', err);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  // Load buses on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  // Handle form submission success
  const handleFormSuccess = () => {
    fetchBuses();
    setToast({ show: true, message: 'Bus saved successfully!', type: 'success' });
  };

  // Handle delete bus
  const handleDeleteBus = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busService.deleteBus(id);
        fetchBuses();
        setToast({ show: true, message: 'Bus deleted successfully!', type: 'success' });
      } catch (err) {
        setError('Failed to delete bus');
        setToast({ show: true, message: 'Failed to delete bus', type: 'error' });
        console.error(err);
      }
    }
  };

  // Handle edit bus
  const handleEditBus = (id) => {
    setEditingBusId(id);
    setShowBusForm(true);
  };

  // Handle add new bus
  const handleAddBus = () => {
    setEditingBusId(null);
    setShowBusForm(true);
  };

  // Close form and reset state
  const handleCloseForm = () => {
    setShowBusForm(false);
    setEditingBusId(null);
  };

  // Close toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Buses</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Bus List</h2>
          <button 
            onClick={handleAddBus}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Bus
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No buses found
                    </td>
                  </tr>
                ) : (
                  buses.map((bus) => (
                    <tr key={bus._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bus.name || bus.operator}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bus.operator}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bus.busType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bus.totalSeats}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/admin/schedules/${bus._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Manage Schedules
                        </Link>
                        <button
                          onClick={() => handleEditBus(bus._id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBus(bus._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showBusForm && (
        <BusForm
          busId={editingBusId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default ManageBuses;
