
import React, { useContext, useState } from 'react';
import { ContactContext } from '../../context/ContactContext';
import { GroupContext } from '../../context/GroupContext';
import ContactCard from './ContactCard';
import ContactSearch from './ContactSearch';
import Loader from '../common/Loader';
import Button from '../common/Button';
import GroupSelector from '../groups/GroupSelector';

const ContactList = () => {
  const { filteredContacts, loading, error, filterContactsByGroup } = useContext(ContactContext);
  const { groups } = useContext(GroupContext);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  
  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
    filterContactsByGroup(groupId);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  // Safety check to ensure filteredContacts is an array
  const contactsToDisplay = Array.isArray(filteredContacts) ? filteredContacts : [];

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <ContactSearch />
        <div className="contact-filters">
          <GroupSelector 
            groups={groups || []} 
            selectedGroupId={selectedGroupId} 
            onChange={handleGroupChange} 
            includeAllOption={true}
          />
        </div>
      </div>
      
      {contactsToDisplay.length === 0 ? (
        <div className="empty-state">
          <p>No contacts found. Try adjusting your filters or add a new contact.</p>
          <Button to="/contacts/new" variant="primary">Add Contact</Button>
        </div>
      ) : (
        <div className="contact-grid">
          {contactsToDisplay.map(contact => (
            <ContactCard key={contact._id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
