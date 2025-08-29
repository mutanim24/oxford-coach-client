import React from 'react';

/**
 * Reusable button component
 * @param {object} props - Component props
 * @param {string} props.text - Button text
 * @param {function} props.onClick - Click handler function
 * @param {string} props.type - Button type (submit, button, etc.)
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({ text, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      className={`${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
