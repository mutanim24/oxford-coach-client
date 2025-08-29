import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
      // Call the register function which now returns response data
      const result = await register(formData);
      
      if (result.success) {
        // Registration successful, redirect based on user role
        const user = result.user || JSON.parse(localStorage.getItem('user'));
        
        if (user && user.role === 'admin') {
          // Redirect admin users to admin dashboard
          navigate('/admin', { replace: true });
        } else {
          // Redirect regular users to login
          alert('Registration successful! Please log in.');
          navigate('/login');
        }
      } else {
        // Registration failed
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
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
