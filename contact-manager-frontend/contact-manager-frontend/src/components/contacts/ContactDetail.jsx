import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ContactContext } from '../../context/ContactContext';
import { GroupContext } from '../../context/GroupContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { formatPhoneNumber, formatDate, calculateAge } from '../../utils/formatters';
import { FiEdit, FiTrash2, FiUserPlus, FiTag } from 'react-icons/fi';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContact, removeContact, loading, error } = useContext(ContactContext);
  const { groups = [] } = useContext(GroupContext);
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchContactDetails = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const data = await getContact(id, { signal: controller.signal });
        if (isMounted && data) {
          setContact(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // Ignore abort errors
        }
        console.error('Error fetching contact:', err);
        setFetchError('Failed to load contact details');
        setIsLoading(false);
      }
    };
    
    fetchContactDetails();

    return () => {
      controller.abort(); // Cancel pending request
      isMounted = false;
    };
  }, [id]); // Remove getContact from dependencies to prevent re-renders

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact?.firstName || ''} ${contact?.lastName || ''}?`)) {
      try {
        const success = await removeContact(id);
        if (success) {
          navigate('/contacts');
        }
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!contact) return <div className="not-found">Contact not found</div>;

  // Ensure groups is an array
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  const contactGroups = safeGroups.filter(group => 
    contact.groups && Array.isArray(contact.groups) && contact.groups.includes(group._id)
  );

  return (
    <div className="contact-detail">
      <div className="detail-header">
        <Link to="/contacts" className="back-link">← Back to Contacts</Link>
        <div className="detail-actions">
          <Button to={`/contacts/edit/${id}`} variant="primary" icon={<FiEdit />}>
            Edit
          </Button>
          <Button onClick={handleDelete} variant="danger" icon={<FiTrash2 />}>
            Delete
          </Button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-sidebar">
          <div className="contact-avatar">
            <Avatar 
              name={`${contact.firstName || ''} ${contact.lastName || ''}`} 
              src={contact.photo} 
              size="large" 
            />
          </div>
          
          {contactGroups.length > 0 && (
            <div className="contact-detail-groups">
              <h3 className="section-title">
                <FiTag /> Groups
              </h3>
              <div className="groups-list">
                {contactGroups.map(group => (
                  <div 
                    key={group._id} 
                    className="group-tag" 
                    style={{ backgroundColor: group.color || '#e0e0e0' }}
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="detail-main">
          <h1 className="contact-name">{contact.firstName || ''} {contact.lastName || ''}</h1>
          
          <div className="detail-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="info-grid">
              {contact.phoneNumber && (
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <div className="info-value">
                    <a href={`tel:${contact.phoneNumber}`}>
                      {formatPhoneNumber(contact.phoneNumber)}
                    </a>
                  </div>
                </div>
              )}
              
              {contact.email && (
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                </div>
              )}
              
              {contact.address && (
                <div className="info-item">
                  <div className="info-label">Address</div>
                  <div className="info-value">{contact.address}</div>
                </div>
              )}
              {contact.birthDate && (
  <div className="info-item">
    <div className="info-label">Birthday</div>
    <div className="info-value">
      {formatDate(contact.birthDate)}
      {calculateAge(contact.birthDate) !== null && (
        <span className="age-display"> ({calculateAge(contact.birthDate)} ans)</span>
      )}
    </div>
  </div>
)}
              {/* {contact.birthDate && (
                <div className="info-item">
                  <div className="info-label">Birthday</div>
                  <div className="info-value">{formatDate(contact.birthDate)}</div>
                </div>
              )} */}
              
              {contact.createdAt && (
                <div className="info-item">
                  <div className="info-label">Added on</div>
                  <div className="info-value">{formatDate(contact.createdAt)}</div>
                </div>
              )}
            </div>
          </div>
          
          {contact.notes && (
            <div className="detail-section">
              <h3 className="section-title">Notes</h3>
              <div className="notes-content">
                {contact.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;