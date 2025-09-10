// Simple test script to check if backend is running
import axios from 'axios';

async function testBackend() {
  try {
    console.log('Testing backend connection...');

    // Test basic server response
    const response = await axios.get('https://oxford-coach-server.vercel.app/');
    console.log('Server response:', response.data);

    // Test schedules endpoint without auth (should fail)
    try {
      const schedulesResponse = await axios.get('https://oxford-coach-server.vercel.app/api/schedules');
      console.log('Schedules endpoint response:', schedulesResponse.data);
    } catch (authError) {
      console.log('Schedules endpoint requires authentication (expected):', authError.message);
    }

    console.log('Backend test completed successfully');
  } catch (error) {
    console.error('Backend test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure the backend server is running on port 5000');
    }
  }
}

testBackend();
