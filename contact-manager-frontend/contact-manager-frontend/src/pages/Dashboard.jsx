import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContactContext } from '../context/ContactContext';
import { GroupContext } from '../context/GroupContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { FiPlus, FiUsers, FiTag, FiPieChart } from 'react-icons/fi';

const Dashboard = () => {
  const { contacts = [], loading: contactsLoading } = useContext(ContactContext);
  const { groups = [], loading: groupsLoading } = useContext(GroupContext);
  
  // Ensure contacts and groups are arrays
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  const getGroupContactCounts = () => {
    return safeGroups.map(group => {
      const count = safeContacts.filter(contact => 
        contact.groups && Array.isArray(contact.groups) && contact.groups.includes(group._id)
      ).length;
      
      return {
        ...group,
        contactCount: count
      };
    });
  };
  
  const getRecentContacts = () => {
    // Sort by creation date and get top 5
    return [...safeContacts]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  };
  
  if (contactsLoading || groupsLoading) return <Loader />;
  
  const groupStats = getGroupContactCounts();
  const recentContacts = getRecentContacts();
  const ungroupedCount = safeContacts.filter(c => !c.groups || !Array.isArray(c.groups) || c.groups.length === 0).length;
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon contact-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{safeContacts.length}</h3>
            <p className="stat-label">Total Contacts</p>
          </div>
          <Link to="/contacts" className="stat-link">View all</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon group-icon">
            <FiTag />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{safeGroups.length}</h3>
            <p className="stat-label">Groups</p>
          </div>
          <Link to="/groups" className="stat-link">View all</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon ungrouped-icon">
            <FiPieChart />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{ungroupedCount}</h3>
            <p className="stat-label">Ungrouped Contacts</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Recent Contacts</h2>
              <Link to="/contacts/new" className="card-action">
                <FiPlus /> Add
              </Link>
            </div>
            {recentContacts.length === 0 ? (
              <div className="empty-list">
                <p>No contacts yet. Add your first contact to get started.</p>
                <Button to="/contacts/new" variant="primary">Add Contact</Button>
              </div>
            ) : (
              <ul className="recent-contacts-list">
                {recentContacts.map(contact => (
                  <li key={contact._id} className="recent-contact-item">
                    <Link to={`/contacts/${contact._id}`} className="recent-contact-link">
                      <span className="contact-name">
                        {contact.firstName || ''} {contact.lastName || ''}
                      </span>
                      {contact.email && (
                        <span className="contact-email">{contact.email}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="dashboard-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Groups</h2>
              <Link to="/groups/new" className="card-action">
                <FiPlus /> Add
              </Link>
            </div>
            {groupStats.length === 0 ? (
              <div className="empty-list">
                <p>No groups yet. Create a group to organize your contacts.</p>
                <Button to="/groups/new" variant="primary">Create Group</Button>
              </div>
            ) : (
              <ul className="group-stats-list">
                {groupStats.map(group => (
                  <li key={group._id} className="group-stats-item">
                    <Link 
                      to="/contacts" 
                      onClick={() => {
                        // You'll need to handle this in the Contacts page
                        localStorage.setItem('selectedGroupFilter', group._id);
                      }}
                      className="group-stats-link"
                    >
                      <div 
                        className="group-color" 
                        style={{ backgroundColor: group.color || '#e0e0e0' }}
                      />
                      <span className="group-name">{group.name}</span>
                      <span className="group-count">{group.contactCount} contacts</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;