import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiUsers, FiTag, FiHome, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiHome className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers className="nav-icon" />
              <span>Contacts</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/groups" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiTag className="nav-icon" />
              <span>Groups</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiSettings className="nav-icon" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;