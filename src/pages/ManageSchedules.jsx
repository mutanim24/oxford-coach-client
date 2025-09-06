import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiClock, FiDollarSign, FiArrowRight, FiFileText, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
// Your existing services and components
import scheduleService from '../services/scheduleService';
import busService from '../services/busService';
import ScheduleForm from '../components/ScheduleForm/ScheduleForm';

// All your original logic, state, and functions are preserved.
const ManageSchedules = () => {
  const { busId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [busName, setBusName] = useState('');

  useEffect(() => {
    const fetchAllBuses = async () => {
      try {
        const buses = await busService.getBuses();
        setAllBuses(buses || []);
      } catch (err) { console.error('Error fetching buses:', err); }
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
    const fetchSchedulesAndBus = async () => {
      try {
        setLoading(true);
        setError(null);
        const [scheduleResponse, busResponse] = await Promise.all([
            scheduleService.getSchedulesByBusId(busId),
            busService.getBusById(busId)
        ]);
        setSchedules(scheduleResponse.schedules || []);
        if (busResponse) {
            setBusName(busResponse.name || busResponse.operator || 'Bus');
        }
      } catch (err) {
        setError('Failed to fetch schedules. Please ensure you have permission and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedulesAndBus();
  }, [busId]);

  const handleFormSuccess = () => {
    // Re-fetch schedules after a successful form submission
    const fetchUpdatedSchedules = async () => {
      try {
        const response = await scheduleService.getSchedulesByBusId(busId);
        setSchedules(response.schedules || []);
      } catch (err) {
        toast.error('Failed to refresh schedule list.');
      }
    };
    fetchUpdatedSchedules();
  };
  
  const handleAddSchedule = async (scheduleData) => {
    try {
        await scheduleService.createSchedule(scheduleData);
        handleFormSuccess();
        toast.success('Schedule created successfully!');
        closeModal();
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create schedule.');
        throw err; // Re-throw to keep the modal open on error
    }
  };

  const handleUpdateSchedule = async (scheduleData) => {
    try {
      await scheduleService.updateSchedule(editingSchedule._id, scheduleData);
      handleFormSuccess();
      toast.success('Schedule updated successfully!');
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update schedule.');
      throw err; // Re-throw to keep the modal open on error
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule? This may affect existing bookings.')) {
      try {
        await scheduleService.deleteSchedule(scheduleId);
        setSchedules(prev => prev.filter(s => s._id !== scheduleId));
        toast.success('Schedule deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete schedule.');
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
    
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // --- New UI Components ---
  const ScheduleCard = ({ schedule }) => (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-t-4 border-green-500 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center text-center">
          <span>{schedule.source}</span>
          <FiArrowRight className="mx-4 text-gray-400 flex-shrink-0" />
          <span>{schedule.destination}</span>
        </h3>
        <div className="border-t my-4"></div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><FiCalendar className="text-gray-400" /> <span>{formatDate(schedule.departureTime)}</span></div>
          <div className="flex items-center gap-2"><FiClock className="text-gray-400" /> <span>{formatTime(schedule.departureTime)}</span></div>
          <div className="flex items-center gap-2 col-span-2"><FiDollarSign className="text-gray-400" /> <span className="font-semibold text-lg text-green-600">${schedule.fare.toFixed(2)}</span></div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 flex justify-end gap-3">
        <button onClick={() => openEditModal(schedule)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"><FiEdit /> Edit</button>
        <button onClick={() => handleDeleteSchedule(schedule._id)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"><FiTrash2 /> Delete</button>
      </div>
    </motion.div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-full mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Manage Schedules</h1>
          <p className="mt-1 text-lg text-gray-500">
            Current schedules for <span className="font-semibold text-green-600">{busName || '...'}</span>
          </p>
        </div>
        <div className='flex items-center gap-4'>
             <Link to="/admin/buses" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                <FiArrowLeft /> Back to Buses
            </Link>
            <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:bg-green-700 transition-all"
            >
                <FiPlus /> Add Schedule
            </motion.button>
        </div>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center gap-3"><FiAlertTriangle /> {error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : schedules.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white rounded-xl shadow-lg p-12">
          <FiFileText className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-2xl font-bold text-gray-800">No Schedules Found</h3>
          <p className="mt-2 text-gray-500">There are currently no schedules for this bus. Get started by adding one.</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {schedules.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
        </motion.div>
      )}
      
      <AnimatePresence>
        {isModalOpen && (
          <ScheduleForm
            initialData={editingSchedule}
            onSubmit={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
            onClose={closeModal}
            busId={busId}
            allBuses={allBuses}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSchedules;