import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContactContext } from '../../context/ContactContext';
import { GroupContext } from '../../context/GroupContext';
import Avatar from '../common/Avatar';
import { formatPhoneNumber } from '../../utils/formatters';

const ContactCard = ({ contact }) => {
  const { removeContact } = useContext(ContactContext);
  const { groups = [] } = useContext(GroupContext);
  
  // Ensure contact and groups are properly handled
  if (!contact) {
    return null; // Don't render if no contact
  }
  
  // Ensure groups is an array
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  const contactGroups = safeGroups.filter(group => 
    contact.groups && Array.isArray(contact.groups) && contact.groups.includes(group._id)
  );

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      removeContact(contact._id);
    }
  };

  return (
    <div className="contact-card">
      <div className="contact-card-header">
        <Avatar 
          name={`${contact.firstName || ''} ${contact.lastName || ''}`} 
          src={contact.photo} 
          size="medium" 
        />
        <div className="contact-info">
        <h3>
  {contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`}
</h3>          {contact.email && <p className="contact-email">{contact.email}</p>}
          {contact.phoneNumber && <p className="contact-phone">{formatPhoneNumber(contact.phoneNumber)}</p>}
        </div>
      </div>
      
      {contactGroups.length > 0 && (
        <div className="contact-groups">
          {contactGroups.map(group => (
            <span 
              key={group._id} 
              className="group-tag" 
              style={{ backgroundColor: group.color || '#e0e0e0' }}
            >
              {group.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="contact-card-actions">
        <Link to={`/contacts/${contact._id}`} className="action-btn view">View</Link>
        <Link to={`/contacts/edit/${contact._id}`} className="action-btn edit">Edit</Link>
        <button onClick={handleDelete} className="action-btn delete">Delete</button>
      </div>
    </div>
  );
};

export default ContactCard;