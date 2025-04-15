import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GroupContext } from '../../context/GroupContext';
import { ContactContext } from '../../context/ContactContext';
import Loader from '../common/Loader';
import Button from '../common/Button';
import { FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';

const GroupList = () => {
  const { groups = [], removeGroup, loading, error } = useContext(GroupContext);
  const { contacts = [], filterContactsByGroup } = useContext(ContactContext);
  
  // Ensure groups and contacts are arrays
  const safeGroups = Array.isArray(groups) ? groups : [];
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the group "${name}"? This won't delete the contacts in this group.`)) {
      removeGroup(id);
    }
  };
  
  const getContactCount = (groupId) => {
    return safeContacts.filter(contact => 
      contact.groups && Array.isArray(contact.groups) && contact.groups.includes(groupId)
    ).length;
  };
  
  const handleGroupClick = (groupId) => {
    filterContactsByGroup(groupId);
  };
  
  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="group-list-container">
      {safeGroups.length === 0 ? (
        <div className="empty-state">
          <p>No groups found. Create a group to categorize your contacts.</p>
          <Button to="/groups/new" variant="primary">Create Group</Button>
        </div>
      ) : (
        <div className="group-list">
          {safeGroups.map(group => (
            <div key={group._id} className="group-card">
              <div 
                className="group-color-indicator" 
                style={{ backgroundColor: group.color || '#e0e0e0' }}
              />
              <div className="group-info">
                <h3 className="group-name">{group.name}</h3>
                {group.description && (
                  <p className="group-description">{group.description}</p>
                )}
                <div className="group-meta">
                  <span className="contact-count">
                    <FiUsers /> {getContactCount(group._id)} contacts
                  </span>
                </div>
              </div>
              <div className="group-actions">
                <Link 
                  to="/contacts" 
                  className="action-btn view"
                  onClick={() => handleGroupClick(group._id)}
                >
                  View Contacts
                </Link>
                <Link to={`/groups/edit/${group._id}`} className="action-btn edit">
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete(group._id, group.name)} 
                  className="action-btn delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;