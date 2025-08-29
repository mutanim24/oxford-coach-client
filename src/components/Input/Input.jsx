import React from 'react';

/**
 * Reusable input field component
 * @param {object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler function
 * @param {string} props.name - Input name
 * @param {string} props.label - Label text (optional)
 */
const Input = ({ type, placeholder, value, onChange, name, label }) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-gray-800 text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500"
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </div>
  );
};

export default Input;
