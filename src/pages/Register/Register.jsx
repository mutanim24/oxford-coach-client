import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm/AuthForm';

/**
 * Registration page component
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  /**
   * Handle input changes
   * @param {object} e - Event object
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   * @param {object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Form data being submitted:', formData);
    
    try {
      // Call the register function which now returns response data directly
      await register(formData);
      
      // Registration successful, show success message and navigate to login
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      // Handle specific error messages from the backend
      if (err.response && err.response.data && err.response.data.error) {
        const errorMessage = err.response.data.error;
        
        // Provide more user-friendly error messages
        if (errorMessage.includes('already exists')) {
          setError('An account with this email already exists. Please try a different email or login.');
        } else if (errorMessage.includes('password')) {
          setError('Password does not meet requirements. Please try again.');
        } else if (errorMessage.includes('email')) {
          setError('Please enter a valid email address.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <AuthForm
          formType="register"
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          loading={loading}
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
