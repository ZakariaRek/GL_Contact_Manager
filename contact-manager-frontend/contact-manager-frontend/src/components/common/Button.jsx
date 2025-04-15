// src/components/common/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  onClick, 
  to, 
  type = 'button', 
  variant = 'primary', 
  icon,
  disabled = false,
  className = '',
  ...rest
}) => {
  const buttonClasses = `btn btn-${variant} ${className} ${disabled ? 'disabled' : ''}`;
  
  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </>
  );
  
  if (to) {
    return (
      <Link 
        to={to} 
        className={buttonClasses} 
        {...rest}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={buttonClasses} 
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;

// src/components/common/Avatar.jsx
