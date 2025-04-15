
// src/components/common/Alert.jsx
import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

const Alert = ({ type = 'info', children, onClose, className = '' }) => {
  const alertClass = `alert alert-${type} ${className}`;
  
  const icons = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertCircle />,
    error: <FiXCircle />,
  };
  
  return (
    <div className={alertClass} role="alert">
      <div className="alert-icon">
        {icons[type] || icons.info}
      </div>
      <div className="alert-content">{children}</div>
      {onClose && (
        <button 
          type="button" 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
