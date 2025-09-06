import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiTruck, FiUsers, FiAlertTriangle } from 'react-icons/fi';
// Your existing services and components
import busService from '../services/busService';
import BusForm from '../components/BusForm/BusForm';
import Toast from '../components/Toast/Toast';

// All your original logic, state, and functions are preserved.
const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBusForm, setShowBusForm] = useState(false);
  const [editingBusId, setEditingBusId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await busService.getBuses();
      setBuses(data || []);
    } catch (err) {
      setError('Failed to fetch buses. Please try again later.');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleFormSuccess = () => {
    fetchBuses();
    setToast({ show: true, message: 'Bus saved successfully!', type: 'success' });
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busService.deleteBus(id);
        fetchBuses();
        setToast({ show: true, message: 'Bus deleted successfully!', type: 'success' });
      } catch (err) {
        setToast({ show: true, message: 'Failed to delete bus. It may have active schedules.', type: 'error' });
      }
    }
  };

  const handleEditBus = (id) => {
    setEditingBusId(id);
    setShowBusForm(true);
  };
  const handleAddBus = () => {
    setEditingBusId(null);
    setShowBusForm(true);
  };
  const handleCloseForm = () => {
    setShowBusForm(false);
    setEditingBusId(null);
  };
  const closeToast = () => setToast({ ...toast, show: false });

  // --- New UI Components ---
  const BusCard = ({ bus }) => (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-500">{bus.operator}</p>
            <h3 className="text-2xl font-bold text-gray-800">{bus.name}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><FiTruck className="text-gray-400" /> <span>{bus.busType}</span></div>
          <div className="flex items-center gap-2"><FiUsers className="text-gray-400" /> <span>{bus.totalSeats} Seats</span></div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
           <button onClick={() => handleEditBus(bus._id)} title="Edit Bus" className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors"><FiEdit /></button>
           <button onClick={() => handleDeleteBus(bus._id)} title="Delete Bus" className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"><FiTrash2 /></button>
        </div>
        <Link
          to={`/admin/schedules/${bus._id}`}
          className="flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors shadow-md"
        >
          <FiCalendar /> Manage Schedules
        </Link>
      </div>
    </motion.div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Manage Buses</h1>
          <p className="mt-1 text-lg text-gray-500">Add, edit, and manage your fleet of buses.</p>
        </div>
        <motion.button
          onClick={handleAddBus}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:bg-green-700 transition-all"
        >
          <FiPlus /> Add New Bus
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center gap-3"><FiAlertTriangle /> {error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <AnimatePresence>
          {buses.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white rounded-xl shadow-lg p-12">
              <FiTruck className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-2xl font-bold text-gray-800">No Buses Found</h3>
              <p className="mt-2 text-gray-500">Your fleet is empty. Get started by adding your first bus.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {buses.map((bus) => <BusCard key={bus._id} bus={bus} />)}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showBusForm && (
          <BusForm
            busId={editingBusId}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>
      
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