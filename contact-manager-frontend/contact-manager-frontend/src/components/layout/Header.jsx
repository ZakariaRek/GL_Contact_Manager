import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📇</span>
          <span className="logo-text">Contact Manager</span>
        </Link>
        
        <div className="header-actions">
          <div className="add-dropdown">
            <button className="add-btn">
              <FiPlus />
              <span>Add New</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/contacts/new" className="dropdown-item">Contact</Link>
              <Link to="/groups/new" className="dropdown-item">Group</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;