import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiSearch, FiTrash2, FiArrowRight, FiDollarSign, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Your existing service
import scheduleService from '../services/scheduleService';

// All your original logic is preserved and enhanced with filtering.
const AllSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [busTypeFilter, setBusTypeFilter] = useState('all');

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await scheduleService.getAllSchedules();
        setSchedules(response.schedules || []);
      } catch (err) {
        setError('Failed to fetch schedules. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllSchedules();
  }, []);

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.deleteSchedule(scheduleId);
        setSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
        toast.success('Schedule deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete schedule.');
      }
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules
      .filter(schedule => {
        if (busTypeFilter === 'all') return true;
        return schedule.bus?.busType === busTypeFilter;
      })
      .filter(schedule => {
        const search = searchTerm.toLowerCase();
        return (
          schedule.bus?.name?.toLowerCase().includes(search) ||
          schedule.bus?.operator?.toLowerCase().includes(search) ||
          schedule.source.toLowerCase().includes(search) ||
          schedule.destination.toLowerCase().includes(search)
        );
      });
  }, [schedules, searchTerm, busTypeFilter]);

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // --- New UI Components ---
  const tableContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const ScheduleTableRow = ({ schedule }) => (
    <motion.tr variants={tableRowVariants} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{schedule.bus?.name || schedule.bus?.operator}</div>
        <div className="text-sm text-gray-500">{schedule.bus?.operator}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.bus?.busType === 'AC' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
            {schedule.bus?.busType || 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
        <div className="flex items-center">
          <span>{schedule.source}</span>
          <FiArrowRight className="mx-2 text-gray-400" />
          <span>{schedule.destination}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(schedule.departureTime)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">${schedule.fare.toFixed(2)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => handleDeleteSchedule(schedule._id)} title="Delete Schedule" className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"><FiTrash2 size={18} /></button>
      </td>
    </motion.tr>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Schedules</h1>
          <p className="mt-1 text-lg text-gray-500">A complete overview of every scheduled trip.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by bus, operator, or route..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <select value={busTypeFilter} onChange={(e) => setBusTypeFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="all">All Bus Types</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center p-12 text-gray-500"><FiLoader className="h-8 w-8 mx-auto animate-spin mb-4" /><p>Loading all schedules...</p></div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md flex items-center gap-4"><FiAlertTriangle className="h-8 w-8" /><p>{error}</p></div>
      ) : (
        <motion.div layout className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <motion.tbody variants={tableContainerVariants} initial="hidden" animate="visible" className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredSchedules.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500"><FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-4" /><h3 className="text-lg font-medium">No Schedules Found</h3><p>No schedules match your current search and filter criteria.</p></td></tr>
                  ) : (
                    filteredSchedules.map((schedule) => <ScheduleTableRow key={schedule._id} schedule={schedule} />)
                  )}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllSchedules;