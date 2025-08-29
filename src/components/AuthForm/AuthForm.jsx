import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';

/**
 * Authentication form component for both login and registration
 * @param {object} props - Component props
 * @param {string} props.formType - Type of form ('register' or 'login')
 * @param {function} props.handleSubmit - Form submit handler
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Input change handler
 * @param {boolean} props.loading - Loading state
 */
const AuthForm = ({ formType, handleSubmit, formData, handleInputChange, loading }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-auto">
      <h2 className="text-center text-2xl mb-8 text-green-600 font-bold">
        {formType === 'register' ? 'Create Account' : 'Login'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <Input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            label="Full Name"
            required={formType === 'register'}
          />
        )}
        
        <Input
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          label="Email"
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password || ''}
          onChange={handleInputChange}
          label="Password"
          required
        />
        
        <div className="mt-8">
          <Button
            text={formType === 'register' ? 'Register' : 'Login'}
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg w-full font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          />
        </div>
      </form>
      
      <div className="my-6 border-t border-gray-200 pt-6">
        <p className="text-center text-gray-500 mb-4">OR</p>
        
        <div className="flex flex-col gap-3">
          <Button
            text="Login with Google"
            type="button"
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 w-full py-3 rounded-lg transition-colors"
            onClick={() => console.log('Google login clicked')}
          />
          <Button
            text="Login with Facebook"
            type="button"
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 w-full py-3 rounded-lg transition-colors"
            onClick={() => console.log('Facebook login clicked')}
          />
        </div>
      </div>
      
      {formType === 'register' ? (
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Login here
          </a>
        </p>
      ) : (
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-green-600 hover:text-green-700 font-medium">
            Register here
          </a>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
