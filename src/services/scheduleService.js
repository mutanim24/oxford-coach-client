import axios from 'axios';

const API_URL = '/api/schedules';

// Get all schedules for a specific bus
const getSchedulesByBusId = async (busId) => {
  const token = localStorage.getItem('token');
  console.log('Fetching schedules for bus:', busId, 'with token:', token ? 'present' : 'missing');
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  console.log('API URL:', `${API_URL}/bus/${busId}`);
  console.log('Request config:', config);
  
  try {
    const response = await axios.get(`${API_URL}/bus/${busId}`, config);
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
  const token = localStorage.getItem('token');
  console.log('Creating schedule with token:', token ? 'present' : 'missing');
  console.log('Schedule data:', scheduleData);
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  console.log('API URL:', API_URL);
  console.log('Request config:', config);
  
  try {
    const response = await axios.post(API_URL, scheduleData, config);
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
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.put(`${API_URL}/${scheduleId}`, scheduleData, config);
  return response.data;
};

// Delete a schedule
const deleteSchedule = async (scheduleId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/${scheduleId}`, config);
  return response.data;
};

// Get schedule details by ID
const getScheduleById = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
};

// Get all schedules
const getAllSchedules = async () => {
  const token = localStorage.getItem('token');
  console.log('Fetching all schedules with token:', token ? 'present' : 'missing');
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  console.log('API URL:', API_URL);
  console.log('Request config:', config);
  
  try {
    const response = await axios.get(API_URL, config);
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
