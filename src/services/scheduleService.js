import api from './api';

const API_URL = '/schedules';

// Get all schedules for a specific bus
const getSchedulesByBusId = async (busId) => {
  console.log('Fetching schedules for bus:', busId);
  
  try {
    const response = await api.get(`${API_URL}/bus/${busId}`);
    console.log('Schedules fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Create a new schedule
const createSchedule = async (scheduleData) => {
  console.log('Creating schedule with data:', scheduleData);
  
  try {
    const response = await api.post(API_URL, scheduleData);
    console.log('Schedule created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Update a schedule
const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(`${API_URL}/${scheduleId}`, scheduleData);
  return response.data;
};

// Delete a schedule
const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`${API_URL}/${scheduleId}`);
  return response.data;
};

// Get schedule details by ID
const getScheduleById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

// Get all schedules
const getAllSchedules = async () => {
  console.log('Fetching all schedules');
  
  try {
    const response = await api.get(API_URL);
    console.log('All schedules fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

const scheduleService = {
  getSchedulesByBusId,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleById,
  getAllSchedules
};

export default scheduleService;
