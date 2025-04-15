import React from 'react';

const Loader = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = {
    small: 'loader-sm',
    medium: 'loader-md',
    large: 'loader-lg',
  }[size] || 'loader-md';
  
  const loaderContent = (
    <div className="loader-spinner"></div>
  );
  
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={`loader ${sizeClass}`}>
          {loaderContent}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`loader ${sizeClass}`}>
      {loaderContent}
    </div>
  );
};

export default Loader;
