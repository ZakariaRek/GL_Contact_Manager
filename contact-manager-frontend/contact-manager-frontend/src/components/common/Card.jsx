import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  actions, 
  className = '',
  padding = true,
  shadow = true,
  border = true
}) => {
  const cardClasses = `
    card 
    ${padding ? 'card-padded' : ''} 
    ${shadow ? 'card-shadow' : ''} 
    ${border ? 'card-border' : ''} 
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {(title || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;